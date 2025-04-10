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
        Schema::create('produits', function (Blueprint $table) {
            $table->id(); // Clé primaire, identifiant unique
            $table->string('name', 255); // Nom du produit
            $table->text('description'); // Description du produit
            $table->decimal('price', 8, 2); // Prix du produit
            $table->string('category', 100); // Catégorie du produit
            $table->string('image_url', 255)->nullable(); // URL de l'image du produit
            $table->integer('stock'); // Quantité disponible en stock
            $table->timestamps(); // created_at et updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produits');
    }
};
