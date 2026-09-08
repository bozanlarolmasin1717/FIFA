// Copyright Epic Games, Inc. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/PlayerController.h"
#include "FootballPlayerController.generated.h"

UENUM(BlueprintType)
enum class EKickActionType : uint8
{
	None,
	Shot,
	Pass,
	ThroughBall,
	AerialPass
};

UENUM(BlueprintType)
enum class ECameraViewMode : uint8
{
	WideStadium,
	BehindPlayer,
	SideTactical,
	TacticalOverhead
};

UCLASS()
class YASIRINFIFA_API AFootballPlayerController : public APlayerController
{
	GENERATED_BODY()

public:
	AFootballPlayerController();

protected:
	virtual void BeginPlay() override;
	virtual void SetupInputComponent() override;

public:
	virtual void Tick(float DeltaTime) override;

	// Controlled Football Character
	UPROPERTY(BlueprintReadOnly, Category = "Player Control")
	class AFootballPlayerCharacter* ActiveFootballPlayer;

	// Ball reference
	UPROPERTY(BlueprintReadOnly, Category = "Player Control")
	class AFootballBall* GameBall;

	// Unified Power Bar Mechanic
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Power Bar")
	EKickActionType CurrentChargingAction;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Power Bar")
	float CurrentPowerCharge; // 0.0 to 1.0

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Power Bar")
	float PowerChargeSpeed;

	UPROPERTY(BlueprintReadOnly, Category = "Power Bar")
	bool bIsChargingPower;

	// Camera Management
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Camera")
	ECameraViewMode CurrentCameraMode;

	// Menu States
	UPROPERTY(BlueprintReadOnly, Category = "UI")
	bool bIsSubstitutionMenuOpen;

	UPROPERTY(BlueprintReadOnly, Category = "UI")
	bool bIsSettingsMenuOpen;

	// Input Handlers
	void MoveForward(float Value);
	void MoveRight(float Value);
	void OnSprintPressed();
	void OnSprintReleased();
	void OnSlideTacklePressed();

	// Power Bar Actions
	void OnShotPressed();
	void OnShotReleased();
	void OnPassPressed();
	void OnPassReleased();
	void OnThroughBallPressed();
	void OnThroughBallReleased();
	void OnAerialPassPressed();
	void OnAerialPassReleased();

	// Menu & Camera Toggles
	void OnToggleSubstitution();
	void OnToggleSettings();
	void OnCycleCamera();

	// Switch active controlled player to nearest teammate
	UFUNCTION(BlueprintCallable, Category = "Player Control")
	void SwitchToNearestPlayerToBall();

	// Helper to find pass target in aim direction
	AFootballPlayerCharacter* FindBestPassTarget(FVector AimDirection, float MaxAngleDegrees);

	// Execute the charged kick
	void ExecuteChargedKick(EKickActionType ActionType, float ChargeRatio);

	// Update dynamic camera position based on mode
	void UpdateCameraPosition(float DeltaTime);

	// Mouse aim direction on the pitch
	FVector GetMousePitchDirection() const;

private:
	FVector DesiredCameraLocation;
	FRotator DesiredCameraRotation;
};
