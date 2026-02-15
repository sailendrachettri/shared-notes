import React from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import logo from "../../../../assets/pngs/logo.png";
import {
  VscChromeMinimize,
  VscChromeMaximize,
  VscChromeRestore,
  VscChromeClose,
} from "react-icons/vsc";
import { useState } from "react";
import { useEffect } from "react";

const Navbar = () => {
  const appWindow = getCurrentWindow();
  const [isMaximized, setIsMaximized] = useState(false);
  console.log(isMaximized);

  useEffect(() => {
    const checkMaximized = async () => {
      const maximized = await appWindow.isMaximized();
      console.log(maximized)
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
    console.log(maximized)
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
          <span className="text-sm font-medium ">SharedNotes</span>
        </div>

        {/* Right side - Window Controls */}
        <div className="flex h-full">
          <button
            data-tauri-drag-region={false}
            onClick={minimize}
            className="w-10 flex items-center justify-center hover:bg-zinc-300"
          >
            <VscChromeMinimize size={14} />
          </button>

          <button
            data-tauri-drag-region={false}
            onClick={maximize}
            className="w-12 flex items-center justify-center hover:bg-zinc-300"
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
            className="w-12 flex items-center justify-center hover:bg-red-600 hover:text-white"
          >
            <VscChromeClose size={14} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
