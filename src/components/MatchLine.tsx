import { MatchLineProps } from '../types';

const MatchLine = ({ startX, startY, endX, endY, color }: MatchLineProps) => {
  // Add offsets to start and end points to ensure the line doesn't touch or overlap the boxes
  const offset = 100; // Increased offset to ensure the line clears the box edges
  const adjustedStartX = startX - offset; // Start outside the left box (to the left)
  const adjustedEndX = endX - offset; // End outside the right box (pull back to the left)

  const midX = (adjustedStartX + adjustedEndX) / 2;
  const curveFactor = 0.3;
  const curveOffset = Math.abs(endY - startY) * curveFactor;

  return (
    <svg 
      className="matching-lines-container"
    >
      <path
        d={`M${adjustedStartX},${startY} C${midX + curveOffset},${startY} ${midX - curveOffset},${endY} ${adjustedEndX},${endY}`}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        style={{
          filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.1))`,
          animation: 'drawLine 0.6s ease-out forwards'
        }}
      />
    </svg>
  );
};

export default MatchLine;