import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface DiagramNodeProps {
  id: string;
  title: string;
  subtitle: string;
  bullets: string[];
  category: 'host' | 'service' | 'webview' | 'data' | 'assets';
  icon?: LucideIcon;
  x: number;
  y: number;
  width: number;
  height: number;
  isHighlighted?: boolean;
  isDimmed?: boolean;
  onClick?: () => void;
}

const categoryStyles = {
  host: {
    border: '#60A5FA',
    bg: 'rgba(96, 165, 250, 0.05)',
    glow: 'rgba(96, 165, 250, 0.3)',
  },
  service: {
    border: '#2DD4BF',
    bg: 'rgba(45, 212, 191, 0.05)',
    glow: 'rgba(45, 212, 191, 0.3)',
  },
  webview: {
    border: '#A78BFA',
    bg: 'rgba(167, 139, 250, 0.05)',
    glow: 'rgba(167, 139, 250, 0.3)',
  },
  data: {
    border: '#34D399',
    bg: 'rgba(52, 211, 153, 0.05)',
    glow: 'rgba(52, 211, 153, 0.3)',
  },
  assets: {
    border: '#A1A1AA',
    bg: 'rgba(161, 161, 170, 0.05)',
    glow: 'rgba(161, 161, 170, 0.3)',
  },
};

export function DiagramNode({
  id,
  title,
  subtitle,
  bullets,
  category,
  icon: Icon,
  x,
  y,
  width,
  height,
  isHighlighted = false,
  isDimmed = false,
  onClick,
}: DiagramNodeProps) {
  const style = categoryStyles[category];

  return (
    <motion.div
      id={id}
      className="absolute rounded-lg cursor-pointer backdrop-blur-sm"
      style={{
        left: x,
        top: y,
        width,
        minHeight: height,
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: style.border,
        backgroundColor: style.bg,
        boxShadow: isHighlighted
          ? `0 0 25px ${style.glow}, 0 8px 16px rgba(0, 0, 0, 0.6)`
          : '0 6px 14px rgba(0, 0, 0, 0.5)',
      }}
      animate={{
        opacity: isDimmed ? 0.3 : 1,
        scale: isHighlighted ? 1.03 : 1,
      }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      <div className="p-3">
        <div className="flex items-center gap-2 mb-1">
          {Icon && <Icon size={16} style={{ color: style.border }} />}
          <h3 style={{ color: style.border, fontSize: '14px', fontWeight: 700 }}>
            {title}
          </h3>
        </div>
        <p
          className="mb-2 uppercase tracking-wide"
          style={{ fontSize: '9px', color: '#94A3B8', fontWeight: 600 }}
        >
          {subtitle}
        </p>
        <ul className="space-y-0.5" style={{ fontSize: '11px', color: '#E2E8F0', lineHeight: '1.3' }}>
          {bullets.map((bullet, idx) => (
            <li key={idx} className="flex items-start">
              <span className="mr-1.5 opacity-60" style={{ color: style.border, fontSize: '10px' }}>•</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
