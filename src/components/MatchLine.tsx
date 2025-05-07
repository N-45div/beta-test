import { MatchLineProps } from '../types';

const MatchLine = ({ startX, startY, endX, endY, color }: MatchLineProps) => {
  const offset = 5;
  const adjustedStartX = startX + offset;
  const adjustedEndX = endX - offset;
  const midX = (adjustedStartX + adjustedEndX) / 2;
  const curveFactor = 0.3;
  const curveOffset = Math.abs(endY - startY) * curveFactor;

  return (
    <path
      d={`M${adjustedStartX},${startY} C${midX + curveOffset},${startY} ${midX - curveOffset},${endY} ${adjustedEndX},${endY}`}
      fill="none"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      style={{
        filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.1))`,
        animation: 'drawLine 0.6s ease-out forwards',
      }}
    />
  );
};

export default MatchLine;