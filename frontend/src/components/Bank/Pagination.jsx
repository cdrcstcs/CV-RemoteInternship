import React from "react";

const Pagination = ({ page, totalPages }) => {
  const handleNavigation = (type) => {
    const pageNumber = type === "prev" ? page - 1 : page + 1;

    // Replace this with your custom URL handling if needed.
    const newUrl = `?page=${pageNumber}`;

    // This is for updating the URL in the browser manually.
    window.history.pushState({}, "", newUrl);
  };

  return (
    <div className="flex justify-between gap-3">
      <button
        className="flex items-center p-0 hover:bg-transparent disabled:opacity-50"
        onClick={() => handleNavigation("prev")}
        disabled={Number(page) <= 1}
      >
        <img
          src="/icons/arrow-left.svg"
          alt="arrow"
          width={20}
          height={20}
          className="mr-2"
        />
        Prev
      </button>
      <p className="text-sm flex items-center px-2">
        {page} / {totalPages}
      </p>
      <button
        className="flex items-center p-0 hover:bg-transparent disabled:opacity-50"
        onClick={() => handleNavigation("next")}
        disabled={Number(page) >= totalPages}
      >
        Next
        <img
          src="/icons/arrow-left.svg"
          alt="arrow"
          width={20}
          height={20}
          className="ml-2 -scale-x-100"
        />
      </button>
    </div>
  );
};

export default Pagination;
