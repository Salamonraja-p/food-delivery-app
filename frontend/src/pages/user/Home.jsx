import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import { getAllFoods } from "../../services/foodService";
import { useCart } from "../../context/CartContext";

const PRICE_FILTERS = [
  { label: "All Prices", min: "", max: "" },
  { label: "Under ₹100", min: "", max: 100 },
  { label: "₹100 – ₹200", min: 100, max: 200 },
  { label: "₹200 – ₹500", min: 200, max: 500 },
  { label: "Above ₹500", min: 500, max: "" },
];

/* ── Pagination logic:
   page 1 → prev(dim) 1 next
   page 2 → prev 1 2 next
   page 3 → prev 1 2 3 next
   page 4 → prev 1 2 3 4 next
   page 5 → prev 1 2 3 … 5 next
   page 6 → prev 1 2 3 … 6 next
   always show first 3 + current if > 4 + last
── */
const buildPages = (page, totalPages) => {
  if (totalPages <= 4) return [...Array(totalPages)].map((_, i) => i + 1);

  const fixed = [1, 2, 3];
  const pages = new Set(fixed);

  if (page > 4) pages.add("...");
  if (page > 3) pages.add(page);
  if (page < totalPages) pages.add(totalPages);

  return [...pages];
};

const Home = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [foods, setFoods] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [priceFilter, setPriceFilter] = useState(PRICE_FILTERS[0]);
  const [priceOpen, setPriceOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
const [pageLoading, setPageLoading] = useState(false);

  const { cartItems, addItem, decreaseItem } = useCart();

  /* debounce */
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  /* fetch */
  useEffect(() => {
  (async () => {
    try {
      setPageLoading(true);

      const res = await getAllFoods(
        page,
        debouncedSearch,
        priceFilter.min,
        priceFilter.max,
      );

      setFoods(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);

    } catch {
      toast.error("Failed to load foods");
    } finally {
      setPageLoading(false);
      setInitialLoading(false);
    }
  })();
}, [page, debouncedSearch, priceFilter]);

  const handleAdd = async (foodId, stock) => {
    if (stock === 0) return toast.error("Out of stock");
    await addItem(foodId);
  };

  const handlePriceSelect = (pf) => {
    setPriceFilter(pf);
    setPriceOpen(false);
    setPage(1);
  };
  const clearSearch = () => {
    setSearch("");
    setPage(1);
  };
  const isPriceActive = priceFilter.label !== "All Prices";
  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;

  const handlePageChange = (newPage) => {
    setPage(newPage);

    window.scrollTo({
      top: 500,
      behavior: "smooth",
    });
  };

  return (
    <MainLayout>
      {/* ── HERO ── */}
      <section className="relative h-[460px] overflow-hidden bg-[#0d0d0d] max-sm:h-[340px]">
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-100"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/food.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 to-black/72" />
        <div className="relative z-10 h-full flex flex-col justify-end px-12 pb-13 max-w-[900px] max-sm:px-5 max-sm:pb-8">
          <span className="inline-flex items-center gap-[7px] bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.3)] text-[#ffb07a] text-[11px] font-semibold tracking-[0.1em] uppercase px-3 py-[5px] rounded-full mb-[18px] w-fit backdrop-blur-sm">
            <span className="w-1.5 h-1.5 bg-[#ff6b00] rounded-full animate-pulse flex-shrink-0" />
            Fresh &amp; Fast Delivery
          </span>
          <h1 className="font-display font-extrabold text-white tracking-[-0.03em] leading-[1.1] mb-3.5 text-[clamp(34px,5vw,56px)]">
            Food you love,
            <br />
            delivered <span className="text-[#ff6b00]">instantly.</span>
          </h1>
          <p className="text-[15px] font-light text-white/60 max-w-[440px] leading-[1.65] m-0">
            Hundreds of dishes from top restaurants — order in seconds.
          </p>
        </div>
      </section>

      {/* ── FILTER BAR ── */}
      <div className="bg-white border-b border-[#e8e8e7] sticky top-[60px] z-40">
        <div className="max-w-[1200px] mx-auto px-8 h-[60px] flex items-center gap-2.5 max-sm:px-4 max-sm:h-auto max-sm:py-2.5 max-sm:flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <span className="absolute left-[13px] top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none flex items-center">
              <Search size={15} />
            </span>
            <input
              type="text"
              placeholder="Search dishes or restaurants…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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

          {/* Price filter dropdown */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setPriceOpen((v) => !v)}
              className={`inline-flex items-center gap-1.5 h-10 px-3 rounded-[10px] border-[1.5px] font-body text-[13px] font-semibold cursor-pointer whitespace-nowrap transition-all duration-150 ${
                isPriceActive
                  ? "border-[#ff6b00] bg-[#fff4eb] text-[#ff6b00]"
                  : "border-[#d1d1cf] bg-white text-[#6b7280] hover:border-[#ff6b00] hover:text-[#ff6b00] hover:bg-[#fff4eb]"
              }`}
            >
              <SlidersHorizontal size={14} />
              {priceFilter.label}
              <ChevronDown
                size={13}
                className="ml-0.5 transition-transform duration-200"
                style={{
                  transform: priceOpen ? "rotate(180deg)" : "rotate(0)",
                }}
              />
            </button>

            {priceOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setPriceOpen(false)}
                />
                <div className="absolute top-[calc(100%+8px)] right-0 z-31 bg-white border border-[#e8e8e7] rounded-[14px] shadow-[0_12px_32px_rgba(0,0,0,0.09)] min-w-[180px] p-1.5 flex flex-col gap-0.5">
                  {PRICE_FILTERS.map((pf) => {
                    const isSelected = priceFilter.label === pf.label;
                    return (
                      <button
                        key={pf.label}
                        onClick={() => handlePriceSelect(pf)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-[10px] border-none text-[13px] cursor-pointer text-left w-full transition-all duration-150 ${
                          isSelected
                            ? "bg-[#fff4eb] text-[#ff6b00] font-semibold"
                            : "bg-transparent text-[#6b7280] font-medium hover:bg-[#f7f7f6] hover:text-[#111110]"
                        }`}
                      >
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b00] flex-shrink-0" />
                        )}
                        {pf.label}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-[1200px] mx-auto px-8 pt-9 pb-16 max-sm:px-4 max-sm:pt-6 max-sm:pb-12">
        {/* Section label */}
        {!initialLoading && foods.length > 0 && (
          <h2 className="font-display text-[20px] font-bold text-[#111110] tracking-[-0.02em] mb-5">
            {debouncedSearch ? (
              <>
                Results for{" "}
                <span className="text-[#ff6b00]">"{debouncedSearch}"</span>
              </>
            ) : isPriceActive ? (
              priceFilter.label
            ) : (
              "All dishes"
            )}
            {isPriceActive && debouncedSearch && (
              <span className="text-[#9ca3af] text-[16px] font-normal">
                {" "}
                · {priceFilter.label}
              </span>
            )}
          </h2>
        )}

        {/* Active filter chips */}
        {!initialLoading && foods.length > 0 && (debouncedSearch || isPriceActive) && (
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            {debouncedSearch && (
              <button
                onClick={clearSearch}
                className="inline-flex items-center gap-1 px-2.5 py-[3px] rounded-full bg-[#fff4eb] text-[#ff6b00] border border-[#ffe0c7] text-[11px] font-semibold tracking-[0.03em] uppercase cursor-pointer transition-opacity hover:opacity-75"
              >
                "{debouncedSearch}" <X size={10} />
              </button>
            )}
            {isPriceActive && (
              <button
                onClick={() => {
                  setPriceFilter(PRICE_FILTERS[0]);
                  setPage(1);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-[3px] rounded-full bg-[#fff4eb] text-[#ff6b00] border border-[#ffe0c7] text-[11px] font-semibold tracking-[0.03em] uppercase cursor-pointer transition-opacity hover:opacity-75"
              >
                {priceFilter.label} <X size={10} />
              </button>
            )}
          </div>
        )}

        {/* Grid / Skeleton / Empty */}
        {initialLoading ? (
          <div
  className={`grid grid-cols-[repeat(auto-fill,minmax(228px,1fr))] gap-[18px] transition-opacity duration-300 ${
    pageLoading ? "opacity-60" : "opacity-100"
  }`}
>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white border border-[#e8e8e7] rounded-[18px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden"
              >
                <div className="h-[164px] bg-gradient-to-r from-[#efefee] via-[#e6e6e5] to-[#efefee] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />
                <div className="p-[14px_16px_16px] flex flex-col gap-2.5">
                  <div className="h-[11px] w-[45%] rounded-[10px] bg-gradient-to-r from-[#efefee] via-[#e6e6e5] to-[#efefee] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />
                  <div className="h-[11px] w-[75%] rounded-[10px] bg-gradient-to-r from-[#efefee] via-[#e6e6e5] to-[#efefee] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />
                  <div className="h-[11px] w-[30%] rounded-[10px] bg-gradient-to-r from-[#efefee] via-[#e6e6e5] to-[#efefee] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />
                  <div className="h-9 mt-1 rounded-[10px] bg-gradient-to-r from-[#efefee] via-[#e6e6e5] to-[#efefee] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />
                </div>
              </div>
            ))}
          </div>
        ) : foods.length === 0 ? (
          <div className="text-center py-[72px] px-5">
            <div className="text-[48px] mb-3.5 opacity-45">🍽️</div>
            <div className="font-display text-[17px] font-bold text-[#6b7280] mb-1.5">
              Nothing found
            </div>
            <div className="text-[13.5px] text-[#9ca3af]">
              Try a different search term or adjust the price filter
            </div>
          </div>
        ) : (
          <div
  className={`grid grid-cols-[repeat(auto-fill,minmax(228px,1fr))] gap-[18px] transition-opacity duration-300 ${
    pageLoading ? "opacity-60" : "opacity-100"
  }`}
>
            {foods.map((food) => {
              const cartItem = cartItems.find(
                (item) => item.foodId === food.id,
              );
              const qty = cartItem?.quantity || 0;
              const finalPrice =
                food.offer > 0
                  ? food.price - (food.price * food.offer) / 100
                  : food.price;

              return (
                <div
                  key={food.id}
                  className="bg-white border border-[#e8e8e7] rounded-[18px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden transition-[transform,box-shadow] duration-[220ms] ease-in-out hover:-translate-y-[3px] hover:shadow-[0_12px_32px_rgba(0,0,0,0.09)]"
                >
                  {/* Image */}
                  <div className="relative h-[164px] overflow-hidden bg-[#f7f7f6]">
                    <img
                      src={
                        food.image
                          ? `${BASE_URL}${food.image}`
                          : "/no-image.png"
                      }
                      alt={food.name}
                      className="w-full h-full object-cover transition-transform duration-[350ms] ease-in-out group-hover:scale-[1.06]"
                      onError={(e) => {
                        e.target.src = "/no-image.png";
                      }}
                    />
                    {food.offer > 0 && (
                      <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2.5 py-[3px] rounded-full bg-[#fef2f2] text-[#ef4444] text-[11px] font-semibold tracking-[0.03em] uppercase">
                        {food.offer}% off
                      </span>
                    )}
                    {food.stock === 0 && (
                      <div className="absolute inset-0 bg-white/50 backdrop-blur-[3px] flex items-center justify-center">
                        <span className="bg-[#111110] text-white text-[11px] font-bold px-3 py-[5px] rounded-[10px] tracking-[0.06em] uppercase">
                          Sold out
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-[14px_16px_16px] flex flex-col gap-[5px]">
                    <span className="text-[11px] font-semibold text-[#ff6b00] tracking-[0.07em] uppercase">
                      {food.company?.name}
                    </span>
                    <h3 className="font-display text-[15px] font-bold text-[#111110] tracking-[-0.01em] leading-[1.3] m-0">
                      {food.name}
                    </h3>

                    <span
                      className={`text-[11.5px] ${
                        food.stock === 0
                          ? "text-[#ef4444]"
                          : food.stock <= 5
                            ? "text-[#f59e0b]"
                            : "text-[#9ca3af]"
                      }`}
                    >
                      {food.stock === 0
                        ? "Out of stock"
                        : food.stock <= 5
                          ? `Only ${food.stock} left`
                          : `${food.stock} available`}
                    </span>

                    <div className="flex items-baseline gap-[7px] my-1 mb-2">
                      <span className="font-display text-[18px] font-bold text-[#111110]">
                        ₹{finalPrice.toFixed(2)}
                      </span>
                      {food.offer > 0 && (
                        <span className="text-[13px] text-[#9ca3af] line-through">
                          ₹{food.price}
                        </span>
                      )}
                    </div>

                    {qty > 0 ? (
                      <div className="flex items-center justify-between bg-[#f7f7f6] rounded-[10px] p-[4px_6px] border-[1.5px] border-[#e8e8e7]">
                        <button
                          className="w-[30px] h-[30px] rounded-[6px] border-none bg-white text-[#111110] text-[17px] font-bold cursor-pointer flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:bg-[#ff6b00] hover:text-white transition-colors duration-150"
                          onClick={() => decreaseItem(food.id)}
                        >
                          −
                        </button>
                        <span className="font-display text-[15px] font-bold text-[#111110] min-w-[24px] text-center">
                          {qty}
                        </span>
                        <button
                          className="w-[30px] h-[30px] rounded-[6px] border-none bg-white text-[#111110] text-[17px] font-bold cursor-pointer flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:bg-[#ff6b00] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
                          onClick={() => addItem(food.id)}
                          disabled={qty >= food.stock}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        className="w-full h-[38px] rounded-[10px] bg-[#111110] text-white border-[1.5px] border-[#111110] font-body text-[13.5px] font-semibold cursor-pointer hover:bg-[#ff6b00] hover:border-[#ff6b00] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
                        onClick={() => handleAdd(food.id, food.stock)}
                        disabled={food.stock === 0}
                      >
                        {food.stock === 0 ? "Unavailable" : "Add to Cart"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {pageLoading && !initialLoading && (
  <div className="flex justify-center py-4">
    <div className="w-5 h-5 border-2 border-[#ff6b00] border-t-transparent rounded-full animate-spin" />
  </div>
)}

        {/* ── PAGINATION ── */}
        {!initialLoading && foods.length > 0 && (
          <div className="flex items-center justify-center gap-1.5 mt-12 flex-wrap">
            <button
              onClick={() => !isFirstPage && handlePageChange(page - 1)}
              className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-[10px] border-[1.5px] font-body text-[13px] font-semibold transition-all duration-150 whitespace-nowrap ${
                isFirstPage
                  ? "bg-white text-[#d1d1cf] border-[#e8e8e7] cursor-not-allowed opacity-40"
                  : "bg-white text-[#111110] border-[#d1d1cf] cursor-pointer hover:border-[#ff6b00] hover:text-[#ff6b00] hover:bg-[#fff4eb]"
              }`}
            >
              <ChevronLeft size={14} />
              Prev
            </button>

            {buildPages(page, totalPages).map((num, i) =>
              num === "..." ? (
                <span
                  key={`gap-${i}`}
                  className="text-[#9ca3af] text-[13px] px-0.5"
                >
                  …
                </span>
              ) : (
                <button
                  key={num}
                  onClick={() => handlePageChange(num)}
                  className={`w-9 h-9 rounded-[10px] border-[1.5px] font-body text-[13px] font-medium cursor-pointer flex items-center justify-center leading-none transition-all duration-150 ${
                    page === num
                      ? "bg-[#ff6b00] border-[#ff6b00] text-white font-bold"
                      : "bg-white border-[#e8e8e7] text-[#6b7280] hover:border-[#ff6b00] hover:text-[#ff6b00]"
                  }`}
                >
                  {num}
                </button>
              ),
            )}

            <button
              onClick={() => !isLastPage && handlePageChange(page + 1)}
              className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-[10px] border-[1.5px] font-body text-[13px] font-semibold transition-all duration-150 whitespace-nowrap ${
                isLastPage
                  ? "bg-white text-[#d1d1cf] border-[#e8e8e7] cursor-not-allowed opacity-40"
                  : "bg-white text-[#111110] border-[#d1d1cf] cursor-pointer hover:border-[#ff6b00] hover:text-[#ff6b00] hover:bg-[#fff4eb]"
              }`}
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Home;
