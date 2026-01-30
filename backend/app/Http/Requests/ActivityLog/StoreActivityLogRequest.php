<?php

namespace App\Http\Requests\ActivityLog;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Request validation cho tạo mới nhật ký hoạt động.
 *
 * Validates:
 * - Loại hoạt động và vụ mùa
 * - Ngày và thời gian thực hiện
 * - Số lượng và chi phí
 * - Người thực hiện và điều kiện thời tiết
 */
class StoreActivityLogRequest extends FormRequest
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
            'activity_type_id' => ['required', 'integer', 'exists:activity_types,id'],
            'crop_cycle_id' => ['nullable', 'integer', 'exists:crop_cycles,id'],
            'land_parcel_id' => ['nullable', 'integer', 'exists:land_parcels,id'],
            'water_source_id' => ['nullable', 'integer', 'exists:water_sources,id'],
            'activity_date' => ['required', 'date', 'before_or_equal:today'],
            'start_time' => ['nullable', 'date_format:H:i'],
            'end_time' => ['nullable', 'date_format:H:i', 'after:start_time'],
            'description' => ['nullable', 'string', 'max:1000'],
            'quantity_value' => ['nullable', 'numeric', 'min:0', 'max:999999.99'],
            'quantity_unit_id' => ['nullable', 'integer', 'exists:units_of_measure,id'],
            'cost_value' => ['nullable', 'numeric', 'min:0', 'max:9999999999.99'],
            'cost_unit_id' => ['nullable', 'integer', 'exists:units_of_measure,id'],
            'performed_by' => ['nullable', 'string', 'max:100'],
            'weather_conditions' => ['nullable', 'string', 'max:100'],
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
            'activity_type_id.integer' => 'ID loại hoạt động phải là số nguyên',
            'activity_type_id.exists' => 'Loại hoạt động không tồn tại',
            'crop_cycle_id.integer' => 'ID vụ mùa phải là số nguyên',
            'crop_cycle_id.exists' => 'Vụ mùa không tồn tại',
            'land_parcel_id.integer' => 'ID lô đất phải là số nguyên',
            'land_parcel_id.exists' => 'Lô đất không tồn tại',
            'water_source_id.integer' => 'ID nguồn nước phải là số nguyên',
            'water_source_id.exists' => 'Nguồn nước không tồn tại',
            'activity_date.required' => 'Ngày hoạt động không được để trống',
            'activity_date.date' => 'Ngày hoạt động không đúng định dạng',
            'activity_date.before_or_equal' => 'Ngày hoạt động không được trong tương lai',
            'start_time.date_format' => 'Thời gian bắt đầu không đúng định dạng (HH:MM)',
            'end_time.date_format' => 'Thời gian kết thúc không đúng định dạng (HH:MM)',
            'end_time.after' => 'Thời gian kết thúc phải sau thời gian bắt đầu',
            'description.string' => 'Mô tả phải là chuỗi ký tự',
            'description.max' => 'Mô tả không được vượt quá :max ký tự',
            'quantity_value.numeric' => 'Số lượng phải là số',
            'quantity_value.min' => 'Số lượng phải lớn hơn hoặc bằng 0',
            'quantity_value.max' => 'Số lượng không được vượt quá :max',
            'quantity_unit_id.integer' => 'ID đơn vị số lượng phải là số nguyên',
            'quantity_unit_id.exists' => 'Đơn vị số lượng không hợp lệ',
            'cost_value.numeric' => 'Chi phí phải là số',
            'cost_value.min' => 'Chi phí phải lớn hơn hoặc bằng 0',
            'cost_value.max' => 'Chi phí không được vượt quá :max',
            'cost_unit_id.integer' => 'ID đơn vị chi phí phải là số nguyên',
            'cost_unit_id.exists' => 'Đơn vị chi phí không hợp lệ',
            'performed_by.string' => 'Người thực hiện phải là chuỗi ký tự',
            'performed_by.max' => 'Người thực hiện không được vượt quá :max ký tự',
            'weather_conditions.string' => 'Điều kiện thời tiết phải là chuỗi ký tự',
            'weather_conditions.max' => 'Điều kiện thời tiết không được vượt quá :max ký tự',
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
            'land_parcel_id' => 'lô đất',
            'water_source_id' => 'nguồn nước',
            'activity_date' => 'ngày hoạt động',
            'start_time' => 'thời gian bắt đầu',
            'end_time' => 'thời gian kết thúc',
            'description' => 'mô tả',
            'quantity_value' => 'số lượng',
            'quantity_unit_id' => 'đơn vị số lượng',
            'cost_value' => 'chi phí',
            'cost_unit_id' => 'đơn vị chi phí',
            'performed_by' => 'người thực hiện',
            'weather_conditions' => 'điều kiện thời tiết',
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
            // Phải có ít nhất crop_cycle_id hoặc land_parcel_id
            if (empty($this->crop_cycle_id) && empty($this->land_parcel_id)) {
                $validator->errors()->add(
                    'crop_cycle_id',
                    'Phải chọn ít nhất vụ mùa hoặc lô đất'
                );
            }

            // Nếu có quantity_value thì phải có quantity_unit_id
            if ($this->quantity_value !== null && empty($this->quantity_unit_id)) {
                $validator->errors()->add(
                    'quantity_unit_id',
                    'Đơn vị số lượng không được để trống khi có số lượng'
                );
            }

            // Nếu có cost_value thì phải có cost_unit_id
            if ($this->cost_value !== null && empty($this->cost_unit_id)) {
                $validator->errors()->add(
                    'cost_unit_id',
                    'Đơn vị chi phí không được để trống khi có chi phí'
                );
            }
        });
    }
}
