<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IndonesiaCities extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'province_code',
        'name',
        'meta',
        'created_at',
        'updated_at',
    ];

    protected $table = 'indonesia_cities';

    public function province()
    {
        return $this->belongsTo(IndonesiaProvince::class, 'province_code', 'code');
    }
}
