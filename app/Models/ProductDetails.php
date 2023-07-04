<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductDetails extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'product_id',
        'sales',
        'pre_order',
        'pre_order_message',
        'weight',
        'weight_unit',
        'discount_status',
        'discount_type',
        'discount_start_date',
        'discount_end_date',
        'discount_percentage',
        'discount_value',
        'discount_minimum_quantity',
        'discount_maximum_quantity'
    ];
}
