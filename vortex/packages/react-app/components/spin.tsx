"use client"
import React, { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import axios from "axios";
import "./../styles/Spin.css"; // Import global stylesheet
import { SpinEndPoinSigner,SpinEndPoint } from "@/app/url/vortex";
//import { ethers } from "ethers";
import SignTx from "@/app/config/signtx";
interface SpinProps {
  //signer: ethers.Signer;
  userAddress:string;
}
import { useWriteContract } from "wagmi";

const Spin = ({ userAddress }: SpinProps) => {
  const [selectedBetAmount, setSelectedBetAmount] = useState<number>(3);
  const [prizes, setPrizes] = useState([
    { id: 1, name: "X1", value: "1.00", probability: 0.0 },
    { id: 3, name: "X0.5", value: "0.50", probability: 0.0 },
    { id: 4, name: "X1000", value: "1000.00", probability: 100.0 },
    { id: 5, name: "X0.2", value: "0.20", probability: 0.0 },
    { id: 8, name: "X0.8", value: "0.80", probability: 0.0 },
    { id: 9, name: "X150", value: "150.00", probability: 0.0 },
    { id: 10, name: "X9", value: "9.00", probability: 0.0 },
  ]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinAngle, setSpinAngle] = useState(0);
  const [showInstructionsOverlay, setShowInstructionsOverlay] = useState(false);
  const [showPrizeModal, setShowPrizeModal] = useState(false);
  const [prizeName, setPrizeName] = useState<string | null>(null);

  const wheelRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const mockPrizes = [
    { id: 1, name: "X2", value: "2.00", probability: 0.0 },
    { id: 2, name: "X5", value: "5.00", probability: 0.0 },
    { id: 3, name: "X10", value: "10.00", probability: 0.0 },
    { id: 4, name: "X0.1", value: "0.10", probability: 0.0 },
    { id: 5, name: "X50", value: "50.00", probability: 0.0 },
  ];

  useEffect(() => {
    const fetchPrizes = async () => {
      try {
        const response = await axios.get("/api/prizes/");
        setPrizes(response.data);
      } catch (error) {
        console.error("Error fetching prizes, using mock data:", error);
        setPrizes(mockPrizes);
      }
    };

    fetchPrizes();
    initThreeJS();
  }, []);

  const initThreeJS = () => {
    const canvas = canvasRef.current;

    if (!canvas) {
      console.warn("Canvas element not found");
      return;
    }

    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight * 0.9);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerHeight * 0.9), 0.1, 1000);
    camera.position.z = 5;

    const particles = new THREE.BufferGeometry();
    const particleCount = 10000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = Math.random() * 20 - 10;
      positions[i * 3 + 1] = Math.random() * 20 - 10;
      positions[i * 3 + 2] = Math.random() * 20 - 10;

      colors[i * 3] = Math.random();
      colors[i * 3 + 1] = Math.random();
      colors[i * 3 + 2] = Math.random();
    }

    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particles.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    const animate = () => {
      requestAnimationFrame(animate);
      particleSystem.rotation.y += 0.001;
      renderer.render(scene, camera);
    };

    animate();
  };

  const generateSegmentColors = (index: number): string => {
    const colors = ["#FF5733", "#33B5FF", "#FF33EC", "#33FF57", "#FFBD33"];
    return colors[index % colors.length];
  };

  const spinWheel = async () => {
    if (isSpinning) return;

    setIsSpinning(true);

    try {
      // const response = await axios.post("/api/spins/", {
      //   bet_amount: selectedBetAmount,
      // });
      const signtx = await SignTx("1",userAddress)
      const response = await SpinEndPoinSigner({signer:signtx as any,amount:1})
      //const response = await SpinEndPoint({amount:1,userAddress:userAddress,signedTx:signtx as unknown as string})
      const result = response.data;
      console.log("result is resulting",result)
      alert(`Result is${result}`)

      const winningPrize = response.data.winning_prize;
      handleSpinOutcome(winningPrize);
    } catch (error) {
      console.error("Error during spin, using mock data:", error);
      alert(`Result is error ${error}`)
      const fallbackPrize = mockPrizes[Math.floor(Math.random() * mockPrizes.length)];
      handleSpinOutcome(fallbackPrize);
    }
  };

  const handleSpinOutcome = (winningPrize: any) => {
    const anglePerSegment = 360 / prizes.length;
    const prizeIndex = prizes.findIndex((prize) => prize.name === winningPrize.name);

    const randomTurns = Math.floor(Math.random() * 15) + 20;
    const winningAngle = randomTurns * 360 + anglePerSegment * prizeIndex;

    setSpinAngle(winningAngle);

    if (wheelRef.current) {
      wheelRef.current.style.transition = "transform 5s ease-out";
      wheelRef.current.style.transform = `rotate(${winningAngle}deg)`;
    }

    setTimeout(() => {
      setPrizeName(winningPrize.name);
      setShowPrizeModal(true);

      setTimeout(() => {
        setPrizeName(winningPrize.name);
        setShowPrizeModal(true);
        setIsSpinning(false);
      }, 5000);
    } )
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="canvas-container">
        <canvas ref={canvasRef} className="three-canvas" style={{ marginTop: '50px' }}></canvas>
      </div>

      <h1 className="title">Spin to Win</h1>

      <div className="dropdown">
        <button className="button" onClick={() => setSelectedBetAmount((prev) => (prev === 3 ? 6 : 3))}>
          Select Bet Amount: {selectedBetAmount}
        </button>
      </div>

      <div className="wheel-container">
        <div className="wheel-wrapper">
          <div className="wheel" ref={wheelRef}>
            {prizes.map((prize, index) => (
              <div
                key={index}
                className="segment"
                style={{
                  transform: `rotate(${(360 / prizes.length) * index}deg) skewY(-30deg)`,
                  backgroundColor: generateSegmentColors(index),
                }}
              >
                <span>{prize.name}</span>
              </div>
            ))}
          </div>
          <button className="spin-button" onClick={spinWheel} disabled={isSpinning}>
            <div className="pointer"></div>
            SPIN
          </button>
        </div>
      </div>

      {showPrizeModal && (
  <div
    className="modal is-active"
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: 9999,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <div
      className="modal-content"
      style={{
        width: "clamp(50%, 70%, 80%)",
        maxWidth: "800px",
      }}
    >
      <div
        className="box"
        style={{
          textAlign: "center",
          padding: "2rem",
          borderRadius: "10px",
        }}
      >
        <h1
          className="prize-title"
          style={{
            color: "gold",
            fontSize: "clamp(2rem, 5vw, 4rem)",
            fontWeight: "bold",
          }}
        >
          {prizeName}
        </h1>
      </div>
    </div>
  </div>
)}



      {showInstructionsOverlay && (
        <div className="instructions-overlay">
          <div className="instruction-box">Follow the instructions...</div>
        </div>
      )}
    </div>
  );
};

export default Spin;
