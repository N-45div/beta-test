import { FaPenToSquare } from "react-icons/fa6";
import { TbSettingsMinus, TbSettingsPlus } from "react-icons/tb";
import { ImLoop2 } from "react-icons/im";
import { useState, useContext, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useHighlightedText } from "../context/HighlightedTextContext";
import { ThemeContext } from "../context/ThemeContext";
import AIAnalysisPanel from "../components/AIAnalysisPanel";
import { useLocation } from "react-router";
import { CrispChat } from "../bot/knowledge";
import { useScore } from "../context/ScoreContext";
import EmploymentAgreement from "../utils/EmploymentAgreement";

const icons = [
  { icon: <FaPenToSquare />, label: "Edit PlaceHolder" },
  { icon: <TbSettingsMinus />, label: "Small Condition" },
  { icon: <TbSettingsPlus />, label: "Big Condition" },
  { icon: <ImLoop2 />, label: "Loop" },
];

const LevelTwoPart_Two = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const location = useLocation();
  const { highlightedTexts } = useHighlightedText();
  const documentRef = useRef<HTMLDivElement>(null);
  const { setLevelTwoScore } = useScore();
  const [score] = useState<number>(0); // Only score used
  useEffect(() => {
    setLevelTwoScore(score);
  }, [score, setLevelTwoScore]);

  useEffect(() => {
    sessionStorage.setItem("level", location.pathname);
    return () => {
      sessionStorage.removeItem("selectedQuestionTypes_2");
      sessionStorage.removeItem("typeChangedStates_2");
      sessionStorage.removeItem("questionOrder_2");
    };
  }, [location.pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleIconClick = (label: string) => {
    // Your actual logic goes here
  };

  return (
    <div
      className={`min-h-screen w-full transition-all duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white"
          : "bg-gradient-to-br from-indigo-50 via-teal-50 to-white text-black"
      }`}
    >
      <Navbar />

      <div className="flex flex-col md:flex-row px-4 md:px-8 py-4 gap-6">
        {/* AI Panel */}
        <aside className="md:w-1/4 w-full sticky top-0">
          <AIAnalysisPanel
            documentText={documentRef.current?.textContent || ""}
            highlightedTexts={highlightedTexts}
            isDarkMode={isDarkMode}
          />
        </aside>

        {/* Main Content */}
        <main className="md:w-3/4 w-full flex flex-col gap-4">
          <div className="flex gap-2 flex-wrap">
            {icons.map(({ icon, label }, index) => (
              <button
                key={index}
                onClick={() => handleIconClick(label)}
                className="flex items-center gap-2 px-3 py-1 rounded-lg shadow text-sm border hover:bg-teal-100 dark:hover:bg-gray-700 transition"
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div
            ref={documentRef}
            className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow max-h-[80vh] overflow-y-auto"
          >
            <EmploymentAgreement />
          </div>
        </main>
      </div>

      <CrispChat websiteId="YOUR_CRISP_WEBSITE_ID" />
    </div>
  );
};

export default LevelTwoPart_Two;
