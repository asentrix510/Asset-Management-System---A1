import api from "./axios";

const getToken = () =>
  localStorage.getItem("ams_token");

export const getAssignments =
  async () => {
    const response =
      await api.get(
        "/assignments",
        {
          headers: {
            Authorization:
              `Bearer ${getToken()}`,
          },
        }
      );

    return response.data;
  };

export const assignAsset =
  async (data) => {
    const response =
      await api.post(
        "/assignments",
        data,
        {
          headers: {
            Authorization:
              `Bearer ${getToken()}`,
          },
        }
      );

    return response.data;
  };

export const returnAsset =
  async (id) => {
    const response =
      await api.put(
        `/assignments/${id}/return`,
        {},
        {
          headers: {
            Authorization:
              `Bearer ${getToken()}`,
          },
        }
      );

    return response.data;
  };