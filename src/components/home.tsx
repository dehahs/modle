import React, { useState } from "react";
import GameBoard from "./GameBoard";
import GameOverModal from "./GameOverModal";

const Home: React.FC = () => {
  // Game state
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isWinner, setIsWinner] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);
  const [key, setKey] = useState<number>(0); // Used to reset the game
  const [guesses, setGuesses] = useState<Array<{
    word: string;
    result: Array<"correct" | "present" | "absent" | "empty">;
  }>>([]);

  // Handle game over event
  const handleGameOver = (won: boolean, attemptCount: number, finalGuesses: Array<{
    word: string;
    result: Array<"correct" | "present" | "absent" | "empty">;
  }>) => {
    setIsWinner(won);
    setAttempts(attemptCount);
    setGuesses(finalGuesses);
    setGameOver(true);
  };

  // Reset the game
  const handlePlayAgain = () => {
    setGameOver(false);
    setIsWinner(false);
    setAttempts(0);
    setGuesses([]);
    setKey((prev) => prev + 1); // Force re-render of GameBoard
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      {/* Main game container */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        <GameBoard
          key={key}
          onGameOver={handleGameOver}
          targetWord="MODAL"
          maxAttempts={6}
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
          maxAttempts={6}
          guesses={guesses}
        />
      )}
    </div>
  );
};

export default Home;
