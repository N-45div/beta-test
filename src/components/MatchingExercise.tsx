import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MatchingItem } from '../types';
import MatchLine from './MatchLine';

interface MatchingExerciseProps {
  data: MatchingItem[];
}

const MatchingExercise = ({ data }: MatchingExerciseProps) => {
  const [items, setItems] = useState<MatchingItem[]>([...data]);
  const [selectedTerm, setSelectedTerm] = useState<MatchingItem | null>(null);
  const [matches, setMatches] = useState<{ [key: string]: string }>({});
  const [lines, setLines] = useState<
    {
      startId: string;
      endId: string;
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      color: string;
    }[]
  >([]);
  const [showCompletion, setShowCompletion] = useState(false);

  const termRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const defRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const navigate = useNavigate();

  const handleTermClick = (item: MatchingItem) => {
    if (item.isMatched) return;
    setSelectedTerm((prev) => (prev?.id === item.id ? null : item));
  };

  const handleDefinitionClick = (item: MatchingItem) => {
    if (!selectedTerm || item.isMatched || Object.values(matches).includes(item.id)) return;
    if (matches[selectedTerm.id]) return;

    const isCorrectMatch = item.id === selectedTerm.id;
    const lineColor = isCorrectMatch ? '#10B981' : '#EF4444';

    const termElement = termRefs.current[selectedTerm.id];
    const defElement = defRefs.current[item.id];

    if (termElement && defElement) {
      const termRect = termElement.getBoundingClientRect();
      const defRect = defElement.getBoundingClientRect();
      const containerRect = document.querySelector('.matching-columns')?.getBoundingClientRect();

      if (containerRect) {
        setLines((prevLines) => {
          const newLines = prevLines.filter((line) => line.startId !== selectedTerm.id);
          return [
            ...newLines,
            {
              startId: selectedTerm.id,
              endId: item.id,
              startX: termRect.right - containerRect.left,
              startY: termRect.top + termRect.height / 2 - containerRect.top,
              endX: defRect.left - containerRect.left,
              endY: defRect.top + defRect.height / 2 - containerRect.top,
              color: lineColor,
            },
          ];
        });
      }
    }

    if (isCorrectMatch) {
      const updatedItems = items.map((i) =>
        i.id === item.id ? { ...i, isMatched: true } : i
      );
      setItems(updatedItems);
      setMatches((prev) => ({
        ...prev,
        [selectedTerm.id]: item.id,
      }));
    } else {
      setMatches((prev) => ({
        ...prev,
        [selectedTerm.id]: item.id,
      }));
    }

    setSelectedTerm(null);
  };

  const updateLines = useCallback(() => {
    setLines((prevLines) => {
      const newLines = prevLines.map((line) => {
        const termElement = termRefs.current[line.startId];
        const defElement = defRefs.current[line.endId];
        const containerRect = document.querySelector('.matching-columns')?.getBoundingClientRect();

        if (termElement && defElement && containerRect) {
          const termRect = termElement.getBoundingClientRect();
          const defRect = defElement.getBoundingClientRect();

          const newStartX = termRect.right - containerRect.left;
          const newStartY = termRect.top + termRect.height / 2 - containerRect.top;
          const newEndX = defRect.left - containerRect.left;
          const newEndY = defRect.top + defRect.height / 2 - containerRect.top;

          // Only update if coordinates have changed to avoid unnecessary re-renders
          if (
            newStartX !== line.startX ||
            newStartY !== line.startY ||
            newEndX !== line.endX ||
            newEndY !== line.endY
          ) {
            return {
              ...line,
              startX: newStartX,
              startY: newStartY,
              endX: newEndX,
              endY: newEndY,
            };
          }
        }
        return line;
      });

      // Only return newLines if they differ from prevLines to prevent infinite loop
      const hasChanged = newLines.some(
        (line, index) =>
          line.startX !== prevLines[index]?.startX ||
          line.startY !== prevLines[index]?.startY ||
          line.endX !== prevLines[index]?.endX ||
          line.endY !== prevLines[index]?.endY
      );

      return hasChanged ? newLines : prevLines;
    });
  }, []);

  useEffect(() => {
    // Debounce function to limit how often updateLines is called
    let timeoutId: NodeJS.Timeout;
    const debouncedUpdateLines = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateLines, 100); // Debounce by 100ms
    };

    window.addEventListener('resize', debouncedUpdateLines);
    window.addEventListener('scroll', debouncedUpdateLines);
    updateLines(); // Initial call

    return () => {
      window.removeEventListener('resize', debouncedUpdateLines);
      window.removeEventListener('scroll', debouncedUpdateLines);
      clearTimeout(timeoutId);
    };
  }, [updateLines]); // Depend on updateLines, which is memoized with useCallback

  const isComplete = items.every((item) => item.isMatched);

  useEffect(() => {
    if (isComplete && !showCompletion) {
      setShowCompletion(true);
    }
  }, [isComplete, showCompletion]);

  return (
    <div className="p-5 max-w-full mx-auto relative font-sans b-gray-50 rounded-2xl overflow-hidden transition-all duration-300 min-h-screen box-border sm:p-10 lg:max-w-6xl">
      <h1 className="text-center text-blue-600 text-2xl font-bold mb-8 drop-shadow-md transition-all sm:text-3xl lg:text-4xl lg:mb-12">
        Match the definitions with the correct jargons
      </h1>

      <div className="matching-columns flex justify-between items-start relative gap-5 mb-8 px-3 sm:gap-10 sm:px-5 lg:gap-16 lg:px-0">
        <div className="terms-column flex flex-col gap-4 w-full sm:w-1/2 lg:w-1/2 mt-10 sm:mt-12 lg:mt-16">
          {items.map((item) => (
            <div
              key={`term-${item.id}`}
              ref={(el: HTMLDivElement | null) => {
                termRefs.current[item.id] = el;
              }}
              className={`term-item bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold text-lg border-none min-h-[50px] w-full max-w-[300px] flex items-center justify-center rounded-2xl cursor-pointer transition-all duration-300 shadow-md hover:scale-105 hover:shadow-lg ${selectedTerm?.id === item.id ? 'ring-4 ring-blue-500/60 scale-105' : ''} ${item.isMatched ? 'bg-gradient-to-r from-green-600 to-blue-600 opacity-90' : ''} sm:text-xl sm:min-h-[60px] sm:max-w-[280px] lg:max-w-[300px]`}
              onClick={() => handleTermClick(item)}
            >
              {item.term}
            </div>
          ))}
        </div>

        <div className="definitions-column flex flex-col gap-4 w-full sm:w-1/2 lg:w-1/2">
          {items.map((item) => (
            <div
              key={`def-${item.id}`}
              ref={(el: HTMLDivElement | null) => {
                defRefs.current[item.id] = el;
              }}
              className={`definition-item bg-green-50 text-gray-700 border-2 border-green-200 text-sm leading-6 w-full max-w-[400px] p-4 text-left rounded-xl cursor-pointer transition-all duration-300 shadow-md hover:scale-102 hover:shadow-lg ${item.isMatched ? 'border-green-500 bg-green-100/50' : ''} sm:text-base sm:p-6 sm:max-w-[460px] lg:max-w-[500px]`}
              onClick={() => handleDefinitionClick(item)}
            >
              {item.definition}
            </div>
          ))}
        </div>

        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 sm:block hidden">
          {lines.map((line, index) => (
            <MatchLine
              key={`line-${index}`}
              startX={line.startX}
              startY={line.startY}
              endX={line.endX}
              endY={line.endY}
              color={line.color}
            />
          ))}
        </svg>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          className="px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition duration-300"
          onClick={() => navigate('/')}
        >
          Home
        </button>
      </div>
    </div>
  );
};

export default MatchingExercise;