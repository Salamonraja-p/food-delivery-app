import { useLocation, useNavigate } from "react-router-dom";

import { useState } from "react";

import { resetPassword } from "../../services/authService";


const ResetPassword = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const email = location.state?.email;

  const [form, setForm] = useState({
    otp: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await resetPassword({
        email,

        otp: form.otp,

        password: form.password,
      });

      toast.success("Password Reset Successful");

      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div
      className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-[var(--color-bg)]
    "
    >
      <form
        onSubmit={handleSubmit}
        className="
          bg-[var(--color-card)]
          p-10
          rounded-3xl
          shadow-xl
          w-full
          max-w-md
          space-y-5
        "
      >
        <h1
          className="
          text-4xl
          font-black
        "
        >
          Reset Password
        </h1>

        <input
          type="text"
          name="otp"
          placeholder="Enter OTP"
          value={form.otp}
          onChange={handleChange}
          required
          className="
            w-full
            h-14
            rounded-2xl
            border
            border-[var(--color-border)]
            px-5
            outline-none
          "
        />

        <input
          type="password"
          name="password"
          placeholder="New Password"
          value={form.password}
          onChange={handleChange}
          required
          className="
            w-full
            h-14
            rounded-2xl
            border
            border-[var(--color-border)]
            px-5
            outline-none
          "
        />

        <button
          className="
            w-full
            h-14
            bg-[var(--color-primary)]
            hover:bg-[var(--color-primary-hover)]
            text-white
            rounded-2xl
            font-bold
          "
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
