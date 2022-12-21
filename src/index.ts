import { AptosWalletErrorResult, NetworkName, PluginProvider } from "@aptos-labs/wallet-adapter-core";
import type {
  AccountInfo,
  AdapterPlugin,
  NetworkInfo,
  SignMessagePayload,
  SignMessageResponse,
  WalletName,
} from "@aptos-labs/wallet-adapter-core";
import { Types } from "aptos";

interface SpikaWindow extends Window {
  spika?: PluginProvider;
}

declare const window: SpikaWindow;

export const SpikaWalletName = "Spika" as WalletName<"Spika">;

export class SpikaWallet implements AdapterPlugin {
  readonly name = SpikaWalletName;
  readonly url = "https://chrome.google.com/webstore/detail/spika/fadkojdgchhfkdkklllhcphknohbmjmb";
  readonly icon =
    "data:image/png;base64,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";

  provider: PluginProvider | undefined = typeof window !== "undefined" ? window.spika : undefined;

  async connect(): Promise<AccountInfo> {
    try {
      const accountInfo = await this.provider?.connect();
      if (!accountInfo) throw `${SpikaWalletName} Address Info Error`;
      return accountInfo;
    } catch (error: any) {
      throw error;
    }
  }

  async account(): Promise<AccountInfo> {
    const response = await this.provider?.account();
    if (!response) throw `${SpikaWalletName} Account Error`;
    return response;
  }

  async disconnect(): Promise<void> {
    try {
      await this.provider?.disconnect();
    } catch (error: any) {
      throw error;
    }
  }

  async signAndSubmitTransaction(
    transaction: Types.TransactionPayload,
    options?: any
  ): Promise<{ hash: Types.HexEncodedBytes }> {
    try {
      const response = await this.provider?.signAndSubmitTransaction(transaction, options);
      if ((response as AptosWalletErrorResult).code) {
        throw new Error((response as AptosWalletErrorResult).message);
      }
      return response as { hash: Types.HexEncodedBytes };
    } catch (error: any) {
      const errMsg = error.message;
      throw errMsg;
    }
  }

  async signMessage(message: SignMessagePayload): Promise<SignMessageResponse> {
    try {
      if (typeof message !== "object" || !message.nonce) {
        `${SpikaWalletName} Invalid signMessage Payload`;
      }
      const response = await this.provider?.signMessage(message);
      if (response) {
        return response;
      } else {
        throw `${SpikaWalletName} Sign Message failed`;
      }
    } catch (error: any) {
      const errMsg = error.message;
      throw errMsg;
    }
  }

  async network(): Promise<NetworkInfo> {
    try {
      const response = await this.provider?.network();
      if (!response) throw `${SpikaWalletName} Network Error`;
      return {
        name: response as NetworkName,
      };
    } catch (error: any) {
      throw error;
    }
  }

  async onNetworkChange(callback: any): Promise<void> {
    try {
      const handleNetworkChange = async (newNetwork: { networkName: NetworkInfo }): Promise<void> => {
        callback({
          name: newNetwork.networkName,
          chainId: undefined,
          api: undefined,
        });
      };
      await this.provider?.onNetworkChange(handleNetworkChange);
    } catch (error: any) {
      const errMsg = error.message;
      throw errMsg;
    }
  }

  async onAccountChange(callback: any): Promise<void> {
    try {
      const handleAccountChange = async (newAccount: AccountInfo): Promise<void> => {
        if (newAccount?.publicKey) {
          callback({
            publicKey: newAccount.publicKey,
            address: newAccount.address,
          });
        } else {
          const response = await this.connect();
          callback({
            address: response?.address,
            publicKey: response?.publicKey,
          });
        }
      };
      await this.provider?.onAccountChange(handleAccountChange);
    } catch (error: any) {
      console.log(error);
      const errMsg = error.message;
      throw errMsg;
    }
  }
}
