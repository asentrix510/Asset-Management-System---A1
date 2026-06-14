import { useState } from "react";

export default function AssignmentForm({
  users,
  assets,
  onSubmit,
}) {
  const [formData, setFormData] =
    useState({
      asset_id: "",
      user_id: "",
      assigned_date:
        new Date()
          .toISOString()
          .split("T")[0],
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit(formData);

    setFormData({
      asset_id: "",
      user_id: "",
      assigned_date:
        new Date()
          .toISOString()
          .split("T")[0],
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow mb-6"
    >
      <h2 className="text-xl font-bold mb-4">
        Assign Asset
      </h2>

      <div className="grid md:grid-cols-3 gap-4">
        <select
          name="asset_id"
          value={formData.asset_id}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">
            Select Asset
          </option>

          {assets.map((asset) => (
            <option
              key={asset.asset_id}
              value={asset.asset_id}
            >
              {asset.asset_name}
              {" - "}
              {asset.asset_code}
            </option>
          ))}
        </select>

        <select
          name="user_id"
          value={formData.user_id}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">
            Select User
          </option>

          {users.map((user) => (
            <option
              key={user.user_id}
              value={user.user_id}
            >
              {user.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="assigned_date"
          value={
            formData.assigned_date
          }
          onChange={handleChange}
          className="border p-2 rounded"
        />
      </div>

      <button
        type="submit"
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Assign Asset
      </button>
    </form>
  );
}