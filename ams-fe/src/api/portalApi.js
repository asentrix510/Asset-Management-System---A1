import api from "./axios";

export const getMyProfile = () =>
  api.get("/portal/me");

export const updateMyProfile = (data) =>
  api.put("/portal/me", data);

export const getMyAssets = () =>
  api.get("/portal/my-assets");

export const getMyMaintenance = () =>
  api.get("/portal/my-maintenance");
