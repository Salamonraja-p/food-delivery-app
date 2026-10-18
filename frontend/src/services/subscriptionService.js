import axiosInstance from "../api/axios";
import { API_ENDPOINTS } from "../api/endpoints";



export const getPlans = async () => {
  const res = await axiosInstance.get(
    API_ENDPOINTS.SUBSCRIPTION.PLANS
  );
  return res.data;
};

export const createPlan = async (data) => {
  const res = await axiosInstance.post(
    API_ENDPOINTS.SUBSCRIPTION.PLAN, 
    data
  );
  return res.data;
};

export const updatePlan = async (id, data) => {
  const res = await axiosInstance.put(
    `${API_ENDPOINTS.SUBSCRIPTION.PLAN}/${id}`,
    data
  );
  return res.data;
};

export const deletePlan = async (id) => {
  const res = await axiosInstance.delete(
    `${API_ENDPOINTS.SUBSCRIPTION.PLAN}/${id}`
  );
  return res.data;
};



export const getMySubscription = async () => {
  const res = await axiosInstance.get(
    API_ENDPOINTS.SUBSCRIPTION.MY
  );
  return res.data;
};

export const getAllSubscriptions = async (
  page = 1,
  limit = 6,
  search = ""
) => {

  let url = `${API_ENDPOINTS.SUBSCRIPTION.ALL}?page=${page}&limit=${limit}`;

  if (search) {
    url += `&search=${search}`;
  }

  const res = await axiosInstance.get(url);

  return res.data;
};

export const upgradePlan = async (planId) => {
  const res = await axiosInstance.post(
    API_ENDPOINTS.SUBSCRIPTION.UPGRADE,
    { planId }
  );
  return res.data;
};