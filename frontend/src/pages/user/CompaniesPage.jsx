
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, X, Building2, UtensilsCrossed, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import MainLayout from "../../layouts/MainLayout";
import { getAllCompanies } from "../../services/foodService";
 
const buildPages = (page, totalPages) => {
  if (totalPages <= 4) return [...Array(totalPages)].map((_, i) => i + 1);
  const fixed = [1, 2, 3];
  const pages = new Set(fixed);
  if (page > 4) pages.add("...");
  if (page > 3) pages.add(page);
  if (page < totalPages) pages.add(totalPages);
  return [...pages];
};
 
/* Deterministic soft color per company initial */
const AVATAR_COLORS = [
  "bg-[#fff4eb] text-[#ff6b00]",
  "bg-[#f0fdf4] text-[#22c55e]",
  "bg-[#eff6ff] text-[#3b82f6]",
  "bg-[#fdf4ff] text-[#a855f7]",
  "bg-[#fff1f2] text-[#f43f5e]",
  "bg-[#fffbeb] text-[#f59e0b]",
];
const avatarColor = (name = "") =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
 
const CompaniesPage = () => {
  const [companies,       setCompanies]       = useState([]);
  const [page,            setPage]            = useState(1);
  const [totalPages,      setTotalPages]      = useState(1);
  const [search,          setSearch]          = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading,         setLoading]         = useState(false);
 
  /* debounce */
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); setDebouncedSearch(search); }, 400);
    return () => clearTimeout(t);
  }, [search]);
 
  /* fetch */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getAllCompanies(page, debouncedSearch);
        setCompanies(res.data || []);
        setTotalPages(res.pagination?.totalPages || 1);
      } catch {
        toast.error("Failed to load companies");
      } finally {
        setLoading(false);
      }
    })();
  }, [page, debouncedSearch]);
 
  const clearSearch = () => { setSearch(""); setPage(1); };
  const isFirstPage = page === 1;
  const isLastPage  = page === totalPages;
 
  return (
    <MainLayout>
      <div className="max-w-[1200px] mx-auto px-8 pt-9 pb-16 max-sm:px-4 max-sm:pt-6">
 
        {/* ── Header ── */}
        <div className="mb-8">
          <h1 className="font-display text-[32px] font-extrabold text-[#111110] tracking-[-0.02em]">
            Restaurants
          </h1>
          <p className="text-[13.5px] text-[#9ca3af] mt-1.5">
            Browse all restaurants and food companies
          </p>
        </div>
 
        {/* ── Search ── */}
        <div className="mb-8">
          <div className="relative max-w-[420px]">
            <span className="absolute left-[13px] top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none flex items-center">
              <Search size={15} />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search restaurants…"
              className="block w-full h-10 pl-10 pr-9 bg-[#f7f7f6] border-[1.5px] border-[#e8e8e7] rounded-[10px] font-body text-[13.5px] text-[#111110] outline-none focus:bg-white focus:border-[#ff6b00] focus:shadow-[0_0_0_3px_rgba(255,107,0,0.1)] transition-all duration-150 placeholder:text-[#b4b4b2]"
            />
            {search && (
              <button
                onClick={clearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[#9ca3af] flex items-center p-0.5 rounded-[6px] hover:text-[#111110] transition-colors duration-150"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
 
        {/* ── Skeleton ── */}
        {loading ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5 max-sm:grid-cols-1">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white border border-[#e8e8e7] rounded-[18px] p-6 flex flex-col gap-3"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#efefee] via-[#e6e6e5] to-[#efefee] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />
                <div className="h-4 w-[60%] rounded-[10px] bg-gradient-to-r from-[#efefee] via-[#e6e6e5] to-[#efefee] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />
                <div className="h-3 w-[40%] rounded-[10px] bg-gradient-to-r from-[#efefee] via-[#e6e6e5] to-[#efefee] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />
                <div className="h-[34px] mt-1 rounded-[10px] bg-gradient-to-r from-[#efefee] via-[#e6e6e5] to-[#efefee] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />
              </div>
            ))}
          </div>
 
        ) : companies.length === 0 ? (
          /* ── Empty ── */
          <div className="text-center py-[72px] px-5">
            <div className="flex justify-center mb-3.5 opacity-40">
              <Building2 size={48} strokeWidth={1.2} className="text-[#9ca3af]" />
            </div>
            <div className="font-display text-[17px] font-bold text-[#6b7280] mb-1.5">
              No restaurants found
            </div>
            <div className="text-[13.5px] text-[#9ca3af]">
              {debouncedSearch ? `No results for "${debouncedSearch}"` : "Check back soon"}
            </div>
          </div>
 
        ) : (
          <>
            {/* ── Grid ── */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5 max-sm:grid-cols-1">
              {companies.map((company) => (
                <Link
                  key={company.id}
                  to={`/company/${company.id}`}
                  className="bg-white border border-[#e8e8e7] rounded-[18px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-6 no-underline flex flex-col gap-0 hover:-translate-y-[3px] hover:shadow-[0_12px_32px_rgba(0,0,0,0.09)] transition-all duration-[220ms] ease-in-out group"
                >
                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-[18px] font-display font-bold flex-shrink-0 mb-4 ${avatarColor(company.name)}`}>
                    {company.name?.charAt(0).toUpperCase()}
                  </div>
 
                  {/* Name */}
                  <h3 className="font-display text-[17px] font-bold text-[#111110] tracking-[-0.01em] leading-tight mb-1.5">
                    {company.name}
                  </h3>
 
                  {/* Sub */}
                  <p className="text-[13px] text-[#9ca3af] mb-5 flex-1">
                    View foods &amp; offers
                  </p>
 
                  {/* CTA row */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#ff6b00] tracking-[0.02em]">
                      <UtensilsCrossed size={13} strokeWidth={2} />
                      Browse menu
                    </span>
                    <span className="w-7 h-7 rounded-full bg-[#f7f7f6] flex items-center justify-center text-[#9ca3af] group-hover:bg-[#ff6b00] group-hover:text-white transition-all duration-150">
                      <ChevronRight size={13} strokeWidth={2.5} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
 
            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-12 flex-wrap">
 
                <button
                  onClick={() => !isFirstPage && setPage((p) => p - 1)}
                  className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-[10px] border-[1.5px] font-body text-[13px] font-semibold transition-all duration-150 whitespace-nowrap ${
                    isFirstPage
                      ? "bg-white text-[#d1d1cf] border-[#e8e8e7] cursor-not-allowed opacity-40"
                      : "bg-white text-[#111110] border-[#d1d1cf] cursor-pointer hover:border-[#ff6b00] hover:text-[#ff6b00] hover:bg-[#fff4eb]"
                  }`}
                >
                  <ChevronLeft size={14} /> Prev
                </button>
 
                {buildPages(page, totalPages).map((num, i) =>
                  num === "..." ? (
                    <span key={`gap-${i}`} className="text-[#9ca3af] text-[13px] px-0.5">…</span>
                  ) : (
                    <button
                      key={num}
                      onClick={() => setPage(num)}
                      className={`w-9 h-9 rounded-[10px] border-[1.5px] font-body text-[13px] font-medium cursor-pointer flex items-center justify-center leading-none transition-all duration-150 ${
                        page === num
                          ? "bg-[#ff6b00] border-[#ff6b00] text-white font-bold"
                          : "bg-white border-[#e8e8e7] text-[#6b7280] hover:border-[#ff6b00] hover:text-[#ff6b00]"
                      }`}
                    >
                      {num}
                    </button>
                  )
                )}
 
                <button
                  onClick={() => !isLastPage && setPage((p) => p + 1)}
                  className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-[10px] border-[1.5px] font-body text-[13px] font-semibold transition-all duration-150 whitespace-nowrap ${
                    isLastPage
                      ? "bg-white text-[#d1d1cf] border-[#e8e8e7] cursor-not-allowed opacity-40"
                      : "bg-white text-[#111110] border-[#d1d1cf] cursor-pointer hover:border-[#ff6b00] hover:text-[#ff6b00] hover:bg-[#fff4eb]"
                  }`}
                >
                  Next <ChevronRight size={14} />
                </button>
 
              </div>
            )}
          </>
        )}
 
      </div>
    </MainLayout>
  );
};
 
export default CompaniesPage;
