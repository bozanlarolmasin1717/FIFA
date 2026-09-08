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

AFootballPlayerCharacter* AFootballAIController::FindBestPassTarget()
{
	if (!ControlledFootballPlayer || !GetWorld()) return nullptr;

	TArray<AActor*> FoundPlayers;
	UGameplayStatics::GetAllActorsOfClass(GetWorld(), AFootballPlayerCharacter::StaticClass(), FoundPlayers);

	AFootballPlayerCharacter* BestTarget = nullptr;
	float BestScore = -9999.0f;
	FVector PlayerPos = ControlledFootballPlayer->GetActorLocation();

	for (AActor* Actor : FoundPlayers)
	{
		AFootballPlayerCharacter* Teammate = Cast<AFootballPlayerCharacter>(Actor);
		if (!Teammate || Teammate == ControlledFootballPlayer || Teammate->bIsGoalkeeper) continue;
		if (Teammate->bIsHomeTeam != ControlledFootballPlayer->bIsHomeTeam) continue;

		FVector TeammatePos = Teammate->GetActorLocation();
		float Dist = FVector::Dist(PlayerPos, TeammatePos);
		if (Dist < 400.0f || Dist > 3800.0f) continue;

		float ForwardProgress = ControlledFootballPlayer->bIsHomeTeam ? (TeammatePos.X - PlayerPos.X) : (PlayerPos.X - TeammatePos.X);

		float ClosestOpponentDist = 9999.0f;
		for (AActor* OpponentActor : FoundPlayers)
		{
			AFootballPlayerCharacter* Opponent = Cast<AFootballPlayerCharacter>(OpponentActor);
			if (!Opponent || Opponent->bIsHomeTeam == ControlledFootballPlayer->bIsHomeTeam) continue;
			float OppDist = FVector::Dist(TeammatePos, Opponent->GetActorLocation());
			if (OppDist < ClosestOpponentDist) ClosestOpponentDist = OppDist;
		}

		float OpennessScore = FMath::Min(ClosestOpponentDist, 1000.0f);
		float Score = ForwardProgress * 0.8f + OpennessScore * 0.6f - FMath::Abs(Dist - 1600.0f) * 0.2f;

		if (Score > BestScore && ClosestOpponentDist > 300.0f)
		{
			BestScore = Score;
			BestTarget = Teammate;
		}
	}

	return BestTarget;
}

void AFootballAIController::ExecuteAIPass(AFootballPlayerCharacter* TargetTeammate)
{
	if (!ControlledFootballPlayer || !TargetTeammate || !GameBall) return;

	FVector PasserPos = ControlledFootballPlayer->GetActorLocation();
	FVector TargetPos = TargetTeammate->GetActorLocation();

	float LeadX = ControlledFootballPlayer->bIsHomeTeam ? 250.0f : -250.0f;
	FVector PassSpot = TargetPos + FVector(LeadX, FMath::RandRange(-80.0f, 80.0f), 0.0f);

	FVector PassDir = (PassSpot - PasserPos).GetSafeNormal();
	float Dist = FVector::Dist(PasserPos, PassSpot);
	float PassForce = FMath::Clamp(Dist * 0.85f + 1200.0f, 1500.0f, 3200.0f);

	ControlledFootballPlayer->ReleaseBallPossession();
	GameBall->ApplyKick(PassDir, PassForce, 0.08f, FVector::ZeroVector, ControlledFootballPlayer);
}

void AFootballAIController::ExecuteOutfieldBehavior(float DeltaTime)
{
	FVector BallPos = GameBall->GetActorLocation();
	FVector PlayerPos = ControlledFootballPlayer->GetActorLocation();
	float DistToBall = FVector::Dist(PlayerPos, BallPos);

	float TargetGoalX = ControlledFootballPlayer->bIsHomeTeam ? PitchHalfLengthCm : -PitchHalfLengthCm;
	FVector OpponentGoalPos = FVector(TargetGoalX, 0.0f, 0.0f);
	float DistToGoal = FVector::Dist(PlayerPos, OpponentGoalPos);

	// If player has ball possession
	if (ControlledFootballPlayer->bHasBallPossession)
	{
		// 1. Shoot if in range
		if (DistToGoal < 2600.0f)
		{
			float TargetY = (FMath::FRand() < 0.5f ? 1.0f : -1.0f) * FMath::RandRange(150.0f, GoalHalfWidthCm - 50.0f);
			float TargetZ = FMath::RandRange(40.0f, 200.0f);
			FVector ShotTarget = FVector(TargetGoalX, TargetY, TargetZ);

			FVector ShotDir = (ShotTarget - PlayerPos).GetSafeNormal();
			float ShotForce = FMath::RandRange(2400.0f, 3200.0f);
			FVector CurveSpin = FVector(0.0f, TargetY > 0.0f ? 80.0f : -80.0f, 0.0f);

			ControlledFootballPlayer->ReleaseBallPossession();
			GameBall->ApplyKick(ShotDir, ShotForce, 0.18f, CurveSpin, ControlledFootballPlayer);
			return;
		}

		// 2. Scan for pass opportunity if under pressure or building up play
		bool bShouldPass = (FMath::FRand() < 0.03f) || (DistToGoal > 3500.0f && FMath::FRand() < 0.05f);
		if (bShouldPass)
		{
			AFootballPlayerCharacter* PassTarget = FindBestPassTarget();
			if (PassTarget)
			{
				ExecuteAIPass(PassTarget);
				return;
			}
		}

		// 3. Dribble towards opponent goal
		FVector MoveDir = (OpponentGoalPos - PlayerPos).GetSafeNormal();
		ControlledFootballPlayer->AddMovementInput(MoveDir, 1.0f);
		return;
	}

	// Calculate tactical dynamic position based on ball position and base formation
	FVector DynamicTargetPos = FormationBasePosition;
	DynamicTargetPos.X += BallPos.X * 0.45f;
	DynamicTargetPos.Y += BallPos.Y * 0.35f;

	// Make offensive runs when team has ball
	if (ControlledFootballPlayer->bIsHomeTeam == (BallPos.X < 0.0f))
	{
		float OffensiveRunOffset = ControlledFootballPlayer->bIsHomeTeam ? 600.0f : -600.0f;
		DynamicTargetPos.X += OffensiveRunOffset;
	}

	// Clamp to pitch
	DynamicTargetPos.X = FMath::Clamp(DynamicTargetPos.X, -PitchHalfLengthCm + 400.0f, PitchHalfLengthCm - 400.0f);
	DynamicTargetPos.Y = FMath::Clamp(DynamicTargetPos.Y, -PitchHalfWidthCm + 300.0f, PitchHalfWidthCm - 300.0f);

	// Press if ball is close
	if (DistToBall < 850.0f)
	{
		FVector ToBall = (BallPos - PlayerPos).GetSafeNormal();
		ControlledFootballPlayer->AddMovementInput(ToBall, 1.0f);

		if (DistToBall < 110.0f)
		{
			ControlledFootballPlayer->ClaimBallPossession(GameBall);
		}
		else if (DistToBall < 350.0f && FMath::FRand() < 0.02f)
		{
			ControlledFootballPlayer->PerformSlideTackle();
		}
	}
	else
	{
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
