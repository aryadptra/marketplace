<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserDetail extends Model
{
    use HasFactory;

    protected $fillable = [
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
