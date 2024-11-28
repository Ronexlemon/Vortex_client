"use client";

/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Spin from "@/components/spin";
//import { ethers } from "ethers";
import { useAccount } from "wagmi";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [signer, setSigner] = useState<any>(null);

  useEffect(() => {
    if (isConnected && address) {
    //   const provider = new ethers.JsonRpcProvider(
    //     "https://alfajores-forno.celo-testnet.org");
    //   const userSigner = provider.getSigner(address) 
    //   console.log("userSigner Message",userSigner)
    //   console.log("account",add)
    //   setSigner(userSigner);
    }
  }, [address, isConnected]);

  return (
    <div className="h-screen w-full">
      {address ? (
        <Spin  userAddress={address as string} />
      ) : (
        <p className="text-center">Connecting to signer...</p>
      )}
    </div>
  );
}
