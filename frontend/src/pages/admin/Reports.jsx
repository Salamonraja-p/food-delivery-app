import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import {
  Building2,
  CreditCard,
  BarChart3,
  PieChart,
  ClipboardList,
} from "lucide-react";

const Reports = () => {

  const navigate = useNavigate();

  const cards = [
    {
      title: "Company Reports",
      desc: "Analyze company revenue & subscriptions",
      icon: <Building2 size={40} />,
      path: "/admin/reports/company",
      color: "text-orange-500",
      bg: "bg-orange-100",
    },
    {
      title: "Subscription Insights",
      desc: "Track active, expired & trial usage",
      icon: <CreditCard size={40} />,
      path: "/admin/reports/subscriptions",
      color: "text-blue-500",
      bg: "bg-blue-100",
    },

  ];

  return (
    <AdminLayout>

      <div className="space-y-10">

        {/* HEADER */}
        <div>
          <h1 className="text-5xl font-black text-[var(--color-text)]">
            Reports
          </h1>

          <p className="text-[var(--color-text-light)] mt-3">
            Business insights & analytics overview
          </p>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {cards.map((card, index) => (

            <div
              key={index}
              onClick={() => navigate(card.path)}
              className="
                bg-white
                p-8
                rounded-3xl
                border border-[var(--color-border)]
                cursor-pointer
                hover:shadow-xl
                hover:-translate-y-1
                transition-all
                duration-300
              "
            >

              {/* ICON */}
              <div className={`
                w-16 h-16
                rounded-2xl
                flex items-center justify-center
                ${card.bg}
                ${card.color}
                mb-6
              `}>
                {card.icon}
              </div>

              {/* TITLE */}
              <h2 className="text-2xl font-black text-[var(--color-text)]">
                {card.title}
              </h2>

              {/* DESC */}
              <p className="text-[var(--color-text-light)] mt-2">
                {card.desc}
              </p>

              {/* CTA */}
              <div className="mt-6 text-sm font-semibold text-[var(--color-primary)]">
                View Report →
              </div>

            </div>

          ))}

        </div>

      </div>

    </AdminLayout>
  );
};

export default Reports;