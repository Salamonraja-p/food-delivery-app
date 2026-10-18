import axiosInstance from "../api/axios";
import { API_ENDPOINTS } from "../api/endpoints";

export const placeOrder = async (
  addressId
) => {

  const res =
    await axiosInstance.post(
      API_ENDPOINTS.ORDER.PLACE,
      {
        addressId,
      }
    );

  return res.data;
};


export const getUserOrders = async (page = 1) => {
  const res = await axiosInstance.get(
    `${API_ENDPOINTS.ORDER.MY_ORDERS}?page=${page}&limit=6`
  );
  return res.data;
};


export const getCompanyOrders = async (

  page = 1,

  startDate = "",

  endDate = "",

  limit = 5

) => {

  /* ================= URL ================= */

  let url =
   `${API_ENDPOINTS.ORDER.COMPANY_ORDERS}?page=${page}&limit=${limit}`;

  /* ================= START DATE ================= */

  if (startDate) {

    url +=
     `&startDate=${startDate}`;

  }

  /* ================= END DATE ================= */

  if (endDate) {

    url +=
     `&endDate=${endDate}`;

  }

  /* ================= API ================= */

  const res =
   await axiosInstance.get(url);

  return res.data;

};

/* ================= APPROVE ================= */
export const approveOrder = async (id) => {
  const res = await axiosInstance.put(
    `${API_ENDPOINTS.ORDER.APPROVE}/${id}`
  );
  return res.data;
};

/* ================= REJECT ================= */
export const rejectOrder = async (id) => {
  const res = await axiosInstance.put(
    `${API_ENDPOINTS.ORDER.REJECT}/${id}`
  );
  return res.data;
};

/* ================= UPDATE STATUS ================= */
export const updateOrderStatus = async (id, status) => {
  const res = await axiosInstance.put(
    `${API_ENDPOINTS.ORDER.STATUS}/${id}`,
    { status }
  );
  return res.data;
};

/* ================= CANCEL ================= */
export const cancelOrder = async (orderId) => {
  const res = await axiosInstance.put(
    API_ENDPOINTS.ORDER.CANCEL,
    { orderId }
  );
  return res.data;
};

/* ================= DELETE ================= */
export const deleteOrder = async (orderId) => {
  const res = await axiosInstance.delete(
    `${API_ENDPOINTS.ORDER.DELETE}/${orderId}`
  );
  return res.data;
};