<?php

namespace App\Http\Requests\Season;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Request validation cho tạo mới mùa vụ.
 *
 * Validates:
 * - Định nghĩa mùa và năm
 * - Ngày bắt đầu/kết thúc thực tế
 */
class StoreSeasonRequest extends FormRequest
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
            'season_definition_id' => [
                'required',
                'integer',
                Rule::exists('season_definitions', 'id')->where(function ($query) {
                    $query->where('is_active', true);
                }),
            ],
            'year' => ['required', 'integer', 'min:2000', 'max:2100'],
            'actual_start_date' => ['nullable', 'date'],
            'actual_end_date' => ['nullable', 'date', 'after_or_equal:actual_start_date'],
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
            'season_definition_id.required' => 'Định nghĩa mùa vụ không được để trống',
            'season_definition_id.integer' => 'ID định nghĩa mùa vụ phải là số nguyên',
            'season_definition_id.exists' => 'Định nghĩa mùa vụ không tồn tại hoặc không hoạt động',
            'year.required' => 'Năm không được để trống',
            'year.integer' => 'Năm phải là số nguyên',
            'year.min' => 'Năm phải từ 2000 trở lên',
            'year.max' => 'Năm không được vượt quá 2100',
            'actual_start_date.date' => 'Ngày bắt đầu thực tế không đúng định dạng',
            'actual_end_date.date' => 'Ngày kết thúc thực tế không đúng định dạng',
            'actual_end_date.after_or_equal' => 'Ngày kết thúc thực tế phải sau hoặc bằng ngày bắt đầu',
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
            'season_definition_id' => 'định nghĩa mùa vụ',
            'year' => 'năm',
            'actual_start_date' => 'ngày bắt đầu thực tế',
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
            // Check for duplicate season (same definition + year)
            if ($this->season_definition_id && $this->year) {
                $exists = \App\Models\Season::where('season_definition_id', $this->season_definition_id)
                    ->where('year', $this->year)
                    ->exists();

                if ($exists) {
                    $validator->errors()->add(
                        'year',
                        'Mùa vụ này đã tồn tại cho năm ' . $this->year
                    );
                }
            }
        });
    }
}
