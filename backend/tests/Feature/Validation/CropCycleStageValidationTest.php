<?php

namespace Tests\Feature\Validation;

use App\Models\CropCycle;
use App\Models\CropCycleStage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CropCycleStageValidationTest extends TestCase
{
    use RefreshDatabase;

    protected CropCycle $cropCycle;

    protected function setUp(): void
    {
        parent::setUp();

        $this->cropCycle = CropCycle::factory()->create([
            'status' => 'active',
        ]);
    }

    protected function getEndpoint(): string
    {
        return "{$this->apiBase}/crop-cycles/{$this->cropCycle->id}/stages";
    }

    // =========================================================================
    // STORE VALIDATION TESTS
    // =========================================================================

    public function test_store_requires_stage_name(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->getEndpoint(), [
            'sequence_order' => 1,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['stage_name']);
    }

    public function test_store_requires_sequence_order(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->getEndpoint(), [
            'stage_name' => 'Giai đoạn 1',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['sequence_order']);
    }

    public function test_store_validates_sequence_order_positive(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->getEndpoint(), [
            'stage_name' => 'Giai đoạn 1',
            'sequence_order' => 0,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['sequence_order']);
    }

    public function test_store_validates_sequence_order_max(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->getEndpoint(), [
            'stage_name' => 'Giai đoạn 1',
            'sequence_order' => 21,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['sequence_order']);
    }

    public function test_store_validates_stage_name_max_length(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->getEndpoint(), [
            'stage_name' => str_repeat('a', 101),
            'sequence_order' => 1,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['stage_name']);
    }

    public function test_store_validates_end_date_after_start_date(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->getEndpoint(), [
            'stage_name' => 'Giai đoạn 1',
            'sequence_order' => 1,
            'planned_start_date' => '2026-06-01',
            'planned_end_date' => '2026-03-01',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['planned_end_date']);
    }

    public function test_store_validates_duplicate_sequence_order(): void
    {
        $this->actingAsAuthenticatedUser();

        // Create existing stage
        CropCycleStage::factory()->create([
            'crop_cycle_id' => $this->cropCycle->id,
            'sequence_order' => 1,
        ]);

        // Try to create stage with same sequence order
        $response = $this->postJson($this->getEndpoint(), [
            'stage_name' => 'Giai đoạn mới',
            'sequence_order' => 1,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['sequence_order']);
    }

    public function test_store_rejects_completed_crop_cycle(): void
    {
        $this->actingAsAuthenticatedUser();

        $completedCycle = CropCycle::factory()->create([
            'status' => 'completed',
        ]);

        $endpoint = "{$this->apiBase}/crop-cycles/{$completedCycle->id}/stages";

        $response = $this->postJson($endpoint, [
            'stage_name' => 'Giai đoạn 1',
            'sequence_order' => 1,
        ]);

        $response->assertStatus(422);
    }

    public function test_store_success_with_valid_data(): void
    {
        $this->actingAsAuthenticatedUser();

        $response = $this->postJson($this->getEndpoint(), [
            'stage_name' => 'Giai đoạn Gieo Sạ',
            'sequence_order' => 1,
            'planned_start_date' => '2026-03-01',
            'planned_end_date' => '2026-03-15',
            'notes' => 'Gieo sạ lúa',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => ['id', 'stage_name', 'sequence_order'],
            ]);
    }

    // =========================================================================
    // UPDATE VALIDATION TESTS
    // =========================================================================

    public function test_update_allows_partial_data(): void
    {
        $this->actingAsAuthenticatedUser();

        $stage = CropCycleStage::factory()->create([
            'crop_cycle_id' => $this->cropCycle->id,
            'status' => 'pending',
        ]);

        $response = $this->putJson("{$this->apiBase}/stages/{$stage->id}", [
            'notes' => 'Ghi chú mới',
        ]);

        $response->assertStatus(200);
        $this->assertEquals('Ghi chú mới', $response->json('data.notes'));
    }

    public function test_update_rejects_completed_stage(): void
    {
        $this->actingAsAuthenticatedUser();

        $stage = CropCycleStage::factory()->create([
            'crop_cycle_id' => $this->cropCycle->id,
            'status' => 'completed',
        ]);

        $response = $this->putJson("{$this->apiBase}/stages/{$stage->id}", [
            'stage_name' => 'Tên mới',
        ]);

        $response->assertStatus(422);
    }

    public function test_update_validates_duplicate_sequence_excluding_self(): void
    {
        $this->actingAsAuthenticatedUser();

        $stage1 = CropCycleStage::factory()->create([
            'crop_cycle_id' => $this->cropCycle->id,
            'sequence_order' => 1,
            'status' => 'pending',
        ]);

        $stage2 = CropCycleStage::factory()->create([
            'crop_cycle_id' => $this->cropCycle->id,
            'sequence_order' => 2,
            'status' => 'pending',
        ]);

        // Should fail - trying to use existing sequence
        $response = $this->putJson("{$this->apiBase}/stages/{$stage2->id}", [
            'sequence_order' => 1,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['sequence_order']);

        // Should succeed - keeping own sequence
        $response = $this->putJson("{$this->apiBase}/stages/{$stage1->id}", [
            'sequence_order' => 1,
        ]);

        $response->assertStatus(200);
    }

    // =========================================================================
    // START STAGE VALIDATION TESTS
    // =========================================================================

    public function test_start_validates_stage_status(): void
    {
        $this->actingAsAuthenticatedUser();

        $stage = CropCycleStage::factory()->create([
            'crop_cycle_id' => $this->cropCycle->id,
            'status' => 'in_progress',
        ]);

        $response = $this->postJson("{$this->apiBase}/stages/{$stage->id}/start", []);

        $response->assertStatus(422);
    }

    public function test_start_validates_crop_cycle_active(): void
    {
        $this->actingAsAuthenticatedUser();

        $plannedCycle = CropCycle::factory()->create([
            'status' => 'planned',
        ]);

        $stage = CropCycleStage::factory()->create([
            'crop_cycle_id' => $plannedCycle->id,
            'status' => 'pending',
        ]);

        $response = $this->postJson("{$this->apiBase}/stages/{$stage->id}/start", []);

        $response->assertStatus(422);
    }

    public function test_start_success_with_pending_stage(): void
    {
        $this->actingAsAuthenticatedUser();

        $stage = CropCycleStage::factory()->create([
            'crop_cycle_id' => $this->cropCycle->id,
            'status' => 'pending',
            'sequence_order' => 1,
        ]);

        $response = $this->postJson("{$this->apiBase}/stages/{$stage->id}/start", [
            'actual_start_date' => '2026-03-01',
        ]);

        $response->assertStatus(200);
        $this->assertEquals('in_progress', $response->json('data.status'));
    }

    // =========================================================================
    // COMPLETE STAGE VALIDATION TESTS
    // =========================================================================

    public function test_complete_validates_stage_in_progress(): void
    {
        $this->actingAsAuthenticatedUser();

        $stage = CropCycleStage::factory()->create([
            'crop_cycle_id' => $this->cropCycle->id,
            'status' => 'pending',
        ]);

        $response = $this->postJson("{$this->apiBase}/stages/{$stage->id}/complete", []);

        $response->assertStatus(422);
    }

    public function test_complete_success_with_in_progress_stage(): void
    {
        $this->actingAsAuthenticatedUser();

        $stage = CropCycleStage::factory()->create([
            'crop_cycle_id' => $this->cropCycle->id,
            'status' => 'in_progress',
            'actual_start_date' => '2026-03-01',
        ]);

        $response = $this->postJson("{$this->apiBase}/stages/{$stage->id}/complete", [
            'actual_end_date' => '2026-03-15',
        ]);

        $response->assertStatus(200);
        $this->assertEquals('completed', $response->json('data.status'));
    }
}
