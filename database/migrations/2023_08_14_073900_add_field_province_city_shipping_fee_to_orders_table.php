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
        Schema::table('orders', function (Blueprint $table) {
            // Add province
            $table->string('province')->after('shipping_address')->nullable();
            // Add city
            $table->string('city')->after('province')->nullable();
            // Add shipping fee
            $table->integer('shipping_fee')->after('shipping_code')->nullable();
            // Courier service
            $table->string('courier_service')->after('courier')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            // Drop province
            $table->dropColumn('province');
            // Drop city
            $table->dropColumn('city');
            // Drop shipping fee
            $table->dropColumn('shipping_fee');
            // Drop courier service
            $table->dropColumn('courier_service');
        });
    }
};
