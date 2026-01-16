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
    <div className={`w-full max-w-[500px] ${compact ? 'p-0.5' : 'p-1 sm:p-2'} rounded-lg overflow-x-auto`}>
      {keyboardRows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center mb-1 sm:mb-1.5 gap-0.5 sm:gap-1">
          {row.map((key) => {
            const isSpecialKey = key === "ENTER" || key === "BACKSPACE";
            const isEnter = key === "ENTER";
            const isBackspace = key === "BACKSPACE";
            
            return (
              <button
                key={key}
                onClick={() => handleKeyClick(key)}
                className={`
                  ${getKeyColor(key)}
                  ${isSpecialKey 
                    ? compact 
                      ? "px-1.5 text-[8px] sm:text-[9px]" 
                      : "px-2 sm:px-3 text-[9px] sm:text-[10px] md:text-xs" 
                    : compact 
                      ? "px-1 text-[10px] sm:text-xs" 
                      : "px-1.5 sm:px-2 md:px-2.5 text-[10px] sm:text-xs md:text-sm"}
                  ${compact 
                    ? "py-1.5 sm:py-2 h-[32px] sm:h-[36px]" 
                    : "py-2 sm:py-2.5 md:py-3 h-[36px] sm:h-[40px] md:h-[44px]"}
                  ${isEnter ? "flex-[1.5]" : isBackspace ? "flex-[1.5]" : "flex-1"}
                  rounded font-bold transition-colors duration-200
                  flex items-center justify-center
                  min-w-0 max-w-full
                `}
                style={{
                  flexBasis: isEnter || isBackspace ? 'auto' : '0',
                  flexGrow: isEnter || isBackspace ? 1.5 : 1,
                  flexShrink: 1,
                }}
              >
                {isBackspace ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={compact ? "12" : "14"}
                    height={compact ? "12" : "14"}
                    className="sm:w-4 sm:h-4 md:w-5 md:h-5"
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
                  <span className="truncate">{key}</span>
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default VirtualKeyboard;
