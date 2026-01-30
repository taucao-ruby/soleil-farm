<?php

namespace Tests\Feature\Validation;

use App\Models\WaterSource;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WaterSourceValidationTest extends TestCase
{
    use RefreshDatabase;

    protected string $endpoint;

    protected function setUp(): void
    {
        parent::setUp();

        $this->endpoint = "{$this->apiBase}/water-sources";
    }

    // =========================================================================
    // STORE VALIDATION TESTS
    // =========================================================================

    public function test_store_requires_name(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'code' => 'WS-001',
            'source_type' => 'well',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_store_requires_source_type(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'name' => 'Giếng Số 1',
            'code' => 'WS-001',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['source_type']);
    }

    public function test_store_validates_source_type_enum(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'name' => 'Giếng Số 1',
            'code' => 'WS-001',
            'source_type' => 'invalid_type',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['source_type']);
    }

    public function test_store_validates_unique_code(): void
    {
        $this->actingAsAuthenticatedUser();

        WaterSource::factory()->create(['code' => 'WS-001']);

        $response = $this->postJson($this->endpoint, [
            'name' => 'Giếng Số 2',
            'code' => 'WS-001',
            'source_type' => 'well',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['code']);
    }

    public function test_store_validates_reliability_enum(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'name' => 'Giếng Số 1',
            'code' => 'WS-001',
            'source_type' => 'well',
            'reliability' => 'invalid_reliability',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['reliability']);
    }

    public function test_store_validates_water_quality_enum(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'name' => 'Giếng Số 1',
            'code' => 'WS-001',
            'source_type' => 'well',
            'water_quality' => 'invalid_quality',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['water_quality']);
    }

    public function test_store_validates_latitude_range(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'name' => 'Giếng Số 1',
            'code' => 'WS-001',
            'source_type' => 'well',
            'latitude' => 95,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['latitude']);
    }

    public function test_store_auto_generates_code_if_not_provided(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'name' => 'Giếng Số 1',
            'source_type' => 'well',
        ]);

        $response->assertStatus(201);
        $this->assertNotNull($response->json('data.code'));
    }

    public function test_store_success_with_all_valid_data(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'name' => 'Giếng Khoan Số 1',
            'code' => 'GK-001',
            'source_type' => 'well',
            'description' => 'Giếng khoan sâu 50m',
            'latitude' => 10.8231,
            'longitude' => 106.6297,
            'reliability' => 'permanent',
            'water_quality' => 'good',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => ['id', 'name', 'code', 'source_type'],
            ]);
    }

    // =========================================================================
    // UPDATE VALIDATION TESTS
    // =========================================================================

    public function test_update_allows_partial_data(): void
    {
        $this->actingAsAuthenticatedUser();

        $waterSource = WaterSource::factory()->create();

        $response = $this->putJson("{$this->endpoint}/{$waterSource->id}", [
            'name' => 'Tên Mới',
        ]);

        $response->assertStatus(200);
        $this->assertEquals('Tên Mới', $response->json('data.name'));
    }

    public function test_update_validates_unique_code_excluding_self(): void
    {
        $this->actingAsAuthenticatedUser();

        $waterSource1 = WaterSource::factory()->create(['code' => 'WS-001']);
        $waterSource2 = WaterSource::factory()->create(['code' => 'WS-002']);

        // Should fail - trying to use existing code
        $response = $this->putJson("{$this->endpoint}/{$waterSource2->id}", [
            'code' => 'WS-001',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['code']);

        // Should succeed - keeping own code
        $response = $this->putJson("{$this->endpoint}/{$waterSource1->id}", [
            'code' => 'WS-001',
        ]);

        $response->assertStatus(200);
    }
}
