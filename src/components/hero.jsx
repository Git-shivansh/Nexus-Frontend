import React from 'react'

const Hero = () => {
  return (
    <div className="justify-start flex flex-col p-8 bg-gradient-to-r from-zinc-800 to-zinc-500 rounded-2xl font-inter ">
       <div className="max-w-xl">
         <div className="self-stretch tracking-tighter text-white text-2xl font-normal font-inter">Welcome to IIITBH Student Hub!</div>
        <span className="text-left text-white text-wrap font-light font-inter opacity-80 leading-relaxed">Your go-to spot for IIIT Bhagalpur students to access resources, share knowledge, and build community. We're starting simple with previous year questions More features coming soon—stay tuned!</span>
       </div>
    </div>
  )
}

export default Hero