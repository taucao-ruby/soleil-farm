<?php

namespace App\Http\Requests\UnitOfMeasure;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Request validation cho cập nhật đơn vị đo lường.
 */
class UpdateUnitOfMeasureRequest extends FormRequest
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
            'name' => ['sometimes', 'required', 'string', 'max:50'],
            'abbreviation' => ['sometimes', 'required', 'string', 'max:20'],
            'unit_type' => ['sometimes', 'required', 'in:area,weight,volume,quantity,currency,time'],
            'conversion_factor_to_base' => ['nullable', 'numeric', 'min:0.000001'],
            'is_base_unit' => ['nullable', 'boolean'],
            'is_active' => ['nullable', 'boolean'],
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
            'name.required' => 'Tên đơn vị đo lường không được để trống',
            'name.max' => 'Tên đơn vị đo lường không được vượt quá :max ký tự',
            'abbreviation.required' => 'Viết tắt không được để trống',
            'abbreviation.max' => 'Viết tắt không được vượt quá :max ký tự',
            'unit_type.required' => 'Loại đơn vị không được để trống',
            'unit_type.in' => 'Loại đơn vị không hợp lệ',
            'conversion_factor_to_base.numeric' => 'Hệ số chuyển đổi phải là số',
            'conversion_factor_to_base.min' => 'Hệ số chuyển đổi phải lớn hơn 0',
            'is_base_unit.boolean' => 'Đơn vị cơ sở phải là đúng hoặc sai',
            'is_active.boolean' => 'Trạng thái hoạt động phải là đúng hoặc sai',
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
            'name' => 'tên đơn vị đo lường',
            'abbreviation' => 'viết tắt',
            'unit_type' => 'loại đơn vị',
            'conversion_factor_to_base' => 'hệ số chuyển đổi',
            'is_base_unit' => 'đơn vị cơ sở',
            'is_active' => 'trạng thái hoạt động',
        ];
    }
}
