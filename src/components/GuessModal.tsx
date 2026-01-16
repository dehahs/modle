import React, { useState, useCallback } from "react";
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
  ClickTooltip,
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
  frozenRemainingGuesses?: number;
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
  frozenRemainingGuesses,
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

  // Calculate the remaining guesses, using frozenRemainingGuesses if provided
  // If it's the first modal and no frozenRemainingGuesses, always show maxAttempts - 1
  const displayRemainingGuesses = frozenRemainingGuesses !== undefined 
    ? frozenRemainingGuesses 
    : (!isNestedModal 
      ? maxAttempts - 1  // Always show 5 for the first modal
      : maxAttempts - guessesUsed);

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
  const submitGuess = useCallback((guess: string) => {
    if (guess.length !== targetWord.length) return;

    const result = checkGuess(guess, targetWord);
    const newGuess = { word: guess, result };

    setGuessesUsed((prevGuessesUsed) => {
      const newGuessesUsed = prevGuessesUsed + 1;
      
      setAllGuesses((prevAllGuesses) => {
        const updatedGuesses = [...prevAllGuesses, newGuess];

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
          
          setNestedModals((prevNestedModals) => [
            ...prevNestedModals,
            {
              guess: newGuess,
              level: newNestedLevel,
              guessNumber: newGuessesUsed,
            },
          ]);
        }

        return updatedGuesses;
      });

      return newGuessesUsed;
    });
  }, [targetWord, maxAttempts, onGameOver, isNestedModal, nestedLevel, checkGuess]);

  // Handle key press for the virtual keyboard
  const handleKeyPress = useCallback((key: string) => {
    // Don't handle if game is over
    if (guessesUsed >= maxAttempts || allGuesses.some(g => g.result.every(r => r === "correct"))) {
      return;
    }

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
  }, [guessesUsed, maxAttempts, allGuesses, nextGuess, submitGuess]);

  // Handle physical keyboard input
  React.useEffect(() => {
    const handleKeyboardInput = (event: KeyboardEvent) => {
      // Don't handle if game is over
      if (guessesUsed >= maxAttempts || allGuesses.some(g => g.result.every(r => r === "correct"))) {
        return;
      }

      // Don't handle if user is typing in an input field
      const target = event.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }

      const key = event.key.toUpperCase();

      // Handle Enter key
      if (key === "ENTER") {
        event.preventDefault();
        handleKeyPress("ENTER");
      }
      // Handle Backspace key
      else if (key === "BACKSPACE") {
        event.preventDefault();
        handleKeyPress("BACKSPACE");
      }
      // Handle letter keys (A-Z)
      else if (/^[A-Z]$/.test(key)) {
        event.preventDefault();
        handleKeyPress(key);
      }
    };

    window.addEventListener("keydown", handleKeyboardInput);
    return () => {
      window.removeEventListener("keydown", handleKeyboardInput);
    };
  }, [guessesUsed, maxAttempts, allGuesses, handleKeyPress]);

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
          className="p-2 sm:p-4 overflow-y-auto"
          onOpenAutoFocus={(e) => e.preventDefault()}
          style={{
            width: isNestedModal 
              ? `calc(95% - ${nestedLevel * 40}px)` 
              : '95%',
            maxWidth: isNestedModal 
              ? `calc(800px - ${nestedLevel * 80}px)` 
              : '800px',
            height: isNestedModal 
              ? `calc(95vh - ${nestedLevel * 40}px)` 
              : '95vh',
            maxHeight: isNestedModal 
              ? `calc(900px - ${nestedLevel * 80}px)` 
              : '900px',
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
            <ClickTooltip 
              content={<p>There is no escape from nested modals.</p>}
              side="left"
            >
              <button 
                className="absolute right-1 top-1 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                onClick={() => {}}
                autoFocus={false}
                tabIndex={-1}
              >
                <Cross2Icon className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            </ClickTooltip>
          </div>

          <DialogHeader>
            <DialogTitle className="text-center text-lg sm:text-xl font-bold">
              {guessesUsed >= maxAttempts || allGuesses.some(g => g.result.every(r => r === "correct")) 
                ? "Game Over" 
                : "Modle"}
            </DialogTitle>
            <DialogDescription className="text-center text-xs sm:text-sm px-2">
              {guessesUsed >= maxAttempts || allGuesses.some(g => g.result.every(r => r === "correct"))
                ? `The word was ${targetWord.toUpperCase()}`
                : "like Wordle, but the word is always MODAL"}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto pb-16">
            {(guessesUsed >= maxAttempts || allGuesses.some(g => g.result.every(r => r === "correct"))) ? (
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-semibold text-center">Your Guesses:</h3>
                <div className="flex justify-center overflow-x-auto">
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
              <div className="space-y-2 sm:space-y-4">
                <div className="flex flex-col items-center">
                  <div className="flex justify-center w-full overflow-x-auto">
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

                <div className="mt-2 sm:mt-4">
                  <div className="flex flex-col items-center">
                    <div className="flex justify-center w-full px-1">
                      <VirtualKeyboard
                        onKeyPress={handleKeyPress}
                        keyStates={keyStates}
                        compact={true}
                      />
                    </div>
                    {/* Shahed Link */}
                    <div className="mt-2 sm:mt-4 text-center">
                      <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                        An experiment by{" "}
                        <a 
                          href="https://www.shah3d.com" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500"
                        >
                          Shahed
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="sticky bottom-0 left-0 right-0 flex justify-center items-center p-2 sm:p-4 bg-white border-t">
            {!(guessesUsed >= maxAttempts || allGuesses.some(g => g.result.every(r => r === "correct"))) && (
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {displayRemainingGuesses > 1 
                  ? `${displayRemainingGuesses} guesses remaining` 
                  : `${displayRemainingGuesses} guess remaining`}

              </p>
            )}
            {(guessesUsed >= maxAttempts || allGuesses.some(g => g.result.every(r => r === "correct"))) && (
              <Button onClick={onClose} className="w-full sm:w-auto">
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
          frozenRemainingGuesses={maxAttempts - guessesUsed}
        />
      ))}
    </>
  );
};

export default GuessModal;
