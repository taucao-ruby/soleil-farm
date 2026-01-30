<?php

namespace Tests\Feature\Validation;

use App\Models\CropCycle;
use App\Models\CropType;
use App\Models\LandParcel;
use App\Models\Season;
use App\Models\UnitOfMeasure;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CropCycleValidationTest extends TestCase
{
    use RefreshDatabase;

    protected string $endpoint;
    protected LandParcel $landParcel;
    protected CropType $cropType;

    protected function setUp(): void
    {
        parent::setUp();

        $this->endpoint = "{$this->apiBase}/crop-cycles";
        $this->landParcel = LandParcel::factory()->create();
        $this->cropType = CropType::factory()->create();
    }

    // =========================================================================
    // STORE VALIDATION TESTS
    // =========================================================================

    public function test_store_requires_land_parcel_id(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'crop_type_id' => $this->cropType->id,
            'planned_start_date' => '2026-03-01',
            'planned_end_date' => '2026-06-30',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['land_parcel_id']);
    }

    public function test_store_requires_crop_type_id(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'land_parcel_id' => $this->landParcel->id,
            'planned_start_date' => '2026-03-01',
            'planned_end_date' => '2026-06-30',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['crop_type_id']);
    }

    public function test_store_validates_land_parcel_exists(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'land_parcel_id' => 99999,
            'crop_type_id' => $this->cropType->id,
            'planned_start_date' => '2026-03-01',
            'planned_end_date' => '2026-06-30',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['land_parcel_id']);
    }

    public function test_store_validates_crop_type_exists(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'land_parcel_id' => $this->landParcel->id,
            'crop_type_id' => 99999,
            'planned_start_date' => '2026-03-01',
            'planned_end_date' => '2026-06-30',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['crop_type_id']);
    }

    public function test_store_requires_planned_dates(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'land_parcel_id' => $this->landParcel->id,
            'crop_type_id' => $this->cropType->id,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['planned_start_date', 'planned_end_date']);
    }

    public function test_store_validates_end_date_after_start_date(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'land_parcel_id' => $this->landParcel->id,
            'crop_type_id' => $this->cropType->id,
            'planned_start_date' => '2026-06-01',
            'planned_end_date' => '2026-03-01',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['planned_end_date']);
    }

    public function test_store_validates_no_overlapping_cycles(): void
    {
        $this->actingAsAuthenticatedUser();

        // Create existing cycle
        CropCycle::factory()->create([
            'land_parcel_id' => $this->landParcel->id,
            'planned_start_date' => '2026-03-01',
            'planned_end_date' => '2026-06-30',
            'status' => 'active',
        ]);

        // Try to create overlapping cycle
        $response = $this->postJson($this->endpoint, [
            'land_parcel_id' => $this->landParcel->id,
            'crop_type_id' => $this->cropType->id,
            'planned_start_date' => '2026-05-01',
            'planned_end_date' => '2026-08-31',
        ]);

        $response->assertStatus(422);
    }

    public function test_store_validates_inactive_crop_type(): void
    {
        $this->actingAsAuthenticatedUser();

        $inactiveCropType = CropType::factory()->create(['is_active' => false]);

        $response = $this->postJson($this->endpoint, [
            'land_parcel_id' => $this->landParcel->id,
            'crop_type_id' => $inactiveCropType->id,
            'planned_start_date' => '2026-03-01',
            'planned_end_date' => '2026-06-30',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['crop_type_id']);
    }

    public function test_store_success_with_valid_data(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'land_parcel_id' => $this->landParcel->id,
            'crop_type_id' => $this->cropType->id,
            'planned_start_date' => '2026-03-01',
            'planned_end_date' => '2026-06-30',
            'notes' => 'Vụ mùa xuân 2026',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => ['id', 'cycle_code', 'status'],
            ]);
    }

    // =========================================================================
    // UPDATE VALIDATION TESTS
    // =========================================================================

    public function test_update_rejects_completed_cycle(): void
    {
        $this->actingAsAuthenticatedUser();

        $cropCycle = CropCycle::factory()->create([
            'status' => 'completed',
        ]);

        $response = $this->putJson("{$this->endpoint}/{$cropCycle->id}", [
            'notes' => 'Updated notes',
        ]);

        $response->assertStatus(422);
    }

    public function test_update_allows_planned_cycle(): void
    {
        $this->actingAsAuthenticatedUser();

        $cropCycle = CropCycle::factory()->create([
            'status' => 'planned',
        ]);

        $response = $this->putJson("{$this->endpoint}/{$cropCycle->id}", [
            'notes' => 'Updated notes',
        ]);

        $response->assertStatus(200);
    }

    // =========================================================================
    // COMPLETE VALIDATION TESTS
    // =========================================================================

    public function test_complete_validates_yield_value_positive(): void
    {
        $this->actingAsAuthenticatedUser();

        $cropCycle = CropCycle::factory()->create([
            'status' => 'active',
        ]);

        $response = $this->postJson("{$this->endpoint}/{$cropCycle->id}/complete", [
            'yield_value' => -100,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['yield_value']);
    }

    public function test_complete_validates_quality_rating_enum(): void
    {
        $this->actingAsAuthenticatedUser();

        $cropCycle = CropCycle::factory()->create([
            'status' => 'active',
        ]);

        $response = $this->postJson("{$this->endpoint}/{$cropCycle->id}/complete", [
            'quality_rating' => 'invalid_rating',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['quality_rating']);
    }

    public function test_complete_validates_yield_unit_exists(): void
    {
        $this->actingAsAuthenticatedUser();

        $cropCycle = CropCycle::factory()->create([
            'status' => 'active',
        ]);

        $response = $this->postJson("{$this->endpoint}/{$cropCycle->id}/complete", [
            'yield_value' => 1000,
            'yield_unit_id' => 99999,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['yield_unit_id']);
    }

    public function test_complete_success_with_valid_data(): void
    {
        $this->actingAsAuthenticatedUser();

        $yieldUnit = UnitOfMeasure::where('unit_type', 'weight')->first()
            ?? UnitOfMeasure::factory()->create(['unit_type' => 'weight']);

        $cropCycle = CropCycle::factory()->create([
            'status' => 'active',
        ]);

        $response = $this->postJson("{$this->endpoint}/{$cropCycle->id}/complete", [
            'yield_value' => 5000,
            'yield_unit_id' => $yieldUnit->id,
            'quality_rating' => 'good',
        ]);

        $response->assertStatus(200);
        $this->assertEquals('completed', $response->json('data.status'));
    }
}
