<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Due;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ExpenseController extends Controller
{
    public function index()
    {
        return response()->json(Expense::orderBy('expense_date', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'description' => 'required|string',
            'amount' => 'required|numeric',
            'expense_date' => 'required|date',
        ]);

        $expense = Expense::create($validated);
        return response()->json($expense, 201);
    }

    public function summary()
    {
        // Pemasukan vs Pengeluaran per bulan selama 1 tahun terakhir
        $income = Due::select(DB::raw('DATE_FORMAT(paid_at, "%Y-%m") as month'), DB::raw('SUM(amount) as total'))
            ->where('status', 'lunas')
            ->whereNotNull('paid_at')
            ->groupBy('month')
            ->orderBy('month', 'desc')
            ->limit(12)
            ->get();

        $expense = Expense::select(DB::raw('DATE_FORMAT(expense_date, "%Y-%m") as month'), DB::raw('SUM(amount) as total'))
            ->groupBy('month')
            ->orderBy('month', 'desc')
            ->limit(12)
            ->get();

        // Merge the two for easy UI consumption
        $summary = [];
        foreach ($income as $inc) {
            $summary[$inc->month] = ['month' => $inc->month, 'income' => $inc->total, 'expense' => 0];
        }
        foreach ($expense as $exp) {
            if (!isset($summary[$exp->month])) {
                $summary[$exp->month] = ['month' => $exp->month, 'income' => 0, 'expense' => $exp->total];
            } else {
                $summary[$exp->month]['expense'] = $exp->total;
            }
        }

        // Calculate balance
        foreach ($summary as $month => $data) {
            $summary[$month]['balance'] = $data['income'] - $data['expense'];
        }

        return response()->json(array_values($summary));
    }

    public function monthlyDetail(Request $request)
    {
        $month = $request->get('month', date('Y-m'));

        $incomeDetails = Due::with('house')
            ->where('status', 'lunas')
            ->where(DB::raw('DATE_FORMAT(paid_at, "%Y-%m")'), $month)
            ->get();

        $expenseDetails = Expense::where(DB::raw('DATE_FORMAT(expense_date, "%Y-%m")'), $month)->get();

        return response()->json([
            'month' => $month,
            'incomes' => $incomeDetails,
            'expenses' => $expenseDetails,
            'total_income' => $incomeDetails->sum('amount'),
            'total_expense' => $expenseDetails->sum('amount')
        ]);
    }
}
