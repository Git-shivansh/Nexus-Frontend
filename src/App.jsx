import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/navbar";
import Hero from "./components/hero";
import { Meteors } from "./components/magicui/meteors";
import { MeteorsDark } from "./components/magicui/MeteorsDark";
import Comingsoon from "./components/ComingSoon";
import ExamVault from "./components/ExamVault";
import Login from "./components/Login";
import Test from "./components/test.jsx";
import Footer from "./components/Footer";

const Layout = ({
  children,
  user,
  showLogin,
  handleLogout,
  handleLoginClick,
  onLogin,
  setShowLogin,
  darkMode,
  toggleDarkMode,
}) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div
      className={`relative min-h-screen transition-colors duration-500 ${
        darkMode
          ? "bg-gradient-to-b from-gray-800 to-zinc-1000 text-white"
          : "bg-white text-black"
      }`}
    >
      {/* Decorative top-right background image */}
      {isHomePage && (
        <img
          src={darkMode ? "/bg-dark.png" : "/bg.png"}
          alt="background decorative"
          className="pointer-events-none hidden sm:block absolute top-0 right-0 opacity-90"
          style={{ zIndex: 5, width: "46rem", maxWidth: "100%" }}
        />
      )}

      {/* Meteors layer */}
      {isHomePage && (
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          {darkMode ? <MeteorsDark number={25} /> : <Meteors number={25} />}
        </div>
      )}

      {/* Main content */}
      <div className="relative z-20">
        <Navbar
          userInitials={user?.initials}
          userName={user?.name}
          isLoggedIn={!!user}
          onLogout={handleLogout}
          onLoginClick={handleLoginClick}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />

        {children}

        {showLogin && <Login onLogin={onLogin} onClose={() => setShowLogin(false)} />}
      </div>
    </div>
  );
};

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  const handleLogin = (userData) => {
    setUser(userData);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const HomePage = () => (
    <>
      <main className="container mx-auto py-8 md:px-10 px-4">
        <div className="space-y-4">
          <Hero />
        </div>
      </main>
      <div className="m-10">
        <Comingsoon />
      </div>
      <Footer />
    </>
  );

  return (
    <Router>
      <Layout
        user={user}
        showLogin={showLogin}
        handleLogout={handleLogout}
        handleLoginClick={handleLoginClick}
        onLogin={handleLogin}
        setShowLogin={setShowLogin}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/exam-vault" element={<ExamVault />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
