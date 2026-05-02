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
        $validated = $request->validate([
            'house_id' => 'required|exists:houses,id',
            'month' => 'required|string', // YYYY-MM
            'type' => 'required|in:satpam,kebersihan',
            'amount' => 'required|numeric',
            'months_count' => 'integer|min:1|max:12'
        ]);

        $monthsCount = $request->input('months_count', 1);
        $startDate = Carbon::parse($validated['month'] . '-01');
        $created = [];

        for ($i = 0; $i < $monthsCount; $i++) {
            $currentMonth = $startDate->copy()->addMonths($i)->format('Y-m');
            
            $due = Due::create([
                'house_id' => $validated['house_id'],
                'month' => $currentMonth,
                'type' => $validated['type'],
                'amount' => $validated['amount'],
                'status' => 'belum'
            ]);
            $created[] = $due;
        }

        return response()->json($created, 201);
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
