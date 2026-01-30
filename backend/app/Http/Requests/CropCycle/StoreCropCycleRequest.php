<?php

namespace App\Http\Requests\CropCycle;

use App\Models\CropCycle;
use App\Models\LandParcel;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Request validation cho tạo mới vụ mùa.
 *
 * Validates:
 * - Lô đất phải tồn tại và khả dụng
 * - Loại cây trồng và mùa vụ hợp lệ
 * - Ngày bắt đầu/kết thúc logic
 * - Không trùng vụ mùa trên cùng lô đất
 */
class StoreCropCycleRequest extends FormRequest
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
            'land_parcel_id' => [
                'required',
                'integer',
                Rule::exists('land_parcels', 'id')->where(function ($query) {
                    $query->where('is_active', true);
                }),
            ],
            'crop_type_id' => [
                'required',
                'integer',
                Rule::exists('crop_types', 'id')->where(function ($query) {
                    $query->where('is_active', true);
                }),
            ],
            'season_id' => ['nullable', 'integer', 'exists:seasons,id'],
            'planned_start_date' => ['required', 'date', 'after_or_equal:today'],
            'planned_end_date' => ['required', 'date', 'after:planned_start_date'],
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
            'land_parcel_id.required' => 'Lô đất không được để trống',
            'land_parcel_id.integer' => 'ID lô đất phải là số nguyên',
            'land_parcel_id.exists' => 'Lô đất không tồn tại hoặc không hoạt động',
            'crop_type_id.required' => 'Loại cây trồng không được để trống',
            'crop_type_id.integer' => 'ID loại cây trồng phải là số nguyên',
            'crop_type_id.exists' => 'Loại cây trồng không tồn tại hoặc không hoạt động',
            'season_id.integer' => 'ID mùa vụ phải là số nguyên',
            'season_id.exists' => 'Mùa vụ không tồn tại',
            'planned_start_date.required' => 'Ngày bắt đầu dự kiến không được để trống',
            'planned_start_date.date' => 'Ngày bắt đầu dự kiến không đúng định dạng',
            'planned_start_date.after_or_equal' => 'Ngày bắt đầu dự kiến phải từ hôm nay trở đi',
            'planned_end_date.required' => 'Ngày kết thúc dự kiến không được để trống',
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
            'land_parcel_id' => 'lô đất',
            'crop_type_id' => 'loại cây trồng',
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
            if ($this->land_parcel_id && $this->planned_start_date && $this->planned_end_date) {
                $this->checkOverlappingCycles($validator);
                $this->checkLandParcelHasActiveCycle($validator);
            }
        });
    }

    /**
     * Check for overlapping crop cycles on the same land parcel.
     */
    protected function checkOverlappingCycles($validator): void
    {
        $overlapping = CropCycle::where('land_parcel_id', $this->land_parcel_id)
            ->whereNotIn('status', ['completed', 'failed', 'abandoned'])
            ->where(function ($query) {
                $query->whereBetween('planned_start_date', [
                    $this->planned_start_date,
                    $this->planned_end_date
                ])
                ->orWhereBetween('planned_end_date', [
                    $this->planned_start_date,
                    $this->planned_end_date
                ])
                ->orWhere(function ($q) {
                    $q->where('planned_start_date', '<=', $this->planned_start_date)
                      ->where('planned_end_date', '>=', $this->planned_end_date);
                });
            })
            ->exists();

        if ($overlapping) {
            $validator->errors()->add(
                'land_parcel_id',
                'Lô đất đã có vụ mùa khác trong khoảng thời gian này'
            );
        }
    }

    /**
     * Check if land parcel has an active crop cycle.
     */
    protected function checkLandParcelHasActiveCycle($validator): void
    {
        $hasActive = CropCycle::where('land_parcel_id', $this->land_parcel_id)
            ->where('status', 'active')
            ->exists();

        if ($hasActive) {
            $validator->errors()->add(
                'land_parcel_id',
                'Lô đất đang có vụ mùa đang hoạt động'
            );
        }
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Auto-generate cycle_code
        if (empty($this->cycle_code)) {
            $landParcel = LandParcel::find($this->land_parcel_id);
            $year = date('Y', strtotime($this->planned_start_date ?? now()));
            $count = CropCycle::count() + 1;

            $code = 'VM-' . str_pad($count, 4, '0', STR_PAD_LEFT);
            if ($landParcel) {
                $code = $landParcel->code . '-' . $year . '-' . str_pad($count, 3, '0', STR_PAD_LEFT);
            }

            $this->merge(['cycle_code' => $code]);
        }
    }
}
