import {
    type Action,
    generateText,
    type HandlerCallback,
    type IAgentRuntime,
    type Memory,
    ModelClass,
    type State,
    composeContext,
    generateObject,
} from "@elizaos/core";
import type { ZoraActionProvider } from "./zoraActionProvider";
import { CreateCoinSchema } from "./schemas";

type GetZoraActionsParams = {
    getClient: () => Promise<ZoraActionProvider>;
    config?: {
        networkId?: string;
    };
};

/**
 * Get all Zora actions
 */
export async function getZoraActions({
    getClient,
}: GetZoraActionsParams): Promise<Action[]> {
    const zoraProvider = await getClient();
    
    // Create the coinIt action
    const coinItAction: Action = {
        name: "COINIT",
        description: "Create a new Zora coin on the Base blockchain",
        similes: ["create coin", "mint coin", "deploy coin", "create token"],
        validate: async () => true,
        handler: async (
            runtime: IAgentRuntime,
            message: Memory,
            state: State | undefined,
            _options?: Record<string, unknown>,
            callback?: HandlerCallback
        ): Promise<boolean> => {
            try {
                const client = await getClient();
                let currentState =
                    state ?? (await runtime.composeState(message));
                currentState = await runtime.updateRecentMessageState(
                    currentState
                );

                const parameterContext = composeParameterContext(
                    currentState
                );
                const parameters = await generateParameters(
                    runtime,
                    parameterContext
                );

                const result = await executeZoraAction(
                    parameters,
                    client
                );

                const responseContext = composeResponseContext(
                    result,
                    currentState
                );
                const response = await generateResponse(
                    runtime,
                    responseContext
                );

                callback?.({ text: response, content: result });
                return true;
            } catch (error) {
                const errorMessage =
                    error instanceof Error ? error.message : String(error);
                callback?.({
                    text: `Error executing Zora action: ${errorMessage}`,
                    content: { error: errorMessage },
                });
                return false;
            }
        },
        examples: [
            "Create a coin called 'MyToken' with symbol 'MTK'",
            "Deploy a new Zora coin with name 'CommunityCoin' and symbol 'CC'",
            "Mint a coin called 'GameToken' with symbol 'GTK'"
        ],
    };

    return [coinItAction];
}

async function executeZoraAction(
    parameters: unknown,
    client: ZoraActionProvider
): Promise<unknown> {
    // For now, we'll return a mock response since we need a proper wallet provider
    // In a real implementation, this would use the ZoraActionProvider.createCoin method
    return {
        success: true,
        message: "Zora coin creation action executed successfully",
        parameters: parameters
    };
}

function composeParameterContext(state: State): string {
    const contextTemplate = `{{recentMessages}}

Given the recent messages, extract the following information for creating a Zora coin:
- name: The name of the coin to create
- symbol: The symbol of the coin to create  
- description: The description of the coin
- image: Local image file path or URI (ipfs:// or https://)
- category: The category of the coin (optional, defaults to 'social')
- payoutRecipient: The address that will receive creator earnings (optional)
- platformReferrer: The address that will receive platform referrer fees (optional)
- currency: The currency for deployment, can be 'ZORA' or 'ETH' (optional, defaults to 'ZORA')
`;
    return composeContext({ state, template: contextTemplate });
}

async function generateParameters(
    runtime: IAgentRuntime,
    context: string
): Promise<unknown> {
    const { object } = await generateObject({
        runtime,
        context,
        modelClass: ModelClass.LARGE,
        schema: CreateCoinSchema,
    });

    return object;
}

function composeResponseContext(
    result: unknown,
    state: State
): string {
    const responseTemplate = `
# Action Examples
{{actionExamples}}

# Knowledge
{{knowledge}}

# Task: Generate dialog and actions for the character {{agentName}}.
About {{agentName}}:
{{bio}}
{{lore}}

{{providers}}

{{attachments}}

# Capabilities
Note that {{agentName}} is capable of reading/seeing/hearing various forms of media, including images, videos, audio, plaintext and PDFs. Recent attachments have been included above under the "Attachments" section.

The Zora coin creation action was executed successfully.
Here is the result:
${JSON.stringify(result)}

{{actions}}

Respond to the message knowing that the action was successful and these were the previous messages:
{{recentMessages}}
`;
    return composeContext({ state, template: responseTemplate });
}

async function generateResponse(
    runtime: IAgentRuntime,
    context: string
): Promise<string> {
    return generateText({
        runtime,
        context,
        modelClass: ModelClass.LARGE,
    });
}
