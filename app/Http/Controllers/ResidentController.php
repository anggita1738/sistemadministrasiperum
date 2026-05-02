<?php

namespace App\Http\Controllers;

use App\Models\Resident;
use Illuminate\Http\Request;

class ResidentController extends Controller
{
    public function index()
    {
        $residents = Resident::all()->map(function ($resident) {
            $resident->ktp_photo_url = $resident->ktp_photo ? asset('storage/' . $resident->ktp_photo) : null;
            return $resident;
        });
        return response()->json($residents);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string',
            'status' => 'required|in:tetap,kontrak',
            'phone' => 'nullable|string',
            'is_married' => 'boolean',
            'ktp_photo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('ktp_photo')) {
            $path = $request->file('ktp_photo')->store('ktp_photos', 'public');
            $validated['ktp_photo'] = $path;
        }

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
            'ktp_photo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('ktp_photo')) {
            $path = $request->file('ktp_photo')->store('ktp_photos', 'public');
            $validated['ktp_photo'] = $path;
        }

        $resident->update($validated);
        return response()->json($resident);
    }

    public function destroy($id)
    {
        $resident = Resident::findOrFail($id);
        $resident->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
