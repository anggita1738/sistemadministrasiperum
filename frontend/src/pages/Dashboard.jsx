import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { TrendingUp, TrendingDown, Wallet, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [summary, setSummary] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/reports/summary').then(res => {
      setSummary(res.data);
    });
  }, []);

  const data = Array.isArray(summary) ? summary : [];
  const totalIncome = data.reduce((acc, curr) => acc + parseFloat(curr.income || 0), 0);
  const totalExpense = data.reduce((acc, curr) => acc + parseFloat(curr.expense || 0), 0);
  const balance = totalIncome - totalExpense;

  const cards = [
    {
      title: 'Total Pemasukan (1 Thn)',
      value: totalIncome,
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-teal-600',
      bgLight: 'bg-emerald-50 border-emerald-100',
      textColor: 'text-emerald-700',
      linkLabel: 'Lihat Detail Pemasukan',
    },
    {
      title: 'Total Pengeluaran (1 Thn)',
      value: totalExpense,
      icon: TrendingDown,
      gradient: 'from-red-500 to-rose-600',
      bgLight: 'bg-red-50 border-red-100',
      textColor: 'text-red-700',
      linkLabel: 'Lihat Detail Pengeluaran',
    },
    {
      title: 'Saldo / Kas',
      value: balance,
      icon: Wallet,
      gradient: 'from-blue-500 to-indigo-600',
      bgLight: 'bg-blue-50 border-blue-100',
      textColor: 'text-blue-700',
      linkLabel: 'Lihat Laporan Lengkap',
    },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] space-y-6">
      <h2 className="text-3xl font-bold text-slate-800 flex-shrink-0">Dashboard</h2>

      {/* Summary Cards — klik untuk ke halaman Laporan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              onClick={() => navigate('/expenses')}
              className={`
                group relative overflow-hidden rounded-2xl border shadow-sm cursor-pointer
                ${card.bgLight}
                hover:shadow-lg hover:-translate-y-1 transition-all duration-300
              `}
            >
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient}`}></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${card.gradient} shadow-md`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <ArrowRight size={18} className="text-slate-300 group-hover:text-slate-500 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-slate-500 font-medium text-sm mb-1">{card.title}</h3>
                <p className={`text-3xl font-bold ${card.textColor}`}>
                  Rp {card.value.toLocaleString('id-ID')}
                </p>
                <p className="text-xs text-slate-400 mt-2 group-hover:text-blue-500 transition-colors">
                  {card.linkLabel} →
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grafik Pemasukan & Pengeluaran */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col min-h-[400px]">
        <h3 className="text-xl font-bold text-slate-800 mb-2 flex-shrink-0">Grafik Pemasukan & Pengeluaran per Bulan</h3>
        {summary.length > 0 ? (
          <div className="flex-1 w-full mt-4 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickFormatter={(val) => {
                  if (!val) return "";
                  const parts = val.split('-');
                  if (parts.length < 2) return val;
                  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
                  return `${months[parseInt(parts[1]) - 1]} ${parts[0]}`;
                }} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={v => v.toLocaleString('id-ID')} />
                <Tooltip
                  cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  formatter={(value) => [`Rp ${parseFloat(value).toLocaleString('id-ID')}`, undefined]}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="income" name="Pemasukan" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expense" name="Pengeluaran" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-slate-400">
            <p>Belum ada data laporan. Pastikan terdapat iuran yang sudah dilunasi.</p>
          </div>
        )}
      </div>
    </div>
  );
}
