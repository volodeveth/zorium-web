'use client';

import React from 'react';
import Link from 'next/link';
import { Home, LayoutDashboard, Coins, Users, HelpCircle, ExternalLink, Gift, LucideIcon } from 'lucide-react';
import { navigation, socialLinks } from '@/navigation';

// Оновлюємо тип для navigationIcons
const navigationIcons: Record<string, LucideIcon> = {
  '/': Home,
  '/dashboard': LayoutDashboard,
  '/staking': Coins,
  '/referral': Users,
  '/nft-rewards': Gift,
  '/faq': HelpCircle,
};

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export const Footer = () => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return React.createElement('div', {
    className: "w-full bg-background/80 backdrop-blur-sm border-t border-gray-800/50 mt-auto"
  }, 
    React.createElement('div', {
      className: "container mx-auto px-4 py-8"
    }, [
      React.createElement('div', {
        key: 'grid',
        className: "grid grid-cols-1 md:grid-cols-2 gap-8"
      }, [
        React.createElement('div', { key: 'nav' }, [
          React.createElement('h3', {
            key: 'nav-title',
            className: "text-lg font-semibold mb-4 text-gray-300"
          }, "Navigation"),
          React.createElement('div', {
            key: 'nav-grid',
            className: "grid grid-cols-2 gap-4"
          }, navigation.map((link) => {
            const Icon = navigationIcons[link.href];
            return React.createElement(Link, {
              key: link.name,
              href: link.href,
              className: "flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            }, [
              Icon && React.createElement(Icon, {
                key: 'icon',
                size: 16,
                className: "w-4 h-4"
              } as IconProps),
              React.createElement('span', { key: 'text' }, link.name)
            ]);
          }))
        ]),
        React.createElement('div', { key: 'social' }, [
          React.createElement('h3', {
            key: 'social-title',
            className: "text-lg font-semibold mb-4 text-gray-300"
          }, "Community & Resources"),
          React.createElement('div', {
            key: 'social-grid',
            className: "grid grid-cols-2 sm:grid-cols-3 gap-4"
          }, socialLinks.map(link => 
            React.createElement('a', {
              key: link.name,
              href: link.href,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
            }, [
              React.createElement('img', {
                key: 'img',
                src: link.icon,
                alt: link.name,
                className: "w-4 h-4 opacity-75 group-hover:opacity-100 transition-opacity"
              }),
              React.createElement('span', { key: 'text' }, link.name),
              React.createElement(ExternalLink, {
                key: 'external',
                size: 12,
                className: "w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity"
              } as IconProps)
            ])
          ))
        ])
      ]),
      React.createElement('div', {
        key: 'copyright',
        className: "mt-8 pt-8 border-t border-gray-800/50"
      }, 
        React.createElement('p', {
          className: "text-center text-sm text-gray-500"
        }, `© ${new Date().getFullYear()} ZORIUM. All rights reserved.`)
      )
    ])
  );
};