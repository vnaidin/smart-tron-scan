import React from 'react';
import { Pagination } from 'react-bootstrap';
import PropTypes from 'prop-types';

export default function TransactionsPagination({ total, currentPage, setCurrentPage }) {
  const paginationItems = Array(total ? Math.round(total / 50) + 1 : 1).fill(0).map((x, i) => (
    // eslint-disable-next-line react/no-array-index-key
    <Pagination.Item key={`page-${i}`} active={i === currentPage} onClick={() => setCurrentPage(i)}>
      {i}
    </Pagination.Item>
  )).slice(currentPage, currentPage + 3);
  return (
    <Pagination
      style={{ width: 'auto' }}
      className="my-0 mx-2 align-items-center"
      size="sm"
    >
      <Pagination.First onClick={() => setCurrentPage(1)} />
      <Pagination.Prev onClick={() => setCurrentPage((prev) => prev - 1)} />
      {paginationItems}
      <Pagination.Next onClick={() => setCurrentPage((prev) => prev + 1)} />
      <Pagination.Last onClick={() => setCurrentPage(Math.floor(total / 50))} />
    </Pagination>
  );
}

TransactionsPagination.defaultProps = {
  total: 0,
  currentPage: 0,
};

TransactionsPagination.propTypes = {
  total: PropTypes.number,
  currentPage: PropTypes.number,
  setCurrentPage: PropTypes.func.isRequired,
};
