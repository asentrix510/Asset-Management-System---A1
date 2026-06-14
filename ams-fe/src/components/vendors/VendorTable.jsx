export default function VendorTable({
  vendors,
  onDelete,
  onEdit,
}) {
  return (
    <div className="bg-white rounded-xl shadow">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3">
              Vendor Name
            </th>

            <th className="p-3">
              Contact Person
            </th>

            <th className="p-3">
              Email
            </th>

            <th className="p-3">
              Phone
            </th>

            <th className="p-3">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {vendors.map((vendor) => (
            <tr
              key={vendor.vendor_id}
              className="border-b"
            >
              <td className="p-3">
                {vendor.vendor_name}
              </td>

              <td className="p-3">
                {vendor.contact_person}
              </td>

              <td className="p-3">
                {vendor.email}
              </td>

              <td className="p-3">
                {vendor.phone}
              </td>

              <td className="p-3">
                <button
                  onClick={() =>
                    onEdit(vendor)
                  }
                  className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    onDelete(
                      vendor.vendor_id
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