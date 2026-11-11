import { Star } from "lucide-react";

export default function ApartmentRating({
  rating,
  size = 16,
}: {
  rating: number;
  size?: number;
}) {
  if (rating < 1 || rating > 5) return null;

  return (
    <div
      className="flex items-center gap-1 text-amber-500"
      role="img"
      aria-label={`Rentlattice rating: ${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={size}
          fill={index < rating ? "currentColor" : "none"}
          aria-hidden="true"
        />
      ))}
      <span className="ml-1 text-sm font-medium text-gray-700">{rating}/5</span>
    </div>
  );
}
