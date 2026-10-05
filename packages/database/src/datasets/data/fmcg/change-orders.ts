// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import type { ChangeOrderData } from "../../types.ts";

export const fmcgChangeOrders: ChangeOrderData = {
  changeOrders: [
    {
      ref: "co:draft",
      name: "PKG-BEV-LABELSET — nhãn truy xuất relocation",
      type: "Engineering",
      status: "Draft",
      openDateOffset: -346,
      affectedItems: [
        {
          item: "PKG-BEV-LABELSET",
          changeType: "Version",
          sortOrder: 1
        }
      ]
    },
    {
      ref: "co:impl",
      name: "WIP-BEV-SYRUP revision — Class H chỉ tiêu an toàn thực phẩm system upgrade",
      type: "Engineering",
      status: "Implementation",
      openDateOffset: -307,
      affectedItems: [
        {
          item: "WIP-BEV-SYRUP",
          changeType: "Revision",
          sortOrder: 1,
          supersessionMode: "Consume First",
          discontinuationOffset: 48,
          successorEffectivityOffset: 49,
          revision: {
            revision: "A",
            unitSalePrice: 25250,
            description:
              "Rev A — dung dịchs are trickle-dung dịch thực phẩmed in Class H resin before insertion, replacing the loose chiết xuất trà slot liner",
            bomEdits: [
              {
                op: "delete",
                component: "RM-TEA-EXTRACT"
              },
              {
                op: "setQuantity",
                component: "RM-WATER",
                quantity: 7
              },
              {
                op: "add",
                component: "RM-ACID-CITRIC",
                quantity: 0.25,
                order: 3
              }
            ],
            operationEdits: [
              {
                order: 1,
                description:
                  "Wind, form and trickle-dung dịch thực phẩm the dung dịch set",
                laborTime: 3
              }
            ]
          }
        }
      ]
    },
    {
      ref: "co:done",
      name: "Introduce the quy cách 12 gói trà under change control",
      type: "Engineering",
      status: "Done",
      openDateOffset: -377,
      affectedItems: [
        {
          item: "WIP-FOOD-SNACK",
          changeType: "New Part",
          sortOrder: 1
        }
      ]
    },
    {
      ref: "co:start",
      name: "Add strain-relief boss at the PKG-BEV-CASE tem truy xuất cable exit",
      type: "Engineering",
      changeOrderType: "Design Improvement",
      status: "Start",
      priority: "Medium",
      openDateOffset: -9,
      dueDateOffset: 30,
      reasonForChange:
        "Kiểm nghiệm vibration runs showed the tem truy xuất cable flexing at the end-bell exit; two line-driver conductors fatigued inside the jacket.",
      affectedItems: [],
      actionTasks: [
        {
          action: "Engineering Review",
          status: "In Progress",
          dueDateOffset: 5
        },
        {
          action: "Update Drawings / CAD",
          status: "Pending",
          dueDateOffset: 20
        }
      ]
    },
    {
      ref: "co:eng-complete",
      name: "Add slot-liner thickness check to the chiết xuất trà receiving plan",
      type: "Manufacturing",
      changeOrderType: "Quality / Reliability Improvement",
      status: "Engineering Complete",
      priority: "High",
      openDateOffset: -60,
      dueDateOffset: 14,
      reasonForChange:
        "The Nước Việt chiết xuất trà escape showed a label and cert review alone cannot catch under-thickness slot liner before it reaches the chiết rót line.",
      nonConformance: "ncr:nomex-thin",
      affectedItems: [],
      actionTasks: [
        {
          action: "Quality Review",
          status: "Completed",
          dueDateOffset: -45,
          completedOffset: -48
        },
        {
          action: "Notify Affected Parties",
          status: "In Progress",
          dueDateOffset: 7
        }
      ]
    },
    {
      ref: "co:cancelled",
      name: "Revise the FMCG-FOOD-12 nameplate drawing for a dual-voltage rating",
      type: "Documentation",
      changeOrderType: "Documentation Error / Correction",
      status: "Cancelled",
      priority: "Low",
      openDateOffset: -120,
      reasonForChange:
        "Sales asked for a 230/460 V dual rating on the FMCG-FOOD-12; the customer later standardized on 460 V only and the single-voltage plate stays.",
      affectedItems: [],
      actionTasks: [
        {
          action: "Cost Impact Review",
          status: "Completed",
          dueDateOffset: -110,
          completedOffset: -112
        },
        {
          action: "Update Drawings / CAD",
          status: "Skipped"
        }
      ]
    }
  ]
};
