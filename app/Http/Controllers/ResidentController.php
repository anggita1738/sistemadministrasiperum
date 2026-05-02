<?php

namespace App\Http\Controllers;

use App\Models\Resident;
use Illuminate\Http\Request;

class ResidentController extends Controller
{
    public function index()
    {
        return response()->json(Resident::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string',
            'status' => 'required|in:tetap,kontrak',
            'phone' => 'nullable|string',
            'is_married' => 'boolean',
        ]);

        $resident = Resident::create($validated);
        return response()->json($resident, 201);
    }

    public function update(Request $request, $id)
    {
        $resident = Resident::findOrFail($id);
        $validated = $request->validate([
            'full_name' => 'sometimes|required|string',
            'status' => 'sometimes|required|in:tetap,kontrak',
            'phone' => 'nullable|string',
            'is_married' => 'boolean',
        ]);

        $resident->update($validated);
        return response()->json($resident);
    }
}
