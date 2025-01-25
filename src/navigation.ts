// Типи для маршрутів
export type AppRoute = '/' | '/dashboard' | '/staking' | '/referral' | '/nft-rewards' | '/faq' | '/tokenomics';

// Всі маршрути додатку
export const routes = {
 home: '/' as const,
 dashboard: '/dashboard' as const,
 staking: '/staking' as const,
 referral: '/referral' as const,
 nftRewards: '/nft-rewards' as const,
 faq: '/faq' as const,
 tokenomics: '/tokenomics' as const,
} as const;

// Типи для навігаційних елементів
export interface NavigationItem {
 name: string;
 href: AppRoute;
}

// Основна навігація
export const navigation: NavigationItem[] = [
 { name: 'Dashboard', href: routes.dashboard },
 { name: 'Staking', href: routes.staking },
 { name: 'Referral', href: routes.referral },
 { name: 'NFT Rewards', href: routes.nftRewards },
 { name: 'FAQ', href: routes.faq },
 { name: 'Tokenomics', href: routes.tokenomics },
];

// Соціальні посилання
export interface SocialLink {
 name: string;
 href: string;
 icon: string;
}

export const socialLinks: SocialLink[] = [
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