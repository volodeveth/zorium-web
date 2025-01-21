// src/app/home-client.tsx
'use client';

import React from "react";
import { useZorium } from "@/hooks/useZorium";
import { useAccount } from 'wagmi';
import Link from 'next/link';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Coins, Users, TrendingUp, ArrowRight } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const StatsCard = ({ title, value, icon }: StatsCardProps) => (
  <div className="stats-card">
    <div className="icon-container">
      {icon}
    </div>
    <div>
      <h3 className="text-gray-400 font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

export default function HomeClient() {
  const { stats } = useZorium();
  const { isConnected } = useAccount();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-6xl font-bold mb-6 gradient-text">
          Welcome to ZORIUM
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Stake, earn rewards, and build your referral network in the next generation DeFi platform
        </p>
        {isConnected && (
          <div>
            <Link href="/dashboard" passHref legacyBehavior>
              <Button size="lg" className="icon-container" asChild>
                <a>
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        <Card className="p-6 bg-[#151515]/90 backdrop-blur-sm">
          <div className="mb-6">
            <div className="icon-container mb-4">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-100">Staking</h3>
            <p className="text-gray-400">Earn rewards by staking your ZORIUM tokens</p>
          </div>
          <ul className="space-y-3">
            <li className="list-item">
              <div className="list-dot"></div>
              Minimum stake: 100 ZORIUM
            </li>
            <li className="list-item">
              <div className="list-dot"></div>
              Lock periods: 30 to 365 days
            </li>
            <li className="list-item">
              <div className="list-dot"></div>
              Up to 300% reward multiplier
            </li>
          </ul>
        </Card>

        <Card className="p-6 bg-[#151515]/90 backdrop-blur-sm">
          <div className="mb-6">
            <div className="icon-container mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-100">Referral Program</h3>
            <p className="text-gray-400">Multiply your earnings through our referral system</p>
          </div>
          <ul className="space-y-3">
            <li className="list-item">
              <div className="list-dot"></div>
              Up to 3 levels of referrals
            </li>
            <li className="list-item">
              <div className="list-dot"></div>
              15% reward from direct referrals
            </li>
            <li className="list-item">
              <div className="list-dot"></div>
              Additional bonuses for active referrers
            </li>
          </ul>
        </Card>

        <Card className="p-6 bg-[#151515]/90 backdrop-blur-sm">
          <div className="mb-6">
            <div className="icon-container mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-100">User Levels</h3>
            <p className="text-gray-400">Unlock better rewards as you level up</p>
          </div>
          <ul className="space-y-3">
            <li className="list-item">
              <div className="list-dot"></div>
              Bronze: Start Level (0% bonus)
            </li>
            <li className="list-item">
              <div className="list-dot"></div>
              Silver: 1M+ ZORIUM (10% bonus)
            </li>
            <li className="list-item">
              <div className="list-dot"></div>
              Gold: 10M+ ZORIUM (25% bonus)
            </li>
            <li className="list-item">
              <div className="list-dot"></div>
              Platinum: 100M+ ZORIUM (50% bonus)
            </li>
          </ul>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Staked" 
          value={`${stats.totalStaked} ZRM`} 
          icon={<Wallet className="w-8 h-8 text-white" />} 
        />
        <StatsCard 
          title="Reward Pool" 
          value={`${stats.rewardPool} ZRM`} 
          icon={<Coins className="w-8 h-8 text-white" />} 
        />
        <StatsCard 
          title="Total Users" 
          value="Coming Soon" 
          icon={<Users className="w-8 h-8 text-white" />} 
        />
        <StatsCard 
          title="Total Burned" 
          value={`${stats.totalBurned} ZRM`} 
          icon={<TrendingUp className="w-8 h-8 text-white" />} 
        />
      </div>
    </section>
  );
}