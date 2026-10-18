import { useEffect, useState, useRef } from "react";
import MainLayout from "../../layouts/MainLayout";
import { getUserOrders, cancelOrder } from "../../services/orderService";
import { createTicket, getMyTickets } from "../../services/ticketService";
import { getMessages } from "../../services/messageService";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import {
  Package, Clock, CheckCircle, XCircle,
  ChevronLeft, ChevronRight, MessageCircle, X, Send,
  LockKeyhole, Plus, MapPin, ChevronDown, ChevronUp,
  ShoppingBag, Truck, User, AlertCircle,
} from "lucide-react";
import { socket } from "../../../socket";

/* ─────────────────────────────────────────────────────── */

const ORDER_STEPS = ["PENDING", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"];

const STATUS_META = {
  PENDING:          { label: "Waiting for approval", color: "bg-[#fffbeb] text-[#f59e0b] border border-[#fde68a]" },
  CONFIRMED:        { label: "Order confirmed",       color: "bg-[#fff4eb] text-[#ff6b00] border border-[#ffe0c7]" },
  PREPARING:        { label: "Preparing your food",   color: "bg-[#fff4eb] text-[#ff6b00] border border-[#ffe0c7]" },
  OUT_FOR_DELIVERY: { label: "Out for delivery",      color: "bg-[#fff4eb] text-[#ff6b00] border border-[#ffe0c7]" },
  DELIVERED:        { label: "Delivered",             color: "bg-[#f0fdf4] text-[#22c55e] border border-[#bbf7d0]" },
  REJECTED:         { label: "Cancelled",             color: "bg-[#fef2f2] text-[#ef4444] border border-[#fecaca]" },
};

const STEP_LABELS = {
  PENDING:          "Pending",
  CONFIRMED:        "Confirmed",
  PREPARING:        "Preparing",
  OUT_FOR_DELIVERY: "On the way",
  DELIVERED:        "Delivered",
};

/* ── buildPages — identical to Home & CompaniesPage ── */
const buildPages = (page, totalPages) => {
  if (totalPages <= 4) return [...Array(totalPages)].map((_, i) => i + 1);
  const fixed = [1, 2, 3];
  const pages = new Set(fixed);
  if (page > 4) pages.add("...");
  if (page > 3) pages.add(page);
  if (page < totalPages) pages.add(totalPages);
  return [...pages];
};

/* ── Status tracker ── */
const StatusTracker = ({ status }) => {
  if (status === "REJECTED") return null;
  const currentIdx = ORDER_STEPS.indexOf(status);
  return (
    <div className="flex items-center flex-wrap gap-y-2.5 mb-5">
      {ORDER_STEPS.map((step, i) => {
        const done   = i < currentIdx;
        const active = i === currentIdx;
        return (
          <div key={step} className="flex items-center gap-1.5">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-[10px] font-bold transition-all duration-200 ${
              done   ? "bg-[#22c55e] border-[#22c55e] text-white"
              : active ? "bg-[#ff6b00] border-[#ff6b00] text-white shadow-[0_0_0_3px_rgba(255,107,0,0.18)]"
              : "bg-white border-[#d1d1cf] text-[#9ca3af]"
            }`}>
              {done ? <CheckCircle size={12} strokeWidth={3} /> : <span>{i + 1}</span>}
            </div>
            <span className={`text-[11px] whitespace-nowrap ${
              done || active ? "text-[#6b7280] font-semibold" : "text-[#9ca3af] font-medium"
            }`}>
              {STEP_LABELS[step]}
            </span>
            {i < ORDER_STEPS.length - 1 && (
              <div className={`w-7 h-0.5 mx-1 flex-shrink-0 rounded-sm transition-all duration-200 ${
                done ? "bg-[#22c55e]" : "bg-[#e8e8e7]"
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

/* ── Cancellation reason banner ── */
const CancelBanner = ({ order }) => {
  const cancelledByCustomer = order.cancelledBy === "USER"    || order.cancelledBy === "user";
  const cancelledByCompany  = order.cancelledBy === "COMPANY" || order.cancelledBy === "company"
                           || order.rejectedBy  === "COMPANY" || order.rejectedBy  === "company";

  if (order.status !== "REJECTED") return null;

  return (
    <div className="flex items-start gap-2.5 px-4 py-3 rounded-[10px] bg-[#fef2f2] border border-[#fecaca] mb-4">
      <AlertCircle size={15} strokeWidth={2} className="text-[#ef4444] flex-shrink-0 mt-0.5" />
      <div className="flex flex-col gap-0.5">
        <span className="text-[12.5px] font-bold text-[#ef4444]">
          {cancelledByCustomer
            ? "Cancelled by you"
            : cancelledByCompany
            ? "Rejected by restaurant"
            : "Order cancelled"}
        </span>
        <span className="text-[11.5px] text-[#6b7280]">
          {cancelledByCustomer
            ? "You cancelled this order."
            : cancelledByCompany
            ? "The restaurant was unable to fulfil this order."
            : "This order was not completed."}
        </span>
      </div>
    </div>
  );
};

/* ── Expandable detail panel (items + fees) ── */
const ItemsPanel = ({ order }) => {
  const [open, setOpen] = useState(false);
  const subtotal = order.total - (order.deliveryFee || 0);

  return (
    <div className="rounded-[10px] border border-[#e8e8e7] overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-[#f7f7f6] border-none cursor-pointer hover:bg-[#f0f0ef] transition-colors duration-150"
      >
        <span className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-[#6b7280]">
          <ShoppingBag size={13} strokeWidth={2} />
          {order.orderItems.length} {order.orderItems.length === 1 ? "item" : "items"}
          <span className="text-[#9ca3af] font-normal">· ₹{Number(order.total).toFixed(2)} total</span>
        </span>
        {open
          ? <ChevronUp   size={14} strokeWidth={2} className="text-[#9ca3af]" />
          : <ChevronDown size={14} strokeWidth={2} className="text-[#9ca3af]" />
        }
      </button>

      {open && (
        <div className="bg-white px-4 pt-3 pb-4 flex flex-col gap-0">
          {/* Item rows */}
          <div className="flex flex-col gap-2 mb-3">
            {order.orderItems.map((item) => (
              <div key={item.id} className="flex items-center gap-2 text-[13px]">
                <span className="flex-1 text-[#111110] font-medium">{item.food.name}</span>
                <span className="text-[#9ca3af] text-[12px]">× {item.quantity}</span>
                <span className="font-display font-bold text-[13px] text-[#111110] min-w-[64px] text-right">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Fee breakdown */}
          <div className="border-t border-[#f0f0ef] pt-3 flex flex-col gap-1.5">
            <div className="flex justify-between text-[12.5px] text-[#6b7280]">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[12.5px] text-[#6b7280]">
              <span className="inline-flex items-center gap-1">
                <Truck size={11} strokeWidth={2} /> Delivery fee
              </span>
              <span>₹{Number(order.deliveryFee || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[13px] font-bold text-[#111110] pt-1 border-t border-[#f0f0ef] mt-0.5">
              <span>Total</span>
              <span>₹{Number(order.total).toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Expandable address panel ── */
const AddressPanel = ({ address }) => {
  const [open, setOpen] = useState(false);
  if (!address) return null;

  return (
    <div className="rounded-[10px] border border-[#e8e8e7] overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-[#f7f7f6] border-none cursor-pointer hover:bg-[#f0f0ef] transition-colors duration-150"
      >
        <span className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-[#6b7280]">
          <MapPin size={13} strokeWidth={2} />
          {address.label}
          <span className="text-[#9ca3af] font-normal">· {address.city}</span>
        </span>
        {open
          ? <ChevronUp   size={14} strokeWidth={2} className="text-[#9ca3af]" />
          : <ChevronDown size={14} strokeWidth={2} className="text-[#9ca3af]" />
        }
      </button>

      {open && (
        <div className="bg-white px-4 py-3 flex flex-col gap-1">
          <div className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#111110]">
            <User size={11} strokeWidth={2} className="text-[#9ca3af]" />
            {address.fullName}
            <span className="text-[#9ca3af] font-normal">· {address.phone}</span>
          </div>
          <p className="text-[12.5px] text-[#6b7280] leading-[1.55]">
            {address.addressLine},<br />
            {address.city}, {address.state} – {address.postalCode}
          </p>
        </div>
      )}
    </div>
  );
};

/* ── Chat modal ── */
const ChatModal = ({ ticketId, user, isClosed, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText]         = useState("");
  const bottomRef               = useRef(null);

  useEffect(() => {
    if (!ticketId) return;
    socket.emit("join_room", ticketId);
    (async () => {
      try {
        const data = await getMessages(ticketId);
        setMessages(Array.isArray(data) ? data : []);
      } catch { /* silent */ }
    })();
  }, [ticketId]);

  useEffect(() => {
    socket.on("receive_message", (msg) => setMessages((p) => [...p, msg]));
    return () => socket.off("receive_message");
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim() || isClosed) return;
    socket.emit("send_message", { ticketId, senderId: user.id, message: text });
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/45 z-[100] flex items-center justify-center p-5">
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-[18px] shadow-[0_20px_48px_rgba(0,0,0,0.12)] w-full max-w-[480px] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8e8e7]">
          <div className="flex items-center gap-2">
            <MessageCircle size={18} className="text-[#ff6b00]" />
            <span className="font-display font-bold text-[15px] text-[#111110]">Support Chat</span>
            {isClosed && (
              <span className="inline-flex items-center gap-1 px-2 py-[3px] rounded-full bg-[#f7f7f6] text-[#9ca3af] border border-[#e8e8e7] text-[11px] font-semibold ml-1">
                <LockKeyhole size={9} /> Closed
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-1 rounded-[6px] text-[#9ca3af] hover:text-[#111110] hover:bg-[#f7f7f6] border-none bg-transparent cursor-pointer transition-colors duration-150">
            <X size={18} />
          </button>
        </div>

        {isClosed && (
          <div className="flex items-center gap-2 px-5 py-2.5 bg-[#f7f7f6] border-b border-[#e8e8e7] text-[12.5px] text-[#6b7280]">
            <LockKeyhole size={13} className="text-[#9ca3af] flex-shrink-0" />
            This ticket has been closed. You can view the conversation but cannot send new messages.
          </div>
        )}

        {/* Messages */}
        <div className="h-80 overflow-y-auto p-4 flex flex-col gap-2 bg-[#f7f7f6]">
          {messages.length === 0 && (
            <p className="text-center text-[#9ca3af] text-[13px] m-auto">No messages yet.</p>
          )}
          {messages.map((m) => {
            const isMine = m.senderId === user.id;
            return (
              <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[72%] px-3 py-2 text-[13.5px] leading-[1.45] shadow-[0_1px_3px_rgba(0,0,0,0.06)] ${
                  isMine
                    ? "bg-[#ff6b00] text-white rounded-[14px_14px_4px_14px]"
                    : "bg-white text-[#111110] border border-[#e8e8e7] rounded-[14px_14px_14px_4px]"
                }`}>
                  {m.message}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        {isClosed ? (
          <div className="flex items-center justify-center gap-1.5 px-5 py-3.5 border-t border-[#e8e8e7] bg-white text-[13px] text-[#9ca3af]">
            <LockKeyhole size={13} /> Messaging disabled — ticket closed
          </div>
        ) : (
          <div className="flex gap-2 px-4 py-3 border-t border-[#e8e8e7] bg-white">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message…"
              className="flex-1 h-[38px] px-3.5 bg-[#f7f7f6] border-[1.5px] border-[#e8e8e7] rounded-[10px] font-body text-[13.5px] text-[#111110] outline-none focus:bg-white focus:border-[#ff6b00] focus:shadow-[0_0_0_3px_rgba(255,107,0,0.1)] transition-all duration-150 placeholder:text-[#b4b4b2]"
            />
            <button
              onClick={handleSend}
              className="h-[38px] px-3.5 bg-[#ff6b00] text-white border-[1.5px] border-[#ff6b00] rounded-[10px] flex items-center justify-center cursor-pointer hover:bg-[#e65f00] transition-colors duration-150 flex-shrink-0"
            >
              <Send size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════════ */
const MyOrders = () => {
  const { user } = useAuth();

  const [orders,         setOrders]         = useState([]);
  const [page,           setPage]           = useState(1);
  const [totalPages,     setTotalPages]     = useState(1);
  const [loading,        setLoading]        = useState(true);
  const [cancelling,     setCancelling]     = useState(null);
  const [chatTicketId,   setChatTicketId]   = useState(null);
  const [chatIsClosed,   setChatIsClosed]   = useState(false);
  const [supportLoading, setSupportLoading] = useState(null);
  const [ticketMap,      setTicketMap]      = useState({});

  const fetchOrders = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await getUserOrders(page);
      setOrders(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchTickets = async () => {
    try {
      const res  = await getMyTickets();
      const list = Array.isArray(res) ? res : (res.tickets || []);
      const map  = {};
      list.forEach((t) => {
        if (!map[t.orderId]) map[t.orderId] = [];
        map[t.orderId].push(t);
      });
      Object.keys(map).forEach((k) => {
        map[k].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      });
      setTicketMap(map);
    } catch { /* silent */ }
  };

  useEffect(() => {
    fetchOrders();
    fetchTickets();
    const iv = setInterval(() => { fetchOrders(true); fetchTickets(); }, 5000);
    return () => clearInterval(iv);
  }, [page]);

  const handleCancel = async (orderId) => {
    try {
      setCancelling(orderId);
      await cancelOrder(orderId);
      toast.success("Order cancelled");
      fetchOrders(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel");
    } finally {
      setCancelling(null);
    }
  };

  const handleSupport = async (order) => {
    try {
      setSupportLoading(order.id);
      const res      = await createTicket(order.id);
      const ticketId = res.ticketId || res.ticket?.id || res.id;
      const isClosed = res.status === "CLOSED";
      setChatTicketId(ticketId);
      setChatIsClosed(isClosed);
      fetchTickets();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to open support");
    } finally {
      setSupportLoading(null);
    }
  };

  const openTicket = (ticketId, isClosed) => {
    setChatTicketId(ticketId);
    setChatIsClosed(isClosed);
  };

  const isFirstPage = page === 1;
  const isLastPage  = page === totalPages;

  return (
    <MainLayout>
      <div className="max-w-[1200px] mx-auto px-8 pt-9 pb-16 max-sm:px-4 max-sm:pt-6">

        {/* ── Header ── */}
        <div className="flex items-center gap-3.5 mb-7">
          <h1 className="font-display text-[26px] font-extrabold text-[#111110] tracking-[-0.02em]">
            My Orders
          </h1>
          <span className="inline-flex items-center gap-1.5 bg-[#f0fdf4] text-[#22c55e] border border-[#bbf7d0] text-[11px] font-semibold tracking-[0.05em] uppercase px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-[#22c55e] rounded-full flex-shrink-0 animate-pulse" />
            Live updates
          </span>
        </div>

        {/* ── Skeleton ── */}
        {loading ? (
          <div className="flex flex-col gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white border border-[#e8e8e7] rounded-[18px] p-[22px_24px] flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <div className="h-3 w-[30%] rounded-[10px] bg-gradient-to-r from-[#efefee] via-[#e6e6e5] to-[#efefee] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />
                  <div className="h-6 w-[18%] rounded-full bg-gradient-to-r from-[#efefee] via-[#e6e6e5] to-[#efefee] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />
                </div>
                <div className="h-3 w-[55%] rounded-[10px] bg-gradient-to-r from-[#efefee] via-[#e6e6e5] to-[#efefee] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />
                <div className="h-6 rounded-[10px] bg-gradient-to-r from-[#efefee] via-[#e6e6e5] to-[#efefee] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />
                <div className="h-3 w-[40%] rounded-[10px] bg-gradient-to-r from-[#efefee] via-[#e6e6e5] to-[#efefee] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />
              </div>
            ))}
          </div>

        ) : orders.length === 0 ? (
          <div className="text-center py-[72px] px-5">
            <div className="flex justify-center mb-3.5 opacity-45">
              <Package size={44} strokeWidth={1.2} />
            </div>
            <div className="font-display text-[17px] font-bold text-[#6b7280] mb-1.5">No orders yet</div>
            <div className="text-[13.5px] text-[#9ca3af]">Place your first order from the home page</div>
          </div>

        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => {
              const meta         = STATUS_META[order.status] || STATUS_META.PENDING;
              const isActive     = !["DELIVERED", "REJECTED"].includes(order.status);
              const isRejected   = order.status === "REJECTED";
              const showSupport  = ["DELIVERED", "REJECTED"].includes(order.status);
              const isCancelling = cancelling === order.id;
              const isOpening    = supportLoading === order.id;

              const tickets       = ticketMap[order.id] || [];
              const latestTicket  = tickets[0];
              const hasOpenTicket = latestTicket && latestTicket.status !== "CLOSED";
              const allClosed     = tickets.length > 0 && tickets.every((t) => t.status === "CLOSED");

              return (
                <div
                  key={order.id}
                  className={`bg-white border rounded-[18px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-[22px_24px] flex flex-col gap-4 ${
                    isRejected ? "border-[#fecaca]" : "border-[#e8e8e7]"
                  }`}
                >

                  {/* ── Card header ── */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-[3px]">
                      <span className="font-display text-[16px] font-bold text-[#111110] tracking-[-0.01em]">
                        Order #{order.id}
                      </span>
                      <span className="text-[12px] text-[#9ca3af] font-medium">
                        {order.company?.name}
                      </span>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-[3px] rounded-full text-[11px] font-semibold tracking-[0.03em] uppercase flex-shrink-0 ${meta.color}`}>
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </div>

                  {/* ── Status label ── */}
                  <p className="flex items-center gap-1.5 text-[12.5px] text-[#6b7280] -mt-2">
                    {isRejected ? (
                      <span className="flex items-center gap-1.5 text-[#ef4444]">
                        <XCircle size={13} strokeWidth={2} /> {meta.label}
                      </span>
                    ) : (
                      <>
                        <Clock size={13} strokeWidth={2} className="text-[#9ca3af]" />
                        {meta.label}
                      </>
                    )}
                  </p>

                  {/* ── Cancellation reason banner ── */}
                  <CancelBanner order={order} />

                  {/* ── Progress tracker (hidden for rejected) ── */}
                  <StatusTracker status={order.status} />

                  {/* ── Expandable panels row ── */}
                  <div className="flex flex-col gap-2.5">

                    {/* Panel 1 — Items + fee breakdown */}
                    <ItemsPanel order={order} />

                    {/* Panel 2 — Delivery address */}
                    <AddressPanel address={order.address} />

                  </div>

                  {/* ── Footer ── */}
                  <div className="flex items-center justify-between gap-3 pt-1 max-sm:flex-col max-sm:items-start max-sm:gap-2.5">
                    <span className="text-[13.5px] text-[#6b7280]">
                      Total &nbsp;
                      <strong className="font-display text-[16px] font-bold text-[#111110]">
                        ₹{Number(order.total).toFixed(2)}
                      </strong>
                    </span>

                    <div className="flex items-center gap-2 flex-wrap">

                      {/* ── Support / ticket area (DELIVERED or REJECTED only) ── */}
                      {showSupport && (
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Closed ticket chips */}
                          {[...tickets].reverse().filter((t) => t.status === "CLOSED").map((t, idx) => (
                            <button
                              key={t.id}
                              onClick={() => openTicket(t.id, true)}
                              className="inline-flex items-center gap-1.5 h-[30px] px-2.5 rounded-[8px] border-[1.5px] border-[#e8e8e7] bg-[#f7f7f6] text-[#9ca3af] font-body text-[12px] font-semibold cursor-pointer hover:bg-[#f0fdf4] hover:text-[#6b7280] hover:border-[#bbf7d0] transition-all duration-150"
                            >
                              <LockKeyhole size={11} /> Ticket #{idx + 1}
                            </button>
                          ))}

                          {/* Open ticket */}
                          {hasOpenTicket && (
                            <button
                              onClick={() => openTicket(latestTicket.id, false)}
                              className="inline-flex items-center gap-1.5 h-[34px] px-3 rounded-[10px] border-[1.5px] border-[#ff6b00] bg-[#fff4eb] text-[#ff6b00] font-body text-[13px] font-semibold cursor-pointer hover:bg-[#ff6b00] hover:text-white transition-all duration-150"
                            >
                              <MessageCircle size={13} /> Open Chat
                            </button>
                          )}

                          {/* New ticket / support */}
                          {(tickets.length === 0 || allClosed) && (
                            <button
                              onClick={() => handleSupport(order)}
                              disabled={isOpening}
                              className={`inline-flex items-center gap-1.5 h-[34px] px-3 rounded-[10px] border-[1.5px] border-[#d1d1cf] bg-white text-[#111110] font-body text-[13px] font-semibold cursor-pointer hover:border-[#ff6b00] hover:text-[#ff6b00] hover:bg-[#fff4eb] transition-all duration-150 ${isOpening ? "opacity-60 cursor-not-allowed" : ""}`}
                            >
                              {tickets.length === 0
                                ? <><MessageCircle size={13} />{isOpening ? "Opening…" : "Support"}</>
                                : <><Plus size={13} />{isOpening ? "Creating…" : "New Ticket"}</>
                              }
                            </button>
                          )}
                        </div>
                      )}

                      {/* ── Cancel button (active orders only) ── */}
                      {isActive && (
                        <button
                          onClick={() => handleCancel(order.id)}
                          disabled={isCancelling}
                          className={`inline-flex items-center gap-1.5 h-[34px] px-3 rounded-[10px] border-[1.5px] border-[#ef4444] bg-transparent text-[#ef4444] font-body text-[13px] font-semibold cursor-pointer hover:bg-[#fef2f2] transition-all duration-150 max-sm:w-full max-sm:justify-center ${isCancelling ? "opacity-60 cursor-not-allowed" : ""}`}
                        >
                          {isCancelling ? "Cancelling…" : "Cancel order"}
                        </button>
                      )}

                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* ── Pagination — always shown when orders exist ── */}
        {!loading && orders.length > 0 && (
          <div className="flex items-center justify-center gap-1.5 mt-12 flex-wrap">

            <button
              onClick={() => !isFirstPage && setPage((p) => p - 1)}
              className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-[10px] border-[1.5px] font-body text-[13px] font-semibold transition-all duration-150 whitespace-nowrap ${
                isFirstPage
                  ? "bg-white text-[#d1d1cf] border-[#e8e8e7] cursor-not-allowed opacity-40"
                  : "bg-white text-[#111110] border-[#d1d1cf] cursor-pointer hover:border-[#ff6b00] hover:text-[#ff6b00] hover:bg-[#fff4eb]"
              }`}
            >
              <ChevronLeft size={14} /> Prev
            </button>

            {buildPages(page, totalPages).map((num, i) =>
              num === "..." ? (
                <span key={`gap-${i}`} className="text-[#9ca3af] text-[13px] px-0.5">…</span>
              ) : (
                <button
                  key={num}
                  onClick={() => setPage(num)}
                  className={`w-9 h-9 rounded-[10px] border-[1.5px] font-body text-[13px] font-medium cursor-pointer flex items-center justify-center leading-none transition-all duration-150 ${
                    page === num
                      ? "bg-[#ff6b00] border-[#ff6b00] text-white font-bold"
                      : "bg-white border-[#e8e8e7] text-[#6b7280] hover:border-[#ff6b00] hover:text-[#ff6b00]"
                  }`}
                >
                  {num}
                </button>
              )
            )}

            <button
              onClick={() => !isLastPage && setPage((p) => p + 1)}
              className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-[10px] border-[1.5px] font-body text-[13px] font-semibold transition-all duration-150 whitespace-nowrap ${
                isLastPage
                  ? "bg-white text-[#d1d1cf] border-[#e8e8e7] cursor-not-allowed opacity-40"
                  : "bg-white text-[#111110] border-[#d1d1cf] cursor-pointer hover:border-[#ff6b00] hover:text-[#ff6b00] hover:bg-[#fff4eb]"
              }`}
            >
              Next <ChevronRight size={14} />
            </button>

          </div>
        )}

      </div>

      {/* ── Chat modal ── */}
      {chatTicketId && user && (
        <ChatModal
          ticketId={chatTicketId}
          user={user}
          isClosed={chatIsClosed}
          onClose={() => { setChatTicketId(null); setChatIsClosed(false); }}
        />
      )}

    </MainLayout>
  );
};

export default MyOrders;
