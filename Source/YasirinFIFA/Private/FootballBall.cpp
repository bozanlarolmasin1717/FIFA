// Copyright Epic Games, Inc. All Rights Reserved.

#include "FootballBall.h"
#include "FootballPlayerCharacter.h"
#include "Kismet/GameplayStatics.h"

AFootballBall::AFootballBall()
{
	PrimaryActorTick.bCanEverTick = true;

	SphereComp = CreateDefaultSubobject<USphereComponent>(TEXT("SphereComp"));
	SphereComp->InitSphereRadius(22.0f); // 22cm diameter standard size 5 football radius ~ 11cm, scaled slightly for collision stability
	SphereComp->SetSimulatePhysics(true);
	SphereComp->SetEnableGravity(true);
	SphereComp->SetCollisionEnabled(ECollisionEnabled::QueryAndPhysics);
	SphereComp->SetCollisionObjectType(ECC_PhysicsBody);
	SphereComp->SetCollisionResponseToAllChannels(ECR_Block);
	SphereComp->SetCollisionResponseToChannel(ECC_Camera, ECR_Ignore);
	SphereComp->SetLinearDamping(0.35f);
	SphereComp->SetAngularDamping(0.8f);
	SphereComp->SetMassOverrideInKg(NAME_None, 0.43f, true); // Official ball weight ~430g
	RootComponent = SphereComp;

	BallMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("BallMesh"));
	BallMesh->SetupAttachment(SphereComp);
	BallMesh->SetCollisionEnabled(ECollisionEnabled::NoCollision);

	MassKg = 0.43f;
	RollingFriction = 0.85f;
	RestitutionBounce = 0.72f;
	AirDragCoefficient = 0.002f;
	MagnusLiftScale = 0.00015f;
	AngularSpin = FVector::ZeroVector;
	bGoalRegistered = false;
	LastKicker = nullptr;
}

void AFootballBall::BeginPlay()
{
	Super::BeginPlay();
	SphereComp->OnComponentHit.AddDynamic(this, &AFootballBall::OnBallHit);
}

void AFootballBall::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	if (!SphereComp || !SphereComp->IsSimulatingPhysics())
	{
		return;
	}

	FVector Velocity = SphereComp->GetPhysicsLinearVelocity();

	// Aerodynamic air drag & Magnus effect curve
	if (!AngularSpin.IsNearlyZero() && Velocity.SizeSquared() > 100.0f)
	{
		// Magnus force: F_m = S * (omega x v)
		FVector MagnusForce = FVector::CrossProduct(AngularSpin, Velocity) * MagnusLiftScale;
		SphereComp->AddForce(MagnusForce, NAME_None, true);

		// Gradual spin decay
		AngularSpin = FMath::VInterpTo(AngularSpin, FVector::ZeroVector, DeltaTime, 1.5f);
	}

	// Goal detection checks
	FVector BallPos = GetActorLocation();

	if (!bGoalRegistered)
	{
		// Away Goal check (Home team scores if ball crosses PitchHalfLength into positive X)
		if (BallPos.X > PitchHalfLengthCm && FMath::Abs(BallPos.Y) < GoalHalfWidthCm && BallPos.Z < GoalHeightCm)
		{
			bGoalRegistered = true;
			float Speed = GetVelocityKmh();
			OnGoalScored.Broadcast(true, Speed);
		}
		// Home Goal check (Away team scores if ball crosses -PitchHalfLength into negative X)
		else if (BallPos.X < -PitchHalfLengthCm && FMath::Abs(BallPos.Y) < GoalHalfWidthCm && BallPos.Z < GoalHeightCm)
		{
			bGoalRegistered = true;
			float Speed = GetVelocityKmh();
			OnGoalScored.Broadcast(false, Speed);
		}
	}
}

void AFootballBall::ApplyKick(FVector Direction, float ForceMagnitude, float VerticalElevation, FVector Spin, AFootballPlayerCharacter* Kicker)
{
	if (!SphereComp)
	{
		return;
	}

	LastKicker = Kicker;
	AngularSpin = Spin;

	Direction.Normalize();
	FVector ImpulseDir = Direction;
	ImpulseDir.Z += FMath::Clamp(VerticalElevation, 0.0f, 1.5f);
	ImpulseDir.Normalize();

	FVector Impulse = ImpulseDir * ForceMagnitude;
	SphereComp->SetPhysicsLinearVelocity(FVector::ZeroVector);
	SphereComp->AddImpulse(Impulse, NAME_None, true);
}

float AFootballBall::GetVelocityKmh() const
{
	if (!SphereComp)
	{
		return 0.0f;
	}
	// cm/s to km/h = (cm/s / 100) * 3.6 = cm/s * 0.036
	return SphereComp->GetPhysicsLinearVelocity().Size() * 0.036f;
}

void AFootballBall::ResetBall(FVector NewLocation)
{
	bGoalRegistered = false;
	AngularSpin = FVector::ZeroVector;
	LastKicker = nullptr;

	if (SphereComp)
	{
		SphereComp->SetPhysicsLinearVelocity(FVector::ZeroVector);
		SphereComp->SetPhysicsAngularVelocityInDegrees(FVector::ZeroVector);
		SetActorLocation(NewLocation);
	}
}

void AFootballBall::OnBallHit(UPrimitiveComponent* HitComponent, AActor* OtherActor, UPrimitiveComponent* OtherComp, FVector NormalImpulse, const FHitResult& Hit)
{
	// Sound effects or bounce deceleration
}
