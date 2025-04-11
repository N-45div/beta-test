import Navbar from "../components/Navbar";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState, useEffect, useContext } from "react";
import { useQuestionType } from "../context/QuestionTypeContext";
import { useHighlightedText } from "../context/HighlightedTextContext";
import { determineQuestionType } from "../utils/questionTypeUtils";
import { ThemeContext } from "../context/ThemeContext";
import DivWithDropdown from "../components/DivWithDropdown";

const Questionnaire_Level3 = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [leftActive, setLeftActive] = useState(true);
  const [rightActive, setRightActive] = useState(false);
  const { highlightedTexts } = useHighlightedText();
  const { selectedTypes, setSelectedTypes, editedQuestions, setEditedQuestions } = useQuestionType();
  const [uniqueQuestions, setUniqueQuestions] = useState<string[]>([]);
  const [duplicateDetected, setDuplicateDetected] = useState<boolean>(false);
  const [questionTexts, setQuestionTexts] = useState<string[]>([]);

  useEffect(() => {
    const processedTexts: string[] = [];
    const questionMap = new Map();
    console.log("highlight text: ", highlightedTexts);
    for (const text of highlightedTexts) {
      const { primaryValue } = determineQuestionType(text);
      console.log("primary value: ", primaryValue);
      if (primaryValue && !questionMap.has(primaryValue)) {
        questionMap.set(primaryValue, text);
        processedTexts.push(text);
      } else if (primaryValue && questionMap.get(primaryValue) === text) {
        console.log("duplicate");
        setDuplicateDetected(true);
        setTimeout(() => setDuplicateDetected(false), 3000);
      }
    }

    setUniqueQuestions(processedTexts);
    console.log(processedTexts);

    if (
      selectedTypes.length !== processedTexts.length ||
      editedQuestions.length !== processedTexts.length
    ) {
      const initialTexts = processedTexts.map(
        (text) => determineQuestionType(text).primaryValue || "No text selected"
      );
      const initialTypes = processedTexts.map((text) => {
        const { primaryType } = determineQuestionType(text);
        return primaryType !== "Unknown" ? primaryType : "Text";
      });

      setQuestionTexts(initialTexts);
      setSelectedTypes(initialTypes);
      setEditedQuestions(initialTexts);
    } else {
      setQuestionTexts([...editedQuestions]);
    }
  }, [highlightedTexts, selectedTypes.length, editedQuestions.length, setSelectedTypes, setEditedQuestions]);

  const handleTypeChange = (index: number, type: string) => {
    const newTypes = [...selectedTypes];
    newTypes[index] = type;
    setSelectedTypes(newTypes);

    const textValue = uniqueQuestions[index];
    const { primaryValue } = determineQuestionType(textValue);
    const newTexts = [...questionTexts];
    if (
      newTexts[index] === primaryValue ||
      newTexts[index] === "No text selected"
    ) {
      if (type.toLowerCase() === "radio" && primaryValue) {
        newTexts[index] = primaryValue;
      } else if (type.toLowerCase() === "text" && primaryValue) {
        newTexts[index] = primaryValue;
      } else if (type.toLowerCase() === "number" && primaryValue) {
        newTexts[index] = primaryValue;
      } else if (type.toLowerCase() === "date" && primaryValue) {
        newTexts[index] = primaryValue;
      }
      setQuestionTexts(newTexts);
      setEditedQuestions(newTexts);
    }
  };

  const handleQuestionTextChange = (index: number, newText: string) => {
    const newTexts = [...questionTexts];
    newTexts[index] = newText;
    setQuestionTexts(newTexts);
    setEditedQuestions(newTexts);
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans relative transition-all duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-800 via-gray-900 to-black"
          : "bg-gradient-to-br from-indigo-50 via-teal-50 to-pink-50"
      }`}
    >
      <Navbar level={"/Level-Three-Quiz"} questionnaire={"/Questionnaire_Level3"} live_generation={"/Live_Generation"} calculations={"/Calculations"}/>
      <div
        className={`absolute top-16 right-6 w-80 h-12 rounded-xl shadow-lg flex items-center justify-center text-sm font-semibold z-20 ${
          isDarkMode
            ? "bg-gradient-to-r from-gray-700 to-gray-800 text-teal-200"
            : "bg-gradient-to-r from-teal-200 to-cyan-200 text-teal-900"
        }`}
      >
        <div className="flex items-center space-x-6">
          <div
            className={`flex items-center space-x-2 ${
              leftActive ? (isDarkMode ? "text-teal-400" : "text-teal-600") : (isDarkMode ? "text-cyan-400" : "text-cyan-500")
            } transition-all duration-300`}
          >
            <span>Employer</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setLeftActive(true);
                setRightActive(false);
              }}
              className={`${isDarkMode ? "text-teal-400 hover:text-cyan-400" : "text-teal-600 hover:text-cyan-500"} transform hover:scale-110 transition-all duration-300`}
            >
              <FaChevronLeft className="text-xl" />
            </button>
            <button
              onClick={() => {
                setRightActive(true);
                setLeftActive(false);
              }}
              className={`${isDarkMode ? "text-teal-400 hover:text-cyan-400" : "text-teal-600 hover:text-cyan-500"} transform hover:scale-110 transition-all duration-300`}
            >
              <FaChevronRight className="text-xl" />
            </button>
          </div>
          <div
            className={`flex items-center space-x-2 ${
              rightActive ? (isDarkMode ? "text-teal-400" : "text-teal-600") : (isDarkMode ? "text-cyan-400" : "text-cyan-500")
            } transition-all duration-300`}
          >
            <span>Employee</span>
          </div>
        </div>
      </div>

      {duplicateDetected && (
        <div
          className={`absolute top-28 right-6 p-4 rounded-xl shadow-md transition-opacity duration-400 z-10 animate-fadeIn ${
            isDarkMode
              ? "bg-gradient-to-r from-yellow-800 to-yellow-900 border-l-4 border-yellow-500 text-yellow-200"
              : "bg-gradient-to-r from-yellow-100 to-yellow-200 border-l-4 border-yellow-400 text-yellow-800"
          }`}
        >
          <p className="font-bold">Duplicate Question</p>
          <p className="text-sm">This question already exists in the questionnaire.</p>
        </div>
      )}

      <div className="flex-grow flex flex-col items-center justify-center pt-24 pb-12 px-6 overflow-y-auto">
        <div className="space-y-12 w-full max-w-4xl">
          {uniqueQuestions.length > 0 ? (
            uniqueQuestions.map((text, index) => (
              <DivWithDropdown
                key={index}
                textValue={text}
                index={index}
                onTypeChange={handleTypeChange}
                onQuestionTextChange={handleQuestionTextChange}
                initialQuestionText={questionTexts[index] || editedQuestions[index] || "No text selected"}
                initialType={selectedTypes[index] || "Text"}
              />
            ))
          ) : (
            <div
              className={`text-center py-12 rounded-xl shadow-lg border ${
                isDarkMode
                  ? "bg-gray-800/80 backdrop-blur-sm border-gray-700/20"
                  : "bg-white/80 backdrop-blur-sm border-teal-100/20"
              }`}
            >
              <p
                className={`text-lg font-medium ${
                  isDarkMode ? "text-teal-300" : "text-teal-700"
                }`}
              >
                No text has been selected yet.
              </p>
              <p
                className={`text-sm mt-2 ${
                  isDarkMode ? "text-teal-400" : "text-teal-500"
                }`}
              >
                Go to the Document tab and select text in square brackets to generate questions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Questionnaire_Level3;
