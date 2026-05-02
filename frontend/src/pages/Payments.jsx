import React, { useEffect, useState } from "react";
import api from "../api";
import { FileSpreadsheet, FileText, Printer } from "lucide-react";
import { downloadCsv, downloadPdf, printTable } from "../utils/export";

export default function Payments() {
    const [dues, setDues] = useState([]);
    const [houses, setHouses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        house_id: "",
        month: new Date().toISOString().slice(0, 7),
        type: "satpam",
        amount: 100000,
        months_count: 1,
    });

    useEffect(() => {
        fetchDues();
        api.get("/houses").then((res) => setHouses(res.data));
    }, []);

    const fetchDues = () => {
        api.get("/dues").then((res) => {
            // Sort by latest first
            const sorted = res.data.sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at),
            );
            setDues(sorted);
        });
    };

    const handlePay = (id) => {
        if (window.confirm("Tandai tagihan ini sebagai lunas?")) {
            api.post(`/dues/${id}/pay`).then(() => {
                fetchDues();
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        api.post("/dues", formData).then(() => {
            fetchDues();
            closeModal();
        });
    };

    const openModal = () => {
        setFormData({
            house_id: "",
            month: new Date().toISOString().slice(0, 7),
            type: "satpam",
            amount: 100000,
            months_count: 1,
        });
        setShowModal(true);
    };
    const closeModal = () => setShowModal(false);

    const formatType = (type) => {
        if (!type) return "-";
        return type.charAt(0).toUpperCase() + type.slice(1);
    };

    const formatStatus = (status) => (status === "lunas" ? "Lunas" : "Belum");

    const formatCurrency = (value) => {
        const amount = Number(value || 0);
        return `Rp ${amount.toLocaleString("id-ID")}`;
    };

    const paymentHeaders = [
        "Rumah",
        "Bulan",
        "Jenis Iuran",
        "Jumlah",
        "Status",
    ];
    const paymentRows = dues.map((due) => [
        due.house?.code || "-",
        due.month,
        formatType(due.type),
        Number(due.amount || 0),
        formatStatus(due.status),
    ]);
    const paymentRowsDisplay = dues.map((due) => [
        due.house?.code || "-",
        due.month,
        formatType(due.type),
        formatCurrency(due.amount),
        formatStatus(due.status),
    ]);

    const handleExportExcel = () => {
        downloadCsv("data-iuran.csv", paymentHeaders, paymentRows);
    };

    const handleExportPdf = () => {
        downloadPdf({
            title: "Data Pembayaran Iuran",
            filename: "data-iuran.pdf",
            headers: paymentHeaders,
            rows: paymentRowsDisplay,
            orientation: "landscape",
        });
    };

    const handlePrint = () => {
        printTable({
            title: "Data Pembayaran Iuran",
            headers: paymentHeaders,
            rows: paymentRowsDisplay,
        });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <h2 className="text-3xl font-bold text-slate-800">
                    Pembayaran Iuran
                </h2>
                <div>
                    <button
                        onClick={openModal}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-medium shadow-sm transition-colors"
                    >
                        + Buat Tagihan Baru
                    </button>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleExportExcel}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-medium shadow-sm transition-colors"
                    >
                        <FileSpreadsheet size={18} /> Excel
                    </button>
                    <button
                        onClick={handleExportPdf}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-medium shadow-sm transition-colors"
                    >
                        <FileText size={18} /> PDF
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-xl font-medium shadow-sm transition-colors"
                    >
                        <Printer size={18} /> Print
                    </button>
                </div>
            </div>

            <div className="glass bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-600">
                                Rumah
                            </th>
                            <th className="px-6 py-4 font-semibold text-slate-600">
                                Bulan
                            </th>
                            <th className="px-6 py-4 font-semibold text-slate-600">
                                Jenis Iuran
                            </th>
                            <th className="px-6 py-4 font-semibold text-slate-600">
                                Jumlah
                            </th>
                            <th className="px-6 py-4 font-semibold text-slate-600">
                                Status
                            </th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-right no-print">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {dues.map((d) => (
                            <tr
                                key={d.id}
                                className="hover:bg-slate-50 transition-colors"
                            >
                                <td className="px-6 py-4 font-medium text-slate-800">
                                    {d.house?.code}
                                </td>
                                <td className="px-6 py-4 text-slate-600">
                                    {d.month}
                                </td>
                                <td className="px-6 py-4 text-slate-600 capitalize">
                                    {d.type}
                                </td>
                                <td className="px-6 py-4 text-slate-600">
                                    Rp{" "}
                                    {parseFloat(d.amount).toLocaleString(
                                        "id-ID",
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${d.status === "lunas" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                                    >
                                        {d.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right no-print">
                                    {d.status === "belum" && (
                                        <button
                                            onClick={() => handlePay(d.id)}
                                            className="text-emerald-600 hover:text-emerald-800 font-medium bg-emerald-50 px-3 py-1 rounded-lg"
                                        >
                                            Bayar
                                        </button>
                                    )}
                                    {d.status === "lunas" && (
                                        <span className="text-slate-400 text-sm">
                                            Telah Dibayar
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl border border-slate-200">
                        <h3 className="text-xl font-bold text-slate-800 mb-6">
                            Buat Tagihan Iuran
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Rumah
                                </label>
                                <select
                                    required
                                    value={formData.house_id}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            house_id: e.target.value,
                                        })
                                    }
                                    className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="" disabled>
                                        -- Pilih Rumah --
                                    </option>
                                    {houses.map((h) => (
                                        <option key={h.id} value={h.id}>
                                            {h.code}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Mulai Bulan
                                    </label>
                                    <input
                                        type="month"
                                        required
                                        value={formData.month}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                month: e.target.value,
                                            })
                                        }
                                        className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Jumlah Bulan
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="12"
                                        required
                                        value={formData.months_count}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                months_count: parseInt(e.target.value),
                                            })
                                        }
                                        className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Jenis Iuran
                                </label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => {
                                        const type = e.target.value;
                                        setFormData({
                                            ...formData,
                                            type,
                                            amount:
                                                type === "satpam"
                                                    ? 100000
                                                    : 15000,
                                        });
                                    }}
                                    className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="satpam">
                                        Satpam (Rp 100.000)
                                    </option>
                                    <option value="kebersihan">
                                        Kebersihan (Rp 15.000)
                                    </option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Jumlah (Per Bulan)
                                </label>
                                <input
                                    type="number"
                                    required
                                    value={formData.amount}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            amount: e.target.value,
                                        })
                                    }
                                    className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="flex justify-end space-x-3 mt-8">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-5 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-medium shadow-sm transition-colors"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
