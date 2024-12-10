import { useContractRead } from 'wagmi';
import { ZORIUM_CONTRACT_ADDRESS, ZORIUM_ABI } from '../constants/contract';
import { parseEther, formatEther } from 'viem';

export function useZorium() {
  // Читання статистики
  const { data: totalStaked } = useContractRead({
    address: ZORIUM_CONTRACT_ADDRESS,
    abi: ZORIUM_ABI,
    functionName: 'totalStaked',
  }) as { data: bigint | undefined };

  const { data: rewardPool } = useContractRead({
    address: ZORIUM_CONTRACT_ADDRESS,
    abi: ZORIUM_ABI,
    functionName: 'rewardPool',
  }) as { data: bigint | undefined };

  const { data: totalBurned } = useContractRead({
    address: ZORIUM_CONTRACT_ADDRESS,
    abi: ZORIUM_ABI,
    functionName: 'totalBurned',
  }) as { data: bigint | undefined };

  // Форматування значень
  const formatValue = (value: bigint | undefined) => {
    if (!value) return '0';
    return formatEther(value);
  };

  return {
    stats: {
      totalStaked: formatValue(totalStaked),
      rewardPool: formatValue(rewardPool),
      totalBurned: formatValue(totalBurned),
    }
  };
}