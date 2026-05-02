import React, { useEffect, useState } from 'react';
import api from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    api.get('/reports/summary').then(res => {
      // Reverse array so chronological order
      setSummary(res.data.reverse());
    });
  }, []);

  const totalIncome = summary.reduce((acc, curr) => acc + parseFloat(curr.income), 0);
  const totalExpense = summary.reduce((acc, curr) => acc + parseFloat(curr.expense), 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-800">Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <h3 className="text-slate-500 font-medium mb-2">Total Pemasukan (1 Thn)</h3>
          <p className="text-3xl font-bold text-emerald-600">Rp {totalIncome.toLocaleString('id-ID')}</p>
        </div>
        <div className="glass p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <h3 className="text-slate-500 font-medium mb-2">Total Pengeluaran (1 Thn)</h3>
          <p className="text-3xl font-bold text-red-500">Rp {totalExpense.toLocaleString('id-ID')}</p>
        </div>
        <div className="glass p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <h3 className="text-slate-500 font-medium mb-2">Saldo / Kas</h3>
          <p className="text-3xl font-bold text-blue-600">Rp {balance.toLocaleString('id-ID')}</p>
        </div>
      </div>

      <div className="glass p-6 rounded-2xl shadow-sm border border-slate-200 mt-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6">Ringkasan Pemasukan & Pengeluaran</h3>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={summary}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="income" name="Pemasukan" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Pengeluaran" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
