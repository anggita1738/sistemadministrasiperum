import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Houses() {
  const [houses, setHouses] = useState([]);
  const [residents, setResidents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [formData, setFormData] = useState({ resident_id: '', start_date: '' });

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
      closeModal();
    });
  };

  const openModal = (house) => {
    setSelectedHouse(house);
    setFormData({ resident_id: '', start_date: new Date().toISOString().split('T')[0] });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedHouse(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-800">Kelola Rumah</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {houses.map(house => {
          const currentOccupant = house.residents?.[0];
          return (
            <div key={house.id} className="glass p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
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
              
              <button 
                onClick={() => openModal(house)} 
                className="w-full py-2 bg-slate-50 hover:bg-blue-50 text-blue-600 border border-slate-200 hover:border-blue-200 rounded-xl font-medium transition-colors"
              >
                Atur Penghuni
              </button>
            </div>
          );
        })}
      </div>

      {showModal && (
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
