'use client';

import React from "react";
import { useZorium } from "@/hooks/useZorium";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Coins, Users, TrendingUp, ArrowRight } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
  isLoading?: boolean;
}

const StatsCard = ({ title, value, icon, gradientFrom, gradientTo, isLoading }: StatsCardProps) => (
  <Card className="group hover:shadow-lg transition-all duration-300">
    <CardContent className="p-6">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl shadow-lg group-hover:scale-105 transition-transform
                        bg-gradient-to-br from-${gradientFrom} to-${gradientTo}`}>
          {icon}
        </div>
        <div>
          <h3 className="text-[#64748B] font-medium mb-1">{title}</h3>
          {isLoading ? (
            <div className="h-8 bg-gray-200 rounded animate-pulse w-32"></div>
          ) : (
            <p className="text-2xl font-bold text-[#1E293B]">{value}</p>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function Home() {
  const { stats } = useZorium();

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-[#B31701] to-[#FF2D2D] text-transparent bg-clip-text">
            Welcome to ZORIUM
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Stake, earn rewards, and build your referral network in the next generation DeFi platform
          </p>
          <Button className="text-lg group">
            Start Earning Now
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-to-br from-[#E8EAED] to-[#D1D5DB] rounded-2xl p-3 mb-4 
                              group-hover:scale-110 transition-transform">
                <Coins className="w-full h-full text-[#2C3E50]" />
              </div>
              <CardTitle>Staking</CardTitle>
              <CardDescription>
                Earn rewards by staking your ZORIUM tokens
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-1.5 h-1.5 bg-[#2C3E50] rounded-full"></div>
                  Minimum stake: 100 ZORIUM
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-1.5 h-1.5 bg-[#2C3E50] rounded-full"></div>
                  Lock periods: 30 to 365 days
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-1.5 h-1.5 bg-[#2C3E50] rounded-full"></div>
                  Up to 300% reward multiplier
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-to-br from-[#E2E8F0] to-[#CBD5E1] rounded-2xl p-3 mb-4 
                              group-hover:scale-110 transition-transform">
                <Users className="w-full h-full text-[#34495E]" />
              </div>
              <CardTitle>Referral Program</CardTitle>
              <CardDescription>
                Multiply your earnings through our referral system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-1.5 h-1.5 bg-[#34495E] rounded-full"></div>
                  Up to 3 levels of referrals
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-1.5 h-1.5 bg-[#34495E] rounded-full"></div>
                  15% reward from direct referrals
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-1.5 h-1.5 bg-[#34495E] rounded-full"></div>
                  Additional bonuses for active referrers
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-to-br from-[#EDF2F7] to-[#C9D5E0] rounded-2xl p-3 mb-4 
                              group-hover:scale-110 transition-transform">
                <TrendingUp className="w-full h-full text-[#445669]" />
              </div>
              <CardTitle>User Levels</CardTitle>
              <CardDescription>
                Unlock better rewards as you level up
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-1.5 h-1.5 bg-[#445669] rounded-full"></div>
                  Bronze: Start Level
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-1.5 h-1.5 bg-[#445669] rounded-full"></div>
                  Silver: 1M+ ZORIUM (10% bonus)
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-1.5 h-1.5 bg-[#445669] rounded-full"></div>
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
            icon={<Wallet className="w-8 h-8 text-[#2C3E50]" />}
            gradientFrom="E8EAED"
            gradientTo="D1D5DB"
          />
          <StatsCard 
            title="Reward Pool" 
            value={`${stats.rewardPool} ZRM`}
            icon={<Coins className="w-8 h-8 text-[#34495E]" />}
            gradientFrom="E2E8F0"
            gradientTo="CBD5E1"
          />
          <StatsCard 
            title="Total Users" 
            value="Coming soon"
            icon={<Users className="w-8 h-8 text-[#445669]" />}
            gradientFrom="EDF2F7"
            gradientTo="C9D5E0"
          />
          <StatsCard 
            title="Total Burned" 
            value={`${stats.totalBurned} ZRM`}
            icon={<TrendingUp className="w-8 h-8 text-[#445669]" />}
            gradientFrom="FEE2E2"
            gradientTo="FECACA"
          />
        </div>
      </div>
    </main>
  );
}