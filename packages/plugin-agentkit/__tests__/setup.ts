// Test setup file
import { beforeAll, vi } from 'vitest';

beforeAll(() => {
  // Set up test environment variables
  process.env.PINATA_JWT = 'test-jwt-for-testing';
  
  // Mock fetch for IPFS uploads
  global.fetch = vi.fn();
  
  // Mock FormData
  global.FormData = class FormData {
    append() {}
  } as any;
  
  // Mock File
  global.File = class File {
    constructor() {}
  } as any;
  
  // Mock Blob
  global.Blob = class Blob {
    constructor() {}
  } as any;
});

// Mock viem
vi.mock('viem', () => ({
  encodeFunctionData: vi.fn().mockReturnValue('0x1234'),
  Hex: String,
}));

// Mock @zoralabs/coins-sdk
vi.mock('@zoralabs/coins-sdk', () => ({
  createCoinCall: vi.fn().mockResolvedValue({
    abi: [{ name: 'createCoin' }],
    functionName: 'createCoin',
    address: '0x1234567890123456789012345678901234567890',
    args: [],
    value: BigInt(0),
  }),
  getCoinCreateFromLogs: vi.fn().mockReturnValue({
    coin: '0x2345678901234567890123456789012345678901',
  }),
  DeployCurrency: {
    ZORA: 'ZORA',
    ETH: 'ETH',
  },
})); 