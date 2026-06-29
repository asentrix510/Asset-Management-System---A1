import { useEffect, useState } from "react";
import { getAuditLogs } from "../../api/dashboardApi";
import { History, Calendar, User, Folder, Clock, Hash, Tag } from "lucide-react";

export default function Audit() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const data = await getAuditLogs();
      setLogs(data.logs || []);
    } catch (error) {
      console.error("Failed to fetch audit logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getActionBadge = (action) => {
    const act = action?.toUpperCase() || "";
    let color = "bg-slate-50 text-slate-650 border-slate-150";
    if (act.includes("CREATE") || act.includes("ASSIGN") || act.includes("ADD")) {
      color = "bg-emerald-50 text-emerald-700 border-emerald-100";
    } else if (act.includes("UPDATE") || act.includes("EDIT")) {
      color = "bg-blue-50 text-blue-700 border-blue-100";
    } else if (act.includes("DELETE") || act.includes("REMOVE") || act.includes("RETURN")) {
      color = "bg-rose-50 text-rose-700 border-rose-100";
    }
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${color}`}>
        {action}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6 select-none">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Audit Trail</h1>
          <p className="text-slate-500 text-sm mt-1">System-wide immutable activity logs</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
          <p className="text-slate-400 text-sm font-semibold">Loading audit logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Audit Trail</h1>
          <p className="text-slate-500 text-sm mt-1">System-wide immutable activity logs</p>
        </div>

        <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm">
          <History className="w-3.5 h-3.5 text-indigo-500" />
          {logs.length} Logged Entries
        </span>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-100/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-2xs font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Triggered By</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Module</th>
                <th className="px-6 py-4">Record ID</th>
                <th className="px-6 py-4 w-1/3">Activity Description</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50 text-xs">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-slate-400 font-semibold">
                    No activity logs recorded.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log.audit_id}
                    className="hover:bg-slate-50/30 transition-colors"
                  >
                    {/* Timestamp */}
                    <td className="px-6 py-4 font-semibold text-slate-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {new Date(log.created_at).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </span>
                        <Clock className="w-3.5 h-3.5 text-slate-350 ml-1" />
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(log.created_at).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </span>
                      </div>
                    </td>

                    {/* Triggered By */}
                    <td className="px-6 py-4 font-semibold text-slate-700">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{log.user_name || "System Automated"}</span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4">
                      {getActionBadge(log.action)}
                    </td>

                    {/* Module */}
                    <td className="px-6 py-4 font-medium text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Folder className="w-3.5 h-3.5 text-slate-400" />
                        <span>{log.module_name}</span>
                      </div>
                    </td>

                    {/* Record ID */}
                    <td className="px-6 py-4 text-slate-400 font-mono text-[10px]">
                      <div className="flex items-center gap-1">
                        <Hash className="w-3 h-3 text-slate-300" />
                        <span>{log.record_id}</span>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="px-6 py-4 text-slate-650 font-medium leading-relaxed">
                      {log.description}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}