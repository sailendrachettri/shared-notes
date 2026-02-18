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
import { load } from "@tauri-apps/plugin-store";
import toast from "react-hot-toast";

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

  const handleLogoutUser = async () => {
    const store = await load("user-store.json", { autoSave: true });
    await store.delete("user");
    setIsUserLoggedIn(false);
    //  await store.clear(); // wipes everything in the store
    toast.success("Logged out successfully!");
  };

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
            SharedNotes{" "}
            <span className="font-medium text-slate-800" data-tauri-drag-region={false}>
              {isUserLoggedIn ? (
                <span onClick={handleLogoutUser} className="ps-5">
                  Hello, {userData?.user_name}
                </span>
              ) : (
                <span
                  onClick={() => {
                    setOpenRegistrationWindow(true);
                  }}
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
              Syncing{" "}
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
