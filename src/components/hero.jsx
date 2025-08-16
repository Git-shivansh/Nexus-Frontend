import React from 'react'
import { Link } from 'react-router-dom'
import doubleArrowIcon from '../assets/doublearrow.svg'

const Hero = () => {
  return (
    <section className="py-4 md:py-10">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h1 className="font-light 
                 text-[32px] leading-[36px] tracking-[-0.4px]  /* mobile */
                 sm:text-[40px] sm:leading-[44px] sm:tracking-[-0.48px]  /* small screens */
                 md:text-[48px] md:leading-[52px] md:tracking-[-0.56px]  /* tablets */
                 lg:text-[59px] lg:leading-[60.8px] lg:tracking-[-0.64px]  /* desktop */
                 font-lato text-black animate-rise-fade delay-100">
          <span className="text-orange-500">Explore</span>
          <span className="mx-2">IIITBH Previous Year</span>
          <span className="block md:inline mx-2 text-orange-500">Questions</span>
          <span className="mx-2">with <span className="text-orange-500">ease.</span></span>
        </h1>

        <p className="mt-2 text-gray-500 max-w-3xl mx-auto text-sm sm:text-base animate-rise-fade delay-200">
          Your go-to resource for exam success, simplified and accessible in one hub.
        </p>
        <p className="mt-2 text-gray-400 italic text-xs sm:text-sm animate-rise-fade delay-250">A fun 2D game to recharge between sessions is coming soon.</p>

        <div className="mt-8 animate-rise-fade delay-350">
          <Link to="/exam-vault" className="inline-flex items-center justify-center space-x-3 bg-black text-white text-semibold px-5 py-2.5 rounded-full shadow-md hover:opacity-95">
            <span>Start exploring PYQs</span>
            <img src={doubleArrowIcon} alt="arrow" className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Hero