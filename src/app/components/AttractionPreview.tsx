// import React from 'react';
// import Image from 'next/image';

// interface AttractionPreviewProps {
//   title: string;
//   slug: string;
//   shortDescription: string;
//   description: string;
//   imageUrl: string;
//   location: string;
// }

// const AttractionPreview: React.FC<AttractionPreviewProps> = ({ title, description, imageUrl, location }) => {
//   return (
//     <div className="bg-white shadow-md rounded-lg overflow-hidden w-full md:w-64">
//       <Image 
//         src={imageUrl} 
//         alt={title} 
//         width={256} 
//         height={144} 
//         className="object-cover"
//       />
//       <div className="p-4">
//         <h3 className="text-lg font-semibold">{title}</h3>
//         <p className="text-sm text-gray-600">{location}</p>
//         <p className="text-sm mt-2">{description}</p>
//       </div>
//     </div>
//   );
// };

// export default AttractionPreview;

'use client'; // If you plan to use this component in a client context (like sliders)

import React from 'react';
import Image from 'next/image';

interface AttractionPreviewProps {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
  location: string | null;
}

const AttractionPreview: React.FC<AttractionPreviewProps> = ({
  title,
  description,
  imageUrl,
  location,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden w-full md:w-64">
      <div className="relative w-full h-36">
        <Image
          src={imageUrl || '/default-image.jpg'}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 256px"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {location && <p className="text-sm text-gray-600">{location}</p>}
        <p className="text-sm mt-2 line-clamp-3">{description}</p>
      </div>
    </div>
  );
};

export default AttractionPreview;
