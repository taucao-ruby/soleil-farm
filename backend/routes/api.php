<?php

use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\ActivityTypeController;
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
*/

// API version 1
Route::prefix('v1')->group(function () {

    // Dashboard & Statistics
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/dashboard/statistics', [DashboardController::class, 'statistics']);

    // Units of Measure
    Route::apiResource('units-of-measure', UnitOfMeasureController::class);
    Route::get('units-of-measure/type/{type}', [UnitOfMeasureController::class, 'byType']);

    // Season Definitions
    Route::apiResource('season-definitions', SeasonDefinitionController::class);

    // Seasons
    Route::apiResource('seasons', SeasonController::class);
    Route::get('seasons/year/{year}', [SeasonController::class, 'byYear']);
    Route::get('seasons/current', [SeasonController::class, 'current']);

    // Activity Types
    Route::apiResource('activity-types', ActivityTypeController::class);
    Route::get('activity-types/category/{category}', [ActivityTypeController::class, 'byCategory']);

    // Land Parcels
    Route::apiResource('land-parcels', LandParcelController::class);
    Route::get('land-parcels/{landParcel}/water-sources', [LandParcelController::class, 'waterSources']);
    Route::post('land-parcels/{landParcel}/water-sources', [LandParcelController::class, 'attachWaterSource']);
    Route::delete('land-parcels/{landParcel}/water-sources/{waterSource}', [LandParcelController::class, 'detachWaterSource']);
    Route::get('land-parcels/{landParcel}/crop-cycles', [LandParcelController::class, 'cropCycles']);
    Route::get('land-parcels/{landParcel}/activity-logs', [LandParcelController::class, 'activityLogs']);

    // Water Sources
    Route::apiResource('water-sources', WaterSourceController::class);
    Route::get('water-sources/{waterSource}/land-parcels', [WaterSourceController::class, 'landParcels']);

    // Crop Types
    Route::apiResource('crop-types', CropTypeController::class);
    Route::get('crop-types/{cropType}/statistics', [CropTypeController::class, 'statistics']);

    // Crop Cycles
    Route::apiResource('crop-cycles', CropCycleController::class);
    Route::post('crop-cycles/{cropCycle}/activate', [CropCycleController::class, 'activate']);
    Route::post('crop-cycles/{cropCycle}/complete', [CropCycleController::class, 'complete']);
    Route::post('crop-cycles/{cropCycle}/fail', [CropCycleController::class, 'fail']);
    Route::post('crop-cycles/{cropCycle}/abandon', [CropCycleController::class, 'abandon']);
    Route::get('crop-cycles/{cropCycle}/stages', [CropCycleStageController::class, 'index']);
    Route::post('crop-cycles/{cropCycle}/stages', [CropCycleStageController::class, 'store']);
    Route::get('crop-cycles/{cropCycle}/activity-logs', [CropCycleController::class, 'activityLogs']);

    // Crop Cycle Stages
    Route::put('crop-cycle-stages/{stage}', [CropCycleStageController::class, 'update']);
    Route::delete('crop-cycle-stages/{stage}', [CropCycleStageController::class, 'destroy']);
    Route::post('crop-cycle-stages/{stage}/complete', [CropCycleStageController::class, 'complete']);
    Route::post('crop-cycle-stages/{stage}/start', [CropCycleStageController::class, 'start']);

    // Activity Logs (Immutable)
    Route::get('activity-logs', [ActivityLogController::class, 'index']);
    Route::post('activity-logs', [ActivityLogController::class, 'store']);
    Route::get('activity-logs/{activityLog}', [ActivityLogController::class, 'show']);
    Route::get('activity-logs/date/{date}', [ActivityLogController::class, 'byDate']);
    Route::get('activity-logs/performer/{performer}', [ActivityLogController::class, 'byPerformer']);
    Route::get('activity-logs/recent', [ActivityLogController::class, 'recent']);
});
