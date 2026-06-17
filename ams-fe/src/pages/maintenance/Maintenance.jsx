import {
  useEffect,
  useState,
} from "react";

import MaintenanceForm from "../../components/maintenance/MaintenanceForm";
import MaintenanceTable from "../../components/maintenance/MaintenanceTable";

import {
  getMaintenanceRecords,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
} from "../../api/maintenanceApi";

import {
  getAssets,
} from "../../api/assetApi";

export default function Maintenance() {
  const [records, setRecords] =
    useState([]);

  const [assets, setAssets] =
    useState([]);

  const [editingRecord, setEditingRecord] =
    useState(null);

  const fetchData =
    async () => {
      try {
        const maintenanceData =
          await getMaintenanceRecords();

        const assetData =
          await getAssets();

        setRecords(
          maintenanceData.records
        );

        setAssets(
          assetData.assets
        );
      } catch (error) {
        console.error(
          "Maintenance fetch error:",
          error
        );
      }
    };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit =
    async (formData) => {
      try {
        if (editingRecord) {
          await updateMaintenance(
            editingRecord.maintenance_id,
            formData
          );

          setEditingRecord(
            null
          );
        } else {
          await createMaintenance(
            formData
          );
        }

        fetchData();
      } catch (error) {
        console.error(
          "Maintenance save error:",
          error
        );
      }
    };

  const handleDelete =
    async (id) => {
      const confirmDelete =
        window.confirm(
          "Delete this maintenance record?"
        );

      if (!confirmDelete)
        return;

      try {
        await deleteMaintenance(
          id
        );

        fetchData();
      } catch (error) {
        console.error(
          "Delete maintenance error:",
          error
        );
      }
    };

  const handleEdit =
    (record) => {
      setEditingRecord(
        record
      );
    };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">
          Maintenance Management
        </h1>

        <p className="text-slate-500 text-sm mt-1">
          Track asset repairs and servicing
        </p>
      </div>

      <MaintenanceForm
        onSubmit={
          handleSubmit
        }
        assets={assets}
        initialData={
          editingRecord
        }
        isEditing={
          !!editingRecord
        }
      />

      <MaintenanceTable
        records={records}
        onEdit={
          handleEdit
        }
        onDelete={
          handleDelete
        }
      />
    </div>
  );
}