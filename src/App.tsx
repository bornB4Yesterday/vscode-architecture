import React, { useState, useEffect } from 'react';
import { 
  Cpu, Play, Monitor, Code2, Database, FileCode, 
  Terminal, FolderTree, Workflow, Settings, 
  Boxes, Package, GitBranch, HardDrive, type LucideIcon 
} from 'lucide-react';
import { DiagramNode } from './components/DiagramNode';
import { Connector } from './components/Connector';
import { Legend } from './components/Legend';

interface NodeData {
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
}

interface ConnectorData {
  id: string;
  from: string;
  to: string;
  label: string;
  color: string;
  flowType: string;
  dashed?: boolean;
  offset: number;
}

// Routing rails configuration - optimized for new layout
const RAILS = {
  rightCorridor: 1100, // Main corridor for left-to-right connections
  leftServiceLane: 540, // Lane between service columns
  midLane: 750, // Middle vertical lane
  rightServiceLane: 1000, // Right side lane
  topBus: 800, // Bottom horizontal bus
};

export default function App() {
  const [activeFlowColor, setActiveFlowColor] = useState<string | null>(null);
  const [activeNodeType, setActiveNodeType] = useState<string | null>(null);
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set());
  const [isPlayingAll, setIsPlayingAll] = useState(false);

  // Node definitions - optimized layout to minimize overlaps
  const nodes: NodeData[] = [
    // Host
    {
      id: 'host',
      title: 'Extension Host',
      subtitle: 'Runtime',
      bullets: [
        'Activation & commands',
        'Webview management',
        'State persistence',
      ],
      category: 'host',
      icon: Cpu,
      x: 750,
      y: 100,
      width: 200,
      height: 95,
    },
    // Services - Left Column
    {
      id: 'activation',
      title: 'Activation',
      subtitle: 'Service',
      bullets: ['Commands', 'Tree views', 'Panels'],
      category: 'service',
      icon: Play,
      x: 50,
      y: 260,
      width: 180,
      height: 85,
    },
    {
      id: 'launcher',
      title: 'Webview Launcher',
      subtitle: 'Service',
      bullets: ['Opens webviews', 'Message bridge', 'Python wiring'],
      category: 'service',
      icon: Monitor,
      x: 50,
      y: 380,
      width: 180,
      height: 85,
    },
    {
      id: 'project-state',
      title: 'Project State',
      subtitle: 'Service',
      bullets: [
        'State management',
        'Cache & logs',
        'Resources',
      ],
      category: 'service',
      icon: FolderTree,
      x: 50,
      y: 500,
      width: 180,
      height: 85,
    },
    {
      id: 'workspace',
      title: 'Workspace',
      subtitle: 'Service',
      bullets: ['Root resolve', 'Validation', 'Artifacts'],
      category: 'service',
      icon: Boxes,
      x: 50,
      y: 620,
      width: 180,
      height: 85,
    },
    // Services - Middle Column
    {
      id: 'python-bridge',
      title: 'Python Bridge',
      subtitle: 'Service',
      bullets: ['Execute scripts', 'Live logs', 'Results'],
      category: 'service',
      icon: Code2,
      x: 270,
      y: 260,
      width: 180,
      height: 85,
    },
    {
      id: 'flow-io',
      title: 'Flow I/O',
      subtitle: 'Service',
      bullets: ['Load resources', 'Save flows', 'Resilient ops'],
      category: 'service',
      icon: Workflow,
      x: 270,
      y: 380,
      width: 180,
      height: 85,
    },
    {
      id: 'artifacts',
      title: 'Artifacts',
      subtitle: 'Service',
      bullets: ['Templates', 'Assets copy', 'Caching'],
      category: 'service',
      icon: Package,
      x: 270,
      y: 500,
      width: 180,
      height: 85,
    },
    {
      id: 'terminal',
      title: 'Terminal',
      subtitle: 'Service',
      bullets: ['Run commands', 'Integrated output'],
      category: 'service',
      icon: Terminal,
      x: 270,
      y: 620,
      width: 180,
      height: 85,
    },
    // Webviews - Right side
    {
      id: 'setup-webview',
      title: 'Project Setup',
      subtitle: 'Webview',
      bullets: ['Environment check', 'Templates', 'Commands'],
      category: 'webview',
      icon: Settings,
      x: 1300,
      y: 260,
      width: 180,
      height: 85,
    },
    {
      id: 'agent-webview',
      title: 'Agent Builder',
      subtitle: 'Webview',
      bullets: ['Design agents', 'State save', 'SDK ops'],
      category: 'webview',
      icon: GitBranch,
      x: 1300,
      y: 380,
      width: 180,
      height: 85,
    },
    {
      id: 'flow-webview',
      title: 'Flow Designer',
      subtitle: 'Webview',
      bullets: ['Graph editor', 'Resources', 'Flow save'],
      category: 'webview',
      icon: Workflow,
      x: 1300,
      y: 500,
      width: 180,
      height: 85,
    },
    // Data Layer - Bottom
    {
      id: 'workspace-data',
      title: 'Project State',
      subtitle: 'Data Layer',
      bullets: ['Agents & Flows', 'Caches & Logs', 'Scripts'],
      category: 'data',
      icon: Database,
      x: 50,
      y: 850,
      width: 400,
      height: 85,
    },
    // Assets - Bottom right
    {
      id: 'bundled-assets',
      title: 'Bundled Assets',
      subtitle: 'Resources',
      bullets: ['Templates', 'Web apps'],
      category: 'assets',
      icon: HardDrive,
      x: 1300,
      y: 850,
      width: 180,
      height: 85,
    },
  ];

  // Helper to get node center point
  const getNodeCenter = (nodeId: string): { x: number; y: number } => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return { x: 0, y: 0 };
    return {
      x: node.x + node.width / 2,
      y: node.y + node.height / 2,
    };
  };

  // Helper to get node edge point
  const getNodeEdge = (
    nodeId: string,
    side: 'left' | 'right' | 'top' | 'bottom'
  ): { x: number; y: number } => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return { x: 0, y: 0 };
    switch (side) {
      case 'left':
        return { x: node.x, y: node.y + node.height / 2 };
      case 'right':
        return { x: node.x + node.width, y: node.y + node.height / 2 };
      case 'top':
        return { x: node.x + node.width / 2, y: node.y };
      case 'bottom':
        return { x: node.x + node.width / 2, y: node.y + node.height };
    }
  };

  // Generate orthogonal paths with improved routing to minimize overlaps
  const generatePath = (
    fromId: string,
    toId: string,
    routeType: string,
    offset: number
  ): { x: number; y: number }[] => {
    const path: { x: number; y: number }[] = [];

    if (routeType === 'LR') {
      // Left to Right via corridor
      const from = getNodeEdge(fromId, 'right');
      const to = getNodeEdge(toId, 'left');
      const corridor = RAILS.rightCorridor + offset * 2;

      path.push(from);
      path.push({ x: from.x + 30, y: from.y });
      path.push({ x: from.x + 30, y: from.y + offset * 0.5 });
      path.push({ x: corridor, y: from.y + offset * 0.5 });
      path.push({ x: corridor, y: to.y });
      path.push({ x: to.x - 30, y: to.y });
      path.push(to);
    } else if (routeType === 'RL') {
      // Right to Left via corridor
      const from = getNodeEdge(fromId, 'left');
      const to = getNodeEdge(toId, 'right');
      const corridor = RAILS.rightServiceLane + offset * 2;

      path.push(from);
      path.push({ x: from.x - 30, y: from.y });
      path.push({ x: from.x - 30, y: from.y + offset * 0.5 });
      path.push({ x: corridor, y: from.y + offset * 0.5 });
      path.push({ x: corridor, y: to.y + offset * 0.5 });
      path.push({ x: to.x + 30, y: to.y + offset * 0.5 });
      path.push({ x: to.x + 30, y: to.y });
      path.push(to);
    } else if (routeType === 'DOWN_TO_WORKSPACE') {
      // From service down to data layer
      const from = getNodeEdge(fromId, 'bottom');
      const to = getNodeEdge(toId, 'top');
      const lane = from.x < 200 ? RAILS.leftServiceLane + offset * 12 : RAILS.leftServiceLane + 50 + offset * 12;

      path.push(from);
      path.push({ x: from.x, y: from.y + 25 });
      path.push({ x: lane, y: from.y + 25 });
      path.push({ x: lane, y: RAILS.topBus });
      path.push({ x: to.x + offset * 20, y: RAILS.topBus });
      path.push({ x: to.x + offset * 20, y: to.y - 20 });
      path.push({ x: to.x + offset * 20, y: to.y });
    } else if (routeType === 'RL_VIA_BUS') {
      // From right assets down to bus, left, then up to target
      const from = getNodeEdge(fromId, 'bottom');
      const to = getNodeEdge(toId, 'top');

      path.push(from);
      path.push({ x: from.x, y: from.y + 30 });
      path.push({ x: from.x - 20, y: from.y + 30 });
      path.push({ x: from.x - 20, y: RAILS.topBus + 60 });
      path.push({ x: to.x + 60, y: RAILS.topBus + 60 });
      path.push({ x: to.x + 60, y: to.y - 20 });
      path.push({ x: to.x, y: to.y - 20 });
      path.push(to);
    }

    return path;
  };

  // Connector definitions - optimized offsets to minimize overlaps
  const connectors: ConnectorData[] = [
    // Control (open webview & bridge) - sky
    {
      id: 'conn-launcher-setup',
      from: 'launcher',
      to: 'setup-webview',
      label: 'Open + bridge',
      color: '#38BDF8',
      flowType: 'sky',
      offset: -40,
    },
    {
      id: 'conn-launcher-agent',
      from: 'launcher',
      to: 'agent-webview',
      label: 'Open + bridge',
      color: '#38BDF8',
      flowType: 'sky',
      offset: 0,
    },
    {
      id: 'conn-launcher-flow',
      from: 'launcher',
      to: 'flow-webview',
      label: 'Open + bridge',
      color: '#38BDF8',
      flowType: 'sky',
      offset: 40,
    },
    // Python bridge calls - fuchsia
    {
      id: 'conn-python-setup',
      from: 'python-bridge',
      to: 'setup-webview',
      label: 'Python exec',
      color: '#E879F9',
      flowType: 'fuchsia',
      offset: -60,
    },
    {
      id: 'conn-python-agent',
      from: 'python-bridge',
      to: 'agent-webview',
      label: 'Python exec',
      color: '#E879F9',
      flowType: 'fuchsia',
      offset: -25,
    },
    {
      id: 'conn-python-flow',
      from: 'python-bridge',
      to: 'flow-webview',
      label: 'Python exec',
      color: '#E879F9',
      flowType: 'fuchsia',
      offset: 25,
    },
    // Flow data I/O - amber
    {
      id: 'conn-flowio-flowwebview',
      from: 'flow-io',
      to: 'flow-webview',
      label: 'Load/Save',
      color: '#F59E0B',
      flowType: 'amber',
      offset: 60,
    },
    // Terminal execution - cyan
    {
      id: 'conn-setup-terminal',
      from: 'setup-webview',
      to: 'terminal',
      label: 'Run cmd',
      color: '#67E8F9',
      flowType: 'cyan',
      offset: 30,
    },
    // Data persist/consume - emerald
    {
      id: 'conn-projectstate-workspace',
      from: 'project-state',
      to: 'workspace-data',
      label: 'Manage data',
      color: '#34D399',
      flowType: 'emerald',
      offset: -1,
    },
    {
      id: 'conn-artifacts-workspace',
      from: 'artifacts',
      to: 'workspace-data',
      label: 'Templates',
      color: '#34D399',
      flowType: 'emerald',
      offset: 0,
    },
    {
      id: 'conn-flowio-workspace',
      from: 'flow-io',
      to: 'workspace-data',
      label: 'Save flow',
      color: '#34D399',
      flowType: 'emerald',
      offset: 1,
    },
    // Asset supply (dashed) - gray
    {
      id: 'conn-assets-artifacts',
      from: 'bundled-assets',
      to: 'artifacts',
      label: 'Resources',
      color: '#9CA3AF',
      flowType: 'gray',
      dashed: true,
      offset: 0,
    },
  ];

  // Generate paths for all connectors
  const connectorsWithPaths = connectors.map((conn) => {
    let routeType = 'LR';
    if (conn.flowType === 'cyan') routeType = 'RL';
    else if (conn.flowType === 'emerald') routeType = 'DOWN_TO_WORKSPACE';
    else if (conn.flowType === 'gray') routeType = 'RL_VIA_BUS';

    return {
      ...conn,
      path: generatePath(conn.from, conn.to, routeType, conn.offset),
    };
  });

  // Handle legend clicks
  const handleFlowColorClick = (flowType: string) => {
    if (flowType === 'playAll') {
      playAllFlows();
      return;
    }

    if (activeFlowColor === flowType) {
      setActiveFlowColor(null);
      setHighlightedNodes(new Set());
    } else {
      setActiveFlowColor(flowType);
      
      // Highlight nodes involved in this flow
      const involvedNodes = new Set<string>();
      connectorsWithPaths
        .filter((c) => c.flowType === flowType)
        .forEach((c) => {
          involvedNodes.add(c.from);
          involvedNodes.add(c.to);
        });
      setHighlightedNodes(involvedNodes);
    }
  };

  const playAllFlows = async () => {
    const sequence = ['sky', 'fuchsia', 'amber', 'cyan', 'emerald', 'gray'];
    setIsPlayingAll(true);

    for (const flowType of sequence) {
      setActiveFlowColor(flowType);
      
      const involvedNodes = new Set<string>();
      connectorsWithPaths
        .filter((c) => c.flowType === flowType)
        .forEach((c) => {
          involvedNodes.add(c.from);
          involvedNodes.add(c.to);
        });
      setHighlightedNodes(involvedNodes);

      await new Promise((resolve) => setTimeout(resolve, 1800));
    }

    setActiveFlowColor(null);
    setHighlightedNodes(new Set());
    setIsPlayingAll(false);
  };

  const handleNodeClick = (nodeId: string) => {
    if (isPlayingAll) return;
    
    // Find all connectors involving this node
    const relatedConnectors = connectorsWithPaths.filter(
      (c) => c.from === nodeId || c.to === nodeId
    );
    
    if (relatedConnectors.length > 0) {
      const flowTypes = new Set(relatedConnectors.map((c) => c.flowType));
      // Highlight the first flow type for simplicity
      const flowType = Array.from(flowTypes)[0];
      handleFlowColorClick(flowType);
    }
  };

  return (
    <div
      className="relative overflow-auto"
      style={{
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(to bottom, #020617, #0a0a0a)',
      }}
    >
      <div
        className="relative"
        style={{
          width: '1600px',
          height: '1050px',
          margin: '20px auto',
          backgroundImage: `
            linear-gradient(rgba(100, 116, 139, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100, 116, 139, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      >
      {/* Title */}
      <div className="absolute top-2 left-8" style={{ zIndex: 10 }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#60A5FA', marginBottom: '2px', letterSpacing: '-0.02em' }}>
          VS Code Extension Architecture
        </h1>
        <p style={{ fontSize: '12px', color: '#94A3B8' }}>
          Interactive flow visualization
        </p>
      </div>

      {/* Legend */}
      <Legend
        onFlowColorClick={handleFlowColorClick}
        activeFlowColor={activeFlowColor}
        activeNodeType={activeNodeType}
      />

      {/* SVG Layer for Connectors */}
      <svg
        className="absolute inset-0"
        style={{
          width: '1600px',
          height: '1050px',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        {connectorsWithPaths.map((conn) => (
          <Connector
            key={conn.id}
            id={conn.id}
            path={conn.path}
            color={conn.color}
            label={conn.label}
            dashed={conn.dashed}
            flowType={conn.flowType}
            isHighlighted={activeFlowColor === conn.flowType}
            isDimmed={activeFlowColor !== null && activeFlowColor !== conn.flowType}
            isAnimating={activeFlowColor === conn.flowType}
          />
        ))}
      </svg>

      {/* Nodes Layer */}
      <div className="absolute inset-0" style={{ zIndex: 2 }}>
        {nodes.map((node) => (
          <DiagramNode
            key={node.id}
            id={node.id}
            title={node.title}
            subtitle={node.subtitle}
            bullets={node.bullets}
            category={node.category}
            icon={node.icon}
            x={node.x}
            y={node.y}
            width={node.width}
            height={node.height}
            isHighlighted={highlightedNodes.has(node.id)}
            isDimmed={
              highlightedNodes.size > 0 && !highlightedNodes.has(node.id)
            }
            onClick={() => handleNodeClick(node.id)}
          />
        ))}
      </div>
      </div>
    </div>
  );
}
