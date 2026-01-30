<?php

namespace Tests\Feature\Validation;

use App\Models\LandParcel;
use App\Models\UnitOfMeasure;
use App\Models\WaterSource;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LandParcelValidationTest extends TestCase
{
    use RefreshDatabase;

    protected string $endpoint;
    protected UnitOfMeasure $areaUnit;

    protected function setUp(): void
    {
        parent::setUp();

        $this->endpoint = "{$this->apiBase}/land-parcels";
        $this->areaUnit = UnitOfMeasure::where('unit_type', 'area')->first()
            ?? UnitOfMeasure::factory()->create(['unit_type' => 'area']);
    }

    // =========================================================================
    // STORE VALIDATION TESTS
    // =========================================================================

    public function test_store_requires_name(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'code' => 'LD-001',
            'land_type' => 'rice_field',
            'area_value' => 1000,
            'area_unit_id' => $this->areaUnit->id,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_store_validates_name_max_length(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'name' => str_repeat('a', 101),
            'code' => 'LD-001',
            'land_type' => 'rice_field',
            'area_value' => 1000,
            'area_unit_id' => $this->areaUnit->id,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_store_requires_unique_code(): void
    {
        $this->actingAsAuthenticatedUser();

        LandParcel::factory()->create(['code' => 'LD-001']);

        $response = $this->postJson($this->endpoint, [
            'name' => 'Lô Đất Mới',
            'code' => 'LD-001',
            'land_type' => 'rice_field',
            'area_value' => 1000,
            'area_unit_id' => $this->areaUnit->id,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['code']);
    }

    public function test_store_validates_land_type_enum(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'name' => 'Lô Đất Mới',
            'code' => 'LD-001',
            'land_type' => 'invalid_type',
            'area_value' => 1000,
            'area_unit_id' => $this->areaUnit->id,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['land_type']);
    }

    public function test_store_validates_area_value_positive(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'name' => 'Lô Đất Mới',
            'code' => 'LD-001',
            'land_type' => 'rice_field',
            'area_value' => -100,
            'area_unit_id' => $this->areaUnit->id,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['area_value']);
    }

    public function test_store_validates_area_unit_exists(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'name' => 'Lô Đất Mới',
            'code' => 'LD-001',
            'land_type' => 'rice_field',
            'area_value' => 1000,
            'area_unit_id' => 99999,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['area_unit_id']);
    }

    public function test_store_validates_terrain_type_enum(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'name' => 'Lô Đất Mới',
            'code' => 'LD-001',
            'land_type' => 'rice_field',
            'area_value' => 1000,
            'area_unit_id' => $this->areaUnit->id,
            'terrain_type' => 'invalid_terrain',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['terrain_type']);
    }

    public function test_store_validates_latitude_range(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'name' => 'Lô Đất Mới',
            'code' => 'LD-001',
            'land_type' => 'rice_field',
            'area_value' => 1000,
            'area_unit_id' => $this->areaUnit->id,
            'latitude' => 100,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['latitude']);
    }

    public function test_store_validates_longitude_range(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'name' => 'Lô Đất Mới',
            'code' => 'LD-001',
            'land_type' => 'rice_field',
            'area_value' => 1000,
            'area_unit_id' => $this->areaUnit->id,
            'longitude' => 200,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['longitude']);
    }

    public function test_store_auto_generates_code_if_not_provided(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'name' => 'Lô Đất Mới',
            'land_type' => 'rice_field',
            'area_value' => 1000,
            'area_unit_id' => $this->areaUnit->id,
        ]);

        $response->assertStatus(201);
        $this->assertNotNull($response->json('data.code'));
    }

    public function test_store_success_with_valid_data(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'name' => 'Ruộng Lúa Số 1',
            'code' => 'RL-001',
            'description' => 'Ruộng lúa phía đông',
            'land_type' => 'rice_field',
            'area_value' => 5000,
            'area_unit_id' => $this->areaUnit->id,
            'terrain_type' => 'flat',
            'soil_type' => 'alluvial',
            'latitude' => 10.8231,
            'longitude' => 106.6297,
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => ['id', 'name', 'code', 'land_type'],
            ]);
    }

    // =========================================================================
    // UPDATE VALIDATION TESTS
    // =========================================================================

    public function test_update_allows_partial_data(): void
    {
        $this->actingAsAuthenticatedUser();

        $landParcel = LandParcel::factory()->create();

        $response = $this->putJson("{$this->endpoint}/{$landParcel->id}", [
            'name' => 'Tên Mới',
        ]);

        $response->assertStatus(200);
        $this->assertEquals('Tên Mới', $response->json('data.name'));
    }

    public function test_update_validates_unique_code_excluding_self(): void
    {
        $this->actingAsAuthenticatedUser();

        $landParcel1 = LandParcel::factory()->create(['code' => 'LD-001']);
        $landParcel2 = LandParcel::factory()->create(['code' => 'LD-002']);

        // Should fail - trying to use existing code
        $response = $this->putJson("{$this->endpoint}/{$landParcel2->id}", [
            'code' => 'LD-001',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['code']);

        // Should succeed - keeping own code
        $response = $this->putJson("{$this->endpoint}/{$landParcel1->id}", [
            'code' => 'LD-001',
        ]);

        $response->assertStatus(200);
    }

    // =========================================================================
    // ATTACH WATER SOURCE VALIDATION TESTS
    // =========================================================================

    public function test_attach_water_source_requires_water_source_id(): void
    {
        $this->actingAsAuthenticatedUser();

        $landParcel = LandParcel::factory()->create();

        $response = $this->postJson("{$this->endpoint}/{$landParcel->id}/water-sources", []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['water_source_id']);
    }

    public function test_attach_water_source_validates_water_source_exists(): void
    {
        $this->actingAsAuthenticatedUser();

        $landParcel = LandParcel::factory()->create();

        $response = $this->postJson("{$this->endpoint}/{$landParcel->id}/water-sources", [
            'water_source_id' => 99999,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['water_source_id']);
    }

    public function test_attach_water_source_validates_accessibility_enum(): void
    {
        $this->actingAsAuthenticatedUser();

        $landParcel = LandParcel::factory()->create();
        $waterSource = WaterSource::factory()->create();

        $response = $this->postJson("{$this->endpoint}/{$landParcel->id}/water-sources", [
            'water_source_id' => $waterSource->id,
            'accessibility' => 'invalid_accessibility',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['accessibility']);
    }

    public function test_attach_water_source_success(): void
    {
        $this->actingAsAuthenticatedUser();

        $landParcel = LandParcel::factory()->create();
        $waterSource = WaterSource::factory()->create();

        $response = $this->postJson("{$this->endpoint}/{$landParcel->id}/water-sources", [
            'water_source_id' => $waterSource->id,
            'accessibility' => 'direct',
            'is_primary_source' => true,
        ]);

        $response->assertStatus(200);
    }
}
