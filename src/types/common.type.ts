import { Message, ToolMessage } from "@langchain/langgraph-sdk";

export type Token = {
    tokenAddress: string;
    faAddress: string;
    symbol: string;
    name: string;
    decimals: number;
    bridge: string | null;
    logoUrl: string;
    websiteUrl: string;
    tags: string[];
    coinGeckoId: string;
    coinMarketCapId: number;
};

export type TokenAptos = {
    amount: number;
    asset_type: string;
    is_frozen: boolean;
    is_primary: boolean;
    last_transaction_timestamp: string;
    last_transaction_version: number;
    owner_address: string;
    storage_id: string;
    token_standard: string;
    metadata: {
        token_standard: string;
        symbol: string;
        supply_aggregator_table_key_v1: string;
        supply_aggregator_table_handle_v1: string;
        project_uri: string | null;
        name: string;
        last_transaction_version: number;
        last_transaction_timestamp: string;
        icon_uri: string | null;
        decimals: number;
        creator_address: string;
        asset_type: string;
    }
}

export type TransactionAptos = {
    version: string;
    hash: string;
    state_change_hash: string;
    event_root_hash: string;
    state_checkpoint_hash: string | null;
    gas_used: string;
    success: boolean;
    vm_status: string;
    accumulator_root_hash: string;
    changes: any[];
    sender: string;
    sequence_number: string;
    max_gas_amount: string;
    gas_unit_price: string;
    expiration_timestamp_secs: string;
    payload: any;
    signature: any;
    replay_protection_nonce: string | null;
    events: any[];
    timestamp: string;
    type: string;
};

export interface IAgentRole {
  id: number;
  name: string | null;
  role: string;
  description: string | null;
  imageUrl: string | undefined;
  prompt: string;
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  isTrending: boolean;
}

export interface IGetAgentRoles {
    roles: IAgentRole[],
    tags: string[]
}

export type IMessage = Message & {
  responses?: Message[];
  tool_calls?: ToolMessage[];
  tool_call_id?: string;
}

