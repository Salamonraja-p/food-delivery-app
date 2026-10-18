import axiosInstance from "../api/axios";

import { API_ENDPOINTS } from "../api/endpoints";

export const getCompanyDashboardData = async (

  filter = "today",

  startDate = "",

  endDate = ""

) => {

  let url =
    API_ENDPOINTS.COMPANY.DASHBOARD;

  const query = [];

  /* ================= FILTER ================= */

  if (filter) {

    query.push(
      `filter=${filter}`
    );

  }

  /* ================= START DATE ================= */

  if (startDate) {

    query.push(
      `startDate=${startDate}`
    );

  }

  /* ================= END DATE ================= */

  if (endDate) {

    query.push(
      `endDate=${endDate}`
    );

  }

  /* ================= QUERY ================= */

  if (query.length > 0) {

    url += `?${query.join("&")}`;

  }

  /* ================= API ================= */

  const res =
    await axiosInstance.get(url);

  return res.data;

};


export const getCompanyOrders = async (

  page = 1,

  type = "pending",

  historyFilter = "ALL",

  startDate = "",

  endDate = ""

) => {

  const params =
    new URLSearchParams({

      page,

      limit: 5,

      type,

      historyFilter,

    });

  /* ================= START DATE ================= */

  if (startDate) {

    params.append(

      "startDate",

      startDate

    );

  }

  /* ================= END DATE ================= */

  if (endDate) {

    params.append(

      "endDate",

      endDate

    );

  }

  /* ================= API ================= */

  const res =
    await axiosInstance.get(

      `${API_ENDPOINTS.ORDER.COMPANY_ORDERS}?${params}`

    );

  return res.data;

};

export const approveOrder = async (

  id

) => {

  const response =
    await axiosInstance.put(

      `${API_ENDPOINTS.ORDER.APPROVE}/${id}`

    );

  return response.data;

};

export const rejectOrder = async (

  id

) => {

  const response =
    await axiosInstance.put(

      `${API_ENDPOINTS.ORDER.REJECT}/${id}`

    );

    return response.data; };
    
export const updateOrderStatus = async (

  id,

  status

) => {

  const response =
    await axiosInstance.put(

      `${API_ENDPOINTS.ORDER.STATUS}/${id}`,

      { status }

    );

  return response.data;

};

export const getCompanyReportTable = async (

  page = 1,

  search = "",

  status = "ALL",

  fromDate = "",

  toDate = ""

) => {

  const params =
    new URLSearchParams({

      page,

      limit: 6,

      status,

    });

  /* ================= SEARCH ================= */

  if (search) {

    params.append(

      "search",

      search

    );

  }

  /* ================= FROM DATE ================= */

  if (fromDate) {

    params.append(

      "fromDate",

      fromDate

    );

  }

  /* ================= TO DATE ================= */

  if (toDate) {

    params.append(

      "toDate",

      toDate

    );

  }

  /* ================= API ================= */

  const res =
    await axiosInstance.get(

      `${API_ENDPOINTS.COMPANY.REPORT_TABLE}?${params}`

    );

  return res.data;

};


export const getCompanyReportGraph = async (

  fromDate = "",

  toDate = "",

  status = "ALL"

) => {

  const params =
    new URLSearchParams({

      status,

    });

  /* ================= FROM DATE ================= */

  if (fromDate) {

    params.append(

      "fromDate",

      fromDate

    );

  }

  /* ================= TO DATE ================= */

  if (toDate) {

    params.append(

      "toDate",

      toDate

    );

  }

  /* ================= API ================= */

  const res =
    await axiosInstance.get(

      `${API_ENDPOINTS.COMPANY.REPORT_GRAPH}?${params}`

    );

  return res.data;

};


export const getCompanyReportChart = async (

  fromDate = "",

  toDate = "",

  status = "ALL"

) => {

  const params =
    new URLSearchParams({

      status,

    });

  /* ================= FROM DATE ================= */

  if (fromDate) {

    params.append(

      "fromDate",

      fromDate

    );

  }

  /* ================= TO DATE ================= */

  if (toDate) {

    params.append(

      "toDate",

      toDate

    );

  }

  /* ================= API ================= */

  const res =
    await axiosInstance.get(

      `${API_ENDPOINTS.COMPANY.REPORT_CHART}?${params}`

    );

  return res.data;

};

export const getTopSellingFoods = async (

  fromDate = "",

  toDate = "",

  status = "ALL"

) => {

  const params =
    new URLSearchParams({

      status,

    });

  /* ================= FROM DATE ================= */

  if (fromDate) {

    params.append(

      "fromDate",

      fromDate

    );

  }

  /* ================= TO DATE ================= */

  if (toDate) {

    params.append(

      "toDate",

      toDate

    );

  }

  /* ================= API ================= */

  const res =
    await axiosInstance.get(

      `${API_ENDPOINTS.COMPANY.TOP_FOODS}?${params}`

    );

  return res.data;

};