<?php

namespace App\Http\Requests\WaterSource;

use App\Models\WaterSource;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Request validation cho tạo mới nguồn nước.
 *
 * Validates:
 * - Tên và mã nguồn nước
 * - Loại nguồn và độ tin cậy
 * - Tọa độ GPS (nếu có)
 * - Chất lượng nước
 */
class StoreWaterSourceRequest extends FormRequest
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
            'code' => ['required', 'string', 'max:30', 'unique:water_sources,code'],
            'source_type' => ['required', 'in:well,river,stream,pond,irrigation_canal,rainwater,municipal'],
            'description' => ['nullable', 'string', 'max:1000'],
            'latitude' => ['nullable', 'numeric', 'min:-90', 'max:90'],
            'longitude' => ['nullable', 'numeric', 'min:-180', 'max:180'],
            'reliability' => ['nullable', 'in:permanent,seasonal,intermittent'],
            'water_quality' => ['nullable', 'in:excellent,good,fair,poor'],
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
            'name.required' => 'Tên nguồn nước không được để trống',
            'name.string' => 'Tên nguồn nước phải là chuỗi ký tự',
            'name.max' => 'Tên nguồn nước không được vượt quá :max ký tự',
            'code.required' => 'Mã nguồn nước không được để trống',
            'code.string' => 'Mã nguồn nước phải là chuỗi ký tự',
            'code.max' => 'Mã nguồn nước không được vượt quá :max ký tự',
            'code.unique' => 'Mã nguồn nước đã tồn tại',
            'source_type.required' => 'Loại nguồn nước không được để trống',
            'source_type.in' => 'Loại nguồn nước không hợp lệ. Chọn: giếng, sông, suối, ao, kênh tưới, nước mưa, nước máy',
            'description.string' => 'Mô tả phải là chuỗi ký tự',
            'description.max' => 'Mô tả không được vượt quá :max ký tự',
            'latitude.numeric' => 'Vĩ độ phải là số',
            'latitude.min' => 'Vĩ độ phải từ -90 đến 90',
            'latitude.max' => 'Vĩ độ phải từ -90 đến 90',
            'longitude.numeric' => 'Kinh độ phải là số',
            'longitude.min' => 'Kinh độ phải từ -180 đến 180',
            'longitude.max' => 'Kinh độ phải từ -180 đến 180',
            'reliability.in' => 'Độ tin cậy không hợp lệ. Chọn: ổn định, theo mùa, không ổn định',
            'water_quality.in' => 'Chất lượng nước không hợp lệ. Chọn: xuất sắc, tốt, trung bình, kém',
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
            'name' => 'tên nguồn nước',
            'code' => 'mã nguồn nước',
            'source_type' => 'loại nguồn nước',
            'description' => 'mô tả',
            'latitude' => 'vĩ độ',
            'longitude' => 'kinh độ',
            'reliability' => 'độ tin cậy',
            'water_quality' => 'chất lượng nước',
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
            $count = WaterSource::count() + 1;
            $this->merge([
                'code' => 'NN-' . str_pad($count, 4, '0', STR_PAD_LEFT),
            ]);
        }

        // Set default is_active to true
        if (!$this->has('is_active')) {
            $this->merge(['is_active' => true]);
        }
    }
}
