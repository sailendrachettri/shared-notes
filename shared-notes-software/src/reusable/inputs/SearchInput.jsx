import React from "react";
import { FiSearch, FiX } from "react-icons/fi";

const SearchInput = ({
  value,
  onChange,
  placeholder = "Search...",
  onClear,
  className = "",
}) => {
  return (
    <div
      className={`flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-primary ${className}`}
    >
      {/* Search Icon */}
      <FiSearch className="text-gray-400 text-lg" />

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
      />

      {/* Clear Button */}
      {value && (
        <button
          onClick={onClear}
          className="text-gray-400 hover:text-gray-600 transition"
        >
          <FiX className="text-lg" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;