import { Card } from './card';
import { Animated } from './animated';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description?: string;
  isLoading?: boolean;
  delay?: number;
}

export const StatCard = ({ 
  title, 
  value, 
  icon, 
  description, 
  isLoading,
  delay = 0 
}: StatCardProps) => (
  <Animated type="slide" delay={delay}>
    <Card className="relative overflow-hidden group">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">{title}</p>
            {isLoading ? (
              <div className="h-8 w-32 rounded bg-gray-800 loading-shimmer" />
            ) : (
              <motion.p 
                className="text-2xl font-bold"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {value}
              </motion.p>
            )}
            {description && (
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            )}
          </div>
          <motion.div 
            className="p-3 bg-primary/10 rounded-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {icon}
          </motion.div>
        </div>
      </div>
      <motion.div 
        className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      >
        <div className="absolute inset-px rounded-xl bg-gradient-to-r from-primary to-primary-hover" />
      </motion.div>
    </Card>
  </Animated>
);