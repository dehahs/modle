import React, { useState, useEffect } from "react";
import LetterGrid from "./LetterGrid";
import VirtualKeyboard from "./VirtualKeyboard";
import GuessModal from "./GuessModal";

interface GameBoardProps {
  onGameOver?: (won: boolean, attempts: number) => void;
  targetWord?: string;
  maxAttempts?: number;
}

const GameBoard: React.FC<GameBoardProps> = ({
  onGameOver = () => {},
  targetWord = "MODAL",
  maxAttempts = 5,
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

  // Process a letter key press (only for the first guess)
  const handleKeyPress = (key: string) => {
    if (gameStatus !== "playing") return;

    if (key === "ENTER") {
      submitGuess();
    } else if (key === "BACKSPACE") {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (currentGuess.length < targetWord.length && /^[A-Z]$/.test(key)) {
      setCurrentGuess((prev) => prev + key);
    }
  };

  // Check the current guess against the target word
  const submitGuess = () => {
    if (currentGuess.length !== targetWord.length) return;

    const result = checkGuess(currentGuess, targetWord);
    const newGuess = { word: currentGuess, result };

    // Update key states for the virtual keyboard
    const newKeyStates = { ...keyStates };
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

    setKeyStates(newKeyStates);
    setGuesses((prev) => [...prev, newGuess]);
    setCurrentGuess("");

    // Check if the game is over
    if (currentGuess === targetWord) {
      setGameStatus("won");
      onGameOver(true, 1); // First guess was correct
    } else {
      // First incorrect guess - switch to modal mode
      setFirstIncorrectGuess(newGuess);
      setGameStatus("modal");
    }
  };

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

  // Handle game over from the modal
  const handleModalGameOver = (won: boolean, attempts: number) => {
    setGameStatus(won ? "won" : "lost");
    onGameOver(won, attempts);
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
    <div className="flex flex-col items-center justify-between h-full p-4 bg-gray-50 dark:bg-gray-900">
      {/* Game Title */}
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold mb-2 text-gray-800 dark:text-gray-100">
          Modle
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          like Wordle, but the word is always MODAL
        </p>
      </div>

      {/* Letter Grid - only shown before first incorrect guess */}
      <div className="flex-grow flex items-center justify-center w-full">
        <LetterGrid
          guesses={getAllGuesses()}
          maxGuesses={maxAttempts}
          wordLength={targetWord.length}
        />
      </div>

      {/* Virtual Keyboard - only shown before first incorrect guess */}
      <div className="mt-4 w-full max-w-lg">
        <VirtualKeyboard onKeyPress={handleKeyPress} keyStates={keyStates} />
      </div>

      {/* Modal for first incorrect guess - all game state is managed here after first incorrect guess */}
      {gameStatus === "modal" && firstIncorrectGuess && (
        <GuessModal
          isOpen={true}
          onClose={() => {}} // No-op to prevent closing
          currentGuess={firstIncorrectGuess}
          previousGuesses={[]}
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
