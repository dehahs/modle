import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import LetterGrid from "./LetterGrid";
import VirtualKeyboard from "./VirtualKeyboard";

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
  onGameOver?: (won: boolean, attempts: number) => void;
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
  maxAttempts = 5,
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
      onGameOver(true, newGuessesUsed);
    } else if (newGuessesUsed >= maxAttempts) {
      // Lose condition
      onGameOver(false, maxAttempts);
    } else {
      // Continue with a new nested modal
      setNestedModals([
        ...nestedModals,
        {
          guess: newGuess,
          level: nestedModals.length + 1,
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
    // For the first modal, just show the current guess
    if (!isNestedModal) {
      return [currentGuess];
    }

    // For nested modals, collect all guesses up to this point
    // This includes the original guess plus all nested modal guesses
    const allPreviousGuesses = [];

    // Add the current guess for this modal
    allPreviousGuesses.push(currentGuess);

    return allPreviousGuesses;
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent
          className="bg-white dark:bg-gray-800 w-[90%] max-w-md fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            position: "fixed",
            zIndex: 50 + nestedLevel,
            marginTop: `${nestedLevel * 10}px`,
            marginLeft: `${nestedLevel * 10}px`,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">
              {isNestedModal ? `Incorrect Guess #${guessesUsed}` : "Your Guess"}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            {/* Previous Guesses */}
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Previous Guesses:</h3>
              <div className="scale-[0.85] origin-top">
                <LetterGrid
                  guesses={getAllPreviousGuesses()}
                  maxGuesses={getAllPreviousGuesses().length}
                  wordLength={5}
                />
              </div>
            </div>

            {/* Next Guess Input */}
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">
                Enter your next guess:
              </h3>
              <div className="flex justify-center mb-4">{getEmptyBoxes()}</div>

              <div className="mt-4 w-full">
                <VirtualKeyboard
                  onKeyPress={handleKeyPress}
                  keyStates={keyStates}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              {maxAttempts - guessesUsed} guesses remaining
            </p>
            <Button
              onClick={() => {
                if (nextGuess.length === 5) {
                  submitGuess(nextGuess);
                  setNextGuess("");
                }
              }}
              disabled={nextGuess.length !== 5}
            >
              Submit
            </Button>
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
          previousGuesses={allGuesses.slice(
            0,
            allGuesses.length - nestedModals.length + modal.level - 1,
          )}
          targetWord={targetWord}
          maxAttempts={maxAttempts}
          onGameOver={onGameOver}
          isNestedModal={true}
          nestedLevel={modal.level + 1}
          totalGuessesUsed={modal.guessNumber}
        />
      ))}
    </>
  );
};

export default GuessModal;
