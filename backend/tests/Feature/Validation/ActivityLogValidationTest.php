<?php

namespace Tests\Feature\Validation;

use App\Models\ActivityLog;
use App\Models\ActivityType;
use App\Models\CropCycle;
use App\Models\LandParcel;
use App\Models\UnitOfMeasure;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ActivityLogValidationTest extends TestCase
{
    use RefreshDatabase;

    protected string $endpoint;
    protected ActivityType $activityType;
    protected LandParcel $landParcel;

    protected function setUp(): void
    {
        parent::setUp();

        $this->endpoint = "{$this->apiBase}/activity-logs";
        $this->activityType = ActivityType::factory()->create();
        $this->landParcel = LandParcel::factory()->create();
    }

    // =========================================================================
    // STORE VALIDATION TESTS
    // =========================================================================

    public function test_store_requires_activity_type_id(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'activity_date' => '2026-01-30',
            'land_parcel_id' => $this->landParcel->id,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['activity_type_id']);
    }

    public function test_store_requires_activity_date(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'activity_type_id' => $this->activityType->id,
            'land_parcel_id' => $this->landParcel->id,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['activity_date']);
    }

    public function test_store_validates_activity_type_exists(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'activity_type_id' => 99999,
            'activity_date' => '2026-01-30',
            'land_parcel_id' => $this->landParcel->id,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['activity_type_id']);
    }

    public function test_store_validates_inactive_activity_type(): void
    {
        $this->actingAsAuthenticatedUser();

        $inactiveType = ActivityType::factory()->create(['is_active' => false]);

        $response = $this->postJson($this->endpoint, [
            'activity_type_id' => $inactiveType->id,
            'activity_date' => '2026-01-30',
            'land_parcel_id' => $this->landParcel->id,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['activity_type_id']);
    }

    public function test_store_validates_crop_cycle_exists(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'activity_type_id' => $this->activityType->id,
            'activity_date' => '2026-01-30',
            'crop_cycle_id' => 99999,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['crop_cycle_id']);
    }

    public function test_store_validates_land_parcel_exists(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'activity_type_id' => $this->activityType->id,
            'activity_date' => '2026-01-30',
            'land_parcel_id' => 99999,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['land_parcel_id']);
    }

    public function test_store_validates_quantity_positive(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'activity_type_id' => $this->activityType->id,
            'activity_date' => '2026-01-30',
            'land_parcel_id' => $this->landParcel->id,
            'quantity_value' => -10,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['quantity_value']);
    }

    public function test_store_validates_cost_positive(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'activity_type_id' => $this->activityType->id,
            'activity_date' => '2026-01-30',
            'land_parcel_id' => $this->landParcel->id,
            'cost_value' => -1000,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['cost_value']);
    }

    public function test_store_validates_performed_by_max_length(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'activity_type_id' => $this->activityType->id,
            'activity_date' => '2026-01-30',
            'land_parcel_id' => $this->landParcel->id,
            'performed_by' => str_repeat('a', 256),
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['performed_by']);
    }

    public function test_store_validates_end_time_after_start_time(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'activity_type_id' => $this->activityType->id,
            'activity_date' => '2026-01-30',
            'land_parcel_id' => $this->landParcel->id,
            'start_time' => '14:00',
            'end_time' => '10:00',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['end_time']);
    }

    public function test_store_success_with_valid_data(): void
    {
        $this->actingAsAuthenticatedUser();

        $quantityUnit = UnitOfMeasure::factory()->create(['unit_type' => 'weight']);

        $response = $this->postJson($this->endpoint, [
            'activity_type_id' => $this->activityType->id,
            'activity_date' => '2026-01-30',
            'land_parcel_id' => $this->landParcel->id,
            'performed_by' => 'Nguyễn Văn A',
            'quantity_value' => 50,
            'quantity_unit_id' => $quantityUnit->id,
            'weather_conditions' => 'Nắng nhẹ, 28°C',
            'description' => 'Bón phân NPK cho ruộng lúa',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => ['id', 'activity_date'],
            ]);
    }

    // =========================================================================
    // UPDATE VALIDATION TESTS
    // =========================================================================

    public function test_update_allows_partial_data(): void
    {
        $this->actingAsAuthenticatedUser();

        $activityLog = ActivityLog::factory()->create();

        $response = $this->putJson("{$this->endpoint}/{$activityLog->id}", [
            'performed_by' => 'Trần Văn B',
        ]);

        $response->assertStatus(200);
        $this->assertEquals('Trần Văn B', $response->json('data.performed_by'));
    }

    public function test_update_validates_quantity_requires_unit(): void
    {
        $this->actingAsAuthenticatedUser();

        $activityLog = ActivityLog::factory()->create([
            'quantity_value' => null,
            'quantity_unit_id' => null,
        ]);

        $response = $this->putJson("{$this->endpoint}/{$activityLog->id}", [
            'quantity_value' => 100,
        ]);

        // Should require unit when quantity is provided
        $response->assertStatus(422);
    }
}
