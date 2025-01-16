'use client';

import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { navigation, routes } from '@/navigation';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#282c34]/80 backdrop-blur-sm border-b border-gray-800/50">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link 
          href={routes.home}
          className="flex items-center gap-2 group"
        >
          <Image
            src="/icons/zoriumlogo.svg"
            alt="Zorium Logo"
            width={32}
            height={32}
            className="w-8 h-8 transition-transform duration-300 ease-in-out group-hover:scale-110"
            priority
          />
          <span className="text-xl font-bold bg-gradient-to-r from-[#be1103] to-[#d41404] bg-clip-text text-transparent transition-colors duration-300 group-hover:text-[#be1103]">
            ZORIUM
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium transition-colors ${
                pathname === item.href 
                  ? 'text-[#be1103]' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Connect Wallet & Mobile Menu */}
        <div className="flex items-center gap-4">
          <ConnectButton />

          <button
            type="button"
            className="md:hidden bg-transparent border-0"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#282c34] border-b border-gray-800/50">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block w-full text-left text-sm font-medium transition-colors ${
                  pathname === item.href 
                    ? 'text-[#be1103]' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};