import React, { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from "motion/react";
import { AgentNode, VisualEffectType } from "../types";
import { Play, Plus, X, ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";

interface AgentChainProps {
  apiKey: string;
  onEffect: (type: VisualEffectType) => void;
}

export const AgentChain: React.FC<AgentChainProps> = ({ apiKey, onEffect }) => {
  const [nodes, setNodes] = useState<AgentNode[]>([
    {
      id: "1",
      name: "法規分析員",
      role: "法規審計",
      prompt: "請分析以下技術文件內容，檢查是否符合 TFDA 基本要求：",
      model: "gemini-3-flash-preview",
      status: "idle",
    }
  ]);
  const [inputText, setInputText] = useState("");

  const addNode = () => {
    setNodes([...nodes, {
      id: Date.now().toString(),
      name: `代理人 ${nodes.length + 1}`,
      role: "自定義",
      prompt: "請延續上一個步驟的內容：",
      model: "gemini-3-flash-preview",
      status: "idle",
    }]);
  };

  const removeNode = (id: string) => {
    setNodes(nodes.filter(n => n.id !== id));
  };

  const updateNode = (id: string, updates: Partial<AgentNode>) => {
    setNodes(nodes.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const runChain = async () => {
    if (!apiKey || !inputText) return;
    const ai = new GoogleGenAI({ apiKey });
    let currentContext = inputText;

    onEffect(["ripple", "glitch", "scanline", "sparkle", "shockwave", "datastream"][Math.floor(Math.random() * 6)] as VisualEffectType);

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      updateNode(node.id, { status: "running" });

      try {
        const result = await ai.models.generateContent({
          model: node.model,
          contents: `${node.prompt}\n\n上下文內容：\n${currentContext}`
        });
        const text = result.text || "無回應內容";
        
        currentContext = text;
        updateNode(node.id, { output: text, status: "completed" });
      } catch (error) {
        console.error(error);
        updateNode(node.id, { status: "error" });
        break;
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black uppercase tracking-tighter">AI 代理連鎖 (Agent Chain)</h2>
        <div className="flex gap-2">
          <button onClick={addNode} className="p-2 border-2 border-black hover:bg-black hover:text-white transition-colors">
            <Plus size={20} />
          </button>
          <button 
            onClick={runChain}
            disabled={!inputText || !apiKey}
            className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white font-bold border-2 border-black disabled:opacity-50"
          >
            <Play size={18} /> 啟動鏈結
          </button>
        </div>
      </div>

      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="在此輸入原始文件內容或法規爭議點..."
        className="w-full h-32 p-4 border-2 border-black font-mono resize-none focus:outline-none bg-stone-50"
      />

      <div className="space-y-4">
        <AnimatePresence>
          {nodes.map((node, index) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "p-4 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                node.status === "running" && "animate-pulse border-red-600"
              )}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase block mb-1">代理人名稱</label>
                    <input
                      value={node.name}
                      onChange={(e) => updateNode(node.id, { name: e.target.value })}
                      className="w-full border-b border-black text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase block mb-1">AI 模型</label>
                    <select
                      value={node.model}
                      onChange={(e) => updateNode(node.id, { model: e.target.value })}
                      className="w-full border-b border-black text-sm focus:outline-none bg-transparent"
                    >
                      <option value="gemini-3-flash-preview">Gemini 3 Flash</option>
                      <option value="gemini-3.1-flash-lite-preview">Gemini 3.1 Flash Lite</option>
                      <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                    </select>
                  </div>
                </div>
                <button onClick={() => removeNode(node.id)} className="text-stone-400 hover:text-red-600">
                  <X size={18} />
                </button>
              </div>

              <div className="mb-4">
                <label className="text-[10px] font-bold uppercase block mb-1">判定指令 (Prompt)</label>
                <textarea
                  value={node.prompt}
                  onChange={(e) => updateNode(node.id, { prompt: e.target.value })}
                  className="w-full h-16 border border-black/10 p-2 text-xs font-mono focus:outline-none resize-none"
                />
              </div>

              {node.output && (
                <div className="bg-stone-50 p-3 border border-black/5 text-sm whitespace-pre-wrap font-serif">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-red-600 mb-2 border-b border-red-100 pb-1">
                    <ChevronRight size={12} /> PROCESSED OUTPUT
                  </div>
                  {node.output}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
