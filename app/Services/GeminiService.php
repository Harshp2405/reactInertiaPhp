<?php

namespace App\Services;

use App\Ai\Router\AiActionRouter;
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

        reports(id , status , type)
        ";

        $prompt = "
        You are an AI assistant for an ecommerce admin panel.

        Your job is to convert admin questions into JSON actions.

        Available actions:
        create_product
        update_product
        delete_product
        update_order
        edit_order
        analytics_query
        build_chart
        generate SELECT, INSERT, UPDATE, DELETE queries


        Database schema:
        {$schema}

        Rules:
        - Never generate  TRUNCATE
        - Use correct table names from schemas
        - Return ONLY the JSON query
        - No explanations

        - For create_product ALWAYS include:
        name
        price
        quantity

        Required JSON format:
            {
                \"action\": \"<action_name>\",
                    \"name\": \"...\",
                    \"price\": ...,
                    \"quantity\": ...
                    // other relevant fields
            }

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

        // $text = $response->json()['candidates'][0]['content']['parts'][0]['text'] ?? '';

        // // Remove markdown formatting
        // $text = str_replace(['```json', '```sql', '```'], '', $text);
        // $text = trim($text);

        // // Try to decode JSON action
        // $data = json_decode($text, true);

        // if (json_last_error() === JSON_ERROR_NONE && isset($data['action'])) {
        //     // Route to proper action
        //     return AiActionRouter::run($data);
        // }

        // // Otherwise treat as SQL
        // $sql = $text;

        // // Security: block TRUNCATE only
        // if (str_contains(strtolower($sql), 'truncate')) {
        //     return [
        //         'success' => false,
        //         'error' => 'Unsafe SQL detected: TRUNCATE is blocked.',
        //     ];
        // }

        // try {
        //     $sqlLower = strtolower(trim($sql));
        //     if (str_starts_with($sqlLower, 'select')) {
        //         $result = DB::select($sql);
        //     } else {
        //         // Use statement() for INSERT, UPDATE, DELETE
        //         DB::statement($sql);
        //         $result = ['success' => true, 'message' => "Query executed successfully {$sql}"];
        //     }
        // } catch (\Exception $e) {
        //     return [
        //         'success' => false,
        //         'error' => $e->getMessage(),
        //     ];
        // }

        // return json_encode($result, JSON_PRETTY_PRINT);



        $text = $response->json()['candidates'][0]['content']['parts'][0]['text'] ?? '';
        $text = str_replace(['```json','```'], '', trim($text));

        // Decode JSON from AI
        $data = json_decode($text, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return [
                'success' => false,
                'error' => 'Invalid JSON returned from AI',
                'raw' => $text
            ];
        }

        // Route to proper action
        return AiActionRouter::run($data);

    }
}
