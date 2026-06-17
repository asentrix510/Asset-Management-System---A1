import api from "./axios";

const getToken = () =>
  localStorage.getItem(
    "ams_token"
  );

const config = () => ({
  headers: {
    Authorization:
      `Bearer ${getToken()}`,
  },
});

export const getMaintenanceRecords =
  async () => {
    const response =
      await api.get(
        "/maintenance",
        config()
      );

    return response.data;
  };

export const createMaintenance =
  async (data) => {
    const response =
      await api.post(
        "/maintenance",
        data,
        config()
      );

    return response.data;
  };

export const updateMaintenance =
  async (id, data) => {
    const response =
      await api.put(
        `/maintenance/${id}`,
        data,
        config()
      );

    return response.data;
  };

export const deleteMaintenance =
  async (id) => {
    const response =
      await api.delete(
        `/maintenance/${id}`,
        config()
      );

    return response.data;
  };