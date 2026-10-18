import axiosInstance from "../api/axios";
import { API_ENDPOINTS } from "../api/endpoints";

export const addFood =async (data) => {

    const response =
      await axiosInstance.post(
        API_ENDPOINTS.FOOD.ADD,
        data
      );

    return response.data;
  };

export const getMyFoods = async (
  page = 1,
  search = "",
  stockFilter = ""
) => {

  let url =
   `${API_ENDPOINTS.FOOD.MY_FOODS}?page=${page}`;

  /* ================= SEARCH ================= */

  if (search) {

    url +=
     `&search=${encodeURIComponent(search)}`;

  }

  /* ================= LOW STOCK ================= */

  if (stockFilter === "low") {

    url += `&lowStock=true`;

  }

  const response =
   await axiosInstance.get(url);

  return response.data;
};

export const updateFood =async (id, data) => {
    const response = await axiosInstance.put(
        `${API_ENDPOINTS.FOOD.UPDATE}/${id}`,
        data
      );

    return response.data;
  };

export const deleteFood =async (id) => {
    const response =await axiosInstance.delete(
        `${API_ENDPOINTS.FOOD.DELETE}/${id}`
      );

    return response.data;
  };

export const getAllFoods = async (
  page = 1,
  search = "",
  minPrice = "",
  maxPrice = ""
) => {
  let url = `${API_ENDPOINTS.FOOD.ALL}?page=${page}&limit=8`;

  if (search)          url += `&search=${encodeURIComponent(search)}`;
  if (minPrice !== "") url += `&minPrice=${minPrice}`;
  if (maxPrice !== "") url += `&maxPrice=${maxPrice}`;

  const res = await axiosInstance.get(url);
  return res.data;
};


export const getAllCompanies = async (
  page = 1,
  search = ""
) => {

  const res =
    await axiosInstance.get(

      `${API_ENDPOINTS.FOOD.COMPANIES}?page=${page}&search=${encodeURIComponent(search)}`

    );

  return res.data;

};

/* ================= COMPANY FOODS ================= */

export const getCompanyFoods = async (
  companyId,
  page = 1,
  search = ""
) => {

  const res =
    await axiosInstance.get(

      `${API_ENDPOINTS.FOOD.COMPANY_FOODS}/${companyId}?page=${page}&search=${encodeURIComponent(search)}`

    );

  return res.data;

};

/* ================= OFFER FOODS ================= */

export const getOfferFoods = async (
  page = 1,
  search = ""
) => {

  const res =
    await axiosInstance.get(

      `${API_ENDPOINTS.FOOD.OFFERS}?page=${page}&search=${encodeURIComponent(search)}`

    );

  return res.data;

};