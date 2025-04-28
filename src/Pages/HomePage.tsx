import React, { useState, useMemo, useEffect } from "react";
import {
  FaFileAlt,
  FaTimes,
  FaChevronRight,
  FaRegLightbulb,
  FaPuzzlePiece,
} from "react-icons/fa";
import { GrDocumentConfig } from "react-icons/gr";
import { GiLevelThreeAdvanced } from "react-icons/gi";
import { LuBrain } from "react-icons/lu";
import { BsMoonStarsFill, BsSunFill } from "react-icons/bs";
import { useNavigate } from "react-router";
import Header from "./Header";

interface LevelProps {
  title: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  onClick: () => void;
  link: string;
  isLevel2?: boolean;
}

interface CustomDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPart: (part: string, isDemo?: boolean) => void;
  isDarkMode: boolean;
}

const CustomDialog: React.FC<CustomDialogProps> = ({
  isOpen,
  onClose,
  onSelectPart,
  isDarkMode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 rounded-xl backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div
        className={`rounded-2xl w-full max-w-lg mx-4 transform transition-all duration-300 ease-out animate-scale-in ${
          isDarkMode ? "bg-gray-900" : "bg-white"
        }`}
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* Header */}
        <div
          className={`p-6 border-b ${
            isDarkMode ? "border-gray-800" : "border-gray-100"
          }`}
        >
          <div className="flex justify-between items-center">
            <h3
              className={`text-2xl font-bold ${
                isDarkMode ? "text-gray-100" : "text-gray-800"
              }`}
            >
              Choose Your Path
            </h3>
            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-colors duration-200 ${
                isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
              }`}
            >
              <FaTimes
                className={`${
                  isDarkMode
                    ? "text-gray-300 hover:text-gray-100"
                    : "text-gray-400 hover:text-gray-600"
                } text-xl`}
              />
            </button>
          </div>
          <p
            className={`${isDarkMode ? "text-gray-400" : "text-gray-500"} mt-2`}
          >
            Select which part you'd like to explore
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4">
            {/* Part One Button */}
            <button
              onClick={() => onSelectPart("one")}
              className={`group relative flex items-center p-4 rounded-xl transition-all duration-300 ${
                isDarkMode
                  ? "bg-gradient-to-r from-blue-900/50 to-blue-800/50 hover:from-blue-800 hover:to-blue-700"
                  : "bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200"
              }`}
            >
              <div
                className={`${
                  isDarkMode ? "bg-blue-700" : "bg-blue-500"
                } p-3 rounded-lg`}
              >
                <FaRegLightbulb className="text-white text-xl" />
              </div>
              <div className="ml-4 text-left">
                <h4
                  className={`text-lg font-semibold ${
                    isDarkMode ? "text-blue-200" : "text-blue-900"
                  }`}
                >
                  Part One
                </h4>
                <p
                  className={`${
                    isDarkMode ? "text-blue-400" : "text-blue-600"
                  } text-sm`}
                >
                  Match The Following
                </p>
              </div>
              <FaChevronRight
                className={`absolute right-4 ${
                  isDarkMode
                    ? "text-blue-400 group-hover:text-blue-300"
                    : "text-blue-400 group-hover:text-blue-600"
                } group-hover:transform group-hover:translate-x-1 transition-all`}
              />
            </button>

            {/* Part Two [Demo Button] */}
            <button
              onClick={() => onSelectPart("two", true)}
              className={`group relative flex items-center p-4 rounded-xl transition-all duration-300 ${
                isDarkMode
                  ? "bg-gradient-to-r from-green-900/50 to-lime-800/50 hover:from-green-800 hover:to-lime-700"
                  : "bg-gradient-to-r from-green-50 to-green-100 hover:from-lime-100 hover:to-lime-200"
              }`}
            >
              <div
                className={`${
                  isDarkMode ? "bg-lime-700" : "bg-lime-500"
                } p-3 rounded-lg`}
              >
                <FaPuzzlePiece className="text-white text-xl" />
              </div>
              <div className="ml-4 text-left">
                <h4
                  className={`text-lg font-semibold ${
                    isDarkMode ? "text-lime-200" : "text-lime-900"
                  }`}
                >
                  Part Two [Demo]
                </h4>
                <p
                  className={`${
                    isDarkMode ? "text-lime-400" : "text-lime-600"
                  } text-sm`}
                >
                  Automate Employment Agreement
                </p>
              </div>
              <FaChevronRight
                className={`absolute right-4 ${
                  isDarkMode
                    ? "text-lime-400 group-hover:text-lime-300"
                    : "text-lime-400 group-hover:text-lime-600"
                } group-hover:transform group-hover:translate-x-1 transition-all`}
              />
            </button>

            {/* Part Two Button */}
            <button
              onClick={() => onSelectPart("two")}
              className={`group relative flex items-center p-4 rounded-xl transition-all duration-300 ${
                isDarkMode
                  ? "bg-gradient-to-r from-green-900/50 to-lime-800/50 hover:from-green-800 hover:to-lime-700"
                  : "bg-gradient-to-r from-green-50 to-green-100 hover:from-lime-100 hover:to-lime-200"
              }`}
            >
              <div
                className={`${
                  isDarkMode ? "bg-lime-700" : "bg-lime-500"
                } p-3 rounded-lg`}
              >
                <FaPuzzlePiece className="text-white text-xl" />
              </div>
              <div className="ml-4 text-left">
                <h4
                  className={`text-lg font-semibold ${
                    isDarkMode ? "text-lime-200" : "text-lime-900"
                  }`}
                >
                  Part Two
                </h4>
                <p
                  className={`${
                    isDarkMode ? "text-lime-400" : "text-lime-600"
                  } text-sm`}
                >
                  Automate Employment Agreement
                </p>
              </div>
              <FaChevronRight
                className={`absolute right-4 ${
                  isDarkMode
                    ? "text-lime-400 group-hover:text-lime-300"
                    : "text-lime-400 group-hover:text-lime-600"
                } group-hover:transform group-hover:translate-x-1 transition-all`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`p-6 rounded-b-2xl ${
            isDarkMode ? "bg-gray-800" : "bg-gray-50"
          }`}
        >
          <p
            className={`text-sm text-center ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            You can always switch between parts later
          </p>
        </div>
      </div>
    </div>
  );
};

const LevelCard: React.FC<LevelProps & { isDarkMode: boolean }> = ({
  title,
  description,
  Icon,
  active,
  onClick,
  link,
  isLevel2,
  isDarkMode,
}) => {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);

  const handleStartLevel = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLevel2) {
      setShowDialog(true);
    } else {
      navigate(link);
    }
  };

  const handleSelectPart = (part: string, isDemo?: boolean) => {
    setShowDialog(false);
    if (part === "one") {
      navigate("/Level-Two-Part-One");
    } else if (part === "two" && isDemo) {
      navigate("/Level-Two-Part-Two-Demo");
    } else {
      navigate("/Level-Two-Part-Two");
    }
  };

  return (
    <>
      <div
        className={`p-6 rounded-2xl transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl relative 
          ${
            isDarkMode
              ? `bg-gradient-to-r ${
                  active
                    ? "from-teal-900/50 to-lime-900/50 border-2 border-teal-700/50"
                    : "from-teal-900/30 to-lime-900/30 border border-teal-800/50"
                } hover:from-teal-800/70 hover:to-lime-800/70`
              : `bg-gradient-to-r ${
                  active
                    ? "from-teal-200/50 to-lime-200/50 border-2 border-teal-300/50"
                    : "from-teal-100/50 to-lime-100/50 border border-teal-200/50"
                } hover:from-teal-100/70 hover:to-lime-100/70`
          }`}
        onClick={onClick}
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`p-2 rounded-lg ${
              isDarkMode
                ? active
                  ? "bg-gradient-to-br from-teal-700 to-lime-800 text-white"
                  : "bg-gradient-to-br from-teal-800 to-lime-700"
                : active
                ? "bg-gradient-to-br from-teal-500 to-lime-600 text-white"
                : "bg-gradient-to-br from-teal-300 to-lime-400"
            }`}
          >
            <Icon className="text-xl" />
          </div>
          <h3
            className={`font-semibold text-lg ${
              isDarkMode
                ? active
                  ? "text-teal-300"
                  : "text-gray-200"
                : active
                ? "text-teal-900"
                : "text-gray-800"
            }`}
          >
            {title}
          </h3>
        </div>
        <p
          className={`text-sm leading-relaxed ${
            isDarkMode
              ? active
                ? "text-gray-300"
                : "text-gray-400"
              : active
              ? "text-gray-700"
              : "text-gray-600"
          }`}
        >
          {description}
        </p>
        {active && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleStartLevel}
              className={`px-6 py-2.5 max-w-[200px] cursor-pointer w-full text-white rounded-xl font-medium shadow-lg transition-all duration-300 text-center ${
                isDarkMode
                  ? "bg-gradient-to-r from-teal-700 to-lime-700 hover:from-teal-600 hover:to-lime-600"
                  : "bg-gradient-to-r from-teal-500 to-lime-500 hover:from-teal-400 hover:to-lime-400"
              }`}
            >
              Start Level
            </button>
          </div>
        )}
      </div>

      <CustomDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onSelectPart={handleSelectPart}
        isDarkMode={isDarkMode}
      />
    </>
  );
};

const levelsData = [
  {
    title: "Simple Quiz",
    description:
      "Test your basic knowledge of contract management with a quick and engaging quiz.",
    Icon: FaFileAlt,
    link: "/Level-One-Design",
  },
  {
    title: "Document Automation Basics",
    description:
      "Learn the essentials of automating employment agreements with placeholders and conditional logic.",
    Icon: GrDocumentConfig,
    link: "/Level-Two",
    isLevel2: true,
  },
  {
    title: "Advanced Document Automation",
    description:
      "Dive deeper into automating complex documents with advanced techniques and logic.",
    Icon: GiLevelThreeAdvanced,
    link: "/Level-Three-Quiz",
  },
  {
    title: "CLM Workflows",
    description:
      "Explore contract lifecycle management by designing and optimizing real-world workflows.",
    Icon: LuBrain,
    link: "/Level-Four-Quiz",
  },
];

const showNavBar = true;

const HomePage = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const levels = useMemo(() => levelsData, []);

  // Clear sessionStorage when the HomePage mounts
  useEffect(() => {
    sessionStorage.clear();
    console.log("sessionStorage cleared on HomePage mount");
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleLevelClick = (index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <div
      className={`min-h-screen px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-blue-900/50 to-slate-800"
          : "bg-gradient-to-br from-yellow-100 via-blue-100 to-lime-100"
      }`}
    >
      {showNavBar && <Header isDarkMode={isDarkMode} />}
      <div className="max-w-7xl mx-auto py-36 relative">
        {/* Dark/Light Mode Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className={`absolute -top-5 -right-20 p-2 rounded-full shadow-md transition-all duration-300 ${
            isDarkMode
              ? "bg-gray-800 text-yellow-300 hover:bg-gray-700"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          {isDarkMode ? (
            <BsSunFill className="text-xl" />
          ) : (
            <BsMoonStarsFill className="text-xl" />
          )}
        </button>

        <div
          className={`p-8 rounded-3xl shadow-xl ${
            isDarkMode ? "bg-gray-800 bg-opacity-90" : "bg-white bg-opacity-90"
          } backdrop-blur-sm`}
        >
          <div className="max-w-3xl mx-auto mb-8 text-center">
            <h1
              className={`text-3xl font-bold mb-2 ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Welcome to CLM Training
            </h1>
            <p
              className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Select a learning path to begin your contract management journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {levels.map((level, index) => (
              <LevelCard
                key={index}
                {...level}
                active={index === activeIndex}
                onClick={() => handleLevelClick(index)}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;