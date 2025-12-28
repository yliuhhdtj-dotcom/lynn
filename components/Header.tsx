
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white rounded-sm transform rotate-45" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">ArchLens</span>
        </div>
        <nav className="hidden md:flex space-x-8 text-sm font-medium text-gray-500">
          <a href="#" className="hover:text-black transition-colors">Explorer</a>
          <a href="#" className="hover:text-black transition-colors">History</a>
          <a href="#" className="hover:text-black transition-colors">About</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
