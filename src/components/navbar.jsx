import { useState } from "react";
import { Link } from "react-router-dom"; // removed useNavigate
import DropdownIcon from "../assets/dropdown.svg";

const Navbar = ({ userInitials, userName, onLogout, isLoggedIn, onLoginClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    setShowUserMenu(false);
    onLogout();
  };

  return (
    <nav className=" font-inter flex items-center justify-between px-16 py-3 border-b-2 bg-white shadow">
      {/* Logo -> link to Home */}
      <Link to="/" aria-label="Go to Home" className="flex items-center space-x-2 cursor-pointer">
        <img src="/Logo.svg" alt="IIITBH Logo" className="h-6 w-6" />
        <span className="text-xl font-bold text-orange-600">IIITBH</span>
        <span className="text-xl font-bold">Nexus</span>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-6">
        {/* Home */}
        <div className="flex items-center space-x-1 hover:text-orange-500 cursor-pointer">
          <Link to="/" className="flex items-center space-x-1">
            <span>Home</span>            
          </Link>
        </div>
        <div className="relative group">
          <Link to="/exam-vault" className="hover:text-orange-500 flex items-center space-x-2">
            <span>Exam Vault</span>          
          </Link>          
        </div>

        {/* Feedback */}
        <div className="relative group">
          <button className="font-inter hover:text-orange-500 flex items-center space-x-2 ">
            <span>Feedback</span>
            <img
              src={DropdownIcon}
              alt="Dropdown"
              className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180 relative top-[1px]"
            />
          </button>          
        </div>

        {/* User Section */}
        {isLoggedIn ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-medium hover:bg-gray-700 transition"
              title={userName}
            >
              {userInitials}
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    {userName}
                  </div>
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
            className="bg-black text-white px-4 py-2 rounded-md hover:opacity-80 transition"
          >
            Log In
          </button>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="text-2xl">
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white border-b shadow-md md:hidden z-50">
          <div className="flex flex-col space-y-2 p-4">
            <Link to="/" className="hover:text-orange-500">
              Home
            </Link>
            <details>
              <summary className="cursor-pointer hover:text-orange-500">
                <Link to="/exam-vault">Exam Vault</Link>
              </summary>             
            </details>
            <details>
              <summary className="cursor-pointer hover:text-orange-500">
                Feedback
              </summary>                
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
              <button
                onClick={onLoginClick}
                className="bg-black text-white px-4 py-2 rounded-md hover:opacity-80 transition"
              >
                Log In
              </button>
            )}
          </div>
        </div>
      )}
      </nav>
    );
  };

export default Navbar;
