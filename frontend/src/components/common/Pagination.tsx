import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface IPagination {
  totalPages: number;
  currentPage: number;
  handlePrevPage: () => void;
  handleCurrentPage: (page: number) => void;
  handleNextPage: () => void;
}

const Pagination: React.FC<IPagination> = ({
  totalPages,
  currentPage = 1,
  handleCurrentPage,
  handleNextPage,
  handlePrevPage,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between px-6 py-4 bg-white rounded-2xl shadow-lg mt-6">
        <button
          className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
          onClick={handlePrevPage}
          disabled={currentPage === 1}>
          <FaChevronLeft className="w-4 h-4" /> Previous
        </button>

        <div className=" flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handleCurrentPage(page)}
              className={`w-8 h-8 rounded-full ${
                currentPage === page ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"
              }`}>
              {page}
            </button>
          ))}
        </div>

        <button
          className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}>
          Next <FaChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
