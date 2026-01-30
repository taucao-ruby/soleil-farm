<?php

use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\ActivityTypeController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CropCycleController;
use App\Http\Controllers\Api\CropCycleStageController;
use App\Http\Controllers\Api\CropTypeController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\LandParcelController;
use App\Http\Controllers\Api\SeasonController;
use App\Http\Controllers\Api\SeasonDefinitionController;
use App\Http\Controllers\Api\UnitOfMeasureController;
use App\Http\Controllers\Api\WaterSourceController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Soleil Farm Management System
|--------------------------------------------------------------------------
|
| API version 1 with proper authentication and rate limiting
|
*/

// =============================================================================
// PUBLIC ROUTES (No authentication required)
// =============================================================================
Route::prefix('v1')->group(function () {

    // Authentication Routes (with stricter rate limiting for security)
    Route::prefix('auth')->middleware('throttle:10,1')->group(function () {
        Route::post('/login', [AuthController::class, 'login'])->name('auth.login');
        Route::post('/register', [AuthController::class, 'register'])->name('auth.register');
    });

});

// =============================================================================
// PROTECTED ROUTES (Authentication required)
// =============================================================================
Route::prefix('v1')->middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {

    // -------------------------------------------------------------------------
    // Authentication Routes (authenticated user actions)
    // -------------------------------------------------------------------------
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout'])->name('auth.logout');
        Route::post('/logout-all', [AuthController::class, 'logoutAll'])->name('auth.logout-all');
        Route::get('/me', [AuthController::class, 'me'])->name('auth.me');
        Route::post('/refresh', [AuthController::class, 'refresh'])->name('auth.refresh');
    });

    // -------------------------------------------------------------------------
    // Dashboard & Statistics
    // -------------------------------------------------------------------------
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard.index');
    Route::get('/dashboard/statistics', [DashboardController::class, 'statistics'])->name('dashboard.statistics');

    // -------------------------------------------------------------------------
    // Units of Measure
    // -------------------------------------------------------------------------
    Route::apiResource('units-of-measure', UnitOfMeasureController::class)->names('units-of-measure');
    Route::get('units-of-measure/type/{type}', [UnitOfMeasureController::class, 'byType'])->name('units-of-measure.by-type');

    // -------------------------------------------------------------------------
    // Season Definitions
    // -------------------------------------------------------------------------
    Route::apiResource('season-definitions', SeasonDefinitionController::class)->names('season-definitions');

    // -------------------------------------------------------------------------
    // Seasons
    // -------------------------------------------------------------------------
    Route::apiResource('seasons', SeasonController::class)->names('seasons');
    Route::get('seasons/year/{year}', [SeasonController::class, 'byYear'])->name('seasons.by-year');
    Route::get('seasons/current', [SeasonController::class, 'current'])->name('seasons.current');

    // -------------------------------------------------------------------------
    // Activity Types
    // -------------------------------------------------------------------------
    Route::apiResource('activity-types', ActivityTypeController::class)->names('activity-types');
    Route::get('activity-types/category/{category}', [ActivityTypeController::class, 'byCategory'])->name('activity-types.by-category');

    // -------------------------------------------------------------------------
    // Land Parcels
    // -------------------------------------------------------------------------
    Route::apiResource('land-parcels', LandParcelController::class)->names('land-parcels');
    Route::get('land-parcels/{landParcel}/water-sources', [LandParcelController::class, 'waterSources'])->name('land-parcels.water-sources');
    Route::post('land-parcels/{landParcel}/water-sources', [LandParcelController::class, 'attachWaterSource'])->name('land-parcels.attach-water-source');
    Route::delete('land-parcels/{landParcel}/water-sources/{waterSource}', [LandParcelController::class, 'detachWaterSource'])->name('land-parcels.detach-water-source');
    Route::get('land-parcels/{landParcel}/crop-cycles', [LandParcelController::class, 'cropCycles'])->name('land-parcels.crop-cycles');
    Route::get('land-parcels/{landParcel}/activity-logs', [LandParcelController::class, 'activityLogs'])->name('land-parcels.activity-logs');

    // -------------------------------------------------------------------------
    // Water Sources
    // -------------------------------------------------------------------------
    Route::apiResource('water-sources', WaterSourceController::class)->names('water-sources');
    Route::get('water-sources/{waterSource}/land-parcels', [WaterSourceController::class, 'landParcels'])->name('water-sources.land-parcels');

    // -------------------------------------------------------------------------
    // Crop Types
    // -------------------------------------------------------------------------
    Route::apiResource('crop-types', CropTypeController::class)->names('crop-types');
    Route::get('crop-types/{cropType}/statistics', [CropTypeController::class, 'statistics'])->name('crop-types.statistics');

    // -------------------------------------------------------------------------
    // Crop Cycles
    // -------------------------------------------------------------------------
    Route::apiResource('crop-cycles', CropCycleController::class)->names('crop-cycles');
    Route::post('crop-cycles/{cropCycle}/activate', [CropCycleController::class, 'activate'])->name('crop-cycles.activate');
    Route::post('crop-cycles/{cropCycle}/complete', [CropCycleController::class, 'complete'])->name('crop-cycles.complete');
    Route::post('crop-cycles/{cropCycle}/fail', [CropCycleController::class, 'fail'])->name('crop-cycles.fail');
    Route::post('crop-cycles/{cropCycle}/abandon', [CropCycleController::class, 'abandon'])->name('crop-cycles.abandon');
    Route::get('crop-cycles/{cropCycle}/stages', [CropCycleStageController::class, 'index'])->name('crop-cycles.stages.index');
    Route::post('crop-cycles/{cropCycle}/stages', [CropCycleStageController::class, 'store'])->name('crop-cycles.stages.store');
    Route::get('crop-cycles/{cropCycle}/activity-logs', [CropCycleController::class, 'activityLogs'])->name('crop-cycles.activity-logs');

    // -------------------------------------------------------------------------
    // Crop Cycle Stages
    // -------------------------------------------------------------------------
    Route::put('crop-cycle-stages/{stage}', [CropCycleStageController::class, 'update'])->name('crop-cycle-stages.update');
    Route::delete('crop-cycle-stages/{stage}', [CropCycleStageController::class, 'destroy'])->name('crop-cycle-stages.destroy');
    Route::post('crop-cycle-stages/{stage}/complete', [CropCycleStageController::class, 'complete'])->name('crop-cycle-stages.complete');
    Route::post('crop-cycle-stages/{stage}/start', [CropCycleStageController::class, 'start'])->name('crop-cycle-stages.start');

    // -------------------------------------------------------------------------
    // Activity Logs (Immutable - read and create only)
    // -------------------------------------------------------------------------
    Route::get('activity-logs', [ActivityLogController::class, 'index'])->name('activity-logs.index');
    Route::post('activity-logs', [ActivityLogController::class, 'store'])->name('activity-logs.store');
    Route::get('activity-logs/{activityLog}', [ActivityLogController::class, 'show'])->name('activity-logs.show');
    Route::get('activity-logs/date/{date}', [ActivityLogController::class, 'byDate'])->name('activity-logs.by-date');
    Route::get('activity-logs/performer/{performer}', [ActivityLogController::class, 'byPerformer'])->name('activity-logs.by-performer');
    Route::get('activity-logs/recent', [ActivityLogController::class, 'recent'])->name('activity-logs.recent');
});
