(() => {
  "use strict";

  const DATA_RANGES = {
    age: { min: 0, max: 90 },
    sex: { min: 0, max: 1 },
    alb: { min: 10.1, max: 52.2 },
    egfr: { min: 2.59, max: 197.11 },
    iga: { min: 0.27, max: 8.97 },
    ualpha1mg: { min: 5, max: 496 },
    c3: { min: 0.52, max: 2.48 }
  };

  const I18N = {
    zh: {
      brandSubtitle: "肾病风险评估工作台", offline: "离线计算", export: "导出结果", resetTitle: "重置当前输入", languageLabel: "切换语言",
      modelCount: "3 个模型", privacyTitle: "数据留在本机", privacyText: "本页面不上传患者信息。关闭页面后，当前输入不会被保存。",
      heroKicker: "肾脏临床辅助 · RENAL CLINICAL SUPPORT", pageTitle: "IgAN 风险评估", pageIntro: "用可解释的逻辑回归模型，把关键检验结果转化为可读的风险信号。", heroMetaOne: "选择模型", heroMetaTwo: "录入结果", heroMetaThree: "查看建议",
      breadcrumbOne: "临床辅助评估", breadcrumbTwo: "模型计算", sectionHeading: "患者风险工作台", headingIntro: "录入检查结果，查看模型概率、变量贡献与下一步诊疗建议。", formulaLabel: "当前模型", inputTitle: "结果输入", resultTitle: "模型预测结果", liveLabel: "实时更新", probabilityCaption: "预测概率 P", riskLabel: "风险等级", aLabel: "线性预测值 A", modelLabel: "模型",
      inputHint: "连续变量按原始测量值代入；性别为二分类变量。", adviceTitle: "下一步诊疗建议", adviceNote: "模型结果仅作临床辅助评估，不能替代医生诊断。", nomogramTitle: "风险等级列线图", nomogramIntro: "各变量按建模数据观察范围设定标尺；总分与概率使用同一线性预测值映射。", legendCurrent: "当前点位", legendThreshold: "风险阈值", nomogramSource: "变量标尺依据建模数据观察范围。",
      explanationTitle: "变量贡献与分布", explanationIntro: "Bar 与 Scatter 分开展示，项目顺序与参考图一致。", barPlotTitle: "Bar · 当前病例贡献", scatterPlotTitle: "Scatter · 变量贡献分布", scatterPlotNote: "线性贡献", legendCase: "当前病例", legendLow: "低值", legendHigh: "高值", modelInfoTitle: "模型信息与使用边界", disclaimer: "本模型仅作为临床辅助评估工具，用于提示相关疾病或病理类型的可能性，不能作为确诊或排除诊断的唯一依据。疾病确诊仍需结合患者病史、临床表现、实验室及影像学检查，必要时依据肾活检及病理结果明确诊断。",
      invalid: "请填写全部项目，并检查输入范围后再运行模型。", filled: "已填", pending: "待检查输入", runLabel: "运行模型", runHint: "填写全部项目后点击运行模型；结果将在运行后展开。", range: "范围", points: "分", total: "总分", riskProbability: "风险概率", pointsAxis: "POINTS / 分值", scatterAxis: "线性贡献 / Linear contribution", scoreMapping: "总分与概率共用线性预测值映射"
    },
    en: {
      brandSubtitle: "Renal risk assessment workbench", offline: "Offline calculation", export: "Export result", resetTitle: "Reset current inputs", languageLabel: "Switch language",
      modelCount: "3 models", privacyTitle: "Data stays on device", privacyText: "No patient data is uploaded. Inputs are not saved after this page is closed.",
      heroKicker: "RENAL CLINICAL SUPPORT", pageTitle: "IgAN Risk Assessment", pageIntro: "Turn key laboratory results into readable risk signals with an interpretable logistic regression model.", heroMetaOne: "Choose model", heroMetaTwo: "Enter results", heroMetaThree: "Review advice",
      breadcrumbOne: "Clinical support", breadcrumbTwo: "Model calculation", sectionHeading: "Patient risk workbench", headingIntro: "Enter laboratory results to review probability, variable contribution, and next-step advice.", formulaLabel: "Active model", inputTitle: "Result input", resultTitle: "Model output", liveLabel: "Live update", probabilityCaption: "Predicted probability P", riskLabel: "Risk tier", aLabel: "Linear predictor A", modelLabel: "Model",
      inputHint: "Enter continuous variables as measured; sex is binary coded.", adviceTitle: "Next-step clinical advice", adviceNote: "For clinical support only; this model does not replace medical diagnosis.", nomogramTitle: "Risk nomogram", nomogramIntro: "Variable scales use observed modeling-data ranges; total points and probability share one linear-predictor mapping.", legendCurrent: "Current value", legendThreshold: "Risk threshold", nomogramSource: "Variable scales use observed modeling-data ranges.",
      explanationTitle: "Variable contribution & distribution", explanationIntro: "Bar and Scatter are shown separately, with the same feature order as the reference plots.", barPlotTitle: "Bar · Current case contribution", scatterPlotTitle: "Scatter · Contribution distribution", scatterPlotNote: "Linear contribution", legendCase: "Current case", legendLow: "Low value", legendHigh: "High value", modelInfoTitle: "Model notes & boundaries", disclaimer: "This model is a clinical support tool for estimating disease or pathology likelihood. It must not be used as the sole basis for diagnosis or exclusion. Final assessment should integrate history, examination, laboratory and imaging findings, and kidney biopsy when indicated.",
      invalid: "Complete all fields and check the input ranges before running the model.", filled: "Filled", pending: "Check inputs", runLabel: "Run model", runHint: "Complete every field, then run the model to reveal the results.", range: "Range", points: "pts", total: "Total points", riskProbability: "Risk probability", pointsAxis: "POINTS / 分值", scatterAxis: "线性贡献 / Linear contribution", scoreMapping: "Total points and probability share the linear-predictor mapping"
    }
  };

  const SUPPORTED_LOCALES = [
    { code: "en", label: "English", htmlLang: "en" },
    { code: "zh", label: "中文", htmlLang: "zh-CN" },
    { code: "de", label: "Deutsch", htmlLang: "de" },
    { code: "fr", label: "Français", htmlLang: "fr" },
    { code: "it", label: "Italiano", htmlLang: "it" },
    { code: "ja", label: "日本語", htmlLang: "ja" }
  ];

  const UI_COPY = {
    en: {
      brandName: "ShenYan AI", brandSubtitle: "Renal risk assessment workbench", modelSuite: "MODEL SUITE", modelCount: "3 models", navModel: "Model selection", sidebarFooter: "v0.3 · offline clinical prototype",
      offline: "Offline calculation", export: "Export result", resetTitle: "Reset current inputs", languageLabel: "Language",
      privacyTitle: "Data stays on device", privacyText: "No patient data is uploaded. Inputs are not saved after this page is closed.",
      heroKicker: "RENAL CLINICAL SUPPORT", pageTitle: "IgAN Risk Assessment", pageIntro: "Turn key laboratory results into readable risk signals with an interpretable logistic regression model.", heroMetaOne: "Choose model", heroMetaTwo: "Enter results", heroMetaThree: "Review advice",
      breadcrumbOne: "Clinical support", breadcrumbTwo: "Model calculation", sectionHeading: "Patient risk workbench", headingIntro: "Enter laboratory results to review probability, variable contribution, and next-step advice.", formulaLabel: "Active model",
      inputKicker: "01 / INPUT", inputTitle: "Result input", outputKicker: "02 / OUTPUT", resultTitle: "Model output", actionKicker: "03 / ACTION", liveLabel: "Live update", probabilityCaption: "Predicted probability", riskLabel: "Risk tier", aLabel: "Linear predictor A", modelLabel: "Model",
      inputHint: "Enter continuous variables as measured; sex is binary coded.", adviceTitle: "Next-step clinical advice", adviceNote: "For clinical support only; this model does not replace medical diagnosis.",
      nomogramKicker: "04 / NOMOGRAM", nomogramTitle: "Risk nomogram", nomogramIntro: "Variable scales use observed modeling-data ranges; total points and probability share one linear-predictor mapping.", legendCurrent: "Current value", legendThreshold: "Risk threshold", nomogramSource: "Variable scales use observed modeling-data ranges.",
      explanationKicker: "05 / EXPLANATION", explanationTitle: "Variable contribution & distribution", explanationIntro: "Bar and Scatter are shown separately, with the same feature order as the reference plots.", barPlotTitle: "Bar · Current case contribution", scatterPlotTitle: "Scatter · Contribution distribution", scatterPlotNote: "Linear contribution", legendCase: "Current case", legendLow: "Low value", legendHigh: "High value",
      modelInfoKicker: "06 / MODEL NOTE", modelInfoTitle: "Model notes & boundaries", disclaimer: "This model is a clinical support tool for estimating disease or pathology likelihood. It must not be used as the sole basis for diagnosis or exclusion. Final assessment should integrate history, examination, laboratory and imaging findings, and kidney biopsy when indicated.",
      invalid: "Complete all fields and check the input ranges before running the model.", filled: "Filled", pending: "Check inputs", runLabel: "Run model", runHint: "Complete every field, then run the model to reveal the results.", range: "Range", points: "pts", total: "Total points", riskProbability: "Risk probability", pointsAxis: "POINTS", barAxis: "Contribution magnitude", barFooter: "Contribution magnitude for the current case", scatterAxis: "Linear contribution", featureLabel: "FEATURE", lowValue: "Low", highValue: "High", negativeCaption: "Negative ← lowers model output", positiveCaption: "Positive → raises model output", scoreMapping: "Total points and probability share the linear-predictor mapping", selectPlaceholder: "Select", sexHint: "Male = 1 · Female = 0", intendedUse: "Intended use", population: "Population", inputs: "Inputs", runtime: "Runtime"
    },
    zh: {
      brandName: "肾眼智能体", brandSubtitle: "肾病风险评估工作台", modelSuite: "模型组", modelCount: "3 个模型", navModel: "模型选择", sidebarFooter: "v0.3 · 离线临床原型",
      offline: "离线计算", export: "导出结果", resetTitle: "重置当前输入", languageLabel: "语言",
      privacyTitle: "数据留在本机", privacyText: "本页面不上传患者信息。关闭页面后，当前输入不会被保存。",
      heroKicker: "肾脏临床辅助", pageTitle: "IgAN 风险评估", pageIntro: "用可解释的逻辑回归模型，把关键检验结果转化为可读的风险信号。", heroMetaOne: "选择模型", heroMetaTwo: "录入结果", heroMetaThree: "查看建议",
      breadcrumbOne: "临床辅助评估", breadcrumbTwo: "模型计算", sectionHeading: "患者风险工作台", headingIntro: "录入检查结果，查看模型概率、变量贡献与下一步诊疗建议。", formulaLabel: "当前模型",
      inputKicker: "01 / 输入", inputTitle: "结果输入", outputKicker: "02 / 输出", resultTitle: "模型预测结果", actionKicker: "03 / 建议", liveLabel: "实时更新", probabilityCaption: "预测概率", riskLabel: "风险等级", aLabel: "线性预测值 A", modelLabel: "模型",
      inputHint: "连续变量按原始测量值代入；性别为二分类变量。", adviceTitle: "下一步诊疗建议", adviceNote: "模型结果仅作临床辅助评估，不能替代医生诊断。",
      nomogramKicker: "04 / 列线图", nomogramTitle: "风险等级列线图", nomogramIntro: "各变量按建模数据观察范围设定标尺；总分与概率使用同一线性预测值映射。", legendCurrent: "当前点位", legendThreshold: "风险阈值", nomogramSource: "变量标尺依据建模数据观察范围。",
      explanationKicker: "05 / 解释", explanationTitle: "变量贡献与分布", explanationIntro: "Bar 与 Scatter 分开展示，项目顺序与参考图一致。", barPlotTitle: "Bar · 当前病例贡献", scatterPlotTitle: "Scatter · 变量贡献分布", scatterPlotNote: "线性贡献", legendCase: "当前病例", legendLow: "低值", legendHigh: "高值",
      modelInfoKicker: "06 / 模型说明", modelInfoTitle: "模型信息与使用边界", disclaimer: "本模型仅作为临床辅助评估工具，用于提示相关疾病或病理类型的可能性，不能作为确诊或排除诊断的唯一依据。疾病确诊仍需结合患者病史、临床表现、实验室及影像学检查，必要时依据肾活检及病理结果明确诊断。",
      invalid: "请填写全部项目，并检查输入范围后再运行模型。", filled: "已填", pending: "待检查输入", runLabel: "运行模型", runHint: "填写全部项目后点击运行模型；结果将在运行后展开。", range: "范围", points: "分", total: "总分", riskProbability: "风险概率", pointsAxis: "POINTS / 分值", barAxis: "贡献幅度", barFooter: "当前病例贡献幅度（柱越长表示影响越大）", scatterAxis: "线性贡献", featureLabel: "变量", lowValue: "低值", highValue: "高值", negativeCaption: "负向 ← 降低模型输出", positiveCaption: "提高模型输出 → 正向", scoreMapping: "总分与概率共用线性预测值映射", selectPlaceholder: "请选择", sexHint: "男 = 1 · 女 = 0", intendedUse: "预期用途", population: "适用人群", inputs: "输入变量", runtime: "运行方式"
    },
    de: {
      brandName: "ShenYan AI", brandSubtitle: "Arbeitsbereich zur Nierenrisikobewertung", modelSuite: "MODELLSUITE", modelCount: "3 Modelle", navModel: "Modellauswahl", sidebarFooter: "v0.3 · klinischer Offline-Prototyp", offline: "Offline-Berechnung", export: "Ergebnis exportieren", resetTitle: "Aktuelle Eingaben zurücksetzen", languageLabel: "Sprache", privacyTitle: "Daten bleiben auf dem Gerät", privacyText: "Es werden keine Patientendaten hochgeladen. Eingaben werden beim Schließen nicht gespeichert.", heroKicker: "KLINISCHE NIERENHILFE", pageTitle: "IgAN-Risikobewertung", pageIntro: "Schlüsselbefunde mit einem interpretierbaren logistischen Regressionsmodell in verständliche Risikosignale übersetzen.", heroMetaOne: "Modell wählen", heroMetaTwo: "Befunde eingeben", heroMetaThree: "Empfehlung prüfen", breadcrumbOne: "Klinische Unterstützung", breadcrumbTwo: "Modellberechnung", sectionHeading: "Arbeitsbereich für Patientenrisiken", headingIntro: "Laborbefunde eingeben und Wahrscheinlichkeit, Variablenbeitrag und nächste Schritte prüfen.", formulaLabel: "Aktives Modell", inputKicker: "01 / EINGABE", inputTitle: "Befundeingabe", outputKicker: "02 / AUSGABE", resultTitle: "Modellergebnis", actionKicker: "03 / AKTION", liveLabel: "Live-Aktualisierung", probabilityCaption: "Vorhergesagte Wahrscheinlichkeit", riskLabel: "Risikostufe", aLabel: "Linearer Prädiktor A", modelLabel: "Modell", inputHint: "Kontinuierliche Werte wie gemessen eingeben; Geschlecht ist binär codiert.", adviceTitle: "Nächste klinische Schritte", adviceNote: "Nur zur klinischen Unterstützung; ersetzt keine ärztliche Diagnose.", nomogramKicker: "04 / NOMOGRAMM", nomogramTitle: "Risiko-Nomogramm", nomogramIntro: "Variablenskalen verwenden beobachtete Modellierungsbereiche; Gesamtpunkte und Wahrscheinlichkeit teilen dieselbe lineare Abbildung.", legendCurrent: "Aktueller Wert", legendThreshold: "Risikoschwelle", nomogramSource: "Variablenskalen basieren auf beobachteten Modellierungsbereichen.", explanationKicker: "05 / ERKLÄRUNG", explanationTitle: "Variablenbeitrag und Verteilung", explanationIntro: "Balken und Scatter werden getrennt mit derselben Merkmalsreihenfolge gezeigt.", barPlotTitle: "Balken · Beitrag des aktuellen Falls", scatterPlotTitle: "Scatter · Beitragsverteilung", scatterPlotNote: "Linearer Beitrag", legendCase: "Aktueller Fall", legendLow: "Niedriger Wert", legendHigh: "Hoher Wert", modelInfoKicker: "06 / MODELLHINWEIS", modelInfoTitle: "Modellhinweise und Grenzen", disclaimer: "Dieses Modell unterstützt die klinische Einschätzung der Wahrscheinlichkeit einer Erkrankung oder eines pathologischen Befunds. Es darf nicht als alleinige Grundlage für Diagnose oder Ausschluss verwendet werden. Die abschließende Beurteilung muss Anamnese, Untersuchung, Labor, Bildgebung und bei Bedarf eine Nierenbiopsie einbeziehen.", invalid: "Alle Felder ausfüllen und Wertebereiche prüfen, bevor das Modell ausgeführt wird.", filled: "Ausgefüllt", pending: "Eingaben prüfen", runLabel: "Modell ausführen", runHint: "Alle Felder ausfüllen und anschließend das Modell ausführen.", range: "Bereich", points: "Pkt.", total: "Gesamtpunkte", riskProbability: "Risikowahrscheinlichkeit", pointsAxis: "PUNKTE", barAxis: "Beitragsstärke", barFooter: "Beitragsstärke für den aktuellen Fall", scatterAxis: "Linearer Beitrag", featureLabel: "MERKMAL", lowValue: "Niedrig", highValue: "Hoch", negativeCaption: "Negativ ← senkt den Modellausgabewert", positiveCaption: "Erhöht den Modellausgabewert → positiv", scoreMapping: "Gesamtpunkte und Wahrscheinlichkeit teilen dieselbe lineare Abbildung", selectPlaceholder: "Auswählen", sexHint: "Männlich = 1 · Weiblich = 0", intendedUse: "Zweckbestimmung", population: "Zielgruppe", inputs: "Eingaben", runtime: "Ausführung"
    },
    fr: {
      brandName: "ShenYan AI", brandSubtitle: "Espace d’évaluation du risque rénal", modelSuite: "SUITE DE MODÈLES", modelCount: "3 modèles", navModel: "Sélection du modèle", sidebarFooter: "v0.3 · prototype clinique hors ligne", offline: "Calcul hors ligne", export: "Exporter le résultat", resetTitle: "Réinitialiser les valeurs", languageLabel: "Langue", privacyTitle: "Les données restent sur l’appareil", privacyText: "Aucune donnée patient n’est envoyée. Les valeurs ne sont pas conservées à la fermeture.", heroKicker: "ASSISTANCE CLINIQUE RÉNALE", pageTitle: "Évaluation du risque d’IgAN", pageIntro: "Transformez les résultats biologiques clés en signaux de risque lisibles grâce à une régression logistique interprétable.", heroMetaOne: "Choisir le modèle", heroMetaTwo: "Saisir les résultats", heroMetaThree: "Lire les conseils", breadcrumbOne: "Assistance clinique", breadcrumbTwo: "Calcul du modèle", sectionHeading: "Espace de travail du risque patient", headingIntro: "Saisissez les résultats pour consulter la probabilité, la contribution des variables et les prochaines étapes.", formulaLabel: "Modèle actif", inputKicker: "01 / SAISIE", inputTitle: "Saisie des résultats", outputKicker: "02 / SORTIE", resultTitle: "Résultat du modèle", actionKicker: "03 / ACTION", liveLabel: "Mise à jour en direct", probabilityCaption: "Probabilité prédite", riskLabel: "Niveau de risque", aLabel: "Prédicteur linéaire A", modelLabel: "Modèle", inputHint: "Saisissez les valeurs continues telles que mesurées ; le sexe est codé en deux catégories.", adviceTitle: "Prochaines étapes cliniques", adviceNote: "Outil d’aide clinique uniquement ; ne remplace pas le diagnostic médical.", nomogramKicker: "04 / NOMOGRAMME", nomogramTitle: "Nomogramme du risque", nomogramIntro: "Les échelles utilisent les plages observées de modélisation ; les points totaux et la probabilité partagent la même correspondance linéaire.", legendCurrent: "Valeur actuelle", legendThreshold: "Seuil de risque", nomogramSource: "Échelles fondées sur les plages observées de modélisation.", explanationKicker: "05 / EXPLICATION", explanationTitle: "Contribution et distribution des variables", explanationIntro: "Les graphiques Bar et Scatter sont séparés et utilisent le même ordre de variables.", barPlotTitle: "Bar · contribution du cas actuel", scatterPlotTitle: "Scatter · distribution des contributions", scatterPlotNote: "Contribution linéaire", legendCase: "Cas actuel", legendLow: "Valeur basse", legendHigh: "Valeur haute", modelInfoKicker: "06 / NOTE DU MODÈLE", modelInfoTitle: "Informations et limites du modèle", disclaimer: "Ce modèle est un outil d’aide clinique pour estimer la probabilité d’une maladie ou d’un type de lésion. Il ne doit pas être utilisé comme seul fondement du diagnostic ou de l’exclusion. L’évaluation finale doit intégrer l’histoire, l’examen, les analyses, l’imagerie et, si nécessaire, la biopsie rénale.", invalid: "Complétez tous les champs et vérifiez les plages avant d’exécuter le modèle.", filled: "Rempli", pending: "Vérifier les valeurs", runLabel: "Exécuter le modèle", runHint: "Complétez chaque champ, puis exécutez le modèle pour afficher les résultats.", range: "Plage", points: "pts", total: "Points totaux", riskProbability: "Probabilité de risque", pointsAxis: "POINTS", barAxis: "Amplitude de contribution", barFooter: "Amplitude de contribution pour le cas actuel", scatterAxis: "Contribution linéaire", featureLabel: "VARIABLE", lowValue: "Bas", highValue: "Haut", negativeCaption: "Négatif ← diminue la sortie du modèle", positiveCaption: "Augmente la sortie du modèle → positif", scoreMapping: "Les points totaux et la probabilité partagent la même correspondance linéaire", selectPlaceholder: "Sélectionner", sexHint: "Homme = 1 · Femme = 0", intendedUse: "Usage prévu", population: "Population cible", inputs: "Variables d’entrée", runtime: "Exécution"
    },
    it: {
      brandName: "ShenYan AI", brandSubtitle: "Area di valutazione del rischio renale", modelSuite: "SUITE DEI MODELLI", modelCount: "3 modelli", navModel: "Selezione del modello", sidebarFooter: "v0.3 · prototipo clinico offline", offline: "Calcolo offline", export: "Esporta risultato", resetTitle: "Reimposta i dati", languageLabel: "Lingua", privacyTitle: "I dati restano sul dispositivo", privacyText: "Nessun dato del paziente viene inviato. Gli inserimenti non vengono salvati alla chiusura.", heroKicker: "SUPPORTO CLINICO RENALE", pageTitle: "Valutazione del rischio IgAN", pageIntro: "Trasforma i principali risultati di laboratorio in segnali di rischio leggibili con un modello di regressione logistica interpretabile.", heroMetaOne: "Scegli modello", heroMetaTwo: "Inserisci risultati", heroMetaThree: "Leggi consigli", breadcrumbOne: "Supporto clinico", breadcrumbTwo: "Calcolo del modello", sectionHeading: "Area di lavoro del rischio paziente", headingIntro: "Inserisci i risultati per consultare probabilità, contributo delle variabili e prossimi passi.", formulaLabel: "Modello attivo", inputKicker: "01 / INPUT", inputTitle: "Inserimento risultati", outputKicker: "02 / OUTPUT", resultTitle: "Risultato del modello", actionKicker: "03 / AZIONE", liveLabel: "Aggiornamento live", probabilityCaption: "Probabilità prevista", riskLabel: "Livello di rischio", aLabel: "Predittore lineare A", modelLabel: "Modello", inputHint: "Inserisci i valori continui come misurati; il sesso è codificato in modo binario.", adviceTitle: "Prossimi passi clinici", adviceNote: "Solo per supporto clinico; non sostituisce la diagnosi medica.", nomogramKicker: "04 / NOMOGRAMMA", nomogramTitle: "Nomogramma del rischio", nomogramIntro: "Le scale usano gli intervalli osservati nei dati di modellazione; punti totali e probabilità condividono la stessa mappatura lineare.", legendCurrent: "Valore attuale", legendThreshold: "Soglia di rischio", nomogramSource: "Scale basate sugli intervalli osservati nei dati di modellazione.", explanationKicker: "05 / SPIEGAZIONE", explanationTitle: "Contributo e distribuzione delle variabili", explanationIntro: "I grafici Bar e Scatter sono separati e mantengono lo stesso ordine delle variabili.", barPlotTitle: "Bar · contributo del caso corrente", scatterPlotTitle: "Scatter · distribuzione dei contributi", scatterPlotNote: "Contributo lineare", legendCase: "Caso corrente", legendLow: "Valore basso", legendHigh: "Valore alto", modelInfoKicker: "06 / NOTA DEL MODELLO", modelInfoTitle: "Informazioni e limiti del modello", disclaimer: "Questo modello supporta la valutazione clinica della probabilità di malattia o di un tipo di lesione. Non deve essere usato come unica base per la diagnosi o l’esclusione. La valutazione finale deve integrare anamnesi, esame, laboratorio, imaging e, quando indicato, biopsia renale.", invalid: "Completa tutti i campi e controlla gli intervalli prima di eseguire il modello.", filled: "Compilati", pending: "Controlla gli input", runLabel: "Esegui modello", runHint: "Completa ogni campo, poi esegui il modello per visualizzare i risultati.", range: "Intervallo", points: "pt", total: "Punti totali", riskProbability: "Probabilità di rischio", pointsAxis: "PUNTI", barAxis: "Ampiezza del contributo", barFooter: "Ampiezza del contributo per il caso corrente", scatterAxis: "Contributo lineare", featureLabel: "VARIABILE", lowValue: "Basso", highValue: "Alto", negativeCaption: "Negativo ← riduce l’uscita del modello", positiveCaption: "Aumenta l’uscita del modello → positivo", scoreMapping: "Punti totali e probabilità condividono la stessa mappatura lineare", selectPlaceholder: "Seleziona", sexHint: "Maschio = 1 · Femmina = 0", intendedUse: "Uso previsto", population: "Popolazione", inputs: "Variabili di input", runtime: "Esecuzione"
    },
    ja: {
      brandName: "ShenYan AI", brandSubtitle: "腎疾患リスク評価ワークベンチ", modelSuite: "MODEL SUITE", modelCount: "3モデル", navModel: "モデル選択", sidebarFooter: "v0.3 · オフライン臨床プロトタイプ", offline: "オフライン計算", export: "結果を出力", resetTitle: "現在の入力をリセット", languageLabel: "言語", privacyTitle: "データは端末内に保持", privacyText: "患者データは送信されません。ページを閉じると入力値は保存されません。", heroKicker: "腎臓臨床サポート", pageTitle: "IgANリスク評価", pageIntro: "解釈可能なロジスティック回帰モデルで、主要な検査結果をわかりやすいリスク信号に変換します。", heroMetaOne: "モデルを選択", heroMetaTwo: "結果を入力", heroMetaThree: "提案を確認", breadcrumbOne: "臨床サポート", breadcrumbTwo: "モデル計算", sectionHeading: "患者リスクワークベンチ", headingIntro: "検査結果を入力して、確率、変数の寄与、次の診療ステップを確認します。", formulaLabel: "現在のモデル", inputKicker: "01 / INPUT", inputTitle: "結果入力", outputKicker: "02 / OUTPUT", resultTitle: "モデル出力", actionKicker: "03 / ACTION", liveLabel: "リアルタイム更新", probabilityCaption: "予測確率", riskLabel: "リスク区分", aLabel: "線形予測値 A", modelLabel: "モデル", inputHint: "連続変数は測定値をそのまま入力し、性別は二値で入力します。", adviceTitle: "次の診療ステップ", adviceNote: "臨床支援用であり、医師の診断に代わるものではありません。", nomogramKicker: "04 / NOMOGRAM", nomogramTitle: "リスクノモグラム", nomogramIntro: "変数スケールは観測されたモデリング範囲を使用し、合計点と確率は同じ線形予測値に対応します。", legendCurrent: "現在値", legendThreshold: "リスク閾値", nomogramSource: "変数スケールは観測されたモデリング範囲に基づきます。", explanationKicker: "05 / EXPLANATION", explanationTitle: "変数の寄与と分布", explanationIntro: "Bar と Scatter を分けて表示し、変数の順序を統一しています。", barPlotTitle: "Bar · 現在症例の寄与", scatterPlotTitle: "Scatter · 寄与の分布", scatterPlotNote: "線形寄与", legendCase: "現在症例", legendLow: "低値", legendHigh: "高値", modelInfoKicker: "06 / MODEL NOTE", modelInfoTitle: "モデル情報と使用上の境界", disclaimer: "本モデルは疾患または病理所見の可能性を推定する臨床支援ツールです。診断または除外の唯一の根拠として使用せず、病歴、診察、検査、画像所見、必要に応じて腎生検を総合して判断してください。", invalid: "すべての項目を入力し、範囲を確認してからモデルを実行してください。", filled: "入力済み", pending: "入力を確認", runLabel: "モデルを実行", runHint: "すべての項目を入力してからモデルを実行すると結果が表示されます。", range: "範囲", points: "点", total: "合計点", riskProbability: "リスク確率", pointsAxis: "POINTS", barAxis: "寄与の大きさ", barFooter: "現在症例の寄与の大きさ", scatterAxis: "線形寄与", featureLabel: "変数", lowValue: "低値", highValue: "高値", negativeCaption: "負の方向 ← モデル出力を低下", positiveCaption: "モデル出力を上昇 → 正の方向", scoreMapping: "合計点と確率は同じ線形予測値に対応します", selectPlaceholder: "選択", sexHint: "男性 = 1 · 女性 = 0", intendedUse: "意図する用途", population: "対象者", inputs: "入力変数", runtime: "実行方式"
    }
  };
  Object.entries(UI_COPY).forEach(([locale, copy]) => { I18N[locale] = { ...I18N.en, ...copy }; });

  const FIELD_COPY = {
    en: { age: ["Age", "years"], sex: ["Sex", ""], alb: ["Albumin", "g/L"], egfr: ["eGFR (creatinine)", "mL/min/1.73m²"], iga: ["Serum IgA", "g/L"], ualpha1mg: ["Urine α1-microglobulin", "mg/L"], protein: ["24-hour urine protein", "g/24 h"], c3: ["Complement C3", "g/L"], ldlc: ["LDL cholesterol", "mmol/L"] },
    zh: { age: ["年龄", "岁"], sex: ["性别", ""], alb: ["白蛋白", "g/L"], egfr: ["估算肾小球滤过率", "mL/min/1.73m²"], iga: ["血清 IgA", "g/L"], ualpha1mg: ["尿 α1 微球蛋白", "mg/L"], protein: ["24 h 尿蛋白", "g/24 h"], c3: ["补体 C3", "g/L"], ldlc: ["低密度脂蛋白", "mmol/L"] },
    de: { age: ["Alter", "Jahre"], sex: ["Geschlecht", ""], alb: ["Albumin", "g/L"], egfr: ["eGFR (Kreatinin)", "mL/min/1.73m²"], iga: ["Serum-IgA", "g/L"], ualpha1mg: ["Urin-α1-Mikroglobulin", "mg/L"], protein: ["24-Stunden-Urinprotein", "g/24 h"], c3: ["Komplement C3", "g/L"], ldlc: ["LDL-Cholesterin", "mmol/L"] },
    fr: { age: ["Âge", "ans"], sex: ["Sexe", ""], alb: ["Albumine", "g/L"], egfr: ["DFGe (créatinine)", "mL/min/1.73m²"], iga: ["IgA sérique", "g/L"], ualpha1mg: ["α1-microglobuline urinaire", "mg/L"], protein: ["Protéines urinaires de 24 h", "g/24 h"], c3: ["Complément C3", "g/L"], ldlc: ["Cholestérol LDL", "mmol/L"] },
    it: { age: ["Età", "anni"], sex: ["Sesso", ""], alb: ["Albumina", "g/L"], egfr: ["eGFR (creatinina)", "mL/min/1.73m²"], iga: ["IgA sierica", "g/L"], ualpha1mg: ["α1-microglobulina urinaria", "mg/L"], protein: ["Proteine urinarie delle 24 ore", "g/24 h"], c3: ["Complemento C3", "g/L"], ldlc: ["Colesterolo LDL", "mmol/L"] },
    ja: { age: ["年齢", "歳"], sex: ["性別", ""], alb: ["アルブミン", "g/L"], egfr: ["eGFR（クレアチニン）", "mL/min/1.73m²"], iga: ["血清 IgA", "g/L"], ualpha1mg: ["尿中α1ミクログロブリン", "mg/L"], protein: ["24時間尿蛋白", "g/24 h"], c3: ["補体 C3", "g/L"], ldlc: ["LDLコレステロール", "mmol/L"] }
  };

  const MODEL_LOCALE_COPY = {
    de: {
      uBASE: { subtitle: "Kernvariablen + Urinmarker", interpretation: "IgA-Nephropathie", tiers: { veryLow: "Sehr geringe Wahrscheinlichkeit für IgA-Nephropathie; nicht-IgAN oder nicht-glomeruläre Ursachen erwägen.", low: "Geringe Wahrscheinlichkeit für IgA-Nephropathie; andere glomeruläre Erkrankungen weiter abklären.", medium: "Mittlere Wahrscheinlichkeit; eine nephrologische Abklärung ist erforderlich.", high: "Hohe Wahrscheinlichkeit für IgA-Nephropathie.", veryHigh: "Sehr hohe Wahrscheinlichkeit; nach dem IgAN-Verdacht vorgehen." }, recommendations: { veryLow: "Sehr geringe Wahrscheinlichkeit; nicht-IgAN und nicht-glomeruläre Ursachen differenzialdiagnostisch prüfen.", low: "Andere primäre glomeruläre Erkrankungen anhand von Anamnese und Labor weiter differenzieren; ergänzende Immun- und Infektionsdiagnostik erwägen.", medium: "Nephrologische Abklärung mit Urinmorphologie, Proteinquantifizierung, Komplement und Bildgebung; bei anhaltender Proteinurie oder sinkender eGFR eine Nierenbiopsie prüfen.", high: "Zeitnahe nephrologische Vorstellung; bei Proteinurie, Hämaturie, sinkender eGFR oder Hypertonie die Biopsieindikation prüfen.", veryHigh: "Hochgradiger IgAN-Verdacht; zeitnah fachärztlich abklären und, sofern keine Kontraindikation besteht, eine Nierenbiopsie zur Therapieplanung erwägen." } },
      base: { subtitle: "Klinische Kernvariablen", interpretation: "IgA-Nephropathie" },
      oxt: { subtitle: "Risiko tubulointerstitieller Schäden", interpretation: "Tubuläre Atrophie / interstitielle Fibrose", tiers: { veryLow: "Sehr geringe Wahrscheinlichkeit einer tubulären Atrophie/interstitiellen Fibrose.", low: "Geringe Wahrscheinlichkeit einer tubulären Atrophie/interstitiellen Fibrose.", medium: "Mittlere Wahrscheinlichkeit; weitere Abklärung erforderlich.", high: "Hohe Wahrscheinlichkeit einer tubulären Atrophie/interstitiellen Fibrose.", veryHigh: "Sehr hohe Wahrscheinlichkeit einer tubulären Atrophie/interstitiellen Fibrose." }, recommendations: { veryLow: "Geringe Wahrscheinlichkeit; Nierenfunktion, Proteinurie und Biopsiebefund gemeinsam beurteilen.", low: "Klinischen Verlauf, quantifizierte Proteinurie, eGFR-Trend und Bildgebung nachverfolgen.", medium: "Nephrologische Abklärung mit Proteinurie, eGFR-Verlauf, Blutdruck und Ultraschall; den Nutzen einer Biopsie prüfen.", high: "Zeitnahe nephrologische Vorstellung und Beurteilung von Proteinurie, eGFR, Blutdruck, Lipiden und Biopsiebefund.", veryHigh: "Sehr hohe Wahrscheinlichkeit einer tubulointerstitiellen Schädigung; rasche fachärztliche Abklärung und, wenn angezeigt, Nierenbiopsie." } }
    },
    fr: {
      uBASE: { subtitle: "Variables de base + marqueur urinaire", interpretation: "Néphropathie à IgA", tiers: { veryLow: "Probabilité très faible de néphropathie à IgA ; envisager une cause non IgAN ou non glomérulaire.", low: "Probabilité faible ; d’autres maladies glomérulaires restent à rechercher.", medium: "Probabilité intermédiaire ; une évaluation néphrologique est nécessaire.", high: "Probabilité élevée de néphropathie à IgA.", veryHigh: "Probabilité très élevée ; suivre un parcours de forte suspicion d’IgAN." }, recommendations: { veryLow: "Différencier les causes non IgAN et non glomérulaires à partir de l’histoire et des examens.", low: "Poursuivre le diagnostic différentiel des maladies glomérulaires primitives et envisager un bilan immunologique complémentaire.", medium: "Avis néphrologique avec morphologie urinaire, quantification de la protéinurie, complément et imagerie ; discuter une biopsie si la protéinurie persiste ou si le DFG baisse.", high: "Consulter rapidement en néphrologie ; évaluer l’indication d’une biopsie en cas de protéinurie, hématurie, baisse du DFG ou hypertension.", veryHigh: "Forte suspicion d’IgAN ; évaluation spécialisée rapide et biopsie rénale si elle est indiquée et sans contre-indication." } },
      base: { subtitle: "Variables cliniques de base", interpretation: "Néphropathie à IgA" },
      oxt: { subtitle: "Risque de lésion tubulo-interstitielle", interpretation: "Atrophie tubulaire / fibrose interstitielle", tiers: { veryLow: "Probabilité très faible d’atrophie tubulaire ou de fibrose interstitielle.", low: "Probabilité faible d’atrophie tubulaire ou de fibrose interstitielle.", medium: "Probabilité intermédiaire ; une évaluation complémentaire est nécessaire.", high: "Probabilité élevée d’atrophie tubulaire ou de fibrose interstitielle.", veryHigh: "Probabilité très élevée d’atrophie tubulaire ou de fibrose interstitielle." }, recommendations: { veryLow: "Intégrer fonction rénale, protéinurie et résultats de biopsie dans l’évaluation.", low: "Suivre l’histoire clinique, la protéinurie quantifiée, la tendance du DFG et l’imagerie.", medium: "Organiser une évaluation néphrologique avec protéinurie, évolution du DFG, pression artérielle et échographie ; discuter la biopsie.", high: "Consulter rapidement en néphrologie et corréler protéinurie, baisse du DFG, tension, lipides et biopsie.", veryHigh: "Forte probabilité de lésion tubulo-interstitielle ; évaluation spécialisée rapide et biopsie si indiquée." } }
    },
    it: {
      uBASE: { subtitle: "Variabili di base + marcatore urinario", interpretation: "Nefropatia da IgA", tiers: { veryLow: "Probabilità molto bassa di nefropatia da IgA; considerare cause non IgAN o non glomerulari.", low: "Probabilità bassa; valutare anche altre malattie glomerulari.", medium: "Probabilità intermedia; necessaria valutazione nefrologica.", high: "Probabilità elevata di nefropatia da IgA.", veryHigh: "Probabilità molto elevata; seguire un percorso per forte sospetto IgAN." }, recommendations: { veryLow: "Distinguere cause non IgAN e non glomerulari integrando anamnesi ed esami.", low: "Proseguire la diagnosi differenziale delle malattie glomerulari primitive e considerare esami immunologici aggiuntivi.", medium: "Valutazione nefrologica con morfologia urinaria, quantificazione della proteinuria, complemento e imaging; considerare biopsia se la proteinuria persiste o l’eGFR diminuisce.", high: "Visita nefrologica tempestiva; valutare la biopsia in presenza di proteinuria, ematuria, riduzione dell’eGFR o ipertensione.", veryHigh: "Forte sospetto di IgAN; completare rapidamente la valutazione specialistica e considerare la biopsia se indicata." } },
      base: { subtitle: "Variabili cliniche di base", interpretation: "Nefropatia da IgA" },
      oxt: { subtitle: "Rischio di danno tubulo-interstiziale", interpretation: "Atrofia tubulare / fibrosi interstiziale", tiers: { veryLow: "Probabilità molto bassa di atrofia tubulare/fibrosi interstiziale.", low: "Probabilità bassa di atrofia tubulare/fibrosi interstiziale.", medium: "Probabilità intermedia; necessaria ulteriore valutazione.", high: "Probabilità elevata di atrofia tubulare/fibrosi interstiziale.", veryHigh: "Probabilità molto elevata di atrofia tubulare/fibrosi interstiziale." }, recommendations: { veryLow: "Integrare funzione renale, proteinuria e reperti bioptici.", low: "Seguire anamnesi, proteinuria quantificata, andamento dell’eGFR e imaging.", medium: "Valutazione nefrologica con proteinuria, andamento dell’eGFR, pressione e ecografia; considerare il valore della biopsia.", high: "Visita nefrologica tempestiva e correlazione con proteinuria, eGFR, pressione, lipidi e biopsia.", veryHigh: "Alta probabilità di danno tubulo-interstiziale; valutazione specialistica rapida e biopsia quando indicata." } }
    },
    ja: {
      uBASE: { subtitle: "基本項目 + 尿中マーカー", interpretation: "IgA腎症", tiers: { veryLow: "IgA腎症の可能性は非常に低く、非IgANまたは非糸球体性の原因を考慮します。", low: "IgA腎症の可能性は低いものの、他の糸球体疾患を鑑別します。", medium: "可能性は中等度で、腎臓専門医による評価が必要です。", high: "IgA腎症の可能性が高い状態です。", veryHigh: "IgA腎症の可能性が非常に高く、高度疑いの診療経路を検討します。" }, recommendations: { veryLow: "病歴と検査結果を総合し、非IgANおよび非糸球体性の原因を鑑別してください。", low: "他の原発性糸球体疾患を鑑別し、必要に応じて免疫学的・感染症検査を追加してください。", medium: "尿沈渣、蛋白定量、補体、画像検査を含む専門評価を行い、蛋白尿の持続やeGFR低下時は腎生検を検討してください。", high: "早めに腎臓専門医を受診し、蛋白尿、血尿、eGFR低下、高血圧があれば腎生検の適応を評価してください。", veryHigh: "IgAN高度疑いの診療を開始し、禁忌がなければ腎生検で治療方針を確認してください。" } },
      base: { subtitle: "基本的な臨床項目", interpretation: "IgA腎症" },
      oxt: { subtitle: "尿細管・間質障害リスク", interpretation: "尿細管萎縮 / 間質線維化", tiers: { veryLow: "尿細管萎縮・間質線維化の可能性は非常に低いです。", low: "尿細管萎縮・間質線維化の可能性は低いです。", medium: "可能性は中等度で、追加評価が必要です。", high: "尿細管萎縮・間質線維化の可能性が高いです。", veryHigh: "尿細管萎縮・間質線維化の可能性が非常に高いです。" }, recommendations: { veryLow: "腎機能、蛋白尿、腎生検所見を総合して判断してください。", low: "病歴、定量蛋白尿、eGFRの推移、画像所見を追跡してください。", medium: "蛋白尿、eGFR低下速度、血圧、超音波を含む専門評価を行い、必要に応じて腎生検を検討してください。", high: "早めに専門医を受診し、蛋白尿、eGFR、血圧、脂質異常と腎生検所見を確認してください。", veryHigh: "尿細管・間質障害の可能性が非常に高いため、速やかに専門評価を行い、適応があれば腎生検を実施してください。" } }
    }
  };

  const TIER_COPY = {
    en: { veryLow: "Very low risk", low: "Low risk", medium: "Intermediate risk", high: "High risk", veryHigh: "Very high risk" },
    zh: { veryLow: "极低风险", low: "低风险", medium: "中等风险", high: "高风险", veryHigh: "极高风险" },
    de: { veryLow: "Sehr niedriges Risiko", low: "Niedriges Risiko", medium: "Mittleres Risiko", high: "Hohes Risiko", veryHigh: "Sehr hohes Risiko" },
    fr: { veryLow: "Risque très faible", low: "Risque faible", medium: "Risque intermédiaire", high: "Risque élevé", veryHigh: "Risque très élevé" },
    it: { veryLow: "Rischio molto basso", low: "Rischio basso", medium: "Rischio intermedio", high: "Rischio alto", veryHigh: "Rischio molto alto" },
    ja: { veryLow: "ごく低リスク", low: "低リスク", medium: "中等度リスク", high: "高リスク", veryHigh: "ごく高リスク" }
  };

  const MODEL_INFO_COPY = {
    en: {
      uBASE: { purpose: "For adults with suspected primary glomerular disease, this tool supports assessment of IgA nephropathy likelihood.", population: "Adults aged 18 years or older with persistent microscopic or gross hematuria, proteinuria, declining kidney function or suspected primary glomerular disease; no definitive biopsy diagnosis yet; complete same-episode clinical and laboratory data; inputs, methods and units within model scope." },
      base: { purpose: "For adults with suspected primary glomerular disease, this tool supports assessment of IgA nephropathy likelihood.", population: "Adults aged 18 years or older with persistent microscopic or gross hematuria, proteinuria, declining kidney function or suspected primary glomerular disease; no definitive biopsy diagnosis yet; complete same-episode clinical and laboratory data; inputs, methods and units within model scope." },
      oxt: { purpose: "For patients with suspected IgA nephropathy, this tool supports assessment of tubular atrophy/interstitial fibrosis likelihood on biopsy.", population: "Adults aged 18 years or older with IgA nephropathy under clinical or pathological consideration who need tubular atrophy/interstitial fibrosis risk assessment; complete same-episode clinical and laboratory data; inputs, methods and units within model scope." }
    },
    zh: {
      uBASE: { purpose: "用于在成人疑似原发性肾小球疾病患者中，辅助评估 IgA 肾病的可能性。", population: "年龄≥18岁；因持续性镜下或肉眼血尿、蛋白尿、肾功能下降等表现临床疑似原发性肾小球疾病；尚未通过肾活检明确病理，拟进行 IgA 肾病鉴别；同一诊疗时间窗内临床与实验室信息完整；输入结果、检测方法和计量单位符合模型适用范围。" },
      base: { purpose: "用于在成人疑似原发性肾小球疾病患者中，辅助评估 IgA 肾病的可能性。", population: "年龄≥18岁；因持续性镜下或肉眼血尿、蛋白尿、肾功能下降等表现临床疑似原发性肾小球疾病；尚未通过肾活检明确病理，拟进行 IgA 肾病鉴别；同一诊疗时间窗内临床与实验室信息完整；输入结果、检测方法和计量单位符合模型适用范围。" },
      oxt: { purpose: "用于在已考虑 IgA 肾病的患者中，辅助评估肾穿刺病理存在肾小管萎缩/间质纤维化的可能性。", population: "年龄≥18岁；已临床或病理考虑 IgA 肾病且需要评估肾小管萎缩/间质纤维化风险；同一诊疗时间窗内临床与实验室信息完整；输入结果、检测方法和计量单位符合模型适用范围。" }
    },
    de: {
      uBASE: { purpose: "Für Erwachsene mit Verdacht auf eine primäre glomeruläre Erkrankung unterstützt dieses Tool die Einschätzung der Wahrscheinlichkeit einer IgA-Nephropathie.", population: "Erwachsene ab 18 Jahren mit anhaltender Mikro- oder Makrohämaturie, Proteinurie, abnehmender Nierenfunktion oder Verdacht auf eine primäre glomeruläre Erkrankung; noch keine definitive Biopsiediagnose; vollständige klinische und Laborwerte aus demselben Untersuchungszeitraum." },
      base: { purpose: "Für Erwachsene mit Verdacht auf eine primäre glomeruläre Erkrankung unterstützt dieses Tool die Einschätzung der Wahrscheinlichkeit einer IgA-Nephropathie.", population: "Erwachsene ab 18 Jahren mit anhaltender Mikro- oder Makrohämaturie, Proteinurie, abnehmender Nierenfunktion oder Verdacht auf eine primäre glomeruläre Erkrankung; noch keine definitive Biopsiediagnose; vollständige klinische und Laborwerte aus demselben Untersuchungszeitraum." },
      oxt: { purpose: "Bei Verdacht auf IgA-Nephropathie unterstützt dieses Tool die Einschätzung einer tubulären Atrophie/interstitiellen Fibrose im Biopsiebefund.", population: "Erwachsene ab 18 Jahren mit klinischem oder pathologischem Verdacht auf IgA-Nephropathie und Bedarf an einer Risikoeinschätzung; vollständige Werte aus demselben Untersuchungszeitraum." }
    },
    fr: {
      uBASE: { purpose: "Chez l’adulte suspect de maladie glomérulaire primitive, cet outil aide à estimer la probabilité d’une néphropathie à IgA.", population: "Adultes de 18 ans ou plus présentant hématurie persistante, protéinurie, baisse de la fonction rénale ou suspicion de maladie glomérulaire primitive ; sans diagnostic histologique définitif ; données cliniques et biologiques complètes du même épisode." },
      base: { purpose: "Chez l’adulte suspect de maladie glomérulaire primitive, cet outil aide à estimer la probabilité d’une néphropathie à IgA.", population: "Adultes de 18 ans ou plus présentant hématurie persistante, protéinurie, baisse de la fonction rénale ou suspicion de maladie glomérulaire primitive ; sans diagnostic histologique définitif ; données cliniques et biologiques complètes du même épisode." },
      oxt: { purpose: "Chez les patients suspects de néphropathie à IgA, cet outil aide à estimer la probabilité d’atrophie tubulaire/fibrose interstitielle à la biopsie.", population: "Adultes de 18 ans ou plus avec suspicion clinique ou anatomopathologique d’IgAN nécessitant une estimation du risque ; données cliniques et biologiques complètes du même épisode." }
    },
    it: {
      uBASE: { purpose: "Negli adulti con sospetta malattia glomerulare primaria, questo strumento supporta la stima della probabilità di nefropatia da IgA.", population: "Adulti di almeno 18 anni con ematuria persistente, proteinuria, riduzione della funzione renale o sospetta malattia glomerulare primaria; senza diagnosi bioptica definitiva; dati clinici e di laboratorio completi dello stesso episodio." },
      base: { purpose: "Negli adulti con sospetta malattia glomerulare primaria, questo strumento supporta la stima della probabilità di nefropatia da IgA.", population: "Adulti di almeno 18 anni con ematuria persistente, proteinuria, riduzione della funzione renale o sospetta malattia glomerulare primaria; senza diagnosi bioptica definitiva; dati clinici e di laboratorio completi dello stesso episodio." },
      oxt: { purpose: "Nei pazienti con sospetta nefropatia da IgA, questo strumento supporta la stima della probabilità di atrofia tubulare/fibrosi interstiziale alla biopsia.", population: "Adulti di almeno 18 anni con sospetto clinico o patologico di IgAN che necessitano di una stima del rischio; dati clinici e di laboratorio completi dello stesso episodio." }
    },
    ja: {
      uBASE: { purpose: "原発性糸球体疾患が疑われる成人において、IgA腎症の可能性を補助的に評価します。", population: "18歳以上で、持続する顕微鏡的・肉眼的血尿、蛋白尿、腎機能低下、または原発性糸球体疾患が疑われる方。腎生検による確定診断前で、同一診療期間の臨床・検査データがそろっていること。" },
      base: { purpose: "原発性糸球体疾患が疑われる成人において、IgA腎症の可能性を補助的に評価します。", population: "18歳以上で、持続する顕微鏡的・肉眼的血尿、蛋白尿、腎機能低下、または原発性糸球体疾患が疑われる方。腎生検による確定診断前で、同一診療期間の臨床・検査データがそろっていること。" },
      oxt: { purpose: "IgA腎症が疑われる患者において、腎生検での尿細管萎縮・間質線維化の可能性を補助的に評価します。", population: "18歳以上で、IgA腎症が臨床的または病理学的に考慮され、尿細管・間質障害のリスク評価が必要な方。同一診療期間の臨床・検査データがそろっていること。" }
    }
  };

  const MODEL_DEFS = {
    uBASE: {
      id: "uBASE", name: "IgAN-uBASE", nameEn: "IgAN-uBASE", subtitle: "基础变量 + 尿标志物", subtitleEn: "Core variables + urinary marker", interpretation: "IgA 肾病", interpretationEn: "IgA nephropathy", intercept: 0.75, importanceOrder: ["age", "alb", "ualpha1mg", "egfr", "iga", "sex"],
      formula: "A = 0.75 − 0.100897×Age + 0.780017×Sex + 0.119005×ALB − 0.034007×eGFRCr + 1.014081×IgA − 0.025577×U-α1MG",
      formulaEn: "A = 0.75 − 0.100897×Age + 0.780017×Sex + 0.119005×ALB − 0.034007×eGFRCr + 1.014081×IgA − 0.025577×U-α1MG",
      fullFormula: "P = exp(A) / (1 + exp(A)); A = 0.75 − 0.100897151392959×Age + 0.780017201693036×Sex + 0.119005247955097×ALB − 0.034007361661803×eGFRCr + 1.01408077717786×IgA − 0.025576547623995×U-α1MG",
      fields: [
        { key: "age", label: "年龄", enLabel: "Age", symbol: "Age", unit: "岁", enUnit: "years", min: 0, max: 90, step: 1, plotMin: 18, plotMax: 84, decimals: 0, default: 18, beta: -0.100897151392959 },
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
      id: "oxt", name: "IgAN-OxT", nameEn: "IgAN-OxT", subtitle: "肾小管-间质损伤风险", subtitleEn: "Tubulointerstitial injury risk", interpretation: "肾小管萎缩/间质纤维化", interpretationEn: "Tubular atrophy / interstitial fibrosis", intercept: 9.28, importanceOrder: ["egfr", "protein", "age", "c3", "ldlc"],
      formula: "A = 9.28 − 0.073423×Age − 0.077176×eGFRCr + 0.561605×U-24hTP − 1.546358×C3 + 0.092458×LDL-C",
      formulaEn: "A = 9.28 − 0.073423×Age − 0.077176×eGFR + 0.561605×24-hour protein − 1.546358×C3 + 0.092458×LDL-C",
      fullFormula: "P = exp(A) / (1 + exp(A)); A = 9.28 − 0.0734226757215475×Age − 0.0771762735979292×eGFRCr + 0.56160497842656×U-24hTP − 1.54635793205125×C3 + 0.092457733083033×LDL-C",
      fields: [
        { key: "age", label: "年龄", enLabel: "Age", symbol: "Age", unit: "岁", enUnit: "years", min: 0, max: 90, step: 1, plotMin: 18, plotMax: 70, decimals: 0, default: 34, beta: -0.0734226757215475 },
        { key: "egfr", label: "估算肾小球滤过率", enLabel: "eGFR (creatinine)", symbol: "eGFRCr", unit: "mL/min/1.73m²", enUnit: "mL/min/1.73m²", min: 0, max: 200, plotMin: 4.447097497967679, plotMax: 152.4507753547946, decimals: 2, default: 80, beta: -0.0771762735979292 },
        { key: "protein", label: "24 h 尿蛋白", enLabel: "24-hour urine protein", symbol: "U-24hTP", unit: "g/24 h", enUnit: "g/24 h", min: 0, max: 20, plotMin: 0.05, plotMax: 19.58, decimals: 2, default: 1.2, beta: 0.56160497842656, rangeSource: "cohort" },
        { key: "c3", label: "补体 C3", enLabel: "Complement C3", symbol: "C3", unit: "g/L", enUnit: "g/L", min: 0, max: 4, plotMin: 0.52, plotMax: 2.48, decimals: 2, default: 1.2, beta: -1.54635793205125, rangeSource: "cohort" },
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
    { key: "age", label: "年龄", enLabel: "Age", symbol: "Age", unit: "岁", enUnit: "years", min: 0, max: 90, step: 1, plotMin: 18, plotMax: 84, decimals: 0, default: 18, beta: -0.092949886218316 },
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
    modelList: document.querySelector("#modelList"), modelCount: document.querySelector("#modelCount"), headingModelChip: document.querySelector("#headingModelChip"), inputForm: document.querySelector("#inputForm"), formulaText: document.querySelector("#formulaText"), completionStatus: document.querySelector("#completionStatus"), runLabel: document.querySelector("#runLabel"), runHint: document.querySelector("#runHint"), validationMessage: document.querySelector("#validationMessage"), resultWorkspace: document.querySelector("#resultWorkspace"), probabilityRing: document.querySelector("#probabilityRing"), probabilityValue: document.querySelector("#probabilityValue"), aValue: document.querySelector("#aValue"), modelCode: document.querySelector("#modelCode"), riskTitle: document.querySelector("#riskTitle"), riskInterpretation: document.querySelector("#riskInterpretation"), riskScale: document.querySelector("#riskScale"), adviceCallout: document.querySelector("#adviceCallout"), adviceBody: document.querySelector("#adviceBody"), nomogram: document.querySelector("#nomogram"), nomogramSource: document.querySelector("#nomogramSource"), nomogramTierKey: document.querySelector("#nomogramTierKey"), barPlot: document.querySelector("#barPlot"), scatterPlot: document.querySelector("#scatterPlot"), modelInfoContent: document.querySelector("#modelInfoContent")
  };
  let activeModelId = "uBASE";
  let lang = "en";
  let hasRun = false;
  let validationKey = "";

  const t = (key) => UI_COPY[lang]?.[key] ?? UI_COPY.en?.[key] ?? key;
  const getLocalizedModelCopy = (model, key) => {
    const locale = MODEL_LOCALE_COPY[lang] || {};
    return locale[model.id]?.[key] ?? (model.id === "base" ? locale.uBASE?.[key] : undefined) ?? null;
  };
  const modelLabel = (model) => lang === "zh" ? model.name : model.nameEn;
  const modelSubtitle = (model) => getLocalizedModelCopy(model, "subtitle") || (lang === "zh" ? model.subtitle : model.subtitleEn);
  const fieldLabel = (field) => FIELD_COPY[lang]?.[field.key]?.[0] ?? field.enLabel ?? field.label;
  const fieldUnit = (field) => FIELD_COPY[lang]?.[field.key]?.[1] ?? field.enUnit ?? field.unit ?? "";
  const OPTION_COPY = {
    en: { 1: "Male", 0: "Female" },
    zh: { 1: "男", 0: "女" },
    de: { 1: "Männlich", 0: "Weiblich" },
    fr: { 1: "Homme", 0: "Femme" },
    it: { 1: "Maschio", 0: "Femmina" },
    ja: { 1: "男性", 0: "女性" }
  };
  const optionLabel = (option) => OPTION_COPY[lang]?.[String(option.value)] ?? option.enLabel ?? option.label;
  const tierLabel = (tier) => TIER_COPY[lang]?.[tier.key] ?? TIER_COPY.en[tier.key] ?? tier.enName;
  const MODEL_INFO_LABELS = {
    en: { continuous: "Continuous values are entered as measured.", runtime: "All calculations run in the browser without a remote API." },
    zh: { continuous: "连续变量使用真实检查值。", runtime: "计算在浏览器端完成，不调用远程接口。" },
    de: { continuous: "Kontinuierliche Werte werden wie gemessen eingegeben.", runtime: "Alle Berechnungen laufen im Browser ohne eine entfernte API." },
    fr: { continuous: "Les valeurs continues sont saisies telles que mesurées.", runtime: "Tous les calculs sont effectués dans le navigateur, sans API distante." },
    it: { continuous: "I valori continui sono inseriti come misurati.", runtime: "Tutti i calcoli vengono eseguiti nel browser senza API remota." },
    ja: { continuous: "連続変数は測定値をそのまま入力します。", runtime: "計算はリモートAPIを使わずブラウザ内で実行されます。" }
  };
  const modelInfoText = (key) => MODEL_INFO_LABELS[lang]?.[key] ?? MODEL_INFO_LABELS.en[key];
  const formatNumber = (value, decimals = 2) => { if (!Number.isFinite(value)) return "—"; const fixed = Number(value).toFixed(decimals); return fixed.includes(".") ? fixed.replace(/0+$/, "").replace(/\.$/, "") : fixed; };
  const logistic = (a) => a >= 0 ? 1 / (1 + Math.exp(-a)) : Math.exp(a) / (1 + Math.exp(a));
  const logit = (p) => Math.log(p / (1 - p));
  const getTier = (p) => RISK_TIERS.find((tier) => p < tier.max) || RISK_TIERS[RISK_TIERS.length - 1];
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  function updateStaticText() {
    const ids = ["brandName", "brandSubtitle", "modelSuiteLabel", "modelCount", "privacyTitle", "privacyText", "sidebarFooter", "heroKicker", "pageTitle", "pageIntro", "heroMetaOne", "heroMetaTwo", "heroMetaThree", "breadcrumbOne", "breadcrumbTwo", "sectionHeading", "headingIntro", "formulaLabel", "inputKicker", "inputTitle", "outputKicker", "resultTitle", "actionKicker", "liveLabel", "probabilityCaption", "riskLabel", "aLabel", "modelLabel", "inputHint", "runLabel", "runHint", "adviceTitle", "adviceNote", "nomogramKicker", "nomogramTitle", "nomogramIntro", "legendCurrent", "legendThreshold", "nomogramSource", "explanationKicker", "explanationTitle", "explanationIntro", "barPlotTitle", "scatterPlotTitle", "scatterPlotNote", "legendCase", "legendLow", "legendHigh", "modelInfoKicker", "modelInfoTitle"];
    const keyById = { modelSuiteLabel: "modelSuite", offlineLabel: "offline", exportLabel: "export", disclaimerText: "disclaimer" };
    ids.forEach((id) => { const node = document.querySelector(`#${id}`); if (node) node.textContent = t(id); });
    Object.entries(keyById).forEach(([id, key]) => { const node = document.querySelector(`#${id}`); if (node) node.textContent = t(key); });
    const languageToggle = document.querySelector("#languageToggle");
    if (languageToggle) { languageToggle.value = lang; languageToggle.setAttribute("aria-label", t("languageLabel")); }
    document.querySelector("#resetButton").setAttribute("title", t("resetTitle"));
    document.querySelector("#resetButton").setAttribute("aria-label", t("resetTitle"));
    const exportButton = document.querySelector("#printButton");
    if (exportButton) { exportButton.setAttribute("title", t("export")); exportButton.setAttribute("aria-label", t("export")); }
    const modelNav = document.querySelector("#modelList");
    if (modelNav) modelNav.setAttribute("aria-label", t("navModel"));
    const ariaLabels = { nomogram: t("nomogramTitle"), riskScale: t("riskLabel"), barPlot: t("barPlotTitle"), scatterPlot: t("scatterPlotTitle") };
    Object.entries(ariaLabels).forEach(([id, label]) => { const node = document.querySelector(`#${id}`); if (node) node.setAttribute("aria-label", label); });
    const locale = SUPPORTED_LOCALES.find((item) => item.code === lang) || SUPPORTED_LOCALES[0];
    document.documentElement.lang = locale.htmlLang;
    document.title = `${t("brandName")} · ${t("pageTitle")}`;
    if (validationKey && els.validationMessage) els.validationMessage.textContent = t(validationKey);
  }

  function renderModelList() {
    els.modelList.innerHTML = Object.values(MODEL_DEFS).map((model, index) => `<button class="model-button ${model.id === activeModelId ? "active" : ""}" data-model="${model.id}" type="button" aria-pressed="${model.id === activeModelId}"><span class="model-bullet">0${index + 1}</span><span><strong>${modelLabel(model)}</strong><small>${modelSubtitle(model)}</small></span></button>`).join("");
  }

  function renderForm(model, initialValues = {}) {
    els.inputForm.innerHTML = model.fields.map((field) => {
      const rawValue = initialValues[field.key] ?? "";
      const input = field.type === "select" ? `<select id="field-${field.key}" name="${field.key}" aria-label="${fieldLabel(field)}"><option value="" disabled ${rawValue === "" ? "selected" : ""}>${t("selectPlaceholder")}</option>${field.options.map((option) => `<option value="${option.value}" ${String(option.value) === String(rawValue) ? "selected" : ""}>${optionLabel(option)}</option>`).join("")}</select>` : `<input id="field-${field.key}" name="${field.key}" type="number" inputmode="decimal" value="${rawValue}" min="${field.min}" max="${field.max}" step="${field.step || 0.01}" required aria-label="${fieldLabel(field)}" />`;
      const hint = field.type === "select" ? t("sexHint") : `${t("range")} ${formatNumber(field.min, field.decimals)} – ${formatNumber(field.max, field.decimals)}`;
      return `<div class="field"><div class="field-label"><label for="field-${field.key}">${fieldLabel(field)}<span>${field.symbol}</span></label><span class="field-unit">${fieldUnit(field)}</span></div><div class="field-control">${input}</div><div class="field-hint">${hint}</div></div>`;
    }).join("");
    els.inputForm.querySelectorAll("input, select").forEach((input) => { input.addEventListener("input", handleInputChange); input.addEventListener("change", handleInputChange); });
    if (els.formulaText) els.formulaText.textContent = lang === "zh" ? model.formula : model.formulaEn;
    els.headingModelChip.textContent = modelLabel(model);
    if (els.modelCode) els.modelCode.textContent = modelLabel(model);
  }

  function readRawValues(model) {
    return Object.fromEntries(model.fields.map((field) => [field.key, els.inputForm.elements[field.key]?.value ?? ""]));
  }

  function updateInputState() {
    const model = MODEL_DEFS[activeModelId];
    const rawValues = readRawValues(model);
    const filled = model.fields.filter((field) => rawValues[field.key] !== "").length;
    els.completionStatus.textContent = `${t("filled")} ${filled} / ${model.fields.length}`;
    return { filled, total: model.fields.length };
  }

  function hideResults() {
    hasRun = false;
    if (els.resultWorkspace) els.resultWorkspace.hidden = true;
  }

  function showResults() {
    if (els.resultWorkspace) els.resultWorkspace.hidden = false;
  }

  function handleInputChange() {
    hideResults();
    validationKey = "";
    els.validationMessage.textContent = "";
    updateInputState();
  }

  function readValues(model) {
    const values = {}; let valid = true;
    model.fields.forEach((field) => { const element = els.inputForm.elements[field.key]; const rawValue = element?.value?.trim() ?? ""; const value = rawValue === "" ? NaN : Number(rawValue); values[field.key] = value; const step = Number(field.step); const stepMismatch = Number.isFinite(step) && step > 0 && Number.isFinite(value) && Math.abs((value - field.min) / step - Math.round((value - field.min) / step)) > 1e-9; if (!Number.isFinite(value) || value < field.min || value > field.max || stepMismatch) valid = false; });
    return { values, valid };
  }

  function calculate(model, values) {
    const terms = model.fields.map((field) => ({ field, contribution: field.beta * values[field.key] }));
    const a = model.intercept + terms.reduce((sum, term) => sum + term.contribution, 0);
    return { a, p: logistic(a), terms };
  }

  function interpretation(model, tier) {
    const localized = getLocalizedModelCopy(model, "tiers")?.[tier.key];
    if (localized) return localized;
    const fallback = {
      uBASE: {
        zh: { veryLow: "IgA 肾病极低可能，需考虑非 IgA 肾病或非肾小球性原因", low: "IgA 肾病低可能，但仍需鉴别其他肾小球疾病", medium: "IgA 肾病概率中等，需进一步评估", high: "IgA 肾病高可能，高度怀疑 IgA 肾病", veryHigh: "IgA 肾病极高可能，建议按高度疑似 IgA 肾病处理" },
        en: { veryLow: "Very low likelihood of IgA nephropathy; consider non-IgAN or non-glomerular causes", low: "Low likelihood of IgA nephropathy; other glomerular diseases remain possible", medium: "Intermediate likelihood; further assessment is needed", high: "High likelihood of IgA nephropathy", veryHigh: "Very high likelihood; manage as highly suspected IgA nephropathy" }
      },
      oxt: {
        zh: { veryLow: "肾小管萎缩/间质纤维化可能性极低", low: "肾小管萎缩/间质纤维化可能性较低", medium: "肾小管萎缩/间质纤维化概率中等，需进一步评估", high: "高度提示肾小管萎缩/间质纤维化", veryHigh: "肾小管萎缩/间质纤维化极高可能" },
        en: { veryLow: "Very low likelihood of tubular atrophy/interstitial fibrosis", low: "Low likelihood of tubular atrophy/interstitial fibrosis", medium: "Intermediate likelihood; further assessment needed", high: "High likelihood of tubular atrophy/interstitial fibrosis", veryHigh: "Very high likelihood of tubular atrophy/interstitial fibrosis" }
      }
    };
    const modelFallback = fallback[model.id] || fallback.uBASE;
    return modelFallback[lang]?.[tier.key] ?? modelFallback.en[tier.key];
  }

  function recommendation(model, tier) {
    const localized = getLocalizedModelCopy(model, "recommendations")?.[tier.key];
    if (localized) return localized;
    const pair = model.recommendations?.[tier.key];
    if (!pair) return "";
    return pair[lang === "zh" ? 0 : 1] ?? pair[1] ?? pair[0];
  }

  function updateResult() {
    const model = MODEL_DEFS[activeModelId]; const { values, valid } = readValues(model);
    if (!valid) { hideResults(); validationKey = "invalid"; els.validationMessage.textContent = t(validationKey); updateInputState(); return; }
    hasRun = true; showResults();
    validationKey = ""; els.validationMessage.textContent = ""; els.completionStatus.textContent = `${t("filled")} ${model.fields.length} / ${model.fields.length}`;
    const result = calculate(model, values); const tier = getTier(result.p); const label = interpretation(model, tier);
    els.probabilityRing.style.setProperty("--probability", `${result.p * 100}%`); els.probabilityRing.style.background = `conic-gradient(${tier.color} ${result.p * 100}%, #e7eeef 0)`; els.probabilityValue.textContent = `${(result.p * 100).toFixed(2)}%`; els.aValue.textContent = result.a.toFixed(4); els.riskTitle.textContent = tierLabel(tier); els.riskTitle.style.color = tier.color; els.riskInterpretation.textContent = label; els.adviceCallout.textContent = `${label}.`; els.adviceCallout.style.borderLeftColor = tier.color; els.adviceCallout.style.color = tier.color === "#d94d51" ? "#913538" : "#48652f"; els.adviceBody.textContent = recommendation(model, tier);
    renderRiskScale(result.p, tier); renderNomogram(model, values, result, tier); renderBarPlot(model, result); renderScatterPlot(model, result); renderModelInfo(model);
  }

  function setNomogramSource(model) {
    els.nomogramSource.textContent = t("nomogramSource");
  }

  function renderNomogramTierKey() {
    if (!els.nomogramTierKey) return;
    els.nomogramTierKey.innerHTML = RISK_TIERS.map((tier) => `<span><i style="background:${tier.color}"></i>${tierLabel(tier)}</span>`).join("");
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
      for (let i = 0; i <= 10; i += 1) { const x = pointX(maxPoints * i / 10); line(x, y, x, y + (i % 2 === 0 ? 7 : 4), { stroke: "#79929a", "stroke-width": 1 }); const rawRatio = field.beta < 0 ? 1 - i / 10 : i / 10; const rawValue = range.minValue + rawRatio * (range.maxValue - range.minValue); const isEndpoint = i === 0 || i === 10; const label = field.type === "select" ? (isEndpoint ? optionLabel(field.options.find((option) => String(option.value) === String(rawValue > .5 ? 1 : 0)) || { value: rawValue > .5 ? 1 : 0 }) : "") : formatNumber(rawValue, field.decimals); if ((field.type === "select" ? isEndpoint : i === 0 || i === 5 || i === 10) && label) text(x, y + 21, label, { "text-anchor": "middle", fill: "#708890", "font-size": 9 }); }
      const plottedPoints = clamp(points, 0, maxPoints); const mx = pointX(plottedPoints); line(mx, y - 9, mx, y + 11, { stroke: "#13a39e", "stroke-width": 2.2 }); add("circle", { cx: mx, cy: y, r: 5, fill: "#fff", stroke: "#13a39e", "stroke-width": 2.2 }); add("circle", { cx: mx, cy: y, r: 2, fill: "#13a39e" }); text(mx, y - 13, `${Math.round(plottedPoints)} ${t("points")}`, { "text-anchor": "middle", fill: "#087278", "font-size": 9, "font-weight": "800" }); const endLabelX = rowEnd >= left + axisWidth - 2 ? rowEnd - 2 : rowEnd + 5; text(endLabelX, y + 37, `${formatNumber(field.beta > 0 ? range.maxValue : range.minValue, field.decimals)} → ${Math.round(maxPoints)} ${t("points")}`, { "text-anchor": rowEnd >= left + axisWidth - 2 ? "end" : "start", fill: "#9aacb0", "font-size": 8 });
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

  function orderedTerms(model, result) {
    const order = new Map((model.importanceOrder || model.fields.map((field) => field.key)).map((key, index) => [key, index]));
    return result.terms.slice().sort((a, b) => (order.get(a.field.key) ?? 999) - (order.get(b.field.key) ?? 999));
  }

  function renderBarPlot(model, result) {
    const svg = els.barPlot; if (!svg) return;
    const ns = "http://www.w3.org/2000/svg"; const width = 960; const left = 190; const right = 34; const axisWidth = width - left - right; const top = 58; const rowHeight = 53; const height = top + result.terms.length * rowHeight + 52;
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`); svg.setAttribute("height", String(height)); svg.innerHTML = "";
    const add = (tag, attrs, value) => { const node = document.createElementNS(ns, tag); Object.entries(attrs || {}).forEach(([key, val]) => node.setAttribute(key, val)); if (value !== undefined) node.textContent = value; svg.appendChild(node); return node; };
    const line = (x1, y1, x2, y2, attrs = {}) => add("line", { x1, y1, x2, y2, ...attrs });
    const text = (x, y, value, attrs = {}) => add("text", { x, y, fill: "#67818b", "font-size": 10, ...attrs }, value);
    const sorted = orderedTerms(model, result); const maxBar = Math.max(...sorted.map((term) => Math.abs(term.contribution)), 1);
    add("rect", { x: 0, y: 0, width, height, rx: 7, fill: "#fbfdfc" });
    text(18, 25, t("featureLabel"), { fill: "#315864", "font-size": 10, "font-weight": "800", "letter-spacing": "1" });
    text(left, 25, t("barAxis"), { fill: "#315864", "font-size": 10, "font-weight": "800" });
    line(left, 35, left + axisWidth, 35, { stroke: "#9aafb3", "stroke-width": 1.2 });
    [0, .25, .5, .75, 1].forEach((ratio) => { const x = left + axisWidth * ratio; line(x, 35, x, 42, { stroke: "#718b93" }); text(x, 25, formatNumber(maxBar * ratio, 2), { "text-anchor": "middle", fill: "#738990", "font-size": 8 }); });
    sorted.forEach(({ field, contribution }, index) => {
      const y = top + index * rowHeight; const magnitude = Math.abs(contribution); const barEnd = left + magnitude / maxBar * axisWidth;
      text(18, y + 4, fieldLabel(field), { fill: "#294d5a", "font-size": 11, "font-weight": "700" }); text(18, y + 19, field.symbol, { fill: "#9aabb0", "font-size": 9 });
      line(0, y + 32, width, y + 32, { stroke: "#edf2f1" }); add("rect", { x: left, y: y - 9, width: axisWidth, height: 18, rx: 4, fill: "#edf3f2" }); add("rect", { x: left, y: y - 9, width: Math.max(3, barEnd - left), height: 18, rx: 4, fill: contribution >= 0 ? "#1aa7a1" : "#d96a61" });
      const labelX = barEnd > width - 85 ? width - 9 : barEnd + 10; text(labelX, y + 5, `${contribution >= 0 ? "+" : ""}${contribution.toFixed(3)}`, { "text-anchor": barEnd > width - 85 ? "end" : "start", fill: contribution >= 0 ? "#087278" : "#a84443", "font-size": 9, "font-weight": "800" });
    });
    text(left, height - 12, t("barFooter"), { fill: "#8aa0a6", "font-size": 9 });
  }

  function renderScatterPlot(model, result) {
    const svg = els.scatterPlot; if (!svg) return;
    const ns = "http://www.w3.org/2000/svg"; const width = 1040; const left = 190; const right = 72; const axisWidth = width - left - right; const top = 68; const rowHeight = 58; const height = top + result.terms.length * rowHeight + 64;
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`); svg.setAttribute("height", String(height)); svg.innerHTML = "";
    const add = (tag, attrs, value) => { const node = document.createElementNS(ns, tag); Object.entries(attrs || {}).forEach(([key, val]) => node.setAttribute(key, val)); if (value !== undefined) node.textContent = value; svg.appendChild(node); return node; };
    const line = (x1, y1, x2, y2, attrs = {}) => add("line", { x1, y1, x2, y2, ...attrs });
    const text = (x, y, value, attrs = {}) => add("text", { x, y, fill: "#67818b", "font-size": 10, ...attrs }, value);
    const sorted = orderedTerms(model, result); const maxScatter = Math.max(...model.fields.map((field) => Math.abs(field.beta * ((field.plotMax ?? field.max) - (field.plotMin ?? field.min)) / 2)), ...result.terms.map((term) => Math.abs(term.contribution)), 1); const center = left + axisWidth / 2; const scatterX = (value) => center + clamp(value / maxScatter, -1, 1) * (axisWidth / 2 - 16);
    add("rect", { x: 0, y: 0, width, height, rx: 7, fill: "#fbfdfc" });
    text(18, 26, t("featureLabel"), { fill: "#315864", "font-size": 10, "font-weight": "800", "letter-spacing": "1" }); text(left, 26, t("scatterAxis"), { fill: "#315864", "font-size": 10, "font-weight": "800" });
    line(center, 39, center, height - 39, { stroke: "#8fa4aa", "stroke-width": 1.5 });
    [-1, -.5, 0, .5, 1].forEach((ratio) => { const x = scatterX(ratio * maxScatter); line(x, height - 37, x, height - 30, { stroke: "#718b93" }); text(x, height - 17, formatNumber(ratio * maxScatter, 2), { "text-anchor": "middle", fill: "#738990", "font-size": 8 }); });
    line(left, height - 37, width - right, height - 37, { stroke: "#9aafb3", "stroke-width": 1.2 });
    sorted.forEach(({ field, contribution }, index) => {
      const y = top + index * rowHeight; const range = { min: field.plotMin ?? field.min, max: field.plotMax ?? field.max }; const mid = (range.min + range.max) / 2;
      text(18, y + 4, fieldLabel(field), { fill: "#294d5a", "font-size": 11, "font-weight": "700" }); text(18, y + 20, field.symbol, { fill: "#9aabb0", "font-size": 9 }); line(left, y, width - right, y, { stroke: "#d9e4e3", "stroke-dasharray": "2 7" });
      const count = field.type === "select" ? 2 : 25; for (let j = 0; j < count; j += 1) { const value = field.type === "select" ? (j === 0 ? 0 : 1) : range.min + (range.max - range.min) * j / (count - 1); const delta = field.beta * (value - mid); const jitter = Math.sin((j + 1) * (index + 2) * 1.37) * 10; add("circle", { cx: scatterX(delta), cy: y + jitter, r: field.type === "select" ? 5.4 : 3.8, fill: interpolateColor((value - range.min) / (range.max - range.min || 1)), opacity: .9 }); }
      const currentDelta = contribution - field.beta * mid; const currentX = scatterX(currentDelta); line(currentX, y - 16, currentX, y + 16, { stroke: "#13a39e", "stroke-width": 2 }); add("circle", { cx: currentX, cy: y, r: 5, fill: "#fff", stroke: "#13a39e", "stroke-width": 2.2 });
    });
    text(left, 48, t("lowValue"), { fill: "#268bd8", "font-size": 9 }); text(left + 28, 48, "→", { fill: "#8aa0a6", "font-size": 9 }); text(width - right, 48, t("highValue"), { "text-anchor": "end", fill: "#e85967", "font-size": 9 });
    text(left, height - 2, t("negativeCaption"), { fill: "#8aa0a6", "font-size": 9 }); text(width - right, height - 2, t("positiveCaption"), { "text-anchor": "end", fill: "#8aa0a6", "font-size": 9 });
  }

  function renderModelInfo(model) {
    const names = model.fields.map(fieldLabel).join(lang === "zh" || lang === "ja" ? "、" : ", ");
    const info = MODEL_INFO_COPY[lang]?.[model.id] ?? MODEL_INFO_COPY.en[model.id] ?? MODEL_INFO_COPY.en.uBASE;
    const labels = { intendedUse: t("intendedUse"), population: t("population"), inputs: t("inputs"), runtime: t("runtime") };
    els.modelInfoContent.innerHTML = `<dl><dt>${labels.intendedUse}</dt><dd>${info.purpose}</dd><dt>${labels.population}</dt><dd>${info.population}</dd><dt>${labels.inputs}</dt><dd>${names}. ${modelInfoText("continuous")}</dd><dt>${labels.runtime}</dt><dd>${modelInfoText("runtime")}</dd></dl>`;
  }

  function selectModel(modelId) { if (!MODEL_DEFS[modelId]) return; activeModelId = modelId; renderModelList(); renderForm(MODEL_DEFS[activeModelId]); hideResults(); validationKey = ""; els.validationMessage.textContent = ""; updateInputState(); }
  els.modelList.addEventListener("click", (event) => { const button = event.target.closest("[data-model]"); if (button) selectModel(button.dataset.model); });
  document.querySelector("#languageToggle").addEventListener("change", (event) => { const rawValues = readRawValues(MODEL_DEFS[activeModelId]); const wasRun = hasRun; lang = SUPPORTED_LOCALES.some((locale) => locale.code === event.target.value) ? event.target.value : "en"; updateStaticText(); renderModelList(); renderForm(MODEL_DEFS[activeModelId], rawValues); updateInputState(); if (validationKey) els.validationMessage.textContent = t(validationKey); if (wasRun) updateResult(); });
  document.querySelector("#resetButton").addEventListener("click", () => { renderForm(MODEL_DEFS[activeModelId]); hideResults(); validationKey = ""; els.validationMessage.textContent = ""; updateInputState(); });
  document.querySelector("#printButton").addEventListener("click", () => window.print());
  els.inputForm.addEventListener("submit", (event) => { event.preventDefault(); updateResult(); });
  updateStaticText(); renderModelList(); renderForm(MODEL_DEFS[activeModelId]); hideResults(); updateInputState();
})();
