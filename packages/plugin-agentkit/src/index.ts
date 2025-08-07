import type { Plugin } from "@elizaos/core";
import { walletProvider, getClient } from "./provider";
import { getZoraActions } from "./actions";

// Initial banner
console.log("\n┌════════════════════════════════════════┐");
console.log("│          ZORA PLUGIN                   │");
console.log("├────────────────────────────────────────┤");
console.log("│  Initializing Zora Plugin...           │");
console.log("│  Version: 0.0.1                        │");
console.log("└════════════════════════════════════════┘");

const initializeActions = async () => {
    try {
        // Validate environment variables
        const pinataJwt = process.env.PINATA_JWT;

        if (!pinataJwt) {
            console.warn("⚠️ Missing PINATA_JWT - Zora actions will not be available");
            return [];
        }

        const actions = await getZoraActions({
            getClient,
        });
        console.log("✔ Zora actions initialized successfully.");
        return actions;
    } catch (error) {
        console.error("❌ Failed to initialize Zora actions:", error);
        return []; // Return empty array instead of failing
    }
};

export const zoraPlugin: Plugin = {
    name: "[Zora] Integration",
    description: "Zora protocol integration plugin for creating coins on Base blockchain",
    providers: [walletProvider],
    evaluators: [],
    services: [],
    actions: await initializeActions(),
};

export default zoraPlugin;
