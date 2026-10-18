import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CompanyLayout from "../../layouts/CompanyLayout";

import { getMySubscription } from "../../services/subscriptionService";

const MyPlan = () => {

  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPlan = async () => {
    try {
      const res = await getMySubscription();

      if (res.success) {
        setPlanData(res.data); // ✅ FIX
      } else {
        setPlanData(null);
      }

    } catch (err) {
      toast.error("Failed to load plan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  if (loading) {
    return (
      <CompanyLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          Loading...
        </div>
      </CompanyLayout>
    );
  }

  if (!planData) {
    return (
      <CompanyLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          No active subscription
        </div>
      </CompanyLayout>
    );
  }

  const daysLeft = Math.ceil(
    (new Date(planData.expiryDate) - new Date()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <CompanyLayout>
      <div className="space-y-6">

        <h1 className="text-4xl font-bold">
          My Subscription
        </h1>

        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="text-2xl font-bold">
            {planData.planName}
          </h2>

          <p className="mt-2 text-gray-500">
            {planData.description || "No description"}
          </p>

          <div className="mt-4 space-y-2">

            <p><strong>Price:</strong> ₹{planData.price}</p>

            <p>
              <strong>Max Foods:</strong>{" "}
              {planData.maxFoods === -1
                ? "Unlimited"
                : planData.maxFoods}
            </p>

            <p>
              <strong>Max Orders:</strong>{" "}
              {planData.maxOrders === -1
                ? "Unlimited"
                : planData.maxOrders}
            </p>

            <p>
              <strong>Offers:</strong>{" "}
              {planData.allowOffer ? "Allowed" : "Not Allowed"}
            </p>

            <p className="text-orange-500 font-semibold">
              {daysLeft > 0
                ? `${daysLeft} days left`
                : "Expired"}
            </p>

          </div>

        </div>

      </div>
    </CompanyLayout>
  );
};

export default MyPlan;