import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getZoraClients, zoraProvider } from '../src/provider';

// Mock viem dependencies
vi.mock('viem', () => ({
    createWalletClient: vi.fn().mockReturnValue({
        account: { address: '0x123...abc' }
    }),
    createPublicClient: vi.fn().mockReturnValue({}),
    http: vi.fn(),
    base: { id: 8453, name: 'Base' }
}));

vi.mock('viem/accounts', () => ({
    privateKeyToAccount: vi.fn().mockReturnValue({
        address: '0x123...abc'
    })
}));

vi.mock('viem/chains', () => ({
    base: { id: 8453, name: 'Base' }
}));

describe('Zora Provider', () => {
    const mockRuntime = {
        name: 'test-runtime',
        memory: new Map(),
        getMemory: vi.fn(),
        setMemory: vi.fn(),
        clearMemory: vi.fn()
    };

    beforeEach(() => {
        vi.clearAllMocks();
        // Set up environment variables for testing
        process.env.ZORA_RPC_URL = 'https://base-sepolia.g.alchemy.com/v2/test';
        process.env.ZORA_PRIVATE_KEY = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
    });

    afterEach(() => {
        delete process.env.ZORA_RPC_URL;
        delete process.env.ZORA_PRIVATE_KEY;
    });

    describe('getZoraClients', () => {
        it('should create clients with valid environment variables', async () => {
            const clients = await getZoraClients();
            
            expect(clients).toBeDefined();
            expect(clients.account).toBeDefined();
            expect(clients.account.address).toBe('0x123...abc');
            expect(clients.publicClient).toBeDefined();
            expect(clients.walletClient).toBeDefined();
        });

        it('should throw error when ZORA_RPC_URL is missing', async () => {
            delete process.env.ZORA_RPC_URL;

            await expect(getZoraClients()).rejects.toThrow(
                'Missing required Zora credentials. Please set ZORA_RPC_URL and ZORA_PRIVATE_KEY environment variables.'
            );
        });

        it('should throw error when ZORA_PRIVATE_KEY is missing', async () => {
            delete process.env.ZORA_PRIVATE_KEY;

            await expect(getZoraClients()).rejects.toThrow(
                'Missing required Zora credentials. Please set ZORA_RPC_URL and ZORA_PRIVATE_KEY environment variables.'
            );
        });

        it('should throw error when both environment variables are missing', async () => {
            delete process.env.ZORA_RPC_URL;
            delete process.env.ZORA_PRIVATE_KEY;

            await expect(getZoraClients()).rejects.toThrow(
                'Missing required Zora credentials. Please set ZORA_RPC_URL and ZORA_PRIVATE_KEY environment variables.'
            );
        });
    });

    describe('zoraProvider', () => {
        it('should return wallet address when clients are available', async () => {
            const result = await zoraProvider.get(mockRuntime);
            expect(result).toBe('Zora Wallet Address: 0x123...abc');
        });

        it('should handle errors and return error message', async () => {
            // Mock getZoraClients to throw an error
            vi.mocked(getZoraClients).mockRejectedValueOnce(
                new Error('Configuration failed')
            );

            const result = await zoraProvider.get(mockRuntime);
            expect(result).toBe('Error initializing Zora wallet: Configuration failed');
        });
    });
});
