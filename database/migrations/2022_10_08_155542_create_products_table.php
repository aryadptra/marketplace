<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            // category id is a foreign key
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            // user id as foreign key
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('name');
            $table->string('slug');
            $table->longText('thumbnail');
            $table->string('description');
            $table->string('price');
            $table->integer('stock');
            $table->integer('min_order')->default(1);
            // status: DRAFT, PUBLISHED, UNPUBLISHED
            $table->string('status')->default('DRAFT');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products');
    }
};
