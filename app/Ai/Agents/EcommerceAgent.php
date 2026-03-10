<?php

namespace App\Ai\Agents;

use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\Conversational;
use Laravel\Ai\Messages\Message;
use Laravel\Ai\Promptable;

class EcommerceAgent implements Agent, Conversational
{
    use Promptable;

    /**
     * AI Instructions
     */
    public function instructions(): string
    {
        return "
        You are an AI assistant for an ecommerce admin dashboard.

        You help with:
        - products
        - orders
        - customers
        - stock analysis

        Always answer based on the provided database data.
        If data is missing say 'No data available'.
        ";
    }

    /**
     * Conversation messages
     */
    public function messages(): iterable
    {
        return [];
    }
}
