import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CompanyLayout from "../../layouts/CompanyLayout";
import {
  getPlans,
  upgradePlan,
  getMySubscription,
} from "../../services/subscriptionService";

const Plans = () => {

  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */
  const fetchPlans = async () => {
    try {
      const planRes = await getPlans();
      const myPlanRes = await getMySubscription();

      setPlans(planRes.data);
      setCurrentPlan(myPlanRes.data);

    } catch {
      toast.error("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  /* ================= UPGRADE ================= */
  const handleUpgrade = async (id) => {
    try {
      await upgradePlan(id);

      toast.success("Plan activated successfully!");
      fetchPlans();

    } catch (err) {

      const msg = err?.response?.data?.message;

      if (msg === "Trial already used") {
        toast.info("Trial expired. You can continue with this plan.");
      } else if (msg === "Plan already exists") {
        toast.info("You are already using this plan.");
      } else {
        toast.error(msg || "Upgrade failed");
      }
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <CompanyLayout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <h1 className="text-3xl font-bold text-orange-500">
            Loading Plans...
          </h1>
        </div>
      </CompanyLayout>
    );
  }

  return (
    <CompanyLayout>

      <div className="space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-5xl font-black">
            Subscription Plans
          </h1>

          <p className="text-lg text-gray-500 mt-2">
            View and upgrade your plan
          </p>
        </div>

        {/* NO PLANS */}
        {plans.length === 0 ? (
          <p className="text-gray-500">
            No subscription plans available
          </p>
        ) : (

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

            {plans.map((plan) => {

              /* ================= FIXED LOGIC ================= */
              const isExpired =
                currentPlan &&
                new Date(currentPlan.expiryDate) < new Date();

              const isCurrent =
                currentPlan?.planName === plan.name && !isExpired;

              const isSamePlan =
                currentPlan?.planName === plan.name;

              return (
                <div
                  key={plan.id}
                  className={`bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition ${
                    isCurrent ? "ring-2 ring-orange-500" : ""
                  }`}
                >

                  {/* PLAN NAME */}
                  <h2 className="text-2xl font-bold">
                    {plan.name}
                  </h2>

                  {/* BADGE */}
                  {isCurrent && (
                    <span className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full mt-2 inline-block">
                      Current Plan
                    </span>
                  )}

                  {/* DESCRIPTION */}
                  <p className="text-gray-500 mt-2">
                    {plan.description || "No description"}
                  </p>

                  {/* DETAILS */}
                  <div className="mt-5 space-y-2">

                    <p className="font-semibold">
                      Price: ₹{plan.price}
                    </p>

                    <p className="font-semibold">
                      Max Foods: {plan.maxFoods === -1 ? "Unlimited" : plan.maxFoods}
                    </p>

                    <p className="font-semibold">
                      Max Orders: {plan.maxOrders === -1 ? "Unlimited" : plan.maxOrders}
                    </p>

                    <p className="font-semibold">
                      Duration: {plan.durationDays} days
                    </p>

                  </div>

                  {/* EXPIRY INFO */}
                  {isSamePlan && !isExpired && (
                    <p className="text-xs text-gray-500 mt-3">
                      Expires on:{" "}
                      {new Date(currentPlan.expiryDate).toLocaleDateString()}
                    </p>
                  )}

                  {isSamePlan && isExpired && (
                    <p className="text-xs text-red-500 mt-3">
                      Plan expired — renew now
                    </p>
                  )}

                  {/* BUTTON */}
                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isCurrent}
                    className={`mt-6 w-full py-3 rounded-xl font-semibold ${
                      isCurrent
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-orange-500 text-white hover:bg-orange-600"
                    }`}
                  >
                    {isCurrent
                      ? "Current Plan"
                      : isSamePlan && isExpired
                      ? "Renew Plan"
                      : "Upgrade Plan"}
                  </button>

                </div>
              );
            })}

          </div>

        )}

      </div>

    </CompanyLayout>
  );
};

export default Plans;