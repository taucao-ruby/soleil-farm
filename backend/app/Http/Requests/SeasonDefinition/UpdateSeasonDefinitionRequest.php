<?php

namespace App\Http\Requests\SeasonDefinition;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Request validation cho cập nhật định nghĩa mùa vụ.
 */
class UpdateSeasonDefinitionRequest extends FormRequest
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
        $definitionId = $this->route('season_definition')?->id ?? $this->route('season_definition');

        return [
            'name' => ['sometimes', 'required', 'string', 'max:100'],
            'code' => [
                'sometimes',
                'required',
                'string',
                'max:20',
                Rule::unique('season_definitions', 'code')->ignore($definitionId),
            ],
            'description' => ['nullable', 'string', 'max:1000'],
            'typical_start_month' => ['sometimes', 'required', 'integer', 'min:1', 'max:12'],
            'typical_end_month' => ['sometimes', 'required', 'integer', 'min:1', 'max:12'],
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
            'name.required' => 'Tên định nghĩa mùa vụ không được để trống',
            'name.max' => 'Tên định nghĩa mùa vụ không được vượt quá :max ký tự',
            'code.required' => 'Mã định nghĩa mùa vụ không được để trống',
            'code.max' => 'Mã định nghĩa mùa vụ không được vượt quá :max ký tự',
            'code.unique' => 'Mã định nghĩa mùa vụ đã tồn tại',
            'typical_start_month.required' => 'Tháng bắt đầu điển hình không được để trống',
            'typical_start_month.integer' => 'Tháng bắt đầu phải là số nguyên',
            'typical_start_month.min' => 'Tháng bắt đầu phải từ 1 đến 12',
            'typical_start_month.max' => 'Tháng bắt đầu phải từ 1 đến 12',
            'typical_end_month.required' => 'Tháng kết thúc điển hình không được để trống',
            'typical_end_month.min' => 'Tháng kết thúc phải từ 1 đến 12',
            'typical_end_month.max' => 'Tháng kết thúc phải từ 1 đến 12',
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
            'name' => 'tên định nghĩa mùa vụ',
            'code' => 'mã định nghĩa mùa vụ',
            'description' => 'mô tả',
            'typical_start_month' => 'tháng bắt đầu điển hình',
            'typical_end_month' => 'tháng kết thúc điển hình',
            'is_active' => 'trạng thái hoạt động',
        ];
    }
}
