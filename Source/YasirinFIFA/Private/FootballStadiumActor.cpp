// Copyright Epic Games, Inc. All Rights Reserved.

#include "FootballStadiumActor.h"

AFootballStadiumActor::AFootballStadiumActor()
{
	PrimaryActorTick.bCanEverTick = false;

	PitchSurface = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("PitchSurface"));
	RootComponent = PitchSurface;
	PitchSurface->SetCollisionProfileName(TEXT("BlockAll"));

	HomeGoalFrame = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("HomeGoalFrame"));
	HomeGoalFrame->SetupAttachment(RootComponent);
	HomeGoalFrame->SetRelativeLocation(FVector(-5250.0f, 0.0f, 0.0f));

	HomeGoalNet = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("HomeGoalNet"));
	HomeGoalNet->SetupAttachment(HomeGoalFrame);

	AwayGoalFrame = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("AwayGoalFrame"));
	AwayGoalFrame->SetupAttachment(RootComponent);
	AwayGoalFrame->SetRelativeLocation(FVector(5250.0f, 0.0f, 0.0f));
	AwayGoalFrame->SetRelativeRotation(FRotator(0.0f, 180.0f, 0.0f));

	AwayGoalNet = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("AwayGoalNet"));
	AwayGoalNet->SetupAttachment(AwayGoalFrame);

	GrandstandsNorth = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("GrandstandsNorth"));
	GrandstandsNorth->SetupAttachment(RootComponent);
	GrandstandsNorth->SetRelativeLocation(FVector(0.0f, 4400.0f, 0.0f));

	GrandstandsSouth = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("GrandstandsSouth"));
	GrandstandsSouth->SetupAttachment(RootComponent);
	GrandstandsSouth->SetRelativeLocation(FVector(0.0f, -4400.0f, 0.0f));
	GrandstandsSouth->SetRelativeRotation(FRotator(0.0f, 180.0f, 0.0f));

	GrandstandsEast = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("GrandstandsEast"));
	GrandstandsEast->SetupAttachment(RootComponent);
	GrandstandsEast->SetRelativeLocation(FVector(6500.0f, 0.0f, 0.0f));
	GrandstandsEast->SetRelativeRotation(FRotator(0.0f, -90.0f, 0.0f));

	GrandstandsWest = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("GrandstandsWest"));
	GrandstandsWest->SetupAttachment(RootComponent);
	GrandstandsWest->SetRelativeLocation(FVector(-6500.0f, 0.0f, 0.0f));
	GrandstandsWest->SetRelativeRotation(FRotator(0.0f, 90.0f, 0.0f));

	AmbientCrowdAudio = CreateDefaultSubobject<UAudioComponent>(TEXT("AmbientCrowdAudio"));
	AmbientCrowdAudio->SetupAttachment(RootComponent);
	AmbientCrowdAudio->bAutoActivate = true;

	GoalCheerAudio = CreateDefaultSubobject<UAudioComponent>(TEXT("GoalCheerAudio"));
	GoalCheerAudio->SetupAttachment(RootComponent);
	GoalCheerAudio->bAutoActivate = false;
}

void AFootballStadiumActor::BeginPlay()
{
	Super::BeginPlay();
}

void AFootballStadiumActor::PlayGoalRoar()
{
	if (GoalCheerAudio)
	{
		GoalCheerAudio->Play();
	}
}
