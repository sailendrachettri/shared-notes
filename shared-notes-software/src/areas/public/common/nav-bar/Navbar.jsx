import { getCurrentWindow } from "@tauri-apps/api/window";
import logo from "../../../../assets/pngs/logo.png";
import {
  VscChromeMinimize,
  VscChromeMaximize,
  VscChromeRestore,
  VscChromeClose,
  VscLayoutSidebarLeft,
  VscLayoutSidebarLeftOff,
} from "react-icons/vsc";
import { useState } from "react";
import { useEffect } from "react";

import LoggedInUserInfoMenu from "../../../auth/profiles/LoggedInUserInfoMenu";
import { useRef } from "react";
import { getGreeting } from "../../../../utils/greets/greetingHelper";

const Navbar = ({
  setToggleSidebar,
  toggleSidebar,
  autoFetchStatus,
  isUserLoggedIn,
  setOpenRegistrationWindow,
  userData,
  setIsUserLoggedIn,
}) => {
  const appWindow = getCurrentWindow();
  const [isMaximized, setIsMaximized] = useState(false);
  const [showDetailsMenu, setShowDetailsMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const checkMaximized = async () => {
      const maximized = await appWindow.isMaximized();
      setIsMaximized(maximized);
    };

    checkMaximized();

    const unlisten = appWindow.onResized(checkMaximized);

    return () => {
      unlisten.then((f) => f());
    };
  }, []);

  const minimize = () => appWindow.minimize();

  const maximize = async () => {
    await appWindow.toggleMaximize();
    const maximized = await appWindow.isMaximized();
    setIsMaximized(maximized);
  };

  const close = () => appWindow.close();

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

  return (
    <>
      <div
        data-tauri-drag-region
        className="h-8 flex items-center justify-between px-4 bg-[#e5e7ed] text-slate-950 select-none"
      >
        {/* Left side - Logo */}
        <div className="flex items-center gap-2 ">
          <img src={logo} className="h-6 w-auto " />
          <span className="text-sm font-medium">
            SharedNotes
            <span
              className="font-medium text-slate-800"
              data-tauri-drag-region={false}
              ref={menuRef}
            >
              {isUserLoggedIn ? (
                <span
                  onClick={() => setShowDetailsMenu(true)}
                  className="ps-5 capitalize"
                >
                  {getGreeting()}, {userData?.user_name || "Guest"}
                  <LoggedInUserInfoMenu
                    setIsUserLoggedIn={setIsUserLoggedIn}
                    setShowDetailsMenu={setShowDetailsMenu}
                    showDetailsMenu={showDetailsMenu}
                  />
                </span>
              ) : (
                <span
                  onClick={() => {
                    setOpenRegistrationWindow(true);
                  }}
                  className="ps-1"
                >
                  (UNREGISTERED)
                </span>
              )}
            </span>
          </span>
        </div>

        <div>
          {autoFetchStatus && (
            <div className="text-sm text-slate-600">
              Auto Syncing{" "}
              <span className="sync-loader">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </div>
          )}
        </div>

        {/* Right side - Window Controls */}
        <div className="flex h-full gap-x-3 items-center">
          <div>
            <span
              data-tauri-drag-region={false}
              onClick={() => {
                setToggleSidebar((prev) => !prev);
              }}
            >
              {toggleSidebar ? (
                <VscLayoutSidebarLeftOff />
              ) : (
                <VscLayoutSidebarLeft />
              )}
            </span>
          </div>
          <div className="flex h-full items-center">
            <button
              data-tauri-drag-region={false}
              onClick={minimize}
              className="w-10 h-full flex items-center justify-center hover:bg-zinc-300"
            >
              <VscChromeMinimize size={14} />
            </button>

            <button
              data-tauri-drag-region={false}
              onClick={maximize}
              className="w-12 h-full flex items-center justify-center hover:bg-zinc-300"
            >
              {isMaximized ? (
                <VscChromeRestore size={14} />
              ) : (
                <VscChromeMaximize size={14} />
              )}
            </button>

            <button
              data-tauri-drag-region={false}
              onClick={close}
              className="w-12 h-full flex items-center justify-center hover:bg-red-600 hover:text-white"
            >
              <VscChromeClose size={14} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
