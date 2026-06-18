import axios from "./axios";

export const getNotifications = async () => {
  const response = await axios.get(
    "/notifications"
  );

  return response.data;
};

export const markAsRead = async (id) => {
  const response = await axios.put(
    `/notifications/${id}/read`
  );

  return response.data;
};

export const deleteNotification = async (id) => {
  const response = await axios.delete(
    `/notifications/${id}`
  );

  return response.data;
};