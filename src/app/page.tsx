'use client';

import React from "react";
import { useZorium } from "@/hooks/useZorium";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Coins, Users, TrendingUp, ArrowRight } from "lucide-react";

export default function Home() {
  const { stats } = useZorium();

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
          <h1 className="text-6xl font-bold bg-gradient-primary text-transparent bg-clip-text animate-fade-in">
            Welcome to ZORIUM
          </h1>
          <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
            Stake, earn rewards, and build your referral network in the next generation DeFi platform
          </p>
          <Button className="text-lg mt-8">
            Connect Wallet
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {/* Staking Card */}
          <Card className="backdrop-blur-sm">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl p-3 mb-4 shadow-glow hover-scale">
                <Coins className="w-full h-full text-white" />
              </div>
              <CardTitle>Staking</CardTitle>
              <CardDescription>
                Earn rewards by staking your ZORIUM tokens
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-neutral-300">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  Minimum stake: 100 ZORIUM
                </li>
                <li className="flex items-center gap-3 text-neutral-300">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  Lock periods: 30 to 365 days
                </li>
                <li className="flex items-center gap-3 text-neutral-300">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  Up to 300% reward multiplier
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Referral Card */}
          <Card className="backdrop-blur-sm">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl p-3 mb-4 shadow-glow hover-scale">
                <Users className="w-full h-full text-white" />
              </div>
              <CardTitle>Referral Program</CardTitle>
              <CardDescription>
                Multiply your earnings through our referral system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-neutral-300">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  Up to 3 levels of referrals
                </li>
                <li className="flex items-center gap-3 text-neutral-300">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  15% reward from direct referrals
                </li>
                <li className="flex items-center gap-3 text-neutral-300">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  Additional bonuses for active referrers
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Levels Card */}
          <Card className="backdrop-blur-sm">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl p-3 mb-4 shadow-glow hover-scale">
                <TrendingUp className="w-full h-full text-white" />
              </div>
              <CardTitle>User Levels</CardTitle>
              <CardDescription>
                Unlock better rewards as you level up
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-neutral-300">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  Bronze: Start Level
                </li>
                <li className="flex items-center gap-3 text-neutral-300">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  Silver: 1M+ ZORIUM (10% bonus)
                </li>
                <li className="flex items-center gap-3 text-neutral-300">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  Gold: 10M+ ZORIUM (25% bonus)
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatsCard 
            title="Total Staked" 
            value={`${stats.totalStaked} ZRM`}
            icon={<Wallet />}
          />
          <StatsCard 
            title="Reward Pool" 
            value={`${stats.rewardPool} ZRM`}
            icon={<Coins />}
          />
          <StatsCard 
            title="Total Users" 
            value="Coming Soon"
            icon={<Users />}
          />
          <StatsCard 
            title="Total Burned" 
            value={`${stats.totalBurned} ZRM`}
            icon={<TrendingUp />}
          />
        </div>
      </div>
    </main>
  );
}

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const StatsCard = ({ title, value, icon }: StatsCardProps) => (
  <Card className="backdrop-blur-sm">
    <CardContent className="p-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-primary rounded-xl shadow-glow hover-scale">
          {React.cloneElement(icon as React.ReactElement, { 
            className: 'w-8 h-8 text-white'
          })}
        </div>
        <div>
          <h3 className="text-neutral-400 font-medium mb-1">{title}</h3>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);