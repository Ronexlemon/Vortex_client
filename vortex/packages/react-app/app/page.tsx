"use client";

/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWeb3 } from "@/contexts/useWeb3";
import Image from "next/image";
import { useEffect, useState } from "react";
import Spin from "@/components/spin";

export default function Home() {
    // const {
    //     address,
    //     getUserAddress,
    //     sendCUSD,
    //     mintMinipayNFT,
    //     getNFTs,
    //     signTransaction,
    // } = useWeb3();

    // const [cUSDLoading, setCUSDLoading] = useState(false);
    // const [nftLoading, setNFTLoading] = useState(false);
    // const [signingLoading, setSigningLoading] = useState(false);
    // const [userOwnedNFTs, setUserOwnedNFTs] = useState<string[]>([]);
    // const [tx, setTx] = useState<any>(undefined);
    // const [amountToSend, setAmountToSend] = useState<string>("0.1");
    // const [messageSigned, setMessageSigned] = useState<boolean>(false); // State to track if a message was signed


    // useEffect(() => {
    //     getUserAddress();
    // }, []);

    // useEffect(() => {
    //     const getData = async () => {
    //         const tokenURIs = await getNFTs();
    //         setUserOwnedNFTs(tokenURIs);
    //     };
    //     if (address) {
    //         getData();
    //     }
    // }, [address]);

    // async function sendingCUSD() {
    //     if (address) {
    //         setSigningLoading(true);
    //         try {
    //             const tx = await sendCUSD(address, amountToSend);
    //             setTx(tx);
    //         } catch (error) {
    //             console.log(error);
    //         } finally {
    //             setSigningLoading(false);
    //         }
    //     }
    // }

    // async function signMessage() {
    //     setCUSDLoading(true);
    //     try {
    //         await signTransaction();
    //         setMessageSigned(true);
    //     } catch (error) {
    //         console.log(error);
    //     } finally {
    //         setCUSDLoading(false);
    //     }
    // }


    // async function mintNFT() {
    //     setNFTLoading(true);
    //     try {
    //         const tx = await mintMinipayNFT();
    //         const tokenURIs = await getNFTs();
    //         setUserOwnedNFTs(tokenURIs);
    //         setTx(tx);
    //     } catch (error) {
    //         console.log(error);
    //     } finally {
    //         setNFTLoading(false);
    //     }
    // }



    return (
        <div className="h-screen w-full">
            <Spin/>
        </div>
    );
}
