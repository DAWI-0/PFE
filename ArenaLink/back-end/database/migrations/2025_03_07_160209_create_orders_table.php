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
        Schema::create('orders', function (Blueprint $table) {
            $table->id(); // Clé primaire, identifiant unique
            $table->unsignedBigInteger('user_id'); // Clé étrangère vers users.id
            $table->decimal('total_amount', 8, 2); // Montant total de la commande
            $table->string('status', 50)->default('pending'); // Statut de la commande
            $table->timestamps(); // created_at et updated_at

            // Clé étrangère
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
