import { useEffect, useState } from "react";

import CompanyLayout from "../../layouts/CompanyLayout";

import { toast } from "react-toastify";

import {
  addFood,
  getMyFoods,
  updateFood,
  deleteFood,
} from "../../services/foodService";

import { getMySubscription } from "../../services/subscriptionService";

import { Search } from "lucide-react";

const CompanyFoods = () => {

  const BASE_URL =
    import.meta.env.VITE_BASE_URL;

  /* ================= STATES ================= */

  const [foods, setFoods] =
    useState([]);

  const [plan, setPlan] =
    useState(null);

  const [editingId, setEditingId] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [stockFilter, setStockFilter] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [page, setPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [deleteId, setDeleteId] =
  useState(null);

  const [showDeleteModal,
  setShowDeleteModal] =
  useState(false);

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({
      name: "",
      description: "",
      price: "",
      stock: "",
      offer: "",
      image: null,
    });

  const maxFoods =
    plan?.maxFoods ?? -1;

  /* ================= FETCH ================= */

  const fetchFoods = async () => {

    try {

      setLoading(true);

      const res =
        await getMyFoods(
          page,
          search,
          stockFilter
        );

      setFoods(res.data || []);

      setTotalPages(
        res.pagination?.totalPages || 1
      );

      const planRes =
        await getMySubscription();

      setPlan(
        planRes.data || null
      );

    } catch {

      toast.error(
        "Failed to load data"
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchFoods();

  }, [page, search, stockFilter]);

  useEffect(() => {

    setPage(1);

  }, [search, stockFilter]);

  /* ================= FORM ================= */

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });

  };

  const handleFileChange = (e) => {

    setForm({
      ...form,
      image:
        e.target.files[0],
    });

  };

  const resetForm = () => {

    setForm({
      name: "",
      description: "",
      price: "",
      stock: "",
      offer: "",
      image: null,
    });

    setEditingId(null);

  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!plan) {

      return toast.error(
        "No active subscription"
      );

    }

    if (
      maxFoods !== -1 &&
      foods.length >= maxFoods &&
      !editingId
    ) {

      return toast.error(
        "Food limit reached"
      );

    }

    if (
      !plan.allowOffer &&
      form.offer > 0
    ) {

      return toast.error(
        "Offers not allowed"
      );

    }

    try {

      const formData =
        new FormData();

      Object.entries(form)
        .forEach(([key, value]) => {

          if (value !== null) {

            formData.append(
              key,
              value
            );

          }

        });

      if (editingId) {

        await updateFood(
          editingId,
          formData
        );

        toast.success(
          "Food Updated"
        );

      } else {

        await addFood(
          formData
        );

        toast.success(
          "Food Added"
        );

      }

      resetForm();

      setShowModal(false);

      setPage(1);

      fetchFoods();

    } catch (err) {

      toast.error(
        err?.response?.data
          ?.message || "Failed"
      );

    }

  };

  /* ================= EDIT ================= */

  const handleEdit = (food) => {

    setEditingId(food.id);

    setForm({
      name: food.name,
      description:
        food.description,
      price: food.price,
      stock: food.stock,
      offer: food.offer,
      image: null,
    });

    setShowModal(true);

  };

  /* ================= DELETE ================= */

const handleDelete = async () => {

  try {

    await deleteFood(deleteId);

    toast.success(
      "Deleted successfully"
    );

    setShowDeleteModal(false);

    setDeleteId(null);

    fetchFoods();

  } catch {

    toast.error(
      "Delete failed"
    );

  }

};

  return (

    <CompanyLayout>

      <div className="space-y-6">

        {/* ================= HEADER ================= */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div>

            <h1 className="text-4xl md:text-5xl font-black">

              My Foods

            </h1>

            <p className="text-gray-500 mt-1">

              Manage your food items

            </p>

          </div>

          <button
            onClick={() => {

              resetForm();

              setShowModal(true);

            }}
            className="
              h-11
              px-5
              rounded-2xl
              bg-orange-500
              hover:bg-orange-600
              text-white
              font-semibold
              transition
            "
          >

            + Add Food

          </button>

        </div>

        {/* ================= SEARCH FILTER ================= */}

        <div className="flex flex-col md:flex-row gap-4">

          {/* SEARCH */}

          <div className="relative flex-1">

            <Search
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
              size={18}
            />

            <input
              type="text"
              placeholder="Search foods..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="
                w-full
                h-12
                pl-12
                pr-4
                rounded-2xl
                border
                border-gray-200
                bg-white
                text-sm
                font-medium
                outline-none
                focus:ring-2
                focus:ring-orange-300
                shadow-sm
              "
            />

          </div>

          {/* FILTER */}

          <select
            value={stockFilter}
            onChange={(e) =>
              setStockFilter(
                e.target.value
              )
            }
            className="
              h-12
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
              shadow-sm
            "
          >

            <option value="">
              All Foods
            </option>

            <option value="low">
              Low Stock
            </option>

          </select>

        </div>

        {/* ================= LOADING ================= */}

        {loading && (

          <p className="text-center text-orange-500 font-semibold">

            Loading foods...

          </p>

        )}

        {/* ================= EMPTY ================= */}

        {!loading &&
          foods.length === 0 && (

            <div className="bg-white rounded-3xl p-10 text-center">

              <h2 className="text-xl font-bold text-gray-700">

                No Foods Found

              </h2>

            </div>

          )}

        {/* ================= CARDS ================= */}

        <div
          className="
            grid
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            gap-5
          "
        >

          {foods.map((food) => {

            const discounted =
              food.offer > 0
                ? food.price -
                  (food.price *
                    food.offer) /
                    100
                : food.price;

            return (

              <div
                key={food.id}
                className="
                  bg-white
                  rounded-3xl
                  overflow-hidden
                  border
                  border-gray-100
                  shadow-sm
                  hover:shadow-xl
                  transition
                "
              >

                {/* IMAGE */}

                <div className="relative">

                  <img
                    src={
                      food.image
                        ? `${BASE_URL}${food.image}`
                        : "/no-image.png"
                    }
                    alt={food.name}
                    className="
                      w-full
                      h-48
                      object-cover
                    "
                  />

                  {/* OFFER */}

                  {food.offer > 0 && (

                    <span
                      className="
                        absolute
                        top-3
                        left-3
                        bg-red-500
                        text-white
                        text-xs
                        font-bold
                        px-3
                        py-1
                        rounded-full
                      "
                    >

                      {food.offer}% OFF

                    </span>

                  )}

                  {/* STOCK */}

                  <span
                    className={`
                      absolute
                      top-3
                      right-3
                      text-xs
                      font-bold
                      px-3
                      py-1
                      rounded-full

                      ${
                        food.stock < 5
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }
                    `}
                  >

                    Stock:
                    {" "}
                    {food.stock}

                  </span>

                </div>

                {/* CONTENT */}

                <div className="p-5">

                  <h2 className="text-lg font-black">

                    {food.name}

                  </h2>

                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">

                    {food.description}

                  </p>

                  {/* PRICE */}

                  <div className="flex items-center gap-2 mt-4">

                    <span className="text-xl font-black text-orange-500">

                      ₹
                      {discounted.toFixed(
                        2
                      )}

                    </span>

                    {food.offer > 0 && (

                      <span className="text-sm text-gray-400 line-through">

                        ₹
                        {food.price}

                      </span>

                    )}

                  </div>

                  {/* LOW STOCK */}

                  {food.stock < 5 && (

                    <p className="text-xs text-red-500 font-semibold mt-2">

                      Only
                      {" "}
                      {food.stock}
                      {" "}
                      left

                    </p>

                  )}

                  {/* BUTTONS */}

                  <div className="flex gap-3 mt-5">

                    <button
                      onClick={() =>
                        handleEdit(food)
                      }
                      className="
                        flex-1
                        h-10
                        rounded-xl
                        bg-orange-500
                        hover:bg-orange-600
                        text-white
                        text-sm
                        font-semibold
                        transition
                      "
                    >

                      Edit

                    </button>

                    <button
                      onClick={() => {

  setDeleteId(food.id);

  setShowDeleteModal(true);

}}
                      className="
                        flex-1
                        h-10
                        rounded-xl
                        bg-gray-100
                        hover:bg-gray-200
                        text-sm
                        font-semibold
                        transition
                      "
                    >

                      Delete

                    </button>

                  </div>

                </div>

              </div>

            );

          })}

        </div>

        {/* ================= PAGINATION ================= */}

        {totalPages > 0 && (

          <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">

            {/* PREV */}

            <button
              onClick={() =>
                setPage(page - 1)
              }
              disabled={page === 1}
              className={`
                h-10
                px-4
                rounded-xl
                text-sm
                font-semibold
                transition

                ${
                  page === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white border border-gray-200 hover:bg-gray-50"
                }
              `}
            >

              Prev

            </button>

            {/* PAGE NUMBERS */}

            {Array.from({
              length:
                Math.min(
                  totalPages,
                  3
                ),
            }).map((_, index) => {

              const pageNumber =
                index + 1;

              return (

                <button
                  key={pageNumber}
                  onClick={() =>
                    setPage(
                      pageNumber
                    )
                  }
                  className={`
                    h-10
                    min-w-[40px]
                    px-4
                    rounded-xl
                    text-sm
                    font-bold
                    transition

                    ${
                      page ===
                      pageNumber
                        ? "bg-orange-500 text-white"
                        : "bg-white border border-gray-200 hover:bg-gray-50"
                    }
                  `}
                >

                  {pageNumber}

                </button>

              );

            })}

            {/* NEXT */}

            <button
              onClick={() =>
                setPage(page + 1)
              }
              disabled={
                page === totalPages
              }
              className={`
                h-10
                px-4
                rounded-xl
                text-sm
                font-semibold
                transition

                ${
                  page === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white border border-gray-200 hover:bg-gray-50"
                }
              `}
            >

              Next

            </button>

          </div>

        )}

        {/* ================= MODAL ================= */}

        {showModal && (

          <div
            className="
              fixed
              inset-0
              z-50
              bg-black/40
              backdrop-blur-sm
              flex
              items-center
              justify-center
              p-4
            "
          >

            <div
              className="
                w-full
                max-w-2xl
                bg-white
                rounded-3xl
                p-6
                shadow-2xl
                relative
              "
            >

              {/* CLOSE */}

              <button
                onClick={() => {

                  setShowModal(false);

                  resetForm();

                }}
                className="
                  absolute
                  top-4
                  right-4
                  w-9
                  h-9
                  rounded-full
                  bg-gray-100
                  hover:bg-gray-200
                  font-bold
                "
              >

                ×

              </button>

              {/* TITLE */}

              <h2 className="text-2xl font-black mb-6">

                {editingId
                  ? "Update Food"
                  : "Add Food"}

              </h2>

              {/* FORM */}

              <form
                onSubmit={
                  handleSubmit
                }
                className="
                  grid
                  md:grid-cols-2
                  gap-4
                "
              >

                <input
                  name="name"
                  value={form.name}
                  onChange={
                    handleChange
                  }
                  placeholder="Food Name"
                  className="
                    h-12
                    px-4
                    rounded-2xl
                    bg-gray-100
                    outline-none
                  "
                />

                <input
                  name="description"
                  value={
                    form.description
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Description"
                  className="
                    h-12
                    px-4
                    rounded-2xl
                    bg-gray-100
                    outline-none
                  "
                />

                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={
                    handleChange
                  }
                  placeholder="Price"
                  className="
                    h-12
                    px-4
                    rounded-2xl
                    bg-gray-100
                    outline-none
                  "
                />

                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={
                    handleChange
                  }
                  placeholder="Stock"
                  className="
                    h-12
                    px-4
                    rounded-2xl
                    bg-gray-100
                    outline-none
                  "
                />

                {plan?.allowOffer && (

                  <input
                    type="number"
                    name="offer"
                    value={form.offer}
                    onChange={
                      handleChange
                    }
                    placeholder="Offer %"
                    className="
                      h-12
                      px-4
                      rounded-2xl
                      bg-gray-100
                      outline-none
                    "
                  />

                )}

                <input
                  type="file"
                  onChange={
                    handleFileChange
                  }
                  className="
                    h-12
                    px-3
                    rounded-2xl
                    bg-gray-100
                    outline-none
                    flex
                    items-center
                  "
                />

                <button
                  className="
                    md:col-span-2
                    h-12
                    rounded-2xl
                    bg-orange-500
                    hover:bg-orange-600
                    text-white
                    font-bold
                    transition
                  "
                >

                  {editingId
                    ? "Update Food"
                    : "Add Food"}

                </button>

              </form>

            </div>

          </div>

        )}
        {/* ================= DELETE MODAL ================= */}

{showDeleteModal && (

  <div
    className="
      fixed
      inset-0
      z-50
      bg-black/40
      backdrop-blur-sm
      flex
      items-center
      justify-center
      p-4
    "
  >

    <div
      className="
        w-full
        max-w-sm
        bg-white
        rounded-3xl
        p-6
        shadow-2xl
        text-center
      "
    >

      {/* TITLE */}

      <h2
        className="
          text-2xl
          font-black
          text-gray-900
        "
      >

        Delete Food?

      </h2>

      {/* TEXT */}

      <p
        className="
          text-gray-500
          mt-2
          text-sm
        "
      >

        This action cannot be undone.

      </p>

      {/* BUTTONS */}

      <div className="flex gap-3 mt-6">

        {/* CANCEL */}

        <button
          onClick={() => {

            setShowDeleteModal(false);

            setDeleteId(null);

          }}
          className="
            flex-1
            h-11
            rounded-2xl
            bg-gray-100
            hover:bg-gray-200
            text-sm
            font-semibold
            transition
          "
        >

          Cancel

        </button>

        {/* DELETE */}

        <button
          onClick={handleDelete}
          className="
            flex-1
            h-11
            rounded-2xl
            bg-orange-500
            hover:bg-orange-600
            text-white
            text-sm
            font-semibold
            transition
          "
        >

          Delete

        </button>

      </div>

    </div>

  </div>

)}

      </div>

    </CompanyLayout>

  );

};

export default CompanyFoods;