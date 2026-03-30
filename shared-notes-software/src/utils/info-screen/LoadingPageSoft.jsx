import React from "react";

import { AiOutlineLoading3Quarters } from "react-icons/ai";

const LoadingPageSoft = ({label}) => {
  return (
    <section className="min-h-[70vh] select-none justify-center overflow-hidden flex items-center flex-col">
      <div>
        <AiOutlineLoading3Quarters size={22} className="animate-spin" />
      </div>
      <div className="pt-2 text-xs text-slate-600">{label || ""}</div>
    </section>
  );
};

export default LoadingPageSoft;
