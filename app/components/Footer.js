'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const nigerianStates = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 
  'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

export default function Footer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredStates = searchTerm.trim()
    ? nigerianStates.filter(state => state.toLowerCase().includes(searchTerm.toLowerCase()))
    : nigerianStates;

  const handleSelect = (state) => {
    setSearchTerm(state);
    setIsOpen(false);
  };

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Phone Fix</h3>
            <p className="text-gray-400 mb-4">Your trusted phone repair service with doorstep pickup and delivery across Nigeria.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/#how-it-works" className="hover:text-white">How It Works</Link></li>
              <li><Link href="/#engineers" className="hover:text-white">Our Engineers</Link></li>
              <li><Link href="/support" className="hover:text-white">Support</Link></li>
              <li><Link href="/login" className="hover:text-white">Login</Link></li>
            </ul>
          </div>

          {/* State Search */}
          <div className="relative" ref={dropdownRef}>
            <h4 className="font-semibold mb-4">Find Service in Your State</h4>
            <input
              type="text"
              placeholder="Search Nigerian states..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsOpen(true)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
            />
            {isOpen && (
              <div className="absolute bottom-full mb-2 w-full bg-gray-800 rounded-lg max-h-60 overflow-y-auto border border-gray-700 z-10">
                {filteredStates.map(state => (
                  <div
                    key={state}
                    onClick={() => handleSelect(state)}
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-gray-300"
                  >
                    {state}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Phone Fix. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
