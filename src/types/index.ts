export enum Origin {
  DOMESTIC = "DOMESTIC",
  IMPORT = "IMPORT",
}

export enum RiskClass {
  CLASS_1 = "CLASS_1",
  CLASS_2 = "CLASS_2",
  CLASS_3 = "CLASS_3",
}

export enum ApplicationType {
  STANDARD = "STANDARD",
  DIFF_NAME = "DIFF_NAME",
  EXPORT_ONLY = "EXPORT_ONLY",
  REISSUE = "REISSUE", // 遺失補發
  TRANSFER = "TRANSFER", // 讓與
}

export interface Rule {
  id: string;
  name: string;
  logic: string;
  msg: string;
  severity: "ERROR" | "WARNING" | "CRITICAL" | "INFO";
}

export interface DocScenario {
  id: string;
  name: string; // Added name field
  conditions: Record<string, any>; // Relaxed conditions for more flexible matching
  req: string[]; // Required docs
  cond: string[]; // Conditional docs
}

export interface MdPassRules {
  version: string;
  law_reference: string;
  last_updated: string;
  description: string;
  base_docs: Record<string, string>;
  scenarios: DocScenario[];
}

export interface PainterStyle {
  id: string;
  name: string;
  bg: string;
  text: string;
  accent: string;
  border: string;
  cardBg: string;
  font: string;
  shadow?: string;
  headerBg?: string;
}

export type VisualEffectType = "ripple" | "glitch" | "scanline" | "sparkle" | "shockwave" | "datastream";

export interface AIModel {
  id: string;
  name: string;
}

export interface AgentNode {
  id: string;
  name: string;
  role: string;
  prompt: string;
  model: string;
  output?: string;
  status: "idle" | "running" | "completed" | "error";
}
