import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ZoraActionProvider } from '../src/zoraActionProvider';
import { CreateCoinSchema } from '../src/schemas';

// Mock environment variables
const originalEnv = process.env;

describe('Zora Plugin', () => {
  beforeEach(() => {
    process.env = { ...originalEnv };
    process.env.PINATA_JWT = 'test-jwt';
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('ZoraActionProvider', () => {
    it('should create provider with valid Pinata JWT', () => {
      const provider = new ZoraActionProvider();
      expect(provider).toBeInstanceOf(ZoraActionProvider);
    });

    it('should throw error without Pinata JWT', () => {
      delete process.env.PINATA_JWT;
      expect(() => new ZoraActionProvider()).toThrow(
        'PINATA_JWT is not configured. Required for IPFS uploads.'
      );
    });

    it('should support base networks', () => {
      const provider = new ZoraActionProvider();
      
      expect(provider.supportsNetwork({
        protocolFamily: 'evm',
        networkId: 'base-mainnet'
      })).toBe(true);
      
      expect(provider.supportsNetwork({
        protocolFamily: 'evm',
        networkId: 'base-sepolia'
      })).toBe(true);
      
      expect(provider.supportsNetwork({
        protocolFamily: 'evm',
        networkId: 'ethereum'
      })).toBe(false);
    });
  });

  describe('CreateCoinSchema', () => {
    it('should validate correct input', () => {
      const validInput = {
        name: 'Test Coin',
        symbol: 'TEST',
        description: 'A test coin',
        image: 'https://example.com/image.png',
        category: 'social',
        currency: 'ZORA' as const,
      };

      const result = CreateCoinSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should reject invalid input', () => {
      const invalidInput = {
        name: 'Test Coin',
        symbol: 'TEST',
        description: 'A test coin',
        image: 'https://example.com/image.png',
        category: 'social',
        currency: 'ZORA' as const,
        payoutRecipient: 'invalid-address', // Should be 0x format
      };

      const result = CreateCoinSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should set defaults correctly', () => {
      const input = {
        name: 'Test Coin',
        symbol: 'TEST',
        description: 'A test coin',
        image: 'https://example.com/image.png',
      };

      const result = CreateCoinSchema.parse(input);
      expect(result.category).toBe('social');
      expect(result.currency).toBe('ZORA');
    });
  });
}); 