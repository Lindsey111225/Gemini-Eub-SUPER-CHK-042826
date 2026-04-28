import { Origin, RiskClass, ApplicationType, Rule, DocScenario } from "../types";

export const DEFAULT_RULES: Rule[] = [
  { id: "C01", name: "FSC 效期判定", logic: "D4_issue_date < today - 730 days", msg: "FSC 已超過 2 年效期，依準則規定無效。", severity: "ERROR" },
  { id: "C02", name: "QMS 效期預警", logic: "D9_expiry_date < today + 180 days", msg: "QMS 證明文件將於半年內過期，建議更換。", severity: "WARNING" },
  { id: "C03", name: "代理商一致性", logic: "D5_agent != D3_owner", msg: "授權書(LOA)代理商與藥商執照持有人不符。", severity: "ERROR" },
  { id: "C04", name: "產地地址匹配", logic: "D4_mfg_addr != D9_mfg_addr", msg: "FSC 地址與 QMS 廠址字串不一致，請核對。", severity: "WARNING" },
  { id: "C05", name: "三級案 STED 強制性", logic: "risk == 'CLASS_3' and not exists(D11)", msg: "第三等級案件必須提供 STED 技術文件摘要。", severity: "ERROR" },
  { id: "C06", name: "無菌報告衝突", logic: "attr_sterile == true and not exists(D25)", msg: "宣稱為無菌產品，但缺少滅菌確效報告。", severity: "ERROR" },
  { id: "C09", name: "遺失補發邏輯錯誤", logic: "path == 'REISSUE' and exists(D3)", msg: "既申請遺失補發，系統不應偵測到原許可證正本。", severity: "CRITICAL" },
  { id: "C10", name: "軟體確效報告", logic: "attr_software == true and not exists(D22)", msg: "產品包含軟體功能，缺少軟體確效報告(Validation)。", severity: "ERROR" },
];

export const DOC_SCENARIOS: DocScenario[] = [
  {
    id: "S01",
    conditions: { origin: Origin.IMPORT, risk: RiskClass.CLASS_3, type: ApplicationType.STANDARD },
    docRequirements: {
      D1: "REQUIRED", D2: "REQUIRED", D3: "REQUIRED", D4: "REQUIRED", D5: "REQUIRED",
      D6: "REQUIRED", D7: "REQUIRED", D8: "REQUIRED", D11: "REQUIRED"
    }
  },
  {
    id: "S02",
    conditions: { origin: Origin.DOMESTIC, risk: RiskClass.CLASS_2, type: ApplicationType.STANDARD },
    docRequirements: {
      D1: "REQUIRED", D2: "REQUIRED", D3: "REQUIRED", D6: "REQUIRED", D8: "REQUIRED"
    }
  }
];

export const DOC_DEFINITIONS: Record<string, string> = {
  D1: "申請書",
  D2: "標籤擬稿/彩色照片",
  D3: "許可證影本",
  D4: "產地證明 (FSC)",
  D5: "授權書 (LOA)",
  D6: "品質系統文件 (QMS/GMP)",
  D7: "臨床前測試資料",
  D8: "結構規格與原始數據",
  D9: "國外上市證明",
  D11: "STED 技術文件摘要",
  D14: "原廠說明函",
  D16: "讓與聲明書",
  D22: "軟體確效報告",
  D25: "滅菌確效報告",
  D29: "中文譯本"
};
