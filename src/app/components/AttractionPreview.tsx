import React from 'react';
import Image from 'next/image';

interface AttractionPreviewProps {
  name: string;
  description: string;
  imageUrl: string;
  location: string;
}

const AttractionPreview: React.FC<AttractionPreviewProps> = ({ name, description, imageUrl, location }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden w-full md:w-64">
      <Image 
        src={imageUrl} 
        alt={name} 
        width={256} 
        height={144} 
        layout="responsive"
        className="object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm text-gray-600">{location}</p>
        <p className="text-sm mt-2">{description}</p>
      </div>
    </div>
  );
};

export default AttractionPreview;
