import { FaPenToSquare } from "react-icons/fa6";
import { TbSettingsMinus, TbSettingsPlus } from "react-icons/tb";
import { ImLoop2 } from "react-icons/im";
import { useState, useContext, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useHighlightedText } from "../context/HighlightedTextContext";
import { useQuestionType } from "../context/QuestionTypeContext";
import EmploymentAgreement from "../utils/EmploymentAgreement";
import { determineQuestionType } from "../utils/questionTypeUtils";
import { ThemeContext } from "../context/ThemeContext";
import { useLocation } from "react-router";

const icons = [
  { icon: <FaPenToSquare />, label: "Edit PlaceHolder" },
  { icon: <TbSettingsMinus />, label: "Small Condition" },
  { icon: <TbSettingsPlus />, label: "Big Condition" },
  { icon: <ImLoop2 />, label: "Loop" },
];

const LevelTwoPart_Two = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const { highlightedTexts, addHighlightedText } = useHighlightedText();
  const { selectedTypes } = useQuestionType();

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

    if (!hasValidBrackets) return;

    if (highlightedTexts.includes(textWithoutBrackets)) {
      alert("This text has already been selected.");
      return;
    }

    if (label === "Edit PlaceHolder") {
      if (!(selectedText.startsWith("[") && selectedText.endsWith("]")) || selectedText.length >= 40) return;
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
      addHighlightedText(textWithoutBrackets);
      const span = document.createElement("span");
      span.style.backgroundColor = isDarkMode ? "rgba(129, 236, 236, 0.5)" : "rgba(129, 236, 236, 0.7)";
      span.textContent = selectedText;
      range.deleteContents();
      range.insertNode(span);
    } else if (label === "Big Condition") {
      if (!(selectedText.startsWith("(") && selectedText.endsWith(")"))) return;
      addHighlightedText(textWithoutBrackets);
      const span = document.createElement("span");
      span.style.backgroundColor = isDarkMode ? "rgba(186, 220, 88, 0.5)" : "rgba(186, 220, 88, 0.7)";
      span.textContent = selectedText;
      range.deleteContents();
      range.insertNode(span);

      const probationClause = "(The first [Probation Period Length] of employment will be a probationary period. The Company shall assess the Employee’s performance and suitability during this time. The Company may extend the probationary period by up to [Probation Extension Length] if further assessment is required. During the probationary period, either party may terminate the employment by providing [one week's] written notice. Upon successful completion, the Employee will be confirmed in their role.)";
      const terminationClause = "(After the probationary period, either party may terminate the employment by providing [Notice Period] written notice. The Company reserves the right to make a payment in lieu of notice. The Company may summarily dismiss the Employee without notice in cases of gross misconduct.)";
      if (selectedText === probationClause) {
        addHighlightedText("Probation Period Length");
      } else if (selectedText === terminationClause) {
        addHighlightedText("Notice Period");
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
  const location = useLocation();

  useEffect(() => {
    sessionStorage.removeItem("level");

    sessionStorage.setItem("level", location.pathname);
  }, [location]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div
      className={`w-full min-h-screen font-sans transition-all duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-800 via-gray-900 to-black"
          : "bg-gradient-to-br from-indigo-50 via-teal-50 to-pink-50"
      }`}
    >
      <Navbar level={"/Level-Two-Part-Two"} questionnaire={"/Questionnaire"} live_generation={"/Live_Generation"}/>
      <div className="fixed flex top-16 right-0 z-50 px-6 py-3 space-x-6">
        {icons.map(({ icon, label }, index) => (
          <div key={index} className="relative flex items-center">
            <button
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
      <div
        className={`max-w-5xl mx-auto p-8 rounded-3xl shadow-2xl border mt-24 transform transition-all duration-500 hover:shadow-3xl ${
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
            {highlightedTexts.map((text, index) => {
              const { primaryValue } = determineQuestionType(text);
              const questionType = selectedTypes[index] || "Text";
              return (
                <li
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1 ${
                    isDarkMode
                      ? "text-teal-200 bg-gray-600/80 hover:bg-gray-500/70"
                      : "text-teal-800 bg-white/80 hover:bg-teal-100/70"
                  }`}
                >
                  <div className="flex items-center">
                    <span
                      className={`mr-3 text-lg ${
                        isDarkMode ? "text-cyan-400" : "text-cyan-500"
                      }`}
                    >
                      ✓
                    </span>
                    <span className="text-sm font-medium truncate max-w-xs">
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
              Total Placeholders: {highlightedTexts.length}
            </span>
          </div>
        )}
      </div>

      <div className="max-w-5xl mx-auto mt-10 px-8 pb-20">
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
  );
};

export default LevelTwoPart_Two;