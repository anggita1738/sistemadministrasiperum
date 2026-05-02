<?php

namespace App\Http\Controllers;

use App\Models\House;
use App\Models\HouseResident;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class HouseController extends Controller
{
    public function index()
    {
        return response()->json(House::with(['residents' => function($query) {
            $query->whereNull('house_residents.end_date'); // Current occupant
        }])->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:houses,code',
        ]);

        $house = House::create($validated);
        return response()->json($house, 201);
    }

    public function occupy(Request $request, $id)
    {
        $house = House::findOrFail($id);
        $validated = $request->validate([
            'resident_id' => 'required|exists:residents,id',
            'start_date' => 'required|date'
        ]);

        // End previous occupants
        HouseResident::where('house_id', $house->id)
            ->whereNull('end_date')
            ->update(['end_date' => Carbon::parse($validated['start_date'])->subDay()]);

        // Add new occupant
        HouseResident::create([
            'house_id' => $house->id,
            'resident_id' => $validated['resident_id'],
            'start_date' => $validated['start_date']
        ]);

        $house->update(['is_occupied' => true]);

        return response()->json(['message' => 'House occupied successfully']);
    }
}
