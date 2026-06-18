const REPORT_TYPES = [
  { value: "assets", label: "Assets" },
  { value: "assignments", label: "Assignments" },
  { value: "maintenance", label: "Maintenance" },
  { value: "depreciation", label: "Depreciation" },
  { value: "vendors", label: "Vendors" },
  { value: "audit", label: "Audit Logs" },
];

export default function ReportFilters({ reportType, setReportType }) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {REPORT_TYPES.map((type) => (
        <button
          key={type.value}
          onClick={() => setReportType(type.value)}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
            reportType === type.value
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
              : "bg-white text-slate-500 border border-slate-200 hover:border-blue-300 hover:text-blue-600"
          }`}
        >
          {type.label}
        </button>
      ))}
    </div>
  );
}