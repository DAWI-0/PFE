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
        Schema::create('items', function (Blueprint $table) {
            $table->id(); // Clé primaire, identifiant unique
            $table->unsignedBigInteger('order_id'); // Clé étrangère vers orders.id
            $table->unsignedBigInteger('produit_id'); // Clé étrangère vers products.id
            $table->integer('quantity'); // Quantité du produit commandé
            $table->decimal('price', 8, 2); // Prix unitaire du produit au moment de la commande
            $table->timestamps(); // created_at et updated_at

            // Clés étrangères
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
            $table->foreign('produit_id')->references('id')->on('produits')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
