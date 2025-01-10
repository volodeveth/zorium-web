'use client';

import React from 'react';
import Link from 'next/link';
import { Home, LayoutDashboard, Coins, Users, HelpCircle, ExternalLink, Gift } from 'lucide-react';

const navigationLinks = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Staking', href: '/staking', icon: Coins },
  { name: 'Referral', href: '/referral', icon: Users },
  { name: 'Claim Rewards', href: '/nft-rewards', icon: Gift },
  { name: 'FAQ', href: '/faq', icon: HelpCircle },
];

const socialLinks = [
  {
    name: 'X (Twitter)',
    href: 'https://x.com/zoriumtoken',
    icon: '/icons/x.svg',
  },
  {
    name: 'Zora',
    href: 'https://zora.co/@zorium',
    icon: '/icons/zora.svg',
  },
  {
    name: 'Warpcast',
    href: 'https://warpcast.com/zorium',
    icon: '/icons/warpcast.svg',
  },
  {
    name: 'Telegram',
    href: 'https://t.me/zoriumtoken',
    icon: '/icons/telegram.svg',
  },
  {
    name: 'Explorer',
    href: 'https://explorer.zora.energy/token/0x538D6F4fb9598dC74e15e6974049B109ae0AbC6a',
    icon: '/icons/explorer.svg',
  },
  {
    name: 'GeckoTerminal',
    href: 'https://www.geckoterminal.com/zora-network/pools/0x90b2324b71d5e45ee418fa70fc38698806af7450',
    icon: '/icons/geckoterminal.svg',
  },
  {
    name: 'Uniswap',
    href: 'https://app.uniswap.org/swap?outputCurrency=0x538D6F4fb9598dC74e15e6974049B109ae0AbC6a&chain=zora',
    icon: '/icons/uniswap.svg',
  },
];

export const Footer = () => {
  return (
    <footer className="w-full bg-background/80 backdrop-blur-sm border-t border-gray-800/50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-300">Navigation</h3>
            <div className="grid grid-cols-2 gap-4">
              {navigationLinks.map((link) => {
                const Icon = link.icon;
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
                <a
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