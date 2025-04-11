import { FaPenToSquare } from "react-icons/fa6";
import { TbSettingsMinus, TbSettingsPlus } from "react-icons/tb";
import { ImLoop2 } from "react-icons/im";
import { useState, useContext } from "react";
import Navbar from "../components/Navbar";
import { useHighlightedText } from "../context/HighlightedTextContext";
import { useQuestionType } from "../context/QuestionTypeContext";
import EmploymentAgreement from "../utils/EmploymentAgreement";
import { determineQuestionType } from "../utils/questionTypeUtils";
import { ThemeContext } from "../context/ThemeContext";
import { useRef } from "react";
import AIAnalysisPanel from "../components/AIAnalysisPanel";
// import introJs from "intro.js"   // Modified by Ayush
// import "intro.js/introjs.css"    // .
import { useEffect } from "react";
import { useLocation } from 'react-router-dom';
import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";

const icons = [
  { icon: <FaPenToSquare />, label: "Edit PlaceHolder" },
  { icon: <TbSettingsMinus />, label: "Small Condition" },
  { icon: <TbSettingsPlus />, label: "Big Condition" },
  { icon: <ImLoop2 />, label: "Loop" },
];

const LevelTwoPart_Two = () => {
  const location = useLocation();
  const { isDarkMode } = useContext(ThemeContext);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const { highlightedTexts, addHighlightedText } = useHighlightedText();
  const { selectedTypes } = useQuestionType();
  const documentRef = useRef<HTMLDivElement>(null);

  const getDocumentText = () => {
    return documentRef.current?.textContent || "";
  };

 // Update handleIconClick to remove termination clause matching
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

  if (label === "Edit PlaceHolder") {
    if (!(selectedText.startsWith("[") && selectedText.endsWith("]"))) {
      console.log("Invalid Edit Placeholder selection:", selectedText);
      return;
    }
    console.log("Selected Edit Placeholder:", textWithoutBrackets);
    // Add as standalone placeholder, even if part of a clause
    addHighlightedText(textWithoutBrackets);
    console.log("Updated highlightedTexts after adding:", highlightedTexts);
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
        span.textContent = node.textContent;
        return span;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        const newElement = document.createElement(element.tagName);
        for (const attr of element.attributes) {
          newElement.setAttribute(attr.name, attr.value);
        }
        element.childNodes.forEach((child) => {
          const newChild = applyHighlight(child);
          if (newChild) {
            newElement.appendChild(newChild);
          }
        });
        return newElement;
      }
      return null;
    };

    contents.childNodes.forEach((node) => {
      const newNode = applyHighlight(node);
      if (newNode) {
        fragment.appendChild(newNode);
      }
    });

    range.deleteContents();
    range.insertNode(fragment);

    const probationClauseContent = "The first [Probation Period Length] of employment will be a probationary period. The Company shall assess the Employee’s performance and suitability during this time. Upon successful completion, the Employee will be confirmed in their role.";
    const pensionClauseContent = "The Employee will be enrolled in the Company’s pension scheme in accordance with auto-enrolment legislation.";

    const normalizeText = (text: string) => text.replace(/\s+/g, "");
    const normalizedSelectedText = normalizeText(textWithoutBrackets);
    const normalizedProbationClause = normalizeText(probationClauseContent);
    const normalizedPensionClause = normalizeText(pensionClauseContent);

    console.log("Normalized selectedText:", normalizedSelectedText);
    console.log("Normalized probationClause:", normalizedProbationClause);

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

useEffect(() => {
  if (!location.state?.startTour) return; // Check for demo state first
  const tour = new Shepherd.Tour({
    defaultStepOptions: {
      cancelIcon: { enabled: true },
      classes: "shadow-md bg-purple-dark",
      scrollTo: { behavior: "smooth", block: "center" },
    },
    useModalOverlay: true,
  });

  // Step 1: Welcome message
  tour.addStep({
    id: "welcome",
    text: `
      <div class="welcome-message">
        <strong class="welcome-title">🚀 Welcome to Part II of Level 2, brave document warrior!</strong>
        <p class="welcome-text">It's time to master the art of document automation.</p>
        <p class="mission-text"><strong>Your mission:</strong> Automate an employment agreement using placeholders and conditions. Let's dive in!</p>
      </div>
    `,
    attachTo: { element: "body", on: "bottom-start" },
    classes: "shepherd-theme-custom animate__animated animate__fadeIn",
    buttons: [{ text: "Start Learning →", action: tour.next }],
  });

  // Step 2: Explain Placeholders
  tour.addStep({
    id: "placeholders",
    text: "Behold your <strong>employment agreement!</strong> Notice those bits wrapped in square brackets, like <strong> [Employer Name] </strong>? Those are placeholders—your secret weapons for automation. Any text inside <strong> [square brackets] </strong> is a placeholder waiting to be customized.<br> Let's start with [Employer Name] by highlighting it and verifying your selection. Then, click on the 'Edit Placeholder' button to automate your placeholder. Hurray! A placeholder has been created for you.",
    attachTo: { element: "body", on: "bottom-start" },
    buttons: [{ text: "Next →", action: tour.next }],
  });

  // Step 3: Select [Employer Name]
  tour.addStep({
    id: "select-employer-name",
    text: "Select [Employer Name] without spaces before or after the square brackets [].",
    attachTo: { element: "#employer-name-placeholder", on: "bottom" },
    buttons: [
      {
        text: "Verify Selection ✅",
        action: function () {
          const selection = window.getSelection();
          const selectedText = selection ? selection.toString().trim() : "";
          const employerNamePlaceholder = "[Employer Name]";

          if (selectedText === employerNamePlaceholder) {
            tour.next(); // Move to next step only if selection is correct
          } else {
            alert("⚠️ Please select placeholder like[Employer Name] exactly as shown.");
          }
        },
      },
    ],
  });

  // Step 4: Click Edit Placeholder
  tour.addStep({
    id: "edit-placeholder",
    text: "Now click on the <strong> Edit Placeholder </strong> to make changes.",
    attachTo: { element: "#edit-placeholder", on: "bottom" },
    buttons: [{ text: "Next →", action: tour.next }],
  });

  // Step 5: Show Selected Placeholder
  tour.addStep({
    id: "selected-placeholder",
    text: "Your selected placeholder is now visibl  here 📌 and ready for editing.",
    attachTo: { element: "#selected-placeholder0", on: "bottom" },
    buttons: [{ text: "Next →", action: tour.next }],
  });

  // Step 6: Go to Questionnaire
  tour.addStep({
    id: "questionnaire",
    text: "Now that you've selected the [Employer Name] placeholder. This is where the magic begins. To bring it to life, head to the 'Questionnaire' page. Click <strong> 'Questionnaire' </strong> in the menu bar which would take you to the page, and let's build the question that powers this placeholder!",
    attachTo: { element: "#Questionnaire-button", on: "right" },
    buttons: [{ text: "Done", action: tour.complete }],
  });

  tour.start();

  return () => {
    tour.complete();
  };
}, [location.state]);

  //
  // useEffect(() => {
  //   const intro = introJs() as any ;
  
  //   const handleSelection = () => {
  //     const selection = window.getSelection();
  //     if (!selection || !selection.rangeCount) return;
  
  //     const selectedText = selection.toString().trim(); // Trim any extra spaces
  //     const employerNamePlaceholder = "[Employer Name]";

  //     // Get the next button from the tooltip
  //     const nextButton = document.querySelector(".introjs-nextbutton") as HTMLButtonElement;

  //     if (nextButton) {
  //       if (selectedText === employerNamePlaceholder) {
  //         nextButton.removeAttribute("disabled"); // Enable
  //       } else {
  //         nextButton.setAttribute("disabled", "true"); // Disable
  //       }
  //     }

  //   };
  
  //   // Add event listener for text selection
  //   document.addEventListener("mouseup", handleSelection);
  
  //   intro.setOptions({
  //     steps: [
  //       {
  //         intro: "🌟 Welcome to Level 2! Let’s teach you document automation. Automate an employment agreement using placeholders and conditions.",
  //         tooltipClass: "introjs-tooltip-left-bottom",
  //       },
  //       {
  //         intro: "📌 **What are Placeholders?**\n\nPlaceholders are temporary markers that are replaced with actual details when finalizing a contract. They are enclosed in square brackets [ ], like **[Employer Name]** or **[Employee Address]**, indicating where specific information needs to be filled in.",
  //         tooltipClass: "introjs-tooltip-left-bottom",
  //       },
  //       {
  //         element: document.querySelector("#employer-name-placeholder") as HTMLElement,
  //         intro: "Select [Employer Name] without including spaces before or after the square brackets.",
  //         tooltipClass: "introjs-tooltip-center",
  //         beforeChange: () => {
  //           const selection = window.getSelection();
  //           if (!selection || !selection.rangeCount) return false;

  //           const selectedText = selection.toString().trim();
  //           const employerNamePlaceholder = "[Employer Name]";

  //           if (selectedText !== employerNamePlaceholder) {
  //             alert("Please select [Employer Name] exactly as shown.");
  //             return false; // Prevent moving to the next step
  //           }
  //           return true; // Allow moving to the next step
  //         },  
  //       },
  //       {
  //         element: document.querySelector("#edit-placeholder") as HTMLElement,
  //         intro: "Now click on the Edit Placeholder to make changes.",
  //         tooltipClass: "introjs-tooltip-bottom-center",
  //       },
  //       {
  //         element: document.querySelector("#selected-placeholder0") as HTMLElement,
  //         intro: "Your selected placeholder is now visible here and ready for editing.",
  //         tooltipClass: "introjs-tooltip-bottom-center",
  //       },
  //       {
  //         element: document.querySelector("#Questionnaire-button") as HTMLElement,
  //         intro: "Go to Questionnaire",
  //         tooltipClass: "introjs-tooltip-right-top",
  //       },
  //     ],
  //     showProgress: false,
  //     showBullets: false,
  //     exitOnOverlayClick: false,
  //     disableInteraction: false, // Allow interaction with the document
  //     hidePrev: true,
  //     hideNext: false,
  //     nextLabel: "Next →",
  //     doneLabel: "Done", 
  //   });

    
  
  //    intro.start();
  
  //    Cleanup event listener
  //   return () => {
  //     document.removeEventListener("mouseup", handleSelection);
  //   };
  // }, []);

  // useEffect(() => {
  //   const tour = new Shepherd.Tour({
  //     defaultStepOptions: {
  //       cancelIcon: { enabled: true },
  //       classes: "shadow-md bg-purple-dark",
  //       scrollTo: { behavior: "smooth", block: "center" },
  //     },
  //     useModalOverlay: true,
  //   });
  
  //   // Step 1: Welcome message
  //   tour.addStep({
  //     id: "welcome",
  //     text: `
  //       <div class="welcome-message">
  //         <strong class="welcome-title">🚀 Welcome to Part II of Level 2, brave document warrior!</strong>
  //         <p class="welcome-text">It's time to master the art of document automation.</p>
  //         <p class="mission-text"><strong>Your mission:</strong> Automate an employment agreement using placeholders and conditions. Let's dive in!</p>
  //       </div>
  //     `,
  //     attachTo: { element: "body", on: "bottom-start" },
  //     classes: "shepherd-theme-custom animate__animated animate__fadeIn",
  //     buttons: [{ text: "Start Learning →", action: tour.next }],
  //   });
  
  //   // Step 2: Explain Placeholders
  //   tour.addStep({
  //     id: "placeholders",
  //     text: "Behold your <strong>employment agreement!</strong> Notice those bits wrapped in square brackets, like <strong> [Employer Name] </strong>? Those are placeholders—your secret weapons for automation. Any text inside <strong> [square brackets] </strong> is a placeholder waiting to be customized.<br> Let's start with [Employer Name] by highlighting it and verifying your selection. Then, click on the 'Edit Placeholder' button to automate your placeholder. Hurray! A placeholder has been created for you.",
  //     attachTo: { element: "body", on: "bottom-start" },
  //     buttons: [{ text: "Next →", action: tour.next }],
  //   });
  
  //   // Step 3: Select [Employer Name]
  //   tour.addStep({
  //     id: "select-employer-name",
  //     text: "Select [Employer Name] without spaces before or after the square brackets [].",
  //     attachTo: { element: "#employer-name-placeholder", on: "bottom" },
  //     buttons: [
  //       {
  //         text: "Verify Selection ✅",
  //         action: function () {
  //           const selection = window.getSelection();
  //           const selectedText = selection ? selection.toString().trim() : "";
  //           const employerNamePlaceholder = "[Employer Name]";
  
  //           if (selectedText === employerNamePlaceholder) {
  //             tour.next(); // Move to next step only if selection is correct
  //           } else {
  //             alert("⚠️ Please select placeholder like[Employer Name] exactly as shown.");
  //           }
  //         },
  //       },
  //     ],
  //   });
  
  //   // Step 4: Click Edit Placeholder
  //   tour.addStep({
  //     id: "edit-placeholder",
  //     text: "Now click on the <strong> Edit Placeholder </strong> to make changes.",
  //     attachTo: { element: "#edit-placeholder", on: "bottom" },
  //     buttons: [{ text: "Next →", action: tour.next }],
  //   });
  
  //   // Step 5: Show Selected Placeholder
  //   tour.addStep({
  //     id: "selected-placeholder",
  //     text: "Your selected placeholder is now visibl  here 📌 and ready for editing.",
  //     attachTo: { element: "#selected-placeholder0", on: "bottom" },
  //     buttons: [{ text: "Next →", action: tour.next }],
  //   });
  
  //   // Step 6: Go to Questionnaire
  //   tour.addStep({
  //     id: "questionnaire",
  //     text: "Now that you've selected the [Employer Name] placeholder. This is where the magic begins. To bring it to life, head to the 'Questionnaire' page. Click <strong> 'Questionnaire' </strong> in the menu bar which would take you to the page, and let's build the question that powers this placeholder!",
  //     attachTo: { element: "#Questionnaire-button", on: "right" },
  //     buttons: [{ text: "Done", action: tour.complete }],
  //   });
  
  //   tour.start();
  
  //   return () => {
  //     tour.complete();
  //   };
  // }, []);
  
  


  
  return (
    <div
      className={`w-full min-h-screen font-sans transition-all duration-500 ${isDarkMode
        ? "bg-gradient-to-br from-gray-800 via-gray-900 to-black"
        : "bg-gradient-to-br from-indigo-50 via-teal-50 to-pink-50"
        }`}
    >
      <Navbar level={"/Level-Two-Part-Two"} questionnaire={"/Questionnaire"} live_generation={"/Live_Generation"}/>
      <div className="fixed flex top-16 right-0 z-50 px-6 py-3 space-x-6">
        {icons.map(({ icon, label }, index) => (
          <div key={index} className="relative flex items-center">
            <button id="edit-placeholder"
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
                className={`absolute -left-10 top-full mt-2 px-3 py-1 text-sm text-white rounded-lg shadow-lg whitespace-nowrap animate-fadeIn ${isDarkMode
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
        className={`max-w-5xl mx-auto p-8 rounded-3xl shadow-2xl border mt-24 transform transition-all duration-500 hover:shadow-3xl ${isDarkMode
          ? "bg-gray-800/90 backdrop-blur-lg border-gray-700/50"
          : "bg-white/90 backdrop-blur-lg border-teal-100/30"
          }`}
      >
        <h2
          className={`text-2xl font-semibold mb-6 tracking-wide ${isDarkMode ? "text-teal-300" : "text-teal-700"
            }`}
        >
          ☑️ Selected Placeholders
        </h2>
        {highlightedTexts.length > 0 ? (
          <ul
            className={`space-y-3 p-5 rounded-xl shadow-inner ${isDarkMode
              ? "bg-gradient-to-r from-gray-700/70 via-gray-800/70 to-gray-900/70"
              : "bg-gradient-to-r from-teal-50/70 via-cyan-50/70 to-indigo-50/70"
              }`}
          >
            {highlightedTexts.map((text, index) => {
              const { primaryValue } = determineQuestionType(text);
              const questionType = selectedTypes[index] || "Text";
              return (
                <li
                  id={`selected-placeholder${index}`}
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1 ${isDarkMode
                    ? "text-teal-200 bg-gray-600/80 hover:bg-gray-500/70"
                    : "text-teal-800 bg-white/80 hover:bg-teal-100/70"
                    }`}
                >
                  <div className="flex items-center">
                    <span
                      className={`mr-3 text-lg ${isDarkMode ? "text-cyan-400" : "text-cyan-500"
                        }`}
                    >
                      ✓
                    </span>
                    <span className="text-sm font-medium truncate max-w-xs">
                      {primaryValue || text}
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${isDarkMode
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
            className={`text-center py-8 rounded-xl shadow-inner ${isDarkMode
              ? "bg-gradient-to-r from-gray-700/70 via-gray-800/70 to-gray-900/70"
              : "bg-gradient-to-r from-teal-50/70 via-cyan-50/70 to-indigo-50/70"
              }`}
          >
            <p
              className={`italic text-lg ${isDarkMode ? "text-teal-400" : "text-teal-600"
                }`}
            >
              No placeholders selected yet
            </p>
          </div>
        )}
        {highlightedTexts.length > 0 && (
          <div className="mt-5 text-right">
            <span
              className={`text-sm px-3 py-1 rounded-full ${isDarkMode
                ? "text-teal-300 bg-gray-600/50"
                : "text-teal-600 bg-teal-100/50"
                }`}
            >
              Total Placeholders: {highlightedTexts.length}
            </span>
          </div>
        )}
      </div>

      <div className="max-w-5xl mx-auto mt-10 px-8 pb-20" ref={documentRef}>
        <div className={`p-6 rounded-3xl shadow-xl border ${isDarkMode
          ? "bg-gray-800/80 backdrop-blur-md border-gray-700/20 bg-gradient-to-br from-gray-700/70 via-gray-800/70 to-gray-900/70"
          : "bg-white/80 backdrop-blur-md border-teal-100/20 bg-gradient-to-br from-teal-50/70 via-cyan-50/70 to-indigo-50/70"
          }`}>
          <EmploymentAgreement />
        </div>
        <AIAnalysisPanel
          documentText={getDocumentText()}
          highlightedTexts={highlightedTexts}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
};

export default LevelTwoPart_Two;

// orihdisk
