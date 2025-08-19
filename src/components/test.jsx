import React from "react";
import { ShineBorder } from "./magicui/shine-border";

function Test() {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-900">
      <div className="relative w-[200px] h-[200px] bg-zinc-800 rounded-xl overflow-hidden">
        <ShineBorder />
      </div>
    </div>
  );
}

export default Test;
