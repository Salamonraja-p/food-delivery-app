import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { placeOrder } from "../../services/orderService";
import { toast } from "react-toastify";
import { useCart } from "../../context/CartContext";
import { useState, useEffect } from "react";
import { getMyAddresses } from "../../services/addressService";
import {
  ShoppingBag, Trash2, Package,
  ChevronLeft, ChevronRight, MapPin, Plus,
} from "lucide-react";

/* ─────────────────────────────────────────
   Same buildPages logic as Home & MyOrders
───────────────────────────────────────── */
const buildPages = (page, totalPages) => {
  if (totalPages <= 4) return [...Array(totalPages)].map((_, i) => i + 1);
  const fixed = [1, 2, 3];
  const pages = new Set(fixed);
  if (page > 4) pages.add("...");
  if (page > 3) pages.add(page);
  if (page < totalPages) pages.add(totalPages);
  return [...pages];
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, loading, addItem, decreaseItem, removeItem } = useCart();

  const [placingOrder,     setPlacingOrder]     = useState(false);
  const [addresses,        setAddresses]        = useState([]);
  const [selectedAddress,  setSelectedAddress]  = useState("");
  const [currentPage,      setCurrentPage]      = useState(1);
  const itemsPerPage = 5;

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  /* ── Load addresses ── */
  const loadAddresses = async () => {
    try {
      const res = await getMyAddresses();
      setAddresses(res.data || []);
      const def = res.data?.find((a) => a.isDefault);
      if (def) setSelectedAddress(def.id);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => { loadAddresses(); }, []);

  /* ── Group by company ── */
  const grouped = cartItems.reduce((acc, item) => {
    const name = item.food.company?.name || "Restaurant";
    if (!acc[name]) acc[name] = [];
    acc[name].push(item);
    return acc;
  }, {});

  /* ── Calculations — 5% delivery fee per company group (matches backend) ── */
  let subtotal = 0;
  let totalDeliveryFee = 0;
  Object.values(grouped).forEach((items) => {
    let groupSub = 0;
    items.forEach((item) => {
      const finalPrice = item.food.offer > 0
        ? item.food.price - (item.food.price * item.food.offer) / 100
        : item.food.price;
      groupSub += finalPrice * item.quantity;
    });
    subtotal         += groupSub;
    totalDeliveryFee += groupSub * 0.05;
  });
  const total = subtotal + totalDeliveryFee;

  /* ── Pagination over all cart items ── */
  const totalPages  = Math.max(1, Math.ceil(cartItems.length / itemsPerPage));
  const isFirstPage = currentPage === 1;
  const isLastPage  = currentPage === totalPages;
  const paginatedItems = cartItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const paginatedGrouped = paginatedItems.reduce((acc, item) => {
    const name = item.food.company?.name || "Restaurant";
    if (!acc[name]) acc[name] = [];
    acc[name].push(item);
    return acc;
  }, {});

  /* ── Place order ── */
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }
    try {
      setPlacingOrder(true);
      await placeOrder(selectedAddress);
      toast.success("Order placed successfully!");
      navigate("/my-orders");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-[1200px] mx-auto px-8 pt-9 pb-16 max-sm:px-4">
          <div className="grid grid-cols-[1fr_320px] gap-6 items-start max-lg:grid-cols-1">
            <div className="flex flex-col gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white border border-[#e8e8e7] rounded-[18px] p-5 flex gap-4">
                  <div className="w-16 h-16 rounded-[10px] flex-shrink-0 bg-gradient-to-r from-[#efefee] via-[#e6e6e5] to-[#efefee] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />
                  <div className="flex-1 flex flex-col gap-2.5 py-1">
                    <div className="h-3 w-[55%] rounded-[8px] bg-gradient-to-r from-[#efefee] via-[#e6e6e5] to-[#efefee] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />
                    <div className="h-3 w-[35%] rounded-[8px] bg-gradient-to-r from-[#efefee] via-[#e6e6e5] to-[#efefee] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white border border-[#e8e8e7] rounded-[18px] p-6 flex flex-col gap-3">
              <div className="h-4 w-[50%] rounded-[8px] bg-gradient-to-r from-[#efefee] via-[#e6e6e5] to-[#efefee] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />
              <div className="h-10 rounded-[10px] bg-gradient-to-r from-[#efefee] via-[#e6e6e5] to-[#efefee] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] mt-2" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  /* ── Empty cart ── */
  if (cartItems.length === 0) {
    return (
      <MainLayout>
        <div className="max-w-[1200px] mx-auto px-8 pt-9 pb-16 max-sm:px-4">
          <div className="text-center py-[72px] px-5">
            <div className="text-[48px] mb-3.5 opacity-45">🛒</div>
            <div className="font-display text-[17px] font-bold text-[#6b7280] mb-1.5">
              Your cart is empty
            </div>
            <div className="text-[13.5px] text-[#9ca3af] mb-5">
              Add some dishes from the home page to get started
            </div>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 h-10 px-6 rounded-[10px] bg-[#111110] text-white border-[1.5px] border-[#111110] font-body text-[13.5px] font-semibold cursor-pointer hover:bg-[#ff6b00] hover:border-[#ff6b00] transition-all duration-150"
            >
              Browse Menu
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-[1200px] mx-auto px-8 pt-9 pb-16 max-sm:px-4 max-sm:pt-6">

        {/* ── Page header ── */}
        <div className="flex items-center gap-3 mb-7">
          <h1 className="font-display text-[26px] font-extrabold text-[#111110] tracking-[-0.02em]">
            Your Cart
          </h1>
          <span className="inline-flex items-center px-2.5 py-[3px] rounded-full text-[11px] font-semibold bg-[#fff4eb] text-[#ff6b00] border border-[#ffe0c7] tracking-[0.03em] uppercase">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="grid grid-cols-[1fr_320px] gap-6 items-start max-lg:grid-cols-1">

          {/* ══ LEFT COLUMN ══ */}
          <div className="flex flex-col gap-5">

            {/* Company groups */}
            {Object.entries(paginatedGrouped).map(([companyName, items]) => (
              <div
                key={companyName}
                className="bg-white border border-[#e8e8e7] rounded-[18px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden"
              >
                {/* Group header */}
                <div className="flex items-center gap-2 px-5 py-3 bg-[#f7f7f6] border-b border-[#e8e8e7]">
                  <Package size={14} strokeWidth={2} className="text-[#9ca3af]" />
                  <span className="font-display text-[13px] font-bold text-[#111110] tracking-[-0.01em]">
                    {companyName}
                  </span>
                  <span className="ml-auto text-[12px] text-[#9ca3af]">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </span>
                </div>

                {/* Items */}
                <div className="flex flex-col divide-y divide-[#f0f0ef]">
                  {items.map((item) => {
                    const stock        = item.food.stock;
                    const finalPrice   = item.food.offer > 0
                      ? item.food.price - (item.food.price * item.food.offer) / 100
                      : item.food.price;
                    const itemTotal    = finalPrice * item.quantity;
                    const isAtMaxStock = item.quantity >= stock;

                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 px-5 py-4 hover:bg-[#fafaf9] transition-colors duration-150"
                      >
                        {/* Thumbnail */}
                        <div className="w-[64px] h-[64px] rounded-[10px] overflow-hidden flex-shrink-0 bg-[#f7f7f6] border border-[#e8e8e7]">
                          <img
                            src={item.food.image ? `${BASE_URL}${item.food.image}` : "/no-image.png"}
                            alt={item.food.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = "/no-image.png"; }}
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 flex flex-col gap-1">
                          <span className="font-display text-[14.5px] font-bold text-[#111110] truncate leading-tight">
                            {item.food.name}
                          </span>
                          <span className="text-[12px] text-[#9ca3af]">
                            ₹{finalPrice.toFixed(2)} each
                            {item.food.offer > 0 && (
                              <span className="ml-1.5 text-[#22c55e] font-semibold">
                                ({item.food.offer}% off)
                              </span>
                            )}
                          </span>
                          {stock <= 5 && stock > 0 && (
                            <span className="inline-flex items-center w-fit px-2 py-[2px] rounded-full bg-[#fffbeb] text-[#f59e0b] border border-[#fde68a] text-[10.5px] font-semibold tracking-[0.03em] uppercase">
                              Only {stock} left
                            </span>
                          )}
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <span className="font-display text-[15px] font-bold text-[#111110]">
                            ₹{itemTotal.toFixed(2)}
                          </span>

                          {/* Qty control — exact same as Home.jsx */}
                          <div className="flex items-center justify-between bg-[#f7f7f6] rounded-[10px] p-[4px_6px] border-[1.5px] border-[#e8e8e7] min-w-[98px]">
                            <button
                              className="w-[30px] h-[30px] rounded-[6px] border-none bg-white text-[#111110] text-[17px] font-bold cursor-pointer flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:bg-[#ff6b00] hover:text-white transition-colors duration-150"
                              onClick={() => decreaseItem(item.foodId)}
                            >−</button>
                            <span className="font-display text-[15px] font-bold text-[#111110] min-w-[24px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              className="w-[30px] h-[30px] rounded-[6px] border-none bg-white text-[#111110] text-[17px] font-bold cursor-pointer flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:bg-[#ff6b00] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
                              onClick={() => addItem(item.foodId)}
                              disabled={isAtMaxStock}
                            >+</button>
                          </div>

                          {/* Remove */}
                          <button
                            className="inline-flex items-center gap-1 text-[11.5px] font-medium font-body text-[#9ca3af] bg-transparent border-none cursor-pointer p-0 hover:text-[#ef4444] transition-colors duration-150"
                            onClick={() => removeItem(item.foodId)}
                          >
                            <Trash2 size={12} strokeWidth={2} /> Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* ── Pagination — always visible, same as MyOrders ── */}
            <div className="flex items-center justify-center gap-1.5 mt-6 flex-wrap">
                <button
                  onClick={() => !isFirstPage && setCurrentPage((p) => p - 1)}
                  className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-[10px] border-[1.5px] font-body text-[13px] font-semibold transition-all duration-150 whitespace-nowrap ${
                    isFirstPage
                      ? "bg-white text-[#d1d1cf] border-[#e8e8e7] cursor-not-allowed opacity-40"
                      : "bg-white text-[#111110] border-[#d1d1cf] cursor-pointer hover:border-[#ff6b00] hover:text-[#ff6b00] hover:bg-[#fff4eb]"
                  }`}
                >
                  <ChevronLeft size={14} /> Prev
                </button>

                {buildPages(currentPage, totalPages).map((num, i) =>
                  num === "..." ? (
                    <span key={`gap-${i}`} className="text-[#9ca3af] text-[13px] px-0.5">…</span>
                  ) : (
                    <button
                      key={num}
                      onClick={() => setCurrentPage(num)}
                      className={`w-9 h-9 rounded-[10px] border-[1.5px] font-body text-[13px] font-medium cursor-pointer flex items-center justify-center leading-none transition-all duration-150 ${
                        currentPage === num
                          ? "bg-[#ff6b00] border-[#ff6b00] text-white font-bold"
                          : "bg-white border-[#e8e8e7] text-[#6b7280] hover:border-[#ff6b00] hover:text-[#ff6b00]"
                      }`}
                    >
                      {num}
                    </button>
                  )
                )}

                <button
                  onClick={() => !isLastPage && setCurrentPage((p) => p + 1)}
                  className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-[10px] border-[1.5px] font-body text-[13px] font-semibold transition-all duration-150 whitespace-nowrap ${
                    isLastPage
                      ? "bg-white text-[#d1d1cf] border-[#e8e8e7] cursor-not-allowed opacity-40"
                      : "bg-white text-[#111110] border-[#d1d1cf] cursor-pointer hover:border-[#ff6b00] hover:text-[#ff6b00] hover:bg-[#fff4eb]"
                  }`}
                >
                  Next <ChevronRight size={14} />
                </button>
            </div>

          </div>

          {/* ══ RIGHT COLUMN ══ */}
          <div className="flex flex-col gap-5 lg:sticky lg:top-[72px]">

            {/* ── Delivery Address ── */}
            <div className="bg-white border border-[#e8e8e7] rounded-[18px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#e8e8e7] bg-[#f7f7f6]">
                <span className="font-display text-[14px] font-bold text-[#111110]">
                  Delivery Address
                </span>
                <button
                  onClick={() => navigate("/profile")}
                  className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#ff6b00] bg-transparent border-none cursor-pointer p-0 hover:opacity-75 transition-opacity duration-150"
                >
                  <Plus size={12} strokeWidth={2.5} /> Add new
                </button>
              </div>

              <div className="p-4 flex flex-col gap-2.5">
                {addresses.length === 0 ? (
                  <div className="flex flex-col items-center gap-3 py-5 text-center">
                    <div className="w-10 h-10 rounded-full bg-[#fef2f2] flex items-center justify-center text-[#ef4444]">
                      <MapPin size={18} strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-[#6b7280] mb-0.5">No address found</p>
                      <p className="text-[12px] text-[#9ca3af]">Add an address to continue</p>
                    </div>
                    <button
                      onClick={() => navigate("/profile")}
                      className="inline-flex items-center gap-1.5 h-8 px-4 rounded-[8px] bg-[#111110] text-white border-[1.5px] border-[#111110] font-body text-[12.5px] font-semibold cursor-pointer hover:bg-[#ff6b00] hover:border-[#ff6b00] transition-all duration-150"
                    >
                      <Plus size={12} /> Add Address
                    </button>
                  </div>
                ) : (
                  addresses.map((address) => {
                    const isSelected = selectedAddress === address.id;
                    return (
                      <label
                        key={address.id}
                        className={`flex items-start gap-3 p-3.5 rounded-[12px] border-[1.5px] cursor-pointer transition-all duration-150 ${
                          isSelected
                            ? "border-[#ff6b00] bg-[#fff4eb] shadow-[0_0_0_3px_rgba(255,107,0,0.08)]"
                            : "border-[#e8e8e7] bg-white hover:border-[#d1d1cf]"
                        }`}
                      >
                        {/* Radio */}
                        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all duration-150 ${
                          isSelected ? "border-[#ff6b00]" : "border-[#d1d1cf]"
                        }`}>
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-[#ff6b00]" />
                          )}
                        </div>
                        <input
                          type="radio"
                          name="address"
                          checked={isSelected}
                          onChange={() => setSelectedAddress(address.id)}
                          className="sr-only"
                        />

                        {/* Address detail */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-display text-[13px] font-bold text-[#111110]">
                              {address.label}
                            </span>
                            {address.isDefault && (
                              <span className="inline-flex items-center px-1.5 py-[1px] rounded-full bg-[#f0fdf4] text-[#22c55e] border border-[#bbf7d0] text-[9.5px] font-bold uppercase tracking-[0.05em]">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-[12px] text-[#6b7280] leading-[1.5]">
                            {address.addressLine}, {address.city}, {address.state} – {address.postalCode}
                          </p>
                        </div>
                      </label>
                    );
                  })
                )}
              </div>
            </div>

            {/* ── Order Summary ── */}
            <div className="bg-white border border-[#e8e8e7] rounded-[18px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5">
              <h2 className="font-display text-[16px] font-bold text-[#111110] mb-5">
                Order Summary
              </h2>

              <div className="flex flex-col gap-3 mb-5">
                <div className="flex justify-between items-center text-[13.5px] text-[#6b7280]">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#111110]">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-[13.5px] text-[#6b7280]">
                  <span>Delivery fee <span className="text-[12px]">(5%)</span></span>
                  <span className="font-medium text-[#111110]">₹{totalDeliveryFee.toFixed(2)}</span>
                </div>
                <div className="h-px bg-[#e8e8e7]" />
                <div className="flex justify-between items-center">
                  <span className="font-display text-[16px] font-bold text-[#111110]">Total</span>
                  <span className="font-display text-[20px] font-bold text-[#111110]">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={placingOrder || addresses.length === 0}
                className="w-full h-11 rounded-[10px] bg-[#111110] text-white border-[1.5px] border-[#111110] font-body text-[14px] font-semibold cursor-pointer inline-flex items-center justify-center gap-2 hover:bg-[#ff6b00] hover:border-[#ff6b00] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
              >
                <ShoppingBag size={16} strokeWidth={2.5} />
                {placingOrder ? "Placing order…" : "Place Order"}
              </button>

              <p className="text-[11px] text-[#9ca3af] text-center leading-[1.55] mt-3.5">
                🔒 Secure checkout · Delivery time varies by restaurant
              </p>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Checkout;