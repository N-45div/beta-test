import React, { useEffect, useState } from "react";

interface HeaderProps {
  isDarkMode: boolean; // Prop to control dark mode
}

const Header: React.FC<HeaderProps> = ({ isDarkMode }) => {
  const [slideIn, setSlideIn] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    setSlideIn(true);
  }, []);

  return (
    <div
      className={`pt-16 pb-0 ml-6 transition-transform duration-700 ease-out transform ${
        slideIn ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="hidden sm:flex flex-wrap space-x-4">
        <a
          href="#"
          onClick={(e) => e.preventDefault()} // Remove this line when implementing actual routing
          className={`rounded-md px-3 py-2 text-sm font-medium ${
            isDarkMode
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
          aria-current="page"
        >
          About
        </a>
        <a
          href="#"
          onClick={(e) => e.preventDefault()} // Remove this line when implementing actual routing
          className={`rounded-md px-3 py-2 text-sm font-medium ${
            isDarkMode
              ? "text-white hover:bg-gray-700 hover:text-white"
              : "text-gray-600 hover:bg-gray-700 hover:text-white"
          }`}
          aria-current="page"
        >
          Progress
        </a>
        <a
          href="#"
          onClick={(e) => e.preventDefault()} // Remove this line when implementing actual routing
          className={`rounded-md px-3 py-2 text-sm font-medium ${
            isDarkMode
              ? "text-white hover:bg-gray-700 hover:text-white"
              : "text-gray-600 hover:bg-gray-700 hover:text-white"
          }`}
        >
          Certification
        </a>
        <a
          href="#"
          onClick={(e) => e.preventDefault()} // Remove this line when implementing actual routing
          className={`rounded-md px-3 py-2 text-sm font-medium ${
            isDarkMode
              ? "text-white hover:bg-gray-700 hover:text-white"
              : "text-gray-600 hover:bg-gray-700 hover:text-white"
          }`}
        >
          Your Profile
        </a>
        <a
          href="#"
          onClick={(e) => e.preventDefault()} // Remove this line when implementing actual routing
          className={`rounded-md px-3 py-2 text-sm font-medium ${
            isDarkMode
              ? "text-white hover:bg-gray-700 hover:text-white"
              : "text-gray-600 hover:bg-gray-700 hover:text-white"
          }`}
          aria-current="page"
        >
          Fun Fact
        </a>
      </div>
      <button
        id="hamburger-menu"
        className="sm:hidden flex flex-col space-y-1.5 w-8 h-8 justify-center items-center focus:outline-none absolute top-10 right-4"
        onClick={toggleMenu}
      >
        <div className={`w-6 h-0.5 ${isDarkMode ? "bg-white" : "bg-black"}`}></div>
        <div className={`w-6 h-0.5 ${isDarkMode ? "bg-white" : "bg-black"}`}></div>
        <div className={`w-6 h-0.5 ${isDarkMode ? "bg-white" : "bg-black"}`}></div>
      </button>
      {menuOpen && (
        <div className="sm:hidden mt-4 flex flex-col space-y-2">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className={`rounded-md px-3 py-2 text-sm font-medium ${
              isDarkMode
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            Progress
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className={`rounded-md px-3 py-2 text-sm font-medium ${
              isDarkMode
                ? "text-white hover:bg-gray-700 hover:text-white"
                : "text-gray-600 hover:bg-gray-700 hover:text-white"
            }`}
          >
            Certification
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className={`rounded-md px-3 py-2 text-sm font-medium ${
              isDarkMode
                ? "text-white hover:bg-gray-700 hover:text-white"
                : "text-gray-600 hover:bg-gray-700 hover:text-white"
            }`}
          >
            Your Profile
          </a>
        </div>
      )}
    </div>
  );
};

export default Header;