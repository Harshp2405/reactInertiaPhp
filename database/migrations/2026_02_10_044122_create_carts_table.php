<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('carts', function (Blueprint $table) {
            $table->id();

            // Logged-in user
            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            // Product reference
            $table->foreignId('product_id')
                ->constrained('products')
                ->cascadeOnDelete();

            // Cart data
            $table->integer('quantity')->default(1);
            $table->decimal('price', 12, 2);  
            $table->decimal('total', 10, 2);   

            $table->timestamps();

            // Prevent duplicate product per user
            $table->unique(['user_id', 'product_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('carts');
    }
};
