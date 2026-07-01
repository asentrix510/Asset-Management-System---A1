import { useEffect, useState } from "react";
import { Save, Wrench } from "lucide-react";

const inputClass =
  "w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 shadow-sm";

const selectClass =
  "w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 shadow-sm cursor-pointer";

export default function MaintenanceForm({
  onSubmit,
  assets,
  initialData,
  isEditing,
}) {
  const today = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    asset_id: "",
    issue_description: "",
    maintenance_date: "",
    handover_date: "",
    return_date: "",
    cost: "",
    status: "Open",
    remarks: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        asset_id: initialData.asset_id || "",
        issue_description: initialData.issue_description || "",
        maintenance_date: initialData.maintenance_date?.split("T")[0] || "",
        handover_date: initialData.handover_date?.split("T")[0] || "",
        return_date: initialData.return_date?.split("T")[0] || "",
        cost: initialData.cost || "",
        status: initialData.status || "Open",
        remarks: initialData.remarks || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "cost" && value !== "" && Number(value) < 0) return;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const blockInvalidCostKeys = (e) => {
    if (["e", "E", "-", "+"].includes(e.key)) e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);

    if (!isEditing) {
      setFormData({
        asset_id: "",
        issue_description: "",
        maintenance_date: "",
        handover_date: "",
        return_date: "",
        cost: "",
        status: "Open",
        remarks: "",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-6 select-none"
    >
      <h2 className="text-base font-bold text-slate-800 tracking-tight mb-5 flex items-center gap-2">
        <Wrench className="w-5 h-5 text-indigo-500" />
        {isEditing ? "Edit Maintenance Details" : "Schedule New Maintenance"}
      </h2>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500">
            Target Asset <span className="text-rose-500">*</span>
          </label>
          <select
            name="asset_id"
            value={formData.asset_id}
            onChange={handleChange}
            className={selectClass}
            required
          >
            <option value="">— Select Asset —</option>
            {assets.map((asset) => (
              <option key={asset.asset_id} value={asset.asset_id}>
                {asset.asset_name} ({asset.asset_code})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500">
            Maintenance Date <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            name="maintenance_date"
            value={formData.maintenance_date}
            max={today}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500">
            Handover Date
          </label>
          <input
            type="date"
            name="handover_date"
            value={formData.handover_date}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500">
            Return Date
          </label>
          <input
            type="date"
            name="return_date"
            value={formData.return_date}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500">
            Issue Description <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="issue_description"
            placeholder="e.g. Screen flickering, keyboard replacement..."
            value={formData.issue_description}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500">
            Maintenance Cost (₹)
          </label>
          <input
            type="number"
            name="cost"
            placeholder="e.g. 2500"
            min="0"
            step="0.01"
            value={formData.cost}
            onChange={handleChange}
            onKeyDown={blockInvalidCostKeys}
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
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-xs font-semibold text-slate-500">Remarks</label>
          <textarea
            name="remarks"
            placeholder="Describe action taken, part replacement notes, or pending items..."
            value={formData.remarks}
            onChange={handleChange}
            className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 shadow-sm resize-none"
            rows="3"
          />
        </div>
      </div>

      <button
        type="submit"
        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition-all text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-indigo-500/10 cursor-pointer"
      >
        <Save className="w-4 h-4" />
        {isEditing ? "Update Maintenance Log" : "Log Maintenance"}
      </button>
    </form>
  );
}