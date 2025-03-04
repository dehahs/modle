import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";

interface GameOverModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onPlayAgain?: () => void;
  isWinner?: boolean;
  attempts?: number;
  maxAttempts?: number;
}

const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen = true,
  onClose = () => {},
  onPlayAgain = () => {},
  isWinner = false,
  attempts = 0,
  maxAttempts = 5,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-gray-800 border-0 sm:max-w-md">
        {/* Confetti effect would be rendered here when implemented */}
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {isWinner ? "Congratulations!" : "Game Over"}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 text-center">
          {isWinner ? (
            <p className="text-lg mb-2">
              You guessed the word{" "}
              <span className="font-bold text-green-500">MODAL</span> in{" "}
              <span className="font-bold">{attempts}</span>{" "}
              {attempts === 1 ? "attempt" : "attempts"}!
            </p>
          ) : (
            <p className="text-lg mb-2">
              You've used all {maxAttempts} attempts. The word was{" "}
              <span className="font-bold text-green-500">MODAL</span>.
            </p>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {isWinner
              ? "Great job! Would you like to play again?"
              : "Better luck next time! Would you like to try again?"}
          </p>
        </div>

        <DialogFooter className="flex justify-center sm:justify-center gap-2">
          <Button
            onClick={onPlayAgain}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg"
          >
            Play Again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GameOverModal;
