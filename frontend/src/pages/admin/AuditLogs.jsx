import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminLayout from "../../layouts/AdminLayout";
import { getAuditLogs } from "../../services/superAdminService";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  /* ================= FETCH ================= */
  const fetchLogs = async () => {
    try {
      const res = await getAuditLogs(page, fromDate, toDate);

      setLogs(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch {
      toast.error("Failed to fetch logs");
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, fromDate, toDate]);

  /* ================= RESET PAGE ================= */
  useEffect(() => {
    setPage(1);
  }, [fromDate, toDate]);

  /* ================= PAGINATION ================= */
  const visiblePages = page === 1 ? [1] : page === 2 ? [1, 2] : [1, 2, 3];

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
  if (page < totalPages) {
    setPage(page + 1);
  }
};

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-5xl font-black text-[var(--color-text)]">
              Audit Logs
            </h1>

            <p className="mt-3 text-lg text-[var(--color-text-light)]">
              Platform activity tracking
            </p>
          </div>

          {/* DATE FILTER */}
          <div className="flex gap-3">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="px-4 py-2 rounded-xl bg-gray-100 outline-none"
            />

            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="px-4 py-2 rounded-xl bg-gray-100 outline-none"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto bg-white rounded-3xl">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="p-5 text-left">Action</th>
                <th className="p-5 text-left">Description</th>
                <th className="p-5 text-left">User</th>
                <th className="p-5 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-5 text-center">
                    No logs found
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-[var(--color-border)] hover:bg-[var(--color-orange-soft)] duration-200"
                  >
                    <td className="p-5 font-bold text-[var(--color-primary)]">
                      {log.action}
                    </td>

                    <td className="p-5">{log.description || "-"}</td>

                    <td className="p-5">{log.user?.email || "System"}</td>

                    <td className="p-5">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className={`px-4 py-2 rounded-xl ${
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
              className={`px-4 py-2 rounded-xl ${
                page === pageNo ? "bg-orange-500 text-white" : "bg-gray-100"
              }`}
            >
              {pageNo}
            </button>
          ))}

          <button
            onClick={handleNext}
            disabled={page === totalPages}
           className={`px-4 py-2 rounded-xl ${
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

export default AuditLogs;
