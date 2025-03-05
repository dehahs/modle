import React, { useState } from "react";

interface VirtualKeyboardProps {
  onKeyPress?: (key: string) => void;
  keyStates?: Record<string, "correct" | "present" | "absent" | "default">;
  compact?: boolean;
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onKeyPress = () => {},
  keyStates = {},
  compact = false,
}) => {
  // Define keyboard layout
  const keyboardRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
  ];

  // Handle key press
  const handleKeyClick = (key: string) => {
    onKeyPress(key);
  };

  // Get key state color
  const getKeyColor = (key: string) => {
    const state = keyStates[key] || "default";
    switch (state) {
      case "correct":
        return "bg-green-500 text-white";
      case "present":
        return "bg-yellow-500 text-white";
      case "absent":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  return (
    <div className={`w-full max-w-[500px] ${compact ? 'p-1' : 'p-4'} rounded-lg`}>
      {keyboardRows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center mb-1">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => handleKeyClick(key)}
              className={`
                ${getKeyColor(key)}
                ${key === "ENTER" || key === "BACKSPACE" ? 
                  compact ? "px-1 text-[10px]" : "px-2 text-xs" : 
                  compact ? "px-1" : "px-3"}
                ${compact ? "py-2 m-[2px] min-w-[28px]" : "py-4 m-1 min-w-[40px]"}
                rounded font-bold transition-colors duration-200
                flex items-center justify-center
              `}
            >
              {key === "BACKSPACE" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={compact ? "16" : "20"}
                  height={compact ? "16" : "20"}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                  <line x1="18" x2="12" y1="9" y2="15" />
                  <line x1="12" x2="18" y1="9" y2="15" />
                </svg>
              ) : (
                key
              )}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default VirtualKeyboard;
