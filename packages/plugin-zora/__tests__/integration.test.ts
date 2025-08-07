import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { zoraPlugin } from '../src/index';

// Mock @elizaos/core
vi.mock('@elizaos/core', () => ({
    generateText: vi.fn(),
    ModelClass: { LARGE: 'large' },
    composeContext: vi.fn().mockReturnValue('Test context'),
    generateObject: vi.fn(),
}));

// Mock viem dependencies
vi.mock('viem', () => ({
    createWalletClient: vi.fn().mockReturnValue({
        account: { address: '0x123...abc' },
    }),
    createPublicClient: vi.fn().mockReturnValue({}),
    http: vi.fn(),
    base: { id: 8453, name: 'Base' },
    parseEther: vi.fn(),
}));

vi.mock('viem/accounts', () => ({
    privateKeyToAccount: vi.fn().mockReturnValue({
        address: '0x123...abc',
    }),
}));

vi.mock('viem/chains', () => ({
    base: { id: 8453, name: 'Base' },
}));

// Mock the @zoralabs/coins-sdk
vi.mock('@zoralabs/coins-sdk', () => ({
    createCoin: vi.fn(),
    tradeCoin: vi.fn(),
    DeployCurrency: { ZORA: 'zora', ETH: 'eth' },
}));

describe('Zora Plugin Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        // Clean up environment variables
        delete process.env.ZORA_RPC_URL;
        delete process.env.ZORA_PRIVATE_KEY;
    });

    describe('Plugin Structure', () => {
        it('should have the correct plugin structure', () => {
            expect(zoraPlugin).toBeDefined();
            expect(zoraPlugin.name).toBe('[Zora] Integration');
            expect(zoraPlugin.description).toBeDefined();
            expect(typeof zoraPlugin.description).toBe('string');
        });

        it('should have actions property as array', () => {
            expect(zoraPlugin.actions).toBeDefined();
            expect(Array.isArray(zoraPlugin.actions)).toBe(true);
        });

        it('should have providers property', () => {
            expect(zoraPlugin.providers).toBeDefined();
            expect(Array.isArray(zoraPlugin.providers)).toBe(true);
        });

        it('should export plugin with correct name', () => {
            expect(zoraPlugin.name).toBe('[Zora] Integration');
        });
    });

    describe('Plugin Actions', () => {
        it('should have actions array', () => {
            expect(zoraPlugin.actions).toBeDefined();
            expect(Array.isArray(zoraPlugin.actions)).toBe(true);
        });
    });

    describe('Plugin Providers', () => {
        it('should have zora provider in providers array', () => {
            const providers = zoraPlugin.providers;
            
            if (providers) {
                expect(Array.isArray(providers)).toBe(true);
                expect(providers.length).toBeGreaterThan(0);
                
                // Check that we have at least one provider with a get method
                const hasProviderWithGet = providers.some(p => typeof p.get === 'function');
                expect(hasProviderWithGet).toBe(true);
            }
        });
    });
}); 