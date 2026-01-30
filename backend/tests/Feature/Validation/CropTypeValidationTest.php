<?php

namespace Tests\Feature\Validation;

use App\Models\CropType;
use App\Models\UnitOfMeasure;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CropTypeValidationTest extends TestCase
{
    use RefreshDatabase;

    protected string $endpoint;

    protected function setUp(): void
    {
        parent::setUp();

        $this->endpoint = "{$this->apiBase}/crop-types";
    }

    // =========================================================================
    // STORE VALIDATION TESTS
    // =========================================================================

    public function test_store_requires_name(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'code' => 'LUA-001',
            'category' => 'grain',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_store_requires_category(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'name' => 'Lúa IR50404',
            'code' => 'LUA-001',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['category']);
    }

    public function test_store_validates_category_enum(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'name' => 'Lúa IR50404',
            'code' => 'LUA-001',
            'category' => 'invalid_category',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['category']);
    }

    public function test_store_validates_unique_code(): void
    {
        $this->actingAsAuthenticatedUser();

        CropType::factory()->create(['code' => 'LUA-001']);

        $response = $this->postJson($this->endpoint, [
            'name' => 'Lúa Mới',
            'code' => 'LUA-001',
            'category' => 'grain',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['code']);
    }

    public function test_store_validates_name_max_length(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'name' => str_repeat('a', 101),
            'code' => 'LUA-001',
            'category' => 'grain',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_store_validates_typical_grow_duration_positive(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'name' => 'Lúa IR50404',
            'code' => 'LUA-001',
            'category' => 'grain',
            'typical_grow_duration_days' => 0,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['typical_grow_duration_days']);
    }

    public function test_store_validates_default_yield_unit_exists(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'name' => 'Lúa IR50404',
            'code' => 'LUA-001',
            'category' => 'grain',
            'default_yield_unit_id' => 99999,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['default_yield_unit_id']);
    }

    public function test_store_auto_generates_code_if_not_provided(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'name' => 'Lúa IR50404',
            'category' => 'grain',
        ]);

        $response->assertStatus(201);
        $this->assertNotNull($response->json('data.code'));
    }

    public function test_store_success_with_all_valid_data(): void
    {
        $this->actingAsAuthenticatedUser();

        $yieldUnit = UnitOfMeasure::factory()->create(['unit_type' => 'weight']);

        $response = $this->postJson($this->endpoint, [
            'name' => 'Lúa IR50404',
            'code' => 'LUA-IR50404',
            'scientific_name' => 'Oryza sativa',
            'variety' => 'IR50404',
            'category' => 'grain',
            'description' => 'Giống lúa chịu hạn, năng suất cao',
            'typical_grow_duration_days' => 105,
            'default_yield_unit_id' => $yieldUnit->id,
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => ['id', 'name', 'code', 'category'],
            ]);
    }

    // =========================================================================
    // UPDATE VALIDATION TESTS
    // =========================================================================

    public function test_update_allows_partial_data(): void
    {
        $this->actingAsAuthenticatedUser();

        $cropType = CropType::factory()->create();

        $response = $this->putJson("{$this->endpoint}/{$cropType->id}", [
            'description' => 'Mô tả mới',
        ]);

        $response->assertStatus(200);
        $this->assertEquals('Mô tả mới', $response->json('data.description'));
    }

    public function test_update_validates_unique_code_excluding_self(): void
    {
        $this->actingAsAuthenticatedUser();

        $cropType1 = CropType::factory()->create(['code' => 'LUA-001']);
        $cropType2 = CropType::factory()->create(['code' => 'LUA-002']);

        // Should fail - trying to use existing code
        $response = $this->putJson("{$this->endpoint}/{$cropType2->id}", [
            'code' => 'LUA-001',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['code']);

        // Should succeed - keeping own code
        $response = $this->putJson("{$this->endpoint}/{$cropType1->id}", [
            'code' => 'LUA-001',
        ]);

        $response->assertStatus(200);
    }
}
