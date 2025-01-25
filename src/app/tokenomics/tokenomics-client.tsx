'use client';

// Імпортуємо необхідні компоненти та іконки
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { 
  Coins, 
  Flame, 
  LineChart, 
  Users, 
  Building2, 
  Gift, 
  Timer,
  ArrowDownToLine,
  BadgePercent
} from 'lucide-react';

// Визначаємо типи для наших компонентів
interface TokenInfoCardProps {
  title: string;
  items: { label: string; value: string; }[];
  icon: React.ReactNode;
}

// Компонент для відображення інформації про токен
const TokenInfoCard = ({ title, items, icon }: TokenInfoCardProps) => (
  <Card className="p-6">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-primary/10 rounded-lg">
        {icon}
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="flex justify-between items-center">
          <span className="text-gray-400">{item.label}</span>
          <span className="font-medium">{item.value}</span>
        </div>
      ))}
    </div>
  </Card>
);

// Інтерфейс для карток розподілу токенів
interface AllocationCardProps {
  title: string;
  percent: string;
  icon: React.ReactNode;
  description: string;
  details?: { year: string; amount: string; }[];
}

// Компонент для відображення розподілу токенів
const AllocationCard = ({ title, percent, icon, description, details }: AllocationCardProps) => (
  <Card className="p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
      <div className="text-2xl font-bold text-primary">{percent}</div>
    </div>
    {details && (
      <div className="mt-4 pt-4 border-t border-gray-800">
        <div className="space-y-2">
          {details.map((detail, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-400">{detail.year}</span>
              <span>{detail.amount}</span>
            </div>
          ))}
        </div>
      </div>
    )}
  </Card>
);

// Основний компонент сторінки
export default function TokenomicsClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="container mx-auto px-4 pt-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tokenomics</h1>
        <p className="text-gray-400">
          Explore ZORIUM token distribution and mechanics
        </p>
      </div>

      {/* Token Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <TokenInfoCard
          title="Token Information"
          icon={<Coins className="w-5 h-5 text-primary" />}
          items={[
            { label: "Token Symbol", value: "$ZRM" },
            { label: "Network", value: "Zora" },
            { label: "Total Supply", value: "1,111,111,111,111 ZRM" },
            { label: "Year Created", value: "2024" },
          ]}
        />
        <TokenInfoCard
          title="Transaction Fees"
          icon={<Flame className="w-5 h-5 text-primary" />}
          items={[
            { label: "Burn Rate", value: "1%" },
            { label: "Reward Pool", value: "0.5%" },
            { label: "Transfer Amount", value: "98.5%" },
          ]}
        />
      </div>

      {/* Distribution */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Token Distribution</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AllocationCard
            title="Liquidity"
            percent="15%"
            icon={<LineChart className="w-5 h-5 text-primary" />}
            description="Allocated to liquidity pools for stable trading"
          />
          <AllocationCard
            title="Ecosystem"
            percent="15%"
            icon={<Building2 className="w-5 h-5 text-primary" />}
            description="Development, marketing, and partnerships"
          />
          <AllocationCard
            title="Airdrops & Listings"
            percent="60%"
            icon={<Gift className="w-5 h-5 text-primary" />}
            description="Community distribution and exchange presence"
            details={[
              { year: "2024", amount: "20%" },
              { year: "2026", amount: "20%" },
              { year: "2027", amount: "20%" },
            ]}
          />
          <AllocationCard
            title="Team"
            percent="10%"
            icon={<Users className="w-5 h-5 text-primary" />}
            description="Project development and operations"
            details={[
              { year: "2025", amount: "2%" },
              { year: "2026", amount: "4%" },
              { year: "2027", amount: "4%" },
            ]}
          />
        </div>
      </div>

      {/* Goals */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Timer className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Tokenomics Goals</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg mt-1">
                <ArrowDownToLine className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Deflationary Mechanism</p>
                <p className="text-sm text-gray-400">
                  Control token supply through burning and reward pool allocation
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg mt-1">
                <LineChart className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Price Stability</p>
                <p className="text-sm text-gray-400">
                  Maintain stable token value through strategic distribution
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg mt-1">
                <BadgePercent className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Incentivization</p>
                <p className="text-sm text-gray-400">
                  Reward users through staking and referral programs
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg mt-1">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Community Growth</p>
                <p className="text-sm text-gray-400">
                  Support long-term ecosystem development and expansion
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}