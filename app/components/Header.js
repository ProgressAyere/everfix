'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Phone Fix
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/#how-it-works" className="text-gray-700 hover:text-blue-600">How It Works</Link>
            <Link href="/#engineers" className="text-gray-700 hover:text-blue-600">Engineers</Link>
            <Link href="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
            <Link href="/pickup" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Request Pickup
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3">
            <Link href="/#how-it-works" className="block text-gray-700 hover:text-blue-600">How It Works</Link>
            <Link href="/#engineers" className="block text-gray-700 hover:text-blue-600">Engineers</Link>
            <Link href="/login" className="block text-gray-700 hover:text-blue-600">Login</Link>
            <Link href="/pickup" className="block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 text-center">
              Request Pickup
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
