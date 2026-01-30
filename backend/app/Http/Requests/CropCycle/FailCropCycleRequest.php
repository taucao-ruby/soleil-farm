<?php

namespace App\Http\Requests\CropCycle;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Request validation cho đánh dấu vụ mùa thất bại hoặc hủy bỏ.
 *
 * Validates:
 * - Ghi chú lý do
 */
class FailCropCycleRequest extends FormRequest
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
                    'Chỉ có thể đánh dấu thất bại cho vụ mùa đang hoạt động'
                );
            }
        });
    }
}
