import { Edit2, Trash2, Laptop, Tv, Wifi, Printer, Smartphone, Package, Armchair } from "lucide-react";

// Resolves a category to a specific lucide icon
const getCategoryIcon = (category) => {
  const cat = category?.toLowerCase() || "";
  if (cat.includes("laptop")) return <Laptop className="w-4 h-4 text-blue-500" />;
  if (cat.includes("monitor")) return <Tv className="w-4 h-4 text-indigo-500" />;
  if (cat.includes("router")) return <Wifi className="w-4 h-4 text-cyan-500" />;
  if (cat.includes("printer")) return <Printer className="w-4 h-4 text-amber-500" />;
  if (cat.includes("mobile") || cat.includes("phone") || cat.includes("tab")) {
    return <Smartphone className="w-4 h-4 text-emerald-500" />;
  }
  if (cat.includes("furniture") || cat.includes("chair") || cat.includes("desk")) {
    return <Armchair className="w-4 h-4 text-rose-500" />;
  }
  return <Package className="w-4 h-4 text-slate-500" />;
};

const getStatusBadge = (status) => {
  let color = "bg-slate-50 text-slate-650 border-slate-100";
  let dotColor = "bg-slate-400";
  if (status === "Open") {
    color = "bg-yellow-50 text-yellow-700 border-yellow-100";
    dotColor = "bg-yellow-500 animate-pulse";
  } else if (status === "In Progress") {
    color = "bg-blue-50 text-blue-700 border-blue-100";
    dotColor = "bg-blue-500 animate-pulse";
  } else if (status === "Completed") {
    color = "bg-emerald-50 text-emerald-700 border-emerald-100";
    dotColor = "bg-emerald-500";
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
      {status}
    </span>
  );
};

function formatDate(d) {
  if (!d) return "—";
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export default function MaintenanceTable({ records, onEdit, onDelete }) {
  if (!records?.length) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center select-none">
        <p className="text-slate-400 text-sm font-semibold">No maintenance records registered.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100/80 shadow-sm overflow-hidden select-none">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-2xs font-extrabold text-slate-400 uppercase tracking-wider">
              <th className="px-6 py-4">Asset Details</th>
              <th className="px-6 py-4 w-1/3">Issue Description</th>
              <th className="px-6 py-4">Reported Date</th>
              <th className="px-6 py-4">Service Cost</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Remarks</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50 text-xs">
            {records.map((record) => (
              <tr
                key={record.maintenance_id}
                className="hover:bg-slate-50/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                      {getCategoryIcon(record.category || "")}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 truncate">{record.asset_name}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{record.asset_code}</p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-slate-600 font-medium leading-relaxed">
                  {record.issue_description}
                </td>

                <td className="px-6 py-4 text-slate-500 font-semibold">
                  {formatDate(record.maintenance_date)}
                </td>

                <td className="px-6 py-4 font-bold text-slate-700">
                  {record.cost ? `₹${Number(record.cost).toLocaleString("en-IN")}` : <span className="text-slate-350 font-normal">—</span>}
                </td>

                <td className="px-6 py-4">
                  {getStatusBadge(record.status)}
                </td>

                <td className="px-6 py-4 text-slate-505 font-medium italic max-w-[160px] truncate" title={record.remarks || ""}>
                  {record.remarks || <span className="text-slate-300 not-italic">—</span>}
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(record)}
                      className="p-1.5 bg-slate-50 text-slate-555 hover:text-indigo-650 hover:bg-indigo-50 rounded-lg border border-slate-100 hover:border-indigo-100 transition-colors cursor-pointer"
                      title="Edit Maintenance Log"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDelete(record.maintenance_id)}
                      className="p-1.5 bg-slate-50 text-slate-555 hover:text-rose-650 hover:bg-rose-50 rounded-lg border border-slate-100 hover:border-rose-100 transition-colors cursor-pointer"
                      title="Delete Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}