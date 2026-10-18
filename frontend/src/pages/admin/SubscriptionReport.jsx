import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { getSubscriptionsReport } from "../../services/superAdminService";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SubscriptionReport = () => {
  const [data, setData] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const navigate = useNavigate();

  /* ================= FETCH ================= */
  const fetchData = async () => {
    try {
      const res = await getSubscriptionsReport(page, search, fromDate, toDate);

      setData(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search, fromDate, toDate]);

  /* ================= PAGINATION ================= */
  const visiblePages = page === 1 ? [1] : page === 2 ? [1, 2] : [1, 2, 3];
  const handlePrev = () => page > 1 && setPage(page - 1);
  const handleNext = () => page < totalPages && setPage(page + 1);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* HEADER + FILTER */}
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          <div>
            <button
              onClick={() => navigate("/admin/reports")}
              className="mb-4 flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-gray-200 hover:bg-orange-50 transition"
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <h1 className="text-5xl font-black text-[var(--color-text)]">
              Subscription Reports
            </h1>
          </div>

          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-gray-100">
            <span className="text-sm text-gray-500">From</span>

            <input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setPage(1);
                setFromDate(e.target.value);
              }}
              className="px-3 py-2 w-40 bg-gray-100 rounded-xl text-sm"
            />

            <span className="text-sm text-gray-500">To</span>

            <input
              type="date"
              value={toDate}
              onChange={(e) => {
                setPage(1);
                setToDate(e.target.value);
              }}
              className="px-3 py-2 bg-gray-100 rounded-xl"
            />
          </div>
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

        {/* TABLE (NO BLACK LINES) */}
        <div className="bg-white rounded-3xl shadow-lg p-4">
          <table className="w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-gray-500 text-sm">
                <th className="p-3 text-left">Company</th>
                <th className="p-3 text-center">Plan</th>
                <th className="p-3 text-center">Price</th>
                <th className="p-3 text-center">Type</th>
                <th className="p-3 text-center">Start</th>
                <th className="p-3 text-center">Expiry</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>

            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-6 text-center">
                    No data found
                  </td>
                </tr>
              ) : (
                data.map((item, i) => (
                  <tr
                    key={i}
                    className="
                      bg-gray-50
                      hover:bg-orange-50
                      transition
                      rounded-2xl
                      shadow-sm
                    "
                  >
                    <td className="p-4 font-semibold rounded-l-2xl">
                      {item.companyName}
                    </td>

                    <td className="p-4 text-center">{item.planName}</td>

                    <td className="p-4 text-center font-bold text-green-600">
                      ₹{item.price}
                    </td>

                    <td className="p-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          item.isTrial
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-200"
                        }`}
                      >
                        {item.isTrial ? "Trial" : "Paid"}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      {new Date(item.startDate).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-center">
                      {new Date(item.expiryDate).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-center rounded-r-2xl">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          new Date(item.expiryDate) > new Date()
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-500"
                        }`}
                      >
                        {new Date(item.expiryDate) > new Date()
                          ? "Active"
                          : "Expired"}
                      </span>
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

export default SubscriptionReport;
