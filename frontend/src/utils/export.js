// Use globals from CDN as primary, fallback to imports
const getJsPDF = () => {
    if (window.jspdf && window.jspdf.jsPDF) return window.jspdf.jsPDF;
    return null; 
};

const getXLSX = () => {
    return window.XLS || window.XLSX || null;
};

const escapeHtml = (value) => {
    const str = value === null || value === undefined ? "" : String(value);
    return str.replace(/[&<>"']/g, (char) => {
        switch (char) {
            case "&": return "&amp;";
            case "<": return "&lt;";
            case ">": return "&gt;";
            case '"': return "&quot;";
            case "'": return "&#39;";
            default: return char;
        }
    });
};

const escapeCsvValue = (value) => {
    const str = value === null || value === undefined ? "" : String(value);
    const escaped = str.replace(/"/g, '""');
    if (/[",\n\r]/.test(escaped)) {
        return `"${escaped}"`;
    }
    return escaped;
};

export const downloadCsv = (filename, headers, rows) => {
    try {
        console.log("Starting Excel/CSV export...");
        if (!rows || rows.length === 0) {
            alert("Tidak ada data untuk diekspor.");
            return;
        }

        const XLSX = getXLSX();
        if (XLSX) {
            // Use real Excel if library available
            const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
            XLSX.writeFile(workbook, filename.replace(".csv", ".xlsx"));
            console.log("Excel export (.xlsx) success");
        } else {
            // Fallback to CSV
            const csvRows = [headers, ...rows].map((row) =>
                row.map(escapeCsvValue).join(","),
            );
            const csv = "\uFEFF" + csvRows.join("\r\n");
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            console.log("Excel export (CSV fallback) success");
        }
    } catch (error) {
        console.error("Export Excel failed:", error);
        alert("Gagal mengekspor Excel: " + error.message);
    }
};

export const downloadPdf = ({
    title,
    headers,
    rows,
    filename,
    orientation = "portrait",
}) => {
    try {
        console.log("Starting PDF export...");
        if (!rows || rows.length === 0) {
            alert("Tidak ada data untuk diekspor.");
            return;
        }

        const jsPDFClass = getJsPDF();
        if (!jsPDFClass) {
            alert("Library PDF (jsPDF) tidak dapat dimuat. Silakan periksa koneksi internet Anda atau refresh halaman.");
            return;
        }

        const doc = new jsPDFClass({ orientation, unit: "pt", format: "a4" });
        doc.setFontSize(14);
        doc.text(title, 40, 40);

        const tableConfig = {
            startY: 60,
            head: [headers],
            body: rows,
            theme: "grid",
            styles: { fontSize: 10, cellPadding: 6 },
            headStyles: { fillColor: [51, 65, 85] }, // slate-700
        };

        // autoTable is attached to the doc instance or available as a plugin
        if (typeof doc.autoTable === "function") {
            doc.autoTable(tableConfig);
        } else if (window.jspdf && typeof window.jspdf.autoTable === "function") {
            window.jspdf.autoTable(doc, tableConfig);
        } else {
            alert("Library Tabel PDF tidak ditemukan. Mohon refresh halaman.");
            return;
        }

        doc.save(filename);
        console.log("PDF export success");
    } catch (error) {
        console.error("Export PDF failed:", error);
        alert("Gagal mengekspor PDF: " + error.message);
    }
};

export const printTable = ({ title, headers, rows }) => {
    if (!rows || rows.length === 0) {
        alert("Tidak ada data untuk dicetak.");
        return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
        window.print();
        return;
    }

    const headHtml = headers
        .map((header) => `<th>${escapeHtml(header)}</th>`)
        .join("");
    const bodyHtml = rows
        .map(
            (row) =>
                `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`,
        )
        .join("");

    const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>${escapeHtml(title)}</title>
<style>
  @page { size: auto; margin: 15mm; }
  body { font-family: 'Inter', Arial, sans-serif; color: #0f172a; margin: 0; padding: 0; }
  .container { padding: 20px; }
  h1 { font-size: 20px; margin: 0 0 16px; border-bottom: 2px solid #334155; padding-bottom: 8px; }
  table { width: 100%; border-collapse: collapse; margin-top: 10px; }
  th, td { border: 1px solid #cbd5e1; padding: 10px; font-size: 12px; text-align: left; }
  th { background: #f8fafc; font-weight: bold; color: #334155; }
  tr:nth-child(even) { background: #fcfcfc; }
</style>
</head>
<body>
  <div class="container">
    <h1>${escapeHtml(title)}</h1>
    <table>
      <thead>
        <tr>${headHtml}</tr>
      </thead>
      <tbody>
        ${bodyHtml}
      </tbody>
    </table>
  </div>
  <script>
    window.onload = function () {
      setTimeout(() => {
        window.print();
        window.onafterprint = function () { window.close(); };
      }, 500);
    };
  </script>
</body>
</html>`;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
};
