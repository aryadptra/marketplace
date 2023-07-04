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
        Schema::create('product_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->integer('sales')->default(0);
            $table->string('pre_order')->default('off');
            $table->string('pre_order_message')->nullable();
            $table->float('weight');
            $table->string('weight_unit');

            // discount
            $table->string('discount_status')->default('off');
            $table->string('discount_type')->default('percentage')->nullable();
            $table->string('discount_start_date')->nullable();
            $table->string('discount_end_date')->nullable();
            $table->integer('discount_percentage')->nullable();
            $table->integer('discount_value')->nullable();
            $table->integer('discount_minimum_quantity')->nullable();
            $table->integer('discount_maximum_quantity')->nullable();
            // soft delete
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
        Schema::dropIfExists('product_details');
    }
};
