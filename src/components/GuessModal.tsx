import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import LetterGrid from "./LetterGrid";
import VirtualKeyboard from "./VirtualKeyboard";
import { Cross2Icon } from "@radix-ui/react-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface GuessModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  currentGuess?: {
    word: string;
    result: Array<"correct" | "present" | "absent" | "empty">;
  };
  previousGuesses?: Array<{
    word: string;
    result: Array<"correct" | "present" | "absent" | "empty">;
  }>;
  onSubmitGuess?: (guess: string) => void;
  isNestedModal?: boolean;
  nestedLevel?: number;
  targetWord?: string;
  maxAttempts?: number;
  onGameOver?: (won: boolean, attempts: number, guesses: Array<{
    word: string;
    result: Array<"correct" | "present" | "absent" | "empty">;
  }>) => void;
  attemptNumber?: number;
  totalGuessesUsed?: number;
}

const GuessModal: React.FC<GuessModalProps> = ({
  isOpen = true,
  onClose = () => {},
  currentGuess = { word: "", result: Array(5).fill("empty") },
  previousGuesses = [],
  onSubmitGuess,
  isNestedModal = false,
  nestedLevel = 1,
  targetWord = "MODAL",
  maxAttempts = 6,
  onGameOver = () => {},
  attemptNumber = 1,
  totalGuessesUsed = 1, // Default to 1 since we're showing this after the first guess
}) => {
  // State for the next guess input
  const [nextGuess, setNextGuess] = useState<string>("");
  const [keyStates, setKeyStates] = useState<
    Record<string, "correct" | "present" | "absent" | "default">
  >({});
  const [allGuesses, setAllGuesses] = useState<
    Array<{
      word: string;
      result: Array<"correct" | "present" | "absent" | "empty">;
    }>
  >([...previousGuesses, currentGuess]);
  const [nestedModals, setNestedModals] = useState<
    Array<{
      guess: {
        word: string;
        result: Array<"correct" | "present" | "absent" | "empty">;
      };
      level: number;
      guessNumber: number;
    }>
  >([]);
  const [guessesUsed, setGuessesUsed] = useState<number>(totalGuessesUsed);

  // Handle key press for the virtual keyboard
  const handleKeyPress = (key: string) => {
    if (key === "ENTER") {
      if (nextGuess.length === 5) {
        submitGuess(nextGuess);
        setNextGuess("");
      }
    } else if (key === "BACKSPACE") {
      setNextGuess((prev) => prev.slice(0, -1));
    } else if (nextGuess.length < 5 && /^[A-Z]$/.test(key)) {
      setNextGuess((prev) => prev + key);
    }
  };

  // Update key states based on previous guesses
  React.useEffect(() => {
    const newKeyStates: Record<
      string,
      "correct" | "present" | "absent" | "default"
    > = {};

    allGuesses.forEach((guess) => {
      guess.word.split("").forEach((letter, index) => {
        if (!letter) return; // Skip empty letters

        const status = guess.result[index];
        if (
          status === "correct" ||
          (status === "present" && newKeyStates[letter] !== "correct") ||
          (status === "absent" && !newKeyStates[letter])
        ) {
          newKeyStates[letter] = status;
        }
      });
    });

    setKeyStates(newKeyStates);
  }, [allGuesses]);

  // Check a guess against the target word
  const checkGuess = (
    guess: string,
    target: string,
  ): Array<"correct" | "present" | "absent" | "empty"> => {
    const result: Array<"correct" | "present" | "absent" | "empty"> = [];
    const targetLetters = target.split("");
    const guessLetters = guess.split("");

    // First pass: mark correct letters
    guessLetters.forEach((letter, i) => {
      if (letter === targetLetters[i]) {
        result[i] = "correct";
        targetLetters[i] = "";
      }
    });

    // Second pass: mark present or absent letters
    guessLetters.forEach((letter, i) => {
      if (result[i]) return; // Skip already marked letters

      const targetIndex = targetLetters.indexOf(letter);
      if (targetIndex !== -1) {
        result[i] = "present";
        targetLetters[targetIndex] = "";
      } else {
        result[i] = "absent";
      }
    });

    return result;
  };

  // Submit a guess
  const submitGuess = (guess: string) => {
    if (guess.length !== targetWord.length) return;

    // Increment the number of guesses used
    const newGuessesUsed = guessesUsed + 1;
    setGuessesUsed(newGuessesUsed);

    const result = checkGuess(guess, targetWord);
    const newGuess = { word: guess, result };

    // Add to all guesses
    const updatedGuesses = [...allGuesses, newGuess];
    setAllGuesses(updatedGuesses);

    // Check if game is over
    if (guess === targetWord) {
      // Win condition
      onGameOver(true, newGuessesUsed, updatedGuesses);
    } else if (newGuessesUsed >= maxAttempts) {
      // Lose condition
      onGameOver(false, maxAttempts, updatedGuesses);
    } else {
      // Continue with a new nested modal
      // For the first nested modal, use level 1
      const newNestedLevel = isNestedModal ? nestedLevel + 1 : 1;
      
      setNestedModals([
        ...nestedModals,
        {
          guess: newGuess,
          level: newNestedLevel,
          guessNumber: newGuessesUsed,
        },
      ]);
    }
  };

  // Create empty boxes for the next guess
  const getEmptyBoxes = () => {
    return Array(5)
      .fill("")
      .map((_, index) => (
        <div
          key={`empty-${index}`}
          className="w-12 h-12 flex items-center justify-center border-2 border-gray-300 dark:border-gray-600 font-bold text-xl m-1 bg-white dark:bg-gray-800"
        >
          {nextGuess[index] ? nextGuess[index].toUpperCase() : ""}
        </div>
      ));
  };

  // Get all previous guesses to display
  const getAllPreviousGuesses = () => {
    // For the first modal, show the current guess and any previous guesses
    if (!isNestedModal) {
      return [...previousGuesses, currentGuess];
    }

    // For nested modals, collect all guesses up to this point
    // This includes all previous guesses plus the current guess for this modal
    return [...previousGuesses, currentGuess];
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent 
          className="p-4 overflow-y-auto"
          onOpenAutoFocus={(e) => e.preventDefault()}
          style={{
            width: isNestedModal 
              ? `calc(95% - ${nestedLevel * 40}px)` 
              : '95%',
            maxWidth: isNestedModal 
              ? `calc(600px - ${nestedLevel * 40}px)` 
              : '600px',
            height: isNestedModal 
              ? `calc(80vh - ${nestedLevel * 40}px)` 
              : '80vh',
            maxHeight: isNestedModal 
              ? `calc(800px - ${nestedLevel * 40}px)` 
              : '800px',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%)`,
            zIndex: 50 + nestedLevel,
            backgroundColor: 'white',
            color: 'black',
            borderRadius: '0.5rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        >
          {/* Close icon with tooltip */}
          <div className="relative">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                    onClick={() => {}}
                    autoFocus={false}
                    tabIndex={-1}
                  >
                    <Cross2Icon className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left" sideOffset={5} align="center">
                  <p>There is no escape from nested modals.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">
              {guessesUsed >= maxAttempts || allGuesses.some(g => g.result.every(r => r === "correct")) 
                ? "Game Over" 
                : "Make Your Guess"}
            </DialogTitle>
            <DialogDescription className="text-center">
              {guessesUsed >= maxAttempts || allGuesses.some(g => g.result.every(r => r === "correct"))
                ? `The word was ${targetWord.toUpperCase()}`
                : "Try to guess the word!"}
            </DialogDescription>
          </DialogHeader>

          {(guessesUsed >= maxAttempts || allGuesses.some(g => g.result.every(r => r === "correct"))) ? (
            <div className="space-y-4 my-4">
              <h3 className="text-lg font-semibold text-center">Your Guesses:</h3>
              <div className="flex justify-center">
                <LetterGrid
                  guesses={allGuesses.map(g => g.word)}
                  statuses={allGuesses.map(g => g.result)}
                  wordLength={5}
                  maxGuesses={maxAttempts}
                  compact={true}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 my-4">
              <div className="flex flex-col items-center">
                <h3 className="text-md font-medium mb-2">Previous Guesses:</h3>
                <div className="flex justify-center">
                  <LetterGrid
                    guesses={allGuesses.map(g => g.word)}
                    statuses={allGuesses.map(g => g.result)}
                    currentGuess={nextGuess}
                    wordLength={5}
                    maxGuesses={maxAttempts}
                    compact={true}
                  />
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-md font-medium mb-2 text-center">Enter your next guess:</h3>
                <div className="flex justify-center mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`
                        w-10 h-10 border-2 flex items-center justify-center 
                        font-bold text-xl mx-1 rounded
                        ${
                          nextGuess[i]
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-700"
                            : "border-gray-300 dark:border-gray-600"
                        }
                      `}
                    >
                      {nextGuess[i] ? nextGuess[i].toUpperCase() : ""}
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-4">
                  <VirtualKeyboard
                    onKeyPress={handleKeyPress}
                    keyStates={keyStates}
                    compact={true}
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between items-center mt-4">
            {!(guessesUsed >= maxAttempts || allGuesses.some(g => g.result.every(r => r === "correct"))) && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-0">
                {maxAttempts - guessesUsed} guesses remaining
              </p>
            )}
            {(guessesUsed >= maxAttempts || allGuesses.some(g => g.result.every(r => r === "correct"))) && (
              <Button onClick={onClose}>
                Play Again
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Nested modals */}
      {nestedModals.map((modal) => (
        <GuessModal
          key={`nested-modal-${modal.level}`}
          isOpen={true}
          onClose={() => {}}
          currentGuess={modal.guess}
          previousGuesses={allGuesses.slice(0, allGuesses.indexOf(modal.guess))}
          targetWord={targetWord}
          maxAttempts={maxAttempts}
          onGameOver={onGameOver}
          isNestedModal={true}
          nestedLevel={modal.level}
          totalGuessesUsed={modal.guessNumber}
        />
      ))}
    </>
  );
};

export default GuessModal;
