import React, { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from "react-markdown";
import { Sparkles, FileText, Languages, Search, Wand2, Copy, Save } from "lucide-react";
import { VisualEffectType } from "../types";
import { cn } from "../lib/utils";

interface NoteKeeperProps {
  apiKey: string;
  onEffect: (type: VisualEffectType) => void;
}

export const NoteKeeper: React.FC<NoteKeeperProps> = ({ apiKey, onEffect }) => {
  const [content, setContent] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gemini-3-flash-preview");

  const runMagic = async (instruction: string) => {
    if (!apiKey || !content) return;
    setIsProcessing(true);
    onEffect("sparkle");

    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `${instruction}\n\n這是我目前的筆記內容：\n${content}`;
      
      const result = await ai.models.generateContent({
        model: selectedModel,
        contents: prompt
      });
      const text = result.text || "";
      setContent(text);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const magics = [
    { name: "法規預審", icon: Search, instr: "請扮演 TFDA 審查員，指出這份筆記中可能的法規漏洞。" },
    { name: "摘要精華", icon: FileText, instr: "請將這段內容濃縮成 3 個重點標記。" },
    { name: "專業英譯", icon: Languages, instr: "請將這段法規內容精準翻譯為英文，注意專業術語。" },
    { name: "格式美化", icon: Wand2, instr: "請將這段雜亂的文字轉化為乾淨的 Markdown 列表。" },
  ];

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black uppercase tracking-tighter">筆記助手 (Note Keeper)</h2>
        <div className="flex gap-2">
          <select 
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="text-[10px] font-bold uppercase border-2 border-black px-2 bg-white"
          >
            <option value="gemini-3-flash-preview">Gemini 3 Flash</option>
            <option value="gemini-3.1-flash-lite-preview">Gemini 3.1 Flash Lite</option>
            <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
          </select>
          <button className="p-2 border-2 border-black hover:bg-black hover:text-white transition-colors">
            <Save size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {magics.map((magic) => (
          <button
            key={magic.name}
            onClick={() => runMagic(magic.instr)}
            disabled={isProcessing || !content}
            className="flex flex-col items-center justify-center p-3 border-2 border-black bg-white hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <magic.icon size={20} className="mb-2 text-red-600" />
            <span className="text-[10px] font-bold">{magic.name}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4">
        <div className="relative group">
          <div className="absolute top-2 right-2 text-[10px] font-bold text-stone-300 pointer-events-none group-focus-within:opacity-0 transition-opacity">
            EDITING...
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="在此輸入您的專業意見或法規文件草稿..."
            className="w-full h-[500px] p-6 border-2 border-black font-serif text-lg leading-relaxed focus:outline-none bg-white resize-none"
          />
        </div>
        <div className="p-6 border-2 border-black bg-stone-50 overflow-auto h-[500px] prose prose-stone prose-sm">
          <div className="text-[10px] font-bold text-red-600 mb-4 border-b border-red-100 pb-2 flex items-center justify-between">
            <span>PREVIEW RENDERING</span>
            <button onClick={() => navigator.clipboard.writeText(content)} className="hover:text-black">
              <Copy size={12} />
            </button>
          </div>
          <ReactMarkdown>{content || "*預覽區域將在此顯示 Markdown 渲染結果*"}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
