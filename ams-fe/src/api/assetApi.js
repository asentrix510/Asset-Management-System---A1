import api from "./axios";

const getToken = () =>
  localStorage.getItem("ams_token");

export const getAssets = async () => {
  const response = await api.get("/assets", {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};

export const getAssetById = async (id) => {
  const response = await api.get(
    `/assets/${id}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};

export const createAsset = async (data) => {
  const response = await api.post(
    "/assets",
    data,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};

export const updateAsset = async (
  id,
  data
) => {
  const response = await api.put(
    `/assets/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};

export const deleteAsset = async (
  id
) => {
  const response = await api.delete(
    `/assets/${id}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
  

  return response.data;
};