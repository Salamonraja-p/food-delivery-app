import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CompanyLayout from "../../layouts/CompanyLayout";
import {RotateCcw} from "lucide-react";
import {
  getCompanyOrders,
  approveOrder,
  rejectOrder,
  updateOrderStatus,
} from "../../services/companyService";

const orderSteps = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

/* ================= STATUS TRACKER ================= */
const StatusTracker = ({ status }) => {
  const currentIndex = orderSteps.indexOf(status);

  return (
    <div className="flex items-center gap-2 mt-5 flex-wrap">
      {orderSteps.map((step, index) => (
        <div key={step} className="flex items-center gap-2">
          {/* CIRCLE */}
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              index <= currentIndex
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-400"
            }`}
          >
            {index + 1}
          </div>

          {/* TEXT */}
          <span
            className={`text-xs font-semibold ${
              index <= currentIndex ? "text-green-600" : "text-gray-400"
            }`}
          >
            {step.replaceAll("_", " ")}
          </span>

          {/* LINE */}
          {index !== orderSteps.length - 1 && (
            <div
              className={`w-5 h-1 rounded-full ${
                index < currentIndex ? "bg-green-500" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

const CompanyOrders = () => {
  /* ================= STATES ================= */
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState("PENDING");
  const [historyFilter, setHistoryFilter] = useState("ALL");
  const [loadingIds, setLoadingIds] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  /* ================= MODALS ================= */
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectId, setRejectId] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approveId, setApproveId] = useState(null);
  const [showNextModal, setShowNextModal] = useState(false);
  const [nextOrder, setNextOrder] = useState(null);
  const [foodModal, setFoodModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [addressModal, setAddressModal] = useState(false);

  /* ================= FETCH ================= */
  const fetchOrders = async () => {
    try {
      const res = await getCompanyOrders(
        page,
        activeTab.toLowerCase(),
        historyFilter,
        startDate,
        endDate,
      );
      setOrders(res.data?.data || []);
      setTotalPages(res.data?.pagination?.totalPages || 1);
    } catch {
      toast.error("Failed to load orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, activeTab, historyFilter, startDate, endDate]);

  /* RESET PAGE */
  useEffect(() => {
    setPage(1);
  }, [activeTab, historyFilter, startDate, endDate]);

  /* ================= APPROVE ================= */
  const handleApprove = async (id) => {
    try {
      setLoadingIds((prev) => [...prev, id]);
      await approveOrder(id);
      toast.success("Order Approved");
      fetchOrders();
    } catch {
      toast.error("Failed");
    } finally {
      setLoadingIds((prev) => prev.filter((x) => x !== id));
    }
  };

  /* ================= REJECT ================= */
  const handleReject = async () => {
    try {
      setLoadingIds((prev) => [...prev, rejectId]);
      await rejectOrder(rejectId);
      toast.success("Order Rejected");
      setShowRejectModal(false);
      setRejectId(null);
      fetchOrders();
    } catch {
      toast.error("Failed");
    } finally {
      setLoadingIds((prev) => prev.filter((x) => x !== rejectId));
    }
  };

  /* ================= NEXT STEP ================= */
  const handleNext = async (order) => {
    let next;
    if (order.status === "CONFIRMED") {
      next = "PREPARING";
    } else if (order.status === "PREPARING") {
      next = "OUT_FOR_DELIVERY";
    } else if (order.status === "OUT_FOR_DELIVERY") {
      next = "DELIVERED";
    }

    if (!next) return;

    try {
      setLoadingIds((prev) => [...prev, order.id]);
      await updateOrderStatus(order.id, next);
      toast.success("Status Updated");
      fetchOrders();
    } catch {
      toast.error("Failed");
    } finally {
      setLoadingIds((prev) => prev.filter((x) => x !== order.id));
    }
  };

  /* ================= PAGINATION ================= */
  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;

  const handleResetFilters = () => {
  setStartDate("");
  setEndDate("");
};

  return (
    <CompanyLayout>
      <div className="space-y-8">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
          {/* LEFT */}
          <div>
            <h1 className="text-4xl md:text-5xl font-black">Company Orders</h1>
            <p className="text-gray-500 mt-1">Manage customer orders</p>
          </div>

          {/* RIGHT */}
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

        {/* ================= TABS ================= */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-3 flex-wrap">
            {["PENDING", "ACTIVE", "HISTORY"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`h-11 px-5 rounded-2xl text-sm font-bold transition ${
                  activeTab === tab
                    ? "bg-orange-500 text-white"
                    : "bg-white border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* HISTORY FILTER */}
          {activeTab === "HISTORY" && (
            <select
              value={historyFilter}
              onChange={(e) => setHistoryFilter(e.target.value)}
              className="h-11 px-4 rounded-2xl border border-gray-200 bg-white text-sm font-semibold outline-none focus:ring-2 focus:ring-orange-300"
            >
              <option value="ALL">All</option>
              <option value="DELIVERED">Delivered</option>
              <option value="REJECTED">Rejected</option>
            </select>
          )}
        </div>

        {/* ================= EMPTY ================= */}
        {orders.length === 0 && (
          <div className="bg-white rounded-3xl p-10 text-center">
            <h2 className="text-xl font-bold text-gray-700">No Orders Found</h2>
          </div>
        )}

        {/* ================= ORDERS ================= */}
        <div className="space-y-5">
          {orders.map((order) => {
            console.log(order);
            const isLoading = loadingIds.includes(order.id);

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition"
              >
                {/* TOP */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* LEFT */}
                  <div>
                    <h2 className="text-2xl font-black">Order #{order.id}</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {order.user?.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </p>
                    
                  </div>

                  {/* RIGHT */}
                  <div className="text-left lg:text-right">
                    <p className="text-2xl font-black text-orange-500">
                      ₹{order.total?.toFixed(2)}
                    </p>
                    <span
                      className={`inline-flex mt-2 px-4 py-1.5 rounded-full text-xs font-bold ${
                        order.status === "DELIVERED"
                          ? "bg-green-100 text-green-600"
                          : order.status === "REJECTED"
                            ? "bg-red-100 text-red-600"
                            : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      {order.cancelledBy === "USER"
                        ? "Cancelled By Customer"
                        : order.rejectedBy === "COMPANY"
                          ? "Rejected By Company"
                          : order.status.replaceAll("_", " ")}
                    </span>
                  </div>
                </div>

                {/* TRACKER */}
                {order.status !== "REJECTED" && (
                  <StatusTracker status={order.status} />
                )}

                <div className="mt-4 space-y-1 text-sm">
                  <p>Items: {order.orderItems.length}</p>

                  <p>
                    Food Total: ₹{(order.total - order.deliveryFee).toFixed(2)}
                  </p>

                  <p>Delivery Fee: ₹{order.deliveryFee.toFixed(2)}</p>

                  <p className="font-bold text-orange-500">
                    Grand Total: ₹{order.total.toFixed(2)}
                  </p>

                  {["DELIVERED", "REJECTED"].includes(order.status) && (
                    <div className="mt-4 flex items-center gap-3">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setFoodModal(true);
                        }}
                        className="h-10 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold"
                      >
                        Food Details
                      </button>
                      <button
  onClick={() => {
    setSelectedOrder(order);
    setAddressModal(true);
  }}
  className="h-11 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold transition"
>
  Address
</button>

                      {order.status === "REJECTED" && (
                        <span className="h-10 px-4 rounded-xl bg-red-100 text-red-600 text-sm font-bold flex items-center">
                          {order.cancelledBy === "USER"
                            ? `Cancelled at ${order.previousStatus}`
                            : `Rejected at ${order.previousStatus}`}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* ACTIONS */}
                {order.status === "PENDING" && (
                  <div className="flex flex-wrap gap-3 mt-6">
                    {/* APPROVE */}
                    <button
                      disabled={isLoading}
                      onClick={() => {
                        setApproveId(order.id);
                        setShowApproveModal(true);
                      }}
                      className="h-11 px-5 rounded-2xl bg-green-500 hover:bg-green-600 text-white text-sm font-bold transition"
                    >
                      Approve
                    </button>

                    {/* REJECT */}
                    <button
                      disabled={isLoading}
                      onClick={() => {
                        setRejectId(order.id);
                        setShowRejectModal(true);
                      }}
                      className="h-11 px-5 rounded-2xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition"
                    >
                      Reject
                    </button>

                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setFoodModal(true);
                      }}
                      className="h-11 px-5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition"
                    >
                      Food Details
                    </button>
                    <button
  onClick={() => {
    setSelectedOrder(order);
    setAddressModal(true);
  }}
  className="h-11 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold transition"
>
  Address
</button>
                  </div>
                )}

                {/* ACTIVE */}
                {["CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY"].includes(
                  order.status,
                ) && (
                  <div className="flex flex-wrap gap-3 mt-6">
                    {/* NEXT */}
                    <button
                      disabled={isLoading}
                      onClick={() => {
                        setNextOrder(order);
                        setShowNextModal(true);
                      }}
                      className="h-11 px-5 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-bold transition"
                    >
                      Next Step
                    </button>

                    {/* REJECT */}
                    <button
                      disabled={isLoading}
                      onClick={() => {
                        setRejectId(order.id);
                        setShowRejectModal(true);
                      }}
                      className="h-11 px-5 rounded-2xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition"
                    >
                      Reject
                    </button>

                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setFoodModal(true);
                      }}
                      className="h-11 px-5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition"
                    >
                      Food Details
                    </button>
                    <button
  onClick={() => {
    setSelectedOrder(order);
    setAddressModal(true);
  }}
  className="h-11 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold transition"
>
  Address
</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ================= PAGINATION ================= */}
        {orders.length > 0 && (
          <div className="flex items-center justify-center gap-3 flex-wrap pt-2">
            {/* PREV */}
            <button
              onClick={() => !isFirstPage && setPage((p) => p - 1)}
              disabled={isFirstPage}
              className={`h-10 px-4 rounded-xl text-sm font-semibold transition ${
                isFirstPage
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-200 hover:bg-gray-50"
              }`}
            >
              Prev
            </button>

            {/* NUMBERS */}
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
              onClick={() => !isLastPage && setPage((p) => p + 1)}
              disabled={isLastPage}
              className={`h-10 px-4 rounded-xl text-sm font-semibold transition ${
                isLastPage
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-200 hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
      {/* ================= APPROVE MODAL ================= */}
      {showApproveModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl text-center">
            <h2 className="text-2xl font-black">Approve Order?</h2>
            <p className="text-sm text-gray-500 mt-2">
              Order will move to confirmed state.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowApproveModal(false);
                  setApproveId(null);
                }}
                className="flex-1 h-11 rounded-2xl bg-gray-100 hover:bg-gray-200 text-sm font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleApprove(approveId);
                  setShowApproveModal(false);
                  setApproveId(null);
                }}
                className="flex-1 h-11 rounded-2xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ================= REJECT MODAL ================= */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl text-center">
            <h2 className="text-2xl font-black">Reject Order?</h2>
            <p className="text-sm text-gray-500 mt-2">
              This action cannot be undone.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectId(null);
                }}
                className="flex-1 h-11 rounded-2xl bg-gray-100 hover:bg-gray-200 text-sm font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="flex-1 h-11 rounded-2xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ================= NEXT MODAL ================= */}
      {showNextModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl text-center">
            <h2 className="text-2xl font-black">Update Status?</h2>
            <p className="text-sm text-gray-500 mt-2">
              Move order to next stage.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowNextModal(false);
                  setNextOrder(null);
                }}
                className="flex-1 h-11 rounded-2xl bg-gray-100 hover:bg-gray-200 text-sm font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleNext(nextOrder);
                  setShowNextModal(false);
                  setNextOrder(null);
                }}
                className="flex-1 h-11 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
      ,
      {foodModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl border border-orange-100">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-black">Order #{selectedOrder.id}</h2>

              <button
                onClick={() => {
                  setFoodModal(false);
                  setSelectedOrder(null);
                }}
                className="h-10 px-4 rounded-xl bg-orange-100 text-orange-600 font-semibold hover:bg-orange-200 transition"
              >
                Back
              </button>
            </div>

            <div className="space-y-3">
              {selectedOrder.orderItems.map((item) => (
                <div key={item.id} className="bg-orange-50 rounded-2xl p-4">
                  <p className="font-bold text-orange-600">{item.food?.name}</p>

                  <p>Qty: {item.quantity}</p>

                  <p>Price: ₹{Number(item.price).toFixed(2)}</p>

                  <p>Total: ₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="mt-4 p-4 bg-orange-50 rounded-2xl space-y-2">
                <p>
                  Food Total: ₹
                  {(selectedOrder.total - selectedOrder.deliveryFee).toFixed(2)}
                </p>

                <p>Delivery Fee: ₹{selectedOrder.deliveryFee.toFixed(2)}</p>

                <p className="font-bold text-orange-500">
                  Grand Total: ₹{selectedOrder.total.toFixed(2)}
                </p>

                {selectedOrder.actionAt && (
                  <p>
                    Action Time:
                    {new Date(selectedOrder.actionAt).toLocaleString("en-IN")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      ,
      {addressModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-orange-100">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-black">Delivery Address</h2>

              <button
                onClick={() => {
                  setAddressModal(false);
                  setSelectedOrder(null);
                }}
                className="h-10 px-4 rounded-xl bg-orange-100 text-orange-600 font-semibold hover:bg-orange-200 transition"
              >
                Back
              </button>
            </div>

            {selectedOrder.address ? (
              <div className="bg-orange-50 rounded-2xl p-5 space-y-2">
                <p>
                  <span className="font-bold">Name:</span>{" "}
                  {selectedOrder.address.fullName}
                </p>

                <p>
                  <span className="font-bold">Phone:</span>{" "}
                  {selectedOrder.address.phone}
                </p>

                <p>
                  <span className="font-bold">Address:</span>{" "}
                  {selectedOrder.address.addressLine}
                </p>

                <p>
                  <span className="font-bold">City:</span>{" "}
                  {selectedOrder.address.city}
                </p>

                <p>
                  <span className="font-bold">State:</span>{" "}
                  {selectedOrder.address.state}
                </p>

                <p>
                  <span className="font-bold">Postal Code:</span>{" "}
                  {selectedOrder.address.postalCode}
                </p>
              </div>
            ) : (
              <p className="text-gray-500">No address available.</p>
            )}
          </div>
        </div>
      )}
    </CompanyLayout>
  );
};

export default CompanyOrders;
