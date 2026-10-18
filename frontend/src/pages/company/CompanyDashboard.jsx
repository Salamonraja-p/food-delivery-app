import { useEffect, useState } from "react";
import CompanyLayout from "../../layouts/CompanyLayout";
import { toast } from "react-toastify";
import { getCompanyDashboardData } from "../../services/companyService";

import {
  IndianRupee,
  ShoppingBag,
  Clock3,
  UtensilsCrossed,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ReceiptText,
  TicketCheck,
  BellDot,
  CalendarClock,
  Soup,
  RotateCcw,
} from "lucide-react";

const CompanyDashboard = () => {
  const [dashboard, setDashboard] = useState({});

  const [loading, setLoading] = useState(true);

  /* ================= FILTERS ================= */

  const [filter, setFilter] = useState("today");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  /* ================= FETCH ================= */

  const fetchData = async () => {
    try {
      const res = await getCompanyDashboardData(filter, startDate, endDate);

      setDashboard(res.data || res);
    } catch {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter, startDate, endDate]);

  const handleResetFilters = () => {
    setFilter("today");
    setStartDate("");
    setEndDate("");
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <CompanyLayout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <h1 className="text-2xl font-black text-orange-500 animate-pulse">
            Loading Dashboard...
          </h1>
        </div>
      </CompanyLayout>
    );
  }

  /* ================= CARDS ================= */

  const cards = [
    {
      title: "Revenue",
      value: `₹${(dashboard.revenue || 0).toFixed(2)}`,
      icon: <IndianRupee size={20} />,
      color: "bg-orange-100 text-orange-500",
    },

    {
      title: "Total Orders",
      value: dashboard.totalOrders || 0,
      icon: <ReceiptText size={20} />,
      color: "bg-cyan-100 text-cyan-600",
    },

    {
      title: "Delivered",
      value: dashboard.delivered || 0,
      icon: <CheckCircle size={20} />,
      color: "bg-green-100 text-green-600",
    },

    {
      title: "Pending",
      value: dashboard.pending || 0,
      icon: <Clock3 size={20} />,
      color: "bg-yellow-100 text-yellow-600",
    },

    {
      title: "Rejected",
      value: dashboard.rejected || 0,
      icon: <XCircle size={20} />,
      color: "bg-red-100 text-red-500",
    },

    {
      title: "Active Orders",
      value: dashboard.active || 0,
      icon: <ShoppingBag size={20} />,
      color: "bg-blue-100 text-blue-600",
    },

    {
      title: "Raised Tickets",
      value: dashboard.raisedTickets || 0,
      icon: <BellDot size={20} />,
      color: "bg-pink-100 text-pink-600",
    },

    {
      title: "Solved Tickets",
      value: dashboard.solvedTickets || 0,
      icon: <TicketCheck size={20} />,
      color: "bg-emerald-100 text-emerald-600",
    },

    {
      title: "Unread Messages",
      value: dashboard.unreadMessages || 0,
      icon: <CalendarClock size={20} />,
      color: "bg-indigo-100 text-indigo-600",
    },

    {
      title: "Subscription Days",
      value: dashboard.subscriptionRemainingDays || 0,
      icon: <CalendarClock size={20} />,
      color: "bg-violet-100 text-violet-600",
    },

    {
      title: "Top Selling Food",
      value: dashboard.topSellingFood || "No Sales",
      icon: <Soup size={20} />,
      color: "bg-lime-100 text-lime-600",
    },

    {
      title: "Low Stock Foods",
      value: dashboard.lowStockFoods || 0,
      icon: <AlertTriangle size={20} />,
      color: "bg-amber-100 text-amber-600",
    },

    {
      title: "Total Foods",
      value: dashboard.totalFoods || 0,
      icon: <UtensilsCrossed size={20} />,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <CompanyLayout>
      <div className="space-y-6">
        {/* ================= TOP ================= */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          {/* LEFT */}

          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900">
              Company Dashboard
            </h1>

            <p className="text-gray-500 mt-1 text-sm md:text-base">
              Quick overview of your business performance
            </p>
          </div>

          {/* RIGHT FILTERS */}

          <div className="flex flex-col sm:flex-row gap-3">
            {/* QUICK FILTER */}

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="
                h-11
                px-4
                rounded-2xl
                border
                border-gray-200
                bg-white
                text-sm
                font-semibold
                outline-none
                focus:ring-2
                focus:ring-orange-300
              "
            >
              <option value="today">Today</option>

              <option value="yesterday">Yesterday</option>

              <option value="lastWeek">Last Week</option>

              <option value="thisMonth">This Month</option>

              <option value="thisYear">This Year</option>
            </select>

            {/* START DATE */}

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="
                h-11
                px-4
                rounded-2xl
                border
                border-gray-200
                bg-white
                text-sm
                font-semibold
                outline-none
                focus:ring-2
                focus:ring-orange-300
              "
            />

            {/* END DATE */}

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="
                h-11
                px-4
                rounded-2xl
                border
                border-gray-200
                bg-white
                text-sm
                font-semibold
                outline-none
                focus:ring-2
                focus:ring-orange-300
              "
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

        {/* ================= CARDS ================= */}

        <div
          className="
            grid
            grid-cols-2
            md:grid-cols-3
            xl:grid-cols-4
            gap-4
          "
        >
          {cards.map((card, index) => (
            <div
              key={index}
              className="
                relative
                overflow-hidden
                rounded-3xl
                bg-white
                border
                border-gray-100
                p-5
                shadow-sm
                hover:shadow-xl
                hover:-translate-y-1
                transition-all
                duration-300
              "
            >
              {/* GLOW */}

              <div
                className="
                  absolute
                  -top-10
                  -right-10
                  w-28
                  h-28
                  bg-orange-50
                  rounded-full
                  opacity-40
                "
              />

              {/* ICON */}

              <div
                className={`
                  relative
                  z-10
                  w-12
                  h-12
                  rounded-2xl
                  flex
                  items-center
                  justify-center
                  ${card.color}
                `}
              >
                {card.icon}
              </div>

              {/* CONTENT */}

              <div className="relative z-10 mt-5">
                <p
                  className="
                    text-sm
                    font-semibold
                    text-gray-500
                  "
                >
                  {card.title}
                </p>

                <h2
                  className="
                    mt-2
                    text-3xl
                    md:text-4xl
                    font-black
                    tracking-tight
                    text-gray-900
                    break-words
                  "
                >
                  {card.value}
                </h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CompanyLayout>
  );
};

export default CompanyDashboard;
