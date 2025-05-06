import { FaPenToSquare } from "react-icons/fa6";
import { TbSettingsMinus, TbSettingsPlus } from "react-icons/tb";
import { ImLoop2 } from "react-icons/im";
import { useState, useContext, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useHighlightedText } from "../context/HighlightedTextContext";
import { useQuestionType } from "../context/QuestionTypeContext";
import EmploymentAgreement from "../utils/EmploymentAgreement";
import { determineQuestionType } from "../utils/questionTypeUtils";
import { ThemeContext } from "../context/ThemeContext";
import AIAnalysisPanel from "../components/AIAnalysisPanel";
import { useLocation } from "react-router";
import { CrispChat } from "../bot/knowledge";
import { useScore } from "../context/ScoreContext";

const icons = [
  { icon: <FaPenToSquare />, label: "Edit PlaceHolder" },
  { icon: <TbSettingsMinus />, label: "Small Condition" },
  { icon: <TbSettingsPlus />, label: "Big Condition" },
  { icon: <ImLoop2 />, label: "Loop" },
];

const LevelTwoPart_Two = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const location = useLocation();
  const [tooltip, setTooltip] = useState<string | null>(null);
  const { highlightedTexts, addHighlightedText } = useHighlightedText();
  const { selectedTypes } = useQuestionType();
  const documentRef = useRef<HTMLDivElement>(null);

  // Scoring system
  const { setLevelTwoScore } = useScore();
  const [score, setScore] = useState<number>(0); // Explicitly define type as number
  const [scoreChange, setScoreChange] = useState<number | null>(null);
  const [foundPlaceholders, setFoundPlaceholders] = useState<string[]>([]);
  const [foundSmallConditions, setFoundSmallConditions] = useState<string[]>([]);
  const [foundBigConditions, setFoundBigConditions] = useState<string[]>([]);

  useEffect(() => {
    setLevelTwoScore(score);
  }, [score, setLevelTwoScore]);

  useEffect(() => {
    console.log("LevelTwoPart_Two - Rendering at:", location.pathname);
    sessionStorage.removeItem("level");
    sessionStorage.setItem("level", location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem("selectedQuestionTypes_2");
      sessionStorage.removeItem("typeChangedStates_2");
      sessionStorage.removeItem("questionOrder_2");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const getDocumentText = () => {
    return documentRef.current?.textContent || "";
  };

  const handleIconClick = (label: string) => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    let textWithoutBrackets = selectedText;
    let hasValidBrackets = false;

    if (selectedText.startsWith("[") && selectedText.endsWith("]")) {
      textWithoutBrackets = selectedText.slice(1, -1);
      hasValidBrackets = true;
    } else if (selectedText.startsWith("{") && selectedText.endsWith("}")) {
      textWithoutBrackets = selectedText.slice(1, -1);
      hasValidBrackets = true;
    } else if (selectedText.startsWith("(") && selectedText.endsWith(")")) {
      textWithoutBrackets = selectedText.slice(1, -1);
      hasValidBrackets = true;
    }

    if (!hasValidBrackets) {
      console.log("Selected text does not have valid brackets:", selectedText);
      return;
    }

    // Scoring validation
    const isCorrectButton =
      (label === "Edit PlaceHolder" && hasValidBrackets) ||
      (label === "Small Condition" && hasValidBrackets) ||
      (label === "Big Condition" && hasValidBrackets);

    // Handle scoring
    if (isCorrectButton) {
      if (label === "Edit PlaceHolder" && !foundPlaceholders.includes(textWithoutBrackets)) {
        setScore((prevScore) => prevScore + 3);
        setScoreChange(3);
        setTimeout(() => setScoreChange(null), 2000);
        setFoundPlaceholders((prev) => [...prev, textWithoutBrackets]);
      } else if (label === "Small Condition" && !foundSmallConditions.includes(textWithoutBrackets)) {
        setScore((prevScore) => prevScore + 3);
        setScoreChange(3);
        setTimeout(() => setScoreChange(null), 2000);
        setFoundSmallConditions((prev) => [...prev, textWithoutBrackets]);
      } else if (label === "Big Condition" && !foundBigConditions.includes(textWithoutBrackets)) {
        setScore((prevScore) => prevScore + 3); // Removed extra '='
        setScoreChange(3);
        setTimeout(() => setScoreChange(null), 2000);
        setFoundBigConditions((prev) => [...prev, textWithoutBrackets]);
      }
    } else {
      // Wrong button clicked - deduct 2 points
      const newScore = Math.max(0, score - 2);
      setScore(newScore);
      if (score > 0) {
        setScoreChange(-2);
        setTimeout(() => setScoreChange(null), 2000);
      }
      return;
    }

    if (label === "Edit PlaceHolder") {
      if (!(selectedText.startsWith("[") && selectedText.endsWith("]"))) {
        console.log("Invalid Edit Placeholder selection:", selectedText);
        return;
      }
      if (highlightedTexts.includes(textWithoutBrackets)) {
        console.log("Placeholder already highlighted:", textWithoutBrackets);
        alert("This placeholder has already been added!");
        return;
      }
      console.log("Selected Edit Placeholder:", textWithoutBrackets);
      addHighlightedText(textWithoutBrackets);
      const span = document.createElement("span");
      span.style.backgroundColor = isDarkMode ? "rgba(255, 245, 157, 0.5)" : "rgba(255, 245, 157, 0.7)";
      span.textContent = selectedText;
      range.deleteContents();
      range.insertNode(span);
    } else if (label === "Small Condition") {
      if (!(selectedText.startsWith("{") && selectedText.endsWith("}")) || 
          selectedText.length < 35 || 
          selectedText.length > 450) return;
      if (!highlightedTexts.includes(textWithoutBrackets) 
        && !(highlightedTexts.includes("The Employee shall not receive additional payment for overtime worked") && textWithoutBrackets === "The Employee is entitled to overtime pay for authorized overtime work")
        && !(highlightedTexts.includes("The Employee is entitled to overtime pay for authorized overtime work") && textWithoutBrackets === "The Employee shall not receive additional payment for overtime worked")
      ) {
        addHighlightedText(textWithoutBrackets);
      }
      const span = document.createElement("span");
      span.style.backgroundColor = isDarkMode ? "rgba(129, 236, 236, 0.5)" : "rgba(129, 236, 236, 0.7)";
      span.textContent = selectedText;
      range.deleteContents();
      range.insertNode(span);
    } else if (label === "Big Condition") {
      if (!(selectedText.startsWith("(") && selectedText.endsWith(")"))) return;
      console.log("Selected Big Condition:", selectedText);

      let clauseContent = textWithoutBrackets;
      const headingsToStrip = ["PROBATIONARY PERIOD", "PENSION"];
      for (const heading of headingsToStrip) {
        if (textWithoutBrackets.startsWith(heading)) {
          clauseContent = textWithoutBrackets.slice(heading.length).trim();
          console.log(`Stripped heading '${heading}', clauseContent:`, clauseContent);
          break;
        }
      }

      addHighlightedText(clauseContent);

      const fragment = document.createDocumentFragment();
      const contents = range.cloneContents();

      const applyHighlight = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const span = document.createElement("span");
          span.style.backgroundColor = isDarkMode ? "rgba(186, 220, 88, 0.5)" : "rgba(186, 220, 88, 0.7)";
          span.textContent = node.textContent || "";
          return span;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLElement;
          const newElement = document.createElement(element.tagName);
          for (const attr of element.attributes) {
            newElement.setAttribute(attr.name, attr.value);
          }
          element.childNodes.forEach((child) => {
            const newChild = applyHighlight(child);
            if (newChild) newElement.appendChild(newChild);
          });
          return newElement;
        }
        return null;
      };

      contents.childNodes.forEach((node) => {
        const newNode = applyHighlight(node);
        if (newNode) fragment.appendChild(newNode);
      });

      range.deleteContents();
      range.insertNode(fragment);

      const probationClauseContent = "The first [Probation Period Length] of employment will be a probationary period. The Company shall assess the Employee’s performance and suitability during this time. Upon successful completion, the Employee will be confirmed in their role.";
      const pensionClauseContent = "The Employee will be enrolled in the Company’s pension scheme in accordance with auto-enrolment legislation.";

      const normalizeText = (text: string) => text.replace(/\s+/g, "");
      const normalizedSelectedText = normalizeText(textWithoutBrackets);
      const normalizedProbationClause = normalizeText(probationClauseContent);
      const normalizedPensionClause = normalizeText(pensionClauseContent);

      if (normalizedSelectedText === normalizedProbationClause) {
        console.log("Probation Clause matched, adding question instead of placeholder");
        addHighlightedText("Is the clause of probationary period applicable?");
      } else if (normalizedSelectedText === normalizedPensionClause) {
        console.log("Pension Clause matched, adding Pension question");
        addHighlightedText("Is the Pension clause applicable?");
      } else {
        console.log("No clause matched.");
      }
    } else if (label === "Loop") {
      addHighlightedText(textWithoutBrackets);
      const span = document.createElement("span");
      span.style.backgroundColor = isDarkMode ? "rgba(255, 245, 157, 0.5)" : "rgba(255, 245, 157, 0.7)";
      span.textContent = selectedText;
      range.deleteContents();
      range.insertNode(span);
    }
  };

  return (
    <div
      className={`w-full min-h-screen font-sans transition-all duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-800 via-gray-900 to-black"
          : "bg-gradient-to-br from-indigo-50 via-teal-50 to-pink-50"
      }`}
    >
      <Navbar
        level={"/Level-Two-Part-Two"}
        questionnaire={"/Questionnaire"}
        live_generation={"/Live_Generation"}
      />
      {/* Score display */}
      <div className="fixed top-16 left-6 z-50 px-6 py-3">
        <div
          className={`p-3 rounded-full shadow-lg flex items-center ${
            isDarkMode ? "bg-gray-700 text-white" : "bg-teal-500 text-white"
          }`}
        >
          <span className="font-bold mr-2">Score:</span> {score}
          {scoreChange !== null && (
            <span
              className={`ml-2 text-sm font-bold ${
                scoreChange > 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {scoreChange > 0 ? `+${scoreChange}` : scoreChange}
            </span>
          )}
        </div>
      </div>
      <div className="fixed flex top-16 right-0 z-50 px-6 py-3 space-x-6">
        {icons.map(({ icon, label }, index) => (
          <div key={index} className="relative flex items-center">
            <button
              id={label === "Edit PlaceHolder" ? "edit-placeholder" : `icon-${label.toLowerCase().replace(" ", "-")}`}
              className={`p-3 rounded-full shadow-lg transform hover:scale-110 transition-all duration-300 ease-in-out flex items-center justify-center text-2xl ${
                isDarkMode
                  ? "bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800"
                  : "bg-gradient-to-r from-teal-400 to-cyan-400 text-white hover:from-teal-500 hover:to-cyan-500"
              }`}
              onMouseEnter={() => setTooltip(label)}
              onMouseLeave={() => setTooltip(null)}
              onClick={() => handleIconClick(label)}
            >
              {icon}
            </button>
            {tooltip === label && (
              <div
                className={`absolute -left-10 top-full mt-2 px-3 py-1 text-sm text-white rounded-lg shadow-lg whitespace-nowrap animate-fadeIn ${
                  isDarkMode
                    ? "bg-gradient-to-r from-gray-700 to-gray-800"
                    : "bg-gradient-to-r from-gray-800 to-gray-900"
                }`}
              >
                {label}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Modified Layout: Flex container for sidebar and main content */}
      <div className="flex max-w-7xl mx-auto mt-24 px-8 pb-20">
        {/* Left Sidebar: AI Analysis Panel */}
        <div className="w-1/3 pr-6">
          <div
            className={`sticky top-24 p-6 rounded-3xl shadow-xl border ${
              isDarkMode
                ? "bg-gray-800/80 backdrop-blur-md border-gray-700/20 bg-gradient-to-br from-gray-700/70 via-gray-800/70 to-gray-900/70"
                : "bg-white/80 backdrop-blur-md border-teal-100/20 bg-gradient-to-br from-teal-50/70 via-cyan-50/70 to-indigo-50/70"
            }`}
          >
            <h2
              className={`text-xl font-semibold mb-4 tracking-wide ${
                isDarkMode ? "text-teal-300" : "text-teal-700"
              }`}
            >
              AI Analysis
            </h2>
            <AIAnalysisPanel
              documentText={getDocumentText()}
              highlightedTexts={highlightedTexts}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
        {/* Main Content: Placeholders and Document */}
        <div className="w-2/3">
          <div
            className={`rounded-3xl shadow-2xl border p-8 transform transition-all duration-500 hover:shadow-3xl ${
              isDarkMode
                ? "bg-gray-800/90 backdrop-blur-lg border-gray-700/50"
                : "bg-white/90 backdrop-blur-lg border-teal-100/30"
            }`}
          >
            <h2
              className={`text-2xl font-semibold mb-6 tracking-wide ${
                isDarkMode ? "text-teal-300" : "text-teal-700"
              }`}
            >
              ☑️ Selected Placeholders
            </h2>
            {highlightedTexts.length > 0 ? (
              <ul
                className={`space-y-3 p-5 rounded-xl shadow-inner ${
                  isDarkMode
                    ? "bg-gradient-to-r from-gray-700/70 via-gray-800/70 to-gray-900/70"
                    : "bg-gradient-to-r from-teal-50/70 via-cyan-50/70 to-indigo-50/70"
                }`}
              >
                {[...new Set(highlightedTexts)].map((text, index) => {
                  const { primaryValue } = determineQuestionType(text);
                  const questionType = selectedTypes[index] || "Text";
                  return (
                    <li key={index} className="flex items-center justify-between">
                      <div>
                        <span
                          className={`text-sm font-medium truncate max-w-xs ${
                            isDarkMode ? "text-teal-200" : "text-teal-900"
                          }`}
                        >
                          {primaryValue || text}
                        </span>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          isDarkMode
                            ? "text-gray-300 bg-gray-500/50"
                            : "text-gray-600 bg-teal-100/50"
                        }`}
                      >
                        Type: {questionType}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div
                className={`text-center py-8 rounded-xl shadow-inner ${
                  isDarkMode
                    ? "bg-gradient-to-r from-gray-700/70 via-gray-800/70 to-gray-900/70"
                    : "bg-gradient-to-r from-teal-50/70 via-cyan-50/70 to-indigo-50/70"
                }`}
              >
                <p
                className={`italic text-lg ${
                  isDarkMode ? "text-teal-400" : "text-teal-600"
                }`}
              >
                No placeholders selected yet
              </p>
            </div>
          )}
          {highlightedTexts.length > 0 && (
            <div className="mt-5 text-right">
              <span
                className={`text-sm px-3 py-1 rounded-full ${
                  isDarkMode
                    ? "text-teal-300 bg-gray-600/50"
                    : "text-teal-600 bg-teal-100/50"
                }`}
              >
                Total Placeholders: {[...new Set(highlightedTexts)].length}
              </span>
            </div>
          )}
        </div>
        <div className="mt-10" ref={documentRef}>
          <div
            className={`p-6 rounded-3xl shadow-xl border ${
              isDarkMode
                ? "bg-gray-800/80 backdrop-blur-md border-gray-700/20 bg-gradient-to-br from-gray-700/70 via-gray-800/70 to-gray-900/70"
                : "bg-white/80 backdrop-blur-md border-teal-100/20 bg-gradient-to-br from-teal-50/70 via-cyan-50/70 to-indigo-50/70"
            }`}
          >
            <EmploymentAgreement />
          </div>
        </div>
      </div>
    </div>
    <CrispChat websiteId="cf9c462c-73de-461e-badf-ab3a1133bdde" />
  </div>
);
};

export default LevelTwoPart_Two;
