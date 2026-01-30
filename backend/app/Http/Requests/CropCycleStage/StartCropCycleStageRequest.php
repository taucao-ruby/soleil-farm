<?php

namespace App\Http\Requests\CropCycleStage;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Request validation cho bắt đầu giai đoạn vụ mùa.
 */
class StartCropCycleStageRequest extends FormRequest
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
            'actual_start_date' => ['nullable', 'date'],
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
            'actual_start_date.date' => 'Ngày bắt đầu thực tế không đúng định dạng',
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
            'actual_start_date' => 'ngày bắt đầu thực tế',
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

            if (!$stage) {
                return;
            }

            // Check if stage can be started
            if ($stage->status !== 'pending') {
                $validator->errors()->add(
                    'status',
                    'Chỉ có thể bắt đầu giai đoạn ở trạng thái "đang chờ"'
                );
            }

            // Check if crop cycle is active
            if ($stage->cropCycle && $stage->cropCycle->status !== 'active') {
                $validator->errors()->add(
                    'crop_cycle',
                    'Vụ mùa phải ở trạng thái hoạt động để bắt đầu giai đoạn'
                );
            }

            // Check if previous stage is completed
            $previousStage = $stage->cropCycle?->stages()
                ->where('sequence_order', '<', $stage->sequence_order)
                ->orderBy('sequence_order', 'desc')
                ->first();

            if ($previousStage && !in_array($previousStage->status, ['completed', 'skipped'])) {
                $validator->errors()->add(
                    'sequence',
                    'Giai đoạn trước đó chưa hoàn thành'
                );
            }
        });
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if (!$this->has('actual_start_date')) {
            $this->merge(['actual_start_date' => now()->toDateString()]);
        }
    }
}
