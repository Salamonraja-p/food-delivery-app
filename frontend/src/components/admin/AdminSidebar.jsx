import {
  LayoutDashboard,
  Building2,
  ClipboardList,
  Users,
  LogOut,
  Menu,
  X,
  CreditCard,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useState } from "react";

import {
  useAuth,
} from "../../context/AuthContext";

const AdminSidebar = () => {

  const [open,setOpen] =
    useState(false);

  const navigate =
    useNavigate();

  const { logout } =
    useAuth();

  const menus = [

    {
      name:"Dashboard",
      icon:<LayoutDashboard size={20} />,
      path:"/admin/dashboard",
    },

    {
      name:"Companies",
      icon:<Building2 size={20} />,
      path:"/admin/companies",
    },

    {
      name:"Users",
      icon:<Users size={20} />,
      path:"/admin/users",
    },

    {
      name:"Audit Logs",
      icon:<ClipboardList size={20} />,
      path:"/admin/audit-logs",
    },
    {
  name: "Subscriptions",
  icon: <CreditCard size={20} />,
  path: "/admin/subscriptions",
 },
  
    {
    name:"Reports",
    icon:<ClipboardList size={20} />, // or BarChart3
    path:"/admin/reports",
  },
  ];

  return (

    <>

      {/* MOBILE TOPBAR */}

      <div className="
        lg:hidden
        flex
        items-center
        justify-between
        px-5
        py-4
        bg-white
        border-b
        border-[var(--color-border)]
        sticky
        top-0
        z-40
      ">

        <h1 className="
          text-2xl
          font-black
          text-[var(--color-primary)]
        ">
          Super Admin
        </h1>

        <button
          onClick={() =>
            setOpen(true)
          }
        >
          <Menu size={28} />
        </button>

      </div>

      {/* OVERLAY */}

      {open && (

        <div
          onClick={() =>
            setOpen(false)
          }
          className="
            fixed
            inset-0
            bg-black/40
            z-40
            lg:hidden
          "
        />

      )}

      {/* SIDEBAR */}

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

        flex
        flex-col

        px-5
        py-6

        duration-300

        ${open
          ? "translate-x-0"
          : "-translate-x-full lg:translate-x-0"
        }

      `}>

        {/* TOP */}

        <div>

          <div className="
            flex
            items-center
            justify-between
            mb-10
          ">

            <h1 className="
              text-3xl
              font-black
              text-[var(--color-primary)]
            ">
              Super Admin
            </h1>

            <button
              onClick={() =>
                setOpen(false)
              }
              className="lg:hidden"
            >
              <X size={26} />
            </button>

          </div>

          {/* MENUS */}

          <div className="
            flex
            flex-col
            gap-2
          ">

            {menus.map((menu) => (

              <NavLink

                key={menu.name}

                to={menu.path}

                onClick={() =>
                  setOpen(false)
                }

                className={({isActive}) => `

                  flex
                  items-center
                  gap-3

                  px-4
                  py-4

                  rounded-2xl

                  font-semibold

                  transition-all
                  duration-300

                  ${isActive

                    ? `
                      bg-[var(--color-primary)]
                      text-white
                      shadow-lg
                    `

                    : `
                      text-[var(--color-text)]
                      hover:bg-[var(--color-orange-soft)]
                    `
                  }

                `}
              >

                {menu.icon}

                {menu.name}

              </NavLink>

            ))}

          </div>

        </div>

        {/* LOGOUT */}

        <button

          onClick={() => {

            logout();

            navigate("/login");

          }}

          className="
            mt-auto

            flex
            items-center
            gap-3

            px-4
            py-4

            rounded-2xl

            text-red-500

            hover:bg-red-50

            transition-all
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

export default AdminSidebar;