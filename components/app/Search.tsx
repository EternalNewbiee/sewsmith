import React from 'react';

function Search() {
  return (
    <>
        <h3 className="text-2xl font-medium mb-4 ">Search:</h3>
        <div className="mb-6 relative">
            <input
                type="text"
                placeholder="Search Products..."
                className="border border-gray-300 rounded-lg px-4 py-2 w-full pr-10"
            />
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
            </svg>
        </div>
    </>

  );
}

export default Search;
