'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { User } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('customer');
  const [userName, setUserName] = useState('Guest');
  const profileRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const loggedIn = localStorage.getItem('userLoggedIn');
    const role = localStorage.getItem('userRole') || 'customer';
    const name = localStorage.getItem('userName') || 'User';
    setIsLoggedIn(!!loggedIn);
    setUserRole(role);
    setUserName(name);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setIsProfileOpen(false);
    window.location.href = '/';
  };

  const customerMenuItems = [
    { label: 'Dashboard', href: '/dashboardC' },
    { label: 'Profile', href: '/profileC' },
    { label: 'Account Settings', href: '/settingsPage' },
    { label: 'Verification', href: '/verificationC' },
    { label: 'Tracking', href: '/tracking' },
    { label: 'Support', href: '/support' },
    { label: 'Rate an Engineer', href: '/profileE' }
  ];

  const engineerMenuItems = [
    { label: 'Dashboard', href: '/dashboardE' },
    { label: 'Profile', href: '/profileE' },
    { label: 'Account Settings', href: '/settingsPage' },
    { label: 'Verification', href: '/verification' },
    { label: 'Tracking', href: '/tracking' },
    { label: 'Support', href: '/support' },
    { label: 'Your Ratings', href: '/profileE' }
  ];

  const menuItems = userRole === 'engineer' ? engineerMenuItems : customerMenuItems;

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
            <Link href="/pickup" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Request Pickup
            </Link>
            
            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
              >
                <User size={20} />
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {isLoggedIn ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">{userName}</p>
                        <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                      </div>
                      {menuItems.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setIsProfileOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                        >
                          {item.label}
                        </Link>
                      ))}
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition border-t border-gray-200 mt-2"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition text-center font-medium"
                    >
                      Sign In / Sign Up
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button & Profile */}
          <div className="md:hidden flex items-center space-x-3" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600"
              >
                <User size={20} />
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {isLoggedIn ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">{userName}</p>
                        <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                      </div>
                      {menuItems.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setIsProfileOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                        >
                          {item.label}
                        </Link>
                      ))}
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition border-t border-gray-200 mt-2"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition text-center font-medium"
                    >
                      Sign In / Sign Up
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3">
            <Link href="/#how-it-works" className="block text-gray-700 hover:text-blue-600">How It Works</Link>
            <Link href="/#engineers" className="block text-gray-700 hover:text-blue-600">Engineers</Link>
            <Link href="/pickup" className="block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 text-center">
              Request Pickup
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
