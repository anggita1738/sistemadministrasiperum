import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Residents() {
  const [residents, setResidents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', status: 'tetap', phone: '', is_married: false });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = () => {
    api.get('/residents').then(res => setResidents(res.data));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      api.put(`/residents/${editingId}`, formData).then(() => {
        fetchResidents();
        closeModal();
      });
    } else {
      api.post('/residents', formData).then(() => {
        fetchResidents();
        closeModal();
      });
    }
  };

  const openModal = (resident = null) => {
    if (resident) {
      setFormData(resident);
      setEditingId(resident.id);
    } else {
      setFormData({ full_name: '', status: 'tetap', phone: '', is_married: false });
      setEditingId(null);
    }
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-800">Kelola Penghuni</h2>
        <button onClick={() => openModal()} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium shadow-sm transition-colors">
          + Tambah Penghuni
        </button>
      </div>

      <div className="glass bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-600">Nama Lengkap</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Status</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Telepon</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Status Pernikahan</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {residents.map(r => (
              <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-800">{r.full_name}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${r.status === 'tetap' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {r.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">{r.phone || '-'}</td>
                <td className="px-6 py-4 text-slate-600">{r.is_married ? 'Menikah' : 'Belum Menikah'}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openModal(r)} className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                </td>
              </tr>
            ))}
            {residents.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-slate-500">Belum ada data penghuni.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-6">{editingId ? 'Edit Penghuni' : 'Tambah Penghuni'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                <input type="text" required value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status Penghuni</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="tetap">Tetap</option>
                  <option value="kontrak">Kontrak</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nomor Telepon</label>
                <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="is_married" checked={formData.is_married} onChange={e => setFormData({...formData, is_married: e.target.checked})} className="rounded text-blue-600 w-4 h-4 mr-2" />
                <label htmlFor="is_married" className="text-sm font-medium text-slate-700">Sudah Menikah</label>
              </div>
              <div className="flex justify-end space-x-3 mt-8">
                <button type="button" onClick={closeModal} className="px-5 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium transition-colors">Batal</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-sm transition-colors">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
