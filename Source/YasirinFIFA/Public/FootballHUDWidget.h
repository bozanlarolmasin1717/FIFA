// Copyright Epic Games, Inc. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "Blueprint/UserWidget.h"
#include "FootballGameMode.h"
#include "FootballPlayerCharacter.h"
#include "FootballPlayerController.h"
#include "FootballHUDWidget.generated.h"

UCLASS()
class YASIRINFIFA_API UFootballHUDWidget : public UUserWidget
{
	GENERATED_BODY()

public:
	// Power Bar Bindings
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Power Bar")
	float PowerFillRatio; // 0.0 to 1.0

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Power Bar")
	EKickActionType ActiveKickAction;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Power Bar")
	bool bShowPowerBar;

	// Shot Speed Indicator
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Shot Speed")
	float LastShotSpeedKmh;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Shot Speed")
	bool bShowShotSpeed;

	// Conditioning / Stamina
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Conditioning")
	float ActivePlayerStaminaRatio;

	// Scoreboard
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Scoreboard")
	int32 HomeScore;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Scoreboard")
	int32 AwayScore;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Scoreboard")
	float MatchMinute;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Scoreboard")
	EMatchStateFIFA MatchState;

	// Active Player Card Info
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Player Card")
	FPlayerCardStats DisplayedCardStats;

	// Menus visibility
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "UI Menus")
	bool bShowSubstitutionMenu;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "UI Menus")
	bool bShowSettingsMenu;

	// Update HUD from game state
	UFUNCTION(BlueprintCallable, Category = "HUD Update")
	void UpdateHUD(AFootballPlayerController* Controller, AYasirinFIFAGameModeBase* GameMode);

	// Display shot speed flash
	UFUNCTION(BlueprintCallable, Category = "HUD Events")
	void TriggerShotSpeedFlash(float SpeedKmh);
};
