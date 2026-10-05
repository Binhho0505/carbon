// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";

vi.mock("@carbon/env", () => ({
  getBrowserEnv: () => ({ DEFAULT_LANGUAGE: "en" })
}));

import {
  defaultLanguage,
  getSortedLanguageSelectOptions,
  resolveLanguage,
  supportedLanguages
} from "./config";

describe("Vietnamese locale support", () => {
  it("resolves Vietnamese regional preferences without changing the default", () => {
    expect(resolveLanguage("vi")).toBe("vi");
    expect(resolveLanguage("vi-VN")).toBe("vi");
    expect(resolveLanguage("VI-vn")).toBe("vi");
    expect(defaultLanguage).toBe("en");
    expect(resolveLanguage(null)).toBe("en");
    expect(resolveLanguage("unsupported")).toBe("en");
    expect(resolveLanguage("nl")).toBe("en");
  });

  it("offers the native Vietnamese label in existing language pickers", () => {
    const options = getSortedLanguageSelectOptions("vi-VN");
    expect(options).toContainEqual({ value: "vi", label: "Tiếng Việt" });
    expect(new Set(options.map((option) => option.value)).size).toBe(
      supportedLanguages.length
    );
    expect(options).toContainEqual({ value: "en", label: "English" });
  });

  it("keeps selectable languages in sync with extracted Lingui catalogs", () => {
    const config = readFileSync(
      new URL("../../../lingui.config.js", import.meta.url),
      "utf8"
    );
    const locales = config.match(/locales:\s*\[([^\]]+)\]/)?.[1];
    expect(locales).toBeDefined();
    const extracted = [...(locales ?? "").matchAll(/"([a-z-]+)"/g)].map(
      (match) => match[1]
    );
    expect(extracted.sort()).toEqual([...supportedLanguages].sort());
  });
});
