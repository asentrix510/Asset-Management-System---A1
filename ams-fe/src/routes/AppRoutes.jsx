import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Users from "../pages/users/Users";
import Assets from "../pages/assets/Assets";
import Vendors from "../pages/vendors/Vendors";
import Maintenance from "../pages/maintenance/Maintenance";
import Reports from "../pages/reports/Reports";
import Settings from "../pages/settings/Settings";
import Assignments from "../pages/assignments/Assignments";
import AdminRoute from "./AdminRoute";
import DashboardLayout from "../components/layout/DashboardLayout";
import AssetDetailsPage from "../pages/assets/AssetDetailsPage";
import Audit from "../pages/audit/Audit";
import Notifications from "../pages/notifications/Notifications";
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <AdminRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </AdminRoute>
        }
      />

      <Route
        path="/users"
        element={
          <AdminRoute>
            <DashboardLayout>
              <Users />
            </DashboardLayout>
          </AdminRoute>
        }
      />

      <Route
        path="/assets"
        element={
          <AdminRoute>
            <DashboardLayout>
              <Assets />
            </DashboardLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/assignments"
        element={
          <AdminRoute>
            <DashboardLayout>
              <Assignments />
            </DashboardLayout>
          </AdminRoute>
        }
      />

      <Route
        path="/vendors"
        element={
          <AdminRoute>
            <DashboardLayout>
              <Vendors />
            </DashboardLayout>
          </AdminRoute>
        }
      />

      <Route
        path="/maintenance"
        element={
          <AdminRoute>
            <DashboardLayout>
              <Maintenance />
            </DashboardLayout>
          </AdminRoute>
        }
      />

      <Route
        path="/assets/:id"
        element={<AssetDetailsPage />}
      />
      <Route
        path="/audit"
        element={
          <AdminRoute>
            <DashboardLayout>
              <Audit />
            </DashboardLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <AdminRoute>
            <DashboardLayout>
              <Reports />
            </DashboardLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <AdminRoute>
            <Notifications />
          </AdminRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <AdminRoute>
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          </AdminRoute>
        }
      />
    </Routes>
  );
}