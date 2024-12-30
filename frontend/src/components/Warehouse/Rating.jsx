import React from "react";
import { Star } from "lucide-react";

const Rating = ({ rating }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((index) => (
        <Star
          key={index}
          color={index <= rating ? "#FFC107" : "#E4E5E9"} // Yellow for filled stars, light gray for empty
          className="w-4 h-4"
        />
      ))}
    </div>
  );
};

export default Rating;
