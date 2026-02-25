import React from "react";
import { useRef } from "react";
import { useState } from "react";
import { FaArrowDownLong, FaArrowUpLong } from "react-icons/fa6";
import { HiOutlineSearch } from "react-icons/hi";
import { IoTimerOutline } from "react-icons/io5";
import { LuRefreshCw } from "react-icons/lu";
import { TbAbc } from "react-icons/tb";

const SearchSection = ({
  setSearchText,
  setSortBy,
  setSortDirection,
  sortBy,
  sortDirection,
  setRefresh,
}) => {
  const [pageReload, setPageReload] = useState(false);

  const searchInputRef = useRef(null);

  const handlePageRefresh = () => {
    setPageReload(true);

    setRefresh((prev) => !prev);

    setTimeout(() => {
      setPageReload(false);
    }, 2000);
  };

  // console.log(sortBy)
  // console.log(sortDirection)
  return (
    <>
      <section>
        <div className="mt-2">
          <div className="relative">
            <HiOutlineSearch
              size={17}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              ref={searchInputRef}
              onChange={(e) => setSearchText(e.target.value)}
              type="text"
              placeholder={`${pageReload ? "Syncing notes" : "Search (Ctrl+K)"} `}
              className="
        w-full
        pl-8 pr-4 py-2.5
        rounded-md
         border-none
        bg-gray-50
        text-xs
        placeholder:text-gray-400
        focus:outline-none
        focus:ring-1
        focus:ring-primary/40
        focus:border-primary
        transition
      "
            />

            <div className="flex items-center justify-start gap-x-2 flex-nowrap absolute right-3 top-1/2 -translate-y-1/2">
              {/* Sort By Title */}

              <LuRefreshCw
                size={16}
                className={`${pageReload ? "text-primary animate-spin" : "text-gray-400"} cursor-pointer`}
                onClick={handlePageRefresh}
              />
              <TbAbc
                size={21}
                className={`${sortBy === "title" ? "text-primary" : "text-gray-400"} cursor-pointer`}
                onClick={() => setSortBy("title")}
              />

              {/* Sort By Created Time */}
              <IoTimerOutline
                size={18}
                className={`${sortBy === "created_at" ? "text-primary" : "text-gray-400"} cursor-pointer`}
                onClick={() => setSortBy("created_at")}
              />

              {/* Toggle Direction */}
              <div
                onClick={() =>
                  setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
                }
                className="flex items-center cursor-pointer"
              >
                <FaArrowUpLong
                  size={11}
                  className={`transition-colors duration-200 translate-x-0.5 ${
                    sortDirection === "asc" ? "text-primary" : "text-gray-400"
                  }`}
                />

                <FaArrowDownLong
                  size={11}
                  className={`transition-colors duration-200 ${
                    sortDirection === "desc" ? "text-primary" : "text-gray-400"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SearchSection;
