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

export const getVendors =
  async () => {
    const response =
      await api.get(
        "/vendors",
        config()
      );

    return response.data;
  };

export const createVendor =
  async (vendorData) => {
    const response =
      await api.post(
        "/vendors",
        vendorData,
        config()
      );

    return response.data;
  };

export const updateVendor =
  async (
    id,
    vendorData
  ) => {
    const response =
      await api.put(
        `/vendors/${id}`,
        vendorData,
        config()
      );

    return response.data;
  };

export const deleteVendor =
  async (id) => {
    const response =
      await api.delete(
        `/vendors/${id}`,
        config()
      );

    return response.data;
  };