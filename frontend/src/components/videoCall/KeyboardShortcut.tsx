import React from "react";

interface KeyboardShortcutProps {
  shortcut: string;
  label?: string;
}

export const KeyboardShortcut: React.FC<KeyboardShortcutProps> = ({ shortcut, label }) => {
  const keys = shortcut.split("+");
  
  return (
    <div className="flex items-center text-xs text-indigo-200">
      <div className="flex items-center space-x-1">
        {keys.map((key, index) => (
          <React.Fragment key={key}>
            <kbd className="px-2 py-1 bg-white/10 rounded-md text-white shadow-sm">
              {key}
            </kbd>
            {index < keys.length - 1 && <span>+</span>}
          </React.Fragment>
        ))}
      </div>
      {label && <span className="ml-2 opacity-70">{label}</span>}
    </div>
  );
};