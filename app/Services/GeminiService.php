<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class GeminiService
{
    public static function ask(string $question)
    {
        $schema = "
        Tables:

        products(id, name, price, quantity, active, parent_id, is_parent)

        orders(id, status, subtotal, total, city, active)

        users(id, name, email)

        carts(id, quantity, price, total)

        order_items(id, quantity, price, total)

        reports(id)
        ";

        $prompt = "
        You are an AI that converts ecommerce questions into SQL queries.

        Database schema:
        {$schema}

        Rules:
        - Only generate SELECT queries
        - Never generate DELETE, UPDATE, DROP, ALTER, TRUNCATE
        - Use correct table names
        - Return ONLY the SQL query
        - No explanations

        Example:

        Question: products with low stock
        SQL:
        SELECT name, quantity FROM products WHERE quantity < 5;

        Question:
        {$question}
        ";

        $apiKey = env('GEMINI_API_KEY');

        $response = Http::post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=' . $apiKey,
            [
                "contents" => [
                    [
                        "parts" => [
                            ["text" => $prompt]
                        ]
                    ]
                ]
            ]
        );

        if (!$response->successful()) {
            return "AI Error: " . $response->body();
        }

        $sql = trim($response->json()['candidates'][0]['content']['parts'][0]['text']);

        // remove markdown formatting
        $sql = str_replace(['```sql', '```'], '', $sql);
        $sql = trim($sql);

        // Security protection
        $blocked = ['delete', 'drop', 'truncate', 'update', 'alter'];

        foreach ($blocked as $word) {
            if (str_contains(strtolower($sql), $word)) {
                return "Unsafe SQL detected.";
            }
        }

        if (!str_starts_with(strtolower($sql), 'select')) {
            return "Invalid SQL generated.";
        }

        try {
            $result = DB::select($sql);
        } catch (\Exception $e) {
            return "Query execution error.";
        }

        return json_encode($result, JSON_PRETTY_PRINT);
    }
}
