// Copyright Epic Games, Inc. All Rights Reserved.

#include "FootballHUDWidget.h"

void UFootballHUDWidget::UpdateHUD(AFootballPlayerController* Controller, AYasirinFIFAGameModeBase* GameMode)
{
	if (Controller)
	{
		bShowPowerBar = Controller->bIsChargingPower;
		PowerFillRatio = Controller->CurrentPowerCharge;
		ActiveKickAction = Controller->CurrentChargingAction;
		bShowSubstitutionMenu = Controller->bIsSubstitutionMenuOpen;
		bShowSettingsMenu = Controller->bIsSettingsMenuOpen;

		if (Controller->ActiveFootballPlayer)
		{
			ActivePlayerStaminaRatio = Controller->ActiveFootballPlayer->CurrentStamina / Controller->ActiveFootballPlayer->MaxStamina;
			DisplayedCardStats = Controller->ActiveFootballPlayer->PlayerStats;
		}
	}

	if (GameMode)
	{
		HomeScore = GameMode->HomeScore;
		AwayScore = GameMode->AwayScore;
		MatchMinute = GameMode->CurrentMatchMinute;
		MatchState = GameMode->MatchState;
	}
}

void UFootballHUDWidget::TriggerShotSpeedFlash(float SpeedKmh)
{
	LastShotSpeedKmh = SpeedKmh;
	bShowShotSpeed = true;
}
