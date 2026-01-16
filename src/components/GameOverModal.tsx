import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import LetterGrid from "./LetterGrid";
import ConfettiEffect from "./ConfettiEffect";
import { Cross2Icon } from "@radix-ui/react-icons";
import {
  ClickTooltip,
} from "./ui/tooltip";

interface GameOverModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onPlayAgain?: () => void;
  isWinner?: boolean;
  attempts?: number;
  maxAttempts?: number;
  guesses?: Array<{
    word: string;
    result: Array<"correct" | "present" | "absent" | "empty">;
  }>;
}

const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen = true,
  onClose = () => {},
  onPlayAgain = () => {},
  isWinner = false,
  attempts = 0,
  maxAttempts = 6,
  guesses = [],
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        className="p-2 sm:p-4 overflow-y-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
        style={{
          width: '95%',
          maxWidth: '600px',
          height: '90vh',
          maxHeight: '800px',
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 50,
          backgroundColor: 'white',
          color: 'black',
          borderRadius: '0.5rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Close icon with tooltip */}
        <div className="relative">
          <ClickTooltip 
            content={<p>There is no escape from nested modals.</p>}
            side="left"
          >
            <button 
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
              onClick={() => {}}
              autoFocus={false}
              tabIndex={-1}
            >
              <Cross2Icon className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </ClickTooltip>
        </div>

        {/* Show confetti effect when the player wins */}
        {isWinner && <ConfettiEffect isActive={true} />}
        
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-center">
            {isWinner ? "Congratulations!" : "Game Over"}
          </DialogTitle>
        </DialogHeader>

        <div className="py-2 sm:py-4 text-center px-2">
          {isWinner ? (
            <p className="text-base sm:text-lg mb-2">
              You guessed the word{" "}
              <span className="font-bold text-green-500">MODAL</span> in{" "}
              <span className="font-bold">{attempts}</span>{" "}
              {attempts === 1 ? "attempt" : "attempts"}!
            </p>
          ) : (
            <p className="text-base sm:text-lg mb-2">
              You've used all {maxAttempts} attempts. The word was{" "}
              <span className="font-bold text-green-500">MODAL</span>.
            </p>
          )}
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
            {isWinner
              ? "Great job! Would you like to play again?"
              : "Better luck next time! Would you like to try again?"}
          </p>
        </div>

        {/* Display all guesses */}
        {guesses.length > 0 && (
          <div className="mb-4 sm:mb-6 overflow-x-auto">
            <h3 className="text-xs sm:text-sm font-medium mb-3 sm:mb-6 text-center">Your Guesses:</h3>
            <div className="flex justify-center">
              <LetterGrid
                guesses={guesses.map(g => g.word)}
                statuses={guesses.map(g => g.result)}
                wordLength={5}
                maxGuesses={guesses.length}
                compact={true}
              />
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-center sm:justify-center gap-2 pb-2 sm:pb-4">
          <Button
            onClick={onPlayAgain}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 sm:px-6 rounded-lg w-full sm:w-auto"
          >
            Play Again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GameOverModal;
