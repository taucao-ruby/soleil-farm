<?php

namespace App\Http\Requests\CropCycle;

use App\Models\CropCycle;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Request validation cho cập nhật vụ mùa.
 *
 * Validates:
 * - Chỉ cho phép cập nhật khi status là planned hoặc active
 * - Ngày bắt đầu/kết thúc logic
 * - Không trùng vụ mùa trên cùng lô đất
 */
class UpdateCropCycleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'season_id' => ['nullable', 'integer', 'exists:seasons,id'],
            'planned_start_date' => ['sometimes', 'date'],
            'planned_end_date' => ['sometimes', 'date', 'after:planned_start_date'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'season_id.integer' => 'ID mùa vụ phải là số nguyên',
            'season_id.exists' => 'Mùa vụ không tồn tại',
            'planned_start_date.date' => 'Ngày bắt đầu dự kiến không đúng định dạng',
            'planned_end_date.date' => 'Ngày kết thúc dự kiến không đúng định dạng',
            'planned_end_date.after' => 'Ngày kết thúc dự kiến phải sau ngày bắt đầu',
            'notes.string' => 'Ghi chú phải là chuỗi ký tự',
            'notes.max' => 'Ghi chú không được vượt quá :max ký tự',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'season_id' => 'mùa vụ',
            'planned_start_date' => 'ngày bắt đầu dự kiến',
            'planned_end_date' => 'ngày kết thúc dự kiến',
            'notes' => 'ghi chú',
        ];
    }

    /**
     * Configure the validator instance.
     *
     * @param \Illuminate\Validation\Validator $validator
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $cropCycle = $this->route('crop_cycle');

            // Check if crop cycle can be updated
            if ($cropCycle && !in_array($cropCycle->status, ['planned', 'active'])) {
                $validator->errors()->add(
                    'status',
                    'Không thể cập nhật vụ mùa đã hoàn thành, thất bại hoặc bị hủy'
                );
            }

            // Check for overlapping if dates changed
            if ($cropCycle && ($this->planned_start_date || $this->planned_end_date)) {
                $this->checkOverlappingCycles($validator, $cropCycle);
            }
        });
    }

    /**
     * Check for overlapping crop cycles on the same land parcel.
     */
    protected function checkOverlappingCycles($validator, CropCycle $cropCycle): void
    {
        $startDate = $this->planned_start_date ?? $cropCycle->planned_start_date->toDateString();
        $endDate = $this->planned_end_date ?? $cropCycle->planned_end_date->toDateString();

        $overlapping = CropCycle::where('land_parcel_id', $cropCycle->land_parcel_id)
            ->where('id', '!=', $cropCycle->id)
            ->whereNotIn('status', ['completed', 'failed', 'abandoned'])
            ->where(function ($query) use ($startDate, $endDate) {
                $query->whereBetween('planned_start_date', [$startDate, $endDate])
                    ->orWhereBetween('planned_end_date', [$startDate, $endDate])
                    ->orWhere(function ($q) use ($startDate, $endDate) {
                        $q->where('planned_start_date', '<=', $startDate)
                          ->where('planned_end_date', '>=', $endDate);
                    });
            })
            ->exists();

        if ($overlapping) {
            $validator->errors()->add(
                'planned_start_date',
                'Thời gian cập nhật sẽ trùng với vụ mùa khác trên cùng lô đất'
            );
        }
    }
}
