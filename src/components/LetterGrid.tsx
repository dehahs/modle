import React from "react";

interface LetterBoxProps {
  letter?: string;
  status?: "correct" | "present" | "absent" | "empty";
  compact?: boolean;
}

const LetterBox: React.FC<LetterBoxProps> = ({
  letter = "",
  status = "empty",
  compact = false
}) => {
  const getBackgroundColor = () => {
    switch (status) {
      case "correct":
        return "bg-green-500 text-white border-green-500";
      case "present":
        return "bg-yellow-500 text-white border-yellow-500";
      case "absent":
        return "bg-gray-500 text-white border-gray-500";
      default:
        return "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600";
    }
  };

  return (
    <div
      className={`
        ${getBackgroundColor()}
        ${compact ? 'w-8 h-8 text-sm' : 'w-12 h-12 text-2xl'}
        border-2 flex items-center justify-center font-bold rounded
        transition-colors duration-500
      `}
    >
      {letter.toUpperCase()}
    </div>
  );
};

interface LetterGridProps {
  guesses: string[] | Array<{
    word: string;
    result: Array<"correct" | "present" | "absent" | "empty">;
  }>;
  statuses?: ("correct" | "present" | "absent" | "empty")[][];
  currentGuess?: string;
  wordLength: number;
  maxGuesses: number;
  compact?: boolean;
}

const LetterGrid: React.FC<LetterGridProps> = ({
  guesses,
  statuses,
  currentGuess = "",
  wordLength,
  maxGuesses,
  compact = false
}) => {
  // Handle both string arrays and object arrays for backward compatibility
  const processedGuesses: string[] = guesses.map((guess: any) => {
    if (!guess) return '';
    return typeof guess === 'string' ? guess : (guess.word || '');
  });
  
  const processedStatuses: ("correct" | "present" | "absent" | "empty")[][] = statuses || 
    guesses.map((guess: any) => {
      if (!guess) return Array(wordLength).fill("empty");
      return typeof guess === 'string' 
        ? Array(guess.length).fill("empty") 
        : (guess.result || Array(wordLength).fill("empty"));
    });

  // Create all rows for the grid
  const allRows = [];
  
  // Generate all rows up to maxGuesses
  for (let i = 0; i < maxGuesses; i++) {
    // Determine what to render in this row
    if (i < processedGuesses.length) {
      // This is a completed guess
      const guess = processedGuesses[i];
      const letters = typeof guess === 'string' ? guess.split("") : [];
      
      allRows.push(
        <div key={i} className="flex gap-1 mb-1">
          {Array.from({ length: wordLength }).map((_, j) => (
            <LetterBox
              key={j}
              letter={letters[j] || ''}
              status={processedStatuses[i] && processedStatuses[i][j] ? processedStatuses[i][j] : "empty"}
              compact={compact}
            />
          ))}
        </div>
      );
    } else if (i === processedGuesses.length) {
      // This is the current guess row
      allRows.push(
        <div key={i} className="flex gap-1 mb-1">
          {Array.from({ length: wordLength }).map((_, j) => (
            <LetterBox
              key={j}
              letter={currentGuess[j] || ""}
              compact={compact}
            />
          ))}
        </div>
      );
    } else {
      // This is an empty row
      allRows.push(
        <div key={i} className="flex gap-1 mb-1">
          {Array.from({ length: wordLength }).map((_, j) => (
            <LetterBox key={j} compact={compact} />
          ))}
        </div>
      );
    }
  }

  return (
    <div className="flex flex-col items-center">
      {allRows}
    </div>
  );
};

export default LetterGrid;
