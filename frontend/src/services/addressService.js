import axiosInstance from "../api/axios";
import { API_ENDPOINTS } from "../api/endpoints";

/* ================= ADD ADDRESS ================= */

export const addAddress = async (
  data
) => {

  const res =
    await axiosInstance.post(

      API_ENDPOINTS.ADDRESS.ADD,

      data

    );

  return res.data;

};

/* ================= GET MY ADDRESSES ================= */

export const getMyAddresses =
async () => {

  const res =
    await axiosInstance.get(

      API_ENDPOINTS.ADDRESS.MY

    );

  return res.data;

};

/* ================= UPDATE ADDRESS ================= */

export const updateAddress =
async (
  id,
  data
) => {

  const res =
    await axiosInstance.put(

      `${API_ENDPOINTS.ADDRESS.UPDATE}/${id}`,

      data

    );

  return res.data;

};

/* ================= DELETE ADDRESS ================= */

export const deleteAddress =
async (id) => {

  const res =
    await axiosInstance.delete(

      `${API_ENDPOINTS.ADDRESS.DELETE}/${id}`

    );

  return res.data;

};

/* ================= SET DEFAULT ================= */

export const setDefaultAddress =
async (id) => {

  const res =
    await axiosInstance.put(

      `${API_ENDPOINTS.ADDRESS.DEFAULT}/${id}`

    );

  return res.data;

};