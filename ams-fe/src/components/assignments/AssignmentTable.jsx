export default function AssignmentTable({
  assignments,
  onReturn,
}) {
  return (
    <div className="bg-white rounded-xl shadow">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3">
              Asset
            </th>

            <th className="p-3">
              User
            </th>

            <th className="p-3">
              Assigned Date
            </th>

            <th className="p-3">
              Status
            </th>

            <th className="p-3">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {assignments.map(
            (assignment) => (
              <tr
                key={
                  assignment.assignment_id
                }
                className="border-b"
              >
                <td className="p-3">
                  {
                    assignment.asset_name
                  }
                </td>

                <td className="p-3">
                  {
                    assignment.user_name
                  }
                </td>

                <td className="p-3">
                  {
                    assignment.assigned_date
                  }
                </td>

                <td className="p-3">
                  {
                    assignment.status
                  }
                </td>

                <td className="p-3">
                  {assignment.status ===
                    "Assigned" && (
                    <button
                      onClick={() =>
                        onReturn(
                          assignment.assignment_id
                        )
                      }
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Return
                    </button>
                  )}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}