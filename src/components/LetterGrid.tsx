import React from "react";

interface LetterBoxProps {
  letter?: string;
  status?: "correct" | "present" | "absent" | "empty";
}

const LetterBox: React.FC<LetterBoxProps> = ({
  letter = "",
  status = "empty",
}) => {
  const getBackgroundColor = () => {
    switch (status) {
      case "correct":
        return "bg-green-500";
      case "present":
        return "bg-yellow-500";
      case "absent":
        return "bg-gray-500";
      default:
        return "bg-white dark:bg-gray-800";
    }
  };

  return (
    <div
      className={`w-14 h-14 flex items-center justify-center border-2 border-gray-300 dark:border-gray-600 font-bold text-2xl m-1 ${getBackgroundColor()} transition-colors duration-300`}
    >
      {letter.toUpperCase()}
    </div>
  );
};

interface LetterGridProps {
  guesses?: Array<{
    word: string;
    result: Array<"correct" | "present" | "absent" | "empty">;
  }>;
  maxGuesses?: number;
  wordLength?: number;
}

const LetterGrid: React.FC<LetterGridProps> = ({
  guesses = [],
  maxGuesses = 6,
  wordLength = 5,
}) => {
  // Create a grid with the appropriate number of rows and columns
  const renderGrid = () => {
    const rows = [];

    for (let i = 0; i < maxGuesses; i++) {
      const row = [];
      const currentGuess = guesses[i] || {
        word: "",
        result: Array(wordLength).fill("empty"),
      };

      for (let j = 0; j < wordLength; j++) {
        row.push(
          <LetterBox
            key={`box-${i}-${j}`}
            letter={currentGuess.word[j] || ""}
            status={currentGuess.result[j]}
          />,
        );
      }

      rows.push(
        <div key={`row-${i}`} className="flex justify-center">
          {row}
        </div>,
      );
    }

    return rows;
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md">
      {renderGrid()}
    </div>
  );
};

export default LetterGrid;
