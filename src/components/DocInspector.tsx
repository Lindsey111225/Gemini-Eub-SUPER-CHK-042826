import React, { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from "react-markdown";
import { FileUp, Search, Wand2, CheckCircle, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { VisualEffectType } from "../types";
import { cn } from "../lib/utils";

interface DocInspectorProps {
  apiKey: string;
  onEffect: (type: VisualEffectType) => void;
  advancedRules: any;
  lang: "ZH" | "EN";
}

export const DocInspector: React.FC<DocInspectorProps> = ({ apiKey, onEffect, advancedRules, lang }) => {
  const [content, setContent] = useState("");
  const [selectedType, setSelectedType] = useState("AUTO");
  const [report, setReport] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const docTypes = [
    { id: "AUTO", name: lang === "ZH" ? "AI 自動判定" : "AI AUTO-DETECT" },
    { id: "D4", name: "產地證明 (FSC/CFS)" },
    { id: "D5", name: "授權書 (LOA)" },
    { id: "D11", name: "技術文件摘要 (STED)" },
    { id: "D22", name: "軟體確效報告" },
  ];

  const handleInspect = async () => {
    if (!apiKey || !content) return;
    setIsAnalyzing(true);
    onEffect("scanline");

    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
        你是一位專業的 TFDA 醫療器材法規審核專家。
        請針對使用者提供的文件內容，執行以下任務：
        
        1. **文件分類判定**: 如果使用者選擇 AUTO，請根據內容判定這是哪一種文件代碼 (例如 D4, D5...)。
        2. **深度邏輯衝突檢查**: 根據以下引進的判斷規則 JSON 進行嚴格校核。你必須核對文中的日期、地址、公司名稱是否滿足規則中的邏輯要求：
           ${JSON.stringify(advancedRules, null, 2)}
        
        3. **生成超長詳細報告**: 請以繁體中文撰寫一份約 3000 字的「智慧審核綜合報告」。
           報告內容必須深度解析，包含：
           - 文件基本資訊摘要 (包含簽署日期、效期、原廠名稱、地址、代理商名稱、風險等級等事實事實分析)
           - 法規符合性檢查結果 (條列式，逐一對應上述 JSON 規則進行詳盡分析)
           - 潛在衝突與缺漏警示 (明確標註對應規則 ID 如 C01, C03 等，並解釋原因)
           - 審閱建議與下一步行動方案 (針對缺失提供具體的補正建議)
           
        為了達到字數要求，請對每一項細節進行法規面與實務面的深度剖析，並說明該文件在 TFDA 審送過程中的關鍵重要性。
        
        待檢查內容：
        ${content}
        
        所選類別: ${selectedType}
      `;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });

      setReport(result.text || "");
      onEffect("sparkle");
    } catch (error) {
      console.error(error);
      setReport("## 審核失敗\n無法讀取文件或 AI 服務暫時不可用。");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b-4 border-black pb-4">
        <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
          <Sparkles className="text-red-600" /> 文件衝突判定引擎
        </h2>
        <div className="flex gap-2">
            <select 
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="p-2 border-2 border-black font-bold text-xs bg-white focus:outline-none"
            >
                {docTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <button 
                onClick={handleInspect}
                disabled={isAnalyzing || !content}
                className="flex items-center gap-2 px-8 py-2 bg-black text-white font-bold border-2 border-black hover:bg-stone-800 disabled:opacity-50 transition-all"
            >
                {isAnalyzing ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                {lang === "ZH" ? "執行判定" : "EXECUTE"}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-stone-400">文件輸入區 (貼上內容或上傳)</label>
            <div className="relative group h-[600px] border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="請在此貼上產地證明、授權書或技術文件的文字內容..."
                    className="w-full h-full p-6 font-serif resize-none focus:outline-none leading-relaxed"
                />
                <label className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 border border-black bg-stone-100 hover:bg-stone-200 cursor-pointer transition-colors">
                    <FileUp size={16} />
                    <span className="text-[10px] font-bold">上傳 TXT/MD</span>
                    <input 
                        type="file" 
                        className="hidden" 
                        accept=".txt,.md" 
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = (v) => setContent(v.target?.result as string);
                                reader.readAsText(file);
                            }
                        }}
                    />
                </label>
            </div>
        </div>

        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-stone-400">審核結果報告 (Report Rendering)</label>
            <div className="h-[600px] border-2 border-black bg-stone-50 p-8 overflow-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] prose prose-stone max-w-none">
                {report ? (
                    <ReactMarkdown>{report}</ReactMarkdown>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-stone-300">
                        <Wand2 size={48} className="mb-4 opacity-20" />
                        <p className="font-serif italic">請執行判定以產生法規審核報告</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
