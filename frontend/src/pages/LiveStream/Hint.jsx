import { useState } from "react";

const Hint = ({ label, children, asChild, side, align }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Tailwind classes for tooltip positioning and styling
  const tooltipClasses = `
    absolute z-10 bg-transparent text-emerald-400 text-sm p-2 rounded-md 
    border-2 border-white shadow-lg transition-opacity opacity-0 
    ${isVisible ? 'opacity-100' : ''}
    ${side === 'top' ? 'bottom-full mb-2' : ''}
    ${side === 'bottom' ? 'top-full mt-2' : ''}
    ${align === 'left' ? 'left-0' : ''}
    ${align === 'right' ? 'right-0' : ''}
    ${align === 'center' ? 'left-1/2 transform -translate-x-1/2' : ''}
  `;

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={tooltipClasses}>
          <p className="font-semibold">{label}</p>
        </div>
      )}
    </div>
  );
};

export default Hint;
