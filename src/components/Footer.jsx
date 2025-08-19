import React from "react";
import Waves from "./magicui/Wave";

const Footer = () => (
  <footer className="w-full mt-6 border-t border-gray-300 dark:border-zinc-700 font-lato transition-colors duration-300">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row flex-wrap items-center text-center sm:items-start sm:text-left justify-between gap-8">
      {/* Left: Logo + Info */}
      <div className="flex-1 flex flex-col items-center text-center sm:items-start sm:text-left min-w-[280px] max-w-full sm:max-w-xs">
        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3 mb-3">
          <img src="/Logo.svg" alt="IIITBH Logo" className="h-6 w-6 sm:h-7 sm:w-7" />
          <span className="font-bold text-lg sm:text-xl tracking-tight text-gray-900 dark:text-white">
            PYQ Hub
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm max-w-xs font-normal leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vitae nunc eget leo placerat cursus.
        </p>
        <a
          href="#developers"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-orange-600 font-semibold underline text-xs sm:text-sm hover:text-orange-700 transition-colors"
        >
          Meet the Developers
        </a>
      </div>

      {/* Right: Stats */}
      <div className="flex-1 flex flex-col items-center text-center sm:items-end sm:text-right gap-8 w-full sm:w-auto sm:max-w-xs min-w-[280px]">
        <div className="flex flex-col items-center sm:items-end gap-6 w-full">
          <div className="text-center sm:text-right w-full">
            <span className="font-semibold text-orange-600 text-xs tracking-wide uppercase">
              Total Viewers
            </span>
            <div className="text-2xl sm:text-3xl font-light text-gray-800 dark:text-gray-200 mt-1">
              121
            </div>
          </div>
          <div className="text-center sm:text-right w-full">
            <span className="font-semibold text-orange-600 text-xs tracking-wide uppercase">
              Feedback
            </span>
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-1 leading-relaxed whitespace-pre-line">
              Click here to open feedback form.
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Waves at the bottom */}
    <Waves />
  </footer>
);

export default Footer;
