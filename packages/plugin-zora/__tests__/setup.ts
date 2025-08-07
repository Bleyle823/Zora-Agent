// Test setup for Zora plugin
import { vi } from 'vitest';

// Mock environment variables for testing
process.env.ZORA_RPC_URL = 'https://base-sepolia.g.alchemy.com/v2/test';
process.env.ZORA_PRIVATE_KEY = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

// Global test configuration
global.console = {
    ...console,
    log: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
};
