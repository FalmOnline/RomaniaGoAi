
// import { notFound } from 'next/navigation';
// import Image from 'next/image';

// async function getAttraction(slug: string) {
//   const res = await fetch(`http://localhost:5000/api/attractions`, { cache: 'no-store' });
//   const data = await res.json();
//   // Find the attraction with the matching slug
//   return data.find((item: any) => item.slug === slug) || null;
// }

// function getDescriptionText(description: any) {
//   if (!Array.isArray(description)) return '';
//   return description
//     .map(paragraph =>
//       Array.isArray(paragraph.children)
//         ? paragraph.children.map(child => child.text).join('')
//         : ''
//     )
//     .join('\n');
// }

// export default async function AttractionPage({ params }: { params: { slug: string } }) {
//   const attraction = await getAttraction(params.slug);

//   if (!attraction) return notFound();

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-4">{attraction.title}</h1>
//       {attraction.image?.formats?.medium?.url && (
//         <Image
//           src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${attraction.image.formats.medium.url}`}
//           alt={attraction.title}
//           width={750}
//           height={499}
//           className="rounded mb-4"
//         />
//       )}
//       <p className="mb-2 text-gray-700">{attraction.shortDescription}</p>
//       <div className="mb-4 whitespace-pre-line">
//         {getDescriptionText(attraction.description)}
//       </div>
//       {/* Add more fields as needed */}
//     </div>
//   );
// }



import { notFound } from 'next/navigation';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

async function getAttraction(slug: string) {
  const res = await fetch(`http://localhost:5000/api/attractions`, { cache: 'no-store' });
  const data = await res.json();
  return data.find((item: any) => item.slug === slug) || null;
}

function getDescriptionText(description: any) {
  if (!Array.isArray(description)) return '';
  return description
    .map(paragraph =>
      Array.isArray(paragraph.children)
        ? paragraph.children.map(child => child.text).join('')
        : ''
    )
    .join('\n');
}

export default async function AttractionPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const attraction = await getAttraction(slug);

  if (!attraction) return notFound();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{attraction.title}</h1>
      {attraction.image?.formats?.medium?.url && (
        <Image
          src={`${attraction.image.formats.medium.url}`}
          alt={attraction.title}
          width={750}
          height={499}
          className="rounded mb-4"
        />
      )}
      <p className="mb-2 text-gray-700">{attraction.shortDescription}</p>
      <div className="mb-4 whitespace-pre-line">
        {getDescriptionText(attraction.description)}
      </div>
    </div>
  );
}

