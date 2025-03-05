import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  xVelocity: number;
  yVelocity: number;
  rotationVelocity: number;
}

interface ConfettiEffectProps {
  isActive?: boolean;
  duration?: number;
  pieceCount?: number;
}

const ConfettiEffect: React.FC<ConfettiEffectProps> = ({
  isActive = true,
  duration = 5000,
  pieceCount = 200,
}) => {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [isVisible, setIsVisible] = useState(isActive);

  // Generate random confetti pieces
  useEffect(() => {
    if (isActive) {
      const colors = [
        "#FF1493", // Deep Pink
        "#00FF00", // Lime Green
        "#FFD700", // Gold
        "#00BFFF", // Deep Sky Blue
        "#FF4500", // Orange Red
        "#9400D3", // Dark Violet
        "#FF6347", // Tomato
        "#32CD32", // Lime Green
        "#1E90FF", // Dodger Blue
        "#FFFF00", // Yellow
      ];
      const newConfetti: ConfettiPiece[] = [];

      for (let i = 0; i < pieceCount; i++) {
        newConfetti.push({
          id: i,
          x: Math.random() * 100, // percentage across screen
          y: -10 - Math.random() * 20, // start above viewport
          size: 5 + Math.random() * 15,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          xVelocity: -2 + Math.random() * 4,
          yVelocity: 1 + Math.random() * 5,
          rotationVelocity: -5 + Math.random() * 10,
        });
      }

      setConfetti(newConfetti);
      setIsVisible(true);

      // Hide confetti after duration
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isActive, duration, pieceCount]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden bg-transparent">
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{
            x: `${piece.x}vw`,
            y: `${piece.y}vh`,
            rotate: piece.rotation,
            opacity: 1,
          }}
          animate={{
            x: `${piece.x + piece.xVelocity * 20}vw`,
            y: `${piece.y + piece.yVelocity * 100}vh`,
            rotate: piece.rotation + piece.rotationVelocity * 100,
            opacity: 0,
          }}
          transition={{
            duration: duration / 1000,
            ease: "easeOut",
          }}
          style={{
            position: "absolute",
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "0%",
          }}
        />
      ))}
    </div>
  );
};

export default ConfettiEffect;
