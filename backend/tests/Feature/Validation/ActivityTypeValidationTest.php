<?php

namespace Tests\Feature\Validation;

use App\Models\ActivityType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ActivityTypeValidationTest extends TestCase
{
    use RefreshDatabase;

    protected string $endpoint;

    protected function setUp(): void
    {
        parent::setUp();

        $this->endpoint = "{$this->apiBase}/activity-types";
    }

    // =========================================================================
    // STORE VALIDATION TESTS
    // =========================================================================

    public function test_store_requires_name(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'code' => 'TUOI-NUOC',
            'category' => 'irrigation',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_store_requires_category(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'name' => 'Tưới Nước',
            'code' => 'TUOI-NUOC',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['category']);
    }

    public function test_store_validates_category_enum(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'name' => 'Tưới Nước',
            'code' => 'TUOI-NUOC',
            'category' => 'invalid_category',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['category']);
    }

    public function test_store_validates_unique_code(): void
    {
        $this->actingAsAuthenticatedUser();

        ActivityType::factory()->create(['code' => 'TUOI-NUOC']);

        $response = $this->postJson($this->endpoint, [
            'name' => 'Tưới Nước 2',
            'code' => 'TUOI-NUOC',
            'category' => 'irrigation',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['code']);
    }

    public function test_store_validates_all_category_values(): void
    {
        $this->actingAsAuthenticatedUser();

        $validCategories = [
            'land_preparation',
            'planting',
            'irrigation',
            'fertilizing',
            'pest_control',
            'harvesting',
            'maintenance',
            'observation',
            'other',
        ];

        foreach ($validCategories as $index => $category) {
            $response = $this->postJson($this->endpoint, [
                'name' => "Activity {$index}",
                'code' => "ACT-{$index}",
                'category' => $category,
            ]);

            $response->assertStatus(201);
        }
    }

    public function test_store_auto_generates_code_if_not_provided(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'name' => 'Tưới Nước',
            'category' => 'irrigation',
        ]);

        $response->assertStatus(201);
        $this->assertNotNull($response->json('data.code'));
    }

    public function test_store_success_with_valid_data(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'name' => 'Bón Phân NPK',
            'code' => 'BON-NPK',
            'category' => 'fertilizing',
            'description' => 'Bón phân NPK theo tỷ lệ 16-16-8',
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

        $activityType = ActivityType::factory()->create();

        $response = $this->putJson("{$this->endpoint}/{$activityType->id}", [
            'description' => 'Mô tả mới',
        ]);

        $response->assertStatus(200);
        $this->assertEquals('Mô tả mới', $response->json('data.description'));
    }

    public function test_update_validates_unique_code_excluding_self(): void
    {
        $this->actingAsAuthenticatedUser();

        $type1 = ActivityType::factory()->create(['code' => 'AT-001']);
        $type2 = ActivityType::factory()->create(['code' => 'AT-002']);

        // Should fail - trying to use existing code
        $response = $this->putJson("{$this->endpoint}/{$type2->id}", [
            'code' => 'AT-001',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['code']);

        // Should succeed - keeping own code
        $response = $this->putJson("{$this->endpoint}/{$type1->id}", [
            'code' => 'AT-001',
        ]);

        $response->assertStatus(200);
    }
}
