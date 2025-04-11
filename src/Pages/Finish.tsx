import { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import { useNavigate, useLocation } from "react-router";
import Confetti from "react-confetti";
import parse, { DOMNode, Element } from "html-react-parser";
import { documentText } from "../utils/EmploymentAgreement";
import { findPlaceholderByValue } from "../utils/questionTypeUtils";
import { ThemeContext } from "../context/ThemeContext";

interface UserAnswers {
  [key: string]: string | boolean | { amount: string; currency: string } | undefined;
}

const processAgreement = (html: string, answers: UserAnswers, isDarkMode: boolean) => {
  let updatedHtml = html;

  // Ensure all h2 tags have !font-bold for higher specificity
  updatedHtml = updatedHtml.replace(
    /<h2 className="([^"]*)"/g,
    (_match, className) => {
      const classes = className.split(" ").filter((cls: string) => cls !== "font-bold");
      classes.push("!font-bold");
      return `<h2 className="${classes.join(" ")}"`;
    }
  );

  Object.entries(answers).forEach(([question, answer]) => {
    const placeholder = findPlaceholderByValue(question);

    // Handle Annual Salary
    if (question === "What's the annual salary?") {
      const salaryData = answer as { amount: string; currency: string } | undefined;
      const formattedSalary = salaryData?.amount && salaryData?.currency ? `${salaryData.amount} ${salaryData.currency}` : "[Annual Salary]";
      const escapedPlaceholder = "Annual Salary".replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&");
      updatedHtml = updatedHtml.replace(
        new RegExp(`\\[${escapedPlaceholder}\\]\\*`, "gi"),
        formattedSalary
      );
      updatedHtml = updatedHtml.replace("[USD]*", "");
      return;
    }

    // Handle Pension Clause Removal
    if (question === "Is the Pension clause applicable?") {
      const pensionClause = "The Employee will be enrolled in the Company's pension scheme in accordance with auto-enrolment legislation.";
      if (answer === false) {
        const pensionSection = updatedHtml.match(/<div>\s*<!--\s*Wrapper for each clause section\s*-->\s*<h2[^>]*>\(PENSION<\/h2>\s*<p>[\s\S]*?<\/p>\s*<\/div>/i);
        if (pensionSection) {
          updatedHtml = updatedHtml.replace(pensionSection[0], "");
        }
      } else if (answer === true) {
        updatedHtml = updatedHtml.replace(
          pensionClause,
          `<span class="${isDarkMode ? "text-teal-100" : "text-teal-900"}">${pensionClause}</span>`
        );
      }
      return;
    }

    // Handle Probation Clause Removal
    if (question === "Is the clause of probationary period applicable?") {
      if (answer === false) {
        const probationSection = updatedHtml.match(/<div>\s*<!--\s*Wrapper for each clause section\s*-->\s*<h2[^>]*>\(PROBATIONARY PERIOD<\/h2>\s*<p>[\s\S]*?\(Optional Clause\)<\/span><\/p>\s*<\/div>/i);
        if (probationSection) {
          updatedHtml = updatedHtml.replace(probationSection[0], "");
        } else {
          console.log("Probation section not matched in Finish.tsx:", updatedHtml);
        }
      }
      return;
    }

    // Handle other placeholders
    if (placeholder) {
      const escapedPlaceholder = placeholder.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&");
      if (typeof answer === "boolean") {
        updatedHtml = updatedHtml.replace(
          new RegExp(`\\[${escapedPlaceholder}\\]\\*`, "gi"),
          answer ? "Yes" : "No"
        );
      } else if (typeof answer === "string" && answer.trim()) {
        updatedHtml = updatedHtml.replace(
          new RegExp(`\\[${escapedPlaceholder}\\]\\*`, "gi"),
          answer
        );
      } else {
        updatedHtml = updatedHtml.replace(
          new RegExp(`\\[${escapedPlaceholder}\\]\\*`, "gi"),
          `[${placeholder}]`
        );
      }
    } else {
      if (question === "Is the sick pay policy applicable?") {
        const sickPayClause = "{The Employee may also be entitled to Company sick pay of [Details of Company Sick Pay Policy]}";
        if (answer === false) {
          updatedHtml = updatedHtml.replace(sickPayClause, "");
        } else if (answer === true && answers["What's the sick pay policy?"]) {
          updatedHtml = updatedHtml.replace(
            "[Details of Company Sick Pay Policy]",
            answers["What's the sick pay policy?"] as string
          );
        }
      } else if (question === "Is the previous service applicable?" && answer === false) {
        const prevEmploymentClause = 'or, if applicable, "on [Previous Employment Start Date] with previous continuous service taken into account"';
        updatedHtml = updatedHtml.replace(new RegExp(`\\s*${prevEmploymentClause.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&")}\\s*`, "gi"), "");
      }
    }

    if (question === "Is the employee entitled to overtime work?") {
      const overtimeYesClause = "{The Employee is entitled to overtime pay for authorized overtime work}";
      const overtimeNoClause = "{The Employee shall not receive additional payment for overtime worked}";

      // First, remove both clauses
      updatedHtml = updatedHtml.replace(overtimeYesClause, "");
      updatedHtml = updatedHtml.replace(overtimeNoClause, "");

      // Then add the appropriate clause based on the answer
      const workingHoursText = "The Employee may be required to work additional hours as necessary to fulfill job responsibilities.";
      const replacementText = answer === true ? overtimeYesClause : overtimeNoClause;

      updatedHtml = updatedHtml.replace(
        workingHoursText,
        `${workingHoursText} <br/><br/> ${replacementText}`
      );

      updatedHtml = updatedHtml.replace(
        /<p className="mt-5" id="employment-agreement-working-hours">([\s\S]*?)<\/p>/i,
        ""
      );
    }

    if (
      question ===
      "Is the Employee required to perform additional duties as part of their employment?"
    ) {
      const overtimeYesClause =
        "The Employee may be required to perform additional duties as reasonably assigned by the Company.";

      const overtimeYesRegex = new RegExp(
        `\\{\\s*` +
          overtimeYesClause
            .split(" ")
            .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*")
            .join("([\\n\\r\\s]*)") +
          `\\}`,
        "g"
      );

      if (answer === false)
        updatedHtml = updatedHtml.replace(overtimeYesRegex, "");
    }

    // Holiday entitlement
    if (
      question ===
      "Would unused holidays would be paid for if employee is termination?"
    ) {
      const overtimeYesClause =
        "Upon termination, unused leave will be paid. For [Unused Holiday Days] unused days, the holiday pay is [Holiday Pay] [USD].";

      const overtimeYesRegex = new RegExp(
        `\\{\\s*` +
          overtimeYesClause
            .split(" ")
            .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*")
            .join("([\\n\\r\\s]*)") +
          `\\}`,
        "g"
      );

      if (answer === false) {
        updatedHtml = updatedHtml.replace(overtimeYesRegex, "");
      } else if (answer === true) {
        // Get the values for unused holidays and holiday pay
        const unusedHolidaysAnswer = answers["Specify the number of unused holidays?"];
        const holidayPayAnswer = answers["Specify the holiday pay?"] as { amount: string; currency: string } | undefined;

        // Create modified clause with actual values
        let modifiedClause = overtimeYesClause;
        
        if (unusedHolidaysAnswer) {
          modifiedClause = modifiedClause.replace(
            "[Unused Holiday Days]",
            `${unusedHolidaysAnswer}`
          );
        }
        
        if (holidayPayAnswer?.amount) {
          const formattedHolidayPay = `${holidayPayAnswer.amount} ${holidayPayAnswer.currency}`;
          modifiedClause = modifiedClause.replace(
            "[Holiday Pay]",
            formattedHolidayPay
          );
          modifiedClause = modifiedClause.replace("[USD]", "");
        }

        // Replace the original clause with the modified one
        updatedHtml = updatedHtml.replace(
          overtimeYesRegex,
          `{${modifiedClause}}`
        );
      }
    }

    // SICKNESS ABSENCE
    if (
      question ===
      "Would the Employee be entitled to Company Sick Pay?"
    ) {
      const overtimeYesClause =
        "The Employee may also be entitled to Company sick pay.";

      const overtimeYesRegex = new RegExp(
        `\\{\\s*` +
          overtimeYesClause
            .split(" ")
            .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*")
            .join("([\\n\\r\\s]*)") +
          `\\}`,
        "g"
      );

      if (answer === false)
        updatedHtml = updatedHtml.replace(overtimeYesRegex, "");
    }

    // PLACE OF WORK
    if (
      question ===
      "Does the employee need to work at additional locations besides the normal place of work?"
    ) {
      const overtimeYesClause =
        "/The Employee may be required to work at [other locations]./";

      const overtimeYesRegex = new RegExp(
        `\\{\\s*` +
          overtimeYesClause
            .split(" ")
            .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*")
            .join("([\\n\\r\\s]*)") +
          `\\}`,
        "g"
      );

      if (answer === false)
        updatedHtml = updatedHtml.replace(overtimeYesRegex, "");
    }
  });

  return updatedHtml;
};

const Finish = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [confetti, setConfetti] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [finalAgreement, setFinalAgreement] = useState<React.ReactNode>(null);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: document.body.scrollHeight || window.innerHeight,
  });

  useEffect(() => {
    const updateDimensions = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: Math.max(document.body.scrollHeight, window.innerHeight),
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    setConfetti(true);

    const answers: UserAnswers = location.state?.userAnswers || {};
    console.log("User Answers in Finish:", answers); // Debug log
    const updatedText = processAgreement(documentText, answers, isDarkMode);
    setFinalAgreement(parse(updatedText, {
      replace: (domNode: DOMNode) => {
        if (domNode instanceof Element && domNode.attribs) {
          const className = domNode.attribs.className || "";
          if (className.includes("bg-white")) {
            domNode.attribs.className = "bg-white rounded-lg shadow-sm border border-black-100 p-8";
          }
          if (className.includes("text-blue-600 leading-relaxed")) {
            domNode.attribs.className = "text-blue-600 leading-relaxed space-y-6";
          }
        }
        return domNode;
      },
    }));

    setTimeout(updateDimensions, 100);

    return () => window.removeEventListener("resize", updateDimensions);
  }, [location.state, isDarkMode]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <div
      className={`min-h-screen overflow-hidden flex flex-col font-sans relative transition-all duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-800 via-gray-900 to-black"
          : "bg-gradient-to-br from-indigo-50 via-teal-50 to-pink-50"
      }`}
    >
      {confetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={true}
          numberOfPieces={200}
          gravity={0.1}
          initialVelocityY={5}
          tweenDuration={6000}
          run={true}
          colors={["#5EEAD4", "#A78BFA", "#F9A8D4", "#FBBF24", "#60A5FA"]}
        />
      )}
      <Navbar />
      <div className="flex justify-center mt-20 mb-12">
        <div
          className={`rounded-xl shadow-xl border p-12 w-4/5 max-w-5xl ${
            isDarkMode
              ? "bg-gray-800/90 backdrop-blur-sm border-gray-700/20"
              : "bg-white/90 backdrop-blur-sm border-teal-100/20"
          }`}
        >
          <h1
            className={`text-4xl font-bold mb-12 tracking-wide text-center border-b-2 pb-4 ${
              isDarkMode ? "text-teal-300 border-teal-600" : "text-teal-700 border-teal-200"
            }`}
          >
            EMPLOYMENT AGREEMENT
          </h1>
          <div className="leading-relaxed">
            {finalAgreement}
          </div>
        </div>
      </div>
      <div className="flex justify-center mb-12 space-x-8">
        <button
          className={`px-8 py-3 text-white rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 font-semibold ${
            isDarkMode
              ? "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800"
              : "bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-500 hover:to-cyan-500"
          }`}
          onClick={handleBackClick}
        >
          Back
        </button>
        <button
          className={`px-8 py-3 text-white rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 font-semibold ${
            isDarkMode
              ? "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800"
              : "bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-500 hover:to-cyan-500"
          }`}
          onClick={handleHomeClick}
        >
          Return to Home Page
        </button>
      </div>
    </div>
  );
};

export default Finish;




// latest code 