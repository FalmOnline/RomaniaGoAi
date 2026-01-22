
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface EventCardProps {
  title: string;
  slug?: string;
  shortDescription?: string;
  description: string;  // force string, not any
  imageUrl: string;
  location?: string | null;
  date?: string;
}

const EventCard: React.FC<EventCardProps> = ({ title, slug, description, imageUrl, date, location }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden w-full md:w-64">
      <Link href={`/attractions/${slug || ''}`}>
        <Image
          src={imageUrl}
          alt={title}
          width={256}
          height={144}
          className="object-cover"
        />
      </Link>
      <div className="p-4">
        <h3 className="text-lg font-semibold">
          <Link href={`/attractions/${slug || ''}`}>{title}</Link>
        </h3>
        {(location || date) && (
          <p className="text-sm text-gray-600">
            {location ?? ''} {date ? `- ${date}` : ''}
          </p>
        )}
        {description && (
          <p className="text-sm mt-2">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default EventCard;

//         <h3 className="text-lg font-semibold"><Link href={`/events/${slug}`}>{title}</Link></h3>
//         <p className="text-sm text-gray-600">{location} - {date}</p>
//         <p className="text-sm mt-2">{description}</p>
//       </div>
//     </div>
//   );
// };

// export default EventCard;
