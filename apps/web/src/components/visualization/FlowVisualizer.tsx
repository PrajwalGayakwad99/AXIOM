// PATH: src/components/visualization/FlowVisualizer.tsx
"use client";

import { useCallback, useMemo, useState } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Handle,
  Position,
  BackgroundVariant,
  type NodeProps,
} from "reactflow";
import "reactflow/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  SkipForward,
  RotateCcw,
  ChevronDown,
  Pause,
  Maximize2,
  Minimize2,
} from "lucide-react";

// ─────────────────────────────────────────────
// Custom Node Components
// ─────────────────────────────────────────────

function ValueNode({ data }: NodeProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`px-4 py-2 rounded-xl border text-sm font-mono shadow-lg transition-all duration-300 ${
        data.highlighted
          ? "bg-brand-blue/20 border-brand-blue/50 text-brand-blue shadow-brand-blue/20"
          : data.comparing
            ? "bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-amber-500/20"
            : data.sorted
              ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-emerald-500/20"
              : "bg-white/5 border-white/10 text-white"
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-brand-blue/50 !border-brand-blue/30 !w-2 !h-2"
      />
      <div className="flex items-center gap-2">
        {data.icon && <span className="text-xs">{data.icon}</span>}
        <span className="font-semibold">{data.label}</span>
        {data.index !== undefined && (
          <span className="text-[9px] text-muted-foreground/50 ml-1">
            [{data.index}]
          </span>
        )}
      </div>
      {data.sublabel && (
        <p className="text-[10px] text-muted-foreground/60 mt-0.5">
          {data.sublabel}
        </p>
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-brand-purple/50 !border-brand-purple/30 !w-2 !h-2"
      />
    </motion.div>
  );
}

function TreeNode({ data }: NodeProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-mono font-bold text-sm shadow-lg transition-all duration-300 ${
        data.highlighted
          ? "bg-brand-blue/20 border-brand-blue text-brand-blue shadow-brand-blue/30"
          : data.visiting
            ? "bg-amber-500/20 border-amber-500 text-amber-400 shadow-amber-500/20 animate-pulse"
            : data.visited
              ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
              : "bg-white/5 border-white/10 text-white"
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-transparent !border-0 !w-0"
      />
      {data.label}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-transparent !border-0 !w-0"
      />
    </motion.div>
  );
}

function StackNode({ data }: NodeProps) {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      className={`w-24 py-2 rounded-lg border text-center text-sm font-mono transition-all duration-300 ${
        data.isTop
          ? "bg-brand-blue/20 border-brand-blue/50 text-brand-blue"
          : "bg-white/5 border-white/10 text-white"
      }`}
    >
      {data.label}
    </motion.div>
  );
}

// Register node types
const nodeTypes = {
  valueNode: ValueNode,
  treeNode: TreeNode,
  stackNode: StackNode,
};

// ─────────────────────────────────────────────
// Preset Visualizations
// ─────────────────────────────────────────────

export interface PresetVisualization {
  id: string;
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
}

// Example: Linked List
function createLinkedListPreset(values: number[]): PresetVisualization {
  const nodes: Node[] = values.map((val, i) => ({
    id: `node-${i}`,
    type: "valueNode",
    position: { x: i * 160, y: 100 },
    data: { label: String(val), index: i },
  }));

  const edges: Edge[] = values.slice(0, -1).map((_, i) => ({
    id: `edge-${i}`,
    source: `node-${i}`,
    target: `node-${i + 1}`,
    animated: true,
    style: { stroke: "#3B82F6", strokeWidth: 2 },
  }));

  return {
    id: "linked-list",
    name: "Linked List",
    description: "Singly linked list traversal",
    nodes,
    edges,
  };
}

// Example: Binary Tree
function createBinaryTreePreset(): PresetVisualization {
  const nodes: Node[] = [
    { id: "1", type: "treeNode", position: { x: 250, y: 0 }, data: { label: "8" } },
    { id: "2", type: "treeNode", position: { x: 125, y: 80 }, data: { label: "4" } },
    { id: "3", type: "treeNode", position: { x: 375, y: 80 }, data: { label: "12" } },
    { id: "4", type: "treeNode", position: { x: 60, y: 160 }, data: { label: "2" } },
    { id: "5", type: "treeNode", position: { x: 190, y: 160 }, data: { label: "6" } },
    { id: "6", type: "treeNode", position: { x: 310, y: 160 }, data: { label: "10" } },
    { id: "7", type: "treeNode", position: { x: 440, y: 160 }, data: { label: "14" } },
  ];

  const edges: Edge[] = [
    { id: "e1-2", source: "1", target: "2", style: { stroke: "#8B5CF6", strokeWidth: 2 } },
    { id: "e1-3", source: "1", target: "3", style: { stroke: "#8B5CF6", strokeWidth: 2 } },
    { id: "e2-4", source: "2", target: "4", style: { stroke: "#8B5CF6", strokeWidth: 2 } },
    { id: "e2-5", source: "2", target: "5", style: { stroke: "#8B5CF6", strokeWidth: 2 } },
    { id: "e3-6", source: "3", target: "6", style: { stroke: "#8B5CF6", strokeWidth: 2 } },
    { id: "e3-7", source: "3", target: "7", style: { stroke: "#8B5CF6", strokeWidth: 2 } },
  ];

  return {
    id: "binary-tree",
    name: "Binary Search Tree",
    description: "BST with inorder traversal",
    nodes,
    edges,
  };
}

// Example: Array Sort
function createArrayPreset(values: number[]): PresetVisualization {
  const nodes: Node[] = values.map((val, i) => ({
    id: `arr-${i}`,
    type: "valueNode",
    position: { x: i * 100, y: 100 },
    data: { label: String(val), index: i },
  }));

  return {
    id: "array",
    name: "Array",
    description: "Array visualization for sorting",
    nodes,
    edges: [],
  };
}

// Built-in presets
const PRESETS: PresetVisualization[] = [
  createLinkedListPreset([3, 7, 1, 9, 4]),
  createBinaryTreePreset(),
  createArrayPreset([38, 27, 43, 3, 9, 82, 10]),
];

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────

interface FlowVisualizerProps {
  /** Provide custom nodes & edges */
  initialNodes?: Node[];
  initialEdges?: Edge[];
  /** Or use a preset */
  preset?: string;
  /** Height */
  height?: string | number;
  /** Show control panel */
  showControls?: boolean;
  /** Show preset selector */
  showPresets?: boolean;
  /** Custom class name */
  className?: string;
  /** Called when nodes change */
  onNodesChange?: (nodes: Node[]) => void;
  /** Callback for animation step */
  onStep?: (step: number) => void;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export function FlowVisualizer({
  initialNodes,
  initialEdges,
  preset = "binary-tree",
  height = 400,
  showControls = true,
  showPresets = true,
  className = "",
  onNodesChange: onNodesChangeCallback,
  onStep,
}: FlowVisualizerProps) {
  // Find preset
  const selectedPreset = useMemo(
    () => PRESETS.find((p) => p.id === preset) || PRESETS[1],
    [preset]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(
    initialNodes || selectedPreset.nodes
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    initialEdges || selectedPreset.edges
  );

  const [currentPreset, setCurrentPreset] = useState(preset);
  const [showPresetMenu, setShowPresetMenu] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Handle new connections
  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            animated: true,
            style: { stroke: "#3B82F6", strokeWidth: 2 },
          },
          eds
        )
      ),
    [setEdges]
  );

  // Load preset
  const loadPreset = useCallback(
    (presetId: string) => {
      const p = PRESETS.find((pr) => pr.id === presetId);
      if (p) {
        setNodes(p.nodes);
        setEdges(p.edges);
        setCurrentPreset(presetId);
        setStep(0);
        setIsPlaying(false);
      }
      setShowPresetMenu(false);
    },
    [setNodes, setEdges]
  );

  // Highlight a node (simulation step)
  const highlightNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          data: {
            ...n.data,
            highlighted: n.id === nodeId,
            visiting: n.id === nodeId,
          },
        }))
      );
    },
    [setNodes]
  );

  // Step through animation
  const handleStep = useCallback(() => {
    const nextStep = step + 1;
    if (nextStep < nodes.length) {
      highlightNode(nodes[nextStep].id);
      setStep(nextStep);
      onStep?.(nextStep);
    }
  }, [step, nodes, highlightNode, onStep]);

  // Reset
  const handleReset = useCallback(() => {
    loadPreset(currentPreset);
  }, [currentPreset, loadPreset]);

  const currentPresetObj = PRESETS.find((p) => p.id === currentPreset);

  return (
    <div
      className={`flex flex-col glass-card overflow-hidden ${
        isFullscreen ? "fixed inset-0 z-50" : ""
      } ${className}`}
    >
      {/* Toolbar */}
      {showControls && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
          <div className="flex items-center gap-3">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              Visualizer
            </h3>

            {/* Preset selector */}
            {showPresets && (
              <div className="relative">
                <button
                  onClick={() => setShowPresetMenu((v) => !v)}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors text-xs text-muted-foreground hover:text-white"
                >
                  <span>{currentPresetObj?.name || "Select"}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                <AnimatePresence>
                  {showPresetMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-20"
                        onClick={() => setShowPresetMenu(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.96 }}
                        transition={{ duration: 0.12 }}
                        className="absolute top-full mt-1 left-0 z-30 w-48 rounded-xl border border-white/10 bg-[#13131D]/95 backdrop-blur-xl shadow-2xl overflow-hidden"
                      >
                        {PRESETS.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => loadPreset(p.id)}
                            className={`flex flex-col w-full px-3 py-2 text-left transition-colors ${
                              p.id === currentPreset
                                ? "bg-brand-blue/10"
                                : "hover:bg-white/5"
                            }`}
                          >
                            <span
                              className={`text-xs font-medium ${
                                p.id === currentPreset
                                  ? "text-brand-blue"
                                  : "text-white"
                              }`}
                            >
                              {p.name}
                            </span>
                            <span className="text-[9px] text-muted-foreground/60">
                              {p.description}
                            </span>
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Playback controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-1.5 rounded-lg transition-colors ${
                isPlaying
                  ? "bg-amber-500/20 text-amber-400"
                  : "bg-white/5 text-muted-foreground hover:text-white"
              }`}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={handleStep}
              className="p-1.5 rounded-lg bg-white/5 text-muted-foreground hover:text-white transition-colors"
              title="Step"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg bg-white/5 text-muted-foreground hover:text-white transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-4 bg-white/5 mx-1" />
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg bg-white/5 text-muted-foreground hover:text-white transition-colors"
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Step counter */}
            <span className="text-[10px] text-muted-foreground/50 ml-2 font-mono">
              Step {step}/{nodes.length}
            </span>
          </div>
        </div>
      )}

      {/* React Flow Canvas */}
      <div
        style={{
          height: isFullscreen ? "100%" : typeof height === "number" ? `${height}px` : height,
        }}
        className="flex-1"
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          proOptions={{ hideAttribution: true }}
          style={{ background: "transparent" }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="rgba(255,255,255,0.03)"
          />
          <Controls
            showZoom={true}
            showFitView={true}
            showInteractive={false}
            className="!bg-[#13131D] !border-white/10 !shadow-xl [&>button]:!bg-white/5 [&>button]:!border-white/5 [&>button]:!text-white [&>button:hover]:!bg-white/10"
          />
          <MiniMap
            nodeColor={(n) =>
              n.data?.highlighted
                ? "#3B82F6"
                : n.data?.sorted
                  ? "#10B981"
                  : "#374151"
            }
            maskColor="rgba(0,0,0,0.7)"
            className="!bg-[#0D0D14] !border-white/5"
            pannable
            zoomable
          />
        </ReactFlow>
      </div>
    </div>
  );
}

// Export presets for external use
export { PRESETS, createLinkedListPreset, createBinaryTreePreset, createArrayPreset };
