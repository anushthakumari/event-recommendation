import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const maxVisiblePages = 5;

  const renderPageButtons = () => {
    const pageButtons = [];
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageButtons.push(renderPageButton(i));
      }
    } else {
      let startPage = Math.max(1, currentPage - halfVisiblePages);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (currentPage <= halfVisiblePages) {
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - halfVisiblePages) {
        startPage = totalPages - maxVisiblePages + 1;
      }

      for (let i = startPage; i <= endPage; i++) {
        pageButtons.push(renderPageButton(i));
      }

      if (startPage > 1) {
        pageButtons.unshift(renderEllipsis());
      }
      if (endPage < totalPages) {
        pageButtons.push(renderEllipsis());
      }

      if(startPage > halfVisiblePages){
        pageButtons.unshift(renderPageButton(1))
      }

      if(endPage < (totalPages - halfVisiblePages)){
        pageButtons.push(renderPageButton(totalPages))
      }
    }

    return pageButtons;
  };

  const renderPageButton = (pageNumber) => (
    <button
      key={pageNumber}
      className={`px-3 py-2 mx-1 bg-blue-500 text-white rounded-md focus:outline-none ${
        currentPage === pageNumber ? "bg-gray-700" : ""
      }`}
      onClick={() => onPageChange(pageNumber)}
    >
      {pageNumber}
    </button>
  );

  const renderEllipsis = () => (
    <span key="ellipsis" className="mx-1">
      ...
    </span>
  );

  return (
    <div className="flex justify-center my-4">
      <nav className="flex">
        <button
          className="px-3 py-2 bg-gray-200 rounded-l-md focus:outline-none"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>

        {renderPageButtons()}

        <button
          className="px-3 py-2 bg-gray-200 rounded-r-md focus:outline-none"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </nav>
    </div>
  );
};


export default Pagination;
