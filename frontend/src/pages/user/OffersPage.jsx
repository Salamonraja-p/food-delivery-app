import { useEffect, useState } from "react";
import { Search, X, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import MainLayout from "../../layouts/MainLayout";
import { getOfferFoods } from "../../services/foodService";
import { useCart } from "../../context/CartContext";

const buildPages = (page, totalPages) => {
  if (totalPages <= 4) {
    return [...Array(totalPages)].map((_, i) => i + 1);
  }

  const fixed = [1, 2, 3];
  const pages = new Set(fixed);

  if (page > 4) pages.add("...");
  if (page > 3) pages.add(page);
  if (page < totalPages) pages.add(totalPages);

  return [...pages];
};

const OffersPage = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [foods, setFoods] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const { cartItems, addItem, decreaseItem } = useCart();

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);

        const res = await getOfferFoods(page, debouncedSearch);

        setFoods(res.data || []);
        setTotalPages(res.pagination?.totalPages || 1);
      } catch {
        toast.error("Failed to load offers");
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [page, debouncedSearch]);

  const clearSearch = () => {
    setSearch("");
    setPage(1);
  };

  const handleAdd = async (foodId, stock) => {
    if (stock === 0) {
      toast.error("Out of stock");

      return;
    }

    await addItem(foodId);
  };

  const isFirstPage = page === 1;

  const isLastPage = page === totalPages;

  return (
    <MainLayout>
      <div className="max-w-[1200px] mx-auto px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Tag size={32} className="text-[#ff6b00]" />

            <h1 className="font-display text-[32px] font-extrabold text-[#111110]">
              Best Offers
            </h1>
          </div>

          <p className="text-[#9ca3af] mt-2">
            Discover discounted foods from all companies
          </p>
        </div>

        <div className="relative mb-8">
          <span className="absolute left-[13px] top-1/2 -translate-y-1/2 text-[#9ca3af]">
            <Search size={15} />
          </span>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search offers..."
            className="block w-full h-10 pl-10 pr-9 bg-[#f7f7f6] border-[1.5px] border-[#e8e8e7] rounded-[10px] text-[13.5px] focus:bg-white focus:border-[#ff6b00] focus:outline-none"
          />

          {search && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(228px,1fr))] gap-[18px]">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-[320px] rounded-[18px] bg-[#f7f7f6] animate-pulse"
              />
            ))}
          </div>
        ) : foods.length === 0 ? (
          <div className="text-center py-20">
            <Tag size={50} className="mx-auto text-[#d1d1cf]" />

            <h3 className="mt-4 text-lg font-bold text-[#6b7280]">
              No Offers Found
            </h3>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(228px,1fr))] gap-[18px]">
              {foods.map((food) => {
                const cartItem = cartItems.find(
                  (item) => item.foodId === food.id,
                );

                const qty = cartItem?.quantity || 0;

                const finalPrice = food.price - (food.price * food.offer) / 100;

                return (
                  <div
                    key={food.id}
                    className="bg-white border border-[#e8e8e7] rounded-[18px] overflow-hidden hover:-translate-y-[3px] hover:shadow-[0_12px_32px_rgba(0,0,0,0.09)] transition-all"
                  >
                    <div className="relative h-[164px]">
                      <img
                        src={
                          food.image
                            ? `${BASE_URL}${food.image}`
                            : "/no-image.png"
                        }
                        alt={food.name}
                        className="w-full h-full object-cover"
                      />

                      <span className="absolute top-2 left-2 px-2 py-1 rounded-full bg-[#fef2f2] text-[#ef4444] text-[11px] font-semibold">
                        {food.offer}% OFF
                      </span>
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-[16px]">{food.name}</h3>

                      <p className="text-[#9ca3af] text-sm mt-1">
                        {food.company?.name}
                      </p>

                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-[18px] font-bold text-[#111110]">
                          ₹{finalPrice.toFixed(2)}
                        </span>

                        <span className="line-through text-[#9ca3af]">
                          ₹{food.price}
                        </span>
                      </div>

                      <p className="mt-1 text-[12px] text-[#ef4444] font-semibold">
                        Save ₹{(food.price - finalPrice).toFixed(2)}
                      </p>

                      {qty > 0 ? (
                        <div className="flex items-center justify-between mt-4 bg-[#f7f7f6] rounded-[10px] p-1">
                          <button onClick={() => decreaseItem(food.id)}>
                            -
                          </button>

                          <span>{qty}</span>

                          <button onClick={() => addItem(food.id)}>+</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAdd(food.id, food.stock)}
                          className="w-full mt-4 h-[38px] rounded-[10px] bg-[#111110] text-white hover:bg-[#ff6b00] transition-colors"
                        >
                          Add To Cart
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-1.5 mt-12 flex-wrap">
              <button
                onClick={() => !isFirstPage && setPage((p) => p - 1)}
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
                    onClick={() => setPage(num)}
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
                onClick={() => !isLastPage && setPage((p) => p + 1)}
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
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default OffersPage;
