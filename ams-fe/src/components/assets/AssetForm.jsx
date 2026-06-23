import { useState, useEffect } from "react";
import { getVendors } from "../../api/vendorApi";

const INITIAL_STATE = {
  asset_code: "",
  asset_name: "",
  category: "",
  brand: "",
  model: "",
  serial_number: "",
  status: "Available",
  purchase_date: "",
  purchase_cost: "",
  vendor_name: "",
  warranty_expiry: "",
  description: "",
};

export default function AssetForm({ onSubmit, initialData, isEditing }) {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    getVendors()
      .then((data) => setVendors(data.vendors || []))
      .catch(() => setVendors([]));
  }, []);

  const [formData, setFormData] = useState(INITIAL_STATE);

  useEffect(() => {
    if (initialData) {
      setFormData({
        asset_code: initialData.asset_code || "",
        asset_name: initialData.asset_name || "",
        category: initialData.category || "",
        brand: initialData.brand || "",
        model: initialData.model || "",
        serial_number: initialData.serial_number || "",
        status: initialData.status || "Available",
        purchase_date: initialData.purchase_date
          ? initialData.purchase_date.slice(0, 10)
          : "",
        purchase_cost: initialData.purchase_cost ?? "",
        vendor_name: initialData.vendor_name || "",
        warranty_expiry: initialData.warranty_expiry
          ? initialData.warranty_expiry.slice(0, 10)
          : "",
        description: initialData.description || "",
      });
    } else {
      setFormData(INITIAL_STATE);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
    setFormData(INITIAL_STATE);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow mb-6"
    >
      <h2 className="text-xl font-bold mb-5 text-slate-800">
        {isEditing ? "Edit Asset" : "Add Asset"}
      </h2>

      {/* ── Section 1: Basic Info ── */}
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
        Basic Information
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-600">
            Asset Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="asset_code"
            placeholder="e.g. AST-001"
            value={formData.asset_code}
            onChange={handleChange}
            required
            className="border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-600">
            Asset Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="asset_name"
            placeholder="e.g. Dell Laptop"
            value={formData.asset_name}
            onChange={handleChange}
            required
            className="border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-600">
            Category <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="category"
            placeholder="e.g. Electronics"
            value={formData.category}
            onChange={handleChange}
            required
            className="border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-600">Brand</label>
          <input
            type="text"
            name="brand"
            placeholder="e.g. Dell"
            value={formData.brand}
            onChange={handleChange}
            className="border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-600">Model</label>
          <input
            type="text"
            name="model"
            placeholder="e.g. Inspiron 15"
            value={formData.model}
            onChange={handleChange}
            className="border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-600">
            Serial Number
          </label>
          <input
            type="text"
            name="serial_number"
            placeholder="e.g. SN-1234567"
            value={formData.serial_number}
            onChange={handleChange}
            className="border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-600">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          >
            <option value="Available">Available</option>
            <option value="Assigned">Assigned</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Retired">Retired</option>
          </select>
        </div>
      </div>

      {/* ── Section 2: Purchase & Vendor Info ── */}
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
        Purchase &amp; Vendor Details
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-600">
            Purchase Date
          </label>
          <input
            type="date"
            name="purchase_date"
            value={formData.purchase_date}
            onChange={handleChange}
            className="border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-600">
            Purchase Cost (₹)
          </label>
          <input
            type="number"
            name="purchase_cost"
            placeholder="e.g. 75000"
            min="0"
            step="0.01"
            value={formData.purchase_cost}
            onChange={handleChange}
            className="border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-600">
            Vendor
          </label>
          <select
            name="vendor_name"
            value={formData.vendor_name}
            onChange={handleChange}
            className="border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          >
            <option value="">— Select Vendor —</option>
            {vendors.map((v) => (
              <option key={v.vendor_id} value={v.vendor_name}>
                {v.vendor_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-600">
            Warranty Expiry
          </label>
          <input
            type="date"
            name="warranty_expiry"
            value={formData.warranty_expiry}
            min={formData.purchase_date || undefined}
            onChange={handleChange}
            className="border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* ── Section 3: Description ── */}
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
        Additional Details
      </p>
      <div className="mb-6">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-600">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Optional notes about this asset…"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-6 py-2.5 rounded-lg font-semibold text-sm"
      >
        {isEditing ? "Update Asset" : "Save Asset"}
      </button>
    </form>
  );
}