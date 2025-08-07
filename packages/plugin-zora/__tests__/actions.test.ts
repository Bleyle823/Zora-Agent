import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getZoraActions } from '../src/actions';

// Mock @elizaos/core with simpler approach
vi.mock('@elizaos/core', () => ({
    generateText: vi.fn().mockResolvedValue('Test response'),
    generateObject: vi.fn().mockResolvedValue({ object: { name: 'TestCoin', symbol: 'TC' } }),
    composeContext: vi.fn().mockReturnValue('Test context'),
    ModelClass: { LARGE: 'large' },
}));

// Mock @zoralabs/coins-sdk
vi.mock('@zoralabs/coins-sdk', () => ({
    createCoin: vi.fn().mockResolvedValue({ hash: '0x123', status: 'success' }),
    tradeCoin: vi.fn().mockResolvedValue({ hash: '0x456', status: 'success' }),
    DeployCurrency: { ZORA: 'zora', ETH: 'eth' },
}));

// Mock viem
vi.mock('viem', () => ({
    parseEther: vi.fn().mockReturnValue('1000000000000000'),
}));

// Mock provider
vi.mock('../src/provider', () => ({
    getZoraClients: vi.fn().mockResolvedValue({
        account: { address: '0x123...abc' },
        publicClient: {},
        walletClient: {},
    }),
}));

describe('Zora Actions', () => {
    const mockGetClients = vi.fn().mockResolvedValue({
        account: { address: '0x123...abc' },
        publicClient: {},
        walletClient: {},
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getZoraActions', () => {
        it('should return an array of actions', async () => {
            const actions = await getZoraActions({ getClients: mockGetClients });
            
            expect(Array.isArray(actions)).toBe(true);
            expect(actions.length).toBeGreaterThan(0);
        });

        it('should include createCoin action', async () => {
            const actions = await getZoraActions({ getClients: mockGetClients });
            const createCoinAction = actions.find(action => action.name === 'CREATE_COIN');
            
            expect(createCoinAction).toBeDefined();
            expect(createCoinAction?.description).toBeDefined();
            expect(createCoinAction?.handler).toBeDefined();
            expect(createCoinAction?.validate).toBeDefined();
        });

        it('should include tradeCoin action', async () => {
            const actions = await getZoraActions({ getClients: mockGetClients });
            const tradeCoinAction = actions.find(action => action.name === 'TRADE_COIN');
            
            expect(tradeCoinAction).toBeDefined();
            expect(tradeCoinAction?.description).toBeDefined();
            expect(tradeCoinAction?.handler).toBeDefined();
            expect(tradeCoinAction?.validate).toBeDefined();
        });

        it('should have properly structured action objects', async () => {
            const actions = await getZoraActions({ getClients: mockGetClients });
            
            actions.forEach(action => {
                expect(action).toHaveProperty('name');
                expect(action).toHaveProperty('description');
                expect(action).toHaveProperty('handler');
                expect(action).toHaveProperty('validate');
                expect(typeof action.name).toBe('string');
                expect(typeof action.description).toBe('string');
                expect(typeof action.handler).toBe('function');
                expect(typeof action.validate).toBe('function');
            });
        });
    });
}); 