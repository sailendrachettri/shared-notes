import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import DropdownReusable from "../../utils/dropdowns/DropdownReusable";

const Pagination = ({
  pageNo,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);

  const pageSizeOptions = [
    { label: "5", value: 5 },
    { label: "10", value: 10 },
    { label: "20", value: 20 },
    { label: "50", value: 50 },
    { label: "70", value: 70 },
    { label: "100", value: 100 },
  ];

  const selectedOption = pageSizeOptions.find((opt) => opt.value === pageSize);

  const goToPrev = () => {
    if (pageNo > 1) onPageChange(pageNo - 1);
  };

  const goToNext = () => {
    if (pageNo < totalPages) onPageChange(pageNo + 1);
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
      {/* LEFT: PAGE SIZE */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>Show</span>

        <div className="w-20">
          <DropdownReusable
            options={pageSizeOptions}
            selectedOption={selectedOption}
            setSelectedOption={(option) => {
              onPageSizeChange(option.value);
            }}
            isMultiple={false}
            placeholder="Size"
          />
        </div>

        <span>per page</span>
      </div>

      {/* RIGHT: PAGINATION */}
      <div className="flex items-center gap-2">
        <button
          onClick={goToPrev}
          disabled={pageNo === 1}
          className={`p-2 rounded-md border ${
            pageNo === 1
              ? "text-gray-300 border-slate-200 cursor-not-allowed"
              : "hover:bg-gray-100 border-slate-300 cursor-pointer"
          }`}
        >
          <FiChevronLeft />
        </button>

        {/* PAGE NUMBERS */}
        <div className="flex items-center gap-1">
          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;

            // limit visible pages (smart UI)
            if (
              page === 1 ||
              page === totalPages ||
              Math.abs(page - pageNo) <= 1
            ) {
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`px-3 py-1 text-sm rounded-md ${
                    page === pageNo
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100 cursor-pointer bg-slate-50 text-slate-700"
                  }`}
                >
                  {page}
                </button>
              );
            }

            // dots
            if (
              (page === pageNo - 2 && page > 1) ||
              (page === pageNo + 2 && page < totalPages)
            ) {
              return <span key={page}>...</span>;
            }

            return null;
          })}
        </div>

        <button
          onClick={goToNext}
          disabled={pageNo === totalPages}
          className={`p-2 rounded-md border ${
            pageNo === totalPages || totalPages === 0
              ? "text-gray-300 border-slate-200 cursor-not-allowed"
              : "hover:bg-gray-100 border-slate-300 cursor-pointer"
          }`}
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
