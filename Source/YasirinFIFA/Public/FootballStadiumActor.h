// Copyright Epic Games, Inc. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "Components/StaticMeshComponent.h"
#include "Components/AudioComponent.h"
#include "FootballStadiumActor.generated.h"

UCLASS()
class YASIRINFIFA_API AFootballStadiumActor : public AActor
{
	GENERATED_BODY()
	
public:	
	AFootballStadiumActor();

protected:
	virtual void BeginPlay() override;

public:	
	// Root Pitch Surface
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Pitch")
	UStaticMeshComponent* PitchSurface;

	// Goal Posts (Home and Away)
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Goals")
	UStaticMeshComponent* HomeGoalFrame;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Goals")
	UStaticMeshComponent* HomeGoalNet;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Goals")
	UStaticMeshComponent* AwayGoalFrame;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Goals")
	UStaticMeshComponent* AwayGoalNet;

	// Stadium Grandstands & Crowd Meshes
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Stadium")
	UStaticMeshComponent* GrandstandsNorth;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Stadium")
	UStaticMeshComponent* GrandstandsSouth;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Stadium")
	UStaticMeshComponent* GrandstandsEast;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Stadium")
	UStaticMeshComponent* GrandstandsWest;

	// Ambient Crowd Audio
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Audio")
	UAudioComponent* AmbientCrowdAudio;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Audio")
	UAudioComponent* GoalCheerAudio;

	// Trigger goal celebration crowd roar
	UFUNCTION(BlueprintCallable, Category = "Audio")
	void PlayGoalRoar();

	// Standard FIFA Pitch Dimensions (in Unreal Units / cm)
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Pitch Dimensions")
	float PitchLengthCm = 10500.0f; // 105 meters

	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Pitch Dimensions")
	float PitchWidthCm = 6800.0f;   // 68 meters

	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Pitch Dimensions")
	float GoalWidthCm = 732.0f;     // 7.32 meters

	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Pitch Dimensions")
	float GoalHeightCm = 244.0f;    // 2.44 meters
};
