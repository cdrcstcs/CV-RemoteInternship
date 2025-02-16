import React from 'react';

const Category = ({ category }) => {
  const {
    bg,
    circleBg,
    text: { main, count },
    progress: { bg: progressBg, indicator },
    icon,
  } = category.styles || {}; // Use default styles if none are provided

  return (
    <div className={`gap-[18px] flex p-4 rounded-xl ${bg}`}>
      <figure className={`flex-center size-10 rounded-full ${circleBg}`}>
        <img src={icon} width={20} height={20} alt={category.name} />
      </figure>
      <div className="flex w-full flex-1 flex-col gap-2">
        <div className="text-14 flex justify-between">
          <h2 className={`font-medium ${main}`}>{category.name}</h2>
          <h3 className={`font-normal ${count}`}>{category.count}</h3>
        </div>
        <div className={`h-2 w-full bg-gray-200 ${progressBg}`}>
          <div
            className={`h-2 ${indicator}`}
            style={{ width: `${(category.count / category.totalCount) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Category;
