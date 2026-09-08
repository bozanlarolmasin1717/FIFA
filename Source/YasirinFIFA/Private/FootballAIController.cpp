// Copyright Epic Games, Inc. All Rights Reserved.

#include "FootballAIController.h"
#include "FootballBall.h"
#include "Kismet/GameplayStatics.h"

AFootballAIController::AFootballAIController()
{
	PrimaryActorTick.bCanEverTick = true;
	FormationBasePosition = FVector::ZeroVector;
	MarkingDistance = 300.0f;
	DecisionTimer = 0.0f;
}

void AFootballAIController::BeginPlay()
{
	Super::BeginPlay();
	ControlledFootballPlayer = Cast<AFootballPlayerCharacter>(GetPawn());
	GameBall = Cast<AFootballBall>(UGameplayStatics::GetActorOfClass(GetWorld(), AFootballBall::StaticClass()));
}

void AFootballAIController::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	if (!ControlledFootballPlayer || !GameBall)
	{
		ControlledFootballPlayer = Cast<AFootballPlayerCharacter>(GetPawn());
		return;
	}

	if (ControlledFootballPlayer->bIsGoalkeeper)
	{
		ExecuteGoalkeeperBehavior(DeltaTime);
	}
	else
	{
		ExecuteOutfieldBehavior(DeltaTime);
	}
}

void AFootballAIController::ExecuteOutfieldBehavior(float DeltaTime)
{
	FVector BallPos = GameBall->GetActorLocation();
	FVector PlayerPos = ControlledFootballPlayer->GetActorLocation();
	float DistToBall = FVector::Dist(PlayerPos, BallPos);

	// If player has ball possession
	if (ControlledFootballPlayer->bHasBallPossession)
	{
		// Advance towards opponent goal
		float TargetGoalX = ControlledFootballPlayer->bIsHomeTeam ? PitchHalfLengthCm : -PitchHalfLengthCm;
		FVector OpponentGoalPos = FVector(TargetGoalX, 0.0f, 0.0f);
		FVector MoveDir = (OpponentGoalPos - PlayerPos).GetSafeNormal();

		ControlledFootballPlayer->AddMovementInput(MoveDir, 1.0f);

		// If within shooting range, take a shot
		float DistToGoal = FVector::Dist(PlayerPos, OpponentGoalPos);
		if (DistToGoal < 2400.0f)
		{
			FVector ShotDir = (OpponentGoalPos + FVector(0, FMath::RandRange(-200.0f, 200.0f), 80.0f) - PlayerPos).GetSafeNormal();
			ControlledFootballPlayer->ReleaseBallPossession();
			GameBall->ApplyKick(ShotDir, FMath::RandRange(2000.0f, 2900.0f), 0.20f, FVector::ZeroVector, ControlledFootballPlayer);
		}
		return;
	}

	// Calculate tactical dynamic position based on ball position and base formation
	FVector DynamicTargetPos = FormationBasePosition;
	// Dynamic shifting with ball movement
	DynamicTargetPos.X += BallPos.X * 0.45f;
	DynamicTargetPos.Y += BallPos.Y * 0.35f;

	// Clamp to pitch
	DynamicTargetPos.X = FMath::Clamp(DynamicTargetPos.X, -PitchHalfLengthCm + 400.0f, PitchHalfLengthCm - 400.0f);
	DynamicTargetPos.Y = FMath::Clamp(DynamicTargetPos.Y, -PitchHalfWidthCm + 300.0f, PitchHalfWidthCm - 300.0f);

	// If ball is very close and uncontested, press to win the ball
	if (DistToBall < 750.0f)
	{
		FVector ToBall = (BallPos - PlayerPos).GetSafeNormal();
		ControlledFootballPlayer->AddMovementInput(ToBall, 1.0f);

		// Ball acquisition
		if (DistToBall < 110.0f)
		{
			ControlledFootballPlayer->ClaimBallPossession(GameBall);
		}
		// Opportunistic slide tackle
		else if (DistToBall < 350.0f && FMath::FRand() < 0.02f)
		{
			ControlledFootballPlayer->PerformSlideTackle();
		}
	}
	else
	{
		// Move towards tactical formation spot
		FVector ToFormation = (DynamicTargetPos - PlayerPos);
		if (ToFormation.Size() > 180.0f)
		{
			ControlledFootballPlayer->AddMovementInput(ToFormation.GetSafeNormal(), 0.75f);
		}
	}
}

void AFootballAIController::ExecuteGoalkeeperBehavior(float DeltaTime)
{
	FVector BallPos = GameBall->GetActorLocation();
	FVector PlayerPos = ControlledFootballPlayer->GetActorLocation();

	float GoalLineX = ControlledFootballPlayer->bIsHomeTeam ? -PitchHalfLengthCm + 120.0f : PitchHalfLengthCm - 120.0f;

	// Track ball along Y axis, clamped between goal posts
	float TargetY = FMath::Clamp(BallPos.Y * 0.65f, -GoalHalfWidthCm + 50.0f, GoalHalfWidthCm - 50.0f);
	FVector DesiredGKPos = FVector(GoalLineX, TargetY, PlayerPos.Z);

	// Slightly advance if ball is close to penalty box
	float DistToGoal = FMath::Abs(BallPos.X - GoalLineX);
	if (DistToGoal < 1800.0f)
	{
		float AdvanceX = ControlledFootballPlayer->bIsHomeTeam ? 250.0f : -250.0f;
		DesiredGKPos.X += AdvanceX;
	}

	FVector MoveDir = (DesiredGKPos - PlayerPos);
	if (MoveDir.Size() > 40.0f)
	{
		ControlledFootballPlayer->AddMovementInput(MoveDir.GetSafeNormal(), 0.85f);
	}

	// Goalkeeper save / catch
	float DistToBall = FVector::Dist(PlayerPos, BallPos);
	if (DistToBall < 160.0f)
	{
		ControlledFootballPlayer->ClaimBallPossession(GameBall);
		// Punt ball back upfield after catching
		FTimerHandle PuntTimer;
		GetWorld()->GetTimerManager().SetTimer(PuntTimer, [this]()
		{
			if (ControlledFootballPlayer && ControlledFootballPlayer->bHasBallPossession && GameBall)
			{
				FVector PuntDir = ControlledFootballPlayer->bIsHomeTeam ? FVector(1.0f, 0.0f, 0.5f) : FVector(-1.0f, 0.0f, 0.5f);
				ControlledFootballPlayer->ReleaseBallPossession();
				GameBall->ApplyKick(PuntDir.GetSafeNormal(), 2200.0f, 0.45f, FVector::ZeroVector, ControlledFootballPlayer);
			}
		}, 1.2f, false);
	}
}
