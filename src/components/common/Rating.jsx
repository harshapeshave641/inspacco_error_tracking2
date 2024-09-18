import { useEffect, useState } from "react";
import { Rating } from "react-daisyui";
export default function RatingComp({ value, onChange, ...args }) {
  const [rating, setRating] = useState(value);
  return (
    <Rating
      value={rating}
      onChange={(v) => {
        setRating(v);
        onChange(v);
      }}
      {...args}
    >
      <Rating.Item name="rating-9" className="mask mask-star bg-orange-400" />
      <Rating.Item name="rating-9" className="mask mask-star bg-orange-400" />
      <Rating.Item name="rating-9" className="mask mask-star bg-orange-400" />
      <Rating.Item name="rating-9" className="mask mask-star bg-orange-400" />
      <Rating.Item name="rating-9" className="mask mask-star bg-orange-400" />
    </Rating>
  );
}
