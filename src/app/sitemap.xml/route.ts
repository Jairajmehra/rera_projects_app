// app/sitemap.xml/route.ts
import { NextResponse } from 'next/server';
import { fetchResidentialProperties, ResidentialProperty } from '@/services/residentialPropertyService';

// Set revalidation period for the sitemap (24 hours)
export const revalidate = 86400;

export async function GET() {
  try {
    // Fetch all properties with a high limit to get as many as possible
    const response = await fetchResidentialProperties({
      params: {
        limit: 10000, // Adjust based on your API capabilities
      }
    });
    
    const properties = response.properties;

    // Helper function to format URL segments
    const formatSegment = (value: string | string[]): string => {
      const strValue = Array.isArray(value) ? value[0] : value;
      // Replace slashes with hyphens to prevent URL path issues
      return strValue.toLowerCase().replace(/\//g, '-').replace(/\s+/g, '-');
    };

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${properties.map((property: ResidentialProperty) => {
        // Format property data for URL segments
        const city = 'ahmedabad'; // Default city or extract from property if available
        const area = formatSegment(property.locality);
        
        // Extract BHK count from property.bhk (e.g., "3-bhk" -> "3")
        const bhkPart = formatSegment(property.bhk);
        const bhkCount = bhkPart.split('-')[0];
        
        // Important: Replace slashes with hyphens in property type
        const propertyType = formatSegment(property.propertyType);
        const transactionType = formatSegment(property.transactionType);
        const propertyName = property.name.toLowerCase().replace(/\//g, '-').replace(/\s+/g, '-');
        
        const lastMod = new Date().toISOString();
        
        return `
        <url>
          <loc>https://www.propview.ai/residential/properties/${city}/${area}/${bhkCount}-bhk-${propertyType}-for-${transactionType}/${propertyName}/${property.airtable_id}</loc>
          <lastmod>${lastMod}</lastmod>
          <changefreq>daily</changefreq>
          <priority>0.8</priority>
        </url>
      `}).join('')}
    </urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}