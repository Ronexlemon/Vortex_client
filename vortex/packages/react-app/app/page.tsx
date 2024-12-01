"use client";

/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Spin from "@/components/spin";
//import { ethers } from "ethers";
import { useAccount,usePublicClient } from "wagmi";
import { ethers } from "ethers-v6";
//import {useSigner} from "wagmi"

export default function Home() {
  const { address, isConnected } = useAccount();
  const [signer, setSigner] = useState<any>(null);
  const publicClient = usePublicClient();
 // const { data, error, isLoading } = useSigner();
 const getSigner = async () => {
  if (!publicClient) {
    throw new Error("Public client is not available");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner(); // Automatically resolves to the active account.
  return signer;
};

useEffect(() => {
  const fetchSigner = async () => {
    try {
      const signer = await getSigner();
      setSigner(signer);
      console.log("Signer:", signer);
      const address = await signer.getAddress();
      console.log("Signer Address:", address);
    } catch (error) {
      console.error("Error fetching signer error:", error);
    }
  };

  fetchSigner();
}, [publicClient]);

  useEffect(() => {
    if (isConnected && address) {
    //   const provider = new ethers.JsonRpcProvider(
    //     "https://alfajores-forno.celo-testnet.org");
    //   const userSigner = provider.getSigner(address) 
    //   console.log("userSigner Message",userSigner)
    //   console.log("account",add)
    //   setSigner(userSigner);
    //   console.log("signer",signer)
  }
  }, [address, isConnected]);

  return (
    <div className="h-screen w-full">
      {address ? (
        <Spin  signer={signer} userAddress={address as string} />
      ) : (
        <p className="text-center">Connecting to signer...</p>
      )}
    </div>
  );
}
