'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Your Brand
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="px-4 py-2 text-gray-700 hover:text-gray-900">Button 1</button>
            <button className="px-4 py-2 text-gray-700 hover:text-gray-900">Button 2</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Primary Button
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-gray-900"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <button className="block w-full px-4 py-2 text-gray-700 hover:text-gray-900">
              Button 1
            </button>
            <button className="block w-full px-4 py-2 text-gray-700 hover:text-gray-900">
              Button 2
            </button>
            <button className="block w-full px-4 py-2 mt-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Primary Button
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}