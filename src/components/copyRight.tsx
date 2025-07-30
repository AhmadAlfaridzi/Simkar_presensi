'use client'

import React from 'react';
import Link from 'next/link';

export const Copyright = () => {
  const currentYear = new Date().getFullYear();
  const appVersion = '1.0.0';
  
   return (
    <footer className="py-3 px-4 border-t border-[#333] bg-[#1a1a1a]">
      <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 space-y-1 md:space-y-0">
        <div>
          &copy; {currentYear} <span className="text-blue-400">Ahmad Alfaridzi</span>. All rights reserved.
        </div>
        
        <div className="flex items-center space-x-4">
          <Link 
            href="/dashboard/kebijakan-privasi" 
            className="hover:text-blue-400 transition-colors duration-200"
          >
            Kebijakan Privasi
          </Link>
          
          <span className="hidden md:inline-block">|</span>
          
          <span className="text-gray-500">
            v{appVersion}
          </span>
        </div>
      </div>
    </footer>
  );
};