import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getZoraActions } from '../src/actions';
import type { IAgentRuntime, Memory, State } from '@elizaos/core';

// Mock @elizaos/core
vi.mock('@elizaos/core', () => ({
    generateText: vi.fn().mockResolvedValue('Action executed successfully'),
    ModelClass: { LARGE: 'large' },
    composeContext: vi.fn().mockReturnValue('Test context'),
    generateObject: vi.fn().mockImplementation(({ context }: { context: string }) => {
        if (context.includes('CREATE_COIN')) {
            return {
                object: {
                    name: 'TestCoin',
                    symbol: 'TST',
                    uri: 'ipfs://test',
                    payoutRecipient: '0x1111111111111111111111111111111111111111',
                    currency: 'ETH',
                },
            };
        }
        return {
            object: {
                sellType: 'eth',
                buyType: 'erc20',
                coinAddress: '0x2222222222222222222222222222222222222222',
                amountIn: '0.001',
                slippage: 0.05,
            },
        };
    }),
}));

// Mock @zoralabs/coins-sdk
vi.mock('@zoralabs/coins-sdk', () => ({
    createCoin: vi.fn().mockResolvedValue({
        hash: '0xcreatehash',
        address: '0xcoinaddress',
        deployment: { chainId: 8453 },
    }),
    tradeCoin: vi.fn().mockResolvedValue({
        hash: '0xtradehash',
        status: 'success',
    }),
    DeployCurrency: { ZORA: 'zora', ETH: 'eth' },
}));

// Mock provider
vi.mock('../src/provider', () => ({
    getZoraClients: vi.fn().mockResolvedValue({
        account: { address: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
        publicClient: {},
        walletClient: {},
    }),
}));

describe('Zora Actions execution', () => {
    const mockRuntime: Partial<IAgentRuntime> = {
        composeState: vi.fn().mockResolvedValue({} as State),
        updateRecentMessageState: vi.fn().mockResolvedValue({} as State),
    };
    const mockMessage: Memory = { id: 'm1', userId: 'u1', roomId: 'r1', content: { text: 'hi' } } as any;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('executes CREATE_COIN action and returns callback with tx info', async () => {
        const actions = await getZoraActions({ getClients: async () => ({
            account: { address: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
            publicClient: {},
            walletClient: {},
        }) as any });

        const create = actions.find(a => a.name === 'CREATE_COIN');
        expect(create).toBeDefined();

        const callback = vi.fn();
        const ok = await (create as any).handler(mockRuntime, mockMessage, undefined, undefined, callback);
        expect(ok).toBe(true);
        expect(callback).toHaveBeenCalled();
        const arg = callback.mock.calls[0][0];
        expect(arg.text).toContain('successfully');
        expect(arg.content.transactionHash).toBe('0xcreatehash');
        expect(arg.content.coinAddress).toBe('0xcoinaddress');
    });

    it('executes TRADE_COIN action and returns callback with tx info', async () => {
        const actions = await getZoraActions({ getClients: async () => ({
            account: { address: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
            publicClient: {},
            walletClient: {},
        }) as any });

        const trade = actions.find(a => a.name === 'TRADE_COIN');
        expect(trade).toBeDefined();

        const callback = vi.fn();
        const ok = await (trade as any).handler(mockRuntime, mockMessage, undefined, undefined, callback);
        expect(ok).toBe(true);
        expect(callback).toHaveBeenCalled();
        const arg = callback.mock.calls[0][0];
        expect(arg.text).toContain('successfully');
        expect(arg.content.transactionHash).toBe('0xtradehash');
        expect(arg.content.tradeDetails).toBeDefined();
    });
}); 