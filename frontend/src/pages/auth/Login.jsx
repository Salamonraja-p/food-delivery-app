import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../services/authService";
import burgerImage from "../../assets/burger.png";
import { toast } from "react-toastify";
import {useAuth} from "../../context/AuthContext";

const Login = () => {

  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] =useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response =await loginUser(form);

      login(response.token,response.user);

      if (
        response.user.role ===
        "SUPER_ADMIN"
      ) {

        toast.success(
          "Super Admin Login successful"
        );

        navigate(
          "/admin/dashboard"
        );

      } else if (
        response.user.role ===
        "COMPANY"
      ) {

        toast.success(
          "Company Admin Login successful"
        );

        navigate(
          "/company/dashboard"
        );

      } else {

        toast.success(
          "Login successful"
        );

        navigate("/");
      }

    } catch (err) {

      const message =
        err?.response?.data?.message ||
        "Login failed";

      setError(message);

      toast.error(message);

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="w-full min-h-screen bg-[var(--color-bg)] overflow-y-auto xl:flex xl:items-center xl:justify-center">

      {/* MAIN CONTAINER */}

      <div
        className="
          w-full
          min-h-screen
          md:min-h-screen
          bg-[var(--color-card)]
          flex
          flex-col
          xl:flex-row
          xl:max-w-6xl
          xl:min-h-[90vh]
          xl:rounded-[28px]
          overflow-hidden
          shadow-[0_10px_40px_rgba(0,0,0,0.08)]
        "
      >

        {/* LEFT SIDE */}

        <div
          className="
            w-full
            xl:w-1/2
            bg-[var(--color-primary)]
            relative
            flex
            items-end
            min-h-[220px]
            md:min-h-[420px]
            xl:min-h-[620px]
          "
        >

          {/* HEADER TEXT */}

          <div
            className="
              absolute
              top-8
              left-6
              z-10
              max-w-[60%]
            "
          >

            <h1 className="text-white text-4xl xl:text-5xl font-black leading-tight">

              Food

            </h1>

            <h1 className="text-white text-4xl xl:text-5xl font-black leading-tight">

              Delivery App

            </h1>

          </div>

          {/* BURGER IMAGE */}

          <img
            src={burgerImage}
            alt="burger.png"
            className="
              absolute
              right-4
              bottom-0

              w-[110px]

              sm:w-[130px]

              md:w-[170px]

              xl:static
              xl:w-[340px]

              object-contain

              drop-shadow-[0_20px_40px_rgba(255,107,0,0.35)]
            "
          />

        </div>

        {/* RIGHT SIDE */}

        <div className="w-full xl:w-1/2 flex items-center justify-center bg-[var(--color-card)] px-5 sm:px-8 py-8 md:py-10 xl:py-0">

          <div className="w-full max-w-[380px]">

            {/* TITLE */}

            <h2 className="text-[28px] md:text-[32px] font-black text-[var(--color-text)] mt-4 mb-3 text-center xl:text-left">

              Welcome Back

            </h2>

            {/* SUBTITLE */}

            <p className="text-[var(--color-text-light)] text-[15px] mb-8 text-center xl:text-left">

              Login and order your favorite foods instantly.

            </p>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >

              {/* EMAIL */}

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="
                  h-[52px]
                  px-4
                  rounded-2xl
                  border
                  border-[var(--color-border)]
                  bg-white
                  text-[var(--color-text)]
                  placeholder:text-[var(--color-placeholder)]
                  outline-none
                  focus:border-[var(--color-primary)]
                  transition-all
                "
              />

              {/* PASSWORD */}

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="
                  h-[52px]
                  px-4
                  rounded-2xl
                  border
                  border-[var(--color-border)]
                  bg-white
                  text-[var(--color-text)]
                  placeholder:text-[var(--color-placeholder)]
                  outline-none
                  focus:border-[var(--color-primary)]
                  transition-all
                "
              />

              {/* FORGOT PASSWORD */}

              <div className="flex justify-end -mt-1">

                <Link
                  to="/forgot-password"
                  className="
                    text-[14px]
                    text-[var(--color-primary)]
                    font-semibold
                    hover:underline
                  "
                >

                  Forgot Password?

                </Link>

              </div>

            

              <button
                type="submit"
                disabled={loading}
                className="
                  h-[52px]
                  bg-[var(--color-primary)]
                  hover:bg-[var(--color-primary-hover)]
                  rounded-2xl
                  text-white
                  font-bold
                  transition-all
                  duration-300
                  hover:scale-[1.01]
                  shadow-lg
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >

                {loading
                  ? "Please wait..."
                  : "Login"}

              </button>

              {/* REGISTER LINKS */}

              <div className="text-center text-[14px] text-[var(--color-text-light)] flex flex-col gap-3 mt-2">

                <p>

                  Don’t have a user account?

                  <Link
                    to="/register"
                    className="text-[var(--color-primary)] font-semibold ml-1 hover:underline"
                  >

                    User Register

                  </Link>

                </p>

                <p>

                  Register your company?

                  <Link
                    to="/company-register"
                    className="text-[var(--color-primary)] font-semibold ml-1 hover:underline"
                  >

                    Company Register

                  </Link>

                </p>

              </div>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;