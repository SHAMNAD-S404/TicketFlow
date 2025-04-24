import React, { forwardRef, useState } from "react";

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ id, label, icon, className, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = props.value !== undefined && String(props.value).trim() !== "";

    return (
      <div className="relative">
        <div
          className={`absolute inset-0 rounded-lg ${
            isFocused ? "bg-gradient-to-r from-blue-600 to-blue-800 opacity-100" : "opacity-0"
          } transition-opacity duration-300 -z-10`}></div>

        <div className="relative border border-white/20 bg-white/5 rounded-lg focus-within:border-transparent transition-colors duration-300">
          <label
            htmlFor={id}
            className={`absolute  -mt-4 transition-all duration-200 pointer-events-none ${
              isFocused || hasValue
                ? "-translate-y-2 scale-80 text-xs text-blue-300 opacity-100"
                : "translate-y-3 text-blue-200 opacity-70"
            }`}>
            {label}
          </label>

          <div className="absolute left-3 top-3 text-blue-300">{icon}</div>

          <input
            ref={ref}
            id={id}
            className="w-full bg-transparent text-white px-3 py-3 pl-10 outline-none rounded-lg"
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus && props.onFocus(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur && props.onBlur(e);
            }}
            {...props}
          />
        </div>
      </div>
    );
  }
);

FloatingInput.displayName = "FloatingInput";
