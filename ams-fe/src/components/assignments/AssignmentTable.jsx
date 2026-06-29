import { RotateCcw, Calendar, HardDrive, User } from "lucide-react";

function formatDate(d) {
  if (!d) return "—";
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

const getStatusBadge = (status) => {
  let color = "bg-slate-50 text-slate-650 border-slate-100";
  let dotColor = "bg-slate-400";
  if (status === "Assigned") {
    color = "bg-indigo-50 text-indigo-700 border-indigo-100";
    dotColor = "bg-indigo-500 animate-pulse";
  } else if (status === "Returned") {
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

export default function AssignmentTable({ assignments, onReturn }) {
  if (!assignments?.length) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center select-none">
        <p className="text-slate-400 text-sm font-semibold">No assignments recorded.</p>
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
              <th className="px-6 py-4">Assigned Employee</th>
              <th className="px-6 py-4">Assigned Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50 text-xs">
            {assignments.map((assignment) => (
              <tr
                key={assignment.assignment_id}
                className="hover:bg-slate-50/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                      <HardDrive className="w-4 h-4 text-indigo-550" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 truncate">{assignment.asset_name}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{assignment.asset_code || "—"}</p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 uppercase shrink-0">
                      {assignment.user_name?.charAt(0) || "?"}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-700 truncate">{assignment.user_name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{assignment.user_email || ""}</p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-slate-500 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDate(assignment.assigned_date)}</span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  {getStatusBadge(assignment.status)}
                </td>

                <td className="px-6 py-4 text-right">
                  {assignment.status === "Assigned" && (
                    <button
                      onClick={() => onReturn(assignment.assignment_id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100 rounded-lg border border-emerald-100 hover:border-emerald-200 transition-all font-bold text-2xs cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Return Asset
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}