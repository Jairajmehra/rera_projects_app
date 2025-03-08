'use client';

import { CommercialProperty } from "@/services/PropertyService";
import useViewport from "@/utils/useViewport";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ClientPropertyViewProps {
  property: CommercialProperty;
  city: string;
  formattedPrice: string;
}

export default function ClientPropertyView({ 
  property, 
  city, 
  formattedPrice 
}: ClientPropertyViewProps) {
  const isMobile = useViewport(768);
  const [activeImage, setActiveImage] = useState(0);

  // Mobile View
  if (isMobile) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Image Slider */}
        <div className="relative w-full h-64">
          {Array.isArray(property.photos) ? (
            <Image 
              src={property.photos[activeImage]} 
              alt={property.name}
              fill
              className="object-cover"
            />
          ) : (
            <Image 
              src={property.photos || "/apartment.png"} 
              alt={property.name}
              fill
              className="object-cover"
            />
          )}
          
          {/* Image Navigation */}
          {Array.isArray(property.photos) && property.photos.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {property.photos.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-2 h-2 rounded-full ${activeImage === index ? 'bg-white' : 'bg-white/50'}`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          )}
          
          {/* Back Button */}
          <Link 
            href="/commercial" 
            className="absolute top-4 left-4 bg-white/80 p-2 rounded-full shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        </div>
        
        {/* Content */}
        <div className="flex-1 p-4">
          {/* Price and Type */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              ₹{formattedPrice}
            </h1>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                {property.transactionType}
              </span>
            </div>
          </div>
          
          {/* Property Name and Location */}
          <h2 className="text-xl font-semibold text-gray-800 mb-1">{property.name}</h2>
          <p className="text-gray-600 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {property.locality}, {city}
          </p>
          
          {/* Property Details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <p className="text-gray-500 text-xs">Property Type</p>
              <p className="font-medium">{property.propertyType}</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <p className="text-gray-500 text-xs">Size</p>
              <p className="font-medium">{property.size} sq.ft</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <p className="text-gray-500 text-xs">Status</p>
              <p className="font-medium">{property.condition}</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <p className="text-gray-500 text-xs">RERA</p>
              <p className="font-medium">{property.linked_project_rera}</p>
            </div>
          </div>
          
          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700">
              Located in {property.locality}, {city}. This {property.propertyType} offers modern amenities and is {property.condition}. Perfect for businesses looking for a prime commercial space.
            </p>
          </div>
          
          {/* Contact Buttons */}
          <div className="flex gap-3">
            <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium">
              Call Agent
            </button>
            <button className="flex-1 border border-blue-600 text-blue-600 py-3 rounded-lg font-medium">
              WhatsApp
            </button>
          </div>
          
          {/* View on Map Button */}
          <Link 
            href="/commercial" 
            className="mt-4 flex items-center justify-center gap-2 text-blue-600 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            View on Map
          </Link>
        </div>
      </div>
    );
  }

  // Desktop View
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <Link href="/commercial/properties" className="ml-2 text-gray-500 hover:text-gray-700">Properties</Link>
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="ml-2 text-gray-900 font-medium">{property.name}</span>
            </li>
          </ol>
        </nav>
        
        {/* Back to Map */}
        <div className="mb-6">
          <Link 
            href="/commercial" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Map
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Images */}
            <div className="p-6">
              <div className="relative h-96 rounded-lg overflow-hidden mb-4">
                {Array.isArray(property.photos) ? (
                  <Image 
                    src={property.photos[activeImage]} 
                    alt={property.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Image 
                    src={property.photos || "/apartment.png"} 
                    alt={property.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              
              {/* Thumbnail Gallery */}
              {Array.isArray(property.photos) && property.photos.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {property.photos.map((photo, index) => (
                    <button 
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`relative h-20 rounded-md overflow-hidden ${activeImage === index ? 'ring-2 ring-blue-500' : ''}`}
                    >
                      <Image 
                        src={photo} 
                        alt={`${property.name} - image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Right Column - Details */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{property.name}</h1>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{property.locality}, {city}</span>
                {property.landmark && (
                  <span className="ml-2 text-gray-500">• Near {property.landmark}</span>
                )}
              </div>
              
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">₹{formattedPrice}</h2>
                <div className="flex flex-wrap gap-2">

                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {property.transactionType}
                  </span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    {property.propertyType}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    {property.condition}
                  </span>
                </div>
              </div>
              
              {/* Property Details */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Property Size</h3>
                  <p className="text-lg font-semibold">{property.size} sq.ft</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Property Type</h3>
                  <p className="text-lg font-semibold">{property.propertyType}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">RERA ID</h3>
                  <p className="text-lg font-semibold">{property.linked_project_rera}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Listed On</h3>
                  <p className="text-lg font-semibold">{new Date(property.date).toLocaleDateString()}</p>
                </div>
              </div>
              
              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  Located in {property.locality}, {city}. This {property.propertyType} offers modern amenities and is {property.condition}. Perfect for families looking for a comfortable living space in a prime location.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  The property features modern fixtures, and is conveniently located near essential amenities. Enjoy the comfort of a well-designed commercial space with excellent connectivity to major parts of the city.
                </p>
              </div>
              
              {/* Contact Buttons */}
              <div className="flex gap-4">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Agent
                </button>
                <button className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 px-4 rounded-lg font-medium flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  WhatsApp
                </button>
              </div>
              
              {/* View on Map Button */}
              <Link 
                href="/commercial" 
                className="mt-6 flex items-center justify-center gap-2 text-blue-600 font-medium hover:text-blue-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                View on Map
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 