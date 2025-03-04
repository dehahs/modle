import React, { useState } from "react";
import GameBoard from "./GameBoard";
import GameOverModal from "./GameOverModal";
import ConfettiEffect from "./ConfettiEffect";

const Home: React.FC = () => {
  // Game state
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isWinner, setIsWinner] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [key, setKey] = useState<number>(0); // Used to reset the game

  // Handle game over event
  const handleGameOver = (won: boolean, attemptCount: number) => {
    setIsWinner(won);
    setAttempts(attemptCount);
    setGameOver(true);

    if (won) {
      setShowConfetti(true);
    }
  };

  // Reset the game
  const handlePlayAgain = () => {
    setGameOver(false);
    setIsWinner(false);
    setAttempts(0);
    setShowConfetti(false);
    setKey((prev) => prev + 1); // Force re-render of GameBoard
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Main game container */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4">
        <GameBoard
          key={key}
          onGameOver={handleGameOver}
          targetWord="MODAL"
          maxAttempts={5}
        />
      </div>

      {/* Game over modal */}
      {gameOver && (
        <GameOverModal
          isOpen={gameOver}
          onClose={() => setGameOver(false)}
          onPlayAgain={handlePlayAgain}
          isWinner={isWinner}
          attempts={attempts}
          maxAttempts={5}
        />
      )}

      {/* Confetti effect when winning */}
      {showConfetti && <ConfettiEffect isActive={showConfetti} />}
    </div>
  );
};

export default Home;
