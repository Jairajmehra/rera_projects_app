// app/residential/properties/[city]/[area]/[bhk]-[propertyType]-for-[transactionType]/[propertyNameSlug]/[propertyId]/page.tsx

import Link from "next/link";
import { ResidentialProperty } from "@/services/residentialPropertyService";
import { Suspense } from "react";
import ClientPropertyView from "./ClientPropertyView";
import { getResidentialPropertyById } from "@/services/residentialPropertyService";
import { formatIndianPrice } from "@/utils/Utils";
import { parsePropertyConfig } from "@/utils/Utils";

// Dynamic route segment pattern based on actual Next.js parameter naming
type Params = {
  city: string;
  area: string;
  "bhk]-[propertyType]-for-[transactionType": string; // Exact parameter name from logs
  propertyNameSlug: string;
  propertyId: string;
}

// Server-side data fetching function
async function getPropertyDetails(propertyId: string): Promise<ResidentialProperty | null> {
  try {
    const property = await getResidentialPropertyById(propertyId);
    if (!property) {
      return null;
    }
    return property;
  } catch (error) {
    console.error("Error fetching property details:", error);
    return null;
  }
}

// Extract readable info from the combined route parameter
async function parseRouteParams(params: Params | Promise<Params>) {
  // Ensure params is awaited
  const resolvedParams = await params;
  
  try {
    // Access the specific parameter directly without spreading
    const combinedSegment = resolvedParams["bhk]-[propertyType]-for-[transactionType"];
    
    // Parse the property configuration
    const { bhkCount, propertyType, transactionType } = parsePropertyConfig(combinedSegment);
    
    return {
      city: resolvedParams.city,
      area: resolvedParams.area,
      propertyId: resolvedParams.propertyId,
      propertyNameSlug: resolvedParams.propertyNameSlug,
      bhkCount,
      propertyType,
      transactionType
    };
  } catch (error: any) {
    // Production fallback with minimal logging
    console.error("Error parsing route parameters:", error.message || String(error));
    return {
      city: resolvedParams.city,
      area: resolvedParams.area,
      propertyId: resolvedParams.propertyId,
      propertyNameSlug: resolvedParams.propertyNameSlug,
      bhkCount: "Unknown",
      propertyType: "Unknown",
      transactionType: "Unknown"
    };
  }
}

export async function generateMetadata({ params }: { params: Params | Promise<Params> }) {
  // Parse parameters and await the result
  const parsedParams = await parseRouteParams(params);
  const { city, area, propertyId, bhkCount, propertyType, transactionType } = parsedParams;
  
  const property = await getPropertyDetails(propertyId);
  
  if (!property) {
    return {
      title: "Property Not Found",
      description: "The requested property could not be found."
    };
  }
  
  return {
    metadataBase: new URL('https://www.propview.ai'),
    title: `${bhkCount} ${propertyType} for ${transactionType} in ${area}, ${city}`,
    description: `${property.name} - A beautiful ${bhkCount} ${propertyType} for ${transactionType} in ${area}, ${city}. Price: ₹${formatIndianPrice(property.price)}.`,
    openGraph: {
      images: [property.photos[0]],
    },
  };
}

export default async function PropertyPage({ params }: { params: Params | Promise<Params> }) {
  // Parse parameters and await the result
  const parsedParams = await parseRouteParams(params);
  const { city, area, propertyId, bhkCount, propertyType, transactionType, propertyNameSlug } = parsedParams;
  
  const property = await getPropertyDetails(propertyId);

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Property Not Found</h1>
        <p className="text-gray-600 mb-6">We couldn't find the property you're looking for.</p>
        <Link href="/map" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
          View All Properties
        </Link>
      </div>
    );
  }

  // Format the price on the server side
  let formattedPrice = formatIndianPrice(property.price);
  if(!formattedPrice) {
    formattedPrice = " Available on Request";
  }

  // Create the structured data for the property
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.name,
    "description": `${property.bhk} ${property.propertyType} for ${property.transactionType} in ${area}, ${city}`,
    "image": Array.isArray(property.photos) ? property.photos : [property.photos],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": area,
      "addressRegion": city,
      "addressCountry": "IN"
    },
    "offers": {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": "INR"
    },
    "url": `https://yourdomain.com/residential/properties/${city}/${area}/${bhkCount}-${propertyType}-for-${transactionType}/${propertyNameSlug}/${propertyId}`,
    "numberOfRooms": property.bhk.split('-')[0], // Extracting number from "4-bhk"
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": property.size,
      "unitCode": "SQFT"
    },
    "datePosted": property.date,
    "identifier": property.airtable_id
  };

  // Pass the data to a client component for interactive elements
  return (
    <>
      {/* Add the JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      }>
        <ClientPropertyView 
          property={property} 
          city={city} 
          formattedPrice={formattedPrice} 
        />
      </Suspense>
    </>
  );
}
  