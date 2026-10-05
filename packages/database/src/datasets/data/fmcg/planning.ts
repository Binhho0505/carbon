// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import type { PlanningData } from "../../types.ts";

export const fmcgPlanning: PlanningData = {
  buyItemIds: [
    "RM-TEA-GREEN",
    "RM-FOOD-SEASONING",
    "PKG-BEV-PET-500",
    "PKG-FOOD-POUCH",
    "PKG-BEV-TRACE-LABEL",
    "PKG-BEV-SHRINK"
  ],
  makeItemIds: [
    "FG-BEV-TEA-500",
    "FG-FOOD-SNACK-12",
    "WIP-BEV-TEA",
    "WIP-BEV-FLAVOR",
    "PKG-BEV-CASE"
  ],
  demandProjections: [
    {
      readableId: "FG-BEV-TEA-500",
      quantities: [8, 8, 10, 10, 12, 12, 15, 15]
    },
    {
      readableId: "FG-FOOD-SNACK-12",
      quantities: [12, 12, 16, 16, 20, 20, 24, 24]
    },
    {
      readableId: "WIP-BEV-TEA",
      quantities: [10, 10, 12, 12, 14, 14, 18, 18]
    }
  ],
  demandOrder: {
    ref: "so:planning-seed",
    status: "To Ship",
    customer: "Siêu thị An Việt Demo",
    currencyCode: "VND",
    shippingMethod: "UPS Ground",
    promisedDateOffset: 56,
    lines: [
      {
        item: "RM-TEA-GREEN",
        salesOrderLineType: "Part",
        saleQuantity: 96,
        unitPriceMultiplier: 1.5,
        unitOfMeasureCode: "EA",
        methodType: "Pull from Inventory",
        status: "Ordered",
        sortOrder: 1
      },
      {
        item: "PKG-BEV-PET-500",
        salesOrderLineType: "Part",
        saleQuantity: 24,
        unitPriceMultiplier: 1.5,
        unitOfMeasureCode: "EA",
        methodType: "Pull from Inventory",
        status: "Ordered",
        sortOrder: 2
      }
    ]
  },
  hq: {
    reorderItemIds: ["FG-FOOD-SNACK-12", "PKG-BEV-TRACE-LABEL"],
    demandProjections: [
      {
        readableId: "FG-FOOD-SNACK-12",
        quantities: [2, 2, 2, 3]
      }
    ]
  }
};
