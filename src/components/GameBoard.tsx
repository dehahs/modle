import React, { useState, useEffect, useCallback } from "react";
import LetterGrid from "./LetterGrid";
import VirtualKeyboard from "./VirtualKeyboard";
import GuessModal from "./GuessModal";
import { isValidWord } from "../lib/dictionary";

interface GameBoardProps {
  onGameOver?: (won: boolean, attempts: number, guesses: Array<{
    word: string;
    result: Array<"correct" | "present" | "absent" | "empty">;
  }>) => void;
  targetWord?: string;
  maxAttempts?: number;
}

const GameBoard: React.FC<GameBoardProps> = ({
  onGameOver = () => {},
  targetWord = "MODAL",
  maxAttempts = 6,
}) => {
  // Game state
  const [guesses, setGuesses] = useState<
    Array<{
      word: string;
      result: Array<"correct" | "present" | "absent" | "empty">;
    }>
  >([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [keyStates, setKeyStates] = useState<
    Record<string, "correct" | "present" | "absent" | "default">
  >({});
  const [gameStatus, setGameStatus] = useState<
    "playing" | "won" | "lost" | "modal"
  >("playing");
  const [firstIncorrectGuess, setFirstIncorrectGuess] = useState<{
    word: string;
    result: Array<"correct" | "present" | "absent" | "empty">;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

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

  // Check the current guess against the target word
  const submitGuess = useCallback(() => {
    if (currentGuess.length !== targetWord.length) return;

    // Check if word is in dictionary
    if (!isValidWord(currentGuess)) {
      setErrorMessage("Not a valid word");
      // Clear error message after 2 seconds
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }

    // Clear any previous error message
    setErrorMessage("");

    const result = checkGuess(currentGuess, targetWord);
    const newGuess = { word: currentGuess, result };

    // Update key states for the virtual keyboard
    setKeyStates((prevKeyStates) => {
      const newKeyStates = { ...prevKeyStates };
      currentGuess.split("").forEach((letter, index) => {
        const status = result[index];
        // Only update if the current status is better than the existing one
        if (
          status === "correct" ||
          (status === "present" && newKeyStates[letter] !== "correct") ||
          (status === "absent" && !newKeyStates[letter])
        ) {
          newKeyStates[letter] = status;
        }
      });
      return newKeyStates;
    });

    const updatedGuesses = [...guesses, newGuess];
    
      // Check if the game is over
      if (currentGuess === targetWord) {
        setGameStatus("won");
        setGuesses(updatedGuesses);
        onGameOver(true, 1, updatedGuesses); // First guess was correct
      } else {
        // First incorrect guess - switch to modal mode
        setGuesses(updatedGuesses);
        setFirstIncorrectGuess(newGuess);
        setGameStatus("modal");
      }
    setCurrentGuess("");
  }, [currentGuess, targetWord, onGameOver]);

  // Process a letter key press (only for the first guess)
  const handleKeyPress = useCallback((key: string) => {
    if (gameStatus !== "playing") return;

    if (key === "ENTER") {
      submitGuess();
    } else if (key === "BACKSPACE") {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (currentGuess.length < targetWord.length && /^[A-Z]$/.test(key)) {
      setCurrentGuess((prev) => prev + key);
    }
  }, [gameStatus, currentGuess, targetWord.length, submitGuess]);

  // Handle physical keyboard input
  useEffect(() => {
    const handleKeyboardInput = (event: KeyboardEvent) => {
      // Don't handle keyboard input if game is not playing
      if (gameStatus !== "playing") return;

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
  }, [gameStatus, handleKeyPress]);

  // Handle game over from the modal
  const handleModalGameOver = (won: boolean, attempts: number, modalGuesses: Array<{
    word: string;
    result: Array<"correct" | "present" | "absent" | "empty">;
  }> = []) => {
    setGameStatus(won ? "won" : "lost");
    
    // The first guess is already included in modalGuesses, so we don't need to add it again
    onGameOver(won, attempts, modalGuesses);
  };

  // Create a current guess row for display
  const getCurrentGuessRow = () => {
    if (currentGuess === "") return null;

    const row = {
      word: currentGuess.padEnd(targetWord.length, " ").trim(),
      result: Array(targetWord.length).fill("empty") as Array<
        "correct" | "present" | "absent" | "empty"
      >,
    };

    return row;
  };

  // Combine completed guesses with the current guess
  const getAllGuesses = () => {
    const currentGuessRow = getCurrentGuessRow();
    return currentGuessRow ? [...guesses, currentGuessRow] : guesses;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-2 sm:p-4 bg-gray-50 dark:bg-gray-900 gap-3 sm:gap-4 md:gap-6">
      {/* Game Title */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-0.5 sm:mb-1 text-gray-800 dark:text-gray-100">
          Modle
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300 px-2">
          like Wordle, but the word is always MODAL
        </p>
      </div>

      {/* Letter Grid - only shown before first incorrect guess */}
      <div className="flex items-center justify-center w-full">
        <LetterGrid
          guesses={guesses.map(g => g.word)}
          statuses={guesses.map(g => g.result)}
          currentGuess={currentGuess}
          wordLength={targetWord.length}
          maxGuesses={maxAttempts}
          errorMessage={errorMessage}
        />
      </div>

      {/* Virtual Keyboard - only shown before first incorrect guess */}
      <div className="w-full max-w-lg px-2 sm:px-4">
        <VirtualKeyboard onKeyPress={handleKeyPress} keyStates={keyStates} />
      </div>

      {/* Shahed Link */}
      <div className="text-center">
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

      {/* Modal for first incorrect guess - all game state is managed here after first incorrect guess */}
      {gameStatus === "modal" && firstIncorrectGuess && (
        <GuessModal
          isOpen={true}
          onClose={() => {}} // No-op to prevent closing
          currentGuess={firstIncorrectGuess}
          previousGuesses={[]} // Don't pass any previous guesses, as the first incorrect guess is already the currentGuess
          targetWord={targetWord}
          maxAttempts={maxAttempts}
          onGameOver={handleModalGameOver}
          attemptNumber={1}
          totalGuessesUsed={1} // We've used 1 guess already
        />
      )}
    </div>
  );
};

export default GameBoard;
