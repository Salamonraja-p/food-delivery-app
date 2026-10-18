import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LogOut,
  ShoppingCart,
  Package,
  UtensilsCrossed,
  ChevronDown,
  Tag,
  Building2,
  User,
  MapPin,
  Phone,
  Mail,
  Edit2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import { getMyAddresses } from "../services/addressService";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user, logout } = useAuth();
  const { cartItems } = useCart();
  const [profileOpen, setProfileOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState(null);

  const active = (path) => location.pathname === path;
  const cartCount =
    cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    const loadDefaultAddress = async () => {
      try {
        const res = await getMyAddresses();

        const address = res.data?.find((a) => a.isDefault);

        setDefaultAddress(address || null);
      } catch (err) {
        console.log(err);
      }
    };

    if (token && user?.role === "USER") {
      loadDefaultAddress();
    }
  }, [token, user]);

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-[100] bg-white/95 backdrop-blur-md border-b border-[#e8e8e7] shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="h-[70px] flex items-center justify-between gap-4">
            {/* ── LEFT: LOGO ── */}
            <Link
              to="/"
              className="flex items-center gap-2.5 no-underline flex-shrink-0 group"
            >
              <span className="w-10 h-10 bg-gradient-to-br from-[#ff6b00] to-[#ff8c00] rounded-[12px] flex items-center justify-center text-white flex-shrink-0 shadow-md group-hover:shadow-lg transition-all duration-200">
                <UtensilsCrossed size={18} strokeWidth={2.5} />
              </span>
              <span className="font-display font-extrabold text-[20px] tracking-[-0.03em] text-[#111110] hidden sm:inline">
                Food<em className="not-italic text-[#ff6b00]">Hub</em>
              </span>
            </Link>

            {/* ── CENTER NAV (Desktop - Logged in) ── */}
            {token && user?.role === "USER" && (
              <div className="hidden lg:flex items-center gap-2 flex-1 justify-center">
                <Link
                  to="/"
                  className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-[14px] font-medium no-underline transition-all duration-200 ${
                    active("/")
                      ? "bg-[#fff4eb] text-[#ff6b00] font-semibold"
                      : "text-[#6b7280] hover:text-[#111110] hover:bg-[#f7f7f6]"
                  }`}
                >
                  <UtensilsCrossed size={16} />
                  Home
                </Link>

                {/* Explore Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setExploreOpen((v) => !v)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-[14px] font-medium transition-all duration-200 cursor-pointer border-none bg-transparent ${
                      exploreOpen
                        ? "bg-[#fff4eb] text-[#ff6b00]"
                        : "text-[#6b7280] hover:text-[#111110] hover:bg-[#f7f7f6]"
                    }`}
                  >
                    Explore
                    <ChevronDown
                      size={16}
                      className="transition-transform duration-200"
                      style={{
                        transform: exploreOpen ? "rotate(180deg)" : "rotate(0)",
                      }}
                    />
                  </button>

                  {exploreOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() => setExploreOpen(false)}
                      />
                      <div className="absolute top-[calc(100%+8px)] left-0 z-40 bg-white border border-[#e8e8e7] rounded-[14px] shadow-[0_12px_32px_rgba(0,0,0,0.1)] w-[240px] p-2 flex flex-col gap-1">
                        <Link
                          to="/companies"
                          onClick={() => setExploreOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-[10px] text-[13px] font-medium text-[#374151] no-underline hover:bg-[#fff4eb] hover:text-[#ff6b00] transition-all duration-150"
                        >
                          <Building2 size={16} className="flex-shrink-0" />
                          <div>
                            <div className="font-semibold">Restaurants</div>
                            <div className="text-[11px] text-[#9ca3af]">
                              Browse all
                            </div>
                          </div>
                        </Link>

                        <Link
                          to="/offers"
                          onClick={() => setExploreOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-[10px] text-[13px] font-medium text-[#374151] no-underline hover:bg-[#fff4eb] hover:text-[#ff6b00] transition-all duration-150"
                        >
                          <Tag size={16} className="flex-shrink-0" />
                          <div>
                            <div className="font-semibold">Offers</div>
                            <div className="text-[11px] text-[#9ca3af]">
                              Best deals
                            </div>
                          </div>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ── RIGHT: ACTIONS ── */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Greeting (hidden on mobile) */}
              {token && user?.name && (
                <div className="hidden md:flex items-center gap-3">
                  <span className="text-[12px] text-[#9ca3af] font-normal">
                    Hey,{" "}
                    <strong className="text-[#6b7280] font-semibold">
                      {user.name.split(" ")[0]}
                    </strong>
                  </span>
                  <div className="w-px h-6 bg-[#e8e8e7]" />
                </div>
              )}

              {/* User-only action buttons */}
              {token && user?.role === "USER" && (
                <>
                  {/* Orders button (hidden on mobile) */}
                  <Link
                    to="/my-orders"
                    className={`hidden sm:inline-flex items-center justify-center gap-2 px-4 py-2 rounded-[10px] font-body text-[13px] font-semibold border-[1.5px] no-underline transition-all duration-200 ${
                      active("/my-orders")
                        ? "bg-[#fff4eb] text-[#ff6b00] border-[#ff6b00]"
                        : "bg-white text-[#111110] border-[#e8e8e7] hover:border-[#ff6b00] hover:text-[#ff6b00] hover:bg-[#fff4eb]"
                    }`}
                  >
                    <Package size={16} strokeWidth={2} />
                    <span className="hidden lg:inline">Orders</span>
                  </Link>

                  {/* Cart Button */}
                  <Link
                    to="/checkout"
                    className="relative inline-flex items-center justify-center gap-2 px-3 md:px-4 py-2 rounded-[10px] font-body text-[13px] font-semibold border-[1.5px] no-underline transition-all duration-200 bg-gradient-to-r from-[#ff6b00] to-[#ff8c00] text-white border-[#ff6b00] hover:from-[#e65f00] hover:to-[#ff7700] hover:shadow-lg hover:shadow-orange-200"
                  >
                    <ShoppingCart size={16} strokeWidth={2.5} />
                    <span className="hidden sm:inline">Cart</span>
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 min-w-[22px] h-[22px] bg-white text-[#ff6b00] text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-[#ff6b00] leading-none shadow-sm">
                        {cartCount > 99 ? "99+" : cartCount}
                      </span>
                    )}
                  </Link>
                </>
              )}

              {/* Auth buttons (not logged in) */}
              {!token && (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-3 md:px-4 py-2 rounded-[10px] font-body text-[13px] font-semibold border-[1.5px] no-underline transition-all duration-200 bg-white text-[#111110] border-[#e8e8e7] hover:border-[#ff6b00] hover:text-[#ff6b00] hover:bg-[#fff4eb]"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-[10px] font-body text-[13px] font-semibold border-[1.5px] no-underline transition-all duration-200 bg-gradient-to-r from-[#ff6b00] to-[#ff8c00] text-white border-[#ff6b00] hover:from-[#e65f00] hover:to-[#ff7700]"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Profile Dropdown (Last - logged in only) */}
              {token && (
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen((v) => !v)}
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-[10px] transition-all duration-200 border-[1.5px] ${
                      profileOpen
                        ? "bg-[#fff4eb] border-[#ff6b00] text-[#ff6b00]"
                        : "bg-[#f7f7f6] border-[#e8e8e7] text-[#111110] hover:border-[#ff6b00]"
                    }`}
                  >
                    <User size={18} strokeWidth={2} />
                  </button>

                  {profileOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() => setProfileOpen(false)}
                      />
                      <div className="absolute top-[calc(100%+12px)] right-0 z-40 bg-white border border-[#e8e8e7] rounded-[14px] shadow-[0_12px_32px_rgba(0,0,0,0.1)] w-[320px]">
                        {/* Profile Header */}
                        <div className="p-4 border-b border-[#e8e8e7] bg-gradient-to-br from-[#fff4eb] to-white rounded-t-[14px]">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex-1">
                              <div className="text-[15px] font-bold text-[#111110] mb-1">
                                {user?.name}
                              </div>
                              <div className="text-[12px] text-[#6b7280] flex items-center gap-1">
                                <Mail size={12} />
                                {user?.email}
                              </div>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-[#ff6b00] to-[#ff8c00] rounded-[10px] flex items-center justify-center text-white flex-shrink-0">
                              <User size={20} strokeWidth={2} />
                            </div>
                          </div>
                          <Link
                            to="/profile"
                            onClick={() => setProfileOpen(false)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[8px] bg-white hover:bg-[#f7f7f6] text-[#ff6b00] text-[12px] font-semibold border-[1px] border-[#ff6b00] no-underline transition-all duration-150 w-full justify-center"
                          >
                            <Edit2 size={13} />
                            Edit Profile
                          </Link>
                        </div>

                        {/* Address Section */}
                        <div className="p-4 border-b border-[#e8e8e7]">
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-[12px] font-bold uppercase tracking-wide text-[#6b7280]">
                              Delivery Address
                            </div>

                            <Link
                              to="/profile"
                              onClick={() => setProfileOpen(false)}
                              className="text-[11px] font-semibold text-[#ff6b00] hover:text-[#e65f00] no-underline transition-colors"
                            >
                              Change
                            </Link>
                          </div>

                          <div className="bg-[#f7f7f6] rounded-[10px] p-3 space-y-2">
                            <div className="flex items-start gap-2.5">
                              <MapPin
                                size={14}
                                className="text-[#ff6b00] flex-shrink-0 mt-0.5"
                              />

                              <div className="flex-1 min-w-0">
                                {defaultAddress ? (
                                  <>
                                    <div className="text-[11px] font-bold text-[#ff6b00] uppercase mb-1">
                                      {defaultAddress.label}
                                    </div>

                                    <div className="text-[13px] font-semibold text-[#111110] line-clamp-2">
                                      {defaultAddress.addressLine}
                                    </div>

                                    <div className="text-[12px] text-[#6b7280]">
                                      {defaultAddress.city},{" "}
                                      {defaultAddress.state} -{" "}
                                      {defaultAddress.postalCode}
                                    </div>
                                  </>
                                ) : (
                                  <div className="text-[12px] text-[#9ca3af]">
                                    No default address selected
                                  </div>
                                )}
                              </div>
                            </div>

                            {defaultAddress && (
                              <>
                                <div className="flex items-center gap-2.5">
                                  <User
                                    size={14}
                                    className="text-[#6b7280] flex-shrink-0"
                                  />

                                  <span className="text-[12px] text-[#6b7280]">
                                    {defaultAddress.fullName}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2.5">
                                  <Phone
                                    size={14}
                                    className="text-[#6b7280] flex-shrink-0"
                                  />

                                  <span className="text-[12px] text-[#6b7280]">
                                    {defaultAddress.phone}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2 space-y-1">
                          <Link
                            to="/my-orders"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-[10px] text-[13px] font-medium text-[#374151] no-underline hover:bg-[#f7f7f6] hover:text-[#ff6b00] transition-all duration-150"
                          >
                            <Package size={16} className="flex-shrink-0" />
                            My Orders
                          </Link>

                          <Link
                            to="/profile"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-[10px] text-[13px] font-medium text-[#374151] no-underline hover:bg-[#f7f7f6] hover:text-[#ff6b00] transition-all duration-150"
                          >
                            <User size={16} className="flex-shrink-0" />
                            Account Settings
                          </Link>

                          <Link
                            to="/favorites"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-[10px] text-[13px] font-medium text-[#374151] no-underline hover:bg-[#f7f7f6] hover:text-[#ff6b00] transition-all duration-150"
                          >
                            <Tag size={16} className="flex-shrink-0" />
                            Favorites
                          </Link>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-[#e8e8e7]" />

                        {/* Logout Button */}
                        <div className="p-2">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-[10px] text-[13px] font-semibold border-none cursor-pointer transition-all duration-150 bg-transparent hover:bg-[#fef2f2] text-[#ef4444] hover:text-[#dc2626]"
                          >
                            <LogOut size={16} strokeWidth={2} />
                            Logout
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── MOBILE BOTTOM NAV (USER only) ── */}
      {token && user?.role === "USER" && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#e8e8e7] flex shadow-xl">
          <Link
            to="/"
            className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-3 px-2 no-underline text-[11px] font-medium transition-colors duration-200 ${
              active("/")
                ? "text-[#ff6b00]"
                : "text-[#9ca3af] hover:text-[#ff6b00]"
            }`}
          >
            <UtensilsCrossed size={22} strokeWidth={active("/") ? 2.5 : 2} />
            Home
          </Link>

          <Link
            to="/my-orders"
            className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-3 px-2 no-underline text-[11px] font-medium transition-colors duration-200 ${
              active("/my-orders")
                ? "text-[#ff6b00]"
                : "text-[#9ca3af] hover:text-[#ff6b00]"
            }`}
          >
            <Package size={22} strokeWidth={active("/my-orders") ? 2.5 : 2} />
            Orders
          </Link>

          <Link
            to="/companies"
            className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-3 px-2 no-underline text-[11px] font-medium transition-colors duration-200 ${
              active("/companies")
                ? "text-[#ff6b00]"
                : "text-[#9ca3af] hover:text-[#ff6b00]"
            }`}
          >
            <Building2 size={22} strokeWidth={active("/companies") ? 2.5 : 2} />
            <span className="text-[10px]">Restaurants</span>
          </Link>

          <Link
            to="/checkout"
            className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-3 px-2 no-underline text-[11px] font-medium transition-colors duration-200 relative ${
              active("/checkout")
                ? "text-[#ff6b00]"
                : "text-[#9ca3af] hover:text-[#ff6b00]"
            }`}
          >
            <span className="relative">
              <ShoppingCart
                size={22}
                strokeWidth={active("/checkout") ? 2.5 : 2}
              />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-[#ff6b00] text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
                  {cartCount > 99 ? "99" : cartCount}
                </span>
              )}
            </span>
            Cart
          </Link>

          <button
            onClick={() => setProfileOpen((v) => !v)}
            className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-3 px-2 no-underline text-[11px] font-medium transition-colors duration-200 border-none bg-transparent cursor-pointer ${
              profileOpen
                ? "text-[#ff6b00]"
                : "text-[#9ca3af] hover:text-[#ff6b00]"
            }`}
          >
            <User size={22} strokeWidth={profileOpen ? 2.5 : 2} />
            Profile
          </button>
        </div>
      )}

      {/* Add bottom padding for mobile nav */}
      {token && user?.role === "USER" && <div className="lg:hidden h-20" />}
    </>
  );
};

export default Navbar;
