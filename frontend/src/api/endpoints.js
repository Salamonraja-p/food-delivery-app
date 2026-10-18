const BASE_URL = import.meta.env.VITE_API_URL;

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `${BASE_URL}/auth/register`,
    LOGIN: `${BASE_URL}/auth/login`,
    FORGOT_PASSWORD: `${BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${BASE_URL}/auth/reset-password`,
  },

  FOOD: {
    ALL: `${BASE_URL}/food/all`,
    ADD: `${BASE_URL}/food/add`,
    MY_FOODS: `${BASE_URL}/food/my-foods`,
    UPDATE: `${BASE_URL}/food/update`,
    DELETE: `${BASE_URL}/food/delete`,
    COMPANIES: `${BASE_URL}/food/companies`,
    COMPANIES: `${BASE_URL}/food/companies`,
    COMPANY_FOODS: `${BASE_URL}/food/company`,
    OFFERS: `${BASE_URL}/food/offers`,
  },

  CART: {
    ADD: `${BASE_URL}/cart/add`,
    GET: `${BASE_URL}/cart`,
    REMOVE: `${BASE_URL}/cart/remove`,
  },

  ORDER: {
  PLACE: `${BASE_URL}/order/place`,
  MY_ORDERS: `${BASE_URL}/order/my-orders`,
  COMPANY_ORDERS: `${BASE_URL}/company/orders`,
  APPROVE: `${BASE_URL}/order/approve`,
  REJECT: `${BASE_URL}/order/reject`,
  STATUS: `${BASE_URL}/order/status`,
  CANCEL: `${BASE_URL}/order/cancel`,
  DELETE: `${BASE_URL}/order/delete`,
},

  SUPER_ADMIN: {
    DASHBOARD: `${BASE_URL}/super-admin/dashboard`,
    USERS: `${BASE_URL}/super-admin/users`,
    PENDING_COMPANIES: `${BASE_URL}/super-admin/companies/pending`,
    APPROVED_COMPANIES: `${BASE_URL}/super-admin/companies/approved`,
    REJECTED_COMPANIES: `${BASE_URL}/super-admin/companies/rejected`,
    APPROVE_COMPANY: `${BASE_URL}/super-admin/approve-company`,
    REJECT_COMPANY: `${BASE_URL}/super-admin/reject-company`,
    AUDIT_LOGS: `${BASE_URL}/super-admin/audit-logs`,  
    REPORT_COMPANY: `${BASE_URL}/report/company`,
    REPORT_COMPANY_GRAPH: `${BASE_URL}/report/company/graph`,
    REPORT_COMPANY_CHART: `${BASE_URL}/report/company/chart`,
    REPORT_SUBSCRIPTIONS: `${BASE_URL}/report/subscriptions`,
  },

  COMPANY: {
    DASHBOARD: `${BASE_URL}/company/dashboard`,
    ORDERS: `${BASE_URL}/company/orders`,
    REPORT_TABLE: `${BASE_URL}/company/report/orders`,
    REPORT_GRAPH: `${BASE_URL}/company/report/graph`,
    REPORT_CHART: `${BASE_URL}/company/report/chart`,
    TOP_FOODS: `${BASE_URL}/company/report/top-foods`,
  },

  SUBSCRIPTION: {
  PLANS: `${BASE_URL}/subscription/plans`,   
  PLAN: `${BASE_URL}/subscription/plan`,     
  MY: `${BASE_URL}/subscription/my`,
  ALL: `${BASE_URL}/subscription/all`,
  UPGRADE: `${BASE_URL}/subscription/upgrade`,
},
TICKET: {
  CREATE: `${BASE_URL}/ticket/create`,
  COMPANY: `${BASE_URL}/ticket/company`,
  MY_TICKETS: `${BASE_URL}/ticket/my`,
  CLOSE: `${BASE_URL}/ticket/close`,   
},
MESSAGE: {
  SEND: `${BASE_URL}/messages/send`,
  GET: `${BASE_URL}/messages`,  
  UNREAD: `${BASE_URL}/messages/unread`,
  READ: `${BASE_URL}/messages/read`,
},
ADDRESS: {
  ADD: `${BASE_URL}/address/add`,
  MY: `${BASE_URL}/address/my`,
  UPDATE: `${BASE_URL}/address/update`,
  DELETE: `${BASE_URL}/address/delete`,
  DEFAULT: `${BASE_URL}/address/default`,
},
};