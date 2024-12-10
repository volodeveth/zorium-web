import { useContractRead, useContractWrite } from 'wagmi';
import { ZORIUM_CONTRACT_ADDRESS, ZORIUM_ABI } from '../constants/contract';

export function useZorium() {
  // Читання статистики
  const { data: totalStaked } = useContractRead({
    address: ZORIUM_CONTRACT_ADDRESS,
    abi: ZORIUM_ABI,
    functionName: 'totalStaked',
  });

  const { data: rewardPool } = useContractRead({
    address: ZORIUM_CONTRACT_ADDRESS,
    abi: ZORIUM_ABI,
    functionName: 'rewardPool',
  });

  const { data: totalBurned } = useContractRead({
    address: ZORIUM_CONTRACT_ADDRESS,
    abi: ZORIUM_ABI,
    functionName: 'totalBurned',
  });

  // Форматування значень
  const formatValue = (value: bigint | undefined) => {
    if (!value) return '0';
    return (Number(value) / 1e18).toLocaleString();
  };

  return {
    stats: {
      totalStaked: formatValue(totalStaked),
      rewardPool: formatValue(rewardPool),
      totalBurned: formatValue(totalBurned),
    }
  };
}