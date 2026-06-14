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