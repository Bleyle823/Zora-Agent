import { Hex } from "viem";
import { Network } from "./network";

export interface EvmWalletProvider {
  getAddress(): string;
  getNetwork(): Network;
  sendTransaction(txRequest: { to: Hex; data: Hex; value: bigint }): Promise<Hex>;
  waitForTransactionReceipt(hash: Hex): Promise<{ status: string; logs: any[] }>;
} 