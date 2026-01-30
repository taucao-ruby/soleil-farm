<?php

namespace App\Http\Requests\LandParcel;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Request validation cho gắn nguồn nước vào lô đất.
 *
 * Validates:
 * - water_source_id phải tồn tại
 * - accessibility type hợp lệ
 * - is_primary_source là boolean
 */
class AttachWaterSourceRequest extends FormRequest
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
            'water_source_id' => ['required', 'integer', 'exists:water_sources,id'],
            'accessibility' => ['nullable', 'in:direct,pumped,gravity_fed,manual'],
            'is_primary_source' => ['nullable', 'boolean'],
            'notes' => ['nullable', 'string', 'max:500'],
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
            'water_source_id.required' => 'Nguồn nước không được để trống',
            'water_source_id.integer' => 'ID nguồn nước phải là số nguyên',
            'water_source_id.exists' => 'Nguồn nước không tồn tại',
            'accessibility.in' => 'Phương thức tiếp cận không hợp lệ. Chọn: trực tiếp, bơm, tự chảy, thủ công',
            'is_primary_source.boolean' => 'Nguồn chính phải là đúng hoặc sai',
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
            'water_source_id' => 'nguồn nước',
            'accessibility' => 'phương thức tiếp cận',
            'is_primary_source' => 'nguồn chính',
            'notes' => 'ghi chú',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if (!$this->has('accessibility')) {
            $this->merge(['accessibility' => 'direct']);
        }

        if (!$this->has('is_primary_source')) {
            $this->merge(['is_primary_source' => false]);
        }
    }
}
