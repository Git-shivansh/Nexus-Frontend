import { useState } from "react";
import { Link } from "react-router-dom"; // removed useNavigate

const Navbar = ({ userInitials, userName, onLogout, isLoggedIn, onLoginClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    setShowUserMenu(false);
    onLogout();
  };

  return (
    <nav className="font-lato flex items-center justify-between px-6 md:px-16 py-3 bg-lorange">
      {/* Logo -> link to Home */}
      <Link to="/" aria-label="Go to Home" className="flex items-center space-x-2 cursor-pointer">
        <img src="/Logo.svg" alt="IIITBH Logo" className="h-6 w-6" />
        <span className="text-xl font-bold text-orange-600">PYQ</span>
        <span className="text-xl font-bold">Hub</span>
      </Link>

      {/* Center pill menu for md+ */}
      <div className="hidden md:flex items-center justify-center flex">
        {/* outer border wrapper */}
        <div className="rounded-full border border-gray-300">
          {/* inner content area */}
          <div className="flex justify-center items-center space-x-6 bg-white rounded-full px-2 py-1.5 shadow-sm">
          <Link to="/" className="text-sm hover:text-orange-500 px-2">
            Home
          </Link>

          <Link to="/exam-vault" className="text-sm hover:text-orange-500 px-2">
            Exam Vault
          </Link>

          <button className="text-sm hover:text-orange-500 px-2 flex items-center">
            <span>Feedback</span>           
          </button>

          {/* login / initials button inside the pill. fixed-size background so initials don't change width */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="ml-2 w-10 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-medium hover:bg-gray-700 transition"
                title={userName}
                aria-label="User menu"
              >
                <span className="truncate">{userInitials}</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">{userName}</div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
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
              className="ml-2 w-20 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-medium hover:opacity-90 transition"
            >
              Log In
            </button>
          )}
          </div>
        </div>
      </div>

      {/* Sign up button on the far right (visible on md+) */}
      <div className="hidden md:block">
        <Link to="/signup" className="inline-block">
          <button className="bg-gray-800 text-white px-3 h-9 rounded-full hover:opacity-90 transition text-sm font-medium border">New User ?</button>
        </Link>
      </div>

      {/* Mobile right area: menu button only (signup hidden on small screens) */}
      <div className="flex md:hidden items-center">
        <button onClick={() => setIsOpen(!isOpen)} className="text-2xl">
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white border-b shadow-md md:hidden z-50">
          <div className="flex flex-col space-y-2 p-4">
            <Link to="/" className="hover:text-orange-500">Home</Link>
            <details>
              <summary className="cursor-pointer hover:text-orange-500">Exam Vault</summary>
            </details>
            <details>
              <summary className="cursor-pointer hover:text-orange-500">Feedback</summary>
            </details>

            {isLoggedIn ? (
              <div className="border-t pt-2">
                <div className="text-sm text-gray-600 mb-2">{userName}</div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 pt-2">
                <button
                  onClick={onLoginClick}
                  className="bg-black text-white px-4 py-2 rounded-md hover:opacity-80 transition"
                >
                  Log In
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
