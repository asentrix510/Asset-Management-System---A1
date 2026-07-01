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
    <div className="flex flex-wrap gap-2 mb-6 select-none">
      {REPORT_TYPES.map((type) => {
        const isActive = reportType === type.value;
        return (
          <button
            key={type.value}
            onClick={() => setReportType(type.value)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              isActive
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/15"
                : "bg-slate-100 text-slate-500 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
            }`}
          >
            {type.label}
          </button>
        );
      })}
    </div>
  );
}