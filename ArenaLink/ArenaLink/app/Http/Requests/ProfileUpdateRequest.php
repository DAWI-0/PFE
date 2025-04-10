<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['nullable', 'string', 'max:255'], // Required name field
            'email' => [
                'nullable',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id), // Ensure email is unique
            ],
            'phone' => ['nullable', 'string', 'max:20'], // Optional phone field
            'bio' => ['nullable', 'string'], // Optional bio field
            'country' => ['nullable', 'string', 'max:255'], // Optional country field
            'cityState' => ['nullable', 'string', 'max:255'], // Optional city/state field
            'postalCode' => ['nullable', 'string', 'max:20'], // Optional postal code field
            'facebook' => ['nullable', 'url'], // Optional Facebook link
            'instagram' => ['nullable', 'url'], // Optional Instagram link
            'linkedin' => ['nullable', 'url'], // Optional LinkedIn link
            'twitter' => ['nullable', 'url'], // Optional Twitter link
            'profile_image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'], // Optional profile image
        ];
    }
}