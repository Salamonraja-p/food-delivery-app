
import { useEffect, useState } from "react";

import CompanyLayout from "../../layouts/CompanyLayout";
import {
  RotateCcw,
} from "lucide-react";

import {

  getCompanyReportTable,

  getCompanyReportGraph,

  getCompanyReportChart,

  getTopSellingFoods,

} from "../../services/companyService";

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

import * as XLSX from "xlsx";

/* ================= COLORS ================= */

const COLORS = [

  "#f97316",

  "#fb923c",

  "#fdba74",

  "#f97316",

  "#fb923c",

];

const CompanyReports = () => {

  /* ================= STATES ================= */

  const [graphData,
    setGraphData] =
    useState([]);

  const [chartData,
    setChartData] =
    useState([]);

  const [topFoods,
    setTopFoods] =
    useState([]);

  const [summary,
    setSummary] =
    useState({});

  const [statusCard,
    setStatusCard] =
    useState({});

  const [tableData,
    setTableData] =
    useState([]);

  const [page,
    setPage] =
    useState(1);

  const [totalPages,
    setTotalPages] =
    useState(1);

  const [search,
    setSearch] =
    useState("");

  const [status,
    setStatus] =
    useState("ALL");

  const [fromDate,
    setFromDate] =
    useState("");

  const [toDate,
    setToDate] =
    useState("");

  /* ================= FETCH ================= */

  const fetchAll = async () => {

    try {

      const [

        graphRes,

        chartRes,

        foodsRes,

        tableRes,

      ] = await Promise.all([

        /* DATE FILTER ONLY */

        getCompanyReportGraph(
          fromDate,
          toDate
        ),

        getCompanyReportChart(
          fromDate,
          toDate
        ),

        getTopSellingFoods(
          fromDate,
          toDate
        ),

        /* TABLE FILTER ONLY */

        getCompanyReportTable(

          page,

          search,

          status,

          fromDate,

          toDate

        ),

      ]);

      /* ================= GRAPH ================= */

      setGraphData(
        graphRes?.data || []
      );

      /* ================= CHART ================= */

      setChartData(

        chartRes?.data
          ?.statusChart || []

      );

      setSummary(

        chartRes?.data
          ?.summary || {}

      );

      setStatusCard(

        chartRes?.data
          ?.statusCard || {}

      );

      /* ================= FOODS ================= */

      setTopFoods(
        foodsRes?.data || []
      );

      /* ================= TABLE ================= */

      setTableData(
        tableRes?.data || []
      );

      setTotalPages(

        tableRes?.pagination
          ?.totalPages || 1

      );

    } catch (err) {

      console.log(err);

    }

  };

  /* ================= LOAD ================= */

  useEffect(() => {

    fetchAll();

  }, [

    page,

    search,

    status,

    fromDate,

    toDate,

  ]);

  /* ================= EXPORT ================= */

  const handleExport = () => {

    const worksheet =
      XLSX.utils.json_to_sheet(
        tableData
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(

      workbook,

      worksheet,

      "Reports"

    );

    XLSX.writeFile(

      workbook,

      "company_reports.xlsx"

    );

  };

  const handleResetFilters = () => {
  setFromDate("");
   setToDate("");
};

  return (

    <CompanyLayout>

      <div className="
        space-y-8
      ">

        {/* ================= HEADER ================= */}

        <div className="
          flex
          flex-col
          lg:flex-row
          justify-between
          gap-5
        ">

          <div>

            <h1 className="
              text-4xl
              font-black
              text-slate-800
            ">

              Reports

            </h1>

            <p className="
              text-gray-500
              mt-2
            ">

              Track your company performance

            </p>

          </div>

          {/* DATE FILTER */}

          <div className="
            flex
            items-center
            gap-3

            bg-white

            p-3

            rounded-3xl

            border
            border-orange-100
          ">

            <input
              type="date"
              value={fromDate}
              onChange={(e) => {

                setPage(1);

                setFromDate(
                  e.target.value
                );

              }}

              className="
                px-4
                py-3

                rounded-2xl

                border
                border-orange-200

                outline-none
              "
            />

            <input
              type="date"
              value={toDate}
              onChange={(e) => {

                setPage(1);

                setToDate(
                  e.target.value
                );

              }}

              className="
                px-4
                py-3

                rounded-2xl

                border
                border-orange-200

                outline-none
              "
            />
            <button
  onClick={handleResetFilters}
  title="Reset Filters"
  className="
    h-11
    w-11
    rounded-2xl
    border
    border-gray-200
    bg-white
    flex
    items-center
    justify-center
    text-orange-500
    hover:bg-orange-50
    hover:border-orange-300
    transition-all
    duration-200
  "
>
  <RotateCcw size={18} />
</button>

          </div>

        </div>

        {/* ================= SUMMARY ================= */}

        <div className="
          grid
          grid-cols-2
          lg:grid-cols-4
          gap-5
        ">

          {/* REVENUE */}

          <div className="
            bg-orange-500

            rounded-[28px]

            p-6

            text-white
          ">

            <p className="
              text-sm
              text-orange-100
            ">

              Total Revenue

            </p>

            <h2 className="
              text-4xl
              font-black
              mt-3
            ">

              ₹
              {Number(

                summary.totalRevenue || 0

              ).toFixed(2)}

            </h2>

          </div>

          {/* ORDERS */}

          <div className="
            bg-orange-400

            rounded-[28px]

            p-6

            text-white
          ">

            <p className="
              text-sm
              text-orange-100
            ">

              Total Orders

            </p>

            <h2 className="
              text-4xl
              font-black
              mt-3
            ">

              {summary.totalOrders || 0}

            </h2>

          </div>

          {/* CUSTOMERS */}

          <div className="
            bg-orange-300

            rounded-[28px]

            p-6

            text-white
          ">

            <p className="
              text-sm
              text-orange-100
            ">

              Customers

            </p>

            <h2 className="
              text-4xl
              font-black
              mt-3
            ">

              {summary.totalCustomers || 0}

            </h2>

          </div>

          {/* AVG */}

          <div className="
            bg-orange-600

            rounded-[28px]

            p-6

            text-white
          ">

            <p className="
              text-sm
              text-orange-100
            ">

              Avg Order

            </p>

            <h2 className="
              text-4xl
              font-black
              mt-3
            ">

              ₹
              {Number(

                summary.averageOrderValue || 0

              ).toFixed(2)}

            </h2>

          </div>

        </div>

        {/* ================= CHARTS ================= */}

        <div className="
          grid
          lg:grid-cols-2
          gap-6
        ">

          {/* REVENUE GRAPH */}

          <div className="
            bg-white

            rounded-[28px]

            p-6

            border
            border-orange-100
          ">

            <h2 className="
              text-xl
              font-bold
              mb-5
            ">

              Revenue Trend

            </h2>

            <ResponsiveContainer
              width="100%"
              height={280}
            >

              <BarChart
                data={graphData}
              >

                <XAxis
                  dataKey="date"
                />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="revenue"
                  fill="#f97316"
                  radius={[10,10,0,0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

          {/* STATUS CHART */}

          <div className="
            bg-white

            rounded-[28px]

            p-6

            border
            border-orange-100
          ">

            <h2 className="
              text-xl
              font-bold
              mb-5
            ">

              Order Status

            </h2>

            <ResponsiveContainer
              width="100%"
              height={280}
            >

              <PieChart>

                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >

                  {chartData.map(

                    (item, i) => (

                    <Cell

                      key={
                        item.name || i
                      }

                      fill={
                        COLORS[
                          i % COLORS.length
                        ]
                      }

                    />

                  ))}

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* ================= TOP FOODS ================= */}

        <div className="
          bg-white

          rounded-[28px]

          p-6

          border
          border-orange-100
        ">

          <h2 className="
            text-xl
            font-bold
            mb-6
          ">

            Top Selling Foods

          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <BarChart
              data={topFoods}
              layout="vertical"
            >

              <XAxis type="number" />

              <YAxis
                type="category"
                dataKey="name"
              />

              <Tooltip />

              <Bar
                dataKey="sold"
                fill="#f97316"
                radius={[0,12,12,0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

        {/* ================= FILTER SECTION ================= */}

        <div className="
          flex
          flex-col
          lg:flex-row

          items-center
          justify-between

          gap-5
        ">

          {/* STATUS CARD */}

          <div className="
            min-w-[250px]

            bg-orange-500

            text-white

            rounded-[28px]

            px-7
            py-6
          ">

            <p className="
              text-sm
              uppercase
              text-orange-100
            ">

              {statusCard.title}

            </p>

            <h2 className="
              text-5xl
              font-black
              mt-2
            ">

              {statusCard.count || 0}

            </h2>

            <p className="
              mt-3
              text-xl
              font-bold
            ">

              ₹
              {Number(

                statusCard.revenue || 0

              ).toFixed(2)}

            </p>

          </div>

          {/* FILTERS */}

          <div className="
            flex
            flex-wrap

            items-center

            gap-4

            flex-1
            justify-end
          ">

            {/* SEARCH */}

            <input
              type="text"
              placeholder="Search customer or order..."
              value={search}
              onChange={(e) => {

                setPage(1);

                setSearch(
                  e.target.value
                );

              }}

              className="
                h-[58px]
                w-[320px]

                rounded-full

                border
                border-orange-200

                px-6

                outline-none

                focus:border-orange-500
              "
            />

            {/* STATUS */}

            <select
              value={status}
              onChange={(e) => {

                setPage(1);

                setStatus(
                  e.target.value
                );

              }}

              className="
                h-[58px]

                rounded-full

                border
                border-orange-200

                px-6

                font-semibold

                outline-none
              "
            >

              <option value="ALL">
                All Status
              </option>

              <option value="PENDING">
                Pending
              </option>

              <option value="CONFIRMED">
                Confirmed
              </option>

              <option value="PREPARING">
                Preparing
              </option>

              <option value="OUT_FOR_DELIVERY">
                Out For Delivery
              </option>

              <option value="DELIVERED">
                Delivered
              </option>

              <option value="REJECTED">
                Rejected
              </option>

            </select>

            {/* EXPORT */}

            <button
              onClick={handleExport}

              className="
                h-[58px]

                px-8

                rounded-full

                bg-orange-500

                hover:bg-orange-600

                text-white
                font-bold

                duration-300
              "
            >

              Export Excel

            </button>

          </div>

        </div>

        {/* ================= TABLE ================= */}

        <div className="
          bg-white

          rounded-[28px]

          p-5

          overflow-x-auto

          border
          border-orange-100
        ">

          <table className="
            w-full
            border-separate
            border-spacing-y-4
          ">

            <thead>

              <tr className="
                text-gray-500
              ">

                <th className="
                  text-left
                  p-4
                ">

                  Order

                </th>

                <th className="
                  text-center
                ">

                  Customer

                </th>

                <th className="
                  text-center
                ">

                  Status

                </th>

                <th className="
                  text-center
                ">

                  Foods

                </th>

                <th className="
                  text-center
                ">

                  Total

                </th>

                <th className="
                  text-center
                ">

                  Date

                </th>

              </tr>

            </thead>

            <tbody>

              {tableData.map(

                (item, index) => (

                <tr

                  key={
                    item.id || index
                  }

                  className="
                    bg-orange-50

                    hover:bg-orange-100

                    duration-300
                  "
                >

                  <td className="
                    p-5
                    rounded-l-3xl
                    font-bold
                  ">

                    #{item.id}

                  </td>

                  <td className="
                    text-center
                    font-medium
                  ">

                    {item.customer}

                  </td>

                  <td className="
                    text-center
                    font-semibold
                  ">

                    {item.status}

                  </td>

                  <td className="
                    text-center
                  ">

                    {item.foods}

                  </td>

                  <td className="
                    text-center
                    text-orange-600
                    font-bold
                  ">

                    ₹
                    {Number(
                      item.total
                    ).toFixed(2)}

                  </td>

                  <td className="
                    text-center
                    rounded-r-3xl
                  ">

                    {item.date}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </CompanyLayout>

  );

};

export default CompanyReports;

