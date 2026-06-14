import {
  useState,
  useEffect,
} from "react";

export default function VendorForm({
  onSubmit,
  initialData,
  isEditing,
}) {
  const [formData, setFormData] =
    useState(
      initialData || {
        vendor_name: "",
        contact_person: "",
        email: "",
        phone: "",
        address: "",
      }
    );

  useEffect(() => {
    if (initialData) {
      setFormData({
        vendor_name:
          initialData.vendor_name || "",
        contact_person:
          initialData.contact_person || "",
        email:
          initialData.email || "",
        phone:
          initialData.phone || "",
        address:
          initialData.address || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
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
      className="bg-white p-6 rounded-xl shadow mb-6"
    >
      <h2 className="text-xl font-bold mb-4">
        {isEditing
          ? "Edit Vendor"
          : "Add Vendor"}
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="text"
          name="vendor_name"
          placeholder="Vendor Name"
          value={formData.vendor_name}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          type="text"
          name="contact_person"
          placeholder="Contact Person"
          value={formData.contact_person}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <textarea
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="border p-2 rounded md:col-span-2"
          rows="3"
        />
      </div>

      <button
        type="submit"
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isEditing
          ? "Update Vendor"
          : "Save Vendor"}
      </button>
    </form>
  );
}