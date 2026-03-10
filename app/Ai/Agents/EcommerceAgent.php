<?php

namespace App\Ai\Agents;

use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\Conversational;
use Laravel\Ai\Messages\Message;
use Laravel\Ai\Promptable;

// class EcommerceAgent implements Agent, Conversational
// {
//     use Promptable;

//     /**
//      * AI Instructions
//      */
//     public function instructions(): string
//     {
//         return "
//     You are an AI assistant for an ecommerce admin dashboard.

//     Your job is to help administrators analyze store data.

//     The system provides you with a snapshot of the database containing:
//     - products
//     - orders
//     - users
//     - cart
//     - reports
//     - order items

//     Guidelines:
//     - Always answer ONLY using the provided database snapshot.
//     - Do NOT invent data that does not exist.
//     - If the requested information is not present, reply: 'No data available in the database.'
//     - When listing items, format them clearly using bullet points or numbered lists.
//     - When summarizing data, calculate totals or counts based on the snapshot.
//     - For sales analysis, consider fields like:
//         * order totals
//         * order status
//         * product quantities
//         * cart totals
//     - For stock analysis, use product quantity fields.
//     - For customer insights, use the users table.
//     - For revenue insights, use order totals or order items totals.

//     Your responses should be:
//     - concise
//     - structured
//     - easy for an admin to read
//     ";
//     }

//     /**
//      * Conversation messages
//      */
//     public function messages(): iterable
//     {
//         return [];
//     }
// }
