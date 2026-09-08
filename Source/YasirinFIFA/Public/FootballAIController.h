// Copyright Epic Games, Inc. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "AIController.h"
#include "FootballPlayerCharacter.h"
#include "FootballAIController.generated.h"

UCLASS()
class YASIRINFIFA_API AFootballAIController : public AAIController
{
	GENERATED_BODY()

public:
	AFootballAIController();

protected:
	virtual void BeginPlay() override;

public:
	virtual void Tick(float DeltaTime) override;

	UPROPERTY(BlueprintReadOnly, Category = "AI Football")
	AFootballPlayerCharacter* ControlledFootballPlayer;

	UPROPERTY(BlueprintReadOnly, Category = "AI Football")
	class AFootballBall* GameBall;

	// Base formation home anchor coordinates (pitch X and Y)
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "AI Tactics")
	FVector FormationBasePosition;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "AI Tactics")
	float MarkingDistance;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "AI Tactics")
	float DecisionTimer;

private:
	void ExecuteOutfieldBehavior(float DeltaTime);
	void ExecuteGoalkeeperBehavior(float DeltaTime);

	// Pitch boundaries
	const float PitchHalfLengthCm = 5250.0f;
	const float PitchHalfWidthCm = 3400.0f;
	const float GoalHalfWidthCm = 366.0f;
};
