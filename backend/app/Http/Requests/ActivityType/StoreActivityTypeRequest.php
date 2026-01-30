<?php

namespace App\Http\Requests\ActivityType;

use App\Models\ActivityType;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Request validation cho tạo mới loại hoạt động.
 *
 * Validates:
 * - Tên, mã và danh mục
 * - Mô tả hoạt động
 */
class StoreActivityTypeRequest extends FormRequest
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
            'code' => ['required', 'string', 'max:30', 'unique:activity_types,code'],
            'category' => ['required', 'in:land_preparation,planting,irrigation,fertilizing,pest_control,harvesting,maintenance,observation,other'],
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
            'name.string' => 'Tên loại hoạt động phải là chuỗi ký tự',
            'name.max' => 'Tên loại hoạt động không được vượt quá :max ký tự',
            'code.required' => 'Mã loại hoạt động không được để trống',
            'code.string' => 'Mã loại hoạt động phải là chuỗi ký tự',
            'code.max' => 'Mã loại hoạt động không được vượt quá :max ký tự',
            'code.unique' => 'Mã loại hoạt động đã tồn tại',
            'category.required' => 'Danh mục không được để trống',
            'category.in' => 'Danh mục không hợp lệ. Chọn: chuẩn bị đất, gieo trồng, tưới nước, bón phân, phòng trừ sâu bệnh, thu hoạch, bảo trì, quan sát, khác',
            'description.string' => 'Mô tả phải là chuỗi ký tự',
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

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Auto-generate code if not provided
        if (empty($this->code)) {
            $count = ActivityType::count() + 1;
            $this->merge([
                'code' => 'AT-' . str_pad($count, 4, '0', STR_PAD_LEFT),
            ]);
        }

        // Set default is_active to true
        if (!$this->has('is_active')) {
            $this->merge(['is_active' => true]);
        }
    }
}
