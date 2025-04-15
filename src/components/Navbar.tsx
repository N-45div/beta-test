import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { FaTools, FaSun, FaMoon } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";

interface NavbarProps {
  level: string;
  questionnaire: string;
  live_generation: string;
  calculations?: string;
}

const Navbar: React.FC<NavbarProps> = ({ level, questionnaire, live_generation, calculations }) => {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const location = useLocation();
  const navigation = useNavigate();
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<string | null>(null);

  useEffect(() => {
    // Debug: Log current pathname and props
    console.log("Navbar - Current pathname:", location.pathname);
    console.log("Navbar - Props:", { level, questionnaire, live_generation, calculations });

    // Set active button based on current pathname
    const pathname = location.pathname;
    if (pathname === level) {
      setActiveButton("Document");
    } else if (pathname === questionnaire) {
      setActiveButton("Questionnaire");
    } else if (pathname === live_generation) {
      setActiveButton("Live Document Generation");
    } else if (pathname === "/Finish") {
      setActiveButton("Generated Document");
    } else if (pathname === calculations) {
      setActiveButton("Calculations");
    } else {
      setActiveButton(null);
    }
  }, [location.pathname, level, questionnaire, live_generation, calculations]);

  const handlePageChange = (label: string) => {
    // Debug: Log navigation attempt
    console.log(`Navbar - Navigating to ${label} with route:`, {
      Document: level,
      Questionnaire: questionnaire,
      "Live Document Generation": live_generation,
      Calculations: calculations,
    }[label]);

    const routes: Record<string, string | null | undefined> = {
      Document: level,
      Questionnaire: questionnaire,
      "Live Document Generation": live_generation,
      "Generated Document": "/Finish",
      Calculations: calculations,
    };

    const path = routes[label];
    if (path) {
      navigation(path);
    } else {
      console.warn(`No route found for label: ${label}`);
    }
  };

  const pages = ["Document", "Questionnaire"];
  if (typeof calculations !== "undefined") {
    pages.push("Calculations");
  }
  pages.push("Live Document Generation");

  return (
    <div
      className={`w-full shadow-md sticky top-0 z-50 transition-all duration-500 ${
        isDarkMode ? "bg-gray-800" : "bg-lime-300"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex-1 flex">
            {location.pathname !== "/Finish" ? (
              pages.map((label) => (
                <button
                  key={label}
                  className={`px-8 py-3 cursor-pointer font-medium border-r border-lime-400 transition-colors duration-200 flex items-center space-x-2 ${
                    activeButton === label
                      ? isDarkMode
                        ? "text-teal-300"
                        : "text-gray-700"
                      : isDarkMode
                      ? "text-white"
                      : "text-blue-600"
                  } ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-lime-400"}`}
                  onClick={() => handlePageChange(label)}
                >
                  <span>{label}</span>
                </button>
              ))
            ) : (
              <div className="flex-1 flex justify-end pr-75">
                <span
                  className={`px-8 py-3 font-medium flex items-center space-x-2 text-xl ${
                    isDarkMode ? "text-teal-300" : "text-blue-600"
                  }`}
                >
                  <span>Generated Document</span>
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center px-6 space-x-6">
            <span
              className={`text-xl font-semibold tracking-wide ${
                isDarkMode ? "text-teal-300" : "text-blue-600"
              }`}
            >
              Contractual
            </span>
            <div className="relative flex items-center">
              <button
                className={`p-2 rounded-full cursor-pointer transition-colors duration-200 flex items-center justify-center text-2xl ${
                  isDarkMode ? "text-white hover:bg-gray-700" : "text-blue-600 hover:bg-lime-400"
                }`}
                onMouseEnter={() => setTooltip("Settings")}
                onMouseLeave={() => setTooltip(null)}
              >
                <FaTools />
              </button>
              {tooltip === "Settings" && (
                <div
                  className={`absolute top-full mb-2 px-3 py-1 text-sm rounded shadow-md whitespace-nowrap ${
                    isDarkMode ? "text-white bg-gray-700" : "text-white bg-gray-500"
                  }`}
                >
                  Settings
                </div>
              )}
            </div>
            <button
              onClick={toggleDarkMode}
              className={`p-2 relative left-[12vw] rounded-full shadow-md transition-all duration-300 transform hover:scale-110 ${
                isDarkMode
                  ? "bg-gray-600 text-yellow-400 hover:bg-gray-100"
                  : "bg-lime-900 text-white hover:bg-black"
              } flex items-center justify-center text-xl`}
              aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
