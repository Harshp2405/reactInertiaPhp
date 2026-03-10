<?php

namespace App\Ai\Tools;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use App\Models\User;

class EcommerseTool
{
    public function handle(Request $request)
    {
        $question = $request->get('question');

        if (!$question) {
            return "No question provided.";
        }

        // Fetch database data
        $products = Product::select('id', 'name', 'price', 'quantity')->limit(50)->get();
        $orders   = Order::select('id', 'status', 'subtotal')->limit(50)->get();
        $users    = User::select('id', 'name', 'email')->limit(50)->get();

        $databaseSnapshot = json_encode([
            'products' => $products,
            'orders'   => $orders,
            'users'    => $users
        ]);

        $prompt = "
        You are an AI assistant for an ecommerce admin dashboard.

        Database snapshot:
        {$databaseSnapshot}

        User question:
        {$question}

        Answer based ONLY on the database data.
        If the data is not available say 'No data found'.
        ";

        return $this->callGemini($prompt);
    }

    private function callGemini(string $prompt)
    {
        $apiKey = env('GEMINI_API_KEY');

        $response = Http::post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" . $apiKey,
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
            return "Gemini Error: " . $response->body();
        }

        return $response->json()['candidates'][0]['content']['parts'][0]['text'] ?? 'No response';
    }

    private function callOpenAI(string $question): string
    {
        $apiKey = env('OPENAI_API_KEY');

        if (!$apiKey) {
            return "⚠️ OpenAI API key not set.";
        }

        $response = Http::withToken($apiKey)
            ->post('https://api.openai.com/v1/chat/completions', [
                'model' => 'gpt-3.5-turbo',
                'messages' => [['role' => 'user', 'content' => $question]],
                'max_tokens' => 200,
            ]);

        if (!$response->successful()) {
            return "⚠️ OpenAI Error: " . $response->body();
        }

        $body = $response->json();
        return $body['choices'][0]['message']['content'] ?? 'No response';
    }
}
