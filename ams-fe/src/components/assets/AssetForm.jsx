import { useState, useEffect, useCallback } from "react";
import { getVendors } from "../../api/vendorApi";
import { Save, Info, ShoppingCart, RefreshCw, Lock, Unlock } from "lucide-react";

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Derive a short 3-letter prefix from a category string */
function getCategoryPrefix(category) {
  if (!category) return "AST";
  const lower = category.toLowerCase().trim();
  const map = {
    laptop: "LAP",
    monitor: "MON",
    desktop: "DKT",
    printer: "PRT",
    router: "RTR",
    switch: "SWT",
    server: "SRV",
    tablet: "TAB",
    mobile: "MOB",
    phone: "PHN",
    keyboard: "KBD",
    mouse: "MOU",
    camera: "CAM",
    projector: "PRJ",
    scanner: "SCN",
    ups: "UPS",
    furniture: "FRN",
    chair: "CHR",
    desk: "DSK",
  };
  for (const [key, prefix] of Object.entries(map)) {
    if (lower.includes(key)) return prefix;
  }
  // Fall back to first 3 uppercase letters of the category
  return category.replace(/[^a-zA-Z]/g, "").slice(0, 3).toUpperCase() || "AST";
}

/** Generate next asset code: PREFIXNNN (e.g. LAP001, ROU002) */
function generateAssetCode(category, existingAssets) {
  const prefix = getCategoryPrefix(category);

  // Find highest sequence for this prefix across all existing codes
  const regex = new RegExp(`^${prefix}(\\d+)$`, "i");
  const existing = (existingAssets || [])
    .map((a) => a.asset_code || "")
    .map((code) => { const m = code.match(regex); return m ? parseInt(m[1], 10) : NaN; })
    .filter((n) => !isNaN(n));

  const nextSeq = existing.length > 0 ? Math.max(...existing) + 1 : 1;
  return `${prefix}${String(nextSeq).padStart(3, "0")}`;
}

/** Get sorted unique non-empty values for a field across all assets */
function uniqueValues(assets, field) {
  return [...new Set((assets || []).map((a) => a[field]).filter(Boolean))].sort();
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const inputClass =
  "w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 shadow-sm";

const selectClass =
  "w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 shadow-sm cursor-pointer appearance-none";

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

// ─── Component ───────────────────────────────────────────────────────────────

export default function AssetForm({ onSubmit, initialData, isEditing, existingAssets = [] }) {
  const [vendors, setVendors] = useState([]);
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [codeManuallyEdited, setCodeManuallyEdited] = useState(false);
  const [codeLocked, setCodeLocked] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  // Load vendors once
  useEffect(() => {
    getVendors()
      .then((data) => setVendors(data.vendors || []))
      .catch(() => setVendors([]));
  }, []);

  // Derive datalist options from existing assets
  const categories = uniqueValues(existingAssets, "category");
  const brands = uniqueValues(existingAssets, "brand");
  const models = uniqueValues(existingAssets, "model");

  // Auto-generate code whenever category changes (only in create mode, unless user manually edited)
  const autoGenerateCode = useCallback(
    (category) => {
      if (!isEditing && !codeManuallyEdited) {
        const code = generateAssetCode(category, existingAssets);
        setFormData((prev) => ({ ...prev, asset_code: code }));
      }
    },
    [isEditing, codeManuallyEdited, existingAssets]
  );

  // Populate form when editing
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
        purchase_date: initialData.purchase_date ? initialData.purchase_date.slice(0, 10) : "",
        purchase_cost: initialData.purchase_cost ?? "",
        vendor_name: initialData.vendor_name || "",
        warranty_expiry: initialData.warranty_expiry ? initialData.warranty_expiry.slice(0, 10) : "",
        description: initialData.description || "",
      });
      setCodeManuallyEdited(false);
      setCodeLocked(true);
    } else {
      const code = generateAssetCode("", existingAssets);
      setFormData({ ...INITIAL_STATE, asset_code: code });
      setCodeManuallyEdited(false);
      setCodeLocked(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "purchase_cost" && value !== "" && Number(value) < 0) return;

    if (name === "asset_code") {
      setCodeManuallyEdited(true);
    }

    if (name === "category" && !isEditing && !codeManuallyEdited) {
      const newCode = generateAssetCode(value, existingAssets);
      setFormData((prev) => ({ ...prev, category: value, asset_code: newCode }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const blockInvalidCostKeys = (e) => {
    if (["e", "E", "-", "+"].includes(e.key)) e.preventDefault();
  };

  const handleRegenerate = () => {
    const newCode = generateAssetCode(formData.category, existingAssets);
    setFormData((prev) => ({ ...prev, asset_code: newCode }));
    setCodeManuallyEdited(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
    if (!isEditing) {
      const code = generateAssetCode("", existingAssets);
      setFormData({ ...INITIAL_STATE, asset_code: code });
      setCodeManuallyEdited(false);
      setCodeLocked(true);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-6 select-none"
    >
      <h2 className="text-base font-bold text-slate-800 tracking-tight mb-5">
        {isEditing ? "Edit Hardware Details" : "Register New Asset"}
      </h2>

      {/* ── Section 1: Specifications ── */}
      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
        <Info className="w-3.5 h-3.5 text-indigo-500" />
        Specifications &amp; Basic Info
      </h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

        {/* ── Asset Code (auto-generated) ── */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
            Asset Code <span className="text-rose-500">*</span>
            <span className="ml-auto flex items-center gap-1">
              <button
                type="button"
                title={codeLocked ? "Unlock to edit manually" : "Lock code"}
                onClick={() => setCodeLocked((l) => !l)}
                className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
              >
                {codeLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              </button>
              {!isEditing && (
                <button
                  type="button"
                  title="Regenerate code"
                  onClick={handleRegenerate}
                  className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
              )}
            </span>
          </label>
          <div className="relative">
            <input
              type="text"
              name="asset_code"
              placeholder="e.g. LAP001"
              value={formData.asset_code}
              onChange={handleChange}
              readOnly={codeLocked}
              required
              className={`${inputClass} font-mono ${
                codeLocked
                  ? "bg-slate-50 text-slate-500 cursor-not-allowed"
                  : "bg-white text-indigo-700 ring-2 ring-indigo-200"
              }`}
            />
          </div>
          <p className="text-[10px] text-slate-400">
            {codeLocked ? "Auto-generated (e.g. LAP001) · unlock to edit" : "Manual override — type a custom code"}
          </p>
        </div>

        {/* ── Asset Name ── */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500">
            Asset Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="asset_name"
            placeholder="e.g. MacBook Pro M3"
            value={formData.asset_name}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>

        {/* ── Category (datalist combobox) ── */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500">
            Category <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="category"
            list="category-list"
            placeholder="e.g. Laptop"
            value={formData.category}
            onChange={handleChange}
            required
            autoComplete="off"
            className={inputClass}
          />
          <datalist id="category-list">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          {categories.length > 0 && (
            <p className="text-[10px] text-indigo-500">↑ Pick existing or type new category</p>
          )}
        </div>

        {/* ── Brand (datalist combobox) ── */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500">Brand</label>
          <input
            type="text"
            name="brand"
            list="brand-list"
            placeholder="e.g. Apple"
            value={formData.brand}
            onChange={handleChange}
            autoComplete="off"
            className={inputClass}
          />
          <datalist id="brand-list">
            {brands.map((b) => (
              <option key={b} value={b} />
            ))}
          </datalist>
          {brands.length > 0 && (
            <p className="text-[10px] text-indigo-500">↑ Pick existing or type new brand</p>
          )}
        </div>

        {/* ── Model (datalist combobox) ── */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500">Model</label>
          <input
            type="text"
            name="model"
            list="model-list"
            placeholder="e.g. MBP 14 inch"
            value={formData.model}
            onChange={handleChange}
            autoComplete="off"
            className={inputClass}
          />
          <datalist id="model-list">
            {models.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
          {models.length > 0 && (
            <p className="text-[10px] text-indigo-500">↑ Pick existing or type new model</p>
          )}
        </div>

        {/* ── Serial Number ── */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500">Serial Number</label>
          <input
            type="text"
            name="serial_number"
            placeholder="e.g. SN-MBP-123"
            value={formData.serial_number}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        {/* ── Status (select) ── */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500">Status</label>
          <div className="relative">
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
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 2: Acquisition ── */}
      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
        <ShoppingCart className="w-3.5 h-3.5 text-indigo-500" />
        Acquisition &amp; Vendor Info
      </h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

        {/* ── Purchase Date ── */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500">Purchase Date</label>
          <input
            type="date"
            name="purchase_date"
            value={formData.purchase_date}
            max={today}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        {/* ── Purchase Cost ── */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500">Purchase Cost (₹)</label>
          <input
            type="number"
            name="purchase_cost"
            placeholder="e.g. 120000"
            min="0"
            step="0.01"
            value={formData.purchase_cost}
            onChange={handleChange}
            onKeyDown={blockInvalidCostKeys}
            className={inputClass}
          />
        </div>

        {/* ── Vendor Supplier (dropdown from registered vendors) ── */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500">Vendor Supplier</label>
          <div className="relative">
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
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* ── Warranty Expiry ── */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500">Warranty Expiry</label>
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
          <label className="text-xs font-semibold text-slate-500">Description Notes</label>
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