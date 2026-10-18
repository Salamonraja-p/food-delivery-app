import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
  getAllSubscriptions,
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
} from "../../services/subscriptionService";
import { toast } from "react-toastify";

const Subscriptions = () => {
  const [activeTab, setActiveTab] = useState("PLANS");

  const [plans, setPlans] = useState([]);
  const [subs, setSubs] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    maxFoods: "",
    maxOrders: "",
    durationDays: "",
    trialDays: "",
    allowOffer: false,
  });

  /* ================= FETCH ================= */
  const fetchData = async () => {
    try {
      if (activeTab === "PLANS") {
        const planRes = await getPlans();
        setPlans(planRes.data);
      }

      if (activeTab === "COMPANIES") {
        const subRes = await getAllSubscriptions(page, 6, search);
        setSubs(subRes.data);
        setTotalPages(subRes.pagination.totalPages);
      }
    } catch {
      toast.error("Failed to load data");
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, activeTab, search]);

  useEffect(() => {
    setPage(1);
  }, [activeTab, search]);

  /* ================= FORM ================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      maxFoods: "",
      maxOrders: "",
      durationDays: "",
      trialDays: "",
      allowOffer: false,
    });
    setIsEditing(false);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        maxFoods: Number(form.maxFoods),
        maxOrders: Number(form.maxOrders),
        durationDays: Number(form.durationDays),
        trialDays: Number(form.trialDays),
      };

      if (isEditing) {
        await updatePlan(editId, payload);
        toast.success("Plan Updated");
      } else {
        await createPlan(payload);
        toast.success("Plan Created");
      }

      resetForm();
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error");
    }
  };

  const handleEdit = (plan) => {
    setForm({
      name: plan.name || "",
      description: plan.description || "",
      price: plan.price || "",
      maxFoods: plan.maxFoods || "",
      maxOrders: plan.maxOrders || "",
      durationDays: plan.durationDays || "",
      trialDays: plan.trialDays || "",
      allowOffer: plan.allowOffer || false,
    });

    setIsEditing(true);
    setEditId(plan.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this plan?")) return;

    try {
      await deletePlan(id);
      toast.success("Plan Deleted");
      fetchData();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <h1 className="text-4xl font-black">Subscription Management</h1>

        {/* TABS */}
        <div className="flex gap-3">
          {["PLANS", "COMPANIES"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl font-semibold ${
                activeTab === tab ? "bg-orange-500 text-white" : "bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ================= PLANS ================= */}
        {activeTab === "PLANS" && (
          <>
            {/* FORM */}
            <div className="bg-white p-6 rounded-3xl">
              <h2 className="text-xl font-bold mb-4">
                {isEditing ? "Edit Plan" : "Create Plan"}
              </h2>

              <form
                onSubmit={handleSubmit}
                className="grid md:grid-cols-2 gap-4"
              >
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className="p-3 bg-gray-100 rounded"
                />
                <input
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Description"
                  className="p-3 bg-gray-100 rounded"
                />

                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Price"
                  className="p-3 bg-gray-100 rounded"
                />
                <input
                  type="number"
                  name="maxFoods"
                  value={form.maxFoods}
                  onChange={handleChange}
                  placeholder="Max Foods"
                  className="p-3 bg-gray-100 rounded"
                />

                <input
                  type="number"
                  name="maxOrders"
                  value={form.maxOrders}
                  onChange={handleChange}
                  placeholder="Max Orders"
                  className="p-3 bg-gray-100 rounded"
                />
                <input
                  type="number"
                  name="durationDays"
                  value={form.durationDays}
                  onChange={handleChange}
                  placeholder="Duration Days"
                  className="p-3 bg-gray-100 rounded"
                />

                <input
                  type="number"
                  name="trialDays"
                  value={form.trialDays}
                  onChange={handleChange}
                  placeholder="Trial Days"
                  className="p-3 bg-gray-100 rounded"
                />

                <label className="flex items-center gap-2 col-span-2">
                  <input
                    type="checkbox"
                    name="allowOffer"
                    checked={form.allowOffer}
                    onChange={handleChange}
                  />
                  Allow Offers
                </label>

                <div className="col-span-2 flex gap-3">
                  <button className="bg-orange-500 text-white px-5 py-2 rounded-xl">
                    {isEditing ? "Update" : "Create"}
                  </button>

                  {isEditing && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="bg-gray-300 px-5 py-2 rounded-xl"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* PLAN CARDS */}
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div key={plan.id} className="bg-white p-6 rounded-3xl">
                  <h3 className="font-bold text-lg">{plan.name}</h3>
                  <p className="text-gray-500">{plan.description}</p>

                  <p className="mt-2 font-semibold text-orange-600">
                    ₹{plan.price}
                  </p>

                  <div className="mt-3 text-sm space-y-1">
                    <p>Foods: {plan.maxFoods}</p>
                    <p>Orders: {plan.maxOrders}</p>
                    <p>Duration: {plan.durationDays} days</p>
                  </div>

                  <div className="mt-5 flex gap-3">
                    <button
                      onClick={() => handleEdit(plan)}
                      className="flex-1 py-2 rounded-xl bg-orange-500 text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(plan.id)}
                      className="flex-1 py-2 rounded-xl bg-red-500 text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ================= COMPANIES ================= */}
        {activeTab === "COMPANIES" && (
          <div className="space-y-6">
            {/* HEADER WITH SEARCH RIGHT */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Company Subscriptions</h2>

              <input
                type="text"
                placeholder="Search company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  px-4 py-2
                  rounded-xl
                  bg-white
                  border border-[var(--color-border)]
                  outline-none
                  w-[300px]
                "
              />
            </div>

            {/* CARDS */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {subs.map((sub) => {
                const now = new Date();
                const expiry = new Date(sub.expiryDate);
                const start = new Date(sub.startDate);

                const daysLeft = Math.ceil(
                  (expiry - now) / (1000 * 60 * 60 * 24),
                );

                const isActive = daysLeft > 0;

                return (
                  <div key={sub.id} className="p-6 bg-white rounded-3xl">
                    <h2 className="font-bold text-lg">{sub.company?.name}</h2>

                    <p className="text-gray-500">{sub.planName}</p>

                    <p className="text-green-600 font-bold mt-2">
                      ₹{sub.price}
                    </p>

                    <div className="mt-3 text-sm">
                      <p>Start: {start.toLocaleDateString()}</p>
                      <p>Expiry: {expiry.toLocaleDateString()}</p>
                    </div>

                    <div className="mt-3">
                      {isActive ? (
                        <span className="text-green-600">
                          Active ({daysLeft} days)
                        </span>
                      ) : (
                        <span className="text-red-500">Expired</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* PAGINATION */}
            <div className="flex justify-center gap-3 mt-6">
              {/* PREV */}
              <button
                onClick={() => page > 1 && setPage(page - 1)}
                disabled={page === 1}
                className={`px-4 py-2 rounded-xl ${
                  page === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                Prev
              </button>

              {/* PAGE NUMBERS */}
              {[...Array(totalPages || 1)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-4 py-2 rounded-xl ${
                    page === i + 1
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              {/* NEXT */}
              <button
                onClick={() => page < totalPages && setPage(page + 1)}
                disabled={page === totalPages || totalPages === 0}
                className={`px-4 py-2 rounded-xl ${
                  page === totalPages || totalPages === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Subscriptions;
