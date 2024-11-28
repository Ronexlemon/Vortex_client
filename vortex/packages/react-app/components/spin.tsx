import React, { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import axios from "axios";
import "./../styles/Spin.css"; // Import global stylesheet

const Spin: React.FC = () => {
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

  useEffect(() => {
    const fetchPrizes = async () => {
      try {
        const response = await axios.get("/api/prizes/");
        setPrizes(response.data);
      } catch (error) {
        console.error("Error fetching prizes:", error);
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
      const response = await axios.post("/api/spins/", {
        bet_amount: selectedBetAmount,
      });

      const winningPrize = response.data.winning_prize;
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
        setIsSpinning(false);
      }, 5000);
    } catch (error) {
      console.error("Error during spin:", error);
      setIsSpinning(false);
    }
  };

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
            SPIN
          </button>
        </div>
      </div>

      {showPrizeModal && (
        <div className={`modal ${showPrizeModal ? "is-active" : ""}`}>
          <div className="modal-background"></div>
          <div className="modal-content">
            <div className="box">
              <h1 className="prize-title">{prizeName}</h1>
            </div>
          </div>
          <button className="modal-close" onClick={() => setShowPrizeModal(false)}></button>
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
