<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('stades', function (Blueprint $table) {
            $table->string('image')->nullable(); // Stocke le chemin de l'image
        });
    }
    
    public function down()
    {
        Schema::table('stades', function (Blueprint $table) {
            $table->dropColumn('image');
        });
    }
    
};
