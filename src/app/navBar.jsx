"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import NamePlate from '../assets/NamePlate.png';

const navLinks = [
  { title: 'Leaderboard', path: '/leaderboard' },
  { title: 'Practice', path: '/practice' },
  { title: 'Technicle', path: '/technical' },
  { title: 'Home', path: '/' },
  { title: 'Compete', path: '/compete' },
];

export default function Navbar() {
  const pathname = usePathname();
  const navbarHeight = '10vh'; // 10% of viewport height

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
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 5vw', // Responsive horizontal padding
        boxShadow: '0 0.125rem 0.3125rem rgba(0, 0, 0, 0.2)',
        zIndex: 1001,
        boxSizing: 'border-box',
      }}
    >
      {/* Invisible spacer for alignment */}
      <div style={{ minWidth: '2vh', visibility: 'hidden' }} />

      {/* Center nav menu */}
      <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
        <nav>
          <ul
            style={{
              display: 'flex',
              alignItems: 'center',
              listStyle: 'none',
              padding: 0,
              margin: 0,
              gap: '2vw', // Responsive spacing between links
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
                      padding: isTechnicle ? '0' : '1vh 1.5vw', // Responsive padding
                      borderRadius: '0.5vh', // Responsive border radius
                      fontWeight: 'bold',
                      fontSize: `clamp(0.8rem, 1.2vw, 1.1rem)`, // Responsive font size
                      transition: 'background-color 0.2s ease, color 0.2s ease',
                      cursor: 'pointer',
                      position: 'relative',
                      whiteSpace: 'nowrap', // Prevent text wrapping
                    }}
                    onMouseEnter={(e) => {
                      if (!isTechnicle)
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isTechnicle)
                        e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {isTechnicle ? (
                      <Image
                        src={NamePlate}
                        alt="Technicle Logo"
                        width={300}
                        height={60}
                        style={{ 
                          display: 'block', 
                          maxWidth: '100%', 
                          height: 'auto'
                        }}
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

      {/* User icon */}
      <div
        style={{
          minWidth: '6vh',
          height: '6vh',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          fontSize: `clamp(0.8rem, 1.5vh, 1.2rem)`, // Responsive font size
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease',
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)')
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="3vh"
          height="3vh"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>
    </div>
  );
}