<?php

namespace Tests\Feature\Filters;

use App\Models\CropCycle;
use App\Models\LandParcel;
use App\Models\Season;
use App\Models\CropType;
use Tests\TestCase;

class CropCycleFiltersTest extends TestCase
{
    /**
     * @test
     */
    public function crop_cycles_can_be_filtered_by_status(): void
    {
        CropCycle::factory()->active()->count(5)->create();
        CropCycle::factory()->completed()->count(10)->create();

        $response = $this->actingAsAuthenticatedUser()
            ->getJson("{$this->apiBase}/crop-cycles?status=active");

        $response->assertOk()
            ->assertJsonPath('meta.total', 5);
    }

    /**
     * @test
     */
    public function crop_cycles_can_be_filtered_by_land_parcel(): void
    {
        $landParcel1 = LandParcel::factory()->create();
        $landParcel2 = LandParcel::factory()->create();

        CropCycle::factory()->count(3)->create(['land_parcel_id' => $landParcel1->id]);
        CropCycle::factory()->count(7)->create(['land_parcel_id' => $landParcel2->id]);

        $response = $this->actingAsAuthenticatedUser()
            ->getJson("{$this->apiBase}/crop-cycles?land_parcel_id={$landParcel1->id}");

        $response->assertOk()
            ->assertJsonPath('meta.total', 3);
    }

    /**
     * @test
     */
    public function crop_cycles_can_be_filtered_by_date_range(): void
    {
        CropCycle::factory()->create([
            'planned_start_date' => '2025-01-01',
            'planned_end_date' => '2025-03-01',
        ]);

        CropCycle::factory()->create([
            'planned_start_date' => '2025-06-01',
            'planned_end_date' => '2025-08-01',
        ]);

        $response = $this->actingAsAuthenticatedUser()
            ->getJson("{$this->apiBase}/crop-cycles?start_date=2025-05-01");

        $response->assertOk()
            ->assertJsonPath('meta.total', 1);
    }

    /**
     * @test
     */
    public function crop_cycles_can_be_filtered_by_end_date(): void
    {
        CropCycle::factory()->create([
            'planned_start_date' => '2025-01-01',
            'planned_end_date' => '2025-03-01',
        ]);

        CropCycle::factory()->create([
            'planned_start_date' => '2025-04-01',
            'planned_end_date' => '2025-06-01',
        ]);

        $response = $this->actingAsAuthenticatedUser()
            ->getJson("{$this->apiBase}/crop-cycles?end_date=2025-04-01");

        $response->assertOk()
            ->assertJsonPath('meta.total', 1);
    }

    /**
     * @test
     */
    public function crop_cycles_can_be_searched_by_code(): void
    {
        CropCycle::factory()->create(['cycle_code' => 'VM-2025-001']);
        CropCycle::factory()->create(['cycle_code' => 'VM-2025-002']);
        CropCycle::factory()->create(['cycle_code' => 'ABC-2025-003']);

        $response = $this->actingAsAuthenticatedUser()
            ->getJson("{$this->apiBase}/crop-cycles?search=VM-2025");

        $response->assertOk()
            ->assertJsonPath('meta.total', 2);
    }

    /**
     * @test
     */
    public function crop_cycles_can_be_sorted_by_status(): void
    {
        CropCycle::factory()->active()->create();
        CropCycle::factory()->completed()->create();
        CropCycle::factory()->planned()->create();

        $response = $this->actingAsAuthenticatedUser()
            ->getJson("{$this->apiBase}/crop-cycles?sort_by=status&sort_order=asc");

        $response->assertOk();

        $data = $response->json('data');
        $this->assertCount(3, $data);
    }

    /**
     * @test
     */
    public function crop_cycles_can_combine_multiple_filters(): void
    {
        $landParcel = LandParcel::factory()->create();

        CropCycle::factory()->active()->count(3)->create([
            'land_parcel_id' => $landParcel->id,
            'planned_start_date' => '2025-01-15',
        ]);

        CropCycle::factory()->completed()->count(2)->create([
            'land_parcel_id' => $landParcel->id,
        ]);

        CropCycle::factory()->active()->count(5)->create();

        $response = $this->actingAsAuthenticatedUser()
            ->getJson("{$this->apiBase}/crop-cycles?status=active&land_parcel_id={$landParcel->id}");

        $response->assertOk()
            ->assertJsonPath('meta.total', 3);
    }

    /**
     * @test
     */
    public function crop_cycles_filter_with_pagination(): void
    {
        CropCycle::factory()->active()->count(25)->create();
        CropCycle::factory()->completed()->count(10)->create();

        $response = $this->actingAsAuthenticatedUser()
            ->getJson("{$this->apiBase}/crop-cycles?status=active&per_page=10&page=2");

        $response->assertOk()
            ->assertJsonPath('meta.total', 25)
            ->assertJsonPath('meta.current_page', 2)
            ->assertJsonCount(10, 'data');
    }

    /**
     * @test
     */
    public function crop_cycles_default_sort_by_planned_start_date(): void
    {
        CropCycle::factory()->create(['planned_start_date' => '2025-01-01']);
        CropCycle::factory()->create(['planned_start_date' => '2025-06-01']);
        CropCycle::factory()->create(['planned_start_date' => '2025-03-01']);

        $response = $this->actingAsAuthenticatedUser()
            ->getJson("{$this->apiBase}/crop-cycles");

        $response->assertOk();

        $data = $response->json('data');
        // Default is desc, so latest first
        $this->assertEquals('2025-06-01', $data[0]['planned_start_date']);
    }
}
