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
        Schema::create('games', function (Blueprint $table) {
            $table->id(); 
            $table->unsignedBigInteger('tournament_id');
            $table->unsignedBigInteger('team1_id'); 
            $table->unsignedBigInteger('team2_id'); 
            $table->dateTime('start_time'); 
            $table->dateTime('end_time')->nullable(); 
            $table->string('status', 50)->default('scheduled'); 
            $table->unsignedBigInteger('winner_id')->nullable(); 
            $table->timestamps(); 

            
            $table->foreign('tournament_id')->references('id')->on('tournaments')->onDelete('cascade');
            $table->foreign('team1_id')->references('id')->on('teams')->onDelete('cascade');
            $table->foreign('team2_id')->references('id')->on('teams')->onDelete('cascade');
            $table->foreign('winner_id')->references('id')->on('teams')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('games');
    }
};
