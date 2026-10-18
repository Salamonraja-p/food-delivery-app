import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../services/authService";
import { getPlans } from "../../services/subscriptionService";
import burgerImage from "../../assets/burger.png";
import { toast } from "react-toastify";

const CompanyRegister = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(""); // ✅ FIXED

  const [error, setError] = useState("");

  /* ================= FETCH PLANS ================= */
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await getPlans();
        setPlans(res.data); // ✅ FIXED
      } catch {
        toast.error("Failed to load plans");
      }
    };

    fetchPlans();
  }, []);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPlan) {
      toast.error("Please select a plan");
      return;
    }

    try {
      await registerUser({
        ...form,
        role: "COMPANY",
        planId: Number(selectedPlan), // ✅ FIXED
      });

      toast.success("Registered successfully");
      navigate("/login");

    } catch (err) {
      const message =
        err?.response?.data?.message || "Registration failed";
      setError(message);
      toast.error(message);
    }
  };

  /* ================= SELECTED PLAN ================= */
  const selectedPlanData = plans?.find(
    (p) => p.id === Number(selectedPlan)
  );

  return (
    <div className="w-full min-h-screen bg-[var(--color-bg)] xl:flex xl:items-center xl:justify-center">

      <div className="w-full min-h-screen bg-[var(--color-card)] flex flex-col xl:flex-row xl:max-w-6xl xl:min-h-[90vh] xl:rounded-[28px] overflow-hidden shadow">

        {/* LEFT SIDE */}
        <div className="w-full xl:w-1/2 bg-[var(--color-primary)] relative flex items-end">

          <div className="absolute top-8 left-6 text-white">
            <h1 className="text-4xl font-black">Food</h1>
            <h1 className="text-4xl font-black">Delivery App</h1>
          </div>

          <img
            src={burgerImage}
            alt="burger"
            className="w-[150px] xl:w-[300px] ml-auto mr-4"
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full xl:w-1/2 flex items-center justify-center px-6 py-10">

          <div className="w-full max-w-[400px]">

            <h2 className="text-3xl font-black mb-3">
              Company Register
            </h2>

            <p className="text-gray-500 mb-6">
              Create your company account
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* NAME */}
              <input
                type="text"
                name="name"
                placeholder="Company Name"
                value={form.name}
                onChange={handleChange}
                required
                className="p-3 rounded-xl border"
              />

              {/* EMAIL */}
              <input
                type="email"
                name="email"
                placeholder="Company Email"
                value={form.email}
                onChange={handleChange}
                required
                className="p-3 rounded-xl border"
              />

              {/* PASSWORD */}
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="p-3 rounded-xl border"
              />

              {/* ================= PLAN DROPDOWN ================= */}
              <div>
                <label className="font-semibold mb-1 block">
                  Select Plan
                </label>

                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="w-full p-3 rounded-xl border"
                >
                  <option value="">-- Select Plan --</option>

                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} - ₹{plan.price}
                    </option>
                  ))}
                </select>
              </div>

              {/* ================= PLAN DETAILS ================= */}
              {selectedPlanData && (
                <div className="p-3 bg-gray-50 rounded-xl text-sm space-y-1">

                  <p><strong>Name:</strong> {selectedPlanData.name}</p>

                  <p><strong>Price:</strong> ₹{selectedPlanData.price}</p>

                  <p>
                    <strong>Max Foods:</strong>{" "}
                    {selectedPlanData.maxFoods === -1
                      ? "Unlimited"
                      : selectedPlanData.maxFoods}
                  </p>

                  <p>
                    <strong>Max Orders:</strong>{" "}
                    {selectedPlanData.maxOrders === -1
                      ? "Unlimited"
                      : selectedPlanData.maxOrders}
                  </p>

                  <p>
                    <strong>Duration:</strong>{" "}
                    {selectedPlanData.durationDays} days
                  </p>

                  {selectedPlanData.trialDays > 0 && (
                    <p className="text-green-600 font-semibold">
                      {selectedPlanData.trialDays} days free trial
                    </p>
                  )}

                </div>
              )}

              
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              
              <button
                type="submit"
                disabled={!selectedPlan}
                className="bg-orange-500 text-white py-3 rounded-xl font-bold disabled:opacity-50"
              >
                Register Company
              </button>

              {/* LOGIN */}
              <p className="text-center text-sm text-gray-500">
                Already have an account?
                <Link to="/login" className="text-orange-500 ml-1">
                  Sign in
                </Link>
              </p>

            </form>

          </div>
        </div>

      </div>
    </div>
  );
};

export default CompanyRegister;