// Copyright Epic Games, Inc. All Rights Reserved.

#include "FootballPlayerController.h"
#include "FootballPlayerCharacter.h"
#include "FootballBall.h"
#include "Kismet/GameplayStatics.h"
#include "Engine/World.h"

AFootballPlayerController::AFootballPlayerController()
{
	bShowMouseCursor = true;
	bEnableClickEvents = true;
	bEnableMouseOverEvents = true;

	CurrentPowerCharge = 0.0f;
	PowerChargeSpeed = 1.35f; // Fills from 0 to 1 in ~0.75 seconds
	bIsChargingPower = false;
	CurrentChargingAction = EKickActionType::None;

	CurrentCameraMode = ECameraViewMode::WideStadium;
	bIsSubstitutionMenuOpen = false;
	bIsSettingsMenuOpen = false;
}

void AFootballPlayerController::BeginPlay()
{
	Super::BeginPlay();

	// Cache ball
	GameBall = Cast<AFootballBall>(UGameplayStatics::GetActorOfClass(GetWorld(), AFootballBall::StaticClass()));
	ActiveFootballPlayer = Cast<AFootballPlayerCharacter>(GetPawn());
}

void AFootballPlayerController::SetupInputComponent()
{
	Super::SetupInputComponent();

	// Movement
	InputComponent->BindAxis("MoveForward", this, &AFootballPlayerController::MoveForward);
	InputComponent->BindAxis("MoveRight", this, &AFootballPlayerController::MoveRight);

	// Sprint
	InputComponent->BindAction("Sprint", IE_Pressed, this, &AFootballPlayerController::OnSprintPressed);
	InputComponent->BindAction("Sprint", IE_Released, this, &AFootballPlayerController::OnSprintReleased);

	// Slide Tackle (M key)
	InputComponent->BindAction("SlideTackle", IE_Pressed, this, &AFootballPlayerController::OnSlideTacklePressed);

	// Shot (Left Mouse Button)
	InputComponent->BindAction("Shot", IE_Pressed, this, &AFootballPlayerController::OnShotPressed);
	InputComponent->BindAction("Shot", IE_Released, this, &AFootballPlayerController::OnShotReleased);

	// Pass (Right Mouse Button)
	InputComponent->BindAction("Pass", IE_Pressed, this, &AFootballPlayerController::OnPassPressed);
	InputComponent->BindAction("Pass", IE_Released, this, &AFootballPlayerController::OnPassReleased);

	// Through Ball (Q key)
	InputComponent->BindAction("ThroughBall", IE_Pressed, this, &AFootballPlayerController::OnThroughBallPressed);
	InputComponent->BindAction("ThroughBall", IE_Released, this, &AFootballPlayerController::OnThroughBallReleased);

	// Aerial Pass (E key)
	InputComponent->BindAction("AerialPass", IE_Pressed, this, &AFootballPlayerController::OnAerialPassPressed);
	InputComponent->BindAction("AerialPass", IE_Released, this, &AFootballPlayerController::OnAerialPassReleased);

	// Substitution (Z key)
	InputComponent->BindAction("Substitution", IE_Pressed, this, &AFootballPlayerController::OnToggleSubstitution);

	// Settings (ESC key)
	InputComponent->BindAction("Settings", IE_Pressed, this, &AFootballPlayerController::OnToggleSettings);

	// Camera Angle Switch (C or V key)
	InputComponent->BindAction("CameraSwitch", IE_Pressed, this, &AFootballPlayerController::OnCycleCamera);
}

void AFootballPlayerController::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	// Power bar charging progression
	if (bIsChargingPower)
	{
		CurrentPowerCharge = FMath::Clamp(CurrentPowerCharge + PowerChargeSpeed * DeltaTime, 0.0f, 1.0f);
	}

	// Mouse steering for dribbling
	if (ActiveFootballPlayer && ActiveFootballPlayer->bHasBallPossession)
	{
		FVector AimDir = GetMousePitchDirection();
		if (!AimDir.IsNearlyZero())
		{
			FRotator TargetRot = AimDir.Rotation();
			ActiveFootballPlayer->SetActorRotation(FMath::RInterpTo(ActiveFootballPlayer->GetActorRotation(), TargetRot, DeltaTime, 8.0f));
		}
	}

	UpdateCameraPosition(DeltaTime);
}

void AFootballPlayerController::MoveForward(float Value)
{
	if (ActiveFootballPlayer && !bIsSettingsMenuOpen && !bIsSubstitutionMenuOpen)
	{
		ActiveFootballPlayer->AddMovementInput(FVector(1.0f, 0.0f, 0.0f), Value);
	}
}

void AFootballPlayerController::MoveRight(float Value)
{
	if (ActiveFootballPlayer && !bIsSettingsMenuOpen && !bIsSubstitutionMenuOpen)
	{
		ActiveFootballPlayer->AddMovementInput(FVector(0.0f, 1.0f, 0.0f), Value);
	}
}

void AFootballPlayerController::OnSprintPressed()
{
	if (ActiveFootballPlayer)
	{
		ActiveFootballPlayer->StartSprint();
	}
}

void AFootballPlayerController::OnSprintReleased()
{
	if (ActiveFootballPlayer)
	{
		ActiveFootballPlayer->StopSprint();
	}
}

void AFootballPlayerController::OnSlideTacklePressed()
{
	if (ActiveFootballPlayer)
	{
		ActiveFootballPlayer->PerformSlideTackle();
	}
}

void AFootballPlayerController::OnShotPressed()
{
	CurrentChargingAction = EKickActionType::Shot;
	CurrentPowerCharge = 0.0f;
	bIsChargingPower = true;
}

void AFootballPlayerController::OnShotReleased()
{
	if (bIsChargingPower && CurrentChargingAction == EKickActionType::Shot)
	{
		ExecuteChargedKick(EKickActionType::Shot, CurrentPowerCharge);
		bIsChargingPower = false;
		CurrentChargingAction = EKickActionType::None;
		CurrentPowerCharge = 0.0f;
	}
}

void AFootballPlayerController::OnPassPressed()
{
	CurrentChargingAction = EKickActionType::Pass;
	CurrentPowerCharge = 0.0f;
	bIsChargingPower = true;
}

void AFootballPlayerController::OnPassReleased()
{
	if (bIsChargingPower && CurrentChargingAction == EKickActionType::Pass)
	{
		ExecuteChargedKick(EKickActionType::Pass, CurrentPowerCharge);
		bIsChargingPower = false;
		CurrentChargingAction = EKickActionType::None;
		CurrentPowerCharge = 0.0f;
	}
}

void AFootballPlayerController::OnThroughBallPressed()
{
	CurrentChargingAction = EKickActionType::ThroughBall;
	CurrentPowerCharge = 0.0f;
	bIsChargingPower = true;
}

void AFootballPlayerController::OnThroughBallReleased()
{
	if (bIsChargingPower && CurrentChargingAction == EKickActionType::ThroughBall)
	{
		ExecuteChargedKick(EKickActionType::ThroughBall, CurrentPowerCharge);
		bIsChargingPower = false;
		CurrentChargingAction = EKickActionType::None;
		CurrentPowerCharge = 0.0f;
	}
}

void AFootballPlayerController::OnAerialPassPressed()
{
	CurrentChargingAction = EKickActionType::AerialPass;
	CurrentPowerCharge = 0.0f;
	bIsChargingPower = true;
}

void AFootballPlayerController::OnAerialPassReleased()
{
	if (bIsChargingPower && CurrentChargingAction == EKickActionType::AerialPass)
	{
		ExecuteChargedKick(EKickActionType::AerialPass, CurrentPowerCharge);
		bIsChargingPower = false;
		CurrentChargingAction = EKickActionType::None;
		CurrentPowerCharge = 0.0f;
	}
}

void AFootballPlayerController::OnToggleSubstitution()
{
	bIsSubstitutionMenuOpen = !bIsSubstitutionMenuOpen;
}

void AFootballPlayerController::OnToggleSettings()
{
	bIsSettingsMenuOpen = !bIsSettingsMenuOpen;
}

void AFootballPlayerController::OnCycleCamera()
{
	uint8 NextMode = (static_cast<uint8>(CurrentCameraMode) + 1) % 4;
	CurrentCameraMode = static_cast<ECameraViewMode>(NextMode);
}

void AFootballPlayerController::ExecuteChargedKick(EKickActionType ActionType, float ChargeRatio)
{
	if (!ActiveFootballPlayer || !GameBall)
	{
		return;
	}

	FVector AimDir = GetMousePitchDirection();
	if (AimDir.IsNearlyZero())
	{
		AimDir = ActiveFootballPlayer->GetActorForwardVector();
	}

	float ForceMagnitude = 0.0f;
	float VerticalElevation = 0.0f;
	FVector Spin = FVector::ZeroVector;

	switch (ActionType)
	{
	case EKickActionType::Shot:
		// Shots: Powerful forward drive (up to 3200 force), elevation rises with power (0.05 to 0.45)
		ForceMagnitude = FMath::Lerp(1200.0f, 3200.0f, ChargeRatio);
		VerticalElevation = FMath::Lerp(0.05f, 0.48f, ChargeRatio);
		Spin = FVector(0, 0, (ChargeRatio - 0.5f) * 18.0f);
		break;

	case EKickActionType::Pass:
		// Ground pass: Crisp, low trajectory, directed towards teammate
		ForceMagnitude = FMath::Lerp(800.0f, 2200.0f, ChargeRatio);
		VerticalElevation = 0.02f;
		if (AFootballPlayerCharacter* TargetMate = FindBestPassTarget(AimDir, 45.0f))
		{
			AimDir = (TargetMate->GetActorLocation() - ActiveFootballPlayer->GetActorLocation()).GetSafeNormal();
		}
		break;

	case EKickActionType::ThroughBall:
		// Through ball: Weighted into open space ahead of running teammate
		ForceMagnitude = FMath::Lerp(1100.0f, 2600.0f, ChargeRatio);
		VerticalElevation = 0.04f;
		if (AFootballPlayerCharacter* TargetMate = FindBestPassTarget(AimDir, 55.0f))
		{
			FVector LeadPosition = TargetMate->GetActorLocation() + TargetMate->GetVelocity() * 0.8f + AimDir * 400.0f;
			AimDir = (LeadPosition - ActiveFootballPlayer->GetActorLocation()).GetSafeNormal();
		}
		break;

	case EKickActionType::AerialPass:
		// Aerial pass: High arc (elevation up to 0.90) to loft over defending lines
		ForceMagnitude = FMath::Lerp(1000.0f, 2500.0f, ChargeRatio);
		VerticalElevation = FMath::Lerp(0.35f, 0.92f, ChargeRatio);
		break;

	default:
		break;
	}

	ActiveFootballPlayer->ReleaseBallPossession();
	GameBall->ApplyKick(AimDir, ForceMagnitude, VerticalElevation, Spin, ActiveFootballPlayer);
}

AFootballPlayerCharacter* AFootballPlayerController::FindBestPassTarget(FVector AimDirection, float MaxAngleDegrees)
{
	if (!ActiveFootballPlayer)
	{
		return nullptr;
	}

	TArray<AActor*> AllPlayers;
	UGameplayStatics::GetAllActorsOfClass(GetWorld(), AFootballPlayerCharacter::StaticClass(), AllPlayers);

	AFootballPlayerCharacter* BestTarget = nullptr;
	float BestScore = -999.0f;

	for (AActor* Actor : AllPlayers)
	{
		AFootballPlayerCharacter* Player = Cast<AFootballPlayerCharacter>(Actor);
		if (!Player || Player == ActiveFootballPlayer || Player->bIsHomeTeam != ActiveFootballPlayer->bIsHomeTeam)
		{
			continue;
		}

		FVector ToPlayer = (Player->GetActorLocation() - ActiveFootballPlayer->GetActorLocation());
		float Distance = ToPlayer.Size();
		ToPlayer.Normalize();

		float Dot = FVector::DotProduct(AimDirection, ToPlayer);
		float Angle = FMath::RadiansToDegrees(FMath::Acos(FMath::Clamp(Dot, -1.0f, 1.0f)));

		if (Angle <= MaxAngleDegrees && Distance < 4500.0f)
		{
			float Score = Dot * 100.0f - (Distance / 100.0f);
			if (Score > BestScore)
			{
				BestScore = Score;
				BestTarget = Player;
			}
		}
	}

	return BestTarget;
}

void AFootballPlayerController::SwitchToNearestPlayerToBall()
{
	if (!GameBall)
	{
		return;
	}

	TArray<AActor*> AllPlayers;
	UGameplayStatics::GetAllActorsOfClass(GetWorld(), AFootballPlayerCharacter::StaticClass(), AllPlayers);

	AFootballPlayerCharacter* Nearest = nullptr;
	float MinDistSq = MAX_FLT;
	FVector BallPos = GameBall->GetActorLocation();

	for (AActor* Actor : AllPlayers)
	{
		AFootballPlayerCharacter* Player = Cast<AFootballPlayerCharacter>(Actor);
		if (Player && Player->bIsHomeTeam && !Player->bIsGoalkeeper)
		{
			float DistSq = FVector::DistSquared(Player->GetActorLocation(), BallPos);
			if (DistSq < MinDistSq)
			{
				MinDistSq = DistSq;
				Nearest = Player;
			}
		}
	}

	if (Nearest && Nearest != ActiveFootballPlayer)
	{
		Possess(Nearest);
		ActiveFootballPlayer = Nearest;
	}
}

FVector AFootballPlayerController::GetMousePitchDirection() const
{
	FVector WorldLocation, WorldDirection;
	if (const_cast<AFootballPlayerController*>(this)->DeprojectMousePositionToWorld(WorldLocation, WorldDirection))
	{
		// Plane intersection with pitch at Z = 0
		if (FMath::Abs(WorldDirection.Z) > KINDA_SMALL_NUMBER)
		{
			float T = -WorldLocation.Z / WorldDirection.Z;
			FVector HitPoint = WorldLocation + WorldDirection * T;

			if (ActiveFootballPlayer)
			{
				FVector Aim = HitPoint - ActiveFootballPlayer->GetActorLocation();
				Aim.Z = 0.0f;
				return Aim.GetSafeNormal();
			}
		}
	}
	return FVector::ZeroVector;
}

void AFootballPlayerController::UpdateCameraPosition(float DeltaTime)
{
	FVector FocusPoint = ActiveFootballPlayer ? ActiveFootballPlayer->GetActorLocation() : FVector::ZeroVector;
	if (GameBall)
	{
		// Focus smoothly between player and ball
		FocusPoint = FMath::Lerp(FocusPoint, GameBall->GetActorLocation(), 0.35f);
	}

	switch (CurrentCameraMode)
	{
	case ECameraViewMode::WideStadium:
		// Broadcast stadium cam: elevated sideline view
		DesiredCameraLocation = FVector(FocusPoint.X * 0.45f, -3200.0f, 1650.0f);
		DesiredCameraRotation = (FocusPoint - DesiredCameraLocation).Rotation();
		break;

	case ECameraViewMode::BehindPlayer:
		// Close 3rd person behind controlled player
		if (ActiveFootballPlayer)
		{
			FVector BackOffset = -ActiveFootballPlayer->GetActorForwardVector() * 550.0f + FVector(0, 0, 240.0f);
			DesiredCameraLocation = ActiveFootballPlayer->GetActorLocation() + BackOffset;
			DesiredCameraRotation = (FocusPoint + FVector(0, 0, 80.0f) - DesiredCameraLocation).Rotation();
		}
		break;

	case ECameraViewMode::SideTactical:
		// Sideline tactical broadcast view
		DesiredCameraLocation = FVector(FocusPoint.X, -2200.0f, 1100.0f);
		DesiredCameraRotation = (FocusPoint - DesiredCameraLocation).Rotation();
		break;

	case ECameraViewMode::TacticalOverhead:
		// Overhead tactical blimp view
		DesiredCameraLocation = FVector(FocusPoint.X, FocusPoint.Y, 3400.0f);
		DesiredCameraRotation = FRotator(-85.0f, 0.0f, 0.0f);
		break;
	}

	if (PlayerCameraManager)
	{
		SetViewTargetWithBlend(this, 0.0f);
	}
}
