import React from "react";

const LoadingPage = () => {
  return (
    <>
      <section data-tauri-drag-region className="h-screen select-none flex items-center justify-center">
        <div className="loader"></div>
      </section>
    </>
  );
};

export default LoadingPage;
