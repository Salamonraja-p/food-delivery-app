import axiosInstance from "../api/axios";
import { API_ENDPOINTS }from "../api/endpoints";

export const registerUser =async (data) => {

    const response =await axiosInstance.post(
        API_ENDPOINTS.AUTH.REGISTER,
        data
      );

    return response.data;
  };

export const loginUser =async (data) => {

    const response =await axiosInstance.post(
        API_ENDPOINTS.AUTH.LOGIN,
        data
      );

    return response.data;
  };

export const forgotPassword = async (email) => {

  const response = await axiosInstance.post(
    API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
    { email }
  );

  return response.data;
};

export const resetPassword = async (data) => {

  const response = await axiosInstance.post(
    API_ENDPOINTS.AUTH.RESET_PASSWORD,
    data
  );

  return response.data;
};

 