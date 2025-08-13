import React from "react";
import astroImage from "../assets/astro.png";

function Comingsoon() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-10 md:px-2 px-4 rounded-xl bg-lorange-background opacity-90">
      <img src={astroImage} alt="Coming Soon" className="h-36 w-36 mb-4" />
      <div className="font-extrabold text-4xl text-center md:mb-4 mb-2">We are building something amazing.</div>
      <div className="font-medium text-xl">Stay Tuned</div>
    </div>
  );
}

export default Comingsoon;
