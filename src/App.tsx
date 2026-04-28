/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { Origin, RiskClass, ApplicationType, Rule, VisualEffectType } from "./types";
import { PAINTER_STYLES } from "./constants/painterStyles";
import { cn } from "./lib/utils";
import { 
  Download, Upload, Key, 
  Settings, Languages, 
  ChevronRight, AlertTriangle, FileUp, Database,
  Terminal, Monitor, Activity, Zap
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { RulesManager } from "./components/RulesManager";
import { DocInspector } from "./components/DocInspector";
import { ConflictDashboard } from "./components/ConflictDashboard";
import { AgentChain } from "./components/AgentChain";
import { NoteKeeper } from "./components/NoteKeeper";
import { VisualEffects } from "./components/VisualEffects";
import { DEFAULT_MDPASS_RULES, ADVANCED_CONFLICT_RULES } from "./constants/rules";

export default function App() {
  // --- Global State ---
  const [lang, setLang] = useState<"ZH" | "EN">("ZH");
  const [styleId, setStyleId] = useState("editorial");
  const [apiKey, setApiKey] = useState(process.env.GEMINI_API_KEY || "");
  const [showKeyInput, setShowKeyInput] = useState(!process.env.GEMINI_API_KEY);
  const [effect, setEffect] = useState<VisualEffectType | null>(null);
  
  // --- Logic State ---
  const [rules, setRules] = useState(DEFAULT_MDPASS_RULES);
  const [advancedRules, setAdvancedRules] = useState(ADVANCED_CONFLICT_RULES);
  const [facts, setFacts] = useState({
    origin: Origin.IMPORT,
    risk: RiskClass.CLASS_3,
    type: ApplicationType.STANDARD,
    attributes: {
      isRadiation: false,
      isChinaOrigin: false,
      isSamd: false,
      isContractMfg: false,
      isSterile: true,
    },
    dates: {
      D4_issue_date: "2023-01-01",
      D9_expiry_date: "2026-12-31"
    }
  });
  const [logs, setLogs] = useState<string[]>(["[SYSTEM] MDMDS 2.0 INITIALIZED", "[INFO] TFDA 附表四邏輯加載完成"]);
  const [view, setView] = useState<"DASHBOARD" | "INSPECTOR">("DASHBOARD");

  // --- Theme Computed ---
  const painter = useMemo(() => 
    PAINTER_STYLES.find(s => s.id === styleId) || PAINTER_STYLES[0], 
  [styleId]);

  // --- Rule Engine Logic ---
  const analysis = useMemo(() => {
    // Basic scenario matching from mdpass_rules.json
    const scenario = rules.scenarios?.find((s: any) => 
      s.conditions.origin === facts.origin && 
      s.conditions.risk === facts.risk && 
      s.conditions.path === (facts.type === ApplicationType.STANDARD ? "STANDARD" : facts.type)
    );

    const findings = advancedRules.rules.map((rule: any) => {
      // Logic simulation - trying to simulate the user provided python class logic
      let passed = true;
      const today = new Date();
      
      try {
        if (rule.id === "C01") {
          const issueDate = new Date(facts.dates.D4_issue_date);
          const limit = new Date(today.getTime() - 730 * 24 * 60 * 60 * 1000);
          passed = issueDate > limit;
        } else if (rule.id === "C05") {
          passed = !(facts.risk === RiskClass.CLASS_3 && !scenario?.req?.includes("D11"));
        } else if (rule.id === "C06") {
          passed = !(facts.attributes.isSterile && !scenario?.req?.includes("D25"));
        }
      } catch (e) {
        passed = false;
      }
      
      return { rule, passed };
    });

    const docList = {
      required: scenario?.req || [],
      conditional: scenario?.cond || [],
      names: rules.base_docs || {}
    };

    return { findings, docStats: { required: docList.required.length, provided: Math.floor(docList.required.length * 0.7) }, docList };
  }, [facts, rules, advancedRules]);

  // --- Actions ---
  const jackpotStyle = () => {
    setEffect("shockwave");
    const random = PAINTER_STYLES[Math.floor(Math.random() * PAINTER_STYLES.length)];
    setStyleId(random.id);
  };

  const handleExecution = () => {
    setEffect("scanline");
    setLogs(prev => [...prev, `[EXEC] GENERATING DOC LIST FOR ${facts.origin}_${facts.risk}`]);
    setView("DASHBOARD");
  };

  return (
    <div className={cn("min-h-screen transition-colors duration-700", painter.bg, painter.text, painter.font)}>
      <VisualEffects type={effect} onComplete={() => setEffect(null)} />

      {/* --- Top Global Bar --- */}
      <header className={cn("fixed top-0 w-full z-50", painter.headerBg)}>
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-600 flex items-center justify-center text-white font-black overflow-hidden relative">
                <span className="relative z-10">MD</span>
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-2 border-dashed border-white/30" 
                />
            </div>
            <div>
                <h1 className="text-xl font-black tracking-tighter uppercase leading-none">MDMDS PRO</h1>
                <p className="text-[10px] font-bold tracking-widest text-red-600 uppercase">Editorial & Artistic Edition V4.2</p>
            </div>
          </div>

          <nav className="flex items-center gap-8">
            <button 
                onClick={() => setView("DASHBOARD")}
                className={cn("text-xs font-black uppercase pb-1 border-b-2 transition-all", view === "DASHBOARD" ? "border-red-600" : "border-transparent opacity-50")}
            >
                {lang === "ZH" ? "判定儀表板" : "DASHBOARD"}
            </button>
            <button 
                onClick={() => setView("INSPECTOR")}
                className={cn("text-xs font-black uppercase pb-1 border-b-2 transition-all", view === "INSPECTOR" ? "border-red-600" : "border-transparent opacity-50")}
            >
                {lang === "ZH" ? "文件衝突引擎" : "DOC INSPECTOR"}
            </button>
          </nav>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 border-r border-black/10 pr-6 mr-6">
                <button 
                  onClick={() => setLang(lang === "ZH" ? "EN" : "ZH")}
                  className="flex items-center gap-1 text-[10px] font-black uppercase hover:text-red-600"
                >
                  <Languages size={14} /> {lang}
                </button>
                <button 
                  onClick={jackpotStyle}
                  className="flex items-center gap-1 text-[10px] font-black uppercase bg-red-600 text-white px-3 py-1 ml-2"
                >
                  JACKPOT
                </button>
            </div>

            <div className="flex items-center gap-4">
              {showKeyInput && (
                <div className="flex items-center gap-2">
                  <Key size={14} />
                  <input 
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="API KEY"
                    className="bg-transparent border-b border-black text-[10px] focus:outline-none w-32"
                  />
                </div>
              )}
              <Settings size={18} className="hover:rotate-90 transition-transform cursor-pointer" />
            </div>
          </div>
        </div>
      </header>

      {/* --- Main Contents --- */}
      <main className="pt-24 pb-12 max-w-[1600px] mx-auto px-6 grid grid-cols-12 gap-8">
        
        {/* Left Sidebar */}
        <aside className="col-span-3 space-y-6">
          <div className={cn("p-6 border-2 border-black sticky top-24", painter.cardBg, painter.shadow)}>
            <div className="flex items-center gap-2 mb-6 border-b-2 border-black pb-2">
                <Terminal size={18} className="text-red-600" />
                <h2 className="text-sm font-black uppercase tracking-widest">{lang === "ZH" ? "審問引擎" : "INTERROGATION"}</h2>
            </div>

            <div className="space-y-6">
              <section>
                <label className="text-[10px] font-black uppercase mb-2 block text-stone-400">來源屬性 (Origin)</label>
                <div className="grid grid-cols-2 gap-2">
                  {[Origin.DOMESTIC, Origin.IMPORT].map(o => (
                    <button 
                      key={o}
                      onClick={() => setFacts({...facts, origin: o})}
                      className={cn(
                        "py-2 text-xs font-bold border-2 border-black",
                        facts.origin === o ? "bg-black text-white" : "hover:bg-stone-100"
                      )}
                    >
                      {o === Origin.DOMESTIC ? (lang === "ZH" ? "國產" : "DOMESTIC") : (lang === "ZH" ? "輸入" : "IMPORT")}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <label className="text-[10px] font-black uppercase mb-2 block text-stone-400">風險等級 (Risk Class)</label>
                <div className="grid grid-cols-3 gap-2">
                  {[RiskClass.CLASS_1, RiskClass.CLASS_2, RiskClass.CLASS_3].map(r => (
                    <button 
                      key={r}
                      onClick={() => setFacts({...facts, risk: r})}
                      className={cn(
                        "py-2 text-[10px] font-bold border-2 border-black",
                        facts.risk === r ? "bg-black text-white" : "hover:bg-stone-100"
                      )}
                    >
                      {r.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </section>

              <div className="space-y-4">
                  <section>
                    <label className="text-[10px] font-black uppercase mb-2 block text-stone-400">案件類別 (Application)</label>
                    <select 
                        value={facts.type}
                        onChange={(e) => setFacts({...facts, type: e.target.value as ApplicationType})}
                        className="w-full p-2 border-2 border-black text-xs font-bold focus:outline-none bg-transparent"
                    >
                        <option value={ApplicationType.STANDARD}>{lang === "ZH" ? "標準程序" : "STANDARD"}</option>
                        <option value={ApplicationType.DIFF_NAME}>{lang === "ZH" ? "不同品名" : "DIFF NAME"}</option>
                        <option value={ApplicationType.EXPORT_ONLY}>{lang === "ZH" ? "專供外銷" : "EXPORT ONLY"}</option>
                    </select>
                  </section>
                  
                  <button 
                    onClick={handleExecution}
                    className="w-full py-3 bg-red-600 text-white font-black text-sm border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none translate-y-[-2px] hover:translate-y-0 transition-all uppercase"
                  >
                    {lang === "ZH" ? "執行判定" : "EXECUTE"}
                  </button>
              </div>

              <div className="pt-4 border-t border-black/5 space-y-2">
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-600" /><span className="text-[10px] font-bold">屬性覆蓋偵測</span></div>
                {Object.entries(facts.attributes).map(([key, val]) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={val}
                        onChange={() => setFacts({...facts, attributes: {...facts.attributes, [key]: !val}})}
                        className="w-4 h-4 border-2 border-black rounded-none"
                      />
                      <span className="text-[10px] font-bold uppercase">{key.replace("is", "")}</span>
                    </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Center Canvas */}
        <div className="col-span-6 space-y-8">
          {view === "DASHBOARD" ? (
              <>
                <ConflictDashboard findings={analysis.findings} docStats={analysis.docStats} docList={analysis.docList} />
                <div className="grid grid-cols-2 gap-8">
                    <AgentChain apiKey={apiKey} onEffect={setEffect} />
                    <NoteKeeper apiKey={apiKey} onEffect={setEffect} />
                </div>
              </>
          ) : (
              <DocInspector apiKey={apiKey} onEffect={setEffect} advancedRules={advancedRules} lang={lang} />
          )}
        </div>

        {/* Right Sidebar */}
        <aside className="col-span-3 space-y-6">
          <RulesManager 
            title={lang === "ZH" ? "MDPASS 查驗登記規則 (標準)" : "MDPASS RULES (STD)"}
            filename="mdpass_rules.json"
            rules={rules} 
            onUpdate={setRules} 
            lang={lang} 
          />

          <RulesManager 
            title={lang === "ZH" ? "智慧衝突判定規則 (進階)" : "SMART CONFLICT RULES"}
            filename="advanced_conflict_rules.json"
            rules={advancedRules} 
            onUpdate={setAdvancedRules} 
            lang={lang} 
          />
          
          <div className={cn("p-6 border-2 border-black bg-stone-900 text-green-400 font-mono text-[10px] h-[200px]", painter.shadow)}>
            <div className="flex items-center gap-2 mb-2 border-b border-green-400/20 pb-1">
              <Activity size={14} /><span>LIVE LOGS</span>
            </div>
            <div className="space-y-1 overflow-auto h-full pb-8">
              {logs.map((log, i) => <div key={i}><span className="opacity-50 mr-2">{">"}</span>{log}</div>)}
            </div>
          </div>
        </aside>
      </main>

      <footer className="fixed bottom-0 w-full bg-black text-white h-8 flex items-center justify-between px-6 z-50 text-[8px] font-black uppercase tracking-widest">
          <div>SYSTEM: ACTIVE | ENGINE: CONFLICT_V2.1</div>
          <div>© 2026 MDMDS TECH</div>
      </footer>
    </div>
  );
}
