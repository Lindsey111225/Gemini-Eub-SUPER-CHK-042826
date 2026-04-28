import React, { useState } from "react";
import { Download, Upload, Save, FileJson, Trash2 } from "lucide-react";
import { MdPassRules } from "../types";
import { cn } from "../lib/utils";

interface RulesManagerProps {
  rules: any;
  onUpdate: (newRules: any) => void;
  lang: "ZH" | "EN";
  filename: string;
  title: string;
}

export const RulesManager: React.FC<RulesManagerProps> = ({ rules, onUpdate, lang, filename, title }) => {
  const [editingJson, setEditingJson] = useState(JSON.stringify(rules, null, 2));

  // Sync state if prop changes (important when switching between sets)
  React.useEffect(() => {
    setEditingJson(JSON.stringify(rules, null, 2));
  }, [rules]);

  const handleDownload = () => {
    const blob = new Blob([editingJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const json = JSON.parse(ev.target?.result as string);
        onUpdate(json);
        setEditingJson(JSON.stringify(json, null, 2));
      } catch (err) {
        alert("無效的 JSON 格式");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-6 border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 border-b-2 border-black pb-2">
        <h3 className="text-sm font-black uppercase flex items-center gap-2">
          <FileJson size={16} /> {title}
        </h3>
        <div className="flex gap-2">
          <button onClick={handleDownload} className="p-1.5 border border-black hover:bg-stone-100"><Download size={14} /></button>
          <label className="p-1.5 border border-black cursor-pointer hover:bg-stone-100">
            <Upload size={14} />
            <input type="file" className="hidden" onChange={handleUpload} accept=".json" />
          </label>
          <button 
            onClick={() => {
                try {
                    const parsed = JSON.parse(editingJson);
                    onUpdate(parsed);
                } catch(e) {
                    alert("JSON 解析失敗");
                }
            }} 
            className="p-1.5 bg-black text-white hover:bg-zinc-800"
          >
            <Save size={14} />
          </button>
        </div>
      </div>
      <textarea
        value={editingJson}
        onChange={(e) => setEditingJson(e.target.value)}
        className="flex-1 w-full bg-stone-50 p-4 font-mono text-[10px] resize-none focus:outline-none border border-black/5"
      />
    </div>
  );
};
