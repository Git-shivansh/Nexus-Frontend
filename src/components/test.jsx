import React from "react";
import { Meteors } from "@/components/magicui/meteors";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

function Test() {
  return (
  <div className="relative overflow-hidden h-screen w-screen">
      <Meteors />
    </div>
  );
}

export default Test;
