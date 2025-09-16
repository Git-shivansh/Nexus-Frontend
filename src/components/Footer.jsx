import React from "react";
import Waves from "./magicui/Wave";

const Footer = () => (
  <footer className="w-full mt-6 border-t border-gray-300 dark:border-zinc-700 font-lato transition-colors duration-300">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 md:grid-cols-2 items-start gap-8 sm:gap-10">
      {/* Left: Logo + Info */}
      <div className="w-full max-w-md justify-self-center md:justify-self-start flex flex-col items-center text-center md:items-start md:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3 mb-3">
          <img src="/Logo.svg" alt="IIITBH Logo" className="h-6 w-6 sm:h-7 sm:w-7" />
          <span className="font-bold text-lg sm:text-xl md:text-2xl tracking-tight text-gray-900 dark:text-white">
            PYQ Hub
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm md:text-[15px] max-w-xs md:max-w-sm font-normal leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vitae nunc eget leo placerat cursus.
        </p>
        <a
          href="#developers"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-orange-600 font-semibold underline text-xs sm:text-sm md:text-base hover:text-orange-700 transition-colors"
        >
          Meet the Developers
        </a>
      </div>

      {/* Right: Stats */}
      <div className="w-full max-w-md justify-self-center md:justify-self-end flex flex-col items-center text-center md:items-end md:text-right gap-8">
        <div className="flex flex-col items-center sm:items-end gap-6 w-full">
          <div className="text-center sm:text-right w-full">
            <span className="font-semibold text-orange-600 text-xs tracking-wide uppercase">
              Total Viewers
            </span>
            <div className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-800 dark:text-gray-200 mt-1">
              121
            </div>
          </div>
          <div className="text-center sm:text-right w-full">
            <span className="font-semibold text-orange-600 text-xs tracking-wide uppercase">
              Feedback
            </span>
            <div className="mt-1">
              <a
                href="https://forms.gle/Utg4L6Dn33GiBM2v7"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-orange-600 hover:text-orange-700 underline text-xs sm:text-sm md:text-base transition-colors"
                aria-label="Open feedback form in a new tab"
              >
                Click here to open feedback form.
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Waves at the bottom */}
    <Waves />
  </footer>
);

export default Footer;
