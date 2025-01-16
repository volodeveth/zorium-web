'use client';

import React from 'react';
import Link from 'next/link';
import { Home, LayoutDashboard, Coins, Users, HelpCircle, ExternalLink, Gift } from 'lucide-react';
import { navigation, socialLinks } from '@/navigation';

// Додаємо типи іконок для навігації
const navigationIcons = {
  '/': Home,
  '/dashboard': LayoutDashboard,
  '/staking': Coins,
  '/referral': Users,
  '/nft-rewards': Gift,
  '/faq': HelpCircle,
} as const;

export const Footer = () => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <footer className="w-full bg-background/80 backdrop-blur-sm border-t border-gray-800/50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-300">Navigation</h3>
            <div className="grid grid-cols-2 gap-4">
              {navigation.map((link) => {
                const Icon = navigationIcons[link.href as keyof typeof navigationIcons];
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-300">Community & Resources</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {socialLinks.map((link) => (
                
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                >
                  <img 
                    src={link.icon} 
                    alt={link.name}
                    className="w-4 h-4 opacity-75 group-hover:opacity-100 transition-opacity"
                  />
                  <span>{link.name}</span>
                  <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800/50">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} ZORIUM. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};