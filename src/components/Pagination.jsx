import React from "react";

const Pagination = ({ currentPage, totalPages, pageSize, onPageChange, onPageSizeChange }) => {
  if (!totalPages || totalPages <= 1) {
    // still show control for page size if many results
    return (
      <div className="pagination">
        <div className="pagination__size">
          <label htmlFor="page-size">Per page</label>
          <select id="page-size" value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>
    );
  }

  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  return (
    <nav className="pagination" aria-label="Pagination">
      <div className="pagination__controls">
        <button
          className="btn"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          Prev
        </button>

        {pages.map((p) => (
          <button
            key={p}
            className={`btn ${p === currentPage ? "btn--active" : ""}`}
            onClick={() => onPageChange(p)}
            aria-current={p === currentPage ? "page" : undefined}
          >
            {p}
          </button>
        ))}

        <button
          className="btn"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          Next
        </button>
      </div>

      <div className="pagination__size">
        <label htmlFor="page-size">Per page</label>
        <select id="page-size" value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>
    </nav>
  );
};

export default Pagination;
