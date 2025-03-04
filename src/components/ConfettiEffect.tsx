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
  duration = 3000,
  pieceCount = 100,
}) => {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [isVisible, setIsVisible] = useState(isActive);

  // Generate random confetti pieces
  useEffect(() => {
    if (isActive) {
      const colors = [
        "#ff0000",
        "#00ff00",
        "#0000ff",
        "#ffff00",
        "#ff00ff",
        "#00ffff",
      ];
      const newConfetti: ConfettiPiece[] = [];

      for (let i = 0; i < pieceCount; i++) {
        newConfetti.push({
          id: i,
          x: Math.random() * 100, // percentage across screen
          y: -10 - Math.random() * 10, // start above viewport
          size: 5 + Math.random() * 10,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          xVelocity: -1 + Math.random() * 2,
          yVelocity: 1 + Math.random() * 3,
          rotationVelocity: -3 + Math.random() * 6,
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
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden bg-transparent">
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
