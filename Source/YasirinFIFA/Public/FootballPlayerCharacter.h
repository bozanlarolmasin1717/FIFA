// Copyright Epic Games, Inc. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "FootballPlayerCharacter.generated.h"

UENUM(BlueprintType)
enum class EPlayerCardTier : uint8
{
	Silver      UMETA(DisplayName = "Standard Silver"),
	Gold        UMETA(DisplayName = "Gold"),
	Epic        UMETA(DisplayName = "Epic"),
	Legendary   UMETA(DisplayName = "Legendary")
};

UENUM(BlueprintType)
enum class EPlayerRolePosition : uint8
{
	GK  UMETA(DisplayName = "Goalkeeper"),
	CB  UMETA(DisplayName = "Center Back"),
	LB  UMETA(DisplayName = "Left Back"),
	RB  UMETA(DisplayName = "Right Back"),
	CDM UMETA(DisplayName = "Defensive Midfielder"),
	CM  UMETA(DisplayName = "Central Midfielder"),
	CAM UMETA(DisplayName = "Attacking Midfielder"),
	LW  UMETA(DisplayName = "Left Winger"),
	RW  UMETA(DisplayName = "Right Winger"),
	ST  UMETA(DisplayName = "Striker")
};

USTRUCT(BlueprintType)
struct FPlayerCardStats
{
	GENERATED_BODY()

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	FString PlayerName = "Player";

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	int32 OverallRating = 80;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	EPlayerCardTier CardTier = EPlayerCardTier::Gold;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	EPlayerRolePosition Position = EPlayerRolePosition::CM;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	int32 KitNumber = 10;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	FString Nationality = "Portugal";

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	float HeightCm = 180.0f;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	float WeightKg = 75.0f;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	float Pace = 80.0f;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	float Shooting = 75.0f;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	float Passing = 78.0f;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	float Dribbling = 82.0f;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	float Defending = 65.0f;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	float Physicality = 75.0f;
};

UCLASS()
class YASIRINFIFA_API AFootballPlayerCharacter : public ACharacter
{
	GENERATED_BODY()

public:
	AFootballPlayerCharacter();

protected:
	virtual void BeginPlay() override;

public:	
	virtual void Tick(float DeltaTime) override;

	// Player Card & Physical Identity
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Player Identity")
	FPlayerCardStats PlayerStats;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Player Identity")
	bool bIsHomeTeam;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Player Identity")
	bool bIsGoalkeeper;

	// Conditioning & Stamina System
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Player Conditioning")
	float CurrentStamina;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Player Conditioning")
	float MaxStamina;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Player Conditioning")
	float StaminaDrainRateSprint;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Player Conditioning")
	float StaminaRecoveryRate;

	// Dribbling & Ball Control
	UPROPERTY(BlueprintReadOnly, Category = "Player Dribbling")
	bool bHasBallPossession;

	UPROPERTY(BlueprintReadOnly, Category = "Player Movement")
	bool bIsSprinting;

	UPROPERTY(BlueprintReadOnly, Category = "Player Actions")
	bool bIsTackling;

	UPROPERTY(BlueprintReadOnly, Category = "Player Actions")
	bool bIsCelebrating;

	// Socket or relative offset for ball while dribbling
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Player Dribbling")
	USceneComponent* BallDribbleSocket;

	// Methods
	UFUNCTION(BlueprintCallable, Category = "Player Actions")
	void StartSprint();

	UFUNCTION(BlueprintCallable, Category = "Player Actions")
	void StopSprint();

	UFUNCTION(BlueprintCallable, Category = "Player Actions")
	void PerformSlideTackle();

	UFUNCTION(BlueprintCallable, Category = "Player Actions")
	void TriggerCelebration();

	UFUNCTION(BlueprintCallable, Category = "Player Actions")
	void StopCelebration();

	UFUNCTION(BlueprintCallable, Category = "Player Conditioning")
	void RefreshConditioningOnSub();

	UFUNCTION(BlueprintCallable, Category = "Player Customization")
	void ApplyPhysiologyScale();

	// Ball interaction
	UFUNCTION(BlueprintCallable, Category = "Player Ball Interaction")
	void ClaimBallPossession(class AFootballBall* Ball);

	UFUNCTION(BlueprintCallable, Category = "Player Ball Interaction")
	void ReleaseBallPossession();

	UPROPERTY(BlueprintReadOnly, Category = "Player Ball Interaction")
	class AFootballBall* ControlledBall;

private:
	float SlideTackleTimer;
	float SlideTackleDuration;
	float CelebrationTimer;
};
