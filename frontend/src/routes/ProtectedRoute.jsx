import {
  Navigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

const ProtectedRoute = ({children,role}) => {
const {token,user,loading,} = useAuth();

  if(loading){

    return (

      <div className="
        min-h-screen
        flex
        items-center
        justify-center
      ">

        <h1 className="
          text-3xl
          font-black
          text-[var(--color-primary)]
        ">

          Loading...

        </h1>

      </div>
    );
  }

  if(!token){
  return <Navigate to="/login" />;
  }

 if (role && user?.role !== role) {

  if (user?.role === "SUPER_ADMIN") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user?.role === "COMPANY") {
    return <Navigate to="/company/dashboard" replace />;
  }

  return <Navigate to="/" replace />;
}

  return children;
};

export default ProtectedRoute;