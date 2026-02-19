import { load } from "@tauri-apps/plugin-store";
import toast from "react-hot-toast";
import { IoPowerSharp } from "react-icons/io5";

const LoggedInUserInfoMenu = ({ setIsUserLoggedIn, setShowDetailsMenu }) => {
  const handleLogoutUser = async () => {
    const store = await load("user-store.json", { autoSave: true });
    await store.delete("user");
    setIsUserLoggedIn(false);
    setShowDetailsMenu(false);
    toast.success("Logged out successfully!");
  };

  return (
    <div className="absolute left-32 mt-1 w-40 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden animate-fadeIn">
      <button
        onClick={handleLogoutUser}
        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 cursor-pointer transition"
      >
        <span className="flex items-center justify-start px-1 flex-nowrap gap-x-1">
          <IoPowerSharp size={18}/> <span>Log Out</span>
        </span>
      </button>
    </div>
  );
};

export default LoggedInUserInfoMenu;
