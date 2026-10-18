import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  Users,
  Building2,
  CheckCircle2,
  XCircle,
  ClipboardList,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  IndianRupee,
  Layers,
  BarChart3,
} from "lucide-react";

import AdminLayout from "../../layouts/AdminLayout";
import { getDashboardData } from "../../services/superAdminService";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const data = await getDashboardData();
      setDashboard(data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <h1 className="text-3xl font-black text-orange-500">
            Loading Dashboard...
          </h1>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-10">

        {/* HEADER */}
        <div>
          <h1 className="text-5xl font-black">
            Super Admin Dashboard
          </h1>
          
        </div>

        {/* ================= USERS & COMPANIES ================= */}
        <div>
          <h2 className="text-xl font-bold mb-4">Users & Companies</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
            <Card icon={<Users />} title="Users" value={dashboard.totalUsers} />
            <Card icon={<Building2 />} title="Companies" value={dashboard.totalCompanies} />
            <Card icon={<CheckCircle2 />} title="Approved" value={dashboard.approvedCompanies} />
            <Card icon={<ClipboardList />} title="Pending" value={dashboard.pendingCompanies} />
            <Card icon={<XCircle />} title="Rejected" value={dashboard.rejectedCompanies} />
          </div>
        </div>

        {/* ================= SUBSCRIPTIONS ================= */}
        <div>
          <h2 className="text-xl font-bold mb-4">Subscriptions</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <Card icon={<CreditCard />} title="Total" value={dashboard.totalSubscriptions} />
            <Card icon={<TrendingUp />} title="Active" value={dashboard.activeSubscriptions} />
            <Card icon={<AlertTriangle />} title="Expired" value={dashboard.expiredSubscriptions} />
            <Card icon={<Layers />} title="Plans" value={dashboard.totalPlans} />
          </div>
        </div>

        {/* ================= REVENUE ================= */}
        <div>
          <h2 className="text-xl font-bold mb-4">Revenue</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <Card
              icon={<IndianRupee />}
              title="This Month"
              value={`₹${dashboard.currentMonthRevenue || 0}`}
            />
            <Card
              icon={<BarChart3 />}
              title="Overall"
              value={`₹${dashboard.overallRevenue || 0}`}
            />
            <Card
              icon={<TrendingUp />}
              title="Average"
              value={`₹${dashboard.avgRevenue || 0}`}
            />
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

/* ================= CARD COMPONENT ================= */
const Card = ({ icon, title, value }) => {
  return (
    <div className="bg-white p-6 rounded-3xl shadow hover:shadow-lg transition">
      <div className="text-orange-500 mb-3">{icon}</div>
      <h2 className="text-gray-500">{title}</h2>
      <h1 className="text-4xl font-bold mt-2">
        {value || 0}
      </h1>
    </div>
  );
};

export default AdminDashboard;