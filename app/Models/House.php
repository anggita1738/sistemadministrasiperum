<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class House extends Model
{
    protected $guarded = [];

    public function residents()
    {
        return $this->belongsToMany(Resident::class, 'house_residents')
            ->withPivot('start_date', 'end_date')
            ->withTimestamps();
    }

    public function dues()
    {
        return $this->hasMany(Due::class);
    }
}
