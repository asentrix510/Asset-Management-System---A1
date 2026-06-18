import api from "./axios";

const getToken = () =>
  localStorage.getItem(
    "ams_token"
  );

export const getDashboardStats =
  async () => {
    const response =
      await api.get(
        "/dashboard/stats",
        {
          headers: {
            Authorization:
              `Bearer ${getToken()}`,
          },
        }
      );

    return response.data;
  };

export const getStatusChart =
  async () => {
    const response =
      await api.get(
        "/dashboard/status-chart",
        {
          headers: {
            Authorization:
              `Bearer ${getToken()}`,
          },
        }
      );

    return response.data;
  };

export const getCategoryChart =
  async () => {
    const response =
      await api.get(
        "/dashboard/category-chart",
        {
          headers: {
            Authorization:
              `Bearer ${getToken()}`,
          },
        }
      );

    return response.data;
  };

export const getRecentActivity =
  async () => {
    const response =
      await api.get(
        "/dashboard/recent-activity",
        {
          headers: {
            Authorization:
              `Bearer ${getToken()}`,
          },
        }
      );

    return response.data;
  };

export const getAuditLogs = async () => {
  const response = await api.get(
    "/dashboard/audit",
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
  return response.data;
};