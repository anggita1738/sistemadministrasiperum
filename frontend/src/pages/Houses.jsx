import React, { useEffect, useState } from 'react';
import api from '../api';
import { History, Edit2, Trash2, Plus } from 'lucide-react';

export default function Houses() {
  const [houses, setHouses] = useState([]);
  const [residents, setResidents] = useState([]);
  const [showOccupyModal, setShowOccupyModal] = useState(false);
  const [showHouseModal, setShowHouseModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [houseHistory, setHouseHistory] = useState([]);
  const [formData, setFormData] = useState({ resident_id: '', start_date: '' });
  const [houseForm, setHouseForm] = useState({ code: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchHouses();
    api.get('/residents').then(res => setResidents(res.data));
  }, []);

  const fetchHouses = () => {
    api.get('/houses').then(res => setHouses(res.data));
  };

  const handleOccupy = (e) => {
    e.preventDefault();
    api.post(`/houses/${selectedHouse.id}/occupy`, formData).then(() => {
      fetchHouses();
      closeModals();
    });
  };

  const handleHouseSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      api.put(`/houses/${editingId}`, houseForm).then(() => {
        fetchHouses();
        closeModals();
      });
    } else {
      api.post('/houses', houseForm).then(() => {
        fetchHouses();
        closeModals();
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Hapus rumah ini?")) {
      api.delete(`/houses/${id}`).then(() => {
        fetchHouses();
      });
    }
  };

  const openOccupyModal = (house) => {
    setSelectedHouse(house);
    setFormData({ resident_id: '', start_date: new Date().toISOString().split('T')[0] });
    setShowOccupyModal(true);
  };

  const openHouseModal = (house = null) => {
    if (house) {
      setHouseForm({ code: house.code });
      setEditingId(house.id);
    } else {
      setHouseForm({ code: '' });
      setEditingId(null);
    }
    setShowHouseModal(true);
  };

  const openHistoryModal = (house) => {
    setSelectedHouse(house);
    api.get(`/houses/${house.id}/history`).then(res => {
      setHouseHistory(res.data);
      setShowHistoryModal(true);
    });
  };

  const closeModals = () => {
    setShowOccupyModal(false);
    setShowHouseModal(false);
    setShowHistoryModal(false);
    setSelectedHouse(null);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-800">Kelola Rumah</h2>
        <button 
          onClick={() => openHouseModal()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-medium shadow-sm transition-colors"
        >
          <Plus size={18} /> Tambah Rumah
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {houses.map(house => {
          const currentOccupant = house.residents?.[0];
          return (
            <div key={house.id} className="glass p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow relative group">
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openHouseModal(house)} className="p-2 bg-white text-slate-600 rounded-lg hover:text-blue-600 shadow-sm border border-slate-100">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => handleDelete(house.id)} className="p-2 bg-white text-slate-600 rounded-lg hover:text-red-600 shadow-sm border border-slate-100">
                  <Trash2 size={14} />
                </button>
              </div>
              
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-slate-800">{house.code}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${house.is_occupied ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                    {house.is_occupied ? 'Dihuni' : 'Kosong'}
                  </span>
                </div>
                {currentOccupant ? (
                  <div className="text-sm text-slate-600 mb-6">
                    <p className="font-semibold text-slate-800 mb-1">{currentOccupant.full_name}</p>
                    <p className="capitalize">{currentOccupant.status}</p>
                    <p>Mulai: {new Date(currentOccupant.pivot.start_date).toLocaleDateString('id-ID')}</p>
                  </div>
                ) : (
                  <div className="text-sm text-slate-500 mb-6 italic">Tidak ada penghuni saat ini.</div>
                )}
              </div>
              
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => openOccupyModal(house)} 
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                >
                  {house.is_occupied ? 'Ganti Penghuni' : 'Atur Penghuni'}
                </button>
                <button 
                  onClick={() => openHistoryModal(house)}
                  className="w-full py-2 flex items-center justify-center gap-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors border border-slate-200"
                >
                  <History size={16} /> Riwayat
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Occupy Modal */}
      {showOccupyModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Atur Penghuni - {selectedHouse?.code}</h3>
            <form onSubmit={handleOccupy} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Penghuni</label>
                <select required value={formData.resident_id} onChange={e => setFormData({...formData, resident_id: e.target.value})} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="" disabled>-- Pilih Penghuni --</option>
                  {residents.map(r => (
                    <option key={r.id} value={r.id}>{r.full_name} ({r.status})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Mulai Menempati</label>
                <input type="date" required value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="flex justify-end space-x-3 mt-8">
                <button type="button" onClick={closeModals} className="px-5 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium transition-colors">Batal</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-sm transition-colors">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* House Modal (Add/Edit) */}
      {showHouseModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-6">{editingId ? 'Edit Rumah' : 'Tambah Rumah'}</h3>
            <form onSubmit={handleHouseSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kode Rumah</label>
                <input 
                  type="text" 
                  required 
                  value={houseForm.code} 
                  onChange={e => setHouseForm({code: e.target.value})} 
                  placeholder="Cth: A-01"
                  className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
              <div className="flex justify-end space-x-3 mt-8">
                <button type="button" onClick={closeModals} className="px-5 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium transition-colors">Batal</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-sm transition-colors">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-xl border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Riwayat Penghuni - {selectedHouse?.code}</h3>
              <button onClick={closeModals} className="text-slate-400 hover:text-slate-600"><Plus size={24} className="rotate-45" /></button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-slate-600">Penghuni</th>
                    <th className="px-4 py-3 font-semibold text-slate-600">Masuk</th>
                    <th className="px-4 py-3 font-semibold text-slate-600">Keluar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {houseHistory.map((h, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-800">{h.resident?.full_name}</p>
                        <p className="text-xs text-slate-500 capitalize">{h.resident?.status}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-sm">{new Date(h.start_date).toLocaleDateString('id-ID')}</td>
                      <td className="px-4 py-3 text-slate-600 text-sm">{h.end_date ? new Date(h.end_date).toLocaleDateString('id-ID') : <span className="text-blue-600 font-medium">Sekarang</span>}</td>
                    </tr>
                  ))}
                  {houseHistory.length === 0 && (
                    <tr><td colSpan="3" className="px-4 py-8 text-center text-slate-500">Belum ada riwayat penghuni.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
