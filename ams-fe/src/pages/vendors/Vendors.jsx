import {
  useEffect,
  useState,
} from "react";

import VendorForm from "../../components/vendors/VendorForm";
import VendorTable from "../../components/vendors/VendorTable";

import {
  getVendors,
  createVendor,
  updateVendor,
  deleteVendor,
} from "../../api/vendorApi";

export default function Vendors() {
  const [vendors, setVendors] =
    useState([]);

  const [editingVendor, setEditingVendor] =
    useState(null);

  const fetchVendors =
    async () => {
      try {
        const data =
          await getVendors();

        setVendors(
          data.vendors
        );
      } catch (error) {
        console.error(
          "Fetch vendors error:",
          error
        );
      }
    };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleSubmit =
    async (formData) => {
      try {
        if (editingVendor) {
          await updateVendor(
            editingVendor.vendor_id,
            formData
          );

          setEditingVendor(
            null
          );
        } else {
          await createVendor(
            formData
          );
        }

        fetchVendors();
      } catch (error) {
        console.error(
          "Vendor save error:",
          error
        );
      }
    };

  const handleDelete =
    async (id) => {
      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete this vendor?"
        );

      if (!confirmDelete)
        return;

      try {
        await deleteVendor(
          id
        );

        fetchVendors();
      } catch (error) {
        console.error(
          "Delete vendor error:",
          error
        );
      }
    };

  const handleEdit =
    (vendor) => {
      setEditingVendor(
        vendor
      );
    };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">
          Vendor Management
        </h1>

        <p className="text-slate-500 text-sm mt-1">
          Manage vendors and suppliers
        </p>
      </div>

      <VendorForm
        onSubmit={
          handleSubmit
        }
        initialData={
          editingVendor
        }
        isEditing={
          !!editingVendor
        }
      />

      <VendorTable
        vendors={vendors}
        onDelete={
          handleDelete
        }
        onEdit={
          handleEdit
        }
      />
    </div>
  );
}