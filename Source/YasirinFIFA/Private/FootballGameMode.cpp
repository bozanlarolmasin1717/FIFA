// Copyright Epic Games, Inc. All Rights Reserved.

#include "FootballGameMode.h"
#include "FootballPlayerController.h"
#include "FootballBall.h"
#include "FootballStadiumActor.h"
#include "FootballAIController.h"
#include "Kismet/GameplayStatics.h"

AYasirinFIFAGameModeBase::AYasirinFIFAGameModeBase()
{
	PrimaryActorTick.bCanEverTick = true;

	DefaultPawnClass = AFootballPlayerCharacter::StaticClass();
	PlayerControllerClass = AFootballPlayerController::StaticClass();

	MatchState = EMatchStateFIFA::PreMatch;
	HomeScore = 0;
	AwayScore = 0;
	CurrentMatchMinute = 0.0f;
	GameTimeSpeedMultiplier = 10.0f; // 1 real second = 10 in-game seconds (45 min half = 4.5 real minutes)
	GoalCelebrationTimer = 0.0f;
	bIsRestartingKickoff = false;

	SetupDefaultSquadStats();
}

void AYasirinFIFAGameModeBase::BeginPlay()
{
	Super::BeginPlay();

	BallInstance = Cast<AFootballBall>(UGameplayStatics::GetActorOfClass(GetWorld(), AFootballBall::StaticClass()));
	StadiumInstance = Cast<AFootballStadiumActor>(UGameplayStatics::GetActorOfClass(GetWorld(), AFootballStadiumActor::StaticClass()));

	if (BallInstance)
	{
		BallInstance->OnGoalScored.AddDynamic(this, &AYasirinFIFAGameModeBase::HandleGoalScored);
	}

	MatchState = EMatchStateFIFA::FirstHalf;
	StartKickoff(true);
}

void AYasirinFIFAGameModeBase::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	// Clock progression
	if (MatchState == EMatchStateFIFA::FirstHalf)
	{
		CurrentMatchMinute += (DeltaTime / 60.0f) * GameTimeSpeedMultiplier;
		if (CurrentMatchMinute >= 45.0f)
		{
			TriggerHalftime();
		}
	}
	else if (MatchState == EMatchStateFIFA::SecondHalf)
	{
		CurrentMatchMinute += (DeltaTime / 60.0f) * GameTimeSpeedMultiplier;
		if (CurrentMatchMinute >= 90.0f)
		{
			MatchState = EMatchStateFIFA::FullTime;
		}
	}

	// Goal celebration timer
	if (MatchState == EMatchStateFIFA::GoalCelebration)
	{
		GoalCelebrationTimer -= DeltaTime;
		if (GoalCelebrationTimer <= 0.0f)
		{
			// Reset for kickoff
			MatchState = (CurrentMatchMinute < 45.0f) ? EMatchStateFIFA::FirstHalf : EMatchStateFIFA::SecondHalf;
			StartKickoff(false);
		}
	}
}

void AYasirinFIFAGameModeBase::HandleGoalScored(bool bIsHomeGoal, float ShotSpeedKmh)
{
	if (MatchState == EMatchStateFIFA::GoalCelebration)
	{
		return;
	}

	if (bIsHomeGoal)
	{
		HomeScore++;
	}
	else
	{
		AwayScore++;
	}

	MatchState = EMatchStateFIFA::GoalCelebration;
	GoalCelebrationTimer = 4.0f;

	if (StadiumInstance)
	{
		StadiumInstance->PlayGoalRoar();
	}

	// Trigger celebration on the scorer
	if (BallInstance && BallInstance->LastKicker)
	{
		BallInstance->LastKicker->TriggerCelebration();
	}

	OnScoreUpdated.Broadcast(HomeScore, AwayScore, CurrentMatchMinute, MatchState);
}

void AYasirinFIFAGameModeBase::StartKickoff(bool bHomeKicks)
{
	if (BallInstance)
	{
		// Center spot coordinates
		BallInstance->ResetBall(FVector(0.0f, 0.0f, 25.0f));
	}
	OnScoreUpdated.Broadcast(HomeScore, AwayScore, CurrentMatchMinute, MatchState);
}

void AYasirinFIFAGameModeBase::TriggerHalftime()
{
	MatchState = EMatchStateFIFA::Halftime;
	CurrentMatchMinute = 45.0f;
	OnScoreUpdated.Broadcast(HomeScore, AwayScore, CurrentMatchMinute, MatchState);
}

void AYasirinFIFAGameModeBase::ResumeSecondHalf()
{
	if (MatchState == EMatchStateFIFA::Halftime)
	{
		MatchState = EMatchStateFIFA::SecondHalf;
		StartKickoff(false);
	}
}

bool AYasirinFIFAGameModeBase::SubstitutePlayer(AFootballPlayerCharacter* OutgoingPlayer, FPlayerCardStats IncomingStats)
{
	if (!OutgoingPlayer)
	{
		return false;
	}

	OutgoingPlayer->PlayerStats = IncomingStats;
	OutgoingPlayer->ApplyPhysiologyScale();
	OutgoingPlayer->RefreshConditioningOnSub();
	return true;
}

void AYasirinFIFAGameModeBase::SetGraphicsQualityPreset(EGraphicsQualityPreset Preset)
{
	IConsoleVariable* ScreenPercentageCVar = IConsoleManager::Get().FindConsoleVariable(TEXT("r.ScreenPercentage"));
	IConsoleVariable* ShadowQualityCVar = IConsoleManager::Get().FindConsoleVariable(TEXT("sg.ShadowQuality"));
	IConsoleVariable* PostProcessQualityCVar = IConsoleManager::Get().FindConsoleVariable(TEXT("sg.PostProcessQuality"));

	switch (Preset)
	{
	case EGraphicsQualityPreset::Low:
		if (ScreenPercentageCVar) ScreenPercentageCVar->Set(75);
		if (ShadowQualityCVar) ShadowQualityCVar->Set(1);
		if (PostProcessQualityCVar) PostProcessQualityCVar->Set(1);
		break;

	case EGraphicsQualityPreset::Medium:
		if (ScreenPercentageCVar) ScreenPercentageCVar->Set(100);
		if (ShadowQualityCVar) ShadowQualityCVar->Set(2);
		if (PostProcessQualityCVar) PostProcessQualityCVar->Set(2);
		break;

	case EGraphicsQualityPreset::High:
		if (ScreenPercentageCVar) ScreenPercentageCVar->Set(100);
		if (ShadowQualityCVar) ShadowQualityCVar->Set(3);
		if (PostProcessQualityCVar) PostProcessQualityCVar->Set(3);
		break;
	}
}

void AYasirinFIFAGameModeBase::SetupDefaultSquadStats()
{
	// Cristiano Ronaldo (Legendary Tier)
	FPlayerCardStats RonaldoCard;
	RonaldoCard.PlayerName = "C. Ronaldo";
	RonaldoCard.OverallRating = 94;
	RonaldoCard.CardTier = EPlayerCardTier::Legendary;
	RonaldoCard.Position = EPlayerRolePosition::ST;
	RonaldoCard.KitNumber = 7;
	RonaldoCard.Nationality = "Portugal";
	RonaldoCard.HeightCm = 187.0f;
	RonaldoCard.WeightKg = 83.0f;
	RonaldoCard.Pace = 92.0f;
	RonaldoCard.Shooting = 95.0f;
	RonaldoCard.Passing = 82.0f;
	RonaldoCard.Dribbling = 88.0f;
	RonaldoCard.Defending = 38.0f;
	RonaldoCard.Physicality = 88.0f;

	// Lionel Messi (Legendary Tier)
	FPlayerCardStats MessiCard;
	MessiCard.PlayerName = "L. Messi";
	MessiCard.OverallRating = 94;
	MessiCard.CardTier = EPlayerCardTier::Legendary;
	MessiCard.Position = EPlayerRolePosition::RW;
	MessiCard.KitNumber = 10;
	MessiCard.Nationality = "Argentina";
	MessiCard.HeightCm = 170.0f;
	MessiCard.WeightKg = 72.0f;
	MessiCard.Pace = 89.0f;
	MessiCard.Shooting = 93.0f;
	MessiCard.Passing = 94.0f;
	MessiCard.Dribbling = 96.0f;
	MessiCard.Defending = 35.0f;
	MessiCard.Physicality = 68.0f;

	HomeBenchRoster.Add(RonaldoCard);
	AwayBenchRoster.Add(MessiCard);
}
