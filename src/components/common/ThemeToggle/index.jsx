import React from "react";
import useColorTheme from "../../../hooks/useColorTheme";

export default function ThemeToggle() {
  let { isDarkTheme, handleThemeSwitch } = useColorTheme();

  return (
    <div
      onClick={() => handleThemeSwitch(!isDarkTheme)}
      className="w-10 h-6 bg-gray-100 bg-white/90 transition-all duration-300 shadow-inner dark:bg-white/20 cursor-pointer shadow-sm rounded-full"
    >
      <div
        className={`${
          isDarkTheme ? "translate-x-[70%]" : ""
        } transition-all duration-300 h-6 w-6 bg-white dark:bg-slate-800 rounded-full drop-shadow`}
      >
        {isDarkTheme ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
            className="w-6 h-6 p-1 text-sky-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
            ></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
            className="w-6 h-6 p-1 text-sky-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
            ></path>
          </svg>
        )}
      </div>
    </div>
  );
}
