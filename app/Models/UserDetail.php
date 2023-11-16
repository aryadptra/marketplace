<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserDetail extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'user_details';

    protected $fillable = [
        'user_id',
        'avatar',
        'phone_number',
        'address',
        'country',
        'province_id',
        'city_id',
        'district_id',
        'postal_code',
    ];
}
