<?php

namespace Tests\Feature\Validation;

use App\Models\Season;
use App\Models\SeasonDefinition;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SeasonValidationTest extends TestCase
{
    use RefreshDatabase;

    protected string $endpoint;
    protected SeasonDefinition $seasonDefinition;

    protected function setUp(): void
    {
        parent::setUp();

        $this->endpoint = "{$this->apiBase}/seasons";
        $this->seasonDefinition = SeasonDefinition::factory()->create();
    }

    // =========================================================================
    // STORE VALIDATION TESTS
    // =========================================================================

    public function test_store_requires_season_definition_id(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'year' => 2026,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['season_definition_id']);
    }

    public function test_store_requires_year(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'season_definition_id' => $this->seasonDefinition->id,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['year']);
    }

    public function test_store_validates_season_definition_exists(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'season_definition_id' => 99999,
            'year' => 2026,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['season_definition_id']);
    }

    public function test_store_validates_inactive_season_definition(): void
    {
        $this->actingAsAuthenticatedUser();

        $inactiveDefinition = SeasonDefinition::factory()->create(['is_active' => false]);

        $response = $this->postJson($this->endpoint, [
            'season_definition_id' => $inactiveDefinition->id,
            'year' => 2026,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['season_definition_id']);
    }

    public function test_store_validates_year_range(): void
    {
        $this->actingAsAuthenticatedUser();

        // Year too low
        $response = $this->postJson($this->endpoint, [
            'season_definition_id' => $this->seasonDefinition->id,
            'year' => 1999,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['year']);

        // Year too high
        $response = $this->postJson($this->endpoint, [
            'season_definition_id' => $this->seasonDefinition->id,
            'year' => 2101,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['year']);
    }

    public function test_store_validates_duplicate_season(): void
    {
        $this->actingAsAuthenticatedUser();

        // Create existing season
        Season::factory()->create([
            'season_definition_id' => $this->seasonDefinition->id,
            'year' => 2026,
        ]);

        // Try to create duplicate
        $response = $this->postJson($this->endpoint, [
            'season_definition_id' => $this->seasonDefinition->id,
            'year' => 2026,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['year']);
    }

    public function test_store_validates_end_date_after_start_date(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'season_definition_id' => $this->seasonDefinition->id,
            'year' => 2026,
            'actual_start_date' => '2026-06-01',
            'actual_end_date' => '2026-03-01',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['actual_end_date']);
    }

    public function test_store_success_with_valid_data(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->endpoint, [
            'season_definition_id' => $this->seasonDefinition->id,
            'year' => 2026,
            'actual_start_date' => '2026-02-15',
            'actual_end_date' => '2026-06-15',
            'notes' => 'Mùa vụ xuân 2026',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => ['id', 'year'],
            ]);
    }

    // =========================================================================
    // UPDATE VALIDATION TESTS
    // =========================================================================

    public function test_update_allows_partial_data(): void
    {
        $this->actingAsAuthenticatedUser();

        $season = Season::factory()->create();

        $response = $this->putJson("{$this->endpoint}/{$season->id}", [
            'notes' => 'Ghi chú mới',
        ]);

        $response->assertStatus(200);
        $this->assertEquals('Ghi chú mới', $response->json('data.notes'));
    }

    public function test_update_validates_duplicate_excluding_self(): void
    {
        $this->actingAsAuthenticatedUser();

        $season1 = Season::factory()->create([
            'season_definition_id' => $this->seasonDefinition->id,
            'year' => 2025,
        ]);

        $season2 = Season::factory()->create([
            'season_definition_id' => $this->seasonDefinition->id,
            'year' => 2026,
        ]);

        // Should fail - trying to use existing year for same definition
        $response = $this->putJson("{$this->endpoint}/{$season2->id}", [
            'year' => 2025,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['year']);

        // Should succeed - keeping own year
        $response = $this->putJson("{$this->endpoint}/{$season1->id}", [
            'year' => 2025,
        ]);

        $response->assertStatus(200);
    }
}
