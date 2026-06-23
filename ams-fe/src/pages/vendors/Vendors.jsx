import { useEffect, useState } from "react";

import VendorForm from "../../components/vendors/VendorForm";
import VendorTable from "../../components/vendors/VendorTable";

import {
  getVendors,
  createVendor,
  updateVendor,
  deleteVendor,
} from "../../api/vendorApi";

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [editingVendor, setEditingVendor] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState("All");
  const [search, setSearch] = useState("");

  const fetchVendors = async () => {
    try {
      const data = await getVendors();
      setVendors(data.vendors);
    } catch (error) {
      console.error("Fetch vendors error:", error);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      if (editingVendor) {
        await updateVendor(editingVendor.vendor_id, formData);
        setEditingVendor(null);
      } else {
        await createVendor(formData);
      }
      fetchVendors();
    } catch (error) {
      console.error("Vendor save error:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;
    try {
      await deleteVendor(id);
      fetchVendors();
    } catch (error) {
      console.error("Delete vendor error:", error);
    }
  };

  const handleEdit = (vendor) => {
    setEditingVendor(vendor);
  };

  /* ── Filtering ── */
  const filteredVendors = vendors.filter((v) => {
    const matchesDropdown =
      selectedVendor === "All" || v.vendor_name === selectedVendor;

    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      v.vendor_name?.toLowerCase().includes(q) ||
      v.contact_person?.toLowerCase().includes(q) ||
      v.email?.toLowerCase().includes(q) ||
      v.phone?.toLowerCase().includes(q);

    return matchesDropdown && matchesSearch;
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">
          Vendor Management
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage vendors and suppliers
        </p>
      </div>

      <VendorForm
        onSubmit={handleSubmit}
        initialData={editingVendor}
        isEditing={!!editingVendor}
      />

      {/* ── Master Vendor Filter Bar ── */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 px-4 py-3 mb-4 flex flex-wrap items-center gap-3">
        {/* Master dropdown */}
        <div className="flex flex-col gap-1 min-w-[220px]">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Filter by Vendor
          </label>
          <select
            id="master-vendor-dropdown"
            value={selectedVendor}
            onChange={(e) => setSelectedVendor(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          >
            <option value="All">All Vendors</option>
            {vendors.map((v) => (
              <option key={v.vendor_id} value={v.vendor_name}>
                {v.vendor_name}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Search
          </label>
          <input
            type="text"
            placeholder="Search by name, contact, email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Result count */}
        <div className="mt-auto">
          <span className="text-xs text-slate-400">
            {filteredVendors.length} of {vendors.length} vendor
            {vendors.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Clear filters */}
        {(selectedVendor !== "All" || search) && (
          <div className="mt-auto">
            <button
              onClick={() => { setSelectedVendor("All"); setSearch(""); }}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      <VendorTable
        vendors={filteredVendors}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </div>
  );
}