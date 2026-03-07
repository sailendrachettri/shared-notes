import { HiOutlineLockClosed } from "react-icons/hi2";
import { FiLogIn } from "react-icons/fi";

const LoginRequired = ({
  title = "Sign in Required",
  description = "Please sign in to access this page.",
  buttonText = "Sign in",
  onLoginClick,
}) => {
  return (
    <div className="w-full h-full bg-white flex items-center justify-center p-6">
      <div className="text-center">

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-slate-100">
            <HiOutlineLockClosed className="text-2xl text-slate-600" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-slate-800 mb-2">
          {title}
        </h2>

        {/* Description */}
        <p className="text-sm text-slate-500 mb-6">
          {description}
        </p>

        {/* Button */}
        <button
          onClick={onLoginClick}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition"
        >
          <FiLogIn className="text-lg" />
          {buttonText}
        </button>

      </div>
    </div>
  );
};

export default LoginRequired;