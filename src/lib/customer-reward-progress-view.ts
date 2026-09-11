import { progressBalanceLabel } from "./loyalty-labels";
import type { MerchantRewardProgressTarget } from "./customer-reward-progress-types";

export function progressLineForTarget(target: MerchantRewardProgressTarget): string {
  return progressBalanceLabel(target.mode, target.current, target.threshold);
}
