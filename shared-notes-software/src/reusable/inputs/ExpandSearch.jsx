import { useState, useRef, useEffect } from "react";
import { IoSearch } from "react-icons/io5";

export default function ExpandSearch({ setSearch }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setSearch]);

  return (
    <div ref={wrapperRef} className="relative">
      <div
        className={`relative border border-slate-200 rounded-full bg-slate-50/50 overflow-hidden transition-all duration-300 ease-in-out
        ${open ? "xl:w-56 w-40" : "w-10"}
        `}
      >
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
          className={`pl-3 pr-9 py-1 text-sm outline-none bg-transparent focus:bg-white transition-all duration-300 ease-in-out
          ${open ? "opacity-100 w-full" : "opacity-0 w-0"}
          `}
        />

        <IoSearch
          size={18}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-500"
          onClick={() => setOpen(prev => !prev)}
        />
      </div>
    </div>
  );
}