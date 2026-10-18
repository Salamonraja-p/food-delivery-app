import { useState }
from "react";
import {forgotPassword} from "../../services/authService";
import { toast } from "react-toastify";
import {
  useNavigate,
} from "react-router-dom";

const ForgotPassword = () => {

  const navigate =useNavigate();

  const [email,
    setEmail] =
    useState("");

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {
        await forgotPassword(email);
        toast.success(
          "OTP Sent"
        );

        navigate(
          "/reset-password",
          {
            state:{ email },
          }
        );

      } catch (error) {

        toast.error(

          error?.response?.data?.message
        );
      }
    };

  return (

    <div className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-[var(--color-bg)]
    ">

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

        <h1 className="
          text-4xl
          font-black
        ">
          Forgot Password
        </h1>

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e)=>
            setEmail(e.target.value)
          }
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
          Send OTP
        </button>

      </form>

    </div>
  );
};

export default ForgotPassword;