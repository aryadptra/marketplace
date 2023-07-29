<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IndonesiaVillages extends Model
{
    use HasFactory;
    protected $fillable = [
        'code',
        'district_code',
        'name',
        'meta',
        'created_at',
        'updated_at',
    ];

    protected $table = 'indonesia_villages';

    public function district()
    {
        return $this->belongsTo(IndonesiaDistricts::class, 'district_code', 'code');
    }
}
