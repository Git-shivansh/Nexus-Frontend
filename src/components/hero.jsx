import React from "react";
import { Link } from "react-router-dom";
import doubleArrowIcon from "../assets/doublearrow.svg";

const Hero = () => {
  return (
    <section className="relative py-4 md:py-10 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
        <h1
          className="font-light
            text-[32px] leading-[36px] tracking-[-0.4px]
            sm:text-[40px] sm:leading-[44px] sm:tracking-[-0.48px]
            md:text-[48px] md:leading-[52px] md:tracking-[-0.56px]
            lg:text-[59px] lg:leading-[60.8px] lg:tracking-[-0.64px]
            font-lato text-current animate-rise-fade delay-100"
        >
          <span className="text-orange-500">Explore</span>
          <span className="mx-2">IIITBH Previous Year</span>
          <span className="block md:inline mx-2 text-orange-500">Questions</span>
          <span className="mx-2">
            with <span className="text-orange-500">ease.</span>
          </span>
        </h1>

        <p className="mt-2 text-gray-500 dark:text-gray-300 max-w-3xl mx-auto text-sm sm:text-base animate-rise-fade delay-200">
          Your go-to resource for exam success, simplified and accessible in one hub.
        </p>

        <p className="mt-2 text-gray-400 dark:text-gray-400 italic text-xs sm:text-sm animate-rise-fade delay-250">
          Play our fun 2D game to recharge between sessions.
        </p>

        <div className="mt-20 animate-rise-fade delay-350">
          <Link
            to="/exam-vault"
            className="inline-flex items-center justify-center space-x-3 bg-gray-800 dark:bg-orange-600
                       text-white font-semibold px-5 py-2.5 rounded-full shadow-md hover:opacity-80 transition"
          >
            <span>Start exploring PYQs</span>
            <img src={doubleArrowIcon} alt="arrow" className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
