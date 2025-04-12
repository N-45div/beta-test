import Navbar from "../components/Navbar";
import { FaChevronLeft, FaChevronRight, FaChevronDown } from "react-icons/fa";
import { useState, useEffect, useContext, useCallback, useRef } from "react";
import { useQuestionType } from "../context/QuestionTypeContext";
import { useHighlightedText } from "../context/HighlightedTextContext";
import { determineQuestionType } from "../utils/questionTypeUtils";
import { ThemeContext } from "../context/ThemeContext";
import { useScore } from "../context/ScoreContext";

interface DivWithDropdownProps {
  textValue: string;
  index: number;
  onTypeChange: (index: number, type: string) => void;
  onQuestionTextChange: (index: number, newText: string) => void;
  onRequiredChange: (index: number, required: boolean) => void;
  initialQuestionText: string;
  initialType: string;
  initialRequired: boolean;
  isFollowUp?: boolean;
}

const DivWithDropdown: React.FC<DivWithDropdownProps> = ({
  textValue,
  index,
  onTypeChange,
  onQuestionTextChange,
  onRequiredChange,
  initialQuestionText,
  initialType,
  initialRequired = false,
  isFollowUp = false,
}) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [questionText, setQuestionText] = useState(initialQuestionText || "No text selected");
  const [selectedType, setSelectedType] = useState<string>(initialType || "Text");
  const [isOpen, setIsOpen] = useState(false);
  const [isRequired, setIsRequired] = useState(initialRequired);
  const [typeChanged, setTypeChanged] = useState(false);
  const { primaryValue } = determineQuestionType(textValue);

  const handleTypeSelect = (type: string) => {
    if (typeChanged) return;
    
    setSelectedType(type);
    onTypeChange(index, type);
    setTypeChanged(true);

    let newQuestionText = questionText;
    if (questionText === primaryValue || questionText === "No text selected") {
      if (type.toLowerCase() === "radio" && primaryValue) {
        newQuestionText = primaryValue;
      } else if (type.toLowerCase() === "text" && primaryValue) {
        newQuestionText = primaryValue;
      } else if (type.toLowerCase() === "number" && primaryValue) {
        newQuestionText = primaryValue;
      } else if (type.toLowerCase() === "date" && primaryValue) {
        newQuestionText = primaryValue;
      }
      setQuestionText(newQuestionText);
      onQuestionTextChange(index, newQuestionText);
    }
    setIsOpen(false);
  };

  const handleQuestionTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setQuestionText(newText);
    onQuestionTextChange(index, newText);
  };

  const handleRequiredToggle = () => {
    const newRequired = !isRequired;
    setIsRequired(newRequired);
    onRequiredChange(index, newRequired);
  };

  const dropdownOptions = ["Text", "Paragraph", "Email", "Radio", "Number", "Date"];

  return (
    <div className={`flex items-center space-x-8 w-full relative ${isFollowUp ? "ml-0" : ""}`}>
      <button className="flex flex-col justify-between h-10 w-12 p-1 transform hover:scale-105 transition-all duration-300">
        <span className={`block h-1 w-full rounded-full ${isDarkMode ? "bg-teal-400" : "bg-teal-600"}`}></span>
        <span className={`block h-1 w-full rounded-full ${isDarkMode ? "bg-teal-400" : "bg-teal-600"}`}></span>
        <span className={`block h-1 w-full rounded-full ${isDarkMode ? "bg-teal-400" : "bg-teal-600"}`}></span>
      </button>
      <div
        className={`relative w-full max-w-lg h-36 rounded-xl shadow-lg flex flex-col items-center justify-center text-lg font-semibold p-6 z-10 transform transition-all duration-300 hover:shadow-xl ${
          isDarkMode
            ? "bg-gradient-to-br from-gray-700 to-gray-800 text-teal-200"
            : "bg-gradient-to-br from-teal-100 to-cyan-100 text-teal-900"
        }`}
      >
        <div className="relative w-full flex items-center">
          <div className={`h-0.5 w-1/2 absolute left-0 opacity-50 ${isDarkMode ? "bg-teal-400" : "bg-teal-500"}`}></div>
          <input
            type="text"
            value={questionText}
            onChange={handleQuestionTextChange}
            className={`px-3 py-2 text-sm bg-transparent w-1/2 relative z-10 top-[-10px] max-w-full focus:outline-none transition-all duration-300 ${
              isDarkMode
                ? "border-b border-teal-400 text-teal-200 placeholder-teal-300/70 focus:border-cyan-400"
                : "border-b border-teal-400 text-teal-800 placeholder-teal-400/70 focus:border-cyan-500"
            }`}
            placeholder="Edit question text"
          />
          {isRequired && <span className="text-red-500 ml-2">*</span>}
        </div>

        <div className="absolute top-1/2 right-6 transform -translate-y-1/2 flex items-center space-x-2">
          <div className="relative">
            <button
              className={`flex items-center space-x-2 text-sm px-3 py-1 rounded-lg shadow-md transition-all duration-300 ${
                isDarkMode
                  ? "bg-gray-600/80 text-teal-200 hover:bg-gray-500"
                  : "bg-white/80 text-teal-900 hover:bg-white"
              } ${typeChanged ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => !typeChanged && setIsOpen(!isOpen)}
              disabled={typeChanged}
            >
              <span>{selectedType}</span>
              {!typeChanged && <FaChevronDown className={isDarkMode ? "text-teal-400" : "text-teal-600"} />}
            </button>
            {isOpen && !typeChanged && (
              <div
                className={`absolute right-0 mt-1 w-40 h-[12vh] rounded-lg shadow-lg z-50 ${
                  isDarkMode
                    ? "bg-gray-700/90 backdrop-blur-sm border-gray-600"
                    : "bg-white/90 backdrop-blur-sm border-teal-100"
                }`}
                style={{
                  maxHeight: "150px",
                  overflowY: "auto",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                <div className="hide-scrollbar">
                  {dropdownOptions.map((type) => (
                    <div
                      key={type}
                      className={`px-4 py-2 cursor-pointer transition-all duration-200 ${
                        isDarkMode
                          ? "text-teal-200 hover:bg-gray-600"
                          : "text-teal-800 hover:bg-teal-50"
                      }`}
                      onClick={() => handleTypeSelect(type)}
                    >
                      {type}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <span className={`text-sm ${isDarkMode ? "text-teal-300" : "text-teal-700"}`}>Required</span>
            <div
              className={`relative w-12 h-6 rounded-full p-1 transition-colors duration-300 ${
                isRequired
                  ? "bg-green-500"
                  : isDarkMode
                  ? "bg-gray-600"
                  : "bg-gray-300"
              }`}
              onClick={handleRequiredToggle}
            >
              <span
                className={`absolute w-4 h-4 bg-white rounded-full transform transition-transform duration-300 ${
                  isRequired ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

const Questionnaire_Level3 = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { totalScore, updateScore } = useScore();
  const [leftActive, setLeftActive] = useState(true);
  const [rightActive, setRightActive] = useState(false);
  const { highlightedTexts } = useHighlightedText();
  const { selectedTypes, setSelectedTypes, setEditedQuestions, requiredQuestions, setRequiredQuestions } = useQuestionType();
  const [uniqueQuestions, setUniqueQuestions] = useState<string[]>([]);
  const [duplicateDetected] = useState<boolean>(false);
  const [questionTexts, setQuestionTexts] = useState<string[]>([]);
  const [scoredQuestions, setScoredQuestions] = useState<Record<number, { typeScored: boolean, requiredScored: boolean }>>({});
  const [bonusAwarded, setBonusAwarded] = useState(false);
  const [scoreFeedback, setScoreFeedback] = useState<{points: number, id: number} | null>(null);
  const feedbackId = useRef(0);

  const followUpQuestions = [
    "What's the probation period length?",
    "What's the probation extension length?",
    "How many weeks?",
    "Who is the HR/Relevant Contact?",
  ];

  const showFeedback = (points: number) => {
    feedbackId.current += 1;
    setScoreFeedback({points, id: feedbackId.current});
    setTimeout(() => setScoreFeedback(null), 1500);
  };

  const initializeRequiredStatus = (texts: string[]) => {
    return texts.map(() => false);
  };

  const enhancedDetermineQuestionType = useCallback((text: string) => {
    const result = determineQuestionType(text);
    return {
      ...result,
      correctType: result.primaryType
    };
  }, []);

  const scoreTypeSelection = useCallback((index: number, selectedType: string) => {
    if (scoredQuestions[index]?.typeScored) return;
    
    const textValue = uniqueQuestions[index];
    const { correctType } = enhancedDetermineQuestionType(textValue);
    
    const isEquivalent = (selectedType === "Text" && correctType === "Paragraph") || 
                         (selectedType === "Paragraph" && correctType === "Text");
    
    const isCorrect = selectedType === correctType || isEquivalent;
    const points = isCorrect ? 2 : -2;
    
    updateScore(points);
    showFeedback(points);
    
    setScoredQuestions(prev => ({
      ...prev,
      [index]: { 
        ...prev[index], 
        typeScored: true,
        typeCorrect: isCorrect
      }
    }));
  }, [uniqueQuestions, enhancedDetermineQuestionType, scoredQuestions, updateScore]);

  const scoreRequiredStatus = useCallback((index: number, isRequired: boolean) => {
    if (isRequired) {
      if (!scoredQuestions[index]?.requiredScored) {
        updateScore(2);
        showFeedback(2);
        setScoredQuestions(prev => ({
          ...prev,
          [index]: { 
            ...prev[index], 
            requiredScored: true,
            requiredCorrect: true
          }
        }));
      }
    } else {
      if (scoredQuestions[index]?.requiredScored) {
        updateScore(-2);
        showFeedback(-2);
        setScoredQuestions(prev => ({
          ...prev,
          [index]: { 
            ...prev[index], 
            requiredScored: false,
            requiredCorrect: false
          }
        }));
      }
    }
  }, [updateScore, scoredQuestions]);

  const checkForBonus = useCallback(() => {
    if (uniqueQuestions.length === 0 || bonusAwarded) return;

    const allCorrect = uniqueQuestions.every((text, index) => {
      const { correctType } = enhancedDetermineQuestionType(text);
      const selectedType = selectedTypes[index];
      
      const typeCorrect = selectedType === correctType || 
                         (selectedType === "Text" && correctType === "Paragraph") || 
                         (selectedType === "Paragraph" && correctType === "Text");
      
      const requiredCorrect = requiredQuestions[index];
      return typeCorrect && requiredCorrect;
    });

    if (allCorrect) {
      updateScore(10);
      showFeedback(10);
      setBonusAwarded(true);
    }
  }, [uniqueQuestions, selectedTypes, requiredQuestions, enhancedDetermineQuestionType, bonusAwarded, updateScore]);

  useEffect(() => {
    const processedTexts: string[] = [];
    const questionMap = new Map();

    const isProbationaryClauseSelected = highlightedTexts.some((text) =>
      text.toLowerCase().includes("probationary period") && 
      text.includes("[Probation Period Length]") && 
      text.length > "[Probation Period Length]".length
    );

    const filteredQuestions = highlightedTexts.filter((text) => {
      const { primaryValue } = enhancedDetermineQuestionType(text);
      const isFollowUp = followUpQuestions.includes(primaryValue || "");

      if (isProbationaryClauseSelected && text === "Probation Period Length") {
        return false;
      }

      const shouldInclude = !isFollowUp || 
                         (primaryValue === "What's the probation period length?" && text === "Probation Period Length" && !isProbationaryClauseSelected);
      return shouldInclude;
    });

    for (const text of filteredQuestions) {
      const { primaryValue } = enhancedDetermineQuestionType(text);
      if (primaryValue && !questionMap.has(primaryValue)) {
        questionMap.set(primaryValue, text);
        processedTexts.push(text);
      }
    }

    setUniqueQuestions(processedTexts);
    const initialRequired = initializeRequiredStatus(processedTexts);
    setRequiredQuestions(initialRequired);

    const initialTexts = processedTexts.map(
      (text) => enhancedDetermineQuestionType(text).primaryValue || "No text selected"
    );
    const initialTypes = processedTexts.map(() => "Text");

    setQuestionTexts(initialTexts);
    setSelectedTypes(initialTypes);
    setEditedQuestions(initialTexts);
    setScoredQuestions({});
    setBonusAwarded(false);
  }, [highlightedTexts, setSelectedTypes, setEditedQuestions, setRequiredQuestions, enhancedDetermineQuestionType]);

  useEffect(() => {
    checkForBonus();
  }, [selectedTypes, requiredQuestions, checkForBonus]);

  const handleTypeChange = (index: number, type: string) => {
    const newTypes = [...selectedTypes];
    newTypes[index] = type;
    setSelectedTypes(newTypes);
    scoreTypeSelection(index, type);

    const textValue = uniqueQuestions[index];
    const { primaryValue } = enhancedDetermineQuestionType(textValue);
    const newTexts = [...questionTexts];
    
    if (newTexts[index] === primaryValue || newTexts[index] === "No text selected") {
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

  const handleRequiredChange = (index: number, required: boolean) => {
    const newRequired = [...requiredQuestions];
    newRequired[index] = required;
    setRequiredQuestions(newRequired);
    scoreRequiredStatus(index, required);
  };

  const storedLevel = sessionStorage.getItem("level") ?? "none";
  
  return (
    <div
      className={`min-h-screen flex flex-col font-sans relative transition-all duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-800 via-gray-900 to-black"
          : "bg-gradient-to-br from-indigo-50 via-teal-50 to-pink-50"
      }`}
    >
      <Navbar 
        level={storedLevel} 
        questionnaire="/Questionnaire_Level3" 
        live_generation="/Live_Generation" 
        {...(storedLevel === "/Level-Three-Quiz" ? { calculations: "/Calculations" } : {})}
      />
      <div
        className={`absolute top-16 left-6 w-40 h-12 rounded-xl shadow-lg flex items-center justify-center text-sm font-semibold z-20 ${
          isDarkMode
            ? "bg-gradient-to-r from-gray-700 to-gray-800 text-teal-200"
            : "bg-gradient-to-r from-teal-200 to-cyan-200 text-teal-900"
        }`}
      >
        <div className="relative">
          Score: {totalScore}
          {scoreFeedback && (
            <div 
              key={scoreFeedback.id}
              className={`absolute -top-6 right-0 font-bold text-lg ${
                scoreFeedback.points > 0 
                  ? "text-emerald-400" 
                  : "text-rose-500"
              } animate-[float-up_1.5s_ease-out_forwards]`}
            >
              {scoreFeedback.points > 0 ? `+${scoreFeedback.points}` : scoreFeedback.points}
            </div>
          )}
        </div>
      </div>
      
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
                onRequiredChange={handleRequiredChange}
                initialQuestionText={questionTexts[index] || "No text selected"}
                initialType={"Text"}
                initialRequired={false}
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
