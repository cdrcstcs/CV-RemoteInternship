import React from "react";

const HeaderBox = ({ type = "title", title, subtext, user }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold text-gray-900">
        {title}
        {type === "greeting" && (
          <span className="text-gradient">&nbsp;{user}</span>
        )}
      </h1>
      <p className="text-sm text-gray-600 mt-2">{subtext}</p>
    </div>
  );
};

export default HeaderBox;
