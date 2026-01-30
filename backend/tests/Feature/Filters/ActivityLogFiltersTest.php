<?php

namespace Tests\Feature\Filters;

use App\Models\ActivityLog;
use App\Models\ActivityType;
use App\Models\CropCycle;
use App\Models\LandParcel;
use Tests\TestCase;

class ActivityLogFiltersTest extends TestCase
{
    private LandParcel $landParcel;
    private ActivityType $activityType;

    protected function setUp(): void
    {
        parent::setUp();
        $this->landParcel = LandParcel::factory()->create();
        $this->activityType = ActivityType::first() ?? ActivityType::factory()->create();
    }

    /**
     * @test
     */
    public function activity_logs_can_be_filtered_by_activity_type(): void
    {
        $activityType1 = ActivityType::factory()->create();
        $activityType2 = ActivityType::factory()->create();

        ActivityLog::factory()->count(5)->create([
            'land_parcel_id' => $this->landParcel->id,
            'activity_type_id' => $activityType1->id,
        ]);
        ActivityLog::factory()->count(3)->create([
            'land_parcel_id' => $this->landParcel->id,
            'activity_type_id' => $activityType2->id,
        ]);

        $response = $this->actingAsAuthenticatedUser()
            ->getJson("{$this->apiBase}/activity-logs?activity_type_id={$activityType1->id}");

        $response->assertOk()
            ->assertJsonPath('meta.total', 5);
    }

    /**
     * @test
     */
    public function activity_logs_can_be_filtered_by_land_parcel(): void
    {
        $landParcel1 = LandParcel::factory()->create();
        $landParcel2 = LandParcel::factory()->create();

        ActivityLog::factory()->count(4)->create([
            'land_parcel_id' => $landParcel1->id,
            'activity_type_id' => $this->activityType->id,
        ]);
        ActivityLog::factory()->count(6)->create([
            'land_parcel_id' => $landParcel2->id,
            'activity_type_id' => $this->activityType->id,
        ]);

        $response = $this->actingAsAuthenticatedUser()
            ->getJson("{$this->apiBase}/activity-logs?land_parcel_id={$landParcel1->id}");

        $response->assertOk()
            ->assertJsonPath('meta.total', 4);
    }

    /**
     * @test
     */
    public function activity_logs_can_be_filtered_by_crop_cycle(): void
    {
        $cropCycle1 = CropCycle::factory()->create();
        $cropCycle2 = CropCycle::factory()->create();

        ActivityLog::factory()->count(7)->create([
            'land_parcel_id' => $this->landParcel->id,
            'activity_type_id' => $this->activityType->id,
            'crop_cycle_id' => $cropCycle1->id,
        ]);
        ActivityLog::factory()->count(2)->create([
            'land_parcel_id' => $this->landParcel->id,
            'activity_type_id' => $this->activityType->id,
            'crop_cycle_id' => $cropCycle2->id,
        ]);

        $response = $this->actingAsAuthenticatedUser()
            ->getJson("{$this->apiBase}/activity-logs?crop_cycle_id={$cropCycle1->id}");

        $response->assertOk()
            ->assertJsonPath('meta.total', 7);
    }

    /**
     * @test
     */
    public function activity_logs_can_be_filtered_by_performer(): void
    {
        ActivityLog::factory()->count(5)->create([
            'land_parcel_id' => $this->landParcel->id,
            'activity_type_id' => $this->activityType->id,
            'performed_by' => 'Nguyễn Văn A',
        ]);
        ActivityLog::factory()->count(3)->create([
            'land_parcel_id' => $this->landParcel->id,
            'activity_type_id' => $this->activityType->id,
            'performed_by' => 'Trần Văn B',
        ]);

        $response = $this->actingAsAuthenticatedUser()
            ->getJson("{$this->apiBase}/activity-logs?performed_by=" . urlencode('Nguyễn Văn A'));

        $response->assertOk()
            ->assertJsonPath('meta.total', 5);
    }

    /**
     * @test
     */
    public function activity_logs_can_be_filtered_by_date_from(): void
    {
        ActivityLog::factory()->create([
            'land_parcel_id' => $this->landParcel->id,
            'activity_type_id' => $this->activityType->id,
            'activity_date' => '2025-01-15',
        ]);
        ActivityLog::factory()->create([
            'land_parcel_id' => $this->landParcel->id,
            'activity_type_id' => $this->activityType->id,
            'activity_date' => '2025-02-20',
        ]);

        $response = $this->actingAsAuthenticatedUser()
            ->getJson("{$this->apiBase}/activity-logs?date_from=2025-02-01");

        $response->assertOk()
            ->assertJsonPath('meta.total', 1);
    }

    /**
     * @test
     */
    public function activity_logs_can_be_filtered_by_date_range(): void
    {
        ActivityLog::factory()->create([
            'land_parcel_id' => $this->landParcel->id,
            'activity_type_id' => $this->activityType->id,
            'activity_date' => '2025-01-10',
        ]);
        ActivityLog::factory()->create([
            'land_parcel_id' => $this->landParcel->id,
            'activity_type_id' => $this->activityType->id,
            'activity_date' => '2025-01-20',
        ]);
        ActivityLog::factory()->create([
            'land_parcel_id' => $this->landParcel->id,
            'activity_type_id' => $this->activityType->id,
            'activity_date' => '2025-02-05',
        ]);

        $response = $this->actingAsAuthenticatedUser()
            ->getJson("{$this->apiBase}/activity-logs?date_from=2025-01-15&date_to=2025-01-31");

        $response->assertOk()
            ->assertJsonPath('meta.total', 1);
    }

    /**
     * @test
     */
    public function activity_logs_can_be_searched_by_description(): void
    {
        ActivityLog::factory()->create([
            'land_parcel_id' => $this->landParcel->id,
            'activity_type_id' => $this->activityType->id,
            'description' => 'Tưới nước buổi sáng',
        ]);
        ActivityLog::factory()->create([
            'land_parcel_id' => $this->landParcel->id,
            'activity_type_id' => $this->activityType->id,
            'description' => 'Bón phân NPK',
        ]);
        ActivityLog::factory()->create([
            'land_parcel_id' => $this->landParcel->id,
            'activity_type_id' => $this->activityType->id,
            'description' => 'Tưới nước buổi chiều',
        ]);

        $response = $this->actingAsAuthenticatedUser()
            ->getJson("{$this->apiBase}/activity-logs?search=" . urlencode('Tưới'));

        $response->assertOk()
            ->assertJsonPath('meta.total', 2);
    }

    /**
     * @test
     */
    public function activity_logs_can_be_sorted_by_activity_date(): void
    {
        ActivityLog::factory()->create([
            'land_parcel_id' => $this->landParcel->id,
            'activity_type_id' => $this->activityType->id,
            'activity_date' => '2025-01-15',
        ]);
        ActivityLog::factory()->create([
            'land_parcel_id' => $this->landParcel->id,
            'activity_type_id' => $this->activityType->id,
            'activity_date' => '2025-01-10',
        ]);
        ActivityLog::factory()->create([
            'land_parcel_id' => $this->landParcel->id,
            'activity_type_id' => $this->activityType->id,
            'activity_date' => '2025-01-20',
        ]);

        $response = $this->actingAsAuthenticatedUser()
            ->getJson("{$this->apiBase}/activity-logs?sort_by=activity_date&sort_order=asc");

        $response->assertOk();

        $data = $response->json('data');
        $this->assertEquals('2025-01-10', $data[0]['activity_date']);
    }

    /**
     * @test
     */
    public function activity_logs_default_sort_is_desc_by_activity_date(): void
    {
        ActivityLog::factory()->create([
            'land_parcel_id' => $this->landParcel->id,
            'activity_type_id' => $this->activityType->id,
            'activity_date' => '2025-01-15',
        ]);
        ActivityLog::factory()->create([
            'land_parcel_id' => $this->landParcel->id,
            'activity_type_id' => $this->activityType->id,
            'activity_date' => '2025-01-20',
        ]);

        $response = $this->actingAsAuthenticatedUser()
            ->getJson("{$this->apiBase}/activity-logs");

        $response->assertOk();

        $data = $response->json('data');
        $this->assertEquals('2025-01-20', $data[0]['activity_date']);
    }
}
