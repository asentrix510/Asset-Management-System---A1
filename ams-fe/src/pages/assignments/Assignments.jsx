import {
  useEffect,
  useState,
} from "react";

import AssignmentForm from "../../components/assignments/AssignmentForm";
import AssignmentTable from "../../components/assignments/AssignmentTable";

import {
  getAssignments,
  assignAsset,
  returnAsset,
} from "../../api/assignmentApi";

import {
  getAssets,
} from "../../api/assetApi";

import {
  getUsers,
} from "../../api/userApi";

export default function Assignments() {
  const [assignments,
    setAssignments] =
    useState([]);

  const [assets,
    setAssets] =
    useState([]);

  const [users,
    setUsers] =
    useState([]);

  const token =
    localStorage.getItem(
      "ams_token"
    );

  const fetchData =
    async () => {
      const assignmentData =
        await getAssignments();

      const assetData =
        await getAssets();

      const userData =
        await getUsers(token);

      setAssignments(
        assignmentData.assignments
      );

      setAssets(
        assetData.assets.filter(
          (asset) =>
            asset.status ===
            "Available"
        )
      );

      setUsers(
        userData.data.users
      );
    };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign =
    async (data) => {
      await assignAsset(data);

      fetchData();
    };

  const handleReturn =
    async (id) => {
      await returnAsset(id);

      fetchData();
    };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Asset Assignments
      </h1>

      <AssignmentForm
        users={users}
        assets={assets}
        onSubmit={
          handleAssign
        }
      />

      <AssignmentTable
        assignments={
          assignments
        }
        onReturn={
          handleReturn
        }
      />
    </div>
  );
}