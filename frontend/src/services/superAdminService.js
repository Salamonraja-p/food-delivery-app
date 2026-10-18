import axiosInstance from "../api/axios";
import { API_ENDPOINTS,} from "../api/endpoints";


export const getDashboardData =async () => {

    const response =
      await axiosInstance.get(

        API_ENDPOINTS
          .SUPER_ADMIN
          .DASHBOARD
      );

    return response.data;
  };

export const getAllUsers = async (page = 1, search = "") => {
  const res = await axiosInstance.get(
    API_ENDPOINTS.SUPER_ADMIN.USERS,
    {
      params: { page, limit: 8, search },
    }
  );
  return res.data;
};

export const getPendingCompanies = async (page = 1, search = "") => {

  const response = await axiosInstance.get(
    `${API_ENDPOINTS.SUPER_ADMIN.PENDING_COMPANIES}?page=${page}&limit=8&search=${search}`
  );

  return response.data;
};
export const getApprovedCompanies = async (page = 1, search = "") => {

  const response = await axiosInstance.get(
    `${API_ENDPOINTS.SUPER_ADMIN.APPROVED_COMPANIES}?page=${page}&limit=8&search=${search}`
  );

  return response.data;
};

export const getRejectedCompanies = async (page = 1, search = "") => {

  const response = await axiosInstance.get(
    `${API_ENDPOINTS.SUPER_ADMIN.REJECTED_COMPANIES}?page=${page}&limit=8&search=${search}`
  );

  return response.data;
};

export const approveCompany =async (id) => {

    const response =await axiosInstance.put(

        `${API_ENDPOINTS
          .SUPER_ADMIN
          .APPROVE_COMPANY}/${id}`
      );

    return response.data;
  };

export const rejectCompany =async (id) => {

    const response =await axiosInstance.put(

        `${API_ENDPOINTS
          .SUPER_ADMIN
          .REJECT_COMPANY}/${id}`
      );

    return response.data;
  };

export const getAuditLogs = async (page = 1, fromDate, toDate) => {

  let url = `${API_ENDPOINTS.SUPER_ADMIN.AUDIT_LOGS}?page=${page}`;

  if (fromDate) url += `&fromDate=${fromDate}`;
  if (toDate) url += `&toDate=${toDate}`;

  const res = await axiosInstance.get(url);

  return res.data;
};

export const getCompanyReport = async (
  page = 1,
  search = "",
  fromDate = "",
  toDate = ""
) => {

  let url = `${API_ENDPOINTS.SUPER_ADMIN.REPORT_COMPANY}?page=${page}&limit=6`;

  if (search) url += `&search=${search}`;
  if (fromDate) url += `&fromDate=${fromDate}`;
  if (toDate) url += `&toDate=${toDate}`;

  const res = await axiosInstance.get(url);

  return res.data;
};

export const getCompanyGraph = async (fromDate = "", toDate = "") => {

  let url = `${API_ENDPOINTS.SUPER_ADMIN.REPORT_COMPANY_GRAPH}`;

  if (fromDate) url += `?fromDate=${fromDate}`;
  if (toDate) url += `${fromDate ? "&" : "?"}toDate=${toDate}`;

  const res = await axiosInstance.get(url);

  return res.data;
};

export const getCompanyChart = async (fromDate = "", toDate = "") => {

  let url = `${API_ENDPOINTS.SUPER_ADMIN.REPORT_COMPANY_CHART}`;

  if (fromDate) url += `?fromDate=${fromDate}`;
  if (toDate) url += `${fromDate ? "&" : "?"}toDate=${toDate}`;

  const res = await axiosInstance.get(url);

  return res.data;
};
export const getSubscriptionsReport = async (
  page = 1,
  search = "",
  fromDate = "",
  toDate = ""
) => {

  let url = `${API_ENDPOINTS.SUPER_ADMIN.REPORT_SUBSCRIPTIONS}?page=${page}&limit=6`;

  if (search) url += `&search=${search}`;
  if (fromDate) url += `&fromDate=${fromDate}`;
  if (toDate) url += `&toDate=${toDate}`;

  const res = await axiosInstance.get(url);

  return res.data;
};