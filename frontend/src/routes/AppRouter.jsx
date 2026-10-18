import { BrowserRouter, Routes, Route , Navigate, } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import CompanyRegister from "../pages/auth/CompanyRegister";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import Home from "../pages/user/Home";
import Checkout from "../pages/user/Checkout";
import MyOrders from "../pages/user/MyOrders";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Subscriptions from "../pages/admin/Subscriptions";
import AuditLogs from "../pages/admin/AuditLogs";
import Companies from "../pages/admin/Companies";
import UsersPage from "../pages/admin/UsersPage";
import Reports from "../pages/admin/Reports";
import CompanyReport from "../pages/admin/CompanyReport";
import SubscriptionReport from "../pages/admin/SubscriptionReport";
import RevenueReport from "../pages/admin/RevenueReport";
import PlanReport from "../pages/admin/PlanReport";
import CompanyDashboard from "../pages/company/CompanyDashboard";
import CompanyOrders from "../pages/company/CompanyOrders";
import CompanyFoods from "../pages/company/CompanyFoods";
import Plans from "../pages/company/Plans";
import MyPlan from "../pages/company/MyPlan";
import CompanyReports from "../pages/company/CompanyReports";
import CompanyTickets from "../pages/company/CompanyTickets";
import CompaniesPage from "../pages/user/CompaniesPage";
import CompanyFoodsPage from "../pages/user/CompanyFoodsPage";
import OffersPage from "../pages/user/OffersPage";
import Profile from "../pages/user/Profile";
import NotFound from "../pages/NotFound";

const AppRouter = () => {
    const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

   const getHomeRoute = () => {
    if (user?.role === "SUPER_ADMIN") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (user?.role === "COMPANY") {
      return <Navigate to="/company/dashboard" replace />;
    }

    return <Home />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={getHomeRoute()} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/company-register" element={<CompanyRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/company/tickets"
          element={<CompanyTickets user={user} />}
        />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/company/:id" element={<CompanyFoodsPage />} />
        <Route path="/offers" element={<OffersPage />} />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute role="USER">
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute role="USER">
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-orders"
          element={
            <ProtectedRoute role="USER">
              <MyOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/company/dashboard"
          element={
            <ProtectedRoute role="COMPANY">
              <CompanyDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/company/orders"
          element={
            <ProtectedRoute role="COMPANY">
              <CompanyOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/company/foods"
          element={
            <ProtectedRoute role="COMPANY">
              <CompanyFoods />
            </ProtectedRoute>
          }
        />

        <Route
          path="/company/plans"
          element={
            <ProtectedRoute role="COMPANY">
              <Plans />
            </ProtectedRoute>
          }
        />

        <Route
          path="/company/my-plan"
          element={
            <ProtectedRoute role="COMPANY">
              <MyPlan />
            </ProtectedRoute>
          }
        />

        <Route
          path="/company/reports"
          element={
            <ProtectedRoute role="COMPANY">
              <CompanyReports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="SUPER_ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/companies"
          element={
            <ProtectedRoute role="SUPER_ADMIN">
              <Companies />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="SUPER_ADMIN">
              <UsersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/audit-logs"
          element={
            <ProtectedRoute role="SUPER_ADMIN">
              <AuditLogs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/subscriptions"
          element={
            <ProtectedRoute role="SUPER_ADMIN">
              <Subscriptions />
            </ProtectedRoute>
          }
        />

        {/* REPORTS */}
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute role="SUPER_ADMIN">
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/reports/company"
          element={
            <ProtectedRoute role="SUPER_ADMIN">
              <CompanyReport />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/reports/subscriptions"
          element={
            <ProtectedRoute role="SUPER_ADMIN">
              <SubscriptionReport />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/reports/revenue"
          element={
            <ProtectedRoute role="SUPER_ADMIN">
              <RevenueReport />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/reports/plans"
          element={
            <ProtectedRoute role="SUPER_ADMIN">
              <PlanReport />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
