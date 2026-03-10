import { HiOutlineViewGrid } from "react-icons/hi";
import { TiHomeOutline } from "react-icons/ti";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import LoggedInUserInfoMenu from "../auth/profiles/LoggedInUserInfoMenu";
import { IoCalendarOutline } from "react-icons/io5";
import { VIEW_UPLOADED_FILE_URL } from "../../config/env";
import { HiOutlineBell } from "react-icons/hi";
import { FiLogIn } from "react-icons/fi";
import { useNotificationCount } from "../../hooks/useNotificationCount";
import { GrStorage } from "react-icons/gr";


const MiniMenu = ({
  selectedMiniTab,
  setSelectedMiniTab,
  setIsUserLoggedIn,
  userData,
  isUserLoggedIn,
  setOpenRegistrationWindow,
  setSelectedType,
}) => {
  const [showDetailsMenu, setShowDetailsMenu] = useState(false);
  const menuRef = useRef(null);
  const { notificationCount, refreshNotifications } = useNotificationCount();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowDetailsMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isUserLoggedIn) {
      setShowDetailsMenu(false);
    }
  }, [isUserLoggedIn]);

  return (
    <>
      <section className="max-w-16 mb-10 bg-white rounded-md px-2.5 relative">
        <div
          onClick={() => {
            setSelectedMiniTab("dashboard");
          }}
          className={`${selectedMiniTab == "dashboard" ? "bg-primary/10 text-primary" : "text-slate-500 cursor-pointer hover:bg-primary/5 hover:text-slate-700"}  rounded-xl p-2 mt-3`}
        >
          <TiHomeOutline size={24} />
        </div>
        <div
          onClick={() => {
            setSelectedMiniTab("notes-workspaces");
          }}
          className={`${selectedMiniTab == "notes-workspaces" ? "bg-primary/10 text-primary" : "text-slate-500 cursor-pointer hover:bg-primary/5 hover:text-slate-700"}  rounded-xl p-2 mt-3`}
        >
          <HiOutlineViewGrid size={24} />
        </div>
        <div
          onClick={() => {
            setSelectedMiniTab("reminders");
          }}
          className={`${selectedMiniTab == "reminders" ? "bg-primary/10 text-primary" : "text-slate-500 cursor-pointer hover:bg-primary/5 hover:text-slate-700"}  rounded-xl p-2 mt-3`}
        >
          <IoCalendarOutline size={22} />
        </div>
        <div
          onClick={() => {
            setSelectedMiniTab("notifications");
            refreshNotifications();
          }}
          className={`${
            selectedMiniTab == "notifications"
              ? "bg-primary/10 text-primary"
              : "text-slate-500 cursor-pointer hover:bg-primary/5 hover:text-slate-700"
          } relative rounded-xl p-2 mt-3 inline-flex items-center justify-center`}
        >
          <HiOutlineBell size={22} />

          {notificationCount > 0 && isUserLoggedIn && (
            <span className="absolute top-0 right-0 bg-primary/10 text-primary text-[9px] font-semibold px-1.5 py-0.75 rounded-full leading-none">
              {notificationCount > 99 ? "99+" : notificationCount}
            </span>
          )}
        </div>

        <div
          onClick={() => {
            setSelectedMiniTab("file-storage");
          }}
          className={`${selectedMiniTab == "file-storage" ? "bg-primary/10 text-primary" : "text-slate-500 cursor-pointer hover:bg-primary/5 hover:text-slate-700"}  rounded-xl p-2 mt-3`}
        >
          <GrStorage size={20} />
        </div>

        {/* User */}
        {isUserLoggedIn ? (
          <div ref={menuRef} className="absolute bottom-5 left-3.5">
            <div className="w-8 h-8 rounded-full overflow-hidden cursor-pointer bg-primary/10 ring-2 ring-white">
              {userData?.profile_url ? (
                <img
                  onClick={() => setShowDetailsMenu((prev) => !prev)}
                  src={`${VIEW_UPLOADED_FILE_URL}/${userData?.profile_url}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span
                  onClick={() => setShowDetailsMenu((prev) => !prev)}
                  className="w-8 h-8 rounded-full overflow-hidden 
               cursor-pointer 
               ring-2 ring-white 
               shadow-lg 
               hover:scale-105 
               transition-all duration-200
               flex items-center justify-center
               bg-primary  text-white text-xs font-semibold"
                >
                  {userData?.user_name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              )}
            </div>
            <LoggedInUserInfoMenu
              setIsUserLoggedIn={setIsUserLoggedIn}
              setShowDetailsMenu={setShowDetailsMenu}
              showDetailsMenu={showDetailsMenu}
            />
          </div>
        ) : (
          <div className="absolute bottom-7 left-4.5">
            <span
              title="Sign in"
              onClick={() => {
                setOpenRegistrationWindow(true);
                setSelectedType("signin");
              }}
              className="cursor-pointer rounded-md hover:text-slate-600 text-slate-500"
            >
              <FiLogIn size={18} />
            </span>
          </div>
        )}
      </section>
    </>
  );
};

export default MiniMenu;
