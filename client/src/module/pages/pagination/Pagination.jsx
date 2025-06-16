// components/Pagination.jsx
import React from "react";

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null; // Don't render if only one page

  return (
    <div className="flex items-center justify-center gap-4 mt-4">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={`px-4 py-2 border rounded-md text-sm ${
          page === 1
            ? "cursor-not-allowed bg-gray-200 text-gray-500"
            : "hover:bg-gray-100 text-black"
        }`}
      >
        Prev
      </button>

      {/* Page Info */}
      <span className="text-sm font-medium">
        Page {page} of {totalPages}
      </span>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className={`px-4 py-2 border rounded-md text-sm ${
          page === totalPages
            ? "cursor-not-allowed bg-gray-200 text-gray-500"
            : "hover:bg-gray-100 text-black"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
