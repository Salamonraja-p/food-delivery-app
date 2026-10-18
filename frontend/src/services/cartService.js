import axiosInstance
from "../api/axios";

import { API_ENDPOINTS }
from "../api/endpoints";

export const addToCart =async (data) => {

    const response =
      await axiosInstance.post(
        API_ENDPOINTS.CART.ADD,
        data
      );

    return response.data;
  };

export const getCart =async () => {

    const response =
      await axiosInstance.get(
        API_ENDPOINTS.CART.GET
      );

    return response.data;
  };

export const removeCart =async (id) => {

    const response =
      await axiosInstance.delete(
        `${API_ENDPOINTS.CART.REMOVE}/${id}`
      );

    return response.data;
  };