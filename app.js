(() => {
  "use strict";

  const MODEL_DEFS = {
    uBASE: {
      id: "uBASE",
      name: "IgAN-uBASE",
      subtitle: "基础变量 + 尿标志物",
      outcome: "IgA 肾病",
      intercept: 0.75,
      formula: "A = 0.75 − 0.100897×Age + 0.780017×Sex + 0.119005×ALB − 0.034007×eGFRCr + 1.014081×IgA − 0.025577×U-α1MG",
      fullFormula: "P = exp(A) / (1 + exp(A)); A = 0.75 − 0.100897151392959×Age + 0.780017201693036×Sex + 0.119005247955097×ALB − 0.034007361661803×eGFRCr + 1.01408077717786×IgA − 0.025576547623995×U-α1MG",
      fields: [
        { key: "age", label: "年龄", symbol: "Age", unit: "岁", type: "number", min: 18, max: 90, step: 1, decimals: 0, default: 18, beta: -0.100897151392959 },
        { key: "sex", label: "性别", symbol: "Sex", unit: "", type: "select", options: [{ value: 1, label: "男" }, { value: 0, label: "女" }], default: 1, beta: 0.780017201693036 },
        { key: "alb", label: "白蛋白", symbol: "ALB", unit: "g/L", type: "number", min: 0, max: 60, step: 0.1, decimals: 1, default: 34.6, beta: 0.119005247955097 },
        { key: "egfr", label: "估算肾小球滤过率", symbol: "eGFRCr", unit: "mL/min/1.73m²", type: "number", min: 0, max: 200, step: 0.01, decimals: 2, default: 96.14, beta: -0.034007361661803 },
        { key: "iga", label: "血清 IgA", symbol: "IgA", unit: "g/L", type: "number", min: 0, max: 9, step: 0.01, decimals: 2, default: 3.25, beta: 1.01408077717786 },
        { key: "ualpha1mg", label: "尿 α1 微球蛋白", symbol: "U-α1MG", unit: "mg/L", type: "number", min: 0, max: 500, step: 0.1, decimals: 1, default: 7.3, beta: -0.025576547623995 }
      ],
      interpretation: "IgA 肾病",
      recommendations: {
        veryLow: "建议综合患者临床病史、检验检查指标，进一步鉴别薄基底膜肾病、Alport 综合征、膜性肾病、FSGS、微小病变、C3 肾小球病等。",
        low: "建议综合患者临床病史、检验检查指标鉴别诊断其他原发性肾小球疾病。必要时完善补体、ANA、ANCA、抗 GBM、PLA2R、感染筛查、血清免疫球蛋白、血尿蛋白电泳等。",
        medium: "建议肾病专科系统评估。完善尿红细胞形态、24 h 尿蛋白或 UPCR、C3、C4、ANA、抗 dsDNA、ANCA、抗 GBM、PLA2R、肾脏超声等检验检查。若蛋白尿持续、eGFR 下降、高血压或尿沉渣活动明显，应评估肾活检必要性。",
        high: "建议尽快肾病科就诊。若存在持续蛋白尿、镜下血尿伴蛋白尿、反复肉眼血尿、eGFR 下降、高血压、ALB 降低或 LDL-C 升高，应重点评估肾活检适应证。",
        veryHigh: "建议进入高度疑似 IgAN 诊疗流程，尽快完成肾病专科系统评估。若无禁忌，优先考虑肾活检，以明确是否为 IgAN、是否合并新月体、节段硬化、间质纤维化/小管萎缩等病理损伤，并据此决定支持治疗、RAS 抑制、SGLT2 抑制剂及是否需要免疫治疗。"
      }
    },
    base: {
      id: "base",
      name: "IgAN-BASE",
      subtitle: "基础临床变量",
      outcome: "IgA 肾病",
      intercept: -3.05,
      formula: "A = −3.05 − 0.092950×Age + 1.025188×Sex + 0.169831×ALB − 0.024618×eGFRCr + 1.074624×IgA",
      fullFormula: "P = exp(A) / (1 + exp(A)); A = −3.05 − 0.092949886218316×Age + 1.0251875681476×Sex + 0.169831025161927×ALB − 0.0246182086243941×eGFRCr + 1.07462360040374×IgA",
      fields: [
        { key: "age", label: "年龄", symbol: "Age", unit: "岁", type: "number", min: 18, max: 90, step: 1, decimals: 0, default: 18, beta: -0.092949886218316 },
        { key: "sex", label: "性别", symbol: "Sex", unit: "", type: "select", options: [{ value: 1, label: "男" }, { value: 0, label: "女" }], default: 1, beta: 1.0251875681476 },
        { key: "alb", label: "白蛋白", symbol: "ALB", unit: "g/L", type: "number", min: 0, max: 60, step: 0.1, decimals: 1, default: 34.6, beta: 0.169831025161927 },
        { key: "egfr", label: "估算肾小球滤过率", symbol: "eGFRCr", unit: "mL/min/1.73m²", type: "number", min: 0, max: 200, step: 0.01, decimals: 2, default: 96.14, beta: -0.0246182086243941 },
        { key: "iga", label: "血清 IgA", symbol: "IgA", unit: "g/L", type: "number", min: 0, max: 9, step: 0.01, decimals: 2, default: 3.25, beta: 1.07462360040374 }
      ],
      interpretation: "IgA 肾病",
      recommendations: {
        veryLow: "建议综合患者临床病史、检验检查指标，进一步鉴别薄基底膜肾病、Alport 综合征、膜性肾病、FSGS、微小病变、C3 肾小球病等。",
        low: "建议综合患者临床病史、检验检查指标鉴别诊断其他原发性肾小球疾病。必要时完善补体、ANA、ANCA、抗 GBM、PLA2R、感染筛查、血清免疫球蛋白、血尿蛋白电泳等。",
        medium: "建议肾病专科系统评估。完善尿红细胞形态、24 h 尿蛋白或 UPCR、C3、C4、ANA、抗 dsDNA、ANCA、抗 GBM、PLA2R、肾脏超声等检验检查。若蛋白尿持续、eGFR 下降、高血压或尿沉渣活动明显，应评估肾活检必要性。",
        high: "建议尽快肾病科就诊。若存在持续蛋白尿、镜下血尿伴蛋白尿、反复肉眼血尿、eGFR 下降、高血压、ALB 降低或 LDL-C 升高，应重点评估肾活检适应证。",
        veryHigh: "建议进入高度疑似 IgAN 诊疗流程，尽快完成肾病专科系统评估。若无禁忌，优先考虑肾活检，以明确是否为 IgAN、是否合并新月体、节段硬化、间质纤维化/小管萎缩等病理损伤，并据此决定支持治疗、RAS 抑制、SGLT2 抑制剂及是否需要免疫治疗。"
      }
    },
    oxt: {
      id: "oxt",
      name: "IgAN-OxT",
      subtitle: "肾小管-间质损伤风险",
      outcome: "肾小管萎缩/间质纤维化",
      intercept: 9.28 - 1.54635793205125,
      formula: "A = 9.28 − 0.073423×Age − 0.077176×eGFRCr + 0.561605×U-24hTP − 1.546358 + 0.092458×LDL-C",
      fullFormula: "P = exp(A) / (1 + exp(A)); A = 9.28 − 0.0734226757215475×Age − 0.0771762735979292×eGFRCr + 0.56160497842656×U-24hTP − 1.54635793205125 + 0.092457733083033×LDL-C",
      fields: [
        { key: "age", label: "年龄", symbol: "Age", unit: "岁", type: "number", min: 18, max: 90, step: 1, decimals: 0, default: 34, beta: -0.0734226757215475 },
        { key: "egfr", label: "估算肾小球滤过率", symbol: "eGFRCr", unit: "mL/min/1.73m²", type: "number", min: 0, max: 200, step: 0.01, decimals: 2, default: 80, beta: -0.0771762735979292 },
        { key: "protein", label: "24 h 尿蛋白", symbol: "U-24hTP", unit: "g/24 h", type: "number", min: 0, max: 10, step: 0.01, decimals: 2, default: 1.2, beta: 0.56160497842656 },
        { key: "ldlc", label: "低密度脂蛋白", symbol: "LDL-C", unit: "mmol/L", type: "number", min: 0, max: 10, step: 0.01, decimals: 2, default: 3.1, beta: 0.092457733083033 }
      ],
      interpretation: "肾小管萎缩/间质纤维化",
      recommendations: {
        veryLow: "当前模型提示肾小管萎缩/间质纤维化可能性较低，仍建议结合肾功能、蛋白尿及肾活检病理综合判断。",
        low: "当前模型提示相关病理损伤可能性较低，建议结合临床病史、尿蛋白定量、eGFR 变化趋势及影像学结果随访评估。",
        medium: "建议肾病专科系统评估，结合蛋白尿、eGFR 下降速度、血压及肾脏超声等资料，必要时评估肾活检病理分层的价值。",
        high: "建议尽快肾病科就诊，重点关注持续蛋白尿、eGFR 下降、高血压及血脂异常，并结合肾活检结果评估间质纤维化/小管萎缩程度。",
        veryHigh: "模型提示肾小管萎缩/间质纤维化可能性极高，建议尽快完成肾病专科系统评估；若具备适应证且无禁忌，应结合肾活检明确病理损伤范围，并据此制定支持治疗和肾脏保护方案。"
      }
    }
  };

  const RISK_TIERS = [
    { key: "veryLow", max: 0.15, name: "极低风险", short: "极低", color: "#69be7c", bg: "#e3f4e5" },
    { key: "low", max: 0.4, name: "低风险", short: "低", color: "#83bb72", bg: "#eaf5df" },
    { key: "medium", max: 0.7, name: "中等风险", short: "中等", color: "#c9a632", bg: "#fff7d4" },
    { key: "high", max: 0.9, name: "高风险", short: "高", color: "#db794c", bg: "#fff0e5" },
    { key: "veryHigh", max: 1, name: "极高风险", short: "极高", color: "#d94d51", bg: "#ffe4e2" }
  ];

  const els = {
    modelList: document.querySelector("#modelList"),
    headingModelChip: document.querySelector("#headingModelChip"),
    inputForm: document.querySelector("#inputForm"),
    formulaText: document.querySelector("#formulaText"),
    completionStatus: document.querySelector("#completionStatus"),
    validationMessage: document.querySelector("#validationMessage"),
    probabilityRing: document.querySelector("#probabilityRing"),
    probabilityValue: document.querySelector("#probabilityValue"),
    aValue: document.querySelector("#aValue"),
    modelCode: document.querySelector("#modelCode"),
    riskTitle: document.querySelector("#riskTitle"),
    riskInterpretation: document.querySelector("#riskInterpretation"),
    riskScale: document.querySelector("#riskScale"),
    adviceCallout: document.querySelector("#adviceCallout"),
    adviceBody: document.querySelector("#adviceBody"),
    nomogram: document.querySelector("#nomogram"),
    contributionList: document.querySelector("#contributionList"),
    modelInfoContent: document.querySelector("#modelInfoContent")
  };

  let activeModelId = "uBASE";
  let currentValues = {};

  function formatNumber(value, decimals = 2) {
    if (!Number.isFinite(value)) return "—";
    return Number(value).toFixed(decimals).replace(/\.?0+$/, "");
  }

  function logistic(a) {
    if (a >= 0) {
      const z = Math.exp(-a);
      return 1 / (1 + z);
    }
    const z = Math.exp(a);
    return z / (1 + z);
  }

  function getTier(probability) {
    return RISK_TIERS.find((tier) => probability < tier.max) || RISK_TIERS[RISK_TIERS.length - 1];
  }

  function renderModelList() {
    els.modelList.innerHTML = Object.values(MODEL_DEFS).map((model, index) => `
      <button class="model-button ${model.id === activeModelId ? "active" : ""}" data-model="${model.id}" type="button" aria-pressed="${model.id === activeModelId}">
        <span class="model-bullet">0${index + 1}</span>
        <span><strong>${model.name}</strong><small>${model.subtitle}</small></span>
      </button>
    `).join("");
  }

  function renderForm(model) {
    currentValues = Object.fromEntries(model.fields.map((field) => [field.key, field.default]));
    els.inputForm.innerHTML = model.fields.map((field) => {
      const input = field.type === "select"
        ? `<select id="field-${field.key}" name="${field.key}" aria-label="${field.label}">${field.options.map((option) => `<option value="${option.value}" ${String(option.value) === String(field.default) ? "selected" : ""}>${option.label}</option>`).join("")}</select>`
        : `<input id="field-${field.key}" name="${field.key}" type="number" inputmode="decimal" value="${field.default}" min="${field.min}" max="${field.max}" step="${field.step}" required aria-label="${field.label}" />`;
      return `<div class="field"><div class="field-label"><label for="field-${field.key}">${field.label}<span>${field.symbol}</span></label><span class="field-unit">${field.unit}</span></div><div class="field-control">${input}</div><div class="field-hint">${field.type === "select" ? "男 = 1 · 女 = 0" : `范围 ${formatNumber(field.min, field.decimals)} – ${formatNumber(field.max, field.decimals)}`}</div></div>`;
    }).join("");

    els.inputForm.querySelectorAll("input, select").forEach((input) => input.addEventListener("input", updateResult));
    els.inputForm.querySelectorAll("input, select").forEach((input) => input.addEventListener("change", updateResult));
    els.formulaText.textContent = model.formula;
    els.headingModelChip.textContent = model.name;
    els.modelCode.textContent = model.name;
    els.completionStatus.textContent = `已填 ${model.fields.length} / ${model.fields.length}`;
    renderModelInfo(model);
  }

  function readValues(model) {
    const values = {};
    let valid = true;
    model.fields.forEach((field) => {
      const element = els.inputForm.elements[field.key];
      const value = field.type === "select" ? Number(element.value) : Number(element.value);
      values[field.key] = value;
      if (!Number.isFinite(value) || value < field.min || value > field.max) valid = false;
    });
    return { values, valid };
  }

  function calculate(model, values) {
    const terms = model.fields.map((field) => ({ field, contribution: field.beta * values[field.key] }));
    const a = model.intercept + terms.reduce((sum, term) => sum + term.contribution, 0);
    return { a, p: logistic(a), terms };
  }

  function updateResult() {
    const model = MODEL_DEFS[activeModelId];
    const { values, valid } = readValues(model);
    currentValues = values;
    if (!valid) {
      els.validationMessage.textContent = "请检查输入范围后再查看结果。";
      els.completionStatus.textContent = "待检查输入";
      return;
    }
    els.validationMessage.textContent = "";
    els.completionStatus.textContent = `已填 ${model.fields.length} / ${model.fields.length}`;
    const result = calculate(model, values);
    const tier = getTier(result.p);
    els.probabilityRing.style.setProperty("--probability", `${result.p * 100}%`);
    els.probabilityRing.style.background = `conic-gradient(${tier.color} ${result.p * 100}%, #e8eef0 0)`;
    els.probabilityValue.textContent = `${(result.p * 100).toFixed(2)}%`;
    els.aValue.textContent = result.a.toFixed(4);
    els.riskTitle.textContent = tier.name;
    els.riskTitle.style.color = tier.color;
    els.riskInterpretation.textContent = getInterpretation(model, tier);
    els.adviceCallout.textContent = `${getInterpretation(model, tier)}。`;
    els.adviceCallout.style.borderLeftColor = tier.color;
    els.adviceCallout.style.color = tier.color === "#d94d51" ? "#913538" : "#425d32";
    els.adviceBody.textContent = model.recommendations[tier.key];
    renderRiskScale(result.p, tier);
    renderNomogram(model, values, result, tier);
    renderContributions(model, result);
  }

  function getInterpretation(model, tier) {
    if (model.id === "oxt") {
      const map = { veryLow: "肾小管萎缩/间质纤维化可能性极低", low: "肾小管萎缩/间质纤维化可能性较低", medium: "肾小管萎缩/间质纤维化概率中等，需进一步评估", high: "高度提示肾小管萎缩/间质纤维化", veryHigh: "肾小管萎缩/间质纤维化极高可能" };
      return map[tier.key];
    }
    const map = { veryLow: "IgA 肾病极低可能，需考虑非 IgA 肾病或非肾小球性原因", low: "IgA 肾病低可能，但仍需鉴别其他肾小球疾病", medium: "IgA 肾病概率中等，需进一步评估", high: "IgA 肾病高可能，高度怀疑 IgA 肾病", veryHigh: "IgA 肾病极高可能，建议按高度疑似 IgA 肾病处理" };
    return map[tier.key];
  }

  function renderRiskScale(probability, tier) {
    els.riskScale.innerHTML = `<div class="risk-scale-track"><span></span><span></span><span></span><span></span><span></span></div><div class="risk-scale-marker" style="left:${Math.min(100, probability * 100)}%; background:${tier.color}"></div><div class="risk-scale-labels"><span>0%</span><span>15%</span><span>40%</span><span>70%</span><span>90%</span><span>100%</span></div>`;
  }

  function fieldRange(field) {
    const minValue = field.type === "select" ? Math.min(...field.options.map((option) => Number(option.value))) : field.min;
    const maxValue = field.type === "select" ? Math.max(...field.options.map((option) => Number(option.value))) : field.max;
    const values = [minValue, maxValue];
    return { minValue, maxValue, min: Math.min(field.beta * values[0], field.beta * values[1]), max: Math.max(field.beta * values[0], field.beta * values[1]) };
  }

  function renderNomogram(model, values, result, tier) {
    const svg = els.nomogram;
    const ns = "http://www.w3.org/2000/svg";
    const width = 980;
    const left = 186;
    const right = 30;
    const axisWidth = width - left - right;
    const rowHeight = 60;
    const top = 37;
    const totalMax = model.fields.length * 100;
    const height = top + (model.fields.length + 3) * rowHeight + 17;
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("height", String(height));
    svg.innerHTML = "";
    const add = (tag, attrs, text) => { const node = document.createElementNS(ns, tag); Object.entries(attrs || {}).forEach(([key, value]) => node.setAttribute(key, value)); if (text !== undefined) node.textContent = text; svg.appendChild(node); return node; };
    const line = (x1, y1, x2, y2, attrs = {}) => add("line", { x1, y1, x2, y2, ...attrs });
    const text = (x, y, value, attrs = {}) => add("text", { x, y, fill: "#667e89", "font-size": 10, ...attrs }, value);
    const xAt = (ratio) => left + Math.max(0, Math.min(1, ratio)) * axisWidth;

    add("rect", { x: 0, y: 0, width, height, rx: 6, fill: "#fbfdfd" });
    text(17, 19, "POINT", { fill: "#315566", "font-size": 10, "font-weight": "700", "letter-spacing": "1.2" });
    line(left, top, left + axisWidth, top, { stroke: "#8da2ab", "stroke-width": 1.5 });
    for (let i = 0; i <= 10; i += 1) {
      const x = xAt(i / 10);
      line(x, top, x, top + (i % 2 === 0 ? 9 : 6), { stroke: "#6e858f", "stroke-width": 1 });
      text(x, top - 9, String(i * 10), { "text-anchor": "middle", fill: "#536e79", "font-size": 9 });
    }

    const allRanges = model.fields.map(fieldRange);
    model.fields.forEach((field, index) => {
      const y = top + (index + 1) * rowHeight;
      const range = allRanges[index];
      const contribution = field.beta * values[field.key];
      const point = (contribution - range.min) / (range.max - range.min || 1) * 100;
      const valueRatio = point / 100;
      text(17, y + 4, field.symbol, { fill: "#284b5b", "font-size": 11, "font-weight": "650" });
      text(17, y + 19, field.label, { fill: "#98a8ae", "font-size": 9 });
      line(left, y, left + axisWidth, y, { stroke: "#a8b9bf", "stroke-width": 1.3 });
      for (let i = 0; i <= 10; i += 1) {
        const x = xAt(i / 10);
        line(x, y, x, y + (i % 2 === 0 ? 7 : 4), { stroke: "#78909b", "stroke-width": 1 });
        const rawRatio = field.beta < 0 ? 1 - i / 10 : i / 10;
        const rawValue = range.minValue + rawRatio * (range.maxValue - range.minValue);
        let label = formatNumber(rawValue, field.decimals);
        if (field.type === "select") label = rawValue > 0.5 ? "男" : "女";
        const showLabel = field.type === "select" ? (i === 0 || i === 10) : (i === 0 || i === 5 || i === 10);
        if (showLabel) text(x, y + 21, label, { "text-anchor": "middle", fill: "#70858e", "font-size": 9 });
      }
      const markerX = xAt(valueRatio);
      line(markerX, y - 8, markerX, y + 11, { stroke: "#16a6a0", "stroke-width": 2.2 });
      add("circle", { cx: markerX, cy: y, r: 5, fill: "#fff", stroke: "#16a6a0", "stroke-width": 2.3 });
      add("circle", { cx: markerX, cy: y, r: 2, fill: "#16a6a0" });
      text(markerX, y - 12, `${Math.round(point)} pt`, { "text-anchor": "middle", fill: "#0d7f82", "font-size": 9, "font-weight": "700" });
    });

    const totalY = top + (model.fields.length + 1) * rowHeight;
    const total = model.fields.reduce((sum, field, index) => {
      const range = allRanges[index];
      return sum + ((field.beta * values[field.key] - range.min) / (range.max - range.min || 1) * 100);
    }, 0);
    text(17, totalY + 4, "总分", { fill: "#284b5b", "font-size": 11, "font-weight": "700" });
    line(left, totalY, left + axisWidth, totalY, { stroke: "#315566", "stroke-width": 2 });
    for (let i = 0; i <= 10; i += 1) {
      const x = xAt(i / 10);
      line(x, totalY, x, totalY + 8, { stroke: "#315566", "stroke-width": i % 2 === 0 ? 1.7 : 1 });
      if (i % 2 === 0) text(x, totalY + 22, String(Math.round(totalMax * i / 10)), { "text-anchor": "middle", fill: "#536e79", "font-size": 9 });
    }
    const totalX = xAt(total / totalMax);
    line(totalX, totalY - 9, totalX, totalY + 13, { stroke: tier.color, "stroke-width": 2.7 });
    add("circle", { cx: totalX, cy: totalY, r: 5.5, fill: tier.color });
    text(totalX, totalY - 14, `${Math.round(total)} pt`, { "text-anchor": "middle", fill: tier.color, "font-size": 10, "font-weight": "800" });

    const probabilityY = totalY + rowHeight;
    text(17, probabilityY + 4, "风险概率", { fill: "#284b5b", "font-size": 11, "font-weight": "700" });
    const bandY = probabilityY - 8;
    const bands = [{ from: 0, to: .15, color: "#75c889" }, { from: .15, to: .4, color: "#badf9d" }, { from: .4, to: .7, color: "#f0da6a" }, { from: .7, to: .9, color: "#f2a16b" }, { from: .9, to: 1, color: "#d95b5f" }];
    bands.forEach((band) => add("rect", { x: xAt(band.from), y: bandY, width: axisWidth * (band.to - band.from), height: 14, fill: band.color, opacity: .82 }));
    [0, .15, .4, .7, .9, 1].forEach((value) => { const x = xAt(value); line(x, bandY + 14, x, bandY + 21, { stroke: "#4e6873", "stroke-width": 1.2 }); text(x, bandY + 33, `${Math.round(value * 100)}%`, { "text-anchor": "middle", fill: "#536e79", "font-size": 9 }); });
    const pX = xAt(result.p);
    line(pX, bandY - 8, pX, bandY + 19, { stroke: tier.color, "stroke-width": 2.5 });
    add("circle", { cx: pX, cy: bandY - 8, r: 4.5, fill: tier.color });
    text(pX, bandY - 17, `${(result.p * 100).toFixed(1)}%`, { "text-anchor": "middle", fill: tier.color, "font-size": 10, "font-weight": "800" });
  }

  function renderContributions(model, result) {
    const maxAbs = Math.max(...result.terms.map((term) => Math.abs(term.contribution)), 1);
    els.contributionList.innerHTML = result.terms.slice().sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution)).map(({ field, contribution }) => `<div class="contribution-row"><span class="contribution-name">${field.label}</span><span class="contribution-track"><span class="contribution-bar ${contribution >= 0 ? "positive" : "negative"}" style="display:block;width:${Math.max(4, Math.abs(contribution) / maxAbs * 100)}%"></span></span><span class="contribution-value">${contribution >= 0 ? "+" : ""}${contribution.toFixed(3)}</span></div>`).join("");
  }

  function renderModelInfo(model) {
    const fieldNames = model.fields.map((field) => field.label).join("、");
    els.modelInfoContent.innerHTML = `<dl><dt>模型用途</dt><dd>基于逻辑回归的${model.interpretation}辅助评估。</dd><dt>输入变量</dt><dd>${fieldNames}。连续变量使用真实检查值。</dd><dt>本地运行</dt><dd>模型计算在浏览器端完成，不调用远程接口。</dd></dl><div class="model-formula">${model.fullFormula}</div>`;
  }

  function selectModel(modelId) {
    if (!MODEL_DEFS[modelId]) return;
    activeModelId = modelId;
    renderModelList();
    renderForm(MODEL_DEFS[modelId]);
    updateResult();
  }

  els.modelList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-model]");
    if (button) selectModel(button.dataset.model);
  });

  document.querySelector("#resetButton").addEventListener("click", () => {
    renderForm(MODEL_DEFS[activeModelId]);
    updateResult();
  });

  document.querySelector("#printButton").addEventListener("click", () => window.print());
  els.inputForm.addEventListener("submit", (event) => event.preventDefault());

  renderModelList();
  renderForm(MODEL_DEFS[activeModelId]);
  updateResult();
})();
