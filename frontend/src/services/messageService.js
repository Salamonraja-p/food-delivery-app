import axiosInstance from "../api/axios";
import { API_ENDPOINTS } from "../api/endpoints";

/* ================= SEND ================= */
export const sendMessage = async (data) => {
  const res = await axiosInstance.post(
    API_ENDPOINTS.MESSAGE.SEND,
    data
  );
  return res.data;
};

/* ================= GET ================= */
export const getMessages = async (ticketId) => {
  const res = await axiosInstance.get(
    `${API_ENDPOINTS.MESSAGE.GET}/${ticketId}`
  );
  console.log("MESSAGE.GET =", API_ENDPOINTS.MESSAGE.GET);

  return Array.isArray(res.data) ? res.data : [];
};

/* ================= UNREAD ================= */
export const getUnreadCount = async (ticketId) => {
  const res = await axiosInstance.get(
    `${API_ENDPOINTS.MESSAGE.UNREAD}/${ticketId}`
  );
  return res.data;
};

/* ================= MARK READ ================= */
export const markAsRead = async (ticketId) => {
  const res = await axiosInstance.put(
    `${API_ENDPOINTS.MESSAGE.READ}/${ticketId}`
  );
  return res.data;
};