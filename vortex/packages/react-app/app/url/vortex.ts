import axios from "axios";
import { ethers } from "ethers-v6";
//import { ethers } from "ethers";

interface SpinInterface {
  amount: number;
  signedTx: string;
  userAddress:string
}
interface SpinEndSignatureWithHash{
  signature: string;
  hash: string;
  value :bigint
}

interface SpinWithSigner{
  amount: number;
  signer:ethers.Signer
}
export const VortexUrl = "https://vortex-backend-woad.vercel.app/api/stake/Spinsign";
export const VortexUrl2 = "https://vortex-backend-woad.vercel.app/api/stake/spin";

const SpinEndPoint = async ({ signedTx, amount, userAddress }: SpinInterface) => {
  try {
    const response = await axios.post(
      VortexUrl,
      {
        amount,
        signedTx: signedTx,
        userAddress: userAddress,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // Return the response data for further processing
  } catch (err:any) {
    console.error("Error during the Spin request:", err?.response?.data || err.message || err);
    throw err; // Re-throw error for handling by the calling function
  }
};
const SpinEndPoinSigner = async ({ signer, amount, }: SpinWithSigner) => {
  try {
    const response = await axios.post(
      VortexUrl2,
      {
        amount,
      signer
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // Return the response data for further processing
  } catch (err:any) {
    console.error("Error during the Spin request:", err?.response?.data || err.message || err);
    throw err; // Re-throw error for handling by the calling function
  }
};


const SpinEndSignature = async ({ signature,hash,value  }: SpinEndSignatureWithHash) => {
  try {
    const response = await axios.post(
      VortexUrl2,
      {
        value,
      signature,
      hash
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // Return the response data for further processing
  } catch (err:any) {
    console.error("Error during the Spin request:", err?.response?.data || err.message || err);
    throw err; // Re-throw error for handling by the calling function
  }
};

export { SpinEndPoint,SpinEndPoinSigner,SpinEndSignature};
