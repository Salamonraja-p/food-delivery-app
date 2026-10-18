import axiosInstance from "../api/axios";
import { API_ENDPOINTS } from "../api/endpoints";

export const createTicket = async (orderId) => {
const res = await axiosInstance.post(
API_ENDPOINTS.TICKET.CREATE,
{ orderId }
);

return res.data;
};

export const getCompanyTickets = async (
page = 1,
search = "",
filter = "ALL",
startDate = "",
endDate = ""
) => {

const params = new URLSearchParams({
page,
limit: 6,
filter
});

if (search) params.append("search", search);
if (startDate) params.append("startDate", startDate);
if (endDate) params.append("endDate", endDate);

const res = await axiosInstance.get(
`${API_ENDPOINTS.TICKET.COMPANY}?${params}`
);

return {
tickets: res.data?.data || [],
unreadCount: res.data?.unreadCount || 0,
newCount: res.data?.newCount || 0,
pagination: res.data?.pagination || {
total: 0,
currentPage: 1,
totalPages: 1
}
};
};

export const getMyTickets = async (
page = 1,
search = "",
filter = "ALL",
startDate = "",
endDate = ""
) => {

const params = new URLSearchParams({
page,
limit: 6,
filter
});

if (search) params.append("search", search);
if (startDate) params.append("startDate", startDate);
if (endDate) params.append("endDate", endDate);

const res = await axiosInstance.get(
`${API_ENDPOINTS.TICKET.MY_TICKETS}?${params}`
);

return {
tickets: res.data?.data || [],
unreadCount: res.data?.unreadCount || 0,
pagination: res.data?.pagination || {
total: 0,
currentPage: 1,
totalPages: 1
}
};
};

export const closeTicket = async (ticketId) => {
const res = await axiosInstance.put(
`${API_ENDPOINTS.TICKET.CLOSE}/${ticketId}`
);

return res.data;
};
