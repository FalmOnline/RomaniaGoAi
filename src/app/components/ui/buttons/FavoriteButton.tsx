import { Heart } from "lucide-react";

export default function FavoriteButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Save to favorites"
      className="shadow-md bg-white opacity-85 rounded-full inline-flex items-center justify-center h-10 w-10"
    >
      <Heart size={28} strokeWidth={1.2} />
    </button>
  );
}
