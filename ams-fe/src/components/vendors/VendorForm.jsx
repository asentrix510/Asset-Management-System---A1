import { useState, useEffect } from "react";
import { Truck, User, Mail, Phone, MapPin, Save, Plus } from "lucide-react";

const inputClass =
  "w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-950 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 shadow-sm";

export default function VendorForm({ onSubmit, initialData, isEditing, onCancel }) {
  const [formData, setFormData] = useState({
    vendor_name: "",
    contact_person: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        vendor_name: initialData.vendor_name || "",
        contact_person: initialData.contact_person || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        address: initialData.address || "",
      });
    } else {
      setFormData({
        vendor_name: "",
        contact_person: "",
        email: "",
        phone: "",
        address: "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
    if (!isEditing) {
      setFormData({
        vendor_name: "",
        contact_person: "",
        email: "",
        phone: "",
        address: "",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-6 select-none"
    >
      <h2 className="text-base font-bold text-slate-800 tracking-tight mb-5">
        {isEditing ? "Edit Vendor Details" : "Register Vendor Supplier"}
      </h2>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-slate-400" />
            Vendor Supplier Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="vendor_name"
            placeholder="e.g. Dell Technologies"
            value={formData.vendor_name}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            Contact Representative Name
          </label>
          <input
            type="text"
            name="contact_person"
            placeholder="e.g. John Smith"
            value={formData.contact_person}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            Email Address
          </label>
          <input
            type="email"
            name="email"
            placeholder="e.g. sales@dell.com"
            value={formData.email}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            Phone Number
          </label>
          <input
            type="text"
            name="phone"
            placeholder="e.g. +91 9876543210"
            value={formData.phone}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            Office Address
          </label>
          <textarea
            name="address"
            placeholder="Corporate address details..."
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 shadow-sm resize-none"
            rows="3"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition-all text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-indigo-500/10 cursor-pointer"
        >
          {isEditing ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isEditing ? "Save Vendor Changes" : "Register Vendor"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs font-bold text-slate-500 hover:text-slate-700 px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-all cursor-pointer border border-transparent hover:border-slate-150"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}