<?php

namespace App\Http\Requests\ActivityType;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Request validation cho cập nhật loại hoạt động.
 */
class UpdateActivityTypeRequest extends FormRequest
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
        $activityTypeId = $this->route('activity_type')?->id ?? $this->route('activity_type');

        return [
            'name' => ['sometimes', 'required', 'string', 'max:100'],
            'code' => [
                'sometimes',
                'required',
                'string',
                'max:30',
                Rule::unique('activity_types', 'code')->ignore($activityTypeId),
            ],
            'category' => ['sometimes', 'required', 'in:land_preparation,planting,irrigation,fertilizing,pest_control,harvesting,maintenance,observation,other'],
            'description' => ['nullable', 'string', 'max:1000'],
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
            'name.required' => 'Tên loại hoạt động không được để trống',
            'name.max' => 'Tên loại hoạt động không được vượt quá :max ký tự',
            'code.required' => 'Mã loại hoạt động không được để trống',
            'code.max' => 'Mã loại hoạt động không được vượt quá :max ký tự',
            'code.unique' => 'Mã loại hoạt động đã tồn tại',
            'category.required' => 'Danh mục không được để trống',
            'category.in' => 'Danh mục không hợp lệ',
            'description.max' => 'Mô tả không được vượt quá :max ký tự',
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
            'name' => 'tên loại hoạt động',
            'code' => 'mã loại hoạt động',
            'category' => 'danh mục',
            'description' => 'mô tả',
            'is_active' => 'trạng thái hoạt động',
        ];
    }
}
