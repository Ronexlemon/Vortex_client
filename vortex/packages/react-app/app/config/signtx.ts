import { ethers,providers,Wallet,Contract} from "ethers";
import { parseEther} from "ethers-v6";
import erc20Abi from "../abi/erc20.json"; // Ensure ABI is correct
import { cusdContractAddress, VortexAddress } from "./signer";
import { useEthersSigner } from "./signer";
import { walletClient } from "./signer";
 


const SignTx = async ( amount: string,userAddress:string) => {
    
    //const provider = new ethers.JsonRpcProvider("https://alfajores-forno.celo-testnet.org");
    //const provider = new providers.JsonRpcProvider("https://alfajores-forno.celo-testnet.org")
    //const userSigner = provider.getSigner(userAddress)
  //  console.log("userProvider",userSigner)
    if (!window.ethereum) {
        throw new Error("MetaMask is not installed");
      }
  
      // Request account access from MetaMask
      await window.ethereum.request({ method: "eth_requestAccounts" });
  
      // Create an ethers provider from MetaMask
      const provider = new ethers.providers.Web3Provider(window.ethereum);
  
      // Get the signer from the provider
      const signer = provider.getSigner(userAddress);
    
   // const sig =  useEthersSigner()
    
    
  try {
    // Create a contract instance for the CUSD ERC20 token contract
    const contract = new Contract(cusdContractAddress, erc20Abi, signer );

    // Create the transaction data for the transfer
    const txData = await contract.populateTransaction.transfer(
      VortexAddress,
      parseEther(amount)
    );

    // Sign the transaction (this does not send it, just signs it)
    console.log("its reaching here",txData)
    const unsignedTx = {
        ...txData,
        from: await signer.getAddress(), // Add `from` field for signing
        nonce: await provider.getTransactionCount(await signer.getAddress()),
        gasLimit: await provider.estimateGas(txData),
        gasPrice: await provider.getGasPrice(),
        chainId: (await provider.getNetwork()).chainId,
      };
    const signedTx = await signer.signTransaction(unsignedTx);

    console.log("Signed Transaction:", signedTx); // This is the signature hash

    return signedTx; // Return the signed transaction (signature hash)
  } catch (err) {
    console.error("Error signing transaction:", err);
    throw `${err}${signer}`;
  }
};

export default SignTx;
