<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resident extends Model
{
    protected $guarded = [];

    public function houses()
    {
        return $this->belongsToMany(House::class, 'house_residents')
            ->withPivot('start_date', 'end_date')
            ->withTimestamps();
    }
}
