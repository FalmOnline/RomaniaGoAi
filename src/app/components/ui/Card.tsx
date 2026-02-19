// TO DO
// Think of a way to add links to tags (to show all attractions, events etc. with that tag...)
// Implement Favorites
// Get the src for the card, so when you click on the card to be redirectd to the article
// How can we get the high crowds from Google?
// What does visited means?
// Alternative text for images in Strapi
// Add href to Card and wrap content with next/link
// Keep the Favorite button clickable without triggering navigation (stopPropagation)

import Image from "next/image";
import Badge from "./badges/Badge";
import IconText from "./badges/IconText";
import RatingBadge from "./badges/RatingBadge";
import Link from "next/link";

import { Calendar, MapPin, FileText, Clock, Users } from "lucide-react";
import FavoriteButton from "./buttons/FavoriteButton";
import TagsWithPopover from "./Tags/TagsWithPopover";

// Card type
type CategoryType = "event" | "attraction" | "article";

interface CardProps {
  title?: string;
  image?: string;
  category?: CategoryType;
  location?: string;
  rating?: string;
  peopleRating?: string;
  description?: string;
  duration?: string;
  numberVisitors?: string;
  tags?: string[];
  slug?: string;
  variant?: string;
}

// Category label

const CATEGORY = {
  event: {
    Icon: Calendar,
    className: "bg-rg-primary-amber text-white",
    label: "Event",
  },
  attraction: {
    Icon: MapPin,
    className: "bg-rg-primary-burgundy text-white",
    label: "Attraction",
  },
  article: {
    Icon: FileText,
    className: "bg-rg-primary-teal text-white",
    label: "Article",
  },
};

// Crowd label
// const CROWD = {
//   low: "bg-rg-green-light-10 text-rg-primary-green",
//   medium: "bg-rg-yellow-light-30 text-rg-yellow-dark-40",
//   high: "bg-rg-red-light-20 text-rg-primary-red",
// };

export default function Card({
  title = "",
  image = "",
  category = "attraction",
  // crowds = "low",
  location = "",
  // date = "",
  rating = "5.0",
  peopleRating = "",
  description = "",
  duration = "",
  numberVisitors = "",
  tags = [],
  slug = "",
  variant = "",
}: CardProps) {
  const categoryConfig = CATEGORY[category] ?? CATEGORY.article;
  // const crowdClass = CROWD[crowds] ?? CROWD.high;
  const CategoryIcon = categoryConfig.Icon;
  const isMinimal = variant === "minimal";

  return (
    <div className="group/card shadow-md rounded-3xl bg-white w-[352px] h-full flex flex-col my-4 border border-rg-black-10 transition-all duration-300 hover:border-rg-primary-burgundy/40 hover:shadow-[0_0_30px_-10px_rgba(139,21,56,0.3)]">
      <Link href={`/${category}s/${slug}`}>
        <div className="capitalize relative">
          <div className="relative rounded-t-3xl overflow-hidden h-[240px]">
            <Image
              src={image}
              alt={title}
              fill
              className="w-full h-auto object-cover transition-transform duration-500 group-hover/card:scale-110"
            />
          </div>
          <div className="absolute top-3 z-30 px-5 py-1 flex flex-row justify-between items-center w-full">
            <div className="flex gap-2 h-8">
              <Badge className={categoryConfig.className}>
                <CategoryIcon size={18} strokeWidth={1.8} />{" "}
                {categoryConfig.label}
              </Badge>
              {/* <Badge className={crowdClass}>&#9679; {crowds} crowds</Badge> */}
            </div>
            <FavoriteButton />
          </div>
        </div>
      </Link>
      <div className="px-4 mt-4 mb-2">
        {!isMinimal && (
          <div className="flex justify-between items-center mb-1">
            <div className="flex flex-row gap-2 text-rg-black-50 text-sm">
              <p>{location}</p>
            </div>
            <RatingBadge rating={rating} peopleRating={peopleRating} />
          </div>
        )}
        <div>
          <Link href={`/${category}s/${slug}`}>
            <h3
              className="font-bold text-2xl mb-2 whitespace-nowrap truncate max-w-80"
              title={title}
            >
              {title}
            </h3>
          </Link>
          {!isMinimal && (
            <p className="text-sm text-rg-black-70 mb-1 line-clamp-2">
              {description}
            </p>
          )}
        </div>
        {duration && numberVisitors && (
          <div className="flex justify-between py-3 mb-2 text-sm">
            <IconText Icon={Clock} className="text-rg-black-50">
              {duration}
            </IconText>
            <IconText Icon={Users} className="text-rg-black-50">
              {numberVisitors} visited
            </IconText>
          </div>
        )}

        <div className="flex flex-row gap-2 items-center text-rg-black-70 text-sm mt-4">
          <TagsWithPopover tags={tags} />
        </div>
      </div>
    </div>
  );
}
