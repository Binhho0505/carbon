// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

// Run from the repository root: node packages/locale/scripts/verify-catalogs.mjs vi
// Uses the existing pinned Lingui CLI toolchain; no translation API or new dependency.
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { parsePo } from "../../../.claude/skills/translate/scripts/lib-po.mjs";

const repo = fileURLToPath(new URL("../../../", import.meta.url));
const require = createRequire(new URL("../../../package.json", import.meta.url));
const cliRequire = createRequire(require.resolve("@lingui/cli/api"));
const { parse } = cliRequire("@formatjs/icu-messageformat-parser");
const locale = process.argv[2] || "vi";
if (!/^[a-z]{2}$/.test(locale)) throw new Error("Expected a two-letter locale code");

const read = (language, catalog) => parsePo(
  readFileSync(`${repo}/packages/locale/locales/${language}/${catalog}.po`, "utf8").replaceAll("\r\n", "\n")
).entries.filter((entry) => entry.msgid);
const tags = (text) => [...text.matchAll(/<\/?\d+\s*\/?>/g)].map((match) => match[0]).sort();
const validTagNesting = (text) => {
  const stack = [];
  for (const match of text.matchAll(/<\/?(\d+)\s*\/?>/g)) {
    if (match[0].startsWith("</")) {
      if (stack.pop() !== match[1]) return false;
    } else if (!match[0].endsWith("/>")) stack.push(match[1]);
  }
  return stack.length === 0;
};
const signature = (nodes) => nodes.filter((node) => node.type !== 0).map((node) => ({
  type: node.type,
  name: node.value,
  ...(node.style ? { style: node.style } : {}),
  ...(node.options ? {
    options: Object.fromEntries(Object.entries(node.options).sort(([a], [b]) => a.localeCompare(b)).map(([key, option]) => [key, signature(option.value)])),
    ...(node.type === 6 ? { pluralType: node.pluralType, offset: node.offset } : {})
  } : {}),
  ...(node.children ? { children: signature(node.children) } : {})
})).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));

const issues = [];
const stats = {};
const catalogs = {};
for (const catalog of ["erp", "mes"]) {
  const source = read("en", catalog);
  const translated = read(locale, catalog);
  const sourceIds = new Set(source.map((entry) => entry.msgid));
  const translations = new Map(translated.map((entry) => [entry.msgid, entry.msgstr]));
  catalogs[catalog] = translations;
  const report = (msgid, error) => issues.push({ catalog, msgid, error });
  if (translations.size !== translated.length) report("", "Duplicate message IDs");
  for (const entry of translated) if (!sourceIds.has(entry.msgid)) report(entry.msgid, "Unknown source ID");
  let complete = 0;
  for (const { msgid } of source) {
    const value = translations.get(msgid);
    if (!value?.trim()) { report(msgid, "Missing/empty translation"); continue; }
    complete++;
    if (JSON.stringify(tags(msgid)) !== JSON.stringify(tags(value))) report(msgid, "Rich-text tag mismatch");
    if (!validTagNesting(value)) report(msgid, "Invalid rich-text tag nesting");
    if (msgid.match(/^\s*/)[0] !== value.match(/^\s*/)[0] || msgid.match(/\s*$/)[0] !== value.match(/\s*$/)[0]) report(msgid, "Boundary whitespace mismatch");
    try {
      const original = parse(msgid, { ignoreTag: true });
      const translation = parse(value, { ignoreTag: true });
      if (JSON.stringify(signature(original)) !== JSON.stringify(signature(translation))) report(msgid, "ICU argument/branch mismatch");
    } catch (error) { report(msgid, `ICU parse: ${error.message}`); }
  }
  stats[catalog] = { source: source.length, translated: complete, missing: source.length - complete };
}
let shared = 0;
const contextualDifferences = [];
const contextExceptions = new Map([
  ["Failed", "ERP workflow/template execution failure; MES failed quality inspection"]
]);
for (const [msgid, value] of catalogs.erp) {
  if (!catalogs.mes.has(msgid)) continue;
  shared++;
  if (value !== catalogs.mes.get(msgid)) {
    if (contextExceptions.has(msgid)) contextualDifferences.push({ msgid, reason: contextExceptions.get(msgid) });
    else issues.push({ catalog: "shared", msgid, error: "ERP/MES shared translation differs" });
  }
}
console.log(JSON.stringify({ locale, catalogs: stats, shared, contextualDifferences, issues: issues.length }, null, 2));
if (issues.length) { console.log(JSON.stringify(issues.slice(0, 30), null, 2)); process.exitCode = 1; }
