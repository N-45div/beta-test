import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import lawyaltechLogo from "../assets/lawyaltech_logo.png";
import klaraImg from "../assets/klara.png";

const steps = [
  {
    heading: "Welcome to the CLM Game!",
    content: [
      "Step into the world of Contract Lifecycle Management (CLM) – the process of managing contracts from initiation to renewal or expiration.",
      "With CLM tools, legal processes are automated and streamlined for better compliance and efficiency.",
    ],
    footerImg: lawyaltechLogo,
  },
  {
    heading: "Your Role: Ana Smith",
    content: [
      "Meet Ana Smith, a Legal Intern at Ron & Taylor’s law firm in London.",
      "Starting in a modest cubicle, Ana dreams of joining the legal tech department and climbing the ladder to her own modern office.",
    ],
    footerImg: lawyaltechLogo,
  },
  {
    heading: "Level Up with CLM!",
    content: [
      "As Ana, you'll complete challenges that mirror real-life CLM workflows: drafting, negotiating, approving, and renewing contracts.",
      "Each challenge earns you points, unlocking new office upgrades and career progress!",
    ],
    footerImg: lawyaltechLogo,
  },
  {
    heading: "Meet Your Mentor: Klara",
    content: [
      "Say hello to Klara, the Head of IT at Ron & Taylor’s.",
      "She’ll guide you through your CLM training and help you navigate the platform like a pro.",
    ],
    klara: klaraImg,
    footerImg: lawyaltechLogo,
  },
  {
    heading: "Master Legal Tech Jargon",
    content: [
      "Before diving in, let’s review some key terms used in CLM tools.",
    ],
    list: [
      {
        term: "Document Automation",
        definition:
          "Software that automatically fills in case-specific details to generate legal documents.",
      },
      {
        term: "Negotiation",
        definition:
          "A stage in CLM where terms are reviewed, modified, and agreed upon by involved parties.",
      },
      {
        term: "Placeholders",
        definition:
          "Template markers replaced with relevant data during contract generation.",
      },
      {
        term: "Conditions",
        definition:
          "Rules that automate actions or changes within a contract based on predefined criteria.",
      },
    ],
    footerImg: lawyaltechLogo,
  },
];

const ContentComponent: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const [displayText, setDisplayText] = useState<string[]>([]);
  const [, setParagraphIndex] = useState<number>(0);
  const navigate = useNavigate(); // Add navigation hook

  useEffect(() => {
    setDisplayText([]); // Reset text when step changes
    setParagraphIndex(0);

    const paragraphs = [...steps[count].content]; // Clone content array

    if (steps[count].list) {
      steps[count].list.forEach((item) => {
        paragraphs.push(`${item.term}: ${item.definition}`);
      });
    }

    let currentPara = 0;

    const typeNextParagraph = () => {
      if (currentPara < paragraphs.length) {
        let i = 0;
        let tempText = "";

        const interval = setInterval(() => {
          if (i < paragraphs[currentPara].length) {
            tempText += paragraphs[currentPara][i];
            setDisplayText((prev) => {
              const newText = [...prev];
              newText[currentPara] = tempText;
              return newText;
            });
            i++;
          } else {
            clearInterval(interval);
            currentPara++;
            if (currentPara < paragraphs.length) {
              setTimeout(typeNextParagraph, 500);
            }
          }
        }, 30);

        return interval;
      }
    };

    const intervalId = typeNextParagraph();

    return () => {
      clearInterval(intervalId);
    };
  }, [count]);

  return (
    <div className={steps[count].klara ? "px-10 py-5" : "p-20"}>
      {steps[count].heading && (
        <h3 className="font-semibold mb-4 uppercase font-mono text-4xl text-center pb-6">
          {steps[count].heading}
        </h3>
      )}
      <div className="flex flex-row items-center">
        {steps[count].klara && (
          <img src={steps[count].klara} alt="klara" className="mr-4" />
        )}
        <span>
          {displayText.map((paragraph, idx) => (
            <p key={idx} className="font-mono text-lg mb-4">
              {paragraph}
            </p>
          ))}
        </span>
      </div>

      <div className={`p-20 pb-32 ${steps[count].klara ? "px-10 py-5" : ""}`}>
        <div className="fixed bottom-0 left-0 w-full flex items-center p-4 bg-white shadow-lg z-10">
          {/* Left section for logo */}
          <div className="w-1/3">
            {steps[count].footerImg && (
              <div className="w-54 h-26">
                <img src={steps[count].footerImg} alt="Lawyaltech Logo" />
              </div>
            )}
          </div>
          
          {/* Center section for buttons */}
          <div className="w-1/3 flex justify-center">
            {count < steps.length - 1 ? (
              <button
                className="px-6 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition duration-300"
                onClick={() => setCount(count + 1)}
              >
                Next
              </button>
            ) : (
              <button
                className="px-6 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition duration-300"
                onClick={() => navigate("/Matching-Exercise")} // Navigate to MatchingExercise
              >
                Start Matching Exercise
              </button>
            )}
          </div>
          
          {/* Empty right section for balance */}
          <div className="w-1/3"></div>
        </div>
      </div>
    </div>
  );
};

export default ContentComponent;
