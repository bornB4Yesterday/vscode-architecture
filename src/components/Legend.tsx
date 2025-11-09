import React from 'react';
import { motion } from 'motion/react';

interface LegendProps {
  onNodeTypeClick?: (type: string) => void;
  onFlowColorClick?: (flow: string) => void;
  activeNodeType?: string | null;
  activeFlowColor?: string | null;
}

const nodeTypes = [
  { label: 'Host', color: '#60A5FA' },
  { label: 'Services', color: '#2DD4BF' },
  { label: 'Webviews', color: '#A78BFA' },
  { label: 'Data', color: '#34D399' },
  { label: 'Assets', color: '#A1A1AA' },
];

const flowColors = [
  { label: 'Control', color: '#38BDF8', key: 'sky' },
  { label: 'Python', color: '#E879F9', key: 'fuchsia' },
  { label: 'Flow I/O', color: '#F59E0B', key: 'amber' },
  { label: 'Terminal', color: '#67E8F9', key: 'cyan' },
  { label: 'Data Persist', color: '#34D399', key: 'emerald' },
  { label: 'Assets', color: '#9CA3AF', key: 'gray' },
];

export function Legend({
  onNodeTypeClick,
  onFlowColorClick,
  activeNodeType,
  activeFlowColor,
}: LegendProps) {
  return (
    <>
      {/* Horizontal Legend at Top */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 flex items-center gap-6" style={{ zIndex: 10 }}>
        {/* Node Types */}
        <div
          className="px-4 py-2 rounded-lg"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          <h4 className="mb-1.5 uppercase tracking-wide" style={{ fontSize: '9px', color: '#94A3B8' }}>
            Nodes
          </h4>
          <div className="flex items-center gap-3">
            {nodeTypes.map((type) => (
              <motion.div
                key={type.label}
                className="flex items-center gap-1.5 cursor-pointer"
                onClick={() => onNodeTypeClick?.(type.label)}
                whileHover={{ scale: 1.05 }}
                animate={{
                  opacity: !activeNodeType || activeNodeType === type.label ? 1 : 0.4,
                }}
              >
                <div
                  className="w-2.5 h-2.5 rounded"
                  style={{
                    backgroundColor: type.color,
                    boxShadow: activeNodeType === type.label ? `0 0 6px ${type.color}` : 'none',
                  }}
                />
                <span style={{ fontSize: '10px', color: '#E2E8F0' }}>{type.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Flow Colors */}
        <div
          className="px-4 py-2 rounded-lg"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          <h4 className="mb-1.5 uppercase tracking-wide" style={{ fontSize: '9px', color: '#94A3B8' }}>
            Flows
          </h4>
          <div className="flex items-center gap-3">
            {flowColors.map((flow) => (
              <motion.div
                key={flow.key}
                className="flex items-center gap-1.5 cursor-pointer"
                onClick={() => onFlowColorClick?.(flow.key)}
                whileHover={{ scale: 1.05 }}
                animate={{
                  opacity: !activeFlowColor || activeFlowColor === flow.key ? 1 : 0.4,
                }}
              >
                <div
                  className="w-5 h-0.5 rounded"
                  style={{
                    backgroundColor: flow.color,
                    boxShadow: activeFlowColor === flow.key ? `0 0 6px ${flow.color}` : 'none',
                  }}
                />
                <span style={{ fontSize: '10px', color: '#E2E8F0' }}>{flow.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Play All Button - Top Right */}
      <motion.button
        className="absolute top-16 right-8 px-4 py-2 rounded-lg uppercase tracking-wide"
        style={{
          backgroundColor: 'rgba(59, 130, 246, 0.25)',
          border: '1.5px solid #3B82F6',
          color: '#60A5FA',
          fontSize: '11px',
          fontWeight: 600,
          zIndex: 10,
        }}
        whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.4)' }}
        whileTap={{ scale: 0.97 }}
        onClick={() => onFlowColorClick?.('playAll')}
      >
        ▶ Play All Flows
      </motion.button>
    </>
  );
}
