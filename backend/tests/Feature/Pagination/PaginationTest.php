<?php

namespace Tests\Feature\Pagination;

use App\Models\LandParcel;
use App\Models\CropCycle;
use App\Models\ActivityLog;
use App\Models\ActivityType;
use Tests\TestCase;

class PaginationTest extends TestCase
{
    /**
     * @test
     */
    public function land_parcels_can_be_paginated(): void
    {
        LandParcel::factory()->count(50)->create();

        $response = $this->actingAsAuthenticatedUser()
            ->getJson("{$this->apiBase}/land-parcels?per_page=10");

        $response->assertOk()
            ->assertJsonStructure([
                'data',
                'meta' => ['current_page', 'last_page', 'per_page', 'total', 'from', 'to'],
                'links' => ['first', 'last', 'prev', 'next'],
            ])
            ->assertJsonPath('meta.per_page', 10)
            ->assertJsonPath('meta.total', 50)
            ->assertJsonPath('meta.last_page', 5)
            ->assertJsonCount(10, 'data');
    }

    /**
     * @test
     */
    public function pagination_respects_max_per_page_limit(): void
    {
        LandParcel::factory()->count(150)->create();

        $response = $this->actingAsAuthenticatedUser()
            ->getJson("{$this->apiBase}/land-parcels?per_page=200");

        $response->assertOk()
            ->assertJsonPath('meta.per_page', 100); // Capped at max
    }

    /**
     * @test
     */
    public function pagination_uses_default_when_not_specified(): void
    {
        LandParcel::factory()->count(30)->create();

        $response = $this->actingAsAuthenticatedUser()
            ->getJson("{$this->apiBase}/land-parcels");

        $response->assertOk()
            ->assertJsonPath('meta.per_page', 15); // Default per_page
    }

    /**
     * @test
     */
    public function pagination_handles_page_navigation(): void
    {
        LandParcel::factory()->count(30)->create();

        $response = $this->actingAsAuthenticatedUser()
            ->getJson("{$this->apiBase}/land-parcels?per_page=10&page=2");

        $response->assertOk()
            ->assertJsonPath('meta.current_page', 2)
            ->assertJsonPath('meta.from', 11)
            ->assertJsonPath('meta.to', 20);
    }

    /**
     * @test
     */
    public function pagination_works_with_filters(): void
    {
        LandParcel::factory()->count(30)->create(['land_type' => 'rice_field']);
        LandParcel::factory()->count(20)->create(['land_type' => 'garden']);

        $response = $this->actingAsAuthenticatedUser()
            ->getJson("{$this->apiBase}/land-parcels?land_type=rice_field&per_page=10");

        $response->assertOk()
            ->assertJsonPath('meta.total', 30)
            ->assertJsonPath('meta.last_page', 3)
            ->assertJsonCount(10, 'data');
    }

    /**
     * @test
     */
    public function crop_cycles_can_be_paginated(): void
    {
        CropCycle::factory()->count(40)->create();

        $response = $this->actingAsAuthenticatedUser()
            ->getJson("{$this->apiBase}/crop-cycles?per_page=10");

        $response->assertOk()
            ->assertJsonStructure([
                'data',
                'meta' => ['current_page', 'last_page', 'per_page', 'total', 'from', 'to'],
                'links' => ['first', 'last', 'prev', 'next'],
            ])
            ->assertJsonPath('meta.per_page', 10)
            ->assertJsonPath('meta.total', 40)
            ->assertJsonCount(10, 'data');
    }

    /**
     * @test
     */
    public function activity_logs_can_be_paginated(): void
    {
        $landParcel = LandParcel::factory()->create();
        $activityType = ActivityType::first() ?? ActivityType::factory()->create();

        ActivityLog::factory()->count(35)->create([
            'land_parcel_id' => $landParcel->id,
            'activity_type_id' => $activityType->id,
        ]);

        $response = $this->actingAsAuthenticatedUser()
            ->getJson("{$this->apiBase}/activity-logs?per_page=10");

        $response->assertOk()
            ->assertJsonStructure([
                'data',
                'meta' => ['current_page', 'last_page', 'per_page', 'total', 'from', 'to'],
                'links' => ['first', 'last', 'prev', 'next'],
            ])
            ->assertJsonPath('meta.per_page', 10)
            ->assertJsonPath('meta.total', 35)
            ->assertJsonCount(10, 'data');
    }

    /**
     * @test
     */
    public function pagination_links_are_valid_urls(): void
    {
        LandParcel::factory()->count(30)->create();

        $response = $this->actingAsAuthenticatedUser()
            ->getJson("{$this->apiBase}/land-parcels?per_page=10");

        $response->assertOk();

        $links = $response->json('links');

        $this->assertNotNull($links['first']);
        $this->assertNotNull($links['last']);
        $this->assertNull($links['prev']); // First page has no prev
        $this->assertNotNull($links['next']);
        $this->assertStringContainsString('page=', $links['first']);
    }

    /**
     * @test
     */
    public function pagination_handles_empty_results(): void
    {
        $response = $this->actingAsAuthenticatedUser()
            ->getJson("{$this->apiBase}/land-parcels?per_page=10");

        $response->assertOk()
            ->assertJsonPath('meta.total', 0)
            ->assertJsonPath('meta.current_page', 1)
            ->assertJsonPath('meta.last_page', 1)
            ->assertJsonCount(0, 'data');
    }

    /**
     * @test
     */
    public function pagination_minimum_per_page_is_one(): void
    {
        LandParcel::factory()->count(10)->create();

        $response = $this->actingAsAuthenticatedUser()
            ->getJson("{$this->apiBase}/land-parcels?per_page=0");

        $response->assertOk()
            ->assertJsonPath('meta.per_page', 1); // Minimum enforced
    }

    /**
     * @test
     */
    public function pagination_handles_negative_per_page(): void
    {
        LandParcel::factory()->count(10)->create();

        $response = $this->actingAsAuthenticatedUser()
            ->getJson("{$this->apiBase}/land-parcels?per_page=-5");

        $response->assertOk()
            ->assertJsonPath('meta.per_page', 1); // Minimum enforced
    }
}
