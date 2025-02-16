import { useState } from "react";

const Copy = ({ title }) => {
  const [hasCopied, setHasCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(title);
    setHasCopied(true);

    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  };

  return (
    <button
      onClick={copyToClipboard}
      className="mt-3 flex max-w-[320px] gap-4 bg-gray-200 hover:bg-gray-300 rounded-md py-2 px-4"
    >
      <p className="line-clamp-1 w-full max-w-full text-xs font-medium text-gray-700">
        {title} test
      </p>

      {!hasCopied ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 w-6 h-6"
        >
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 w-6 h-6"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      )}
    </button>
  );
};

export default Copy;
