<?php

namespace App\Http\Requests\CropCycleStage;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Request validation cho hoàn thành giai đoạn vụ mùa.
 */
class CompleteCropCycleStageRequest extends FormRequest
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
            'actual_end_date' => ['nullable', 'date'],
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
            'actual_end_date.date' => 'Ngày kết thúc thực tế không đúng định dạng',
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
            'actual_end_date' => 'ngày kết thúc thực tế',
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

            // Check if stage can be completed
            if ($stage->status !== 'in_progress') {
                $validator->errors()->add(
                    'status',
                    'Chỉ có thể hoàn thành giai đoạn đang thực hiện'
                );
            }

            // Check if actual_end_date is after actual_start_date
            if ($this->actual_end_date && $stage->actual_start_date) {
                $endDate = \Carbon\Carbon::parse($this->actual_end_date);
                $startDate = \Carbon\Carbon::parse($stage->actual_start_date);

                if ($endDate->lt($startDate)) {
                    $validator->errors()->add(
                        'actual_end_date',
                        'Ngày kết thúc thực tế phải sau ngày bắt đầu thực tế'
                    );
                }
            }
        });
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if (!$this->has('actual_end_date')) {
            $this->merge(['actual_end_date' => now()->toDateString()]);
        }
    }
}
