// import React from 'react';
// import Image from 'next/image';

// interface EventCardProps {
//   title: string;
//   description: string;
//   imageUrl: string;
//   date: string;
//   location: string;
// }

// const EventCard: React.FC<EventCardProps> = ({ title, description, imageUrl, date, location }) => {
//   return (
//     <div className="bg-white shadow-md rounded-lg overflow-hidden w-full md:w-64">
//       <Image 
//         src={imageUrl} 
//         alt={title} 
//         width={256} 
//         height={144} 
//         layout="responsive"
//         className="object-cover"
//       />
//       <div className="p-4">
//         <h3 className="text-lg font-semibold">{title}</h3>
//         <p className="text-sm text-gray-600">{location} - {date}</p>
//         <p className="text-sm mt-2">{description}</p>
//       </div>
//     </div>
//   );
// };

// export default EventCard;

import React from 'react';
import Image from 'next/image';

interface EventCardProps {
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  location: string;
}

const EventCard: React.FC<EventCardProps> = ({ title, description, imageUrl, date, location }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden w-full md:w-64">
      <Image 
        src={imageUrl} 
        alt={title} 
        width={256} 
        height={144} 
        layout="responsive"
        className="object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-600">{location} - {date}</p>
        <p className="text-sm mt-2">{description}</p>
      </div>
    </div>
  );
};

export default EventCard;
