import { useEffect, useState } from "react";
import {
  getPendingCompanies,
  getApprovedCompanies,
  getRejectedCompanies,
  approveCompany,
  rejectCompany,
} from "../../services/superAdminService";

import AdminLayout from "../../layouts/AdminLayout";
import { toast } from "react-toastify";

const Companies = () => {
  const [tab, setTab] = useState("PENDING");
  const [companies, setCompanies] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");

  /* ================= FETCH ================= */
  const fetchCompanies = async () => {
    try {
      let res;

      if (tab === "PENDING") {
        res = await getPendingCompanies(page, search);
      } else if (tab === "APPROVED") {
        res = await getApprovedCompanies(page, search);
      } else {
        res = await getRejectedCompanies(page, search);
      }

      setCompanies(res?.data || []);
      setTotalPages(res?.pagination?.totalPages || 1);
    } catch {
      toast.error("Failed to fetch companies");
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [page, tab, search]);

  /* RESET PAGE */
  useEffect(() => {
    setPage(1);
  }, [tab, search]);

  /* ================= ACTIONS ================= */

  const handleApprove = async (id) => {
    const confirmAction = window.confirm(
      "Are you sure you want to approve this company?",
    );
    if (!confirmAction) return;

    try {
      await approveCompany(id);
      toast.success("Company approved");
      fetchCompanies();
    } catch {
      toast.error("Approval failed");
    }
  };

  const handleReject = async (id) => {
    const confirmAction = window.confirm(
      "Are you sure you want to reject this company?",
    );
    if (!confirmAction) return;

    try {
      await rejectCompany(id);
      toast.success("Company rejected");
      fetchCompanies();
    } catch {
      toast.error("Reject failed");
    }
  };

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
      <div className="p-8">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-black">Companies</h1>

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 px-5 rounded-2xl bg-[var(--color-card)] outline-none placeholder:text-gray-400"
          />
        </div>

        {/* TABS */}
        <div className="flex items-center gap-4 mb-10">
          {["PENDING", "APPROVED", "REJECTED"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-3 rounded-2xl font-semibold ${
                tab === t
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-card)]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* TABLE */}
        <div className="bg-[var(--color-card)] rounded-3xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="p-5 text-left">Name</th>
                <th className="p-5 text-left">Email</th>
                <th className="p-5 text-left">Status</th>
                <th className="p-5 text-left">
                  {tab === "PENDING" ? "Action" : "Time"}
                </th>
              </tr>
            </thead>

            <tbody>
              {companies.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-5 text-center">
                    No companies found
                  </td>
                </tr>
              ) : (
                companies.map((company) => (
                  <tr
                    key={company.id}
                    className="border-b border-[var(--color-border)]"
                  >
                    <td className="p-5 font-semibold">{company.name}</td>

                    <td className="p-5">{company.email}</td>

                    <td className="p-5">{company.approvalStatus}</td>

                    <td className="p-5">
                      {tab === "PENDING" ? (
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleApprove(company.id)}
                            className="bg-green-500 text-white px-4 py-2 rounded-xl"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() => handleReject(company.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded-xl"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">
                          {new Date(
                            company.approvedAt || company.rejectedAt,
                          ).toLocaleString("en-IN")}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION ALWAYS SHOW */}
        <div className="flex justify-center gap-3 mt-6">
          {/* PREV */}
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
          {/* PAGES */}
          {visiblePages.map((pageNo) => (
            <button
              key={pageNo}
              onClick={() => setPage(pageNo)}
              className={`px-4 py-2 rounded-xl ${
                page === pageNo
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {pageNo}
            </button>
          ))}

          {/* NEXT */}
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

export default Companies;
