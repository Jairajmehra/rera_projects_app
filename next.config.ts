import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: 'AIzaSyC6TRmdiA0WTKEI8dUjW96GpRq5oXp9VnM'
}, 
images: {
  remotePatterns: [{ hostname: 'storage.googleapis.com' }],
  /* config options here */
}
}

export default nextConfig;
