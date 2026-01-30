<?php

namespace App\Http\Requests\CropCycle;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Request validation cho hoàn thành vụ mùa.
 *
 * Validates:
 * - Năng suất và đơn vị
 * - Đánh giá chất lượng
 */
class CompleteCropCycleRequest extends FormRequest
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
            'yield_value' => ['nullable', 'numeric', 'min:0', 'max:999999.99'],
            'yield_unit_id' => ['nullable', 'integer', 'exists:units_of_measure,id'],
            'quality_rating' => ['nullable', 'in:excellent,good,average,below_average,poor'],
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
            'yield_value.numeric' => 'Sản lượng phải là số',
            'yield_value.min' => 'Sản lượng phải lớn hơn hoặc bằng 0',
            'yield_value.max' => 'Sản lượng không được vượt quá :max',
            'yield_unit_id.integer' => 'ID đơn vị sản lượng phải là số nguyên',
            'yield_unit_id.exists' => 'Đơn vị sản lượng không hợp lệ',
            'quality_rating.in' => 'Đánh giá chất lượng không hợp lệ. Chọn: xuất sắc, tốt, trung bình, dưới trung bình, kém',
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
            'yield_value' => 'sản lượng',
            'yield_unit_id' => 'đơn vị sản lượng',
            'quality_rating' => 'đánh giá chất lượng',
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

            if ($cropCycle && $cropCycle->status !== 'active') {
                $validator->errors()->add(
                    'status',
                    'Chỉ có thể hoàn thành vụ mùa đang hoạt động'
                );
            }
        });
    }
}
