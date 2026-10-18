import AdminSidebar from "../components/admin/AdminSidebar";

const AdminLayout = ({children,}) => {

  return (

    <div className="
      min-h-screen
      bg-[var(--color-bg)]
    ">

      <AdminSidebar />

      <main className="
        lg:ml-[280px]
        p-5
      ">

        {children}

      </main>

    </div>
  );
};

export default AdminLayout;