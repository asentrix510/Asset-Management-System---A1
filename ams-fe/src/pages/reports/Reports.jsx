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
  Available: "bg-emerald-100 text-emerald-700",
  Assigned: "bg-blue-100 text-blue-700",
  Maintenance: "bg-amber-100 text-amber-700",
  Retired: "bg-rose-100 text-rose-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Active: "bg-blue-100 text-blue-700",
  LOGIN: "bg-slate-100 text-slate-600",
  ASSET_CREATE: "bg-green-100 text-green-700",
  ASSET_UPDATE: "bg-blue-100 text-blue-700",
  ASSET_DELETE: "bg-red-100 text-red-700",
  USER_CREATE: "bg-green-100 text-green-700",
  USER_UPDATE: "bg-blue-100 text-blue-700",
  USER_DELETE: "bg-red-100 text-red-700",
  VENDOR_CREATE: "bg-green-100 text-green-700",
  VENDOR_UPDATE: "bg-blue-100 text-blue-700",
  VENDOR_DELETE: "bg-red-100 text-red-700",
  MAINTENANCE_CREATE: "bg-amber-100 text-amber-700",
  MAINTENANCE_UPDATE: "bg-blue-100 text-blue-700",
  MAINTENANCE_DELETE: "bg-red-100 text-red-700",
  ASSET_ASSIGNED: "bg-violet-100 text-violet-700",
  ASSET_RETURNED: "bg-slate-100 text-slate-700",
};

function formatCell(col, value) {
  if (value == null || value === "") return <span className="text-slate-300">—</span>;

  if (col === "status" || col === "action") {
    const color = STATUS_COLORS[value] || "bg-slate-100 text-slate-600";
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>
        {value}
      </span>
    );
  }

  if (col === "is_fully_depreciated") {
    const isYes = value === "Yes" || value === true;
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${isYes ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"}`}>
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
    return <span className="text-slate-500 text-xs">{new Date(value).toLocaleDateString()}</span>;
  }

  if (
    col === "purchase_cost" ||
    col === "cost" ||
    col === "current_value" ||
    col === "depreciation_amount"
  ) {
    return <span className="font-medium text-slate-800">₹{Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>;
  }

  return <span className="text-slate-700">{String(value)}</span>;
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
          val = val ? new Date(val).toLocaleDateString() : "";
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
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Reports</h1>
          <p className="text-slate-500 text-sm mt-1">
            View, filter, and export system data reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold border border-slate-200">
            Total: {data.length}
          </span>
          {(startDate || endDate) && (
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-200">
              Filtered: {filteredData.length}
            </span>
          )}
        </div>
      </div>

      {/* Report Switcher Tabs */}
      <ReportFilters reportType={reportType} setReportType={setReportType} />

      {/* Date Filter & Export Panel */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {reportType !== "vendors" ? (
            <>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Start Date
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
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  End Date
                </span>
                <input
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              {(startDate || endDate) && (
                <button
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                  }}
                  className="self-end px-3 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
            </>
          ) : (
            <span className="text-sm text-slate-400 italic">
              Date filtering is not applicable for vendor list.
            </span>
          )}
        </div>

        <button
          onClick={handleExportCSV}
          disabled={filteredData.length === 0}
          className="self-end md:self-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-md shadow-blue-500/25 cursor-pointer disabled:cursor-not-allowed"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400 text-sm">
            <svg
              className="animate-spin w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Loading report...
          </div>
        ) : error ? (
          <div className="py-16 text-center text-red-500 text-sm">{error}</div>
        ) : filteredData.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            No records found matching filters
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    #
                  </th>
                  {columns.map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide"
                    >
                      {LABELS[col] || col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-xs text-slate-400">{i + 1}</td>
                    {columns.map((col) => (
                      <td key={col} className="px-4 py-3 text-sm">
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