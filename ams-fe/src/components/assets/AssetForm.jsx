import { useState, useEffect } from "react";
import { getVendors } from "../../api/vendorApi";
import { Save, Info, ShoppingCart } from "lucide-react";

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

const inputClass =
  "w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-950 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 shadow-sm";

const selectClass =
  "w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 shadow-sm cursor-pointer";

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
      className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-6 select-none"
    >
      <h2 className="text-base font-bold text-slate-800 tracking-tight mb-5">
        {isEditing ? "Edit Hardware Details" : "Register New Asset"}
      </h2>

      {/* ── Section 1: Basic Info ── */}
      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
        <Info className="w-3.5 h-3.5 text-indigo-500" />
        Specifications &amp; Basic Info
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500">
            Asset Code <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="asset_code"
            placeholder="e.g. LAP003"
            value={formData.asset_code}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500">
            Asset Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="asset_name"
            placeholder="e.g. MacBook Pro M2"
            value={formData.asset_name}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500">
            Category <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="category"
            placeholder="e.g. Laptop"
            value={formData.category}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500">Brand</label>
          <input
            type="text"
            name="brand"
            placeholder="e.g. Apple"
            value={formData.brand}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500">Model</label>
          <input
            type="text"
            name="model"
            placeholder="e.g. MBP 14 inch"
            value={formData.model}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500">
            Serial Number
          </label>
          <input
            type="text"
            name="serial_number"
            placeholder="e.g. SN-MBP-123"
            value={formData.serial_number}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={selectClass}
          >
            <option value="Available">Available</option>
            <option value="Assigned">Assigned</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Retired">Retired</option>
          </select>
        </div>
      </div>

      {/* ── Section 2: Purchase Details ── */}
      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
        <ShoppingCart className="w-3.5 h-3.5 text-indigo-500" />
        Acquisition &amp; Vendor Info
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500">
            Purchase Date
          </label>
          <input
            type="date"
            name="purchase_date"
            value={formData.purchase_date}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500">
            Purchase Cost (₹)
          </label>
          <input
            type="number"
            name="purchase_cost"
            placeholder="e.g. 120000"
            min="0"
            step="0.01"
            value={formData.purchase_cost}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500">
            Vendor Supplier
          </label>
          <select
            name="vendor_name"
            value={formData.vendor_name}
            onChange={handleChange}
            className={selectClass}
          >
            <option value="">— Select Vendor —</option>
            {vendors.map((v) => (
              <option key={v.vendor_id} value={v.vendor_name}>
                {v.vendor_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500">
            Warranty Expiry
          </label>
          <input
            type="date"
            name="warranty_expiry"
            value={formData.warranty_expiry}
            min={formData.purchase_date || undefined}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      {/* ── Section 3: Notes ── */}
      <div className="mb-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500">
            Description Notes
          </label>
          <textarea
            name="description"
            placeholder="Optional hardware descriptors, notes, or assignment info..."
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 shadow-sm resize-none"
          />
        </div>
      </div>

      <button
        type="submit"
        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition-all text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-indigo-500/10 cursor-pointer"
      >
        <Save className="w-4 h-4" />
        {isEditing ? "Update Hardware Record" : "Register Hardware"}
      </button>
    </form>
  );
}