import React from "react";
// import { getCurrentWindow, LogicalSize, PhysicalSize } from "@tauri-apps/api/window";
// const appWindow = getCurrentWindow();

// await appWindow.setSize(new LogicalSize(200, 200));

// --- Set size using PhysicalSize (raw pixels, ignores DPI) ---
// await appWindow.setSize(new PhysicalSize(1200, 800));

const LoadingPage = () => {
  return (
    <>
      <section data-tauri-drag-region className="h-screen flex items-center justify-center">
        <div className="loader"></div>
      </section>
    </>
  );
};

export default LoadingPage;
