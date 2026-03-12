import React from "react";

import { AiOutlineLoading3Quarters } from "react-icons/ai";

const LoadingPageSoft = () => {
  return (
    <section className="h-screen select-none flex items-center justify-center overflow-hidden">
      <span><AiOutlineLoading3Quarters size={22} className="animate-spin" /></span>
    </section>
  );
};

export default LoadingPageSoft;
