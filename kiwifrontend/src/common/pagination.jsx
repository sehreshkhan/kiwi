import React, { Component } from "react";
import _ from "lodash";

const Pagination = (props) => {
  const { total, pageSize, currentPage, onPageChange } = props;
  const pagesCount = Math.ceil(total / pageSize);
  if (pagesCount === 1) return null;
  const pages = _.range(1, pagesCount + 1);

  return (
    <nav>
      <ul className="pagination justify-content-end">
        {pages.map((p) => {
          return (
            <li
              key={p}
              className={p === currentPage ? "page-item active" : "page-item"}
            >
              <a className="page-link" onClick={() => onPageChange(p)}>
                {p}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Pagination;
