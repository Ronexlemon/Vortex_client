import { BrowserProvider, JsonRpcSigner } from "ethers-v6"
import { useMemo } from 'react'
import type { Account, Chain, Client, Transport } from 'viem'
import { type Config, useConnectorClient } from 'wagmi'
import { createWalletClient, custom } from 'viem'
import { celoAlfajores } from 'viem/chains'
 
export const walletClient = createWalletClient({
  chain: celoAlfajores,
  transport: custom(window.ethereum!),
})

export function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new BrowserProvider(transport, network)
  const signer = new JsonRpcSigner(provider, account.address)
  return signer
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: client } = useConnectorClient<Config>({ chainId })
  return useMemo(() => (client ? clientToSigner(client) : undefined), [client])
}
//export const [account] = await walletClient.getAddresses()
export const cusdContractAddress = "0x874069fa1eb16d44d622f2e0ca25eea172369bc1"
export const VortexAddress = "0xC36d344f77c296a0D35889FfaB47D2F3a45aaA0f"