import Image from "next/image";
import {
  Calendar,
  MapPin,
  FileText,
  Heart,
  Star,
  Clock,
  Users,
} from "lucide-react";

export default function Card({
  image,
  category,
  crowds,
  location,
  date,
  rating,
  peopleRating,
  title,
  description,
  duration,
  numberVisitors,
  tags,
}) {
  // Category label
  let Icon;
  let categoryColor;

  if (category === "event") {
    Icon = Calendar;
    categoryColor = "bg-rg-primary-amber text-white";
  } else if (category === "atraction") {
    Icon = MapPin;
    categoryColor = "bg-rg-primary-burgundy text-white";
  } else {
    Icon = FileText;
    categoryColor = "bg-rg-primary-teal text-white";
  }

  // Crowd label
  let buttonColorState;
  const success = "bg-rg-green-light-10 text-rg-primary-green";
  const warning = "bg-rg-green-light-30 text-rg-yello-dark-30";
  const danger = "bg-rg-red-light-20 text-rg-primary-green";

  const baseClasses =
    "shadow-md flex-row opacity-95 rounded-full px-3 py-1 inline-flex gap-2 items-center text-sm";

  if (crowds === "low") {
    buttonColorState = success;
  } else if ((crowds = "medium")) {
    buttonColorState = warning;
  } else {
    buttonColorState = danger;
  }

  return (
    <div className="shadow-md rounded-3xl bg-white max-w-sm overflow-hidden flex flex-col my-4 mx-4">
      <div className="capitalize relative">
        <Image
          src={image}
          alt={title}
          width={500}
          height={500}
          className="relative"
        />
        <div className="absolute top-3 z-30 px-5 py-1 flex flex-row justify-between items-center w-full">
          <div className="flex gap-2 h-8">
            <p className={`${baseClasses} ${categoryColor}`}>
              <Icon size={18} strokeWidth={1.8} /> {category}
            </p>
            <p className={`${baseClasses} ${buttonColorState}`}>
              &#9679; {crowds} crowds
            </p>
          </div>
          <p className="shadow-md bg-white opacity-85 rounded-full inline-flex items-center justify-center h-10 w-10">
            <Heart size={28} strokeWidth={1.2} />
          </p>
        </div>
      </div>
      <div className="px-4 mt-4 mb-6">
        <div className="flex justify-between items-center mb-1">
          <div className="flex flex-row gap-2 text-rg-black-50 text-sm">
            <p>{location}</p>
            <p>&#9679;</p>
            <p>{date}</p>
          </div>
          <div className="bg-rg-black-5 text-black flex flex-row gap-1 px-3 py-2 rounded-3xl text-sm items-center">
            <span className="text-rg-primary-yellow">
              <Star size={18} />
            </span>
            {rating}
            <span className="text-rg-black-50">
              {`${"(" + peopleRating + ")"}`}{" "}
            </span>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-2xl mb-2">{title}</h3>
          <p className="text-sm text-rg-black-70 mb-1">{description}</p>
        </div>
        <div className="flex justify-between py-3 mb-2 text-sm">
          <p className="flex flex-row gap-1 text-rg-black-50 items-center">
            <Clock size={18} strokeWidth={1.2} /> {duration}
          </p>
          <p className="flex flex-row gap-2 text-rg-black-50 items-center">
            <Users size={18} strokeWidth={1.2} />
            {numberVisitors} visited
          </p>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <ul className="flex gap-1 text-sm">
            <li className="border border-solid border-black-10 rounded-2xl px-3 py-1 inline-flex text-rg-black-70">
              {tags[0]}
            </li>
            <li className="border border-solid border-black-10 rounded-2xl px-3 py-1 inline-flex text-rg-black-70">
              {tags[1]}
            </li>
            <li className="border border-solid border-black-10 rounded-2xl px-3 py-1 inline-flex text-rg-black-70">
              {tags[2]}
            </li>
          </ul>
          + {tags.length - 3}
        </div>
      </div>
    </div>
  );
}
