// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import type { Dataset } from "../../types.ts";
import { fmcgAccounting } from "./accounting.ts";
import { fmcgChangeOrders } from "./change-orders.ts";
import { fmcgFoundation } from "./foundation.ts";
import { fmcgInventory } from "./inventory.ts";
import { fmcgItems } from "./items.ts";
import { fmcgOps } from "./ops.ts";
import { fmcgPlanning } from "./planning.ts";
import { fmcgProduction } from "./production.ts";
import { fmcgPurchasing } from "./purchasing.ts";
import { fmcgQuality } from "./quality.ts";
import { fmcgSales } from "./sales.ts";
import { fmcgWorkflows } from "./workflows.ts";

export const fmcg: Dataset = {
  baseCurrencyCode: "VND",
  key: "fmcg",
  label: "FMCG Việt Nam — 3 nhà máy",
  industryId: null,
  foundation: fmcgFoundation,
  items: fmcgItems,
  inventory: fmcgInventory,
  sales: fmcgSales,
  purchasing: fmcgPurchasing,
  production: fmcgProduction,
  quality: fmcgQuality,
  changeOrders: fmcgChangeOrders,
  accounting: fmcgAccounting,
  ops: fmcgOps,
  workflows: fmcgWorkflows,
  planning: fmcgPlanning
};
