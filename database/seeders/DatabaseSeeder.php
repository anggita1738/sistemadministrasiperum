<?php

namespace Database\Seeders;

use App\Models\House;
use App\Models\Resident;
use App\Models\HouseResident;
use App\Models\Due;
use App\Models\Expense;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create 20 Houses
        for ($i = 1; $i <= 20; $i++) {
            House::create([
                'code' => 'Blok A' . $i,
                'is_occupied' => $i <= 15 ? true : false,
            ]);
        }

        // 2. Create 15 Residents for the occupied houses
        $houses = House::where('is_occupied', true)->get();
        
        $monthStr = Carbon::now()->format('Y-m');
        $lastMonthStr = Carbon::now()->subMonth()->format('Y-m');

        foreach ($houses as $index => $house) {
            $isTetap = $index % 2 == 0;
            $resident = Resident::create([
                'full_name' => 'Penghuni ' . ($index + 1),
                'status' => $isTetap ? 'tetap' : 'kontrak',
                'phone' => '0812345678' . str_pad($index, 2, '0', STR_PAD_LEFT),
                'is_married' => $index % 3 == 0,
            ]);

            // Map history
            HouseResident::create([
                'house_id' => $house->id,
                'resident_id' => $resident->id,
                'start_date' => Carbon::now()->subMonths(rand(1, 12))->format('Y-m-d'),
            ]);

            // Add dues for last month (mostly paid)
            Due::create([
                'house_id' => $house->id,
                'month' => $lastMonthStr,
                'type' => 'satpam',
                'amount' => 100000,
                'status' => 'lunas',
                'paid_at' => Carbon::now()->subDays(10),
            ]);

            Due::create([
                'house_id' => $house->id,
                'month' => $lastMonthStr,
                'type' => 'kebersihan',
                'amount' => 15000,
                'status' => 'lunas',
                'paid_at' => Carbon::now()->subDays(10),
            ]);

            // Add dues for this month
            $isPaid = rand(0, 1) == 1;
            Due::create([
                'house_id' => $house->id,
                'month' => $monthStr,
                'type' => 'satpam',
                'amount' => 100000,
                'status' => $isPaid ? 'lunas' : 'belum',
                'paid_at' => $isPaid ? Carbon::now() : null,
            ]);

            Due::create([
                'house_id' => $house->id,
                'month' => $monthStr,
                'type' => 'kebersihan',
                'amount' => 15000,
                'status' => $isPaid ? 'lunas' : 'belum',
                'paid_at' => $isPaid ? Carbon::now() : null,
            ]);
        }

        // 3. Dummy Expenses
        Expense::create([
            'description' => 'Gaji Satpam',
            'amount' => 1500000,
            'expense_date' => Carbon::now()->format('Y-m-d'),
        ]);

        Expense::create([
            'description' => 'Token Listrik Pos',
            'amount' => 200000,
            'expense_date' => Carbon::now()->subDays(2)->format('Y-m-d'),
        ]);
        
        Expense::create([
            'description' => 'Perbaikan Selokan',
            'amount' => 500000,
            'expense_date' => Carbon::now()->subMonths(1)->format('Y-m-d'),
        ]);
    }
}
