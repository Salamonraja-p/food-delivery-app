import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getCompanyReport,
  getCompanyGraph,
  getCompanyChart,
} from "../../services/superAdminService";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#22c55e", "#ef4444"];

const CompanyReport = () => {
  const [data, setData] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [chartData, setChartData] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [view, setView] = useState("graph");
  const navigate = useNavigate();

  /* ================= FETCH ================= */
  const fetchAll = async () => {
    try {
      const tableRes = await getCompanyReport(page, search, fromDate, toDate);
      const graphRes = await getCompanyGraph(fromDate, toDate);
      const chartRes = await getCompanyChart(fromDate, toDate);

      setData(tableRes.data || []);
      setTotalPages(tableRes.pagination?.totalPages || 1);

      setGraphData(graphRes.data || []);
      setChartData(chartRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [page, search, fromDate, toDate]);

  /* ================= PAGINATION ================= */
  const visiblePages =
  page === 1
    ? [1]
    : page === 2
    ? [1, 2]
    : [1, 2, 3];
  const handlePrev = () => page > 1 && setPage(page - 1);
  const handleNext = () => page < totalPages && setPage(page + 1);

  /* ================= SUMMARY ================= */
  const totalRevenue = data.reduce((a, b) => a + (b.totalRevenue || 0), 0);
  const activeCount = data.filter((d) => d.status === "Active").length;
  const expiredCount = data.filter((d) => d.status === "Expired").length;

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div>
            <button
              onClick={() => navigate("/admin/reports")}
              className="mb-4 flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-[var(--color-border)] hover:bg-[var(--color-orange-soft)] transition"
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <h1 className="text-5xl font-black text-[var(--color-text)]">
              Company Reports
            </h1>

            {/* TOGGLE */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setView("graph")}
                className={`px-6 py-2 rounded-full font-semibold transition ${
                  view === "graph"
                    ? "bg-orange-500 text-white shadow"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                Graph
              </button>

              <button
                onClick={() => setView("chart")}
                className={`px-6 py-2 rounded-full font-semibold transition ${
                  view === "chart"
                    ? "bg-orange-500 text-white shadow"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                Chart
              </button>
            </div>
          </div>

          {/* FILTER */}
          <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100 w-fit">
            <span className="text-sm text-gray-500">From</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setPage(1);
                setFromDate(e.target.value);
              }}
              className="px-3 py-2 w-36 bg-gray-100 rounded-xl text-sm"
            />

            <span className="text-sm text-gray-500">To</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => {
                setPage(1);
                setToDate(e.target.value);
              }}
              className="px-3 py-2 w-40 bg-gray-100 rounded-xl text-sm"
            />
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow">
            <p className="text-gray-500">Companies</p>
            <h2 className="text-2xl font-bold">{data.length}</h2>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow">
            <p className="text-gray-500">Revenue</p>
            <h2 className="text-2xl font-bold text-green-600">
              ₹{totalRevenue}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow">
            <p className="text-gray-500">Active</p>
            <h2 className="text-2xl font-bold text-green-600">{activeCount}</h2>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow">
            <p className="text-gray-500">Expired</p>
            <h2 className="text-2xl font-bold text-red-500">{expiredCount}</h2>
          </div>
        </div>

        {/* GRAPH / CHART */}
        <div className="bg-white p-6 rounded-3xl shadow border border-gray-100">
          {view === "graph" ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={graphData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % 2]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* SEARCH */}
        <div className="flex justify-end">
          <input
            type="text"
            placeholder="Search company..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="
              px-5 py-3
              bg-white
              border border-gray-200
              rounded-full
              w-72
              shadow-sm
              focus:outline-none
              focus:ring-2
              focus:ring-orange-400
            "
          />
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Company</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Subscriptions</th>
                <th className="p-4 text-center">Revenue</th>
              </tr>
            </thead>

            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-6 text-center">
                    No data
                  </td>
                </tr>
              ) : (
                data.map((item, i) => (
                  <tr
                    key={i}
                  className="border-b border-gray-100 hover:bg-orange-50 transition"
                  >
                    <td className="p-4 font-semibold">{item.companyName}</td>

                    <td className="p-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          item.status === "Active"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-500"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      {item.totalSubscriptions}
                    </td>

                    <td className="p-4 text-center font-bold text-green-600">
                      ₹{item.totalRevenue}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center items-center gap-3">
  <button
    onClick={handlePrev}
    disabled={page === 1}
    className={`px-5 py-2 rounded-full ${
      page === 1
        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
        : "bg-gray-100 hover:bg-gray-200"
    }`}
  >
    Prev
  </button>

  {visiblePages.map((pageNo) => (
    <button
      key={pageNo}
      onClick={() => setPage(pageNo)}
      className={`w-10 h-10 rounded-full ${
        page === pageNo
          ? "bg-orange-500 text-white"
          : "bg-gray-100 hover:bg-gray-200"
      }`}
    >
      {pageNo}
    </button>
  ))}

  <button
    onClick={handleNext}
    disabled={page === totalPages}
    className={`px-5 py-2 rounded-full ${
      page === totalPages
        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
        : "bg-gray-100 hover:bg-gray-200"
    }`}
  >
    Next
  </button>
</div>
      </div>
    </AdminLayout>
  );
};

export default CompanyReport;
