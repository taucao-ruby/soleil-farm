<?php

namespace Tests\Feature\Validation;

use App\Models\SeasonDefinition;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SeasonDefinitionValidationTest extends TestCase
{
    use RefreshDatabase;

    protected string $endpoint;

    protected function setUp(): void
    {
        parent::setUp();

        $this->endpoint = "{$this->apiBase}/season-definitions";
    }

    // =========================================================================
    // STORE VALIDATION TESTS
    // =========================================================================

    public function test_store_requires_name(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'code' => 'XUAN',
            'typical_start_month' => 2,
            'typical_end_month' => 6,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_store_requires_code(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'name' => 'Mùa Xuân',
            'typical_start_month' => 2,
            'typical_end_month' => 6,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['code']);
    }

    public function test_store_requires_typical_months(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'name' => 'Mùa Xuân',
            'code' => 'XUAN',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['typical_start_month', 'typical_end_month']);
    }

    public function test_store_validates_unique_code(): void
    {
        $this->actingAsAuthenticatedUser();

        SeasonDefinition::factory()->create(['code' => 'XUAN']);

        $response = $this->postJson($this->endpoint, [
            'name' => 'Mùa Xuân Mới',
            'code' => 'XUAN',
            'typical_start_month' => 2,
            'typical_end_month' => 6,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['code']);
    }

    public function test_store_validates_month_range(): void
    {
        $this->actingAsAuthenticatedUser();

        // Month too low
        $response = $this->postJson($this->endpoint, [
            'name' => 'Mùa Xuân',
            'code' => 'XUAN',
            'typical_start_month' => 0,
            'typical_end_month' => 6,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['typical_start_month']);

        // Month too high
        $response = $this->postJson($this->endpoint, [
            'name' => 'Mùa Xuân',
            'code' => 'XUAN2',
            'typical_start_month' => 2,
            'typical_end_month' => 13,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['typical_end_month']);
    }

    public function test_store_validates_name_max_length(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'name' => str_repeat('a', 101),
            'code' => 'XUAN',
            'typical_start_month' => 2,
            'typical_end_month' => 6,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_store_success_with_valid_data(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'name' => 'Vụ Đông Xuân',
            'code' => 'DONG-XUAN',
            'description' => 'Vụ mùa chính của miền Nam',
            'typical_start_month' => 11,
            'typical_end_month' => 4,
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => ['id', 'name', 'code', 'typical_start_month', 'typical_end_month'],
            ]);
    }

    // =========================================================================
    // UPDATE VALIDATION TESTS
    // =========================================================================

    public function test_update_allows_partial_data(): void
    {
        $this->actingAsAuthenticatedUser();

        $definition = SeasonDefinition::factory()->create();

        $response = $this->putJson("{$this->endpoint}/{$definition->id}", [
            'description' => 'Mô tả mới',
        ]);

        $response->assertStatus(200);
        $this->assertEquals('Mô tả mới', $response->json('data.description'));
    }

    public function test_update_validates_unique_code_excluding_self(): void
    {
        $this->actingAsAuthenticatedUser();

        $definition1 = SeasonDefinition::factory()->create(['code' => 'XUAN']);
        $definition2 = SeasonDefinition::factory()->create(['code' => 'HE']);

        // Should fail - trying to use existing code
        $response = $this->putJson("{$this->endpoint}/{$definition2->id}", [
            'code' => 'XUAN',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['code']);

        // Should succeed - keeping own code
        $response = $this->putJson("{$this->endpoint}/{$definition1->id}", [
            'code' => 'XUAN',
        ]);

        $response->assertStatus(200);
    }
}
