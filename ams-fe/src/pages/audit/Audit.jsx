import { useEffect, useState } from "react";
import { getAuditLogs } from "../../api/dashboardApi";

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

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">
          Audit Trail
        </h1>

        <div className="bg-white rounded-xl shadow p-6">
          Loading audit logs...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Audit Trail
        </h1>

        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
          {logs.length} Records
        </span>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-3 text-left">
                Date
              </th>

              <th className="p-3 text-left">
                User
              </th>

              <th className="p-3 text-left">
                Action
              </th>

              <th className="p-3 text-left">
                Module
              </th>

              <th className="p-3 text-left">
                Record ID
              </th>

              <th className="p-3 text-left">
                Description
              </th>
            </tr>
          </thead>

          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center p-6"
                >
                  No audit logs found
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr
                  key={log.audit_id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-3">
                    {new Date(
                      log.created_at
                    ).toLocaleString()}
                  </td>

                  <td className="p-3">
                    {log.user_name || "System"}
                  </td>

                  <td className="p-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                      {log.action}
                    </span>
                  </td>

                  <td className="p-3">
                    {log.module_name}
                  </td>

                  <td className="p-3">
                    {log.record_id}
                  </td>

                  <td className="p-3">
                    {log.description}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}