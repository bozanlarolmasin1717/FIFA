// Copyright Epic Games, Inc. All Rights Reserved.

#include "FootballPlayerCharacter.h"
#include "FootballBall.h"
#include "GameFramework/CharacterMovementComponent.h"
#include "Components/CapsuleComponent.h"

AFootballPlayerCharacter::AFootballPlayerCharacter()
{
	PrimaryActorTick.bCanEverTick = true;

	GetCapsuleComponent()->InitCapsuleSize(38.0f, 90.0f);
	GetCapsuleComponent()->SetCollisionResponseToChannel(ECC_Camera, ECR_Ignore);

	bUseControllerRotationPitch = false;
	bUseControllerRotationYaw = false;
	bUseControllerRotationRoll = false;

	GetCharacterMovement()->bOrientRotationToMovement = true;
	GetCharacterMovement()->RotationRate = FRotator(0.0f, 720.0f, 0.0f);
	GetCharacterMovement()->MaxWalkSpeed = 520.0f; // Jogging pace
	GetCharacterMovement()->BrakingDecelerationWalking = 2000.0f;

	BallDribbleSocket = CreateDefaultSubobject<USceneComponent>(TEXT("BallDribbleSocket"));
	BallDribbleSocket->SetupAttachment(RootComponent);
	BallDribbleSocket->SetRelativeLocation(FVector(65.0f, 0.0f, -80.0f));

	MaxStamina = 100.0f;
	CurrentStamina = 100.0f;
	StaminaDrainRateSprint = 12.0f;
	StaminaRecoveryRate = 4.0f;

	bIsHomeTeam = true;
	bIsGoalkeeper = false;
	bHasBallPossession = false;
	bIsSprinting = false;
	bIsTackling = false;
	bIsCelebrating = false;
	ControlledBall = nullptr;

	SlideTackleTimer = 0.0f;
	SlideTackleDuration = 0.85f;
	CelebrationTimer = 0.0f;
}

void AFootballPlayerCharacter::BeginPlay()
{
	Super::BeginPlay();
	ApplyPhysiologyScale();
}

void AFootballPlayerCharacter::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	// Stamina conditioning update
	if (bIsSprinting && GetVelocity().SizeSquared() > 100.0f)
	{
		CurrentStamina = FMath::Clamp(CurrentStamina - StaminaDrainRateSprint * DeltaTime, 0.0f, MaxStamina);
		if (CurrentStamina <= 5.0f)
		{
			StopSprint();
		}
	}
	else
	{
		CurrentStamina = FMath::Clamp(CurrentStamina + StaminaRecoveryRate * DeltaTime, 0.0f, MaxStamina);
	}

	// Dynamic speed based on stamina condition
	float FatigueFactor = FMath::Lerp(0.70f, 1.0f, CurrentStamina / MaxStamina);
	float BaseSpeed = bIsSprinting ? 820.0f : 520.0f;
	// Boost speed based on player pace stat
	float PaceMultiplier = FMath::Lerp(0.85f, 1.15f, PlayerStats.Pace / 100.0f);
	GetCharacterMovement()->MaxWalkSpeed = BaseSpeed * FatigueFactor * PaceMultiplier;

	// Dribble physics: smoothly pull ball with player
	if (bHasBallPossession && ControlledBall)
	{
		FVector TargetPos = BallDribbleSocket->GetComponentLocation();
		FVector BallPos = ControlledBall->GetActorLocation();
		FVector DribbleOffset = TargetPos - BallPos;

		if (DribbleOffset.Size() > 160.0f)
		{
			// Ball got tackled or knocked away
			ReleaseBallPossession();
		}
		else if (ControlledBall->SphereComp)
		{
			FVector DribbleVelocity = DribbleOffset * 14.0f;
			ControlledBall->SphereComp->SetPhysicsLinearVelocity(DribbleVelocity);
		}
	}

	// Slide tackle state update
	if (bIsTackling)
	{
		SlideTackleTimer -= DeltaTime;
		if (SlideTackleTimer <= 0.0f)
		{
			bIsTackling = false;
			GetCharacterMovement()->SetMovementMode(MOVE_Walking);
		}
	}

	// Goal celebration state update
	if (bIsCelebrating)
	{
		CelebrationTimer -= DeltaTime;
		if (CelebrationTimer <= 0.0f)
		{
			StopCelebration();
		}
	}
}

void AFootballPlayerCharacter::StartSprint()
{
	if (CurrentStamina > 10.0f)
	{
		bIsSprinting = true;
	}
}

void AFootballPlayerCharacter::StopSprint()
{
	bIsSprinting = false;
}

void AFootballPlayerCharacter::PerformSlideTackle()
{
	if (bIsTackling || bHasBallPossession)
	{
		return;
	}

	bIsTackling = true;
	SlideTackleTimer = SlideTackleDuration;
	CurrentStamina = FMath::Clamp(CurrentStamina - 15.0f, 0.0f, MaxStamina);

	// Propel player forward on the grass
	FVector ForwardDir = GetActorForwardVector();
	LaunchCharacter(ForwardDir * 900.0f, true, false);

	// Check for ball collision during tackle
	if (ControlledBall == nullptr)
	{
		TArray<FHitResult> HitResults;
		FVector StartPos = GetActorLocation();
		FVector EndPos = StartPos + ForwardDir * 180.0f;
		FCollisionShape SweepShape = FCollisionShape::MakeSphere(50.0f);

		FCollisionQueryParams Params;
		Params.AddIgnoredActor(this);

		if (GetWorld()->SweepMultiByChannel(HitResults, StartPos, EndPos, FQuat::Identity, ECC_PhysicsBody, SweepShape, Params))
		{
			for (const FHitResult& Hit : HitResults)
			{
				if (AFootballBall* Ball = Cast<AFootballBall>(Hit.GetActor()))
				{
					// Tackle kicks the ball loose
					FVector TackleKick = (ForwardDir + FVector(0, 0, 0.3f)).GetSafeNormal() * 1200.0f;
					Ball->ApplyKick(TackleKick, 1200.0f, 0.3f, FVector::ZeroVector, this);
					break;
				}
			}
		}
	}
}

void AFootballPlayerCharacter::TriggerCelebration()
{
	bIsCelebrating = true;
	CelebrationTimer = 4.5f;
	ReleaseBallPossession();
}

void AFootballPlayerCharacter::StopCelebration()
{
	bIsCelebrating = false;
}

void AFootballPlayerCharacter::RefreshConditioningOnSub()
{
	CurrentStamina = MaxStamina;
	bIsSprinting = false;
	bIsTackling = false;
}

void AFootballPlayerCharacter::ApplyPhysiologyScale()
{
	// Height scaling: reference is 180cm -> 1.0f
	float HeightScale = FMath::Clamp(PlayerStats.HeightCm / 180.0f, 0.85f, 1.20f);
	// Weight / build thickness scaling: reference is 75kg -> 1.0f
	float WeightScale = FMath::Clamp(PlayerStats.WeightKg / 75.0f, 0.85f, 1.25f);

	FVector PhysiologyScale = FVector(WeightScale, WeightScale, HeightScale);
	SetActorScale3D(PhysiologyScale);
}

void AFootballPlayerCharacter::ClaimBallPossession(AFootballBall* Ball)
{
	if (!Ball)
	{
		return;
	}
	ControlledBall = Ball;
	bHasBallPossession = true;
}

void AFootballPlayerCharacter::ReleaseBallPossession()
{
	bHasBallPossession = false;
	ControlledBall = nullptr;
}
