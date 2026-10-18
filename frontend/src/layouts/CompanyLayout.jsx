import CompanySidebar from "../components/company/CompanySidebar";

const CompanyLayout = ({
  children,
}) => {

  return (

    <div className="min-h-screen bg-[var(--color-bg)]">
      <CompanySidebar />
      <main className="lg:ml-[280px] p-5">
        {children}
      </main>

    </div>
  );
};

export default CompanyLayout;