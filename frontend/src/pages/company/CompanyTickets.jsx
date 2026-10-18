import { useEffect, useState } from "react";
import CompanyLayout from "../../layouts/CompanyLayout";
import Chat from "../../components/Chat";
import { getCompanyTickets, closeTicket } from "../../services/ticketService";
import { socket } from "../../../socket";
import { Search, X, RotateCcw, } from "lucide-react";

const CompanyTickets = ({ user }) => {
  /* ================= STATES ================= */
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [newCount, setNewCount] = useState(0);
  const [foodModal, setFoodModal] = useState(false);
  const [selectedFoods, setSelectedFoods] = useState([]);

  /* ================= FETCH ================= */
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await getCompanyTickets(
        page,
        search,
        filter,
        startDate,
        endDate,
      );
      setTickets(res.tickets || []);
      setUnreadCount(res.unreadCount || 0);
      setNewCount(res.newCount || 0);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOAD ================= */
  useEffect(() => {
    fetchTickets();
  }, [page, search, filter, startDate, endDate]);

  /* ================= SOCKET ================= */
  useEffect(() => {
    socket.on("refresh_tickets", fetchTickets);
    return () => {
      socket.off("refresh_tickets", fetchTickets);
    };
  }, [page, search, filter, startDate, endDate]);

  /* ================= LIVE MODAL UPDATE ================= */
  useEffect(() => {
    if (!selectedTicket) return;

    const updateSelectedTicket = async () => {
      const res = await getCompanyTickets(
        page,
        search,
        filter,
        startDate,
        endDate,
      );
      const updated = res?.tickets?.find((t) => t.id === selectedTicket.id);
      if (updated) setSelectedTicket(updated);
    };

    socket.on("refresh_tickets", updateSelectedTicket);
    return () => {
      socket.off("refresh_tickets", updateSelectedTicket);
    };
  }, [selectedTicket, page, search, filter, startDate, endDate]);

  /* ================= RESET PAGE ================= */
  useEffect(() => {
    setPage(1);
  }, [search, filter, startDate, endDate]);

  /* ================= CLOSE ================= */
  const handleCloseTicket = async () => {
    try {
      await closeTicket(selectedTicket.id);
      setConfirmClose(false);
      setSelectedTicket(null);
      fetchTickets();
    } catch (error) {
      console.log(error);
    }
  };

  /* ================= PAGINATION ================= */
  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;

  const handleResetFilters = () => {
  setFilter("today");
  setStartDate("");
  setEndDate("");
  };

  return (
    <CompanyLayout>
      <div className="space-y-6">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          {/* LEFT */}
          <div>
            <h1 className="text-4xl md:text-5xl font-black">Support Tickets</h1>
            <p className="text-gray-500 mt-1">Manage customer support chats</p>
          </div>

          {/* DATE FILTER */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-11 px-4 rounded-2xl border border-gray-200 bg-white text-sm font-semibold outline-none focus:ring-2 focus:ring-orange-300"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-11 px-4 rounded-2xl border border-gray-200 bg-white text-sm font-semibold outline-none focus:ring-2 focus:ring-orange-300"
            />
            <button
  onClick={handleResetFilters}
  title="Reset Filters"
  className="
    h-11
    w-11
    rounded-2xl
    border
    border-gray-200
    bg-white
    flex
    items-center
    justify-center
    text-orange-500
    hover:bg-orange-50
    hover:border-orange-300
    transition-all
    duration-200
  "
>
  <RotateCcw size={18} />
</button>
          </div>
        </div>

        {/* ================= SEARCH + FILTER ================= */}
        <div className="flex flex-col xl:flex-row gap-4">
          {/* SEARCH */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ticket id, order id, customer..."
              className="w-full h-12 pl-11 pr-4 rounded-2xl border border-gray-200 bg-white text-sm font-medium outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>

          {/* FILTERS */}
          <div className="flex gap-3 flex-wrap">
            {["ALL", "NEW", "UNREAD", "OPEN", "CLOSED"].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setTickets([]);
                  setPage(1);
                  setFilter(item);
                }}
                className={`h-11 px-5 rounded-2xl text-sm font-bold transition ${
                  filter === item
                    ? "bg-orange-500 text-white"
                    : "bg-white border border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{item}</span>
                  {item === "NEW" && newCount > 0 && (
                    <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {newCount}
                    </span>
                  )}
                  {item === "UNREAD" && unreadCount > 0 && (
                    <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="bg-white rounded-3xl p-10 text-center">
            <p className="font-semibold text-orange-500">Loading tickets...</p>
          </div>
        )}

        {/* ================= EMPTY ================= */}
        {!loading && tickets.length === 0 && (
          <div className="bg-white rounded-3xl p-10 text-center">
            <p className="font-semibold text-gray-500">No tickets found</p>
          </div>
        )}

        {/* ================= GRID ================= */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {tickets.map((t) => {
            const unread = false;

            return (
              <div
                key={t.id}
                className="bg-white rounded-3xl p-4 border border-gray-100 hover:shadow-xl transition"
              >
                {/* TOP */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-black">Ticket #{t.id}</h2>
                    <p className="text-sm text-gray-500 mt-1">{t.user?.name}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${t.status === "OPEN" ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-500"}`}
                  >
                    {t.status}
                  </span>
                </div>

                {/* ORDER */}
                <div className="mt-4">
                  <p className="text-sm font-semibold">Order #{t.orderId}</p>
                </div>

                {/* DATE */}
                <div className="mt-4 text-xs space-y-1">
                  <p className="text-gray-500">
                    Opened: {new Date(t.createdAt).toLocaleString("en-IN")}
                  </p>

                  <p className="text-red-500">
                    Closed:{" "}
                    {t.closedAt
                      ? new Date(t.closedAt).toLocaleString("en-IN")
                      : "-"}
                  </p>
                </div>

                {/* BOTTOM */}
                <div className="flex items-center justify-between mt-4">
                  {unread ? (
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                  ) : (
                    <div />
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedFoods(t.order?.orderItems || []);
                        setFoodModal(true);
                      }}
                      className="h-9 px-3 rounded-xl bg-orange-100 text-orange-600 text-xs font-bold"
                    >
                      Foods
                    </button>

                    <button
                      onClick={() => setSelectedTicket(t)}
                      className={`h-9 px-3 rounded-xl text-xs font-bold transition ${
                        t.status === "OPEN"
                          ? "bg-orange-500 hover:bg-orange-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {t.status === "OPEN" ? "Open Chat" : "View Chat"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= PAGINATION ================= */}
        {tickets.length > 0 && (
          <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
            {/* PREV */}
            <button
              onClick={() => page > 1 && setPage(page - 1)}
              disabled={page === 1}
              className={`h-10 px-4 rounded-xl text-sm font-semibold transition ${
                page === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-200 hover:bg-gray-50"
              }`}
            >
              Prev
            </button>

            {/* PAGE NUMBERS */}
            {Array.from({ length: Math.min(totalPages, 3) }).map((_, index) => {
              const pageNumber = index + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`h-10 min-w-[40px] px-4 rounded-xl text-sm font-bold transition ${
                    page === pageNumber
                      ? "bg-orange-500 text-white"
                      : "bg-white border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            {/* NEXT */}
            <button
              onClick={() => page < totalPages && setPage(page + 1)}
              disabled={page === totalPages}
              className={`h-10 px-4 rounded-xl text-sm font-semibold transition ${
                page === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-200 hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* ================= CHAT MODAL ================= */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-5xl h-[85vh] bg-white rounded-[32px] overflow-hidden shadow-2xl flex flex-col">
            {/* TOP */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-2xl font-black">
                  Ticket #{selectedTicket.id}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedTicket.user?.name}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {selectedTicket.status !== "CLOSED" && (
                  <button
                    onClick={() => setConfirmClose(true)}
                    className="h-11 px-5 rounded-2xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition"
                  >
                    Close Ticket
                  </button>
                )}
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="w-11 h-11 rounded-2xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* CHAT */}
            <div className="flex-1 overflow-hidden">
              <Chat
                ticketId={selectedTicket.id}
                user={user}
                ticket={selectedTicket}
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= CLOSE MODAL ================= */}
      {foodModal && (
        <div className="fixed inset-0 z-[55] bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-black">Food Details</h2>

              <button
                onClick={() => setFoodModal(false)}
                className="px-4 py-2 rounded-xl bg-gray-100 font-semibold"
              >
                Back
              </button>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {selectedFoods.map((item) => (
                <div
                  key={item.id}
                  className="bg-orange-50 rounded-2xl p-4 border border-orange-100"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-black text-orange-600">
                        {item.food?.name}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-gray-400">Unit Price</p>

                      <p className="font-bold text-orange-600">₹{item.price}</p>
                    </div>
                  </div>

                  {item.food?.description && (
                    <p className="mt-3 text-sm text-gray-600">
                      {item.food.description}
                    </p>
                  )}

                  <div className="mt-3 pt-3 border-t border-orange-200 flex justify-between">
                    <span className="text-sm font-semibold">Total</span>

                    <span className="font-black text-orange-600">
                      ₹{(item.quantity * item.price).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {confirmClose && (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl">
            <h2 className="text-2xl font-black text-center">Close Ticket?</h2>
            <p className="text-sm text-gray-500 text-center mt-2">
              After closing, chat becomes view only.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setConfirmClose(false)}
                className="flex-1 h-11 rounded-2xl bg-gray-100 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleCloseTicket}
                className="flex-1 h-11 rounded-2xl bg-red-500 text-white font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </CompanyLayout>
  );
};

export default CompanyTickets;
