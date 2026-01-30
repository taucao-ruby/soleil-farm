<?php

namespace App\Http\Requests\CropType;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Request validation cho cập nhật loại cây trồng.
 */
class UpdateCropTypeRequest extends FormRequest
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
        $cropTypeId = $this->route('crop_type')?->id ?? $this->route('crop_type');

        return [
            'name' => ['sometimes', 'required', 'string', 'max:100'],
            'code' => [
                'sometimes',
                'required',
                'string',
                'max:30',
                Rule::unique('crop_types', 'code')->ignore($cropTypeId),
            ],
            'scientific_name' => ['nullable', 'string', 'max:150'],
            'variety' => ['nullable', 'string', 'max:100'],
            'category' => ['sometimes', 'required', 'in:grain,vegetable,fruit,legume,tuber,herb,flower,fodder,other'],
            'description' => ['nullable', 'string', 'max:1000'],
            'typical_grow_duration_days' => ['nullable', 'integer', 'min:1', 'max:730'],
            'default_yield_unit_id' => ['nullable', 'integer', 'exists:units_of_measure,id'],
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
            'name.required' => 'Tên loại cây trồng không được để trống',
            'name.string' => 'Tên loại cây trồng phải là chuỗi ký tự',
            'name.max' => 'Tên loại cây trồng không được vượt quá :max ký tự',
            'code.required' => 'Mã loại cây trồng không được để trống',
            'code.unique' => 'Mã loại cây trồng đã tồn tại',
            'category.required' => 'Danh mục không được để trống',
            'category.in' => 'Danh mục không hợp lệ',
            'typical_grow_duration_days.integer' => 'Thời gian sinh trưởng phải là số nguyên',
            'typical_grow_duration_days.min' => 'Thời gian sinh trưởng phải lớn hơn 0',
            'default_yield_unit_id.exists' => 'Đơn vị năng suất không hợp lệ',
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
            'name' => 'tên loại cây trồng',
            'code' => 'mã loại cây trồng',
            'scientific_name' => 'tên khoa học',
            'variety' => 'giống',
            'category' => 'danh mục',
            'description' => 'mô tả',
            'typical_grow_duration_days' => 'thời gian sinh trưởng',
            'default_yield_unit_id' => 'đơn vị năng suất mặc định',
            'is_active' => 'trạng thái hoạt động',
        ];
    }
}
