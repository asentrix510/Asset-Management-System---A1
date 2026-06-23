import api from "./axios";

export const getUsers = (token) =>
  api.get("/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const createUser = (
  token,
  userData
) =>
  api.post("/users", userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const deleteUser = (
  token,
  id
) =>
  api.delete(`/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const updateUser = (
  token,
  id,
  userData
) =>
  api.put(`/users/${id}`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });