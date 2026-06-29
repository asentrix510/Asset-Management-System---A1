import { useEffect, useState } from "react";
import ReportFilters from "../../components/reports/ReportFilters";
import {
  getAssetReport,
  getAssignmentReport,
  getMaintenanceReport,
  getVendorReport,
  getAuditReport,
  getDepreciationReport,
} from "../../api/reportApi";
import { Download, Calendar, Filter, FileSpreadsheet, Loader2, Sparkles } from "lucide-react";

const COLUMNS = {
  assets: ["asset_code", "asset_name", "category", "brand", "status", "purchase_cost", "warranty_expiry"],
  assignments: ["asset_name", "asset_code", "user_name", "assigned_date", "return_date", "status"],
  maintenance: ["asset_name", "asset_code", "issue_description", "maintenance_date", "cost", "status"],
  depreciation: [
    "asset_code",
    "asset_name",
    "category",
    "purchase_cost",
    "current_value",
    "depreciation_amount",
    "depreciation_percent",
    "years_elapsed",
    "useful_life_years",
    "is_fully_depreciated"
  ],
  vendors: ["vendor_name", "contact_person", "email", "phone", "address"],
  audit: ["created_at", "user_name", "action", "module_name", "record_id", "description"],
};

const LABELS = {
  asset_code: "Code",
  asset_name: "Asset",
  category: "Category",
  brand: "Brand",
  status: "Status",
  purchase_cost: "Original Cost",
  warranty_expiry: "Warranty",
  user_name: "User",
  assigned_date: "Assigned",
  return_date: "Returned",
  issue_description: "Issue",
  maintenance_date: "Date",
  cost: "Cost",
  vendor_name: "Vendor",
  contact_person: "Contact",
  email: "Email",
  phone: "Phone",
  address: "Address",
  created_at: "Timestamp",
  action: "Action",
  module_name: "Module",
  record_id: "Record ID",
  description: "Description",
  current_value: "Current Value",
  depreciation_amount: "Depr. Amount",
  depreciation_percent: "Depr. %",
  years_elapsed: "Age (Yrs)",
  useful_life_years: "Life (Yrs)",
  is_fully_depreciated: "Fully Depr.?",
};

const STATUS_COLORS = {
  Available: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Assigned: "bg-indigo-50 text-indigo-700 border-indigo-100",
  Maintenance: "bg-yellow-50 text-yellow-755 border-yellow-100",
  Retired: "bg-rose-50 text-rose-700 border-rose-100",
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Pending: "bg-yellow-50 text-yellow-700 border-yellow-100",
  Active: "bg-blue-50 text-blue-700 border-blue-100",
  LOGIN: "bg-slate-50 text-slate-600 border-slate-100",
  ASSET_CREATE: "bg-emerald-50 text-emerald-700 border-emerald-100",
  ASSET_UPDATE: "bg-indigo-50 text-indigo-700 border-indigo-100",
  ASSET_DELETE: "bg-rose-50 text-rose-700 border-rose-100",
  USER_CREATE: "bg-emerald-50 text-emerald-700 border-emerald-100",
  USER_UPDATE: "bg-indigo-50 text-indigo-700 border-indigo-100",
  USER_DELETE: "bg-rose-50 text-rose-700 border-rose-100",
  VENDOR_CREATE: "bg-emerald-50 text-emerald-700 border-emerald-100",
  VENDOR_UPDATE: "bg-indigo-50 text-indigo-700 border-indigo-100",
  VENDOR_DELETE: "bg-rose-50 text-rose-700 border-rose-100",
  MAINTENANCE_CREATE: "bg-yellow-50 text-yellow-700 border-yellow-100",
  MAINTENANCE_UPDATE: "bg-indigo-50 text-indigo-700 border-indigo-100",
  MAINTENANCE_DELETE: "bg-rose-50 text-rose-700 border-rose-100",
  ASSET_ASSIGNED: "bg-violet-50 text-violet-755 border-violet-100",
  ASSET_RETURNED: "bg-slate-50 text-slate-700 border-slate-100",
};

function formatDate(d) {
  if (!d) return "";
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

function formatCell(col, value) {
  if (value == null || value === "") return <span className="text-slate-300">—</span>;

  if (col === "status" || col === "action") {
    const color = STATUS_COLORS[value] || "bg-slate-50 text-slate-600 border-slate-100";
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-2xs font-bold border ${color}`}>
        {value}
      </span>
    );
  }

  if (col === "is_fully_depreciated") {
    const isYes = value === "Yes" || value === true;
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-2xs font-bold ${isYes ? "bg-rose-50 text-rose-700 border border-rose-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100"}`}>
        {isYes ? "Yes" : "No"}
      </span>
    );
  }

  if (
    col === "created_at" ||
    col === "assigned_date" ||
    col === "return_date" ||
    col === "maintenance_date" ||
    col === "warranty_expiry"
  ) {
    return <span className="text-slate-500 font-semibold text-xs">{formatDate(value)}</span>;
  }

  if (
    col === "purchase_cost" ||
    col === "cost" ||
    col === "current_value" ||
    col === "depreciation_amount"
  ) {
    return <span className="font-bold text-slate-800">₹{Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>;
  }

  return <span className="text-slate-700 font-medium">{String(value)}</span>;
}

export default function Reports() {
  const [reportType, setReportType] = useState("assets");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchReport = async () => {
    setLoading(true);
    setError("");
    try {
      let response;
      switch (reportType) {
        case "assets":
          response = await getAssetReport();
          setData(response.assets || []);
          break;
        case "assignments":
          response = await getAssignmentReport();
          setData(response.assignments || []);
          break;
        case "maintenance":
          response = await getMaintenanceReport();
          setData(response.maintenance || []);
          break;
        case "vendors":
          response = await getVendorReport();
          setData(response.vendors || []);
          break;
        case "audit":
          response = await getAuditReport();
          setData(response.logs || []);
          break;
        case "depreciation":
          response = await getDepreciationReport();
          const flatDepreciation = (response.report || []).map((item) => ({
            ...item,
            purchase_cost: item.depreciation.purchase_cost,
            current_value: item.depreciation.current_value,
            depreciation_amount: item.depreciation.depreciation_amount,
            depreciation_percent: item.depreciation.depreciation_percent + "%",
            years_elapsed: item.depreciation.years_elapsed,
            useful_life_years: item.depreciation.useful_life_years,
            is_fully_depreciated: item.depreciation.is_fully_depreciated ? "Yes" : "No",
          }));
          setData(flatDepreciation);
          break;
        default:
          setData([]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load report data.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setStartDate("");
    setEndDate("");
    fetchReport();
  }, [reportType]);

  const columns = COLUMNS[reportType] || [];

  // Filter logic on the client side
  const filteredData = data.filter((row) => {
    let rowDate = null;
    if (reportType === "assets" || reportType === "depreciation") {
      rowDate = row.purchase_date;
    } else if (reportType === "assignments") {
      rowDate = row.assigned_date;
    } else if (reportType === "maintenance") {
      rowDate = row.maintenance_date;
    } else if (reportType === "audit") {
      rowDate = row.created_at;
    }

    // If report type is vendors or row has no date
    if (!rowDate) {
      if (startDate || endDate) return false;
      return true;
    }

    const dateVal = new Date(rowDate);
    dateVal.setHours(0, 0, 0, 0);

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      if (dateVal < start) return false;
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(0, 0, 0, 0);
      if (dateVal > end) return false;
    }

    return true;
  });

  const handleExportCSV = () => {
    if (filteredData.length === 0) return;

    // Header row
    const headers = columns.map((col) => LABELS[col] || col);

    // Data rows
    const csvRows = filteredData.map((row) => {
      return columns.map((col) => {
        let val = row[col];

        // Format values for CSV output
        if (
          col === "created_at" ||
          col === "assigned_date" ||
          col === "return_date" ||
          col === "maintenance_date" ||
          col === "warranty_expiry"
        ) {
          val = val ? formatDate(val) : "";
        }

        // Escape double quotes and wrap in quotes
        const valStr = val == null ? "" : String(val).replace(/"/g, '""');
        return `"${valStr}"`;
      });
    });

    const csvContent = [
      headers.map((h) => `"${h}"`).join(","),
      ...csvRows.map((r) => r.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${reportType}_report_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Reports</h1>
          <p className="text-slate-500 text-sm mt-1">
            View, filter, and export system data reports
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="bg-slate-50 border border-slate-200/80 text-slate-500 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm">
            Total: {data.length}
          </span>
          {(startDate || endDate) && (
            <span className="bg-indigo-50 border border-indigo-150 text-indigo-700 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm animate-pulse">
              Filtered: {filteredData.length}
            </span>
          )}
        </div>
      </div>

      {/* Report Switcher Tabs */}
      <ReportFilters reportType={reportType} setReportType={setReportType} />

      {/* Date Filter & Export Panel */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          {reportType !== "vendors" ? (
            <>
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Start Date
                </span>
                <input
                  type="date"
                  value={startDate}
                  max={endDate || undefined}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    // clear end date if it's now before the new start
                    if (endDate && e.target.value > endDate) setEndDate("");
                  }}
                  className="px-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-550 transition-all shadow-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-550" /> End Date
                </span>
                <input
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-550 transition-all shadow-sm"
                />
              </div>
              {(startDate || endDate) && (
                <button
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                  }}
                  className="self-end px-3 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-100 hover:border-rose-200 transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
            </>
          ) : (
            <span className="text-xs font-semibold text-slate-400 italic flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              Date filtering is not applicable for vendor list.
            </span>
          )}
        </div>

        <button
          onClick={handleExportCSV}
          disabled={filteredData.length === 0}
          className="self-start md:self-auto px-5 py-2.5 bg-indigo-650 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-indigo-500/10 cursor-pointer disabled:cursor-not-allowed"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100/80 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400 text-sm font-semibold">
            <Loader2 className="animate-spin w-5 h-5 mr-2 text-indigo-500" />
            Loading report...
          </div>
        ) : error ? (
          <div className="py-16 text-center text-red-500 text-sm font-bold">{error}</div>
        ) : filteredData.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm font-semibold">
            No records found matching filters
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-2xs font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">#</th>
                  {columns.map((col) => (
                    <th
                      key={col}
                      className="px-6 py-4"
                    >
                      {LABELS[col] || col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs">
                {filteredData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-slate-400 font-mono">{i + 1}</td>
                    {columns.map((col) => (
                      <td key={col} className="px-6 py-4">
                        {formatCell(col, row[col])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}