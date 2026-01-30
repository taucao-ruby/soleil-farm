<?php

namespace App\Http\Requests\ActivityLog;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Request validation cho cập nhật nhật ký hoạt động.
 */
class UpdateActivityLogRequest extends FormRequest
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
            'activity_type_id' => [
                'sometimes',
                'required',
                'integer',
                Rule::exists('activity_types', 'id')->where(function ($query) {
                    $query->where('is_active', true);
                }),
            ],
            'crop_cycle_id' => [
                'sometimes',
                'nullable',
                'integer',
                'exists:crop_cycles,id',
            ],
            'crop_cycle_stage_id' => [
                'sometimes',
                'nullable',
                'integer',
                'exists:crop_cycle_stages,id',
            ],
            'land_parcel_id' => [
                'sometimes',
                'nullable',
                'integer',
                'exists:land_parcels,id',
            ],
            'activity_date' => ['sometimes', 'required', 'date'],
            'performed_by' => ['sometimes', 'nullable', 'string', 'max:255'],
            'quantity' => ['nullable', 'numeric', 'min:0'],
            'unit_of_measure_id' => [
                'nullable',
                'integer',
                'exists:unit_of_measures,id',
            ],
            'notes' => ['nullable', 'string', 'max:2000'],
            'weather_conditions' => ['nullable', 'string', 'max:255'],
            'cost' => ['nullable', 'numeric', 'min:0'],
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
            'activity_type_id.required' => 'Loại hoạt động không được để trống',
            'activity_type_id.exists' => 'Loại hoạt động không tồn tại hoặc không hoạt động',
            'crop_cycle_id.exists' => 'Vụ mùa không tồn tại',
            'crop_cycle_stage_id.exists' => 'Giai đoạn vụ mùa không tồn tại',
            'land_parcel_id.exists' => 'Lô đất không tồn tại',
            'activity_date.required' => 'Ngày hoạt động không được để trống',
            'activity_date.date' => 'Ngày hoạt động không đúng định dạng',
            'performed_by.max' => 'Người thực hiện không được vượt quá :max ký tự',
            'quantity.numeric' => 'Số lượng phải là số',
            'quantity.min' => 'Số lượng phải lớn hơn hoặc bằng 0',
            'unit_of_measure_id.exists' => 'Đơn vị đo lường không tồn tại',
            'notes.max' => 'Ghi chú không được vượt quá :max ký tự',
            'weather_conditions.max' => 'Điều kiện thời tiết không được vượt quá :max ký tự',
            'cost.numeric' => 'Chi phí phải là số',
            'cost.min' => 'Chi phí phải lớn hơn hoặc bằng 0',
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
            'activity_type_id' => 'loại hoạt động',
            'crop_cycle_id' => 'vụ mùa',
            'crop_cycle_stage_id' => 'giai đoạn vụ mùa',
            'land_parcel_id' => 'lô đất',
            'activity_date' => 'ngày hoạt động',
            'performed_by' => 'người thực hiện',
            'quantity' => 'số lượng',
            'unit_of_measure_id' => 'đơn vị đo lường',
            'notes' => 'ghi chú',
            'weather_conditions' => 'điều kiện thời tiết',
            'cost' => 'chi phí',
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
            // Validate stage belongs to crop cycle
            if ($this->crop_cycle_id && $this->crop_cycle_stage_id) {
                $stageExists = \App\Models\CropCycleStage::where('id', $this->crop_cycle_stage_id)
                    ->where('crop_cycle_id', $this->crop_cycle_id)
                    ->exists();

                if (!$stageExists) {
                    $validator->errors()->add(
                        'crop_cycle_stage_id',
                        'Giai đoạn không thuộc vụ mùa đã chọn'
                    );
                }
            }

            // Require unit if quantity is provided
            if ($this->quantity && !$this->unit_of_measure_id) {
                $activityLog = $this->route('activity_log');
                if (!$activityLog || !$activityLog->unit_of_measure_id) {
                    $validator->errors()->add(
                        'unit_of_measure_id',
                        'Đơn vị đo lường là bắt buộc khi có số lượng'
                    );
                }
            }
        });
    }
}
