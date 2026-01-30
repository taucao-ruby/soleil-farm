<?php

namespace App\Http\Requests\LandParcel;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Request validation cho cập nhật lô đất.
 *
 * Validates:
 * - Tên và mã lô đất (unique trừ bản ghi hiện tại)
 * - Diện tích và đơn vị
 * - Loại đất, địa hình, thổ nhưỡng
 * - Tọa độ GPS (nếu có)
 */
class UpdateLandParcelRequest extends FormRequest
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
        $landParcelId = $this->route('land_parcel')?->id ?? $this->route('land_parcel');

        return [
            'name' => ['sometimes', 'required', 'string', 'max:100'],
            'code' => [
                'sometimes',
                'required',
                'string',
                'max:30',
                Rule::unique('land_parcels', 'code')->ignore($landParcelId),
            ],
            'description' => ['nullable', 'string', 'max:1000'],
            'land_type' => ['sometimes', 'required', 'in:rice_field,garden,fish_pond,mixed,fallow,other'],
            'area_value' => ['sometimes', 'required', 'numeric', 'min:0.01', 'max:999999.99'],
            'area_unit_id' => ['sometimes', 'required', 'integer', 'exists:units_of_measure,id'],
            'terrain_type' => ['nullable', 'in:flat,sloped,terraced,lowland'],
            'soil_type' => ['nullable', 'in:clay,sandy,loamy,alluvial,mixed'],
            'latitude' => ['nullable', 'numeric', 'min:-90', 'max:90'],
            'longitude' => ['nullable', 'numeric', 'min:-180', 'max:180'],
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
            'name.required' => 'Tên lô đất không được để trống',
            'name.string' => 'Tên lô đất phải là chuỗi ký tự',
            'name.max' => 'Tên lô đất không được vượt quá :max ký tự',
            'code.required' => 'Mã lô đất không được để trống',
            'code.string' => 'Mã lô đất phải là chuỗi ký tự',
            'code.max' => 'Mã lô đất không được vượt quá :max ký tự',
            'code.unique' => 'Mã lô đất đã tồn tại',
            'description.string' => 'Mô tả phải là chuỗi ký tự',
            'description.max' => 'Mô tả không được vượt quá :max ký tự',
            'land_type.required' => 'Loại đất không được để trống',
            'land_type.in' => 'Loại đất không hợp lệ',
            'area_value.required' => 'Diện tích không được để trống',
            'area_value.numeric' => 'Diện tích phải là số',
            'area_value.min' => 'Diện tích phải lớn hơn 0',
            'area_value.max' => 'Diện tích không được vượt quá :max',
            'area_unit_id.required' => 'Đơn vị diện tích không được để trống',
            'area_unit_id.integer' => 'Đơn vị diện tích phải là số nguyên',
            'area_unit_id.exists' => 'Đơn vị diện tích không hợp lệ',
            'terrain_type.in' => 'Loại địa hình không hợp lệ',
            'soil_type.in' => 'Loại thổ nhưỡng không hợp lệ',
            'latitude.numeric' => 'Vĩ độ phải là số',
            'latitude.min' => 'Vĩ độ phải từ -90 đến 90',
            'latitude.max' => 'Vĩ độ phải từ -90 đến 90',
            'longitude.numeric' => 'Kinh độ phải là số',
            'longitude.min' => 'Kinh độ phải từ -180 đến 180',
            'longitude.max' => 'Kinh độ phải từ -180 đến 180',
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
            'name' => 'tên lô đất',
            'code' => 'mã lô đất',
            'description' => 'mô tả',
            'land_type' => 'loại đất',
            'area_value' => 'diện tích',
            'area_unit_id' => 'đơn vị diện tích',
            'terrain_type' => 'loại địa hình',
            'soil_type' => 'loại thổ nhưỡng',
            'latitude' => 'vĩ độ',
            'longitude' => 'kinh độ',
            'is_active' => 'trạng thái hoạt động',
        ];
    }
}
