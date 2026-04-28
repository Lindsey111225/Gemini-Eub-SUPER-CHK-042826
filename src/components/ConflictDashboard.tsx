import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { AlertCircle, CheckCircle2, Info, Zap } from "lucide-react";
import { Rule } from "../types";
import { cn } from "../lib/utils";

interface ConflictDashboardProps {
  findings: Array<{ rule: Rule; passed: boolean }>;
  docStats: { required: number; provided: number };
  docList: { required: string[]; conditional: string[]; names: Record<string, string> };
}

export const ConflictDashboard: React.FC<ConflictDashboardProps> = ({ findings, docStats, docList }) => {
  const data = [
    { name: "已核驗", value: findings.filter(f => f.passed).length, color: "#16a34a" },
    { name: "有衝突", value: findings.filter(f => !f.passed).length, color: "#dc2626" },
  ];

  const severityData = [
    { name: "CRITICAL", count: findings.filter(f => !f.passed && f.rule.severity === "CRITICAL").length },
    { name: "ERROR", count: findings.filter(f => !f.passed && f.rule.severity === "ERROR").length },
    { name: "WARNING", count: findings.filter(f => !f.passed && f.rule.severity === "WARNING").length },
  ];

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-8 p-6 border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                <Zap className="text-red-600" /> 法規判定狀態 (Status Indicators)
            </h3>
            <div className="flex gap-4">
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-stone-400">核規率</span>
                    <span className="text-2xl font-black">{Math.round((data[0].value / findings.length) * 100)}%</span>
                </div>
                <div className="flex flex-col items-center border-l-2 border-black/5 pl-4">
                    <span className="text-[10px] font-bold text-stone-400">文件完整性</span>
                    <span className="text-2xl font-black">{docStats.provided}/{docStats.required}</span>
                </div>
            </div>
        </div>

        <div className="space-y-3">
          {findings.map((finding) => (
            <div 
                key={finding.rule.id} 
                className={cn(
                    "flex items-center justify-between p-3 border-l-4 transition-all duration-500",
                    finding.passed ? "border-green-600 bg-green-50/50" : "border-red-600 bg-red-50/50 scale-[1.01]"
                )}
            >
              <div className="flex items-center gap-3">
                {finding.passed ? <CheckCircle2 className="text-green-600" size={18} /> : <AlertCircle className="text-red-600" size={18} />}
                <div>
                  <div className="text-xs font-bold uppercase">{finding.rule.id}: {finding.rule.name}</div>
                  {!finding.passed && <div className="text-[10px] text-red-700 font-serif italic">{finding.rule.msg}</div>}
                </div>
              </div>
              <div className={cn(
                "px-2 py-0.5 text-[8px] font-black tracking-widest rounded",
                finding.rule.severity === "CRITICAL" ? "bg-black text-white" : 
                finding.rule.severity === "ERROR" ? "bg-red-600 text-white" : "bg-yellow-400 text-black"
              )}>
                {finding.rule.severity}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-4 flex flex-col gap-6">
        <div className="flex-1 p-6 border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-sm font-black uppercase mb-4 text-center">判定分佈 (Distribution)</h3>
            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="flex-1 p-6 border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-sm font-black uppercase mb-4 text-center">風險等級 (Severity)</h3>
            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={severityData}>
                        <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis hide />
                        <Tooltip cursor={{fill: 'transparent'}} />
                        <Bar dataKey="count" fill="#000" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      <div className="col-span-12 p-6 border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2 mb-6 border-b-2 border-black pb-2">
            <CheckCircle2 size={24} className="text-green-600" /> 應檢附文件清單 (Generated Doc List)
        </h3>
        <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
                <h4 className="text-xs font-black uppercase bg-black text-white px-3 py-1 inline-block">必須文件 (Mandatory)</h4>
                <div className="space-y-2">
                    {docList.required.map(id => (
                        <div key={id} className="flex items-center gap-3 p-2 border border-black/10 hover:border-black transition-colors group">
                            <span className="w-8 font-black text-red-600">{id}</span>
                            <span className="text-xs font-bold">{docList.names[id] || "未知文件"}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="space-y-4">
                <h4 className="text-xs font-black uppercase bg-stone-200 text-stone-700 px-3 py-1 inline-block">彈性檢附 (Conditional)</h4>
                <div className="space-y-2">
                    {docList.conditional.map(id => (
                        <div key={id} className="flex items-center gap-3 p-2 border border-black/10 opacity-60 hover:opacity-100 transition-opacity">
                            <span className="w-8 font-black text-stone-400">{id}</span>
                            <span className="text-xs font-bold">{docList.names[id] || "特定條件文件"}</span>
                        </div>
                    ))}
                    {docList.conditional.length === 0 && (
                        <div className="text-xs italic text-stone-400">目前設定下無額外條件文件</div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
