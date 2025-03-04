// projects-app/src/utils/mapUtils.ts

// Singleton script loader to avoid duplicate scripts
let googleMapsPromise: Promise<void> | null = null;

export const loadGoogleMapsScript = (): Promise<void> => {
  if (!googleMapsPromise) {
    googleMapsPromise = new Promise<void>((resolve) => {
      // If Google Maps is already loaded, resolve immediately
      if (window.google) {
        resolve();
        return;
      }

      // Check if script is already in the document
      const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
      if (existingScript) {
        // Script exists but may not be loaded yet
        const checkGoogleLoaded = setInterval(() => {
          if (window.google) {
            clearInterval(checkGoogleLoaded);
            resolve();
          }
        }, 100);
      } else {
        // Create and add the script
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,marker`;
        script.async = true;
        script.defer = true;
        script.id = 'google-maps-script';
        
        script.onload = () => {
          console.log('Google Maps script loaded');
          resolve();
        };
        
        script.onerror = (error) => {
          console.error('Error loading Google Maps script:', error);
          googleMapsPromise = null; // Reset so we can try again
        };
        
        document.head.appendChild(script);
      }
    });
  }
  
  return googleMapsPromise;
};

// Add any other map utility functions here