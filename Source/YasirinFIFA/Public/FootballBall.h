// Copyright Epic Games, Inc. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "Components/SphereComponent.h"
#include "Components/StaticMeshComponent.h"
#include "FootballBall.generated.h"

DECLARE_DYNAMIC_MULTICAST_DELEGATE_TwoParams(FOnBallScoredGoal, bool, bIsHomeGoal, float, ShotSpeedKmh);
DECLARE_DYNAMIC_MULTICAST_DELEGATE_ThreeParams(FOnBallPassed, class AFootballPlayerCharacter*, Player, float, Power, FVector, Target);
DECLARE_DYNAMIC_MULTICAST_DELEGATE_ThreeParams(FOnShotTaken, class AFootballPlayerCharacter*, Player, float, Power, FVector, Direction);
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnBallEnteredTrigger, FName, TriggerZoneName);

UCLASS()
class YASIRINFIFA_API AFootballBall : public AActor
{
	GENERATED_BODY()
	
public:	
	AFootballBall();

protected:
	virtual void BeginPlay() override;

public:	
	virtual void Tick(float DeltaTime) override;

	// Physics Collision Sphere
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Ball Physics")
	USphereComponent* SphereComp;

	// Ball Visual Mesh
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Ball Visual")
	UStaticMeshComponent* BallMesh;

	// Last player who touched/kicked the ball
	UPROPERTY(BlueprintReadOnly, Category = "Ball Gameplay")
	class AFootballPlayerCharacter* LastKicker;

	// Current ball spin vector for Magnus effect
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Ball Physics")
	FVector AngularSpin;

	// Ball physics parameters
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Ball Physics")
	float MassKg;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Ball Physics")
	float RollingFriction;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Ball Physics")
	float RestitutionBounce;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Ball Physics")
	float AirDragCoefficient;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Ball Physics")
	float MagnusLiftScale;

	// Kick the ball with force, elevation, and optional curve/spin
	UFUNCTION(BlueprintCallable, Category = "Ball Gameplay")
	void ApplyKick(FVector Direction, float ForceMagnitude, float VerticalElevation, FVector Spin, class AFootballPlayerCharacter* Kicker);

	// Get current velocity in km/h for the shot speed indicator
	UFUNCTION(BlueprintPure, Category = "Ball Gameplay")
	float GetVelocityKmh() const;

	// Goal detection delegate
	UPROPERTY(BlueprintAssignable, Category = "Ball Events")
	FOnBallScoredGoal OnGoalScored;

	// Rule and telemetry event dispatchers
	UPROPERTY(BlueprintAssignable, Category = "Ball Events")
	FOnBallPassed OnBallPassed;

	UPROPERTY(BlueprintAssignable, Category = "Ball Events")
	FOnShotTaken OnShotTaken;

	UPROPERTY(BlueprintAssignable, Category = "Ball Events")
	FOnBallEnteredTrigger OnBallEnteredTrigger;

	// Reset ball to a specific position (e.g. center spot)
	UFUNCTION(BlueprintCallable, Category = "Ball Gameplay")
	void ResetBall(FVector NewLocation);

private:
	UFUNCTION()
	void OnBallHit(UPrimitiveComponent* HitComponent, AActor* OtherActor, UPrimitiveComponent* OtherComp, FVector NormalImpulse, const FHitResult& Hit);

	// Pitch boundaries (standard pitch: X +/- 52.5m, Y +/- 34.0m)
	const float PitchHalfLengthCm = 5250.0f;
	const float PitchHalfWidthCm = 3400.0f;
	const float GoalHalfWidthCm = 366.0f;
	const float GoalHeightCm = 244.0f;

	bool bGoalRegistered;
	TSet<FName> ActiveTriggerZones;
	void UpdateTriggerZones(const FVector& BallPos);
};
