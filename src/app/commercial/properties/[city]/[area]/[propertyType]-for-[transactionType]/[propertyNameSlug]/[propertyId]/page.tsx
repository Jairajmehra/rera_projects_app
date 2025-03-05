// app/commercial/properties/[city]/[area]/[propertyType]-for-[transactionType]/[propertyNameSlug]/[propertyId]/page.tsx

import Link from "next/link";
import {  CommercialProperty } from "@/services/PropertyService";
import { Suspense } from "react";
import ClientPropertyView from "./ClientPropertyView";
import { getCommercialPropertyById } from "@/services/PropertyService";
import { formatIndianPrice } from "@/utils/Utils";
import { parseCommercialPropertyConfig } from "@/utils/Utils";


// Set page-level revalidation period to 24 hours (in seconds)
export const revalidate = 86400; // 24 * 60 * 60 = 86400 seconds
// Dynamic route segment pattern based on actual Next.js parameter naming
type Params = {
  city: string;
  area: string;
  "[propertyType]-for-[transactionType": string; // Exact parameter name from logs
  propertyNameSlug: string;
  propertyId: string;
}

// Server-side data fetching function
async function fetchCommercialProperty(propertyId: string): Promise<CommercialProperty | null> {
  try {
    const property = await getCommercialPropertyById(propertyId);
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
    const combinedSegment = resolvedParams["[propertyType]-for-[transactionType"];
    
    // Parse the property configuration using the utility function
    const { propertyType, transactionType } = parseCommercialPropertyConfig(combinedSegment);
    
    return {
      city: resolvedParams.city,
      area: resolvedParams.area,
      propertyId: resolvedParams.propertyId,
      propertyNameSlug: resolvedParams.propertyNameSlug,
      propertyType,
      transactionType
    };
  } catch (error: Error | unknown) { // Replace any with a proper type
    // Production fallback with minimal logging
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error parsing route parameters:", errorMessage);
    return {
      city: resolvedParams.city,
      area: resolvedParams.area,
      propertyId: resolvedParams.propertyId,
      propertyNameSlug: resolvedParams.propertyNameSlug,
      propertyType: "Unknown",
      transactionType: "Unknown"
    };
  }
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  // Parse parameters and await the result
  const parsedParams = await parseRouteParams(params);
  const { city, area, propertyId, propertyType, transactionType } = parsedParams;
  
  const property = await getCommercialPropertyById(propertyId);
  
  if (!property) {
    return {
      title: "Property Not Found",
      description: "The requested property could not be found."
    };
  }
  
  return {
    metadataBase: new URL('https://www.propview.ai'),
    title: `${propertyType} for ${transactionType} in ${area}, ${city}`,
    description: `${property.name} - A premium ${propertyType} for ${transactionType} in ${area}, ${city}. Price: ₹${formatIndianPrice(property.price)}.`,
    openGraph: {
      images: [property.photos[0]],
    },
  };
}



export default async function PropertyPage({ params }: { params: Promise<Params> }) {
  // Parse parameters and await the result
  const parsedParams = await parseRouteParams(params);
  const { city, area, propertyId, propertyType, transactionType, propertyNameSlug } = parsedParams;
  
  const property = await getCommercialPropertyById(propertyId);

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Property Not Found</h1>
        <p className="text-gray-600 mb-6">We couldn&apos;t find the property you&apos;re looking for.</p>
        <Link href="/commercial" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
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
    "description": `${property.propertyType} for ${property.transactionType} in ${area}, ${city}`,
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
    "url": `https://www.propview.ai/commercial/properties/${city}/${area}/${propertyType}-for-${transactionType}/${propertyNameSlug}/${propertyId}`,
    
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
  