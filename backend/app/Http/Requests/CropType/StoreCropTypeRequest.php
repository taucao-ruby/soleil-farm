<?php

namespace App\Http\Requests\CropType;

use App\Models\CropType;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Request validation cho tạo mới loại cây trồng.
 *
 * Validates:
 * - Tên, mã và tên khoa học
 * - Danh mục và thời gian sinh trưởng
 * - Đơn vị năng suất mặc định
 */
class StoreCropTypeRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:100'],
            'code' => ['required', 'string', 'max:30', 'unique:crop_types,code'],
            'scientific_name' => ['nullable', 'string', 'max:150'],
            'variety' => ['nullable', 'string', 'max:100'],
            'category' => ['required', 'in:grain,vegetable,fruit,legume,tuber,herb,flower,fodder,other'],
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
            'code.string' => 'Mã loại cây trồng phải là chuỗi ký tự',
            'code.max' => 'Mã loại cây trồng không được vượt quá :max ký tự',
            'code.unique' => 'Mã loại cây trồng đã tồn tại',
            'scientific_name.string' => 'Tên khoa học phải là chuỗi ký tự',
            'scientific_name.max' => 'Tên khoa học không được vượt quá :max ký tự',
            'variety.string' => 'Giống phải là chuỗi ký tự',
            'variety.max' => 'Giống không được vượt quá :max ký tự',
            'category.required' => 'Danh mục không được để trống',
            'category.in' => 'Danh mục không hợp lệ. Chọn: ngũ cốc, rau, trái cây, đậu, củ, thảo mộc, hoa, thức ăn gia súc, khác',
            'description.string' => 'Mô tả phải là chuỗi ký tự',
            'description.max' => 'Mô tả không được vượt quá :max ký tự',
            'typical_grow_duration_days.integer' => 'Thời gian sinh trưởng phải là số nguyên',
            'typical_grow_duration_days.min' => 'Thời gian sinh trưởng phải lớn hơn 0',
            'typical_grow_duration_days.max' => 'Thời gian sinh trưởng không được vượt quá :max ngày',
            'default_yield_unit_id.integer' => 'ID đơn vị năng suất phải là số nguyên',
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

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Auto-generate code if not provided
        if (empty($this->code)) {
            $count = CropType::count() + 1;
            $this->merge([
                'code' => 'CT-' . str_pad($count, 4, '0', STR_PAD_LEFT),
            ]);
        }

        // Set default is_active to true
        if (!$this->has('is_active')) {
            $this->merge(['is_active' => true]);
        }
    }
}
