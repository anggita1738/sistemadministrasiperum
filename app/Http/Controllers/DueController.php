<?php

namespace App\Http\Controllers;

use App\Models\Due;
use App\Models\House;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class DueController extends Controller
{
    public function index(Request $request)
    {
        $query = Due::with('house');
        if ($request->has('month')) {
            $query->where('month', $request->month);
        }
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        // Bulk generate or single
        $validated = $request->validate([
            'house_id' => 'required|exists:houses,id',
            'month' => 'required|string', // YYYY-MM
            'type' => 'required|in:satpam,kebersihan',
            'amount' => 'required|numeric'
        ]);

        $due = Due::create($validated);
        return response()->json($due, 201);
    }

    public function pay(Request $request, $id)
    {
        $due = Due::findOrFail($id);
        $due->update([
            'status' => 'lunas',
            'paid_at' => Carbon::now()
        ]);

        return response()->json($due);
    }
}
