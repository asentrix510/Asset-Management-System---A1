import {
  useState,
  useEffect,
} from "react";
export default function AssetForm({
  onSubmit,
  initialData,
  isEditing,
}) {
  const [formData, setFormData] =
    useState(
      initialData || {
        asset_code: "",
        asset_name: "",
        category: "",
        status: "Available",
      }
    );
  useEffect(() => {
  if (initialData) {
    setFormData({
      asset_code:
        initialData.asset_code || "",
      asset_name:
        initialData.asset_name || "",
      category:
        initialData.category || "",
      status:
        initialData.status ||
        "Available",
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

  setFormData({
    asset_code: "",
    asset_name: "",
    category: "",
    status: "Available",
  });
};

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow mb-6"
    >
      <h2 className="text-xl font-bold mb-4">
        {isEditing
          ? "Edit Asset"
          : "Add Asset"}
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="text"
          name="asset_code"
          placeholder="Asset Code"
          value={formData.asset_code}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="asset_name"
          placeholder="Asset Name"
          value={formData.asset_name}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option>
            Available
          </option>

          <option>
            Assigned
          </option>

          <option>
            Maintenance
          </option>

          <option>
            Retired
          </option>
        </select>
      </div>

      <button
        type="submit"
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isEditing
          ? "Update Asset"
          : "Save Asset"}
      </button>
    </form>
  );
}