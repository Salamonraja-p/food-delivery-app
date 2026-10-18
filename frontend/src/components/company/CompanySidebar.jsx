import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  LogOut,
  Menu,
  CreditCard,
  BadgeCheck,
  MessageSquare,
  BarChart3,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  getCompanyTickets,
} from "../../services/ticketService";

import {
  socket,
} from "../../../socket";

const CompanySidebar = () => {

  /* ================= STATES ================= */

  const [open,
    setOpen] =
    useState(false);

  const [unreadTickets,
    setUnreadTickets] =
    useState(0);

  const navigate =
    useNavigate();

  const { logout } =
    useAuth();

  /* ================= FETCH UNREAD ================= */

const fetchUnreadTickets =
  async () => {

    try {

      const res =
        await getCompanyTickets(
          1,
          "",
          "ALL"
        );

      setUnreadTickets(
        (res?.unreadCount || 0) +
        (res?.newCount || 0)
      );

    } catch (error) {

      console.log(error);

    }

  };

  /* ================= LOAD ================= */

  useEffect(() => {

    fetchUnreadTickets();

  }, []);

  /* ================= SOCKET ================= */

  useEffect(() => {

    socket.on(
      "refresh_tickets",
      fetchUnreadTickets
    );

    return () => {

      socket.off(
        "refresh_tickets",
        fetchUnreadTickets
      );

    };

  }, []);

  /* ================= MENUS ================= */

  const menus = [

    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/company/dashboard",
    },

    {
      name: "Foods",
      icon: <UtensilsCrossed size={20} />,
      path: "/company/foods",
    },

    {
      name: "Orders",
      icon: <ShoppingBag size={20} />,
      path: "/company/orders",
    },

    {
      name: "Plans",
      icon: <CreditCard size={20} />,
      path: "/company/plans",
    },

    {
      name: "My Plan",
      icon: <BadgeCheck size={20} />,
      path: "/company/my-plan",
    },

    {
      name: "Tickets",
      icon: <MessageSquare size={20} />,
      path: "/company/tickets",
      unread: true,
    },

    {
      name: "Reports",
      icon: <BarChart3 size={20} />,
      path: "/company/reports",
    },

  ];

  return (

    <>

      {/* ================= MOBILE TOPBAR ================= */}

      <div className="
        lg:hidden
        flex
        items-center
        justify-between
        px-5
        py-4
        border-b
        border-[var(--color-border)]
        bg-white
      ">

        <h1 className="
          text-2xl
          font-black
          text-[var(--color-primary)]
        ">

          Company Panel

        </h1>

        <button
          onClick={() =>
            setOpen(!open)
          }
        >

          <Menu size={28} />

        </button>

      </div>

      {/* ================= SIDEBAR ================= */}

      <aside className={`

        fixed
        top-0
        left-0
        z-50

        h-screen
        w-[280px]

        bg-white
        border-r
        border-[var(--color-border)]

        p-6

        duration-300

        ${open
          ? "translate-x-0"
          : "-translate-x-full lg:translate-x-0"
        }

      `}>

        {/* ================= LOGO ================= */}

        <h1 className="
          text-3xl
          font-black
          mb-10
          text-[var(--color-primary)]
        ">

          Company

        </h1>

        {/* ================= MENUS ================= */}

        <div className="
          flex
          flex-col
          gap-3
        ">

          {menus.map((menu) => (

            <NavLink

              key={menu.name}

              to={menu.path}

              className={({ isActive }) => `

                flex
                items-center
                gap-3

                px-4
                py-4

                rounded-2xl

                font-semibold

                duration-300

                ${isActive

                  ? `
                    bg-[var(--color-primary)]
                    text-white
                  `

                  : `
                    hover:bg-[var(--color-orange-soft)]
                  `
                }

              `}
            >

              {/* ICON */}

              {menu.icon}

              {/* NAME + COUNT */}

              <div className="
                flex
                items-center
                justify-between
                w-full
              ">

                <span>

                  {menu.name}

                </span>

                {menu.unread &&
                  unreadTickets > 0 && (

                  <span className="
                    min-w-[22px]
                    h-5
                    px-1.5

                    rounded-full

                    bg-red-500
                    text-white

                    text-[10px]
                    font-bold

                    flex
                    items-center
                    justify-center
                  ">

                    {unreadTickets}

                  </span>

                )}

              </div>

            </NavLink>

          ))}

        </div>

        {/* ================= LOGOUT ================= */}

        <button

          onClick={() => {

            logout();

            navigate("/login");

          }}

          className="
            absolute
            bottom-8
            left-6

            flex
            items-center
            gap-3

            px-4
            py-4

            rounded-2xl

            text-red-500

            hover:bg-red-50

            duration-300
          "
        >

          <LogOut size={20} />

          Logout

        </button>

      </aside>

    </>

  );

};

export default CompanySidebar;