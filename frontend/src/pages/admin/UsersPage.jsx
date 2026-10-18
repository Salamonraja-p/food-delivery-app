import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Search,
  Users,
  Mail,
  ShieldCheck,
} from "lucide-react";

import AdminLayout from "../../layouts/AdminLayout";
import { getAllUsers } from "../../services/superAdminService";

const UsersPage = () => {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");

  /* ================= FETCH ================= */
  const fetchUsers = async () => {
    try {

      const res = await getAllUsers(page, search);

      setUsers(res?.data || []);
      setTotalPages(res?.pagination?.totalPages || 1);

    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        "Failed to fetch users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  /* ================= RESET PAGE ================= */
  useEffect(() => {
    setPage(1);
  }, [search]);

  /* ================= PAGINATION ================= */
  const visiblePages = Array.from(
  { length: Math.min(totalPages, 3) },
  (_, i) => i + 1
);
  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <h1 className="text-3xl font-black text-[var(--color-primary)]">
            Loading Users...
          </h1>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>

      <div className="space-y-8">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          <div>
            <h1 className="text-5xl font-black text-[var(--color-text)]">
              Users
            </h1>

            <p className="mt-3 text-lg text-[var(--color-text-light)]">
              Manage all platform users
            </p>
          </div>

          {/* SEARCH */}
          <div className="relative w-full lg:w-[350px]">

            <Search
              size={20}
              className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full
                pl-12
                pr-4
                py-4
                rounded-2xl
                outline-none
                bg-white
              "
            />

          </div>

        </div>

        {/* STATS */}
        <div className="bg-white rounded-3xl p-7">

          <div className="flex items-center gap-4">

            <div className="w-16 h-16 rounded-2xl bg-[var(--color-orange-soft)] flex items-center justify-center text-[var(--color-primary)]">
              <Users size={30} />
            </div>

            <div>
              <h2 className="text-[var(--color-text-light)]">
                Total Users
              </h2>

              <h1 className="text-5xl font-black text-[var(--color-text)]">
                {users.length}
              </h1>
            </div>

          </div>

        </div>

        {/* TABLE */}
        <div className="overflow-x-auto bg-white rounded-3xl">

          <table className="w-full">

            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left p-5">User</th>
                <th className="text-left p-5">Email</th>
                <th className="text-left p-5">Role</th>
              </tr>
            </thead>

            <tbody>

              {users.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-5 text-center">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-[var(--color-border)] hover:bg-[var(--color-orange-soft)] duration-200"
                  >

                    {/* USER */}
                    <td className="p-5">
                      <div className="flex items-center gap-4">

                        <div className="w-14 h-14 rounded-2xl bg-[var(--color-orange-soft)] flex items-center justify-center text-[var(--color-primary)]">
                          <Users size={24} />
                        </div>

                        <div>
                          <h2 className="font-bold text-[var(--color-text)]">
                            {user.name}
                          </h2>

                          <p className="text-sm text-[var(--color-text-light)]">
                            ID : {user.id}
                          </p>
                        </div>

                      </div>
                    </td>

                    {/* EMAIL */}
                    <td className="p-5">
                      <div className="flex items-center gap-2 text-[var(--color-text-light)]">
                        <Mail size={18} />
                        {user.email}
                      </div>
                    </td>

                    {/* ROLE */}
                    <td className="p-5">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-orange-soft)] text-[var(--color-primary)] font-semibold">
                        <ShieldCheck size={18} />
                        {user.role}
                      </div>
                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>

        {/* PAGINATION */}
        <div className="flex justify-center gap-3">

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
      page === pageNo
        ? "bg-orange-500 text-white"
        : "bg-gray-100"
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

export default UsersPage;