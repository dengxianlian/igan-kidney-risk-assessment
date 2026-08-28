(() => {
  "use strict";

  const DATA_RANGES = {
    age: { min: 18, max: 84 },
    sex: { min: 0, max: 1 },
    alb: { min: 10.1, max: 52.2 },
    egfr: { min: 2.59, max: 197.11 },
    iga: { min: 0.27, max: 8.97 },
    ualpha1mg: { min: 5, max: 496 }
  };

  const I18N = {
    zh: {
      brandSubtitle: "肾病风险评估工作台", offline: "离线计算", export: "导出结果", resetTitle: "重置当前输入", languageLabel: "切换语言",
      modelCount: "3 个模型", cohortTitle: "建模队列", cohortText: "南方医建模队列 · n=1308\n观察范围用于列线图标尺", privacyTitle: "数据留在本机", privacyText: "本页面不上传患者信息。关闭页面后，当前输入不会被保存。",
      heroKicker: "肾脏临床辅助 · RENAL CLINICAL SUPPORT", pageTitle: "IgAN 风险评估", pageIntro: "用可解释的逻辑回归模型，把关键检验结果转化为可读的风险信号。", heroMetaOne: "选择模型", heroMetaTwo: "录入结果", heroMetaThree: "查看建议",
      breadcrumbOne: "临床辅助评估", breadcrumbTwo: "模型计算", sectionHeading: "患者风险工作台", headingIntro: "录入检查结果，查看模型概率、变量贡献与下一步诊疗建议。", formulaLabel: "当前模型", inputTitle: "结果输入", resultTitle: "模型预测结果", liveLabel: "实时更新", probabilityCaption: "预测概率 P", riskLabel: "风险等级", aLabel: "线性预测值 A", modelLabel: "模型",
      inputHint: "连续变量按原始测量值代入；性别为二分类变量。", adviceTitle: "下一步诊疗建议", adviceNote: "模型结果仅作临床辅助评估，不能替代医生诊断。", nomogramTitle: "风险等级列线图", nomogramIntro: "各变量按建模队列观察范围设定标尺；总分与概率使用同一线性预测值映射。", legendCurrent: "当前点位", legendThreshold: "风险阈值", nomogramSource: "标尺来源：对应模型建模队列；变量范围采用观察到的最小值与最大值。",
      explanationTitle: "变量贡献与分布", explanationIntro: "Bar 按模型贡献度排列；Scatter 与 Bar 使用相同项目顺序，展示变量取值对应的线性贡献。", legendCase: "当前病例", legendLow: "低值", legendHigh: "高值", modelInfoTitle: "模型信息与使用边界", disclaimer: "本模型仅作为临床辅助评估工具，用于提示相关疾病或病理类型的可能性，不能作为确诊或排除诊断的唯一依据。疾病确诊仍需结合患者病史、临床表现、实验室及影像学检查，必要时依据肾活检及病理结果明确诊断。",
      invalid: "请检查输入范围后再查看结果。", filled: "已填", pending: "待检查输入", range: "范围", points: "分", total: "总分", riskProbability: "风险概率", pointsAxis: "POINTS / 分值", scatterAxis: "线性贡献 / Linear contribution", scoreMapping: "总分与概率共用线性预测值映射"
    },
    en: {
      brandSubtitle: "Renal risk assessment workbench", offline: "Offline calculation", export: "Export result", resetTitle: "Reset current inputs", languageLabel: "Switch language",
      modelCount: "3 models", cohortTitle: "Modeling cohort", cohortText: "Southern Medical cohort · n=1308\nObserved ranges drive nomogram", privacyTitle: "Data stays on device", privacyText: "No patient data is uploaded. Inputs are not saved after this page is closed.",
      heroKicker: "肾脏临床辅助 · RENAL CLINICAL SUPPORT", pageTitle: "IgAN Risk Assessment", pageIntro: "Turn key laboratory results into readable risk signals with an interpretable logistic regression model.", heroMetaOne: "Choose model", heroMetaTwo: "Enter results", heroMetaThree: "Review advice",
      breadcrumbOne: "Clinical support", breadcrumbTwo: "Model calculation", sectionHeading: "Patient risk workbench", headingIntro: "Enter laboratory results to review probability, variable contribution, and next-step advice.", formulaLabel: "Active model", inputTitle: "Result input", resultTitle: "Model output", liveLabel: "Live update", probabilityCaption: "Predicted probability P", riskLabel: "Risk tier", aLabel: "Linear predictor A", modelLabel: "Model",
      inputHint: "Enter continuous variables as measured; sex is binary coded.", adviceTitle: "Next-step clinical advice", adviceNote: "For clinical support only; this model does not replace medical diagnosis.", nomogramTitle: "Risk nomogram", nomogramIntro: "Variable scales use observed modeling-cohort ranges; total points and probability share one linear-predictor mapping.", legendCurrent: "Current value", legendThreshold: "Risk threshold", nomogramSource: "Scale source: the corresponding modeling cohort; observed minimum and maximum values are used.",
      explanationTitle: "Variable contribution & distribution", explanationIntro: "Bars follow the model contribution order; scatter uses the same feature order and shows linear contribution across the value range.", legendCase: "Current case", legendLow: "Low value", legendHigh: "High value", modelInfoTitle: "Model notes & boundaries", disclaimer: "This model is a clinical support tool for estimating disease or pathology likelihood. It must not be used as the sole basis for diagnosis or exclusion. Final assessment should integrate history, examination, laboratory and imaging findings, and kidney biopsy when indicated.",
      invalid: "Check the input range before reviewing the result.", filled: "Filled", pending: "Check inputs", range: "Range", points: "pts", total: "Total points", riskProbability: "Risk probability", pointsAxis: "POINTS / 分值", scatterAxis: "线性贡献 / Linear contribution", scoreMapping: "Total points and probability share the linear-predictor mapping"
    }
  };

  const MODEL_DEFS = {
    uBASE: {
      id: "uBASE", name: "IgAN-uBASE", nameEn: "IgAN-uBASE", subtitle: "基础变量 + 尿标志物", subtitleEn: "Core variables + urinary marker", interpretation: "IgA 肾病", interpretationEn: "IgA nephropathy", intercept: 0.75, importanceOrder: ["age", "alb", "ualpha1mg", "egfr", "iga", "sex"],
      formula: "A = 0.75 − 0.100897×Age + 0.780017×Sex + 0.119005×ALB − 0.034007×eGFRCr + 1.014081×IgA − 0.025577×U-α1MG",
      formulaEn: "A = 0.75 − 0.100897×Age + 0.780017×Sex + 0.119005×ALB − 0.034007×eGFRCr + 1.014081×IgA − 0.025577×U-α1MG",
      fullFormula: "P = exp(A) / (1 + exp(A)); A = 0.75 − 0.100897151392959×Age + 0.780017201693036×Sex + 0.119005247955097×ALB − 0.034007361661803×eGFRCr + 1.01408077717786×IgA − 0.025576547623995×U-α1MG",
      fields: [
        { key: "age", label: "年龄", enLabel: "Age", symbol: "Age", unit: "岁", enUnit: "years", min: 18, max: 90, plotMin: 18, plotMax: 84, decimals: 0, default: 18, beta: -0.100897151392959 },
        { key: "sex", label: "性别", enLabel: "Sex", symbol: "Sex", unit: "", enUnit: "", type: "select", options: [{ value: 1, label: "男", enLabel: "Male" }, { value: 0, label: "女", enLabel: "Female" }], default: 1, beta: 0.780017201693036, plotMin: 0, plotMax: 1 },
        { key: "alb", label: "白蛋白", enLabel: "Albumin", symbol: "ALB", unit: "g/L", enUnit: "g/L", min: 0, max: 60, plotMin: 10.1, plotMax: 52.2, decimals: 1, default: 34.6, beta: 0.119005247955097 },
        { key: "egfr", label: "估算肾小球滤过率", enLabel: "eGFR (creatinine)", symbol: "eGFRCr", unit: "mL/min/1.73m²", enUnit: "mL/min/1.73m²", min: 0, max: 200, plotMin: 2.59, plotMax: 197.11, decimals: 2, default: 96.14, beta: -0.034007361661803 },
        { key: "iga", label: "血清 IgA", enLabel: "Serum IgA", symbol: "IgA", unit: "g/L", enUnit: "g/L", min: 0, max: 9, plotMin: 0.27, plotMax: 8.97, decimals: 2, default: 3.25, beta: 1.01408077717786 },
        { key: "ualpha1mg", label: "尿 α1 微球蛋白", enLabel: "Urine α1-microglobulin", symbol: "U-α1MG", unit: "mg/L", enUnit: "mg/L", min: 0, max: 500, plotMin: 5, plotMax: 496, decimals: 1, default: 7.3, beta: -0.025576547623995 }
      ],
      recommendations: {
        veryLow: ["建议综合患者临床病史、检验检查指标，进一步鉴别薄基底膜肾病、Alport 综合征、膜性肾病、FSGS、微小病变、C3 肾小球病等。", "Integrate history and laboratory findings to consider thin basement membrane disease, Alport syndrome, membranous nephropathy, FSGS, minimal change disease, C3 glomerulopathy and other alternatives."],
        low: ["建议综合患者临床病史、检验检查指标鉴别诊断其他原发性肾小球疾病。必要时完善补体、ANA、ANCA、抗 GBM、PLA2R、感染筛查、血清免疫球蛋白、血尿蛋白电泳等。", "Differentiate other primary glomerular diseases using history and laboratory findings; consider complement, ANA, ANCA, anti-GBM, PLA2R, infection screening, immunoglobulins and protein electrophoresis when indicated."],
        medium: ["建议肾病专科系统评估。完善尿红细胞形态、24 h 尿蛋白或 UPCR、C3、C4、ANA、抗 dsDNA、ANCA、抗 GBM、PLA2R、肾脏超声等检验检查。若蛋白尿持续、eGFR 下降、高血压或尿沉渣活动明显，应评估肾活检必要性。", "Arrange nephrology review with urine morphology, 24-hour protein or UPCR, C3/C4, ANA, anti-dsDNA, ANCA, anti-GBM, PLA2R and renal ultrasound. Consider biopsy if proteinuria persists, eGFR declines, hypertension or active sediment is present."],
        high: ["建议尽快肾病科就诊。若存在持续蛋白尿、镜下血尿伴蛋白尿、反复肉眼血尿、eGFR 下降、高血压、ALB 降低或 LDL-C 升高，应重点评估肾活检适应证。", "Arrange prompt nephrology review. Persistent proteinuria, microscopic or recurrent gross hematuria, falling eGFR, hypertension, low albumin or high LDL-C should trigger focused biopsy assessment."],
        veryHigh: ["建议进入高度疑似 IgAN 诊疗流程，尽快完成肾病专科系统评估。若无禁忌，优先考虑肾活检，以明确是否为 IgAN、是否合并新月体、节段硬化、间质纤维化/小管萎缩等病理损伤，并据此决定支持治疗、RAS 抑制、SGLT2 抑制剂及是否需要免疫治疗。", "Enter a high-suspicion IgAN pathway and complete specialist assessment promptly. If not contraindicated, prioritize kidney biopsy to confirm IgAN and assess crescents, segmental sclerosis and interstitial fibrosis/tubular atrophy before selecting supportive, RAS, SGLT2 or immunosuppressive treatment."]
      }
    },
    base: {
      id: "base", name: "IgAN-BASE", nameEn: "IgAN-BASE", subtitle: "基础临床变量", subtitleEn: "Core clinical variables", interpretation: "IgA 肾病", interpretationEn: "IgA nephropathy", intercept: -3.05, importanceOrder: ["alb", "age", "iga", "egfr", "sex"],
      formula: "A = −3.05 − 0.092950×Age + 1.025188×Sex + 0.169831×ALB − 0.024618×eGFRCr + 1.074624×IgA",
      formulaEn: "A = −3.05 − 0.092950×Age + 1.025188×Sex + 0.169831×ALB − 0.024618×eGFRCr + 1.074624×IgA",
      fullFormula: "P = exp(A) / (1 + exp(A)); A = −3.05 − 0.092949886218316×Age + 1.0251875681476×Sex + 0.169831025161927×ALB − 0.0246182086243941×eGFRCr + 1.07462360040374×IgA",
      fields: [], recommendations: null
    },
    oxt: {
      id: "oxt", name: "IgAN-OxT", nameEn: "IgAN-OxT", subtitle: "肾小管-间质损伤风险", subtitleEn: "Tubulointerstitial injury risk", interpretation: "肾小管萎缩/间质纤维化", interpretationEn: "Tubular atrophy / interstitial fibrosis", intercept: 9.28 - 1.54635793205125, importanceOrder: ["egfr", "protein", "age", "ldlc"],
      formula: "A = 9.28 − 0.073423×Age − 0.077176×eGFRCr + 0.561605×U-24hTP − 1.546358 + 0.092458×LDL-C",
      formulaEn: "A = 9.28 − 0.073423×Age − 0.077176×eGFR + 0.561605×24h protein − 1.546358 + 0.092458×LDL-C",
      fullFormula: "P = exp(A) / (1 + exp(A)); A = 9.28 − 0.0734226757215475×Age − 0.0771762735979292×eGFRCr + 0.56160497842656×U-24hTP − 1.54635793205125 + 0.092457733083033×LDL-C",
      fields: [
        { key: "age", label: "年龄", enLabel: "Age", symbol: "Age", unit: "岁", enUnit: "years", min: 18, max: 90, plotMin: 18, plotMax: 70, decimals: 0, default: 34, beta: -0.0734226757215475 },
        { key: "egfr", label: "估算肾小球滤过率", enLabel: "eGFR (creatinine)", symbol: "eGFRCr", unit: "mL/min/1.73m²", enUnit: "mL/min/1.73m²", min: 0, max: 200, plotMin: 4.447097497967679, plotMax: 152.4507753547946, decimals: 2, default: 80, beta: -0.0771762735979292 },
        { key: "protein", label: "24 h 尿蛋白", enLabel: "24-hour urine protein", symbol: "U-24hTP", unit: "g/24 h", enUnit: "g/24 h", min: 0, max: 20, plotMin: 0.05, plotMax: 19.58, decimals: 2, default: 1.2, beta: 0.56160497842656, rangeSource: "cohort" },
        { key: "ldlc", label: "低密度脂蛋白", enLabel: "LDL cholesterol", symbol: "LDL-C", unit: "mmol/L", enUnit: "mmol/L", min: 0, max: 15, plotMin: 1.12, plotMax: 12.32, decimals: 2, default: 3.1, beta: 0.092457733083033, rangeSource: "cohort" }
      ], recommendations: {
        veryLow: ["当前模型提示肾小管萎缩/间质纤维化可能性较低，仍建议结合肾功能、蛋白尿及肾活检病理综合判断。", "The model suggests lower likelihood of tubular atrophy/interstitial fibrosis; integrate kidney function, proteinuria and biopsy pathology."],
        low: ["当前模型提示相关病理损伤可能性较低，建议结合临床病史、尿蛋白定量、eGFR 变化趋势及影像学结果随访评估。", "The model suggests lower likelihood of injury; follow with history, quantitative proteinuria, eGFR trend and imaging."],
        medium: ["建议肾病专科系统评估，结合蛋白尿、eGFR 下降速度、血压及肾脏超声等资料，必要时评估肾活检病理分层的价值。", "Arrange nephrology review using proteinuria, eGFR slope, blood pressure and ultrasound; assess the value of biopsy-based stratification when indicated."],
        high: ["建议尽快肾病科就诊，重点关注持续蛋白尿、eGFR 下降、高血压及血脂异常，并结合肾活检结果评估间质纤维化/小管萎缩程度。", "Arrange prompt nephrology review, focusing on persistent proteinuria, falling eGFR, hypertension and dyslipidemia with biopsy correlation."],
        veryHigh: ["模型提示肾小管萎缩/间质纤维化可能性极高，建议尽快完成肾病专科系统评估；若具备适应证且无禁忌，应结合肾活检明确病理损伤范围，并据此制定支持治疗和肾脏保护方案。", "The model suggests very high likelihood of tubulointerstitial injury. Complete specialist assessment promptly; if indicated and safe, use kidney biopsy to define injury extent and guide kidney-protective care."]
      }
    }
  };

  const sharedFields = [
    { key: "age", label: "年龄", enLabel: "Age", symbol: "Age", unit: "岁", enUnit: "years", min: 18, max: 90, plotMin: 18, plotMax: 84, decimals: 0, default: 18, beta: -0.092949886218316 },
    { key: "sex", label: "性别", enLabel: "Sex", symbol: "Sex", unit: "", enUnit: "", type: "select", options: [{ value: 1, label: "男", enLabel: "Male" }, { value: 0, label: "女", enLabel: "Female" }], default: 1, beta: 1.0251875681476, plotMin: 0, plotMax: 1 },
    { key: "alb", label: "白蛋白", enLabel: "Albumin", symbol: "ALB", unit: "g/L", enUnit: "g/L", min: 0, max: 60, plotMin: 10.1, plotMax: 52.2, decimals: 1, default: 34.6, beta: 0.169831025161927 },
    { key: "egfr", label: "估算肾小球滤过率", enLabel: "eGFR (creatinine)", symbol: "eGFRCr", unit: "mL/min/1.73m²", enUnit: "mL/min/1.73m²", min: 0, max: 200, plotMin: 2.59, plotMax: 197.11, decimals: 2, default: 96.14, beta: -0.0246182086243941 },
    { key: "iga", label: "血清 IgA", enLabel: "Serum IgA", symbol: "IgA", unit: "g/L", enUnit: "g/L", min: 0, max: 9, plotMin: 0.27, plotMax: 8.97, decimals: 2, default: 3.25, beta: 1.07462360040374 }
  ];
  MODEL_DEFS.base.fields = sharedFields;
  MODEL_DEFS.base.recommendations = MODEL_DEFS.uBASE.recommendations;

  const RISK_TIERS = [
    { key: "veryLow", max: 0.15, name: "极低风险", enName: "Very low risk", color: "#69be7c" },
    { key: "low", max: 0.4, name: "低风险", enName: "Low risk", color: "#83bb72" },
    { key: "medium", max: 0.7, name: "中等风险", enName: "Intermediate risk", color: "#c9a632" },
    { key: "high", max: 0.9, name: "高风险", enName: "High risk", color: "#db794c" },
    { key: "veryHigh", max: 1, name: "极高风险", enName: "Very high risk", color: "#d94d51" }
  ];

  const els = {
    modelList: document.querySelector("#modelList"), modelCount: document.querySelector("#modelCount"), headingModelChip: document.querySelector("#headingModelChip"), inputForm: document.querySelector("#inputForm"), formulaText: document.querySelector("#formulaText"), completionStatus: document.querySelector("#completionStatus"), validationMessage: document.querySelector("#validationMessage"), probabilityRing: document.querySelector("#probabilityRing"), probabilityValue: document.querySelector("#probabilityValue"), aValue: document.querySelector("#aValue"), modelCode: document.querySelector("#modelCode"), riskTitle: document.querySelector("#riskTitle"), riskInterpretation: document.querySelector("#riskInterpretation"), riskScale: document.querySelector("#riskScale"), adviceCallout: document.querySelector("#adviceCallout"), adviceBody: document.querySelector("#adviceBody"), nomogram: document.querySelector("#nomogram"), nomogramSource: document.querySelector("#nomogramSource"), nomogramTierKey: document.querySelector("#nomogramTierKey"), contributionPlot: document.querySelector("#contributionPlot"), modelInfoContent: document.querySelector("#modelInfoContent")
  };
  let activeModelId = "uBASE";
  let lang = "zh";

  const t = (key) => I18N[lang][key] ?? key;
  const modelLabel = (model) => lang === "zh" ? model.name : model.nameEn;
  const fieldLabel = (field) => lang === "zh" ? field.label : field.enLabel;
  const fieldUnit = (field) => lang === "zh" ? field.unit : field.enUnit;
  const formatNumber = (value, decimals = 2) => { if (!Number.isFinite(value)) return "—"; const fixed = Number(value).toFixed(decimals); return fixed.includes(".") ? fixed.replace(/0+$/, "").replace(/\.$/, "") : fixed; };
  const logistic = (a) => a >= 0 ? 1 / (1 + Math.exp(-a)) : Math.exp(a) / (1 + Math.exp(a));
  const logit = (p) => Math.log(p / (1 - p));
  const getTier = (p) => RISK_TIERS.find((tier) => p < tier.max) || RISK_TIERS[RISK_TIERS.length - 1];
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  function updateStaticText() {
    const ids = ["brandSubtitle", "modelCount", "cohortTitle", "privacyTitle", "privacyText", "heroKicker", "pageTitle", "pageIntro", "heroMetaOne", "heroMetaTwo", "heroMetaThree", "breadcrumbOne", "breadcrumbTwo", "sectionHeading", "headingIntro", "formulaLabel", "inputTitle", "resultTitle", "liveLabel", "probabilityCaption", "riskLabel", "aLabel", "modelLabel", "inputHint", "adviceTitle", "adviceNote", "nomogramTitle", "nomogramIntro", "legendCurrent", "legendThreshold", "nomogramSource", "explanationTitle", "explanationIntro", "legendCase", "legendLow", "legendHigh", "modelInfoTitle"];
    const keyById = { offlineLabel: "offline", exportLabel: "export", disclaimerText: "disclaimer" };
    ids.forEach((id) => { const node = document.querySelector(`#${id}`); if (node) node.textContent = t(id); });
    Object.entries(keyById).forEach(([id, key]) => { const node = document.querySelector(`#${id}`); if (node) node.textContent = t(key); });
    document.querySelector("#cohortText").innerHTML = t("cohortText").replace("\n", "<br />");
    document.querySelector("#languageToggle").textContent = lang === "zh" ? "EN" : "中文";
    document.querySelector("#languageToggle").setAttribute("aria-label", t("languageLabel"));
    document.querySelector("#resetButton").setAttribute("title", t("resetTitle"));
    document.querySelector("#resetButton").setAttribute("aria-label", t("resetTitle"));
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }

  function renderModelList() {
    els.modelList.innerHTML = Object.values(MODEL_DEFS).map((model, index) => `<button class="model-button ${model.id === activeModelId ? "active" : ""}" data-model="${model.id}" type="button" aria-pressed="${model.id === activeModelId}"><span class="model-bullet">0${index + 1}</span><span><strong>${modelLabel(model)}</strong><small>${lang === "zh" ? model.subtitle : model.subtitleEn}</small></span></button>`).join("");
  }

  function renderForm(model) {
    const values = Object.fromEntries(model.fields.map((field) => [field.key, field.default]));
    els.inputForm.innerHTML = model.fields.map((field) => {
      const input = field.type === "select" ? `<select id="field-${field.key}" name="${field.key}" aria-label="${fieldLabel(field)}">${field.options.map((option) => `<option value="${option.value}" ${String(option.value) === String(field.default) ? "selected" : ""}>${lang === "zh" ? option.label : option.enLabel}</option>`).join("")}</select>` : `<input id="field-${field.key}" name="${field.key}" type="number" inputmode="decimal" value="${field.default}" min="${field.min}" max="${field.max}" step="${field.step || 0.01}" required aria-label="${fieldLabel(field)}" />`;
      const hint = field.type === "select" ? (lang === "zh" ? "男 = 1 · 女 = 0" : "Male = 1 · Female = 0") : `${t("range")} ${formatNumber(field.min, field.decimals)} – ${formatNumber(field.max, field.decimals)}`;
      return `<div class="field"><div class="field-label"><label for="field-${field.key}">${fieldLabel(field)}<span>${field.symbol}</span></label><span class="field-unit">${fieldUnit(field)}</span></div><div class="field-control">${input}</div><div class="field-hint">${hint}</div></div>`;
    }).join("");
    els.inputForm.querySelectorAll("input, select").forEach((input) => { input.addEventListener("input", updateResult); input.addEventListener("change", updateResult); });
    if (els.formulaText) els.formulaText.textContent = lang === "zh" ? model.formula : model.formulaEn;
    els.headingModelChip.textContent = modelLabel(model);
    els.modelCode.textContent = modelLabel(model);
    els.completionStatus.textContent = `${t("filled")} ${model.fields.length} / ${model.fields.length}`;
    renderModelInfo(model);
    return values;
  }

  function readValues(model) {
    const values = {}; let valid = true;
    model.fields.forEach((field) => { const element = els.inputForm.elements[field.key]; const value = Number(element.value); values[field.key] = value; if (!Number.isFinite(value) || value < field.min || value > field.max) valid = false; });
    return { values, valid };
  }

  function calculate(model, values) {
    const terms = model.fields.map((field) => ({ field, contribution: field.beta * values[field.key] }));
    const a = model.intercept + terms.reduce((sum, term) => sum + term.contribution, 0);
    return { a, p: logistic(a), terms };
  }

  function interpretation(model, tier) {
    if (model.id === "oxt") { const zh = { veryLow: "肾小管萎缩/间质纤维化可能性极低", low: "肾小管萎缩/间质纤维化可能性较低", medium: "肾小管萎缩/间质纤维化概率中等，需进一步评估", high: "高度提示肾小管萎缩/间质纤维化", veryHigh: "肾小管萎缩/间质纤维化极高可能" }; const en = { veryLow: "Very low likelihood of tubular atrophy/interstitial fibrosis", low: "Low likelihood of tubular atrophy/interstitial fibrosis", medium: "Intermediate likelihood; further assessment needed", high: "High likelihood of tubular atrophy/interstitial fibrosis", veryHigh: "Very high likelihood of tubular atrophy/interstitial fibrosis" }; return lang === "zh" ? zh[tier.key] : en[tier.key]; }
    const zh = { veryLow: "IgA 肾病极低可能，需考虑非 IgA 肾病或非肾小球性原因", low: "IgA 肾病低可能，但仍需鉴别其他肾小球疾病", medium: "IgA 肾病概率中等，需进一步评估", high: "IgA 肾病高可能，高度怀疑 IgA 肾病", veryHigh: "IgA 肾病极高可能，建议按高度疑似 IgA 肾病处理" }; const en = { veryLow: "Very low likelihood of IgA nephropathy; consider non-IgAN or non-glomerular causes", low: "Low likelihood of IgA nephropathy; other glomerular diseases remain possible", medium: "Intermediate likelihood; further assessment is needed", high: "High likelihood of IgA nephropathy", veryHigh: "Very high likelihood; manage as highly suspected IgA nephropathy" }; return lang === "zh" ? zh[tier.key] : en[tier.key];
  }

  function updateResult() {
    const model = MODEL_DEFS[activeModelId]; const { values, valid } = readValues(model);
    if (!valid) { els.validationMessage.textContent = t("invalid"); els.completionStatus.textContent = t("pending"); return; }
    els.validationMessage.textContent = ""; els.completionStatus.textContent = `${t("filled")} ${model.fields.length} / ${model.fields.length}`;
    const result = calculate(model, values); const tier = getTier(result.p); const label = interpretation(model, tier);
    els.probabilityRing.style.setProperty("--probability", `${result.p * 100}%`); els.probabilityRing.style.background = `conic-gradient(${tier.color} ${result.p * 100}%, #e7eeef 0)`; els.probabilityValue.textContent = `${(result.p * 100).toFixed(2)}%`; els.aValue.textContent = result.a.toFixed(4); els.riskTitle.textContent = lang === "zh" ? tier.name : tier.enName; els.riskTitle.style.color = tier.color; els.riskInterpretation.textContent = label; els.adviceCallout.textContent = `${label}.`; els.adviceCallout.style.borderLeftColor = tier.color; els.adviceCallout.style.color = tier.color === "#d94d51" ? "#913538" : "#48652f"; els.adviceBody.textContent = model.recommendations[tier.key][lang === "zh" ? 0 : 1];
    renderRiskScale(result.p, tier); renderNomogram(model, values, result, tier); renderContributionPlot(model, result); renderModelInfo(model);
  }

  function setNomogramSource(model) {
    if (model.id === "oxt") {
      els.nomogramSource.textContent = lang === "zh" ? "标尺来源：Oxford-T 南方医建模队列（n=554）；变量范围采用观察到的最小值与最大值。" : "Scale source: Oxford-T Southern Medical modeling cohort (n=554); observed minimum and maximum values are used.";
    } else {
      els.nomogramSource.textContent = t("nomogramSource");
    }
  }

  function renderNomogramTierKey() {
    if (!els.nomogramTierKey) return;
    els.nomogramTierKey.innerHTML = RISK_TIERS.map((tier) => `<span><i style="background:${tier.color}"></i>${lang === "zh" ? tier.name : tier.enName}</span>`).join("");
  }

  function renderRiskScale(probability, tier) {
    const labels = lang === "zh" ? ["0%", "15%", "40%", "70%", "90%", "100%"] : ["0%", "15%", "40%", "70%", "90%", "100%"];
    els.riskScale.innerHTML = `<div class="risk-scale-track"><span></span><span></span><span></span><span></span><span></span></div><div class="risk-scale-marker" style="left:${probability * 100}%;background:${tier.color};color:${tier.color}"></div><div class="risk-scale-labels">${labels.map((label) => `<span>${label}</span>`).join("")}</div>`;
  }

  function getScale(model) {
    const ranges = model.fields.map((field) => { const minValue = field.plotMin ?? field.min; const maxValue = field.plotMax ?? field.max; const c1 = field.beta * minValue; const c2 = field.beta * maxValue; return { field, minValue, maxValue, minC: Math.min(c1, c2), maxC: Math.max(c1, c2), span: Math.abs(c2 - c1) }; });
    const maxSpan = Math.max(...ranges.map((range) => range.span), 1); const pointPerA = 100 / maxSpan; const aMin = model.intercept + ranges.reduce((sum, range) => sum + range.minC, 0); const aMax = model.intercept + ranges.reduce((sum, range) => sum + range.maxC, 0); return { ranges, pointPerA, aMin, aMax, totalMax: (aMax - aMin) * pointPerA };
  }

  function renderNomogram(model, values, result, tier) {
    const svg = els.nomogram; const ns = "http://www.w3.org/2000/svg"; const width = 1080; const left = 205; const right = 26; const axisWidth = width - left - right; const rowHeight = 62; const top = 47; const scale = getScale(model); const height = top + (model.fields.length + 3) * rowHeight + 25; svg.setAttribute("viewBox", `0 0 ${width} ${height}`); svg.setAttribute("height", String(height)); svg.innerHTML = "";
    setNomogramSource(model);
    renderNomogramTierKey();
    const add = (tag, attrs, value) => { const node = document.createElementNS(ns, tag); Object.entries(attrs || {}).forEach(([key, val]) => node.setAttribute(key, val)); if (value !== undefined) node.textContent = value; svg.appendChild(node); return node; }; const line = (x1, y1, x2, y2, attrs = {}) => add("line", { x1, y1, x2, y2, ...attrs }); const text = (x, y, value, attrs = {}) => add("text", { x, y, fill: "#66808a", "font-size": 10, ...attrs }, value); const xAt = (ratio) => left + clamp(ratio, 0, 1) * axisWidth;
    const aRatio = (a) => clamp((a - scale.aMin) / (scale.aMax - scale.aMin || 1), 0, 1); const pointX = (points) => xAt(points / 100);
    add("rect", { x: 0, y: 0, width, height, rx: 7, fill: "#fbfdfc" }); text(17, 22, t("pointsAxis"), { fill: "#315864", "font-size": 10, "font-weight": "800", "letter-spacing": "1" }); line(left, top, left + axisWidth, top, { stroke: "#839da5", "stroke-width": 1.5 });
    for (let i = 0; i <= 10; i += 1) { const x = xAt(i / 10); line(x, top, x, top + (i % 2 === 0 ? 10 : 6), { stroke: "#6e858d", "stroke-width": 1 }); text(x, top - 9, String(i * 10), { "text-anchor": "middle", fill: "#4d6a75", "font-size": 9 }); }
    scale.ranges.forEach((range, index) => { const field = range.field; const y = top + (index + 1) * rowHeight; const currentC = field.beta * values[field.key]; const points = (currentC - range.minC) * scale.pointPerA; const maxPoints = range.span * scale.pointPerA; const rowEnd = pointX(maxPoints); text(17, y + 4, field.symbol, { fill: "#284c5a", "font-size": 11, "font-weight": "700" }); text(17, y + 19, fieldLabel(field), { fill: "#8ca0a7", "font-size": 9 }); line(left, y, rowEnd, y, { stroke: "#a7b8bd", "stroke-width": 1.2 });
      for (let i = 0; i <= 10; i += 1) { const x = pointX(maxPoints * i / 10); line(x, y, x, y + (i % 2 === 0 ? 7 : 4), { stroke: "#79929a", "stroke-width": 1 }); const rawRatio = field.beta < 0 ? 1 - i / 10 : i / 10; const rawValue = range.minValue + rawRatio * (range.maxValue - range.minValue); let label = field.type === "select" ? (rawValue > .5 ? (lang === "zh" ? "男" : "Male") : (lang === "zh" ? "女" : "Female")) : formatNumber(rawValue, field.decimals); if (i === 0 || i === 5 || i === 10) text(x, y + 21, label, { "text-anchor": "middle", fill: "#708890", "font-size": 9 }); }
      const plottedPoints = clamp(points, 0, maxPoints); const mx = pointX(plottedPoints); line(mx, y - 9, mx, y + 11, { stroke: "#13a39e", "stroke-width": 2.2 }); add("circle", { cx: mx, cy: y, r: 5, fill: "#fff", stroke: "#13a39e", "stroke-width": 2.2 }); add("circle", { cx: mx, cy: y, r: 2, fill: "#13a39e" }); text(mx, y - 13, `${Math.round(plottedPoints)} ${t("points")}`, { "text-anchor": "middle", fill: "#087278", "font-size": 9, "font-weight": "800" }); const endLabelX = rowEnd >= left + axisWidth - 2 ? rowEnd - 2 : rowEnd + 5; text(endLabelX, y + 21, `${formatNumber(field.beta > 0 ? range.maxValue : range.minValue, field.decimals)} → ${Math.round(maxPoints)} ${t("points")}`, { "text-anchor": rowEnd >= left + axisWidth - 2 ? "end" : "start", fill: "#9aacb0", "font-size": 8 });
    });
    const totalY = top + (model.fields.length + 1) * rowHeight; const totalPoints = (result.a - scale.aMin) * scale.pointPerA; const totalX = xAt(totalPoints / (scale.totalMax || 1)); text(17, totalY + 4, t("total"), { fill: "#284c5a", "font-size": 11, "font-weight": "800" }); line(left, totalY, left + axisWidth, totalY, { stroke: "#315864", "stroke-width": 2 }); for (let i = 0; i <= 4; i += 1) { const x = xAt(i / 4); line(x, totalY, x, totalY + 8, { stroke: "#315864", "stroke-width": 1.3 }); text(x, totalY + 22, formatNumber(scale.totalMax * i / 4, 1), { "text-anchor": "middle", fill: "#536e79", "font-size": 9 }); } add("circle", { cx: totalX, cy: totalY, r: 5.5, fill: tier.color }); text(totalX, totalY - 14, `${formatNumber(totalPoints, 1)} ${t("points")}`, { "text-anchor": "middle", fill: tier.color, "font-size": 10, "font-weight": "850" });
    const probabilityY = totalY + rowHeight;
    text(17, probabilityY + 4, t("riskProbability"), { fill: "#284c5a", "font-size": 11, "font-weight": "800" });
    const bandY = probabilityY - 8;
    const probabilityToX = (probability) => xAt(aRatio(logit(probability === 0 ? .0001 : probability === 1 ? .9999 : probability)));
    const bands = [{ from: 0, to: .15, color: "#77c887" }, { from: .15, to: .4, color: "#b5dc9d" }, { from: .4, to: .7, color: "#efd86b" }, { from: .7, to: .9, color: "#f2a06b" }, { from: .9, to: 1, color: "#d85b61" }];
    bands.forEach((band) => { const x1 = probabilityToX(band.from); const x2 = probabilityToX(band.to); add("rect", { x: Math.min(x1, x2), y: bandY, width: Math.abs(x2 - x1), height: 14, fill: band.color, opacity: .82 }); });
    [0, .15, .4, .7, .9, 1].forEach((probability) => { const x = probabilityToX(probability); line(x, bandY + 14, x, bandY + 21, { stroke: "#4e6873", "stroke-width": 1.2 }); text(x, bandY + 33, `${Math.round(probability * 100)}%`, { "text-anchor": "middle", fill: "#536e79", "font-size": 9 }); });
    const pX = xAt(aRatio(result.a)); line(totalX, totalY + 8, pX, bandY - 8, { stroke: tier.color, "stroke-width": 1.5, "stroke-dasharray": "4 4", opacity: .72 }); add("circle", { cx: pX, cy: bandY - 8, r: 4.7, fill: tier.color }); line(pX, bandY - 8, pX, bandY + 19, { stroke: tier.color, "stroke-width": 2.5 }); text(pX, bandY - 17, `${(result.p * 100).toFixed(1)}%`, { "text-anchor": "middle", fill: tier.color, "font-size": 10, "font-weight": "850" }); text(left + axisWidth, probabilityY + 33, t("scoreMapping"), { "text-anchor": "end", fill: "#8da0a7", "font-size": 8 });
  }

  function interpolateColor(ratio) { const stops = [[61, 133, 198], [134, 101, 189], [223, 90, 82]]; const segment = clamp(ratio, 0, 1) * 2; const index = Math.min(1, Math.floor(segment)); const local = segment - index; const a = stops[index]; const b = stops[index + 1]; return `rgb(${Math.round(a[0] + (b[0] - a[0]) * local)},${Math.round(a[1] + (b[1] - a[1]) * local)},${Math.round(a[2] + (b[2] - a[2]) * local)})`; }

  function renderContributionPlot(model, result) {
    const svg = els.contributionPlot; const ns = "http://www.w3.org/2000/svg"; const width = 1100; const left = 190; const barWidth = 205; const scatterLeft = 450; const scatterWidth = 590; const top = 62; const rowHeight = 54; const height = top + result.terms.length * rowHeight + 48; svg.setAttribute("viewBox", `0 0 ${width} ${height}`); svg.setAttribute("height", String(height)); svg.innerHTML = "";
    const add = (tag, attrs, value) => { const node = document.createElementNS(ns, tag); Object.entries(attrs || {}).forEach(([key, val]) => node.setAttribute(key, val)); if (value !== undefined) node.textContent = value; svg.appendChild(node); return node; }; const line = (x1, y1, x2, y2, attrs = {}) => add("line", { x1, y1, x2, y2, ...attrs }); const text = (x, y, value, attrs = {}) => add("text", { x, y, fill: "#67818b", "font-size": 10, ...attrs }, value);
    const order = new Map((model.importanceOrder || model.fields.map((field) => field.key)).map((key, index) => [key, index])); const sorted = result.terms.slice().sort((a, b) => (order.get(a.field.key) ?? 999) - (order.get(b.field.key) ?? 999) || Math.abs(b.contribution) - Math.abs(a.contribution)); const maxBar = Math.max(...sorted.map((term) => Math.abs(term.contribution)), 1); const maxScatter = Math.max(...model.fields.map((field) => Math.abs(field.beta * ((field.plotMax ?? field.max) - (field.plotMin ?? field.min)) / 2)), 1); const center = scatterLeft + scatterWidth / 2; const scatterX = (value) => center + clamp(value / maxScatter, -1, 1) * (scatterWidth / 2 - 18);
    add("rect", { x: 0, y: 0, width, height, rx: 7, fill: "#fbfdfc" }); text(17, 24, "FEATURE", { fill: "#315864", "font-size": 10, "font-weight": "800", "letter-spacing": "1" }); text(left, 24, "|A term|", { fill: "#315864", "font-size": 10, "font-weight": "800" }); text(scatterLeft, 24, t("scatterAxis"), { fill: "#315864", "font-size": 10, "font-weight": "800" }); line(scatterLeft, 31, scatterLeft + scatterWidth, 31, { stroke: "#d9e6e5" }); line(center, 38, center, height - 25, { stroke: "#99abb0", "stroke-width": 1.4 }); [-1, -.5, 0, .5, 1].forEach((v) => { const x = scatterX(v * maxScatter); line(x, 31, x, 37, { stroke: "#6d8790" }); text(x, 20, formatNumber(v * maxScatter, 2), { "text-anchor": "middle", fill: "#738990", "font-size": 8 }); });
    sorted.forEach(({ field, contribution }, index) => { const y = top + index * rowHeight; const range = { min: field.plotMin ?? field.min, max: field.plotMax ?? field.max }; const mid = (range.min + range.max) / 2; text(17, y + 5, fieldLabel(field), { fill: "#294d5a", "font-size": 11, "font-weight": "700" }); text(17, y + 20, field.symbol, { fill: "#9aabb0", "font-size": 9 }); line(0, y + 33, width, y + 33, { stroke: "#edf2f1" }); add("rect", { x: left, y: y - 8, width: barWidth, height: 17, rx: 4, fill: "#edf3f2" }); add("rect", { x: left, y: y - 8, width: Math.max(3, Math.abs(contribution) / maxBar * barWidth), height: 17, rx: 4, fill: contribution >= 0 ? "#1aa7a1" : "#d96a61" }); text(left + barWidth + 12, y + 5, `${contribution >= 0 ? "+" : ""}${contribution.toFixed(3)}`, { fill: contribution >= 0 ? "#087278" : "#a84443", "font-size": 9, "font-weight": "800" });
      const count = field.type === "select" ? 2 : 19; for (let j = 0; j < count; j += 1) { const value = field.type === "select" ? (j === 0 ? 0 : 1) : range.min + (range.max - range.min) * j / (count - 1); const delta = field.beta * (value - mid); const jitter = Math.sin((j + 1) * (index + 2) * 1.37) * 8; add("circle", { cx: scatterX(delta), cy: y + jitter, r: field.type === "select" ? 5.2 : 3.7, fill: interpolateColor((value - range.min) / (range.max - range.min || 1)), opacity: .9 }); }
      const term = result.terms.find((item) => item.field.key === field.key); const currentValue = term.contribution / field.beta; const currentX = scatterX(field.beta * (currentValue - mid)); line(currentX, y - 15, currentX, y + 15, { stroke: "#13a39e", "stroke-width": 2 }); add("circle", { cx: currentX, cy: y, r: 5, fill: "#fff", stroke: "#13a39e", "stroke-width": 2.2 });
    });
    text(scatterLeft, height - 9, lang === "zh" ? "负向 ← 降低模型输出" : "Negative ← lowers model output", { fill: "#8aa0a6", "font-size": 9 }); text(scatterLeft + scatterWidth, height - 9, lang === "zh" ? "提高模型输出 → 正向" : "Positive → raises model output", { "text-anchor": "end", fill: "#8aa0a6", "font-size": 9 });
  }

  function renderModelInfo(model) {
    const names = model.fields.map(fieldLabel).join(lang === "zh" ? "、" : ", ");
    const isOxT = model.id === "oxt";
    const source = isOxT ? (lang === "zh" ? "Oxford-T 南方医建模队列（n=554）" : "Oxford-T Southern Medical modeling cohort (n=554)") : (lang === "zh" ? "IgAN 南方医建模队列（n=1308）" : "IgAN Southern Medical modeling cohort (n=1308)");
    const purpose = lang === "zh" ? `基于逻辑回归的${model.interpretation}辅助评估。` : `Logistic regression support tool for ${model.interpretationEn}.`;
    const rangeText = isOxT ? (lang === "zh" ? "OxT 列线图范围采用 Oxford-T 南方医建模队列（n=554）的观察值。" : "OxT nomogram ranges use observed values from the Oxford-T Southern Medical modeling cohort (n=554).") : (lang === "zh" ? "uBASE / BASE 的列线图范围采用 IgAN 南方医建模队列（n=1308）的观察值。" : "uBASE / BASE nomogram ranges use observed values from the IgAN Southern Medical modeling cohort (n=1308).");
    els.modelInfoContent.innerHTML = `<dl><dt>${lang === "zh" ? "模型用途" : "Purpose"}</dt><dd>${purpose}</dd><dt>${lang === "zh" ? "输入变量" : "Inputs"}</dt><dd>${names}. ${lang === "zh" ? "连续变量使用真实检查值。" : "Continuous values are entered as measured."}</dd><dt>${lang === "zh" ? "数据来源" : "Data source"}</dt><dd>${source}. ${rangeText}</dd><dt>${lang === "zh" ? "运行方式" : "Runtime"}</dt><dd>${lang === "zh" ? "计算在浏览器端完成，不调用远程接口。" : "All calculations run in the browser without a remote API."}</dd></dl>`;
  }

  function selectModel(modelId) { if (!MODEL_DEFS[modelId]) return; activeModelId = modelId; renderModelList(); renderForm(MODEL_DEFS[activeModelId]); updateResult(); }
  els.modelList.addEventListener("click", (event) => { const button = event.target.closest("[data-model]"); if (button) selectModel(button.dataset.model); });
  document.querySelector("#languageToggle").addEventListener("click", () => { lang = lang === "zh" ? "en" : "zh"; updateStaticText(); renderModelList(); renderForm(MODEL_DEFS[activeModelId]); updateResult(); });
  document.querySelector("#resetButton").addEventListener("click", () => { renderForm(MODEL_DEFS[activeModelId]); updateResult(); });
  document.querySelector("#printButton").addEventListener("click", () => window.print());
  els.inputForm.addEventListener("submit", (event) => event.preventDefault());
  updateStaticText(); renderModelList(); renderForm(MODEL_DEFS[activeModelId]); updateResult();
})();
