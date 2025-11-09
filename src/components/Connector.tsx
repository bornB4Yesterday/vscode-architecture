import React from 'react';
import { motion } from 'motion/react';

interface Point {
  x: number;
  y: number;
}

interface ConnectorProps {
  id: string;
  path: Point[];
  color: string;
  label: string;
  dashed?: boolean;
  isHighlighted?: boolean;
  isDimmed?: boolean;
  isAnimating?: boolean;
  flowType?: string;
}

export function Connector({
  id,
  path,
  color,
  label,
  dashed = false,
  isHighlighted = false,
  isDimmed = false,
  isAnimating = false,
  flowType = 'default',
}: ConnectorProps) {
  // Different animation speeds for different flow types
  const animationDuration = {
    sky: 2.0,
    fuchsia: 2.5,
    amber: 1.8,
    cyan: 2.2,
    emerald: 2.8,
    gray: 3.0,
    default: 2.0,
  }[flowType] || 2.0;
  // Build SVG path from points
  const pathD = path.reduce((acc, point, idx) => {
    if (idx === 0) return `M ${point.x} ${point.y}`;
    return `${acc} L ${point.x} ${point.y}`;
  }, '');

  // Calculate label position (midpoint of path) - use a point further along for better visibility
  const midIdx = Math.floor(path.length * 0.6);
  const labelPos = path[midIdx] || path[Math.floor(path.length / 2)] || path[0];

  // Calculate arrow position (last segment)
  const lastPoint = path[path.length - 1];
  const prevPoint = path[path.length - 2] || path[path.length - 1];
  
  // Arrow angle based on direction
  const dx = lastPoint.x - prevPoint.x;
  const dy = lastPoint.y - prevPoint.y;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  const strokeWidth = isHighlighted ? 5 : 2.5;
  const opacity = isDimmed ? 0.25 : 0.85;
  const glowColor = isHighlighted ? color : 'transparent';

  return (
    <g id={id} style={{ pointerEvents: 'none' }}>
      {/* Glow effect when highlighted */}
      {isHighlighted && (
        <motion.path
          d={pathD}
          fill="none"
          stroke={glowColor}
          strokeWidth={8}
          opacity={0.4}
          strokeDasharray={dashed ? '6 4' : undefined}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 0.2 }}
        />
      )}
      
      {/* Main path - always animating */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={dashed ? '8 6' : '10 5'}
        opacity={opacity}
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{
          strokeWidth,
          opacity,
          strokeDashoffset: [0, -30],
        }}
        transition={{
          strokeWidth: { duration: 0.2 },
          opacity: { duration: 0.2 },
          strokeDashoffset: {
            duration: animationDuration,
            repeat: Infinity,
            ease: 'linear',
          },
        }}
      />

      {/* Arrowhead */}
      <motion.polygon
        points="0,-4 8,0 0,4"
        fill={color}
        opacity={opacity}
        transform={`translate(${lastPoint.x}, ${lastPoint.y}) rotate(${angle})`}
        animate={{ opacity }}
        transition={{ duration: 0.2 }}
      />

      {/* Label */}
      <motion.g
        transform={`translate(${labelPos.x}, ${labelPos.y})`}
        opacity={isHighlighted ? 1 : 0.7}
        animate={{ opacity: isHighlighted ? 1 : 0.7 }}
        transition={{ duration: 0.2 }}
      >
        <rect
          x={-50}
          y={-11}
          width={100}
          height={22}
          rx={11}
          fill="rgba(0, 0, 0, 0.9)"
          stroke={color}
          strokeWidth={1}
        />
        <text
          x={0}
          y={4}
          textAnchor="middle"
          fill={color}
          style={{ fontSize: '10px', fontWeight: 600 }}
        >
          {label}
        </text>
      </motion.g>
    </g>
  );
}
