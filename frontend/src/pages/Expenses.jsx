import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ description: '', amount: '', expense_date: new Date().toISOString().split('T')[0] });
  const [monthlyDetail, setMonthlyDetail] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    fetchMonthlyDetail();
  }, [selectedMonth]);

  const fetchExpenses = () => {
    api.get('/expenses').then(res => setExpenses(res.data));
  };

  const fetchMonthlyDetail = () => {
    api.get(`/reports/monthly?month=${selectedMonth}`).then(res => setMonthlyDetail(res.data));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/expenses', formData).then(() => {
      fetchExpenses();
      fetchMonthlyDetail();
      closeModal();
    });
  };

  const openModal = () => {
    setFormData({ description: '', amount: '', expense_date: new Date().toISOString().split('T')[0] });
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-800">Pengeluaran & Laporan Detail</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Detail Laporan Bulanan */}
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800">Laporan Bulan:</h3>
            <input type="month" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="border border-slate-300 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          {monthlyDetail && (
            <div className="glass bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                  <p className="text-sm text-emerald-600 font-medium mb-1">Total Pemasukan</p>
                  <p className="text-2xl font-bold text-emerald-700">Rp {parseFloat(monthlyDetail.total_income).toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                  <p className="text-sm text-red-600 font-medium mb-1">Total Pengeluaran</p>
                  <p className="text-2xl font-bold text-red-700">Rp {parseFloat(monthlyDetail.total_expense).toLocaleString('id-ID')}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <p className="text-sm text-slate-600 font-medium mb-1">Saldo Bulan Ini</p>
                <p className={`text-3xl font-bold ${monthlyDetail.total_income - monthlyDetail.total_expense >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  Rp {(monthlyDetail.total_income - monthlyDetail.total_expense).toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Daftar Pengeluaran */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800">Catatan Pengeluaran</h3>
            <button onClick={openModal} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition-colors">
              + Catat Pengeluaran
            </button>
          </div>
          <div className="glass bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden max-h-[500px] overflow-y-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-600">Tanggal</th>
                  <th className="px-6 py-4 font-semibold text-slate-600">Keterangan</th>
                  <th className="px-6 py-4 font-semibold text-slate-600">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.map(e => (
                  <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-600">{new Date(e.expense_date).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{e.description}</td>
                    <td className="px-6 py-4 text-red-600 font-medium">Rp {parseFloat(e.amount).toLocaleString('id-ID')}</td>
                  </tr>
                ))}
                {expenses.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-slate-500">Belum ada pengeluaran.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Catat Pengeluaran Baru</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Pengeluaran</label>
                <input type="date" required value={formData.expense_date} onChange={e => setFormData({...formData, expense_date: e.target.value})} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Keterangan</label>
                <input type="text" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none" placeholder="Cth: Perbaikan Jalan" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Jumlah</label>
                <input type="number" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none" />
              </div>
              <div className="flex justify-end space-x-3 mt-8">
                <button type="button" onClick={closeModal} className="px-5 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium transition-colors">Batal</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 font-medium shadow-sm transition-colors">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
