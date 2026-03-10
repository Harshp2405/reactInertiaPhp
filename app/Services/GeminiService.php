<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class GeminiService
{
    public static function ask($prompt)
    {
        $apiKey = env('GEMINI_API_KEY');

        $response = Http::post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" . $apiKey,
            [
                "contents" => [
                    [
                        "parts" => [
                            [
                                "text" => $prompt
                            ]
                        ]
                    ]
                ]
            ]
        );

        if (!$response->successful()) {
            return "Gemini Error: " . $response->body();
        }

        return $response->json()['candidates'][0]['content']['parts'][0]['text'] ?? 'No response';
    }
}
