// app/sitemap.xml/route.ts
import { NextResponse } from 'next/server';
import { 
  fetchResidentialProperties, 
  ResidentialProperty,
  fetchCommercialProperties,
  CommercialProperty
} from '@/services/PropertyService';

// Set revalidation period for the sitemap (24 hours)
export const revalidate = 86400;

export async function GET() {
  try {
    // Fetch residential properties
    const residentialResponse = await fetchResidentialProperties({
      params: {
        limit: 10000, // Adjust based on your API capabilities
      }
    });
    
    // Fetch commercial properties
    const commercialResponse = await fetchCommercialProperties({
      params: {
        limit: 10000, // Adjusted limit to prevent overloading
      }
    });
    
    const residentialProperties = residentialResponse.properties;
    const commercialProperties = commercialResponse.properties;

    // Helper function to format URL segments
    const formatSegment = (value: string | string[]): string => {
      const strValue = Array.isArray(value) ? value[0] : value;
      // Replace slashes with hyphens to prevent URL path issues
      return strValue.toLowerCase().replace(/\//g, '-').replace(/\s+/g, '-');
    };

    // Get current date for lastmod
    const currentDate = new Date().toISOString();

    // Define primary pages for the sitemap
    const primaryPages = [
      {
        url: 'https://www.propview.ai',
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: '1.0' // Homepage gets highest priority
      },
      {
        url: 'https://www.propview.ai/residential',
        lastmod: currentDate,
        changefreq: 'daily',
        priority: '0.9' // Map/search page gets high priority
      },
      {
        url: 'https://www.propview.ai/commercial',
        lastmod: currentDate,
        changefreq: 'daily',
        priority: '0.9' // Commercial page gets high priority
      },
      // Add other important pages as needed
      // {
      //   url: 'https://www.propview.ai/contact',
      //   lastmod: currentDate,
      //   changefreq: 'monthly',
      //   priority: '0.7'
      // },
      // {
      //   url: 'https://www.propview.ai/about',
      //   lastmod: currentDate,
      //   changefreq: 'monthly',
      //   priority: '0.7'
      // }
    ];

    // Generate sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${primaryPages.map(page => `
        <url>
          <loc>${page.url}</loc>
          <lastmod>${page.lastmod}</lastmod>
          <changefreq>${page.changefreq}</changefreq>
          <priority>${page.priority}</priority>
        </url>
      `).join('')}
      
      {/* Residential Properties */}
      ${residentialProperties.map((property: ResidentialProperty) => {
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
        
        const lastMod = currentDate;
        
        return `
        <url>
          <loc>https://www.propview.ai/residential/properties/${city}/${area}/${bhkCount}-bhk-${propertyType}-for-${transactionType}/${propertyName}/${property.airtable_id}</loc>
          <lastmod>${lastMod}</lastmod>
          <changefreq>daily</changefreq>
          <priority>0.8</priority>
        </url>
      `}).join('')}
      
      {/* Commercial Properties */}
      ${commercialProperties.map((property: CommercialProperty) => {
        // Format property data for URL segments
        const city = 'ahmedabad'; // Default city or extract from property if available
        const area = formatSegment(property.locality);
        
        // Important: Replace slashes with hyphens in property type
        const propertyType = formatSegment(property.propertyType);
        const transactionType = formatSegment(property.transactionType);
        const propertyName = property.name.toLowerCase().replace(/\//g, '-').replace(/\s+/g, '-');
        
        const lastMod = currentDate;
        
        return `
        <url>
          <loc>https://www.propview.ai/commercial/properties/${city}/${area}/${propertyType}-for-${transactionType}/${propertyName}/${property.airtable_id}</loc>
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