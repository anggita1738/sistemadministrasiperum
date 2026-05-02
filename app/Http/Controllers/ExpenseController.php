<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Due;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

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
        // Pemasukan per bulan (dari iuran yang sudah lunas)
        $income = DB::table('dues')
            ->selectRaw("DATE_FORMAT(paid_at, '%Y-%m') as bulan, SUM(amount) as total")
            ->where('status', '=', 'lunas')
            ->whereNotNull('paid_at')
            ->groupByRaw("DATE_FORMAT(paid_at, '%Y-%m')")
            ->orderBy('bulan', 'asc')
            ->limit(12)
            ->get();

        // Pengeluaran per bulan
        $expense = DB::table('expenses')
            ->selectRaw("DATE_FORMAT(expense_date, '%Y-%m') as bulan, SUM(amount) as total")
            ->groupByRaw("DATE_FORMAT(expense_date, '%Y-%m')")
            ->orderBy('bulan', 'asc')
            ->limit(12)
            ->get();

        // Merge data
        $summary = [];
        foreach ($income as $inc) {
            $summary[$inc->bulan] = [
                'month' => $inc->bulan,
                'income' => (float)$inc->total,
                'expense' => 0,
            ];
        }
        foreach ($expense as $exp) {
            if (!isset($summary[$exp->bulan])) {
                $summary[$exp->bulan] = [
                    'month' => $exp->bulan,
                    'income' => 0,
                    'expense' => (float)$exp->total,
                ];
            } else {
                $summary[$exp->bulan]['expense'] = (float)$exp->total;
            }
        }

        // Fill last 12 months with zeros if no data
        $result = [];
        for ($i = 11; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i)->format('Y-m');
            $incomeVal = isset($summary[$month]) ? $summary[$month]['income'] : 0;
            $expenseVal = isset($summary[$month]) ? $summary[$month]['expense'] : 0;
            
            $result[] = [
                'month' => $month,
                'income' => $incomeVal,
                'expense' => $expenseVal,
                'balance' => $incomeVal - $expenseVal,
            ];
        }

        return response()->json($result);
    }

    public function monthlyDetail(Request $request)
    {
        $month = $request->get('month', date('Y-m'));

        $incomeDetails = Due::with('house')
            ->where('status', 'lunas')
            ->whereRaw("DATE_FORMAT(paid_at, '%Y-%m') = ?", [$month])
            ->get();

        $expenseDetails = Expense::whereRaw("DATE_FORMAT(expense_date, '%Y-%m') = ?", [$month])->get();

        return response()->json([
            'month' => $month,
            'incomes' => $incomeDetails,
            'expenses' => $expenseDetails,
            'total_income' => (float)$incomeDetails->sum('amount'),
            'total_expense' => (float)$expenseDetails->sum('amount'),
        ]);
    }
}
