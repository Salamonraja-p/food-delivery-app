
import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { useAuth } from "../../context/AuthContext";
import { Plus, X, MapPin, Pencil, Trash2, CheckCircle, User, Mail } from "lucide-react";
 
import {
  addAddress,
  getMyAddresses,
  deleteAddress,
  setDefaultAddress,
  updateAddress,
} from "../../services/addressService";
 
import { toast } from "react-toastify";
 
const EMPTY_FORM = {
  label: "",
  fullName: "",
  phone: "",
  addressLine: "",
  city: "",
  state: "",
  postalCode: "",
};
 
const Profile = () => {
  const { user } = useAuth();
 
  const [addresses,  setAddresses]  = useState([]);
  const [editingId,  setEditingId]  = useState(null);
  const [showForm,   setShowForm]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form,       setForm]       = useState(EMPTY_FORM);
 
  /* ── Load ── */
  const loadAddresses = async () => {
    try {
      const res = await getMyAddresses();
      setAddresses(res.data || []);
    } catch {
      /* silent */
    }
  };
 
  useEffect(() => { loadAddresses(); }, []);
 
  /* ── Form helpers ── */
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
 
  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };
 
  const openEdit = (address) => {
    setEditingId(address.id);
    setForm({
      label:       address.label,
      fullName:    address.fullName,
      phone:       address.phone,
      addressLine: address.addressLine,
      city:        address.city,
      state:       address.state,
      postalCode:  address.postalCode,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
 
  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };
 
  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingId) {
        await updateAddress(editingId, form);
        toast.success("Address updated");
      } else {
        await addAddress(form);
        toast.success("Address added");
      }
      closeForm();
      loadAddresses();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };
 
  /* ── Delete ── */
  const handleDelete = async (id) => {
    try {
      await deleteAddress(id);
      toast.success("Address deleted");
      loadAddresses();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };
 
  /* ── Set default ── */
  const handleDefault = async (id) => {
    try {
      await setDefaultAddress(id);
      toast.success("Default address updated");
      loadAddresses();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };
 
  /* ── Avatar initials ── */
  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "U";
 
  return (
    <MainLayout>
      <div className="max-w-[1200px] mx-auto px-8 pt-10 pb-16 max-sm:px-4 max-sm:pt-6">
 
        {/* ══ USER CARD ══ */}
        <div className="bg-white border border-[#e8e8e7] rounded-[18px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-6 mb-8 flex items-center gap-5 max-sm:flex-col max-sm:text-center">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-[#ff6b00] flex items-center justify-center text-white font-display text-[22px] font-bold flex-shrink-0">
            {initials}
          </div>
          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-[22px] font-bold text-[#111110] tracking-[-0.02em] leading-tight">
              {user?.name || "User"}
            </h1>
            <div className="flex items-center gap-4 mt-1.5 max-sm:justify-center flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-[13px] text-[#6b7280]">
                <Mail size={13} strokeWidth={2} className="text-[#9ca3af]" />
                {user?.email || "—"}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.05em] uppercase px-2.5 py-[3px] rounded-full bg-[#fff4eb] text-[#ff6b00] border border-[#ffe0c7]">
                <User size={10} strokeWidth={2.5} />
                {user?.role || "User"}
              </span>
            </div>
          </div>
        </div>
 
        {/* ══ ADDRESSES SECTION ══ */}
        <div className="flex items-center justify-between mb-5 gap-3">
          <div>
            <h2 className="font-display text-[20px] font-bold text-[#111110] tracking-[-0.02em]">
              Saved Addresses
            </h2>
            <p className="text-[13px] text-[#9ca3af] mt-0.5">
              {addresses.length} {addresses.length === 1 ? "address" : "addresses"} saved
            </p>
          </div>
 
          {/* ── ADD ADDRESS button — only trigger ── */}
          {!showForm && (
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 h-9 px-4 rounded-[10px] bg-[#111110] text-white border-[1.5px] border-[#111110] font-body text-[13px] font-semibold cursor-pointer hover:bg-[#ff6b00] hover:border-[#ff6b00] transition-all duration-150 flex-shrink-0"
            >
              <Plus size={14} strokeWidth={2.5} />
              Add Address
            </button>
          )}
        </div>
 
        {/* ══ INLINE FORM (slide-in) ══ */}
        {showForm && (
          <div className="bg-white border border-[#e8e8e7] rounded-[18px] shadow-[0_4px_12px_rgba(0,0,0,0.07)] mb-6 overflow-hidden">
 
            {/* Form header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e7] bg-[#f7f7f6]">
              <h3 className="font-display text-[16px] font-bold text-[#111110] tracking-[-0.01em]">
                {editingId ? "Edit Address" : "New Address"}
              </h3>
              <button
                onClick={closeForm}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-transparent border-none cursor-pointer text-[#9ca3af] hover:bg-[#e8e8e7] hover:text-[#111110] transition-colors duration-150"
              >
                <X size={16} strokeWidth={2} />
              </button>
            </div>
 
            {/* Form body */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
 
                {/* Label */}
                <div className="col-span-2 max-sm:col-span-1">
                  <label className="block text-[12px] font-semibold text-[#6b7280] uppercase tracking-[0.06em] mb-1.5">
                    Label
                  </label>
                  <input
                    type="text"
                    name="label"
                    placeholder="Home / Office / Other"
                    value={form.label}
                    onChange={handleChange}
                    required
                    className="block w-full h-10 px-3.5 bg-[#f7f7f6] border-[1.5px] border-[#e8e8e7] rounded-[10px] font-body text-[13.5px] text-[#111110] outline-none focus:bg-white focus:border-[#ff6b00] focus:shadow-[0_0_0_3px_rgba(255,107,0,0.1)] transition-all duration-150 placeholder:text-[#b4b4b2]"
                  />
                </div>
 
                {/* Full name */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#6b7280] uppercase tracking-[0.06em] mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    className="block w-full h-10 px-3.5 bg-[#f7f7f6] border-[1.5px] border-[#e8e8e7] rounded-[10px] font-body text-[13.5px] text-[#111110] outline-none focus:bg-white focus:border-[#ff6b00] focus:shadow-[0_0_0_3px_rgba(255,107,0,0.1)] transition-all duration-150 placeholder:text-[#b4b4b2]"
                  />
                </div>
 
                {/* Phone */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#6b7280] uppercase tracking-[0.06em] mb-1.5">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="+91 00000 00000"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="block w-full h-10 px-3.5 bg-[#f7f7f6] border-[1.5px] border-[#e8e8e7] rounded-[10px] font-body text-[13.5px] text-[#111110] outline-none focus:bg-white focus:border-[#ff6b00] focus:shadow-[0_0_0_3px_rgba(255,107,0,0.1)] transition-all duration-150 placeholder:text-[#b4b4b2]"
                  />
                </div>
 
                {/* Address line */}
                <div className="col-span-2 max-sm:col-span-1">
                  <label className="block text-[12px] font-semibold text-[#6b7280] uppercase tracking-[0.06em] mb-1.5">
                    Address
                  </label>
                  <textarea
                    name="addressLine"
                    placeholder="Street, building, flat no…"
                    value={form.addressLine}
                    onChange={handleChange}
                    rows={2}
                    required
                    className="block w-full px-3.5 py-2.5 bg-[#f7f7f6] border-[1.5px] border-[#e8e8e7] rounded-[10px] font-body text-[13.5px] text-[#111110] outline-none focus:bg-white focus:border-[#ff6b00] focus:shadow-[0_0_0_3px_rgba(255,107,0,0.1)] transition-all duration-150 placeholder:text-[#b4b4b2] resize-none"
                  />
                </div>
 
                {/* City */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#6b7280] uppercase tracking-[0.06em] mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={form.city}
                    onChange={handleChange}
                    required
                    className="block w-full h-10 px-3.5 bg-[#f7f7f6] border-[1.5px] border-[#e8e8e7] rounded-[10px] font-body text-[13.5px] text-[#111110] outline-none focus:bg-white focus:border-[#ff6b00] focus:shadow-[0_0_0_3px_rgba(255,107,0,0.1)] transition-all duration-150 placeholder:text-[#b4b4b2]"
                  />
                </div>
 
                {/* State */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#6b7280] uppercase tracking-[0.06em] mb-1.5">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={form.state}
                    onChange={handleChange}
                    required
                    className="block w-full h-10 px-3.5 bg-[#f7f7f6] border-[1.5px] border-[#e8e8e7] rounded-[10px] font-body text-[13.5px] text-[#111110] outline-none focus:bg-white focus:border-[#ff6b00] focus:shadow-[0_0_0_3px_rgba(255,107,0,0.1)] transition-all duration-150 placeholder:text-[#b4b4b2]"
                  />
                </div>
 
                {/* Postal code */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#6b7280] uppercase tracking-[0.06em] mb-1.5">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="000000"
                    value={form.postalCode}
                    onChange={handleChange}
                    required
                    className="block w-full h-10 px-3.5 bg-[#f7f7f6] border-[1.5px] border-[#e8e8e7] rounded-[10px] font-body text-[13.5px] text-[#111110] outline-none focus:bg-white focus:border-[#ff6b00] focus:shadow-[0_0_0_3px_rgba(255,107,0,0.1)] transition-all duration-150 placeholder:text-[#b4b4b2]"
                  />
                </div>
 
              </div>
 
              {/* Form actions */}
              <div className="flex items-center gap-3 mt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 h-10 px-6 rounded-[10px] bg-[#111110] text-white border-[1.5px] border-[#111110] font-body text-[13.5px] font-semibold cursor-pointer hover:bg-[#ff6b00] hover:border-[#ff6b00] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
                >
                  {submitting
                    ? (editingId ? "Saving…" : "Adding…")
                    : (editingId ? "Save Changes" : "Add Address")}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="inline-flex items-center h-10 px-5 rounded-[10px] border-[1.5px] border-[#d1d1cf] bg-white text-[#6b7280] font-body text-[13.5px] font-medium cursor-pointer hover:border-[#111110] hover:text-[#111110] transition-all duration-150"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
 
        {/* ══ ADDRESS CARDS ══ */}
        {addresses.length === 0 ? (
          <div className="text-center py-16 px-5">
            <div className="text-[48px] mb-3.5 opacity-40">📍</div>
            <div className="font-display text-[17px] font-bold text-[#6b7280] mb-1.5">No addresses yet</div>
            <div className="text-[13.5px] text-[#9ca3af]">Add an address to speed up checkout</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`bg-white border rounded-[18px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 flex flex-col gap-3 transition-all duration-150 ${
                  address.isDefault
                    ? "border-[#ff6b00] shadow-[0_0_0_3px_rgba(255,107,0,0.08)]"
                    : "border-[#e8e8e7] hover:shadow-[0_4px_12px_rgba(0,0,0,0.07)]"
                }`}
              >
                {/* Card top */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      address.isDefault ? "bg-[#fff4eb] text-[#ff6b00]" : "bg-[#f7f7f6] text-[#9ca3af]"
                    }`}>
                      <MapPin size={14} strokeWidth={2} />
                    </div>
                    <div>
                      <span className="font-display text-[15px] font-bold text-[#111110] tracking-[-0.01em]">
                        {address.label}
                      </span>
                      {address.isDefault && (
                        <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-bold tracking-[0.05em] uppercase text-[#ff6b00]">
                          <CheckCircle size={9} strokeWidth={3} /> Default
                        </span>
                      )}
                    </div>
                  </div>
 
                  {/* Actions */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {!address.isDefault && (
                      <button
                        onClick={() => handleDefault(address.id)}
                        title="Set as default"
                        className="h-7 px-2.5 rounded-[8px] border-[1.5px] border-[#e8e8e7] bg-white text-[11px] font-semibold text-[#6b7280] cursor-pointer hover:border-[#ff6b00] hover:text-[#ff6b00] hover:bg-[#fff4eb] transition-all duration-150 whitespace-nowrap"
                      >
                        Set default
                      </button>
                    )}
                    <button
                      onClick={() => openEdit(address)}
                      title="Edit"
                      className="w-7 h-7 rounded-[8px] border-[1.5px] border-[#e8e8e7] bg-white flex items-center justify-center text-[#6b7280] cursor-pointer hover:border-[#111110] hover:text-[#111110] hover:bg-[#f7f7f6] transition-all duration-150"
                    >
                      <Pencil size={12} strokeWidth={2} />
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      title="Delete"
                      className="w-7 h-7 rounded-[8px] border-[1.5px] border-[#e8e8e7] bg-white flex items-center justify-center text-[#9ca3af] cursor-pointer hover:border-[#ef4444] hover:text-[#ef4444] hover:bg-[#fef2f2] transition-all duration-150"
                    >
                      <Trash2 size={12} strokeWidth={2} />
                    </button>
                  </div>
                </div>
 
                {/* Address details */}
                <div className="text-[13px] text-[#6b7280] leading-[1.6] pl-[42px]">
                  <p className="font-medium text-[#111110]">{address.fullName}</p>
                  <p>{address.phone}</p>
                  <p className="mt-1">{address.addressLine}</p>
                  <p>{address.city}, {address.state} – {address.postalCode}</p>
                </div>
 
              </div>
            ))}
          </div>
        )}
 
      </div>
    </MainLayout>
  );
};
 
export default Profile;