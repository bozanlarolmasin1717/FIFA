// Copyright Epic Games, Inc. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/GameModeBase.h"
#include "FootballPlayerCharacter.h"
#include "FootballGameMode.generated.h"

UENUM(BlueprintType)
enum class EMatchStateFIFA : uint8
{
	PreMatch,
	FirstHalf,
	Halftime,
	SecondHalf,
	FullTime,
	GoalCelebration
};

UENUM(BlueprintType)
enum class EGraphicsQualityPreset : uint8
{
	Low,
	Medium,
	High
};

DECLARE_DYNAMIC_MULTICAST_DELEGATE_FourParams(FOnMatchScoreUpdated, int32, HomeScore, int32, AwayScore, float, MatchMinute, EMatchStateFIFA, CurrentState);

UCLASS()
class YASIRINFIFA_API AYasirinFIFAGameModeBase : public AGameModeBase
{
	GENERATED_BODY()

public:
	AYasirinFIFAGameModeBase();

protected:
	virtual void BeginPlay() override;

public:
	virtual void Tick(float DeltaTime) override;

	// Current Match State
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Match Flow")
	EMatchStateFIFA MatchState;

	// Scores
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Match Score")
	int32 HomeScore;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Match Score")
	int32 AwayScore;

	// Match Clock (Scaled: 45 min half takes e.g. 4.5 real minutes)
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Match Clock")
	float CurrentMatchMinute;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Match Clock")
	float GameTimeSpeedMultiplier;

	// Squad Rosters (11 starters + bench)
	UPROPERTY(BlueprintReadOnly, Category = "Squad")
	TArray<AFootballPlayerCharacter*> HomeTeamStarters;

	UPROPERTY(BlueprintReadOnly, Category = "Squad")
	TArray<AFootballPlayerCharacter*> AwayTeamStarters;

	UPROPERTY(BlueprintReadOnly, Category = "Squad")
	TArray<FPlayerCardStats> HomeBenchRoster;

	UPROPERTY(BlueprintReadOnly, Category = "Squad")
	TArray<FPlayerCardStats> AwayBenchRoster;

	// Score update delegate
	UPROPERTY(BlueprintAssignable, Category = "Match Events")
	FOnMatchScoreUpdated OnScoreUpdated;

	// Handlers
	UFUNCTION(BlueprintCallable, Category = "Match Flow")
	void HandleGoalScored(bool bIsHomeGoal, float ShotSpeedKmh);

	UFUNCTION(BlueprintCallable, Category = "Match Flow")
	void StartKickoff(bool bHomeKicks);

	UFUNCTION(BlueprintCallable, Category = "Match Flow")
	void TriggerHalftime();

	UFUNCTION(BlueprintCallable, Category = "Match Flow")
	void ResumeSecondHalf();

	// Substitutions
	UFUNCTION(BlueprintCallable, Category = "Substitutions")
	bool SubstitutePlayer(AFootballPlayerCharacter* OutgoingPlayer, FPlayerCardStats IncomingStats);

	// Graphics quality
	UFUNCTION(BlueprintCallable, Category = "Settings")
	void SetGraphicsQualityPreset(EGraphicsQualityPreset Preset);

	// Ball reference
	UPROPERTY(BlueprintReadOnly, Category = "References")
	class AFootballBall* BallInstance;

	// Stadium reference
	UPROPERTY(BlueprintReadOnly, Category = "References")
	class AFootballStadiumActor* StadiumInstance;

private:
	void SpawnTeams11v11();
	void SetupDefaultSquadStats();

	float GoalCelebrationTimer;
	bool bIsRestartingKickoff;
};
