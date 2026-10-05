// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import type { ProductionData } from "../../types.ts";

export const fmcgProduction: ProductionData = {
  jobs: [
    {
      key: "in-progress",
      item: "FG-BEV-TEA-500",
      status: "In Progress",
      quantity: 6,
      quantityComplete: 2,
      salesOrder: "so:ridgeline",
      salesOrderLine: "soline:ridgeline:mtr",
      customer: "Siêu thị An Việt Demo",
      deadlineType: "Hard Deadline",
      dueDateOffset: 6,
      releasedDateOffset: -297,
      priority: 3,
      assignee: "self",
      operationOverrides: [
        {
          order: 1,
          status: "Done"
        },
        {
          order: 2,
          status: "In Progress",
          assignee: "self"
        },
        {
          order: 3,
          status: "Waiting"
        }
      ],
      quantities: [
        {
          order: 1,
          type: "Production",
          quantity: 1
        },
        {
          order: 1,
          type: "Scrap",
          quantity: 2,
          scrapReason: "Defective"
        },
        {
          order: 2,
          type: "Rework",
          quantity: 1
        }
      ],
      operationNotes: [
        {
          order: 1,
          note: "Đã kiểm tra định lượng, vệ sinh dây chuyền và đối chiếu số lô; ghi nhận kết quả theo hướng dẫn của công đoạn."
        },
        {
          order: 2,
          note: "Đã kiểm tra định lượng, vệ sinh dây chuyền và đối chiếu số lô; ghi nhận kết quả theo hướng dẫn của công đoạn."
        }
      ]
    },
    {
      key: "ready",
      item: "FG-FOOD-SNACK-12",
      status: "Ready",
      quantity: 4,
      salesOrder: "so:halcyon",
      salesOrderLine: "soline:halcyon:mtr",
      customer: "Siêu thị Miền Bắc Demo",
      deadlineType: "ASAP",
      dueDateOffset: 14,
      releasedDateOffset: -4,
      priority: 10
    },
    {
      key: "planned",
      item: "WIP-BEV-TEA",
      status: "Planned",
      quantity: 4,
      salesOrder: "so:planned",
      salesOrderLine: "soline:planned",
      customer: "Nhà phân phối Miền Nam Demo",
      deadlineType: "Soft Deadline",
      dueDateOffset: 18,
      priority: 12
    },
    {
      key: "draft",
      item: "PKG-BEV-CASE",
      status: "Draft",
      quantity: 2,
      salesOrder: "so:draft",
      salesOrderLine: "soline:draft",
      customer: "Đại lý Miền Trung Demo",
      deadlineType: "No Deadline"
    },
    {
      key: "paused",
      item: "WIP-BEV-FLAVOR",
      status: "Paused",
      quantity: 3,
      salesOrder: "so:paused",
      salesOrderLine: "soline:paused",
      customer: "Siêu thị An Việt Demo",
      dueDateOffset: 9,
      releasedDateOffset: -266,
      priority: 6
    },
    {
      key: "completed",
      item: "PKG-BEV-LABELSET",
      status: "Completed",
      quantity: 8,
      quantityComplete: 8,
      salesOrder: "so:completed",
      salesOrderLine: "soline:completed",
      customer: "Siêu thị Miền Bắc Demo",
      dueDateOffset: -328,
      releasedDateOffset: -434,
      completedDateOffset: -332
    },
    {
      key: "closed",
      item: "WIP-BEV-SYRUP",
      status: "Closed",
      quantity: 12,
      quantityComplete: 12,
      salesOrder: "so:closed",
      salesOrderLine: "soline:closed",
      customer: "Nhà phân phối Miền Nam Demo",
      dueDateOffset: -363,
      releasedDateOffset: -454,
      completedDateOffset: -367
    },
    {
      key: "cancelled",
      item: "WIP-FOOD-DOUGH",
      status: "Cancelled",
      quantity: 6,
      salesOrder: "so:cancelled",
      salesOrderLine: "soline:cancelled",
      customer: "Đại lý Miền Trung Demo",
      dueDateOffset: -314,
      releasedDateOffset: -337
    },
    {
      key: "floor-trà",
      item: "WIP-FOOD-SNACK",
      status: "In Progress",
      quantity: 4,
      salesOrder: "so:floor-ridgeline",
      salesOrderLine: "soline:floor-ridgeline:trà",
      customer: "Siêu thị An Việt Demo",
      dueDateOffset: 2,
      releasedDateOffset: -6,
      priority: 2,
      assignee: "self",
      operationOverrides: [
        {
          order: 1,
          status: "Done"
        },
        {
          order: 2,
          status: "Done"
        },
        {
          order: 3,
          status: "In Progress",
          assignee: "self",
          running: {
            type: "Machine",
            startTimeOfDay: "07:30:00"
          }
        },
        {
          order: 4,
          status: "Waiting"
        }
      ]
    },
    {
      key: "floor-lam-hương liệu",
      item: "WIP-BEV-AROMA",
      status: "Ready",
      quantity: 12,
      salesOrder: "so:floor-halcyon",
      salesOrderLine: "soline:floor-halcyon:lam-hương liệu",
      customer: "Siêu thị Miền Bắc Demo",
      dueDateOffset: 5,
      releasedDateOffset: -2,
      priority: 4,
      operationOverrides: [
        {
          order: 1,
          assignee: "self"
        }
      ]
    },
    {
      key: "floor-bột bánh",
      item: "WIP-FOOD-DOUGH",
      status: "In Progress",
      quantity: 8,
      salesOrder: "so:floor-ridgeline",
      salesOrderLine: "soline:floor-ridgeline:bột bánh",
      customer: "Siêu thị An Việt Demo",
      deadlineType: "Soft Deadline",
      dueDateOffset: 12,
      releasedDateOffset: -9,
      priority: 8,
      assignee: "self",
      operationOverrides: [
        {
          order: 1,
          status: "In Progress",
          assignee: "self",
          running: {
            type: "Setup",
            startTimeOfDay: "06:45:00"
          }
        },
        {
          order: 2,
          status: "Waiting"
        }
      ]
    },
    {
      key: "floor-dung dịch",
      item: "WIP-BEV-SYRUP",
      status: "In Progress",
      quantity: 6,
      salesOrder: "so:floor-halcyon",
      salesOrderLine: "soline:floor-halcyon:dung dịch",
      customer: "Siêu thị Miền Bắc Demo",
      dueDateOffset: 7,
      releasedDateOffset: -5,
      priority: 5,
      operationOverrides: [
        {
          order: 1,
          status: "In Progress",
          running: {
            type: "Labor",
            startTimeOfDay: "08:15:00"
          }
        },
        {
          order: 2,
          status: "Waiting"
        }
      ]
    },
    {
      key: "floor-termbox",
      item: "PKG-BEV-LABELSET",
      status: "In Progress",
      quantity: 10,
      salesOrder: "so:floor-ridgeline",
      salesOrderLine: "soline:floor-ridgeline:termbox",
      customer: "Siêu thị An Việt Demo",
      deadlineType: "ASAP",
      dueDateOffset: 0,
      releasedDateOffset: -1,
      priority: 1,
      operationOverrides: [
        {
          order: 1,
          assignee: "self"
        }
      ]
    },
    {
      key: "floor-housing",
      item: "PKG-BEV-CASE",
      status: "Ready",
      quantity: 4,
      salesOrder: "so:floor-halcyon",
      salesOrderLine: "soline:floor-halcyon:housing",
      customer: "Siêu thị Miền Bắc Demo",
      dueDateOffset: 21,
      releasedDateOffset: -3,
      priority: 13
    },
    {
      key: "floor-hương liệu",
      item: "WIP-BEV-FLAVOR",
      status: "Ready",
      quantity: 2,
      salesOrder: "so:floor-halcyon",
      salesOrderLine: "soline:floor-halcyon:hương liệu",
      customer: "Siêu thị Miền Bắc Demo",
      deadlineType: "Soft Deadline",
      dueDateOffset: 16,
      releasedDateOffset: -4,
      priority: 11,
      operationOverrides: [
        {
          order: 1,
          assignee: "self"
        }
      ]
    },
    {
      key: "floor-lam-trà",
      item: "WIP-BEV-EXTRACT",
      status: "Ready",
      quantity: 6,
      salesOrder: "so:floor-halcyon",
      salesOrderLine: "soline:floor-halcyon:lam-trà",
      customer: "Siêu thị Miền Bắc Demo",
      deadlineType: "No Deadline",
      releasedDateOffset: -1,
      priority: 14
    },
    {
      key: "stock-lam-trà",
      item: "WIP-BEV-EXTRACT",
      status: "Ready",
      quantity: 16,
      dueDateOffset: 11,
      releasedDateOffset: -2,
      priority: 9
    },
    {
      key: "stock-termbox",
      item: "PKG-BEV-LABELSET",
      status: "In Progress",
      quantity: 20,
      deadlineType: "Soft Deadline",
      dueDateOffset: 9,
      releasedDateOffset: -3,
      priority: 7,
      operationOverrides: [
        {
          order: 1,
          assignee: "self"
        }
      ]
    },
    {
      key: "done-dung dịch",
      item: "WIP-BEV-SYRUP",
      status: "Completed",
      quantity: 4,
      quantityComplete: 4,
      salesOrder: "so:floor-ridgeline",
      salesOrderLine: "soline:floor-ridgeline:dung dịch",
      customer: "Siêu thị An Việt Demo",
      dueDateOffset: -8,
      releasedDateOffset: -16,
      completedDateOffset: -11,
      loggedTime: {
        startOffset: -14,
        efficiency: 0.92
      }
    },
    {
      key: "done-lam-hương liệu",
      item: "WIP-BEV-AROMA",
      status: "Completed",
      quantity: 10,
      quantityComplete: 10,
      salesOrder: "so:floor-ridgeline",
      salesOrderLine: "soline:floor-ridgeline:lam-hương liệu",
      customer: "Siêu thị An Việt Demo",
      dueDateOffset: -20,
      releasedDateOffset: -28,
      completedDateOffset: -24,
      loggedTime: {
        startOffset: -27,
        efficiency: 1.18
      }
    },
    {
      key: "done-hương liệu",
      item: "WIP-BEV-FLAVOR",
      status: "Completed",
      quantity: 1,
      quantityComplete: 1,
      salesOrder: "so:floor-ridgeline",
      salesOrderLine: "soline:floor-ridgeline:hương liệu",
      customer: "Siêu thị An Việt Demo",
      dueDateOffset: -2,
      releasedDateOffset: -12,
      completedDateOffset: -4,
      loggedTime: {
        startOffset: -9,
        efficiency: 1.07
      }
    },
    {
      key: "stock-mtr",
      item: "FG-BEV-TEA-500",
      status: "Ready",
      quantity: 1,
      deadlineType: "Soft Deadline",
      dueDateOffset: 19,
      releasedDateOffset: -2,
      priority: 15
    },
    {
      key: "care-ready",
      item: "FG-CARE-SHAMPOO-500",
      status: "Ready",
      quantity: 500,
      priority: 1001,
      deadlineType: "Hard Deadline",
      dueDateOffset: 7,
      releasedDateOffset: -1
    },
    {
      key: "care-wip",
      item: "WIP-CARE-SHAMPOO",
      status: "Ready",
      quantity: 6000,
      priority: 1002,
      deadlineType: "Hard Deadline",
      dueDateOffset: 3,
      releasedDateOffset: -1
    }
  ],
  shifts: [
    [
      {
        type: "Setup",
        startOffset: -9,
        startTimeOfDay: "12:30:00",
        endOffset: -9,
        endTimeOfDay: "13:15:00"
      },
      {
        type: "Labor",
        startOffset: -9,
        startTimeOfDay: "13:15:00",
        endOffset: -9,
        endTimeOfDay: "17:15:00"
      },
      {
        type: "Machine",
        startOffset: -9,
        startTimeOfDay: "13:15:00",
        endOffset: -9,
        endTimeOfDay: "17:15:00"
      }
    ],
    [
      {
        type: "Setup",
        startOffset: -8,
        startTimeOfDay: "12:30:00",
        endOffset: -8,
        endTimeOfDay: "12:50:00"
      },
      {
        type: "Labor",
        startOffset: -8,
        startTimeOfDay: "12:50:00",
        endOffset: -8,
        endTimeOfDay: "15:50:00"
      },
      {
        type: "Machine",
        startOffset: -8,
        startTimeOfDay: "12:50:00",
        endOffset: -8,
        endTimeOfDay: "15:50:00"
      }
    ]
  ],
  genealogyInputs: [
    {
      item: "RM-SUGAR",
      readableId: "LOT-M19-2604",
      quantity: 18
    },
    {
      item: "RM-SUGAR",
      readableId: "LOT-M19-2605",
      quantity: 11
    },
    {
      item: "RM-WATER",
      readableId: "LOT-CU18-2606",
      quantity: 7
    },
    {
      item: "RM-TEA-GREEN",
      readableId: "LOT-MAG45-2605",
      quantity: 24
    },
    {
      item: "PKG-BEV-TRACE-LABEL",
      readableId: "ENC2048-SN-0021",
      quantity: 1
    }
  ],
  genealogyAssembly: {
    item: "FG-BEV-TEA-500",
    ref: "trackedEntity:mtr-0001",
    serial: {
      readableId: "MTR9000-SN-0001",
      quantity: 1,
      status: "Available",
      sourceDocument: "Job",
      sourceDocumentReadableId: "FG-BEV-TEA-500"
    },
    produce: {
      type: "Produce",
      sourceDocument: "Job Operation",
      sourceDocumentReadableId: "FG-BEV-TEA-500",
      quantity: 1
    },
    consume: {
      type: "Consume",
      sourceDocument: "Job Material",
      entityStatus: "Consumed",
      entitySourceDocument: "Item",
      parentQuantity: 1
    }
  },
  eventsJobKey: "in-progress",
  genealogyJobKey: "in-progress",
  openEvent: {
    operationOrder: 2
  },
  batch: {
    members: [
      {
        job: "floor-termbox",
        order: 1
      },
      {
        job: "stock-termbox",
        order: 1
      }
    ],
    running: {
      type: "Machine",
      startTimeOfDay: "07:00:00"
    }
  },
  rework: {
    quantity: 1,
    reason:
      "Loaded kiểm nghiệm run flagged bao bì noise on unit 3 — return it to the assembly bench for a drive-end bao bì re-fit.",
    targetOperationOrder: 1,
    triggeredAtOperationOrder: 2
  },
  pickingLists: [
    {
      key: "mtr-kit-1",
      status: "Completed",
      job: "in-progress",
      dateOffset: -20,
      lines: [
        {
          item: "PKG-FOOD-CARTON",
          quantityRequired: 36,
          quantityPicked: 36,
          status: "Picked",
          fromShelf: "A1-L1"
        },
        {
          item: "PKG-BEV-PALLET",
          quantityRequired: 24,
          quantityPicked: 24,
          status: "Picked",
          fromShelf: "A1-L1"
        }
      ]
    },
    {
      key: "mtr-kit-2",
      status: "In Progress",
      job: "in-progress",
      dateOffset: -2,
      lines: [
        {
          item: "PKG-BEV-PET-500",
          quantityRequired: 2,
          quantityPicked: 0,
          status: "Pending",
          fromShelf: "A2-L1"
        },
        {
          item: "CN-FOOD-LUBRICANT",
          quantityRequired: 1,
          quantityPicked: 0,
          status: "Short",
          fromShelf: "A2-L2"
        }
      ]
    }
  ]
};
