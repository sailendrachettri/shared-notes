
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";

const AuthToggle = ({ selectedType, setSelectedType }) => {
  return (
    <>
      <div className="flex justify-center mb-8">
        <div className="relative flex bg-gray-100 rounded-xl p-1 w-fit shadow-inner">
          {/* Sliding Background */}
          <div
            className={`absolute top-1 bottom-1 w-1/2 rounded-lg bg-white shadow-md transition-all duration-300 ${
              selectedType === "signup" ? "left-1" : "left-1/2"
            }`}
          />

          {/* Signup */}
          <button
            onClick={() => setSelectedType("signup")}
            className={`relative z-10 flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
              selectedType === "signup"
                ? "text-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <FaUserPlus size={16} />
            Signup
          </button>

          {/* Sign In */}
          <button
            onClick={() => setSelectedType("signin")}
            className={`relative z-10 flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
              selectedType === "signin"
                ? "text-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <FaSignInAlt size={16} />
            Sign In
          </button>
        </div>
      </div>
    </>
  );
};

export default AuthToggle;
