import { Star } from "lucide-react";

export default function RatingBadge({ rating, peopleRating }) {
  return (
    <div className="bg-rg-black-5 text-black flex flex-row gap-1 px-3 py-2 rounded-3xl text-sm items-center">
      <span className="text-rg-primary-yellow">
        <Star size={18} />
      </span>
      {rating}
      <span className="text-rg-black-50">({peopleRating})</span>
    </div>
  );
}
