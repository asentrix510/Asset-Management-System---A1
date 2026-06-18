import { Link } from "react-router-dom";

export default function AssetTable({
  assets,
  onDelete,
  onEdit,
}) {
  return (
    <div className="bg-white rounded-xl shadow">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3">
              Code
            </th>

            <th className="p-3">
              Name
            </th>

            <th className="p-3">
              Category
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
          {assets.map((asset) => (
            <tr
              key={asset.asset_id}
              className="border-b"
            >
              <td className="p-3">
                {asset.asset_code}
              </td>

              <td className="p-3">
                {asset.asset_name}
              </td>

              <td className="p-3">
                {asset.category}
              </td>

              <td className="p-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium
                    ${
                      asset.status ===
                      "Available"
                        ? "bg-green-100 text-green-700"
                        : ""
                    }
                    ${
                      asset.status ===
                      "Assigned"
                        ? "bg-blue-100 text-blue-700"
                        : ""
                    }
                    ${
                      asset.status ===
                      "Maintenance"
                        ? "bg-yellow-100 text-yellow-700"
                        : ""
                    }
                    ${
                      asset.status ===
                      "Retired"
                        ? "bg-red-100 text-red-700"
                        : ""
                    }
                  `}
                >
                  {asset.status}
                </span>
              </td>

              <td className="p-3">
                <Link
                  to={`/assets/${asset.asset_id}`}
                  className="bg-blue-600 text-white px-3 py-1 rounded mr-2"
                >
                  View
                </Link>

                <button
                  onClick={() =>
                    onEdit(asset)
                  }
                  className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    onDelete(
                      asset.asset_id
                    )
                  }
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}