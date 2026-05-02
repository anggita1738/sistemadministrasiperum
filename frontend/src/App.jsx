import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Residents from './pages/Residents';
import Houses from './pages/Houses';
import Payments from './pages/Payments';
import Expenses from './pages/Expenses';

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 glass-dark text-white p-6 shadow-xl relative z-10 hidden md:block rounded-r-3xl my-4 ml-4">
        <h1 className="text-2xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
          Sistem Admin Perumahan
        </h1>
        <nav className="space-y-4">
          <Link to="/" className="block px-4 py-3 rounded-xl hover:bg-white/10 transition-all font-medium text-slate-300 hover:text-white">Dashboard</Link>
          <Link to="/residents" className="block px-4 py-3 rounded-xl hover:bg-white/10 transition-all font-medium text-slate-300 hover:text-white">Kelola Penghuni</Link>
          <Link to="/houses" className="block px-4 py-3 rounded-xl hover:bg-white/10 transition-all font-medium text-slate-300 hover:text-white">Kelola Rumah</Link>
          <Link to="/payments" className="block px-4 py-3 rounded-xl hover:bg-white/10 transition-all font-medium text-slate-300 hover:text-white">Pembayaran Iuran</Link>
          <Link to="/expenses" className="block px-4 py-3 rounded-xl hover:bg-white/10 transition-all font-medium text-slate-300 hover:text-white">Pengeluaran & Laporan</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto w-full">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/residents" element={<Residents />} />
          <Route path="/houses" element={<Houses />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/expenses" element={<Expenses />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
