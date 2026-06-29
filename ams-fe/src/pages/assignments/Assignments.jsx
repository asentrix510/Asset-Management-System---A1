import { useEffect, useState } from "react";
import AssignmentForm from "../../components/assignments/AssignmentForm";
import AssignmentTable from "../../components/assignments/AssignmentTable";
import { getAssignments, assignAsset, returnAsset } from "../../api/assignmentApi";
import { getAssets } from "../../api/assetApi";
import { getUsers } from "../../api/userApi";
import { UserPlus } from "lucide-react";

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [assets, setAssets] = useState([]);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem("ams_token");

  const fetchData = async () => {
    const assignmentData = await getAssignments();
    const assetData = await getAssets();
    const userData = await getUsers(token);

    setAssignments(assignmentData.assignments);
    setAssets(
      assetData.assets.filter(
        (asset) => asset.status === "Available"
      )
    );
    setUsers(userData.data.users);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async (data) => {
    await assignAsset(data);
    fetchData();
    setShowForm(false);
  };

  const handleReturn = async (id) => {
    await returnAsset(id);
    fetchData();
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Asset Assignments</h1>
          <p className="text-slate-500 text-sm mt-1">Allocate and track hardware inventory issued to employees</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-indigo-650 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-500/10 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Assign Asset
        </button>
      </div>

      {/* Form Section (collapsible) */}
      {showForm && (
        <div className="animate-in fade-in slide-in-from-top-3 duration-200">
          <AssignmentForm
            users={users}
            assets={assets}
            onSubmit={handleAssign}
          />
        </div>
      )}

      {/* Table Section */}
      <AssignmentTable
        assignments={assignments}
        onReturn={handleReturn}
      />
    </div>
  );
}