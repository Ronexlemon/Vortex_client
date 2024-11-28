import axios from "axios";
//import { ethers } from "ethers";

interface SpinInterface {
  amount: number;
  signedTx: string;
  userAddress:string
}

export const VortexUrl = "https://vortex-backend-woad.vercel.app/api/stake/Spinsign";

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

export default SpinEndPoint;
