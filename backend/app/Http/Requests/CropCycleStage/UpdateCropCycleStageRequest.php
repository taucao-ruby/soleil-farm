<?php

namespace App\Http\Requests\CropCycleStage;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Request validation cho cập nhật giai đoạn vụ mùa.
 */
class UpdateCropCycleStageRequest extends FormRequest
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
            'stage_name' => ['sometimes', 'required', 'string', 'max:100'],
            'sequence_order' => ['sometimes', 'required', 'integer', 'min:1', 'max:20'],
            'planned_start_date' => ['nullable', 'date'],
            'planned_end_date' => ['nullable', 'date', 'after_or_equal:planned_start_date'],
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
            'stage_name.required' => 'Tên giai đoạn không được để trống',
            'stage_name.max' => 'Tên giai đoạn không được vượt quá :max ký tự',
            'sequence_order.required' => 'Thứ tự không được để trống',
            'sequence_order.integer' => 'Thứ tự phải là số nguyên',
            'sequence_order.min' => 'Thứ tự phải lớn hơn 0',
            'sequence_order.max' => 'Thứ tự không được vượt quá :max',
            'planned_start_date.date' => 'Ngày bắt đầu dự kiến không đúng định dạng',
            'planned_end_date.date' => 'Ngày kết thúc dự kiến không đúng định dạng',
            'planned_end_date.after_or_equal' => 'Ngày kết thúc dự kiến phải sau hoặc bằng ngày bắt đầu',
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
            'stage_name' => 'tên giai đoạn',
            'sequence_order' => 'thứ tự',
            'planned_start_date' => 'ngày bắt đầu dự kiến',
            'planned_end_date' => 'ngày kết thúc dự kiến',
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
            $stage = $this->route('stage');

            // Check if stage is modifiable (not completed or skipped)
            if ($stage && in_array($stage->status, ['completed', 'skipped'])) {
                $validator->errors()->add(
                    'status',
                    'Không thể cập nhật giai đoạn đã hoàn thành hoặc bị bỏ qua'
                );
            }

            // Check for duplicate sequence order
            if ($stage && $this->sequence_order) {
                $exists = $stage->cropCycle->stages()
                    ->where('sequence_order', $this->sequence_order)
                    ->where('id', '!=', $stage->id)
                    ->exists();

                if ($exists) {
                    $validator->errors()->add(
                        'sequence_order',
                        'Thứ tự này đã được sử dụng bởi giai đoạn khác'
                    );
                }
            }
        });
    }
}
