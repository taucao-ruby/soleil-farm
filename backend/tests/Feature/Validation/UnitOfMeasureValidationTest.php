<?php

namespace Tests\Feature\Validation;

use App\Models\UnitOfMeasure;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UnitOfMeasureValidationTest extends TestCase
{
    use RefreshDatabase;

    protected string $endpoint;

    protected function setUp(): void
    {
        parent::setUp();

        $this->endpoint = "{$this->apiBase}/units-of-measure";
    }

    // =========================================================================
    // STORE VALIDATION TESTS
    // =========================================================================

    public function test_store_requires_name(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'abbreviation' => 'kg',
            'unit_type' => 'weight',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_store_requires_abbreviation(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'name' => 'Kilogram',
            'unit_type' => 'weight',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['abbreviation']);
    }

    public function test_store_requires_unit_type(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'name' => 'Kilogram',
            'abbreviation' => 'kg',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['unit_type']);
    }

    public function test_store_validates_unit_type_enum(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'name' => 'Kilogram',
            'abbreviation' => 'kg',
            'unit_type' => 'invalid_type',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['unit_type']);
    }

    public function test_store_validates_all_unit_type_values(): void
    {
        $this->actingAsAuthenticatedUser();

        $validTypes = [
            'area',
            'weight',
            'volume',
            'quantity',
            'currency',
            'time',
        ];

        foreach ($validTypes as $index => $type) {
            $response = $this->postJson($this->endpoint, [
                'name' => "Unit {$index}",
                'abbreviation' => "u{$index}",
                'unit_type' => $type,
            ]);

            $response->assertStatus(201);
        }
    }

    public function test_store_validates_name_max_length(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'name' => str_repeat('a', 51),
            'abbreviation' => 'kg',
            'unit_type' => 'weight',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_store_validates_abbreviation_max_length(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'name' => 'Kilogram',
            'abbreviation' => str_repeat('a', 21),
            'unit_type' => 'weight',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['abbreviation']);
    }

    public function test_store_validates_conversion_factor_positive(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'name' => 'Kilogram',
            'abbreviation' => 'kg',
            'unit_type' => 'weight',
            'conversion_factor_to_base' => -1,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['conversion_factor_to_base']);
    }

    public function test_store_success_with_valid_data(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'name' => 'Tấn',
            'abbreviation' => 'tấn',
            'unit_type' => 'weight',
            'conversion_factor_to_base' => 1000,
            'is_base_unit' => false,
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => ['id', 'name', 'abbreviation', 'unit_type'],
            ]);
    }

    public function test_store_sets_default_values(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'name' => 'Gram',
            'abbreviation' => 'g',
            'unit_type' => 'weight',
        ]);

        $response->assertStatus(201);
        $this->assertTrue($response->json('data.is_active'));
    }

    // =========================================================================
    // UPDATE VALIDATION TESTS
    // =========================================================================

    public function test_update_allows_partial_data(): void
    {
        $this->actingAsAuthenticatedUser();

        $unit = UnitOfMeasure::factory()->create();

        $response = $this->putJson("{$this->endpoint}/{$unit->id}", [
            'name' => 'Tên Mới',
        ]);

        $response->assertStatus(200);
        $this->assertEquals('Tên Mới', $response->json('data.name'));
    }

    public function test_update_validates_conversion_factor(): void
    {
        $this->actingAsAuthenticatedUser();

        $unit = UnitOfMeasure::factory()->create();

        $response = $this->putJson("{$this->endpoint}/{$unit->id}", [
            'conversion_factor_to_base' => 0,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['conversion_factor_to_base']);
    }
}
