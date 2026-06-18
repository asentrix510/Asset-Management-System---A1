import axios from "./axios";

export const getAssetReport = async () => {
  const response = await axios.get("/reports/assets");
  return response.data;
};

export const getAssignmentReport = async () => {
  const response = await axios.get("/reports/assignments");
  return response.data;
};

export const getMaintenanceReport = async () => {
  const response = await axios.get("/reports/maintenance");
  return response.data;
};

export const getVendorReport = async () => {
  const response = await axios.get("/reports/vendors");
  return response.data;
};

export const getAuditReport = async () => {
  const response = await axios.get("/reports/audit");
  return response.data;
};

export const getDepreciationReport = async () => {
  const response = await axios.get("/assets/depreciation");
  return response.data;
};