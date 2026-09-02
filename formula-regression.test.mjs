import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";

const source = await fs.readFile(new URL("./app.js", import.meta.url), "utf8");

// Keep the published literals auditable: these strings must match the signed-off model specification.
const coefficients = [
  "0.75",
  "-0.100897151392959",
  "0.780017201693036",
  "0.119005247955097",
  "-0.034007361661803",
  "1.01408077717786",
  "-0.025576547623995",
  "-3.05",
  "-0.092949886218316",
  "1.0251875681476",
  "0.169831025161927",
  "-0.0246182086243941",
  "1.07462360040374",
  "9.28",
  "-0.0734226757215475",
  "-0.0771762735979292",
  "0.56160497842656",
  "-1.54635793205125",
  "0.092457733083033"
];

for (const coefficient of coefficients) {
  assert.ok(source.includes(coefficient), `missing coefficient ${coefficient}`);
}
assert.match(source, /− 1\.54635793205125×C3 \+ 0\.092457733083033×LDL-C/);
assert.match(source, /step=\"\$\{field\.step \?\? \"any\"\}\"/);
assert.match(source, /min: 0, max: 90, step: 1/);
assert.match(source, /const probabilityToX = \(probability\) => xAt\(clamp\(Number\.isFinite\(probability\) \? probability : 0, 0, 1\)\)/);
assert.match(source, /const totalX = probabilityToX\(result\.p\)/);
assert.match(source, /const pX = probabilityToX\(result\.p\)/);
assert.match(source, /positive: "#d95757", negative: "#2e9d72"/);
assert.match(source, /const center = left \+ axisWidth \/ 2/);
// Scatter uses the same raw beta × value contribution as Bar. The old
// midpoint-centred delta made the current marker disagree with the Bar value.
assert.match(source, /function termContribution\(field, value\) \{[\s\S]*?return field\.beta \* value/);
assert.match(source, /const contributionValue = termContribution\(field, value\)/);
assert.match(source, /cx: scatterX\(contributionValue\)/);
assert.match(source, /const currentX = scatterX\(contribution\)/);
assert.match(source, /const maxBar = contributionDomain\(model, result\)/);
assert.match(source, /const maxScatter = contributionDomain\(model, result\)/);
assert.doesNotMatch(source, /centeredContribution/);
assert.doesNotMatch(source, /currentDelta/);

// Exercise the exact browser-side ordering helper from the published source.
// This keeps the Bar and Scatter row order auditable without requiring a DOM.
const orderedTermsSource = source.match(/function orderedTerms\(model, result\) \{[\s\S]*?\n  \}\n\n  function renderBarPlot/);
assert.ok(orderedTermsSource, "orderedTerms helper is present");
const orderedTerms = vm.runInNewContext(`(${orderedTermsSource[0].replace(/\n\n  function renderBarPlot[\s\S]*$/, "")})`);
const testModel = { importanceOrder: ["tieLate", "tieEarly"] };
const testTerms = [
  { field: { key: "small", beta: 1 }, contribution: 0.25 },
  { field: { key: "tieEarly", beta: 1 }, contribution: -2 },
  { field: { key: "largest", beta: 1 }, contribution: 3 },
  { field: { key: "tieLate", beta: 1 }, contribution: 2 },
  { field: { key: "zero", beta: 1 }, contribution: 0 }
];
assert.deepEqual(orderedTerms(testModel, { terms: testTerms }).map((term) => term.field.key), ["largest", "tieLate", "tieEarly", "small", "zero"]);
assert.deepEqual(orderedTerms({ importanceOrder: ["tieEarly", "tieLate"] }, { terms: testTerms }).map((term) => term.field.key), ["largest", "tieEarly", "tieLate", "small", "zero"]);

const logistic = (a) => 1 / (1 + Math.exp(-a));
const close = (actual, expected, tolerance = 1e-12) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} is not within ${tolerance} of ${expected}`);
};

// Synthetic values only; no patient data is stored in the repository.
const u = { age: 42, sex: 0, alb: 35.2, egfr: 88.75, iga: 2.4, ua: 12.5 };
const uA = 0.75 - 0.100897151392959 * u.age + 0.780017201693036 * u.sex + 0.119005247955097 * u.alb - 0.034007361661803 * u.egfr + 1.01408077717786 * u.iga - 0.025576547623995 * u.ua;
close(uA, -0.202761958042953);
close(logistic(uA), 0.4494824668147548);

const baseA = -3.05 - 0.092949886218316 * u.age + 1.0251875681476 * u.sex + 0.169831025161927 * u.alb - 0.0246182086243941 * u.egfr + 1.07462360040374 * u.iga;
close(baseA, -0.5816125099154417);
close(logistic(baseA), 0.35856163961706994);

const o = { age: 42, egfr: 88.75, protein: 1.8, c3: 1.05, ldlc: 3.6 };
const oxTA = 9.28 - 0.0734226757215475 * o.age - 0.0771762735979292 * o.egfr + 0.56160497842656 * o.protein - 1.54635793205125 * o.c3 + 0.092457733083033 * o.ldlc;
close(oxTA, -0.9330856905082973);
close(logistic(oxTA), 0.2822991143397058);
const oxTAWithoutC3 = 9.28 - 0.0734226757215475 * o.age - 0.0771762735979292 * o.egfr + 0.56160497842656 * o.protein + 0.092457733083033 * o.ldlc;
close(oxTA - oxTAWithoutC3, -1.54635793205125 * o.c3);

console.log("Formula regression checks passed.");
