'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import {
  Coins,
  HelpCircle,
  Users,
  TrendingUp,
  Lock,
  Gift,
  Clock,
  Flame,
  Shield
} from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: React.ReactNode;
  icon: React.ReactNode;
}

const FAQItem = ({ question, answer, icon }: FAQItemProps) => (
  <Card className="transition-all duration-300 hover:border-primary/30">
    <div className="p-6">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-primary/10 rounded-lg mt-1">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">{question}</h3>
          <div className="text-gray-400 space-y-2">
            {answer}
          </div>
        </div>
      </div>
    </div>
  </Card>
);

const faqItems: FAQItemProps[] = [
  {
    question: "What is ZORIUM?",
    answer: "ZORIUM is a DeFi platform that combines staking and referral mechanisms, allowing users to earn rewards by locking their tokens and building referral networks.",
    icon: <HelpCircle className="w-5 h-5 text-primary" />
  },
  {
    question: "How do I start staking?",
    answer: (
      <p>
        Connect your wallet, ensure you have at least 100 ZRM tokens, choose a lock period (30-365 days),
        and confirm the transaction. Higher lock periods provide better reward multipliers.
      </p>
    ),
    icon: <Coins className="w-5 h-5 text-primary" />
  },
  {
    question: "What are the staking periods and rewards?",
    answer: (
      <div className="space-y-1">
        <p>Base APR is 5%, multiplied by period bonus:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>30 days: 1x base rate</li>
          <li>90 days: 1.5x base rate</li>
          <li>180 days: 2x base rate</li>
          <li>365 days: 3x base rate</li>
        </ul>
        <p>Plus additional level and referral bonuses.</p>
      </div>
    ),
    icon: <TrendingUp className="w-5 h-5 text-primary" />
  },
  {
    question: "What are user levels and their benefits?",
    answer: (
      <div className="space-y-1">
        <p>Each level provides a bonus to all staking rewards:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Bronze (Start): 0% bonus</li>
          <li>Silver (1M+ ZRM): 10% bonus</li>
          <li>Gold (10M+ ZRM): 25% bonus</li>
          <li>Platinum (100M+ ZRM): 50% bonus</li>
        </ul>
      </div>
    ),
    icon: <TrendingUp className="w-5 h-5 text-primary" />
  },
  {
    question: "Can I unstake early?",
    answer: "No, tokens are locked for the selected period. Once the lock period ends, you can unstake or continue earning rewards without restrictions.",
    icon: <Lock className="w-5 h-5 text-primary" />
  },
  {
    question: "How does the referral system work?",
    answer: (
      <div className="space-y-1">
        <p>Share your referral link with others. When they stake, you earn:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>15% from direct referrals (Level 1)</li>
          <li>8% from their referrals (Level 2)</li>
          <li>5% from third-level referrals (Level 3)</li>
        </ul>
      </div>
    ),
    icon: <Users className="w-5 h-5 text-primary" />
  },
  {
    question: "When can I claim rewards?",
    answer: "Rewards can be claimed anytime after the lock period ends. Both staking and referral rewards are claimed together to save on gas fees.",
    icon: <Gift className="w-5 h-5 text-primary" />
  },
  {
    question: "What happens to my referral rewards if I unstake?",
    answer: "You need an active stake to earn referral rewards. If you unstake, you'll stop earning new referral rewards until you stake again.",
    icon: <Clock className="w-5 h-5 text-primary" />
  },
  {
    question: "Are the tokens burned?",
    answer: "Yes, each transfer includes a burn mechanism: 1% is burned permanently, and 0.5% goes to the reward pool to support the ecosystem.",
    icon: <Flame className="w-5 h-5 text-primary" />
  },
  {
    question: "What are the minimum requirements for referrals?",
    answer: (
      <div className="space-y-1">
        <p>To become a referrer, you need:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Minimum 100 ZRM staked</li>
          <li>Active stake</li>
          <li>Your referrals receive a 10% bonus on their rewards</li>
        </ul>
      </div>
    ),
    icon: <Shield className="w-5 h-5 text-primary" />
  },
];

export default function FAQ() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
        <p className="text-gray-400">
          Find answers to common questions about ZORIUM staking and referral system
        </p>
      </div>

      {/* FAQ Grid */}
      <div className="space-y-4 mb-12">
        {faqItems.map((item, index) => (
          <FAQItem
            key={index}
            question={item.question}
            answer={item.answer}
            icon={item.icon}
          />
        ))}
      </div>

      {/* Still Have Questions */}
      <Card className="bg-primary/5 border-primary/20">
        <div className="p-6 text-center">
          <HelpCircle className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Still Have Questions?</h2>
          <p className="text-gray-400 mb-4">
            Join our community channels for additional support and updates
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="https://x.com/zoriumtoken"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-hover transition-colors"
            >
              Twitter
            </a>
            <a
              href="https://t.me/zoriumtoken"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-hover transition-colors"
            >
              Telegram
            </a>
          </div>
        </div>
      </Card>
    </>
  );
}