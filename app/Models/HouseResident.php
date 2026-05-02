<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HouseResident extends Model
{
    protected $guarded = [];

    public function resident()
    {
        return $this->belongsTo(Resident::class);
    }
}
