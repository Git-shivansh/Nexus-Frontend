import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";

const Navbar = ({
  userInitials,
  userName,
  onLogout,
  isLoggedIn,
  onLoginClick,
  darkMode,
  toggleDarkMode,
}) => {
  const location = useLocation();
  const containerRef = useRef(null);
  const homeRef = useRef(null);
  const examRef = useRef(null);
  const feedbackRef = useRef(null);

  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, color: "bg-gray-800" });
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeConfigs = {
    "/": { bg: "bg-gray-800 dark:bg-orange-600", text: "text-white", widthOffset: 12 },
    "/exam-vault": { bg: "bg-gray-800 dark:bg-orange-600", text: "text-white", widthOffset: 12 },
    "/feedback": { bg: "bg-gray-800 dark:bg-orange-600", text: "text-white", widthOffset: 10 },
  };

  const inactiveText = "text-gray-800 dark:text-gray-200 hover:text-orange-500";

  useEffect(() => {
    const activeMap = { "/": homeRef, "/exam-vault": examRef, "/feedback": feedbackRef };
    const activeRef = activeMap[location.pathname] || homeRef;

    if (activeRef.current && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const activeRect = activeRef.current.getBoundingClientRect();
      const activeConfig = activeConfigs[location.pathname] || activeConfigs["/"];
      const extra = activeConfig.widthOffset || 0;

      setIndicatorStyle({
        left: activeRect.left - containerRect.left + 6 - extra / 2,
        width: activeRect.width + extra - 12,
        color: activeConfig.bg,
      });
    }
  }, [location.pathname]);

  const handleLogout = () => {
    setShowUserMenu(false);
    onLogout();
  };

  return (
    <nav className="font-lato flex items-center justify-between px-6 md:px-16 py-3 relative">
      {/* Left: Logo */}
      <Link to="/" aria-label="Go to Home" className="flex items-center space-x-2 cursor-pointer">
        <img src="/Logo.svg" alt="IIITBH Logo" className="h-6 w-6" />
        <span className="text-xl font-bold text-orange-600 dark:text-orange-400">PYQ</span>
        <span className="text-xl font-bold dark:text-white">Hub</span>
      </Link>

      {/* Center: Nav Pills (desktop only) */}
      <div
        className="relative rounded-full border border-gray-300 dark:border-gray-700 flex items-center p-1 mx-auto max-w-md hidden md:flex"
        ref={containerRef}
        style={{ minWidth: "250px" }}
      >
        <span
          className={`absolute rounded-full transition-all duration-300 ease-in-out z-0 ${indicatorStyle.color}`}
          style={{ top: "4px", bottom: "4px", left: indicatorStyle.left, width: indicatorStyle.width }}
        />
        <NavLink
          to="/"
          ref={homeRef}
          end
          className={({ isActive }) =>
            `relative z-10 text-sm px-6 py-2 rounded-full font-medium cursor-pointer transition-colors duration-300 ${
              isActive ? activeConfigs["/"].text : inactiveText
            }`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/exam-vault"
          ref={examRef}
          className={({ isActive }) =>
            `relative z-10 text-sm px-6 py-2 rounded-full font-medium cursor-pointer transition-colors duration-300 ${
              isActive ? activeConfigs["/exam-vault"].text : inactiveText
            }`
          }
        >
          Exam Vault
        </NavLink>
        <NavLink
          to="/feedback"
          ref={feedbackRef}
          className={({ isActive }) =>
            `relative z-10 text-sm px-6 py-2 rounded-full font-medium cursor-pointer transition-colors duration-300 ${
              isActive ? activeConfigs["/feedback"].text : inactiveText
            }`
          }
        >
          Feedback
        </NavLink>
      </div>

      {/* Right: Dark mode toggle + User Menu */}
      <div className="hidden md:flex items-center space-x-3">
        <button
          onClick={toggleDarkMode}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-100 dark:hover:bg-zinc-700 transition"
          aria-label="Toggle dark mode"
        >
          {darkMode ? "🌙" : "☀️"}
        </button>

        {isLoggedIn ? (
          <div className="relative inline-block">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="ml-2 w-10 h-9 bg-gray-800 dark:bg-zinc-700 text-white rounded-full flex items-center justify-center text-sm font-medium hover:bg-gray-700 dark:hover:bg-zinc-600 transition"
              title={userName}
              aria-label="User menu"
            >
              <span className="truncate">{userInitials}</span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-transparent dark:bg-zinc-800 border dark:border-zinc-700 rounded-md shadow-lg z-50">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b dark:border-zinc-700">
                    {userName}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-zinc-700"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onLoginClick}
            className="bg-gray-800 dark:bg-orange-600 text-white px-3 h-9 rounded-full hover:opacity-90 transition text-sm font-medium border dark:border-zinc-600"
          >
            Log In/Sign Up
          </button>
        )}
      </div>

      {/* Mobile Hamburger + Dark mode toggle */}
      <div className="flex md:hidden items-center space-x-2">
        <button
          onClick={toggleDarkMode}
          className="text-lg w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 bg-transparent"
        >
          {darkMode ? "🌙" : "☀️"}
        </button>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-2xl text-gray-800 dark:text-gray-200 focus:outline-none"
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-transparent dark:bg-gray-900 shadow-md rounded-b-lg flex flex-col p-4 md:hidden z-50">
          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `py-2 text-sm font-medium ${
                isActive ? `${activeConfigs["/"].bg} text-white rounded-md px-3` : inactiveText
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/exam-vault"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `py-2 text-sm font-medium ${
                isActive ? `${activeConfigs["/exam-vault"].bg} text-white rounded-md px-3` : inactiveText
              }`
            }
          >
            Exam Vault
          </NavLink>
          <NavLink
            to="/feedback"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `py-2 text-sm font-medium ${
                isActive ? `${activeConfigs["/feedback"].bg} text-white rounded-md px-3` : inactiveText
              }`
            }
          >
            Feedback
          </NavLink>

          <div className="border-t my-2 dark:border-gray-700"></div>

          {isLoggedIn ? (
            <div>
              <div className="py-2 text-sm text-gray-600 dark:text-gray-300">{userName}</div>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                onLoginClick();
                setMobileMenuOpen(false);
              }}
              className="bg-gray-800 dark:bg-zinc-700 text-white px-3 py-2 rounded-full w-full text-sm font-medium hover:opacity-90 transition"
            >
              Log In/Sign Up
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
