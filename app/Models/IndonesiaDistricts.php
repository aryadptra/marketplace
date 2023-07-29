<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IndonesiaDistricts extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'city_code',
        'name',
        'meta',
        'created_at',
        'updated_at',
    ];

    protected $table = 'indonesia_districts';

    public function city()
    {
        return $this->belongsTo(IndonesiaCities::class, 'city_code', 'code');
    }
}
