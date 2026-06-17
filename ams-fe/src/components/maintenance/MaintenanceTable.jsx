export default function MaintenanceTable({
  records,
  onEdit,
  onDelete,
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
              Issue
            </th>

            <th className="p-3">
              Date
            </th>

            <th className="p-3">
              Cost
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
          {records.map(
            (record) => (
              <tr
                key={
                  record.maintenance_id
                }
                className="border-b"
              >
                <td className="p-3">
                  {
                    record.asset_name
                  }
                </td>

                <td className="p-3">
                  {
                    record.issue_description
                  }
                </td>

                <td className="p-3">
                  {
                    record.maintenance_date?.split(
                      "T"
                    )[0]
                  }
                </td>

                <td className="p-3">
                  ₹
                  {record.cost}
                </td>

                <td className="p-3">
                  {record.status}
                </td>

                <td className="p-3">
                  <button
                    onClick={() =>
                      onEdit(
                        record
                      )
                    }
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      onDelete(
                        record.maintenance_id
                      )
                    }
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}