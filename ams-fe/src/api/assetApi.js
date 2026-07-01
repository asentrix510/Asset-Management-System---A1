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
  let payload = data;
  if (!(data instanceof FormData)) {
    payload = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined) {
        payload.append(key, data[key]);
      }
    });
  }

  const response = await api.post(
    "/assets",
    payload,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const updateAsset = async (
  id,
  data
) => {
  let payload = data;
  if (!(data instanceof FormData)) {
    payload = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined) {
        payload.append(key, data[key]);
      }
    });
  }

  const response = await api.put(
    `/assets/${id}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "multipart/form-data",
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