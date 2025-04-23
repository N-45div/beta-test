import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback, useContext } from "react";
import Navbar from "../components/Navbar";
import { documentText } from "../utils/EmploymentAgreement";
import { useHighlightedText } from "../context/HighlightedTextContext";
import { useQuestionType } from "../context/QuestionTypeContext";
import { useQuestionEditContext } from "../context/QuestionEditContext";
import { ThemeContext } from "../context/ThemeContext";
import parse, { DOMNode, Element } from "html-react-parser";

const Live_Generation_2 = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const { highlightedTexts: originalHighlightedTexts } = useHighlightedText();
  const { selectedTypes: originalSelectedTypes, setSelectedTypes, editedQuestions: originalEditedQuestions, setEditedQuestions, requiredQuestions: originalRequiredQuestions } = useQuestionType();
  const { determineQuestionType, findPlaceholderByValue } = useQuestionEditContext();
  const [agreement, setAgreement] = useState<string>(documentText);
  const [inputErrors, setInputErrors] = useState<{ [key: string]: string }>({});
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [additionalLocations, setAdditionalLocations] = useState<string[]>([]);
  const [locations] = useState<string[]>([]);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string | boolean | null | { amount: string; currency: string } }>({});
  const [highlightedTexts, setHighlightedTexts] = useState<string[]>(originalHighlightedTexts);
  const [selectedTypes, setLocalSelectedTypes] = useState<(string | null)[]>(originalSelectedTypes);
  const [editedQuestions, setLocalEditedQuestions] = useState<string[]>(originalEditedQuestions);
  const [requiredQuestions, setLocalRequiredQuestions] = useState<boolean[]>(originalRequiredQuestions);

  useEffect(() => {
    // Load the question order from sessionStorage
    const savedOrder = sessionStorage.getItem("questionOrder");
    let questionOrder: number[] = [];
    if (savedOrder) {
      questionOrder = JSON.parse(savedOrder);
    } else {
      questionOrder = originalHighlightedTexts.map((_, index) => index);
    }

    // Reorder highlightedTexts and related arrays based on the saved order
    const processedTexts: string[] = [];
    const questionMap = new Map();

    for (const text of originalHighlightedTexts) {
      const { primaryValue } = determineQuestionType(text);
      if (primaryValue && !questionMap.has(primaryValue)) {
        questionMap.set(primaryValue, text);
        processedTexts.push(text);
      }
    }

    const reorderedHighlightedTexts = questionOrder
      .map(index => processedTexts[index])
      .filter(text => text !== undefined);
    const reorderedSelectedTypes = questionOrder
      .map(index => originalSelectedTypes[index])
      .filter(type => type !== undefined);
    const reorderedEditedQuestions = questionOrder
      .map(index => originalEditedQuestions[index])
      .filter(text => text !== undefined);
    const reorderedRequiredQuestions = questionOrder
      .map(index => originalRequiredQuestions[index])
      .filter(req => req !== undefined);

    setHighlightedTexts(reorderedHighlightedTexts);
    setLocalSelectedTypes(reorderedSelectedTypes);
    setLocalEditedQuestions(reorderedEditedQuestions);
    setLocalRequiredQuestions(reorderedRequiredQuestions);

    const initial = initializeUserAnswers(reorderedHighlightedTexts, reorderedSelectedTypes);
    setUserAnswers(initial);
  }, [originalHighlightedTexts, originalSelectedTypes, originalEditedQuestions, originalRequiredQuestions]);

  function initializeUserAnswers(highlightedTexts: string[], selectedTypes: (string | null)[]): { [key: string]: string | boolean | null | { amount: string; currency: string } } {
    const initialAnswers: { [key: string]: string | boolean | null | { amount: string; currency: string } } = {};
    highlightedTexts.forEach((text, index) => {
      const { primaryValue } = determineQuestionType(text);
      const type = selectedTypes[index] || "Text";
      if (primaryValue) {
        if (primaryValue === "What's the annual salary?") {
          initialAnswers[primaryValue] = { amount: "", currency: "USD" };
        } else {
          initialAnswers[primaryValue] = type === "Radio" ? null : "";
        }
      }
    });
    return initialAnswers;
  }

  useEffect(() => {
    let updatedText = documentText;

    const probationAnswer = userAnswers["Is the clause of probationary period applicable?"];
    if (probationAnswer === null || probationAnswer === false) {
      updatedText = updatedText.replace(
        /<h2[^>]*>[^<]*PROBATIONARY PERIOD[^<]*<\/h2>\s*<p[^>]*>[\s\S]*?<\/p>/i,
        ""
      );
    }

    const pensionAnswer = userAnswers["Is the Pension clause applicable?"];
    if (pensionAnswer === null || pensionAnswer === false) {
      updatedText = updatedText.replace(
        /<h2[^>]*>[^<]*PENSION[^<]*<\/h2>\s*<p[^>]*>[\s\S]*?<\/p>/i,
        ""
      );
    }

    Object.entries(userAnswers).forEach(([question, answer]) => {
      const placeholder = findPlaceholderByValue(question);

      if (placeholder === "Unused Holiday Days" && typeof answer === "string") {
        const storedOperationType = localStorage.getItem("operationType");
        const storedOperationValue = localStorage.getItem("operationValue");
        const operationValue = storedOperationValue ? parseFloat(storedOperationValue) : null;
        let calculatedValue: number | null = null;
        let floatAnswer = parseFloat(answer).toFixed(2);
        const numericAnswer = parseFloat(floatAnswer);
        if (storedOperationType && operationValue !== null) {
          switch (storedOperationType.toLowerCase()) {
            case "add":
              calculatedValue = numericAnswer + operationValue;
              break;
            case "subtract":
              calculatedValue = numericAnswer - operationValue;
              break;
            case "multiply":
              calculatedValue = numericAnswer * operationValue;
              break;
            case "divide":
              calculatedValue = operationValue !== 0 ? numericAnswer / operationValue : "Error";
              break;
            default:
              calculatedValue = null;
          }
        }
        localStorage.setItem("calculatedValue", calculatedValue !== null ? String(calculatedValue) : "0");

        updatedText = updatedText.replace(
          new RegExp("\\[Holiday Pay\\]", "gi"),
          `<span class="${isDarkMode ? "bg-teal-600/70 text-teal-100" : "bg-teal-200/70 text-teal-900"} px-1 rounded">${calculatedValue}</span>`
        );
      }

      if (placeholder) {
        const escapedPlaceholder = placeholder.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&");
        if (question === "What's the annual salary?") {
          const salaryData = answer as { amount: string; currency: string } | undefined;
          updatedText = updatedText.replace(
            new RegExp(`\\[${escapedPlaceholder}\\]`, "gi"),
            `<span class="${isDarkMode ? "bg-teal-600/70 text-teal-100" : "bg-teal-200/70 text-teal-900"} px-1 rounded">${salaryData?.amount || "[Annual Salary]"}</span>`
          );
          updatedText = updatedText.replace(
            new RegExp(`\\[USD\\]`, "gi"),
            `<span class="${isDarkMode ? "bg-teal-600/70 text-teal-100" : "bg-teal-200/70 text-teal-900"} px-1 rounded">${salaryData?.currency || "[USD]"}</span>`
          );
        } else if (typeof answer === "boolean") {
          if (!answer) {
            if (question === "Is the clause of probationary period applicable?") {
              if (answer === false) {
                updatedText = updatedText.replace(
                  /<h2[^>]*>[^<]*PROBATIONARY PERIOD[^<]*<\/h2>\s*<p[^>]*>[\s\S]*?<\/p>/i,
                  ""
                );
              }
            }

            updatedText = updatedText.replace(new RegExp(`.*${escapedPlaceholder}.*`, "gi"), "");
          } else {
            updatedText = updatedText.replace(
              new RegExp(`\\[${escapedPlaceholder}\\]`, "gi"),
              answer ? "Yes" : "No"
            );
          }
        } else if (typeof answer === "string" && answer.trim()) {
          updatedText = updatedText.replace(
            new RegExp(`\\[${escapedPlaceholder}\\]`, "gi"),
            `<span class="${isDarkMode ? "bg-teal-600/70 text-teal-100" : "bg-teal-200/70 text-teal-900"} px-1 rounded">${answer}</span>`
          );
        } else {
          updatedText = updatedText.replace(
            new RegExp(`\\[${escapedPlaceholder}\\]`, "gi"),
            `[${placeholder}]`
          );
        }
      } else {
        if (question === "Is the sick pay policy applicable?") {
          const sickPayClause = "{The Employee may also be entitled to Company sick pay of [Details of Company Sick Pay Policy]}";
          if (answer === false) {
            updatedText = updatedText.replace(sickPayClause, "");
          } else if (answer === true && userAnswers["What's the sick pay policy?"]) {
            updatedText = updatedText.replace(
              "[Details of Company Sick Pay Policy]",
              `<span class="${isDarkMode ? "bg-teal-600/70 text-teal-100" : "bg-teal-200/70 text-teal-900"} px-1 rounded">${userAnswers["What's the sick pay policy?"] as string}</span>`
            );
          }
        } else if (question === "Is the termination clause applicable?") {
          if (answer === false) {
            const terminationSection = updatedText.match(/<h2[^>]*>TERMINATION<\/h2>\s*<p[^>]*>([\s\S]*?)<\/p>/i);
            if (terminationSection) {
              const sectionWithoutClause = terminationSection[0].replace(/\(After the probationary period.*?gross misconduct\.\)/, '');
              updatedText = updatedText.replace(terminationSection[0], sectionWithoutClause);
            }
          } else if (answer === true && userAnswers["What's the notice period?"]) {
            updatedText = updatedText.replace(
              /\[Notice Period\]/gi,
              `<span class="${isDarkMode ? "bg-teal-600/70 text-teal-100" : "bg-teal-200/70 text-teal-900"} px-1 rounded">${userAnswers["What's the notice period?"] as string}</span>`
            );
          }
        } else if (question === "Is the previous service applicable?" && answer === false) {
          const prevEmploymentClause = 'or, if applicable, "on [Previous Employment Start Date] with previous continuous service taken into account"';
          updatedText = updatedText.replace(new RegExp(`\\s*${prevEmploymentClause.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&")}\\s*`, "gi"), "");
        } else if (question === "Does the employee receive overtime payment?" && answer === false) {
          const overtimeYesClause = "{The Employee is entitled to overtime pay at a rate of [Overtime Pay Rate] for authorized overtime work}";
          updatedText = updatedText.replace(new RegExp(`\\s*${overtimeYesClause.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&")}\\s*`, "gi"), "");
        } else if (question === "Should the employee not receive overtime payment?" && answer === false) {
          const overtimeNoClause = "{The Employee shall not receive additional payment for overtime worked}";
          updatedText = updatedText.replace(new RegExp(`\\s*${overtimeNoClause.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&")}\\s*`, "gi"), "");
        }
      }
    });

    setAgreement(updatedText + " ");
  }, [userAnswers, isDarkMode]);

  const validateInput = (type: string, value: string): string => {
    if (!value) return "";
    switch (type) {
      case "Number":
        if (!/^\d*\.?\d*$/.test(value)) {
          return "Please enter a valid number.";
        }
        break;
      case "Date":
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
          return "Please enter a valid date in YYYY-MM-DD format.";
        }
        break;
      case "Email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Please enter a valid email address.";
        }
        break;
      case "Text":
      case "Paragraph":
        break;
      default:
        break;
    }
    return "";
  };

  const handleAnswerChange = useCallback(
    (
      index: number,
      value: string | boolean | { amount: string; currency: string },
      followUpQuestion?: string,
      isAdditional?: boolean,
      locationNum?: number
    ) => {
      const { primaryValue } = determineQuestionType(highlightedTexts[index] || "");
      if (!primaryValue) return;

      const currentType = selectedTypes[index] || "Text";

      if (typeof value === "string" && currentType !== "Radio" && primaryValue !== "What's the annual salary?") {
        const error = validateInput(currentType, value);
        setInputErrors((prev) => ({
          ...prev,
          [primaryValue]: error,
        }));
      }

      const finalValue = currentType === "Radio" ? value : value;

      if (isAdditional && locationNum !== undefined) {
        setUserAnswers((prev) => {
          const currentValue = prev[primaryValue];
          let stringValue = "";
          
          if (typeof currentValue === "string") {
            stringValue = currentValue;
          } else if (typeof currentValue === "boolean") {
            stringValue = currentValue.toString();
          }
          
          let values = stringValue
            .split(/\s*,\s*|\s*and\s*|\s*, and\s*/)
            .filter(Boolean);
          
          values[locationNum] = String(finalValue);
          values = values.filter((v) => v.trim() !== "");
          
          let updatedAnswer = values.length === 1 
            ? values[0] 
            : values.length === 2 
            ? values.join(" and ") 
            : `${values.slice(0, -1).join(", ")}, and ${values[values.length - 1]}`;
          
          return {
            ...prev,
            [primaryValue]: updatedAnswer,
          };
        });
      } else {
        if (primaryValue === "What is the additional work location?" && typeof finalValue === "string") {
          locations[0] = finalValue;
        }
        setUserAnswers((prev) => {
          const newAnswers = {
            ...prev,
            [primaryValue]: finalValue,
          };
          if (followUpQuestion && finalValue === true) {
            newAnswers[followUpQuestion] = "";
          }
          return newAnswers;
        });
      }
    },
    [highlightedTexts, selectedTypes]
  );

  const handleAddMore = () => {
    setAdditionalLocations((prevLocations) => [...prevLocations, ""]);
  };

  const handleLocationChange = (index: number, value: string) => {
    setAdditionalLocations((prevLocations) => {
      const updatedLocations = [...prevLocations];
      updatedLocations[index] = value;
      return updatedLocations;
    });
    console.log(additionalLocations);
  };

  const renderAnswerInput = (index: number) => {
    const questionText = highlightedTexts[index] || "";
    const { primaryValue } = determineQuestionType(questionText);
    if (!primaryValue) return null;

    const currentType = selectedTypes[index] || "Text";
    const answer = userAnswers[primaryValue] !== undefined ? userAnswers[primaryValue] : (currentType === "Radio" ? null : "");
    const error = inputErrors[primaryValue] || "";
    const isAdditionalLocationQuestion =
      primaryValue === "What is the additional work location?";
    let includeAdditional = userAnswers["Does the employee need to work at additional locations besides the normal place of work?"] !== undefined
      ? userAnswers["Does the employee need to work at additional locations besides the normal place of work?"]
      : true;
    const isRequired = requiredQuestions[index] || false;

    if (primaryValue === "What's the annual salary?") {
      // Type guard to ensure answer is of the correct shape
      const answerWithCurrency = typeof answer === "object" && answer !== null && "amount" in answer && "currency" in answer
        ? answer as { amount: string; currency: string }
        : { amount: "", currency: "USD" };

      return (
        <div key={index} className="mb-12">
          <div className="w-full">
            <p className={`text-lg font-medium ${isDarkMode ? "text-teal-200" : "text-teal-900"}`}>
              {editedQuestions[index] || primaryValue || "Unnamed Question"}
              {isRequired && <span className="text-red-500 ml-2">*</span>}
            </p>
            <div className="flex items-center space-x-4 mt-4">
              <input
                type="number"
                value={answerWithCurrency.amount}
                onChange={(e) => {
                  const value = e.target.value;
                  const error = validateInput("Number", value);
                  setInputErrors((prev) => ({ ...prev, [primaryValue]: error }));
                  // Type guard to ensure userAnswers[primaryValue] is the correct type
                  const currentAnswer = userAnswers[primaryValue];
                  const currentCurrency = typeof currentAnswer === "object" && currentAnswer !== null && "currency" in currentAnswer
                    ? (currentAnswer as { amount: string; currency: string }).currency
                    : "USD";
                  handleAnswerChange(index, { amount: value, currency: currentCurrency });
                }}
                ref={(el) => { if (el) inputRefs.current[index] = el; }}
                className={`p-3 w-1/2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDarkMode
                    ? `bg-gray-700/80 border ${error ? "border-red-400" : "border-teal-600"} focus:ring-teal-400 text-teal-200 placeholder-teal-300/70`
                    : `bg-white/80 border ${error ? "border-red-400" : "border-teal-200"} focus:ring-teal-500 text-teal-800 placeholder-teal-400/70`
                }`}
                placeholder="Enter amount"
              />
              <select
                value={answerWithCurrency.currency}
                onChange={(e) => {
                  handleAnswerChange(index, { amount: answerWithCurrency.amount, currency: e.target.value });
                }}
                className={`p-3 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-700/80 border border-teal-600 focus:ring-teal-400 text-teal-200"
                    : "bg-white/80 border border-teal-200 focus:ring-teal-500 text-teal-800"
                }`}
                required={isRequired}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="INR">INR</option>
                <option value="SEK">SEK</option>
                <option value="AUD">AUD</option>
                <option value="JPY">JPY</option>
                <option value="CAD">CAD</option>
                <option value="CHF">CHF</option>
              </select>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        </div>
      );
    }

    return (
      <div key={index} className="mb-12">
        <div className="w-full">
          {includeAdditional || !isAdditionalLocationQuestion ? (
            <p className={`text-lg font-medium ${isDarkMode ? "text-teal-200" : "text-teal-900"}`}>
              {editedQuestions[index] || primaryValue || "Unnamed Question"}
              {isRequired && <span className="text-red-500 ml-2">*</span>}
            </p>
          ) : null}
          {currentType === "Radio" ? (
            primaryValue === "Is the sick pay policy applicable?" ? (
              <>
                <div className="mt-4 flex space-x-6">
                  <label className={`flex items-center space-x-2 cursor-pointer ${isDarkMode ? "text-teal-300" : "text-teal-700"}`}>
                    <input
                      type="radio"
                      checked={answer === true}
                      onChange={() => handleAnswerChange(index, true, "What's the sick pay policy?")}
                      className={`cursor-pointer ${isDarkMode ? "text-teal-500 focus:ring-teal-400" : "text-teal-600 focus:ring-teal-500"}`}
                      required={isRequired}
                    />
                    <span>Yes</span>
                  </label>
                  <label className={`flex items-center space-x-2 cursor-pointer ${isDarkMode ? "text-teal-300" : "text-teal-700"}`}>
                    <input
                      type="radio"
                      checked={answer === false}
                      onChange={() => handleAnswerChange(index, false)}
                      className={`cursor-pointer ${isDarkMode ? "text-teal-500 focus:ring-teal-400" : "text-teal-600 focus:ring-teal-500"}`}
                      required={isRequired}
                    />
                    <span>No</span>
                  </label>
                </div>
                {answer === true && (
                  <input
                    type="text"
                    value={(userAnswers["What's the sick pay policy?"] as string) || ""}
                    onChange={(e) =>
                      setUserAnswers((prev) => ({
                        ...prev,
                        "What's the sick pay policy?": e.target.value,
                      }))
                    }
                    className={`mt-4 p-3 w-full rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
                      isDarkMode
                        ? "bg-gray-700/80 border border-teal-600 focus:ring-teal-400 text-teal-200 placeholder-teal-300/70"
                        : "bg-white/80 border border-teal-200 focus:ring-teal-500 text-teal-800 placeholder-teal-400/70"
                    }`}
                    placeholder="What's the sick pay policy?"
                    required={isRequired}
                  />
                )}
              </>
            ) : (
              <div className="mt-4 flex space-x-6">
                <label className={`flex items-center space-x-2 cursor-pointer ${isDarkMode ? "text-teal-300" : "text-teal-700"}`}>
                  <input
                    type="radio"
                    checked={answer === true}
                    onChange={() => handleAnswerChange(index, true)}
                    className={`cursor-pointer ${isDarkMode ? "text-teal-500 focus:ring-teal-400" : "text-teal-600 focus:ring-teal-500"}`}
                    required={isRequired}
                  />
                  <span>Yes</span>
                </label>
                <label className={`flex items-center space-x-2 cursor-pointer ${isDarkMode ? "text-teal-300" : "text-teal-700"}`}>
                  <input
                    type="radio"
                    checked={answer === false}
                    onChange={() => handleAnswerChange(index, false)}
                    className={`cursor-pointer ${isDarkMode ? "text-teal-500 focus:ring-teal-400" : "text-teal-600 focus:ring-teal-500"}`}
                    required={isRequired}
                  />
                  <span>No</span>
                </label>
              </div>
            )
          ) : currentType === "Number" ? (
            <>
              <input
                ref={(el) => { if (el) inputRefs.current[index] = el; }}
                type="number"
                value={(userAnswers[primaryValue] as string) || ""}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                className={`mt-4 p-3 w-full rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDarkMode
                    ? `bg-gray-700/80 border ${error ? "border-red-400" : "border-teal-600"} focus:ring-teal-400 text-teal-200 placeholder-teal-300/70`
                    : `bg-white/80 border ${error ? "border-red-400" : "border-teal-200"} focus:ring-teal-500 text-teal-800 placeholder-teal-400/70`
                }`}
                placeholder="Enter a number"
                required={isRequired}
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </>
          ) : currentType === "Date" ? (
            <>
              <input
                ref={(el) => { if (el) inputRefs.current[index] = el; }}
                type="date"
                value={(userAnswers[primaryValue] as string) || ""}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                className={`mt-4 p-3 w-full rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDarkMode
                    ? `bg-gray-700/80 border ${error ? "border-red-400" : "border-teal-600"} focus:ring-teal-400 text-teal-200`
                    : `bg-white/80 border ${error ? "border-red-400" : "border-teal-200"} focus:ring-teal-500 text-teal-800`
                }`}
                placeholder="Select a date"
                required={isRequired}
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </>
          ) : currentType === "Email" ? (
            <>
              <input
                ref={(el) => { if (el) inputRefs.current[index] = el; }}
                type="email"
                value={(userAnswers[primaryValue] as string) || ""}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                className={`mt-4 p-3 w-full rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDarkMode
                    ? `bg-gray-700/80 border ${error ? "border-red-400" : "border-teal-600"} focus:ring-teal-400 text-teal-200 placeholder-teal-300/70`
                    : `bg-white/80 border ${error ? "border-red-400" : "border-teal-200"} focus:ring-teal-500 text-teal-800 placeholder-teal-400/70`
                }`}
                placeholder="Enter an email address"
                required={isRequired}
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </>
          ) : includeAdditional && currentType === "Text" ? (
            <>
              <input
                ref={(el) => { if (el) inputRefs.current[index] = el; }}
                type="text"
                value={(userAnswers[primaryValue] as string) || ""}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                className={`mt-4 p-3 w-full rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDarkMode
                    ? `bg-gray-700/80 border ${error ? "border-red-400" : "border-teal-600"} focus:ring-teal-400 text-teal-200 placeholder-teal-300/70`
                    : `bg-white/80 border ${error ? "border-red-400" : "border-teal-200"} focus:ring-teal-500 text-teal-800 placeholder-teal-400/70`
                }`}
                placeholder="Enter your answer"
                required={isRequired}
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </>
          ) : currentType === "Paragraph" ? (
            <>
              <textarea
                ref={(el) => { if (el) inputRefs.current[index] = el as any; }}
                value={(userAnswers[primaryValue] as string) || ""}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                className={`mt-4 p-3 w-full rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDarkMode
                    ? `bg-gray-700/80 border ${error ? "border-red-400" : "border-teal-600"} focus:ring-teal-400 text-teal-200 placeholder-teal-300/70`
                    : `bg-white/80 border ${error ? "border-red-400" : "border-teal-200"} focus:ring-teal-500 text-teal-800 placeholder-teal-400/70`
                }`}
                placeholder="Enter your answer"
                rows={3}
                required={isRequired}
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </>
          ) : (
            <>
            </>
          )}
          {isAdditionalLocationQuestion && 
          userAnswers["Does the employee need to work at additional locations besides the normal place of work?"] === true 
          && (
          <>
            {additionalLocations.map((location, idx) => (
              <div key={idx} className="mt-4">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    handleLocationChange(idx, newValue);
                    handleAnswerChange(index, newValue, undefined, true, idx + 1); 
                  }}
                  className={`mt-4 p-3 w-full rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
                    isDarkMode
                      ? "bg-gray-700/80 border border-teal-600 focus:ring-teal-400 text-teal-200 placeholder-teal-300/70"
                      : "bg-white/80 border border-teal-200 focus:ring-teal-500 text-teal-800 placeholder-teal-400/70"
                  }`}
                  placeholder="Enter additional location"
                  required={isRequired}
                />
              </div>
            ))}
            <div className="flex justify-end mt-4">
              <button
                className={`px-6 py-3 text-white rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 ${
                  isDarkMode ? "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800" : "bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-500 hover:to-cyan-500"
                }`}
                onClick={handleAddMore}
              >
                Add More Locations
              </button>
            </div>
          </>
        )}
        </div>
      </div>
    );
  };

  const handleFinish = () => {
    const hasErrors = Object.values(inputErrors).some(error => error !== "");
    if (hasErrors) {
      alert("Please correct all input errors before finishing.");
      return;
    }

    const unansweredRequiredFields = highlightedTexts
      .map((text, index) => {
        const { primaryValue } = determineQuestionType(text);
        const isRequired = requiredQuestions[index] || false;
        if (!primaryValue || !isRequired) return null;
        
        const answer = userAnswers[primaryValue];
        if (answer === null || answer === "" || (typeof answer === "object" && answer !== null && (!answer.amount || !answer.currency))) {
          return primaryValue;
        }
        return null;
      })
      .filter(Boolean);

    if (unansweredRequiredFields.length > 0) {
      alert(`Please answer all required questions: ${unansweredRequiredFields.join(", ")}`);
      return;
    }

    navigate("/Finish", { state: { userAnswers } });
  };

  const storedLevel = sessionStorage.getItem("level") ?? "/Level-Two-Part-Two";
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
        live_generation="/Live_Generation_2" 
        {...(storedLevel === "/Level-Three-Quiz" ? { calculations: "/Calculations" } : {})}
      />
      <div className="flex-grow flex items-center justify-center py-12 px-6">
        <div className="flex flex-row w-full max-w-7xl">
          <div
            className={`flex flex-col w-1/2 pl-4 pr-8 sticky top-12 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-xl shadow-lg border p-6 ${
              isDarkMode
                ? "bg-gradient-to-b from-gray-700/70 to-gray-800/70 border-gray-700/20"
                : "bg-gradient-to-b from-teal-50/50 to-cyan-50/50 border-teal-100/20"
            }`}
          >
            {highlightedTexts.length > 0 ? (
              <>
                <h2 className={`text-2xl font-semibold mb-6 tracking-wide ${isDarkMode ? "text-teal-300" : "text-teal-700"}`}>
                  Questions
                </h2>
                {highlightedTexts.map((_, index) => renderAnswerInput(index))}
                <div className="flex justify-end mt-8">
                  <button
                    className={`px-6 py-3 text-white rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 ${
                      isDarkMode
                        ? "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800"
                        : "bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-500 hover:to-cyan-500"
                    }`}
                    onClick={handleFinish}
                  >
                    Finish
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className={`text-lg font-medium ${isDarkMode ? "text-teal-300" : "text-teal-700"}`}>
                  No questions have been generated yet.
                </p>
                <p className={`text-sm mt-3 ${isDarkMode ? "text-teal-400" : "text-teal-500"}`}>
                  Please go to the Questionnaire tab, create or select questions from the Document tab, and then return here to answer them and generate a live document preview.
                </p>
              </div>
            )}
          </div>
          <div
            className={`w-1/2 pl-8 rounded-xl shadow-lg border ${
              isDarkMode
                ? "bg-gray-800/90 backdrop-blur-sm border-gray-700/20"
                : "bg-white/90 backdrop-blur-sm border-teal-100/20"
            }`}
          >
            <div className="mt-6 p-6">
              {parse(agreement, {
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
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Live_Generation_2;