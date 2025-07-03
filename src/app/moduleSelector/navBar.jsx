"use client"; // This directive is necessary for client-side components in Next.js

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Use usePathname for router access
import Image from 'next/image';
import NamePlate from './NamePlate.png';

// Define the sections for the top navigation bar
const navLinks = [
  {
    title: 'Leaderboard',
    path: '/leaderboard',
  },
  {
    title: 'Practice',
    path: '/practice',
  },
  {
    title: 'Technicle', // The unique logo text
    path: '/technical',
  },
  {
    title: 'Home',
    path: '/', // Assuming home is the root path
  },
  {
    title: 'Compete',
    path: '/compete',
  },
];

export default function Navbar() {
  const pathname = usePathname(); // Using usePathname for current path
  const navbarHeight = '80px'; // Define the height of the Navbar

  return (
    <div
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: navbarHeight,
        backgroundColor: '#1f3a60',
        display: 'flex',
        justifyContent: 'space-between', // Keeps left placeholder and user icon at edges
        alignItems: 'center',
        padding: '0 30px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
        zIndex: '1001',
        boxSizing: 'border-box',
      }}
    >
      {/* Left placeholder to balance layout (same width as user icon) */}
      <div style={{ width: '40px', visibility: 'hidden' }} /> {/* Hidden for visual balance */}

      {/* Centered Navigation (absolute center technique) */}
      <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
        <nav>



          <ul
            style={{
              display: 'flex',
              alignItems: 'center',
              listStyle: 'none',
              padding: '0',
              margin: '0',
              gap: '30px',
            }}
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              const isTechnicle = link.title === 'Technicle';

              return (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    style={{
                      color: 'white',
                      textDecoration: 'none',
                      padding: isTechnicle ? '0px 0px' : '10px 15px', // Adjust padding for Technicle to prevent extra space
                      borderRadius: '5px',
                      fontWeight: 'bold',
                      transition: 'background-color 0.2s ease, color 0.2s ease',
                      cursor: 'pointer',
                      position: 'relative', // IMPORTANT: Set position relative for absolute children
                      // Remove hover effects for Technicle, or keep subtle if desired
                      onMouseEnter: isTechnicle ? null : (e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)',
                      onMouseLeave: isTechnicle ? null : (e) => e.currentTarget.style.backgroundColor = 'transparent',
                    }}
                  >
                          {isTechnicle ? (
                            <Image
                              src={NamePlate}
                              alt="Technicle Logo"
                              width={250}
                              height={50}
                              style={{ display: 'block' }}
                            />
                          ) : (
                            link.title
                          )}

                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Right-aligned User Icon */}
      <div
        style={{
          width: '40px',
          height: '40px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease',
          // marginLeft: 'auto', // This is handled by parent's justifyContent: 'space-between' with left placeholder
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>
    </div>
  );
}