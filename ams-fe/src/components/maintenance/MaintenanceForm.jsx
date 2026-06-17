import {
  useEffect,
  useState,
} from "react";

export default function MaintenanceForm({
  onSubmit,
  assets,
  initialData,
  isEditing,
}) {
  const [formData, setFormData] =
    useState({
      asset_id: "",
      issue_description: "",
      maintenance_date: "",
      cost: "",
      status: "Open",
      remarks: "",
    });

  useEffect(() => {
    if (initialData) {
      setFormData({
        asset_id:
          initialData.asset_id || "",
        issue_description:
          initialData.issue_description || "",
        maintenance_date:
          initialData.maintenance_date?.split(
            "T"
          )[0] || "",
        cost:
          initialData.cost || "",
        status:
          initialData.status || "Open",
        remarks:
          initialData.remarks || "",
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

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      await onSubmit(
        formData
      );

      if (!isEditing) {
        setFormData({
          asset_id: "",
          issue_description: "",
          maintenance_date: "",
          cost: "",
          status: "Open",
          remarks: "",
        });
      }
    };

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="bg-white p-6 rounded-xl shadow mb-6"
    >
      <h2 className="text-xl font-bold mb-4">
        {isEditing
          ? "Edit Maintenance"
          : "Add Maintenance"}
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <select
          name="asset_id"
          value={
            formData.asset_id
          }
          onChange={
            handleChange
          }
          className="border p-2 rounded"
          required
        >
          <option value="">
            Select Asset
          </option>

          {assets.map(
            (asset) => (
              <option
                key={
                  asset.asset_id
                }
                value={
                  asset.asset_id
                }
              >
                {
                  asset.asset_name
                }
              </option>
            )
          )}
        </select>

        <input
          type="date"
          name="maintenance_date"
          value={
            formData.maintenance_date
          }
          onChange={
            handleChange
          }
          className="border p-2 rounded"
          required
        />

        <input
          type="text"
          name="issue_description"
          placeholder="Issue Description"
          value={
            formData.issue_description
          }
          onChange={
            handleChange
          }
          className="border p-2 rounded"
          required
        />

        <input
          type="number"
          name="cost"
          placeholder="Cost"
          value={
            formData.cost
          }
          onChange={
            handleChange
          }
          className="border p-2 rounded"
        />

        <select
          name="status"
          value={
            formData.status
          }
          onChange={
            handleChange
          }
          className="border p-2 rounded"
        >
          <option>
            Open
          </option>

          <option>
            In Progress
          </option>

          <option>
            Completed
          </option>
        </select>

        <textarea
          name="remarks"
          placeholder="Remarks"
          value={
            formData.remarks
          }
          onChange={
            handleChange
          }
          className="border p-2 rounded"
          rows="3"
        />
      </div>

      <button
        type="submit"
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isEditing
          ? "Update Maintenance"
          : "Save Maintenance"}
      </button>
    </form>
  );
}