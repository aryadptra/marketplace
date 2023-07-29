<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IndonesiaProvince extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'code',
        'name',
        'meta',
        'created_at',
        'updated_at',
    ];

    protected $table = 'indonesia_provinces';
}
