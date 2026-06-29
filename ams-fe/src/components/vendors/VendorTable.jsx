import { Edit2, Trash2 } from "lucide-react";

export default function VendorTable({ vendors, onDelete, onEdit }) {
  if (!vendors?.length) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center select-none">
        <p className="text-slate-400 text-sm font-semibold">No vendors registered.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100/80 shadow-sm overflow-hidden select-none">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-2xs font-extrabold text-slate-400 uppercase tracking-wider">
              <th className="px-6 py-4">Vendor Supplier</th>
              <th className="px-6 py-4">Contact Representative</th>
              <th className="px-6 py-4">Email Address</th>
              <th className="px-6 py-4">Phone Number</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50 text-xs">
            {vendors.map((vendor) => (
              <tr
                key={vendor.vendor_id}
                className="hover:bg-slate-50/30 transition-colors"
              >
                <td className="px-6 py-4 font-bold text-slate-800">
                  {vendor.vendor_name}
                </td>

                <td className="px-6 py-4 font-semibold text-slate-650">
                  {vendor.contact_person || "—"}
                </td>

                <td className="px-6 py-4 text-slate-500 font-semibold">
                  {vendor.email || "—"}
                </td>

                <td className="px-6 py-4 text-slate-500 font-semibold">
                  {vendor.phone || "—"}
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(vendor)}
                      className="p-1.5 bg-slate-50 text-slate-555 hover:text-indigo-650 hover:bg-indigo-50 rounded-lg border border-slate-100 hover:border-indigo-100 transition-colors cursor-pointer"
                      title="Edit Vendor"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDelete(vendor.vendor_id)}
                      className="p-1.5 bg-slate-50 text-slate-555 hover:text-rose-650 hover:bg-rose-50 rounded-lg border border-slate-100 hover:border-rose-100 transition-colors cursor-pointer"
                      title="Delete Vendor"
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