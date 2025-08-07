import type { Provider, IAgentRuntime } from "@elizaos/core";
import { ZoraActionProvider } from "./zoraActionProvider";
import { EvmWalletProvider } from "./evmWalletProvider";

export async function getClient(): Promise<ZoraActionProvider> {
    // Validate required environment variables first
    const pinataJwt = process.env.PINATA_JWT;

    if (!pinataJwt) {
        throw new Error("Missing required PINATA_JWT. Please set PINATA_JWT environment variable for IPFS uploads.");
    }

    try {
        const zoraProvider = new ZoraActionProvider();
        return zoraProvider;
    } catch (error) {
        console.error("Failed to initialize Zora Action Provider:", error);
        throw new Error(`Failed to initialize Zora Action Provider: ${error.message || 'Unknown error'}`);
    }
}

export const walletProvider: Provider = {
    async get(_runtime: IAgentRuntime): Promise<string | null> {
        try {
            const client = await getClient();
            return `Zora Action Provider initialized successfully`;
        } catch (error) {
            console.error("Error in Zora provider:", error);
            return `Error initializing Zora provider: ${error.message}`;
        }
    },
};
