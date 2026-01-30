<?php

namespace Tests\Feature\Filters;

use App\Models\LandParcel;
use Tests\TestCase;

class LandParcelFiltersTest extends TestCase
{
    /**
     * @test
     */
    public function land_parcels_can_be_filtered_by_soil_type(): void
    {
        LandParcel::factory()->count(5)->create(['soil_type' => 'alluvial']);
        LandParcel::factory()->count(3)->create(['soil_type' => 'sandy']);

        $response = $this->actingAsAuthenticatedUser()
            ->getJson("{$this->apiBase}/land-parcels?soil_type=alluvial");

        $response->assertOk()
            ->assertJsonPath('meta.total', 5);
    }

    /**
     * @test
     */
    public function land_parcels_can_be_filtered_by_land_type(): void
    {
        LandParcel::factory()->count(8)->create(['land_type' => 'rice_field']);
        LandParcel::factory()->count(4)->create(['land_type' => 'garden']);

        $response = $this->actingAsAuthenticatedUser()
            ->getJson("{$this->apiBase}/land-parcels?land_type=rice_field");

        $response->assertOk()
            ->assertJsonPath('meta.total', 8);
    }

    /**
     * @test
     */
    public function land_parcels_can_be_filtered_by_terrain_type(): void
    {
        LandParcel::factory()->count(6)->create(['terrain_type' => 'flat']);
        LandParcel::factory()->count(2)->create(['terrain_type' => 'sloped']);

        $response = $this->actingAsAuthenticatedUser()
            ->getJson("{$this->apiBase}/land-parcels?terrain_type=flat");

        $response->assertOk()
            ->assertJsonPath('meta.total', 6);
    }

    /**
     * @test
     */
    public function land_parcels_can_be_searched_by_name(): void
    {
        LandParcel::factory()->create(['name' => 'Ruộng Đông Lớn']);
        LandParcel::factory()->create(['name' => 'Vườn Tây']);
        LandParcel::factory()->create(['name' => 'Ruộng Bắc']);

        $response = $this->actingAsAuthenticatedUser()
            ->getJson("{$this->apiBase}/land-parcels?search=" . urlencode('Ruộng'));

        $response->assertOk()
            ->assertJsonPath('meta.total', 2);
    }

    /**
     * @test
     */
    public function land_parcels_can_be_searched_by_code(): void
    {
        LandParcel::factory()->create(['code' => 'LD-0001']);
        LandParcel::factory()->create(['code' => 'LD-0002']);
        LandParcel::factory()->create(['code' => 'VR-0001']);

        $response = $this->actingAsAuthenticatedUser()
            ->getJson("{$this->apiBase}/land-parcels?search=LD-");

        $response->assertOk()
            ->assertJsonPath('meta.total', 2);
    }

    /**
     * @test
     */
    public function land_parcels_can_be_filtered_by_active_status(): void
    {
        LandParcel::factory()->active()->count(7)->create();
        LandParcel::factory()->inactive()->count(3)->create();

        $response = $this->actingAsAuthenticatedUser()
            ->getJson("{$this->apiBase}/land-parcels?is_active=true");

        $response->assertOk()
            ->assertJsonPath('meta.total', 7);

        $responseInactive = $this->actingAsAuthenticatedUser()
            ->getJson("{$this->apiBase}/land-parcels?is_active=false");

        $responseInactive->assertOk()
            ->assertJsonPath('meta.total', 3);
    }

    /**
     * @test
     */
    public function land_parcels_can_be_sorted_by_area(): void
    {
        LandParcel::factory()->create(['area_value' => 1000]);
        LandParcel::factory()->create(['area_value' => 500]);
        LandParcel::factory()->create(['area_value' => 2000]);

        $response = $this->actingAsAuthenticatedUser()
            ->getJson("{$this->apiBase}/land-parcels?sort_by=area_value&sort_order=asc");

        $response->assertOk();

        $data = $response->json('data');
        $this->assertEquals(500, $data[0]['area_value']);
    }

    /**
     * @test
     */
    public function land_parcels_can_be_sorted_descending(): void
    {
        LandParcel::factory()->create(['area_value' => 1000]);
        LandParcel::factory()->create(['area_value' => 500]);
        LandParcel::factory()->create(['area_value' => 2000]);

        $response = $this->actingAsAuthenticatedUser()
            ->getJson("{$this->apiBase}/land-parcels?sort_by=area_value&sort_order=desc");

        $response->assertOk();

        $data = $response->json('data');
        $this->assertEquals(2000, $data[0]['area_value']);
    }

    /**
     * @test
     */
    public function land_parcels_invalid_sort_field_uses_default(): void
    {
        LandParcel::factory()->count(3)->create();

        $response = $this->actingAsAuthenticatedUser()
            ->getJson("{$this->apiBase}/land-parcels?sort_by=invalid_field&sort_order=asc");

        $response->assertOk();
        // Should not error and return results with default sort
        $this->assertCount(3, $response->json('data'));
    }

    /**
     * @test
     */
    public function land_parcels_can_combine_filter_search_and_sort(): void
    {
        LandParcel::factory()->create([
            'name' => 'Ruộng A',
            'land_type' => 'rice_field',
            'area_value' => 1000,
        ]);
        LandParcel::factory()->create([
            'name' => 'Ruộng B',
            'land_type' => 'rice_field',
            'area_value' => 2000,
        ]);
        LandParcel::factory()->create([
            'name' => 'Vườn C',
            'land_type' => 'garden',
            'area_value' => 500,
        ]);

        $response = $this->actingAsAuthenticatedUser()
            ->getJson("{$this->apiBase}/land-parcels?land_type=rice_field&search=" . urlencode('Ruộng') . "&sort_by=area_value&sort_order=desc");

        $response->assertOk()
            ->assertJsonPath('meta.total', 2);

        $data = $response->json('data');
        $this->assertEquals(2000, $data[0]['area_value']);
    }
}
