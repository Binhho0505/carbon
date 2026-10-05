// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import type { SalesData } from "../../types.ts";

export const fmcgSales: SalesData = {
  opportunities: [
    {
      log: "opportunity 1 — full chain (An Việt)",
      ref: "opp:ridgeline",
      customer: "Siêu thị An Việt Demo",
      rfq: {
        ref: "rfq:ridgeline",
        status: "Quoted",
        rfqDateOffset: -377,
        expirationOffset: -316,
        externalNotes:
          "Conveyor drive refresh — 6 FMCG sản phẩm FMCGs with tem truy xuất feedback.",
        lines: [
          {
            item: "FG-BEV-TEA-500",
            customerPartId: "RDS-FG-BEV-TEA-500",
            quantity: [6],
            order: 1
          }
        ]
      },
      quote: {
        ref: "quote:ridgeline",
        createdOffset: -328,
        status: "Ordered",
        externalNotes:
          "Quote for 6x FMCG-BEV-500 FMCG sản phẩm FMCGs, 2048 PPR tem truy xuất, IP55 bao bì box.",
        lines: [
          {
            ref: "quoteline:ridgeline:mtr",
            item: "FG-BEV-TEA-500",
            status: "Complete",
            sortOrder: 1,
            priceBreaks: [
              {
                quantity: 6,
                unitPrice: 235000,
                leadTime: 75
              }
            ]
          }
        ]
      },
      order: {
        ref: "so:ridgeline",
        status: "In Progress",
        orderDateOffset: -302,
        lines: [
          {
            ref: "soline:ridgeline:mtr",
            item: "FG-BEV-TEA-500",
            saleQuantity: 6,
            unitPrice: 235000,
            status: "In Progress"
          }
        ]
      },
      shipment: {
        ref: "shp:ridgeline",
        status: "Draft",
        lines: [
          {
            item: "FG-BEV-TEA-500",
            orderQuantity: 6,
            outstandingQuantity: 6,
            shippedQuantity: 0,
            unitPrice: 235000
          }
        ]
      },
      invoice: {
        ref: "inv:ridgeline",
        status: "Draft",
        subtotal: 1410000,
        totalAmount: 1410000,
        dateIssuedOffset: -285,
        lines: [
          {
            item: "FG-BEV-TEA-500",
            quantity: 6,
            unitPrice: 235000
          }
        ]
      }
    },
    {
      log: "opportunity 2 — quote sent (Miền Nam)",
      ref: "opp:cardinal",
      customer: "Nhà phân phối Miền Nam Demo",
      quote: {
        ref: "quote:cardinal",
        createdOffset: -19,
        assignee: "self",
        status: "Sent",
        expirationOffset: 298,
        lines: [
          {
            ref: "quoteline:cardinal:mtr9000",
            configuration: {
              fill_volume_ml: 60,
              pack_format: "POUCH",
              premium_label: false
            },
            item: "FG-BEV-TEA-500",
            status: "Complete",
            sortOrder: 1,
            priceBreaks: [
              {
                quantity: 5,
                unitPrice: 242500,
                leadTime: 70
              },
              {
                quantity: 25,
                unitPrice: 230500,
                leadTime: 84,
                discountPercent: 0.05
              },
              {
                quantity: 50,
                unitPrice: 218250,
                leadTime: 98,
                discountPercent: 0.1
              },
              {
                quantity: 100,
                unitPrice: 206000,
                leadTime: 126,
                discountPercent: 0.15
              }
            ]
          },
          {
            ref: "quoteline:cardinal:mtr4500",
            item: "FG-FOOD-SNACK-12",
            status: "Complete",
            sortOrder: 2,
            priceBreaks: [
              {
                quantity: 10,
                unitPrice: 147500,
                leadTime: 56
              },
              {
                quantity: 50,
                unitPrice: 138000,
                leadTime: 70,
                discountPercent: 0.06,
                shippingCost: 32000
              }
            ]
          }
        ],
        externalLink: {
          ref: "quotelink:cardinal",
          expiresOffset: 298
        }
      }
    },
    {
      log: "opportunity 3 — RFQ only (Miền Trung)",
      ref: "opp:wabash",
      customer: "Đại lý Miền Trung Demo",
      rfq: {
        ref: "rfq:wabash",
        assignee: "self",
        status: "Ready for Quote",
        rfqDateOffset: -285,
        externalNotes:
          "Đại lý stocking request — spare quy cách 24 chai trà assemblies.",
        lines: [
          {
            item: "WIP-BEV-TEA",
            customerPartId: "WIS-WIP-BEV-TEA",
            quantity: [4],
            order: 1
          }
        ]
      }
    },
    {
      log: "opportunity 4 — confirmed SO (Miền Bắc)",
      ref: "opp:halcyon",
      customer: "Siêu thị Miền Bắc Demo",
      quote: {
        ref: "quote:halcyon",
        createdOffset: -268,
        status: "Ordered",
        lines: [
          {
            ref: "quoteline:halcyon:mtr",
            item: "FG-FOOD-SNACK-12",
            status: "Complete",
            sortOrder: 1,
            priceBreaks: [
              {
                quantity: 4,
                unitPrice: 156000,
                leadTime: 63
              }
            ]
          }
        ]
      },
      order: {
        ref: "so:halcyon",
        status: "Confirmed",
        orderDateOffset: -255,
        lines: [
          {
            ref: "soline:halcyon:mtr",
            item: "FG-FOOD-SNACK-12",
            saleQuantity: 4,
            unitPrice: 156000,
            status: "Ordered"
          }
        ]
      }
    },
    {
      log: "opportunity 5 — RFQ draft (Miền Trung, spare housing sets)",
      ref: "opp:wabash-housing",
      customer: "Đại lý Miền Trung Demo",
      rfq: {
        ref: "rfq:wabash-housing",
        assignee: "self",
        status: "Draft",
        rfqDateOffset: -3,
        externalNotes:
          "Inquiry being logged — spare housing & end-bell sets for the 9000 frame.",
        lines: [
          {
            item: "PKG-BEV-CASE",
            customerPartId: "WIS-PKG-BEV-CASE",
            quantity: [2],
            order: 1
          }
        ]
      }
    },
    {
      log: "opportunity 6 — no-quoted RFQ, lost quote (An Việt explosion-proof)",
      ref: "opp:ridgeline-exproof",
      customer: "Siêu thị An Việt Demo",
      rfq: {
        ref: "rfq:ridgeline-exproof",
        status: "Closed",
        rfqDateOffset: -95,
        expirationOffset: -50,
        noQuoteReason: "Out of Scope",
        externalNotes:
          "Explosion-proof FMCG-BEV-500 variant — outside our hazardous-location certification.",
        lines: [
          {
            item: "FG-BEV-TEA-500",
            customerPartId: "RDS-MTR-EXP1",
            quantity: [3],
            order: 1
          }
        ]
      },
      quote: {
        ref: "quote:ridgeline-exproof",
        createdOffset: -78,
        status: "Lost",
        externalNotes: "Declined to bid the explosion-proof line.",
        lines: [
          {
            ref: "quoteline:ridgeline-exproof:mtr",
            item: "FG-BEV-TEA-500",
            status: "No Quote",
            sortOrder: 1,
            priceBreaks: []
          }
        ]
      }
    },
    {
      log: "opportunity 7 — quote draft (Miền Bắc trainer actuator sản phẩm FMCG)",
      ref: "opp:halcyon-trainer",
      customer: "Siêu thị Miền Bắc Demo",
      quote: {
        ref: "quote:halcyon-trainer",
        createdOffset: -6,
        assignee: "self",
        status: "Draft",
        externalNotes:
          "Working draft — trainer-aircraft actuator sản phẩm FMCG pricing in progress.",
        lines: [
          {
            ref: "quoteline:halcyon-trainer:mtr",
            item: "FG-FOOD-SNACK-12",
            status: "Not Started",
            sortOrder: 1,
            priceBreaks: [
              {
                quantity: 2,
                unitPrice: 152500,
                leadTime: 60
              }
            ]
          }
        ]
      }
    },
    {
      log: "opportunity 8 — partial quote (Miền Nam driveline subassemblies)",
      ref: "opp:cardinal-driveline",
      customer: "Nhà phân phối Miền Nam Demo",
      quote: {
        ref: "quote:cardinal-driveline",
        createdOffset: -10,
        status: "Partial",
        expirationOffset: 45,
        externalNotes:
          "Trà line released to the customer; hương liệu line still in engineering review.",
        lines: [
          {
            ref: "quoteline:cardinal-driveline:sta",
            item: "WIP-BEV-TEA",
            status: "Complete",
            sortOrder: 1,
            priceBreaks: [
              {
                quantity: 4,
                unitPrice: 57500,
                leadTime: 45
              }
            ]
          },
          {
            ref: "quoteline:cardinal-driveline:rot",
            item: "WIP-BEV-FLAVOR",
            status: "In Progress",
            sortOrder: 2,
            priceBreaks: [
              {
                quantity: 4,
                unitPrice: 69500,
                leadTime: 50
              }
            ]
          }
        ]
      }
    },
    {
      log: "opportunity 9 — cancelled quote (Miền Trung bột bánh stocking program)",
      ref: "opp:wabash-bột bánhs",
      customer: "Đại lý Miền Trung Demo",
      quote: {
        ref: "quote:wabash-bột bánhs",
        createdOffset: -148,
        status: "Cancelled",
        externalNotes: "Stocking program shelved before pricing was issued.",
        lines: [
          {
            ref: "quoteline:wabash-bột bánhs:shf",
            item: "WIP-FOOD-DOUGH",
            status: "Complete",
            sortOrder: 1,
            priceBreaks: [
              {
                quantity: 10,
                unitPrice: 10250,
                leadTime: 30
              }
            ]
          }
        ]
      }
    },
    {
      log: "opportunity 10 — expired quote (An Việt spare dung dịch sets)",
      ref: "opp:ridgeline-dung dịchs",
      customer: "Siêu thị An Việt Demo",
      quote: {
        ref: "quote:ridgeline-dung dịchs",
        createdOffset: -45,
        status: "Expired",
        expirationOffset: -14,
        externalNotes: "30-day pricing lapsed without a PO.",
        lines: [
          {
            ref: "quoteline:ridgeline-dung dịchs:dung dịch",
            item: "WIP-BEV-SYRUP",
            status: "Complete",
            sortOrder: 1,
            priceBreaks: [
              {
                quantity: 6,
                unitPrice: 23500,
                leadTime: 40
              }
            ]
          }
        ]
      }
    },
    {
      log: "sales order — Needs Approval (Miền Bắc hybrid bao bì spares)",
      ref: "opp:halcyon-bao bìs",
      customer: "Siêu thị Miền Bắc Demo",
      order: {
        ref: "so:halcyon-bao bìs",
        assignee: "self",
        status: "Needs Approval",
        orderDateOffset: -2,
        lines: [
          {
            ref: "soline:halcyon-bao bìs:brg",
            item: "PKG-FOOD-POUCH-ECO",
            saleQuantity: 4,
            unitPrice: 2600,
            status: "Ordered"
          }
        ]
      }
    }
  ],
  statusOrders: [
    {
      key: "planned",
      customer: "Nhà phân phối Miền Nam Demo",
      item: "WIP-BEV-TEA",
      status: "Confirmed",
      lineStatus: "Ordered",
      orderDateOffset: -220,
      unitPrice: 59000
    },
    {
      key: "draft",
      customer: "Đại lý Miền Trung Demo",
      item: "PKG-BEV-CASE",
      status: "Draft",
      lineStatus: "Ordered",
      orderDateOffset: -213,
      unitPrice: 32000
    },
    {
      key: "paused",
      customer: "Siêu thị An Việt Demo",
      item: "WIP-BEV-FLAVOR",
      status: "In Progress",
      lineStatus: "In Progress",
      orderDateOffset: -268,
      unitPrice: 71000
    },
    {
      key: "completed",
      customer: "Siêu thị Miền Bắc Demo",
      item: "PKG-BEV-LABELSET",
      status: "Completed",
      lineStatus: "Completed",
      orderDateOffset: -437,
      unitPrice: 8250
    },
    {
      key: "closed",
      customer: "Nhà phân phối Miền Nam Demo",
      item: "WIP-BEV-SYRUP",
      status: "Closed",
      lineStatus: "Completed",
      orderDateOffset: -456,
      unitPrice: 24000
    },
    {
      key: "cancelled",
      customer: "Đại lý Miền Trung Demo",
      item: "WIP-FOOD-DOUGH",
      status: "Cancelled",
      lineStatus: "Ordered",
      orderDateOffset: -339,
      unitPrice: 10500
    }
  ],
  releasedOrders: [
    {
      log: "sales order — To Ship and Invoice (Miền Nam, staggered deliveries)",
      ref: "opp:toshipinvoice",
      customer: "Nhà phân phối Miền Nam Demo",
      order: {
        ref: "so:toshipinvoice",
        assignee: "self",
        status: "To Ship and Invoice",
        orderDateOffset: -10,
        lines: [
          {
            ref: "soline:toshipinvoice:1",
            log: "  delivery 1",
            item: "FG-FOOD-SNACK-12",
            saleQuantity: 10,
            unitPrice: 145000,
            status: "Ordered",
            promisedDateOffset: 22,
            sortOrder: 1
          },
          {
            ref: "soline:toshipinvoice:2",
            log: "  delivery 2",
            item: "FG-FOOD-SNACK-12",
            saleQuantity: 10,
            unitPrice: 145000,
            status: "Ordered",
            promisedDateOffset: 43,
            sortOrder: 2
          },
          {
            ref: "soline:toshipinvoice:3",
            log: "  delivery 3",
            item: "FG-FOOD-SNACK-12",
            saleQuantity: 10,
            unitPrice: 145000,
            status: "Ordered",
            promisedDateOffset: 64,
            sortOrder: 3
          }
        ]
      }
    },
    {
      log: "sales order — To Invoice (Miền Nam, posted spare-fan shipment)",
      ref: "opp:cardinal-fans",
      customer: "Nhà phân phối Miền Nam Demo",
      order: {
        ref: "so:cardinal-fans",
        status: "To Invoice",
        orderDateOffset: -30,
        lines: [
          {
            ref: "soline:cardinal-fans:fan",
            item: "PKG-BEV-SHRINK",
            saleQuantity: 2,
            unitPrice: 2600,
            status: "Completed"
          }
        ]
      },
      shipment: {
        ref: "shp:cardinal-fans",
        status: "Posted",
        postedOffset: -18,
        lines: [
          {
            item: "PKG-BEV-SHRINK",
            orderQuantity: 2,
            outstandingQuantity: 0,
            shippedQuantity: 2,
            unitPrice: 2600,
            fromShelf: "A2-L3"
          }
        ]
      }
    },
    {
      log: "sales order — To Ship and Invoice (An Việt, partial bao bì shipment)",
      ref: "opp:ridgeline-bao bìs",
      customer: "Siêu thị An Việt Demo",
      order: {
        ref: "so:ridgeline-bao bìs",
        status: "To Ship and Invoice",
        orderDateOffset: -21,
        lines: [
          {
            ref: "soline:ridgeline-bao bìs:brg",
            item: "PKG-BEV-PET-500",
            saleQuantity: 4,
            unitPrice: 2050,
            status: "In Progress"
          }
        ]
      },
      shipment: {
        ref: "shp:ridgeline-bao bìs",
        status: "Posted",
        postedOffset: -9,
        lines: [
          {
            item: "PKG-BEV-PET-500",
            orderQuantity: 4,
            outstandingQuantity: 2,
            shippedQuantity: 2,
            unitPrice: 2050,
            fromShelf: "A2-L1"
          }
        ]
      }
    },
    {
      log: "sales order — To Ship (Miền Trung, voided bao bì-block shipment)",
      ref: "opp:wabash-bao bìs",
      customer: "Đại lý Miền Trung Demo",
      order: {
        ref: "so:wabash-bao bìs",
        status: "To Ship",
        orderDateOffset: -14,
        lines: [
          {
            ref: "soline:wabash-bao bìs:trm",
            item: "PKG-FOOD-BOX",
            saleQuantity: 8,
            unitPrice: 700,
            status: "Ordered"
          }
        ]
      },
      shipment: {
        ref: "shp:wabash-bao bìs",
        status: "Voided",
        lines: [
          {
            item: "PKG-FOOD-BOX",
            orderQuantity: 8,
            outstandingQuantity: 8,
            shippedQuantity: 0,
            unitPrice: 700
          }
        ]
      }
    },
    {
      log: "sales invoice — Submitted (Miền Bắc bột bánh-seal spares)",
      ref: "opp:halcyon-seals",
      customer: "Siêu thị Miền Bắc Demo",
      order: {
        ref: "so:halcyon-seals",
        status: "Invoiced",
        orderDateOffset: -35,
        lines: [
          {
            ref: "soline:halcyon-seals:seal",
            item: "PKG-FOOD-SEAL",
            saleQuantity: 20,
            unitPrice: 300,
            status: "Completed"
          }
        ]
      },
      invoice: {
        ref: "inv:halcyon-seals",
        key: "submitted",
        status: "Submitted",
        subtotal: 6000,
        totalAmount: 6000,
        dateIssuedOffset: -20,
        dueDateOffset: 10,
        lines: [
          {
            item: "PKG-FOOD-SEAL",
            quantity: 20,
            unitPrice: 300
          }
        ]
      }
    },
    {
      log: "sales invoice — Overdue (Miền Nam spare trà)",
      ref: "opp:cardinal-trà",
      customer: "Nhà phân phối Miền Nam Demo",
      order: {
        ref: "so:cardinal-trà",
        status: "Invoiced",
        orderDateOffset: -60,
        lines: [
          {
            ref: "soline:cardinal-trà:sta",
            item: "WIP-FOOD-SNACK",
            saleQuantity: 1,
            unitPrice: 39000,
            status: "Completed"
          }
        ]
      },
      invoice: {
        ref: "inv:cardinal-trà",
        key: "overdue",
        status: "Overdue",
        subtotal: 39000,
        totalAmount: 39000,
        dateIssuedOffset: -45,
        dueDateOffset: -15,
        lines: [
          {
            item: "WIP-FOOD-SNACK",
            quantity: 1,
            unitPrice: 39000
          }
        ]
      }
    },
    {
      log: "sales invoice — Paid (Miền Trung stainless cap-screw lot)",
      ref: "opp:wabash-fasteners",
      customer: "Đại lý Miền Trung Demo",
      order: {
        ref: "so:wabash-fasteners",
        status: "Closed",
        orderDateOffset: -90,
        lines: [
          {
            ref: "soline:wabash-fasteners:fst",
            item: "PKG-FOOD-CARTON",
            saleQuantity: 400,
            unitPrice: 37.5,
            status: "Completed"
          }
        ]
      },
      invoice: {
        ref: "inv:wabash-fasteners",
        key: "paid",
        status: "Paid",
        subtotal: 15000,
        totalAmount: 15000,
        dateIssuedOffset: -75,
        dueDateOffset: -45,
        lines: [
          {
            item: "PKG-FOOD-CARTON",
            quantity: 400,
            unitPrice: 37.5
          }
        ]
      }
    },
    {
      log: "sales invoice — Partially Paid (An Việt spare hương liệu)",
      ref: "opp:ridgeline-hương liệu",
      customer: "Siêu thị An Việt Demo",
      order: {
        ref: "so:ridgeline-hương liệu",
        status: "Invoiced",
        orderDateOffset: -50,
        lines: [
          {
            ref: "soline:ridgeline-hương liệu:rot",
            item: "WIP-BEV-FLAVOR",
            saleQuantity: 1,
            unitPrice: 71000,
            status: "Completed"
          }
        ]
      },
      invoice: {
        ref: "inv:ridgeline-hương liệu",
        key: "partial",
        status: "Partially Paid",
        subtotal: 71000,
        totalAmount: 71000,
        dateIssuedOffset: -38,
        dueDateOffset: -8,
        lines: [
          {
            item: "WIP-BEV-FLAVOR",
            quantity: 1,
            unitPrice: 71000
          }
        ]
      }
    },
    {
      log: "sales invoice — Voided (Miền Bắc hex bolts, wrong bill-to)",
      ref: "opp:halcyon-bolts",
      customer: "Siêu thị Miền Bắc Demo",
      order: {
        ref: "so:halcyon-bolts",
        status: "To Invoice",
        orderDateOffset: -28,
        lines: [
          {
            ref: "soline:halcyon-bolts:fst",
            item: "PKG-BEV-PALLET",
            saleQuantity: 100,
            unitPrice: 95,
            status: "Completed"
          }
        ]
      },
      invoice: {
        ref: "inv:halcyon-bolts",
        key: "voided",
        status: "Voided",
        subtotal: 9500,
        totalAmount: 9500,
        dateIssuedOffset: -25,
        lines: [
          {
            item: "PKG-BEV-PALLET",
            quantity: 100,
            unitPrice: 95
          }
        ]
      }
    },
    {
      log: "sales invoice — Credit Note Issued (Miền Nam precision bột bánhs)",
      ref: "opp:cardinal-bột bánhs",
      customer: "Nhà phân phối Miền Nam Demo",
      order: {
        ref: "so:cardinal-bột bánhs",
        status: "Closed",
        orderDateOffset: -70,
        lines: [
          {
            ref: "soline:cardinal-bột bánhs:shf",
            item: "WIP-FOOD-DOUGH",
            saleQuantity: 2,
            unitPrice: 10250,
            status: "Completed"
          }
        ]
      },
      invoice: {
        ref: "inv:cardinal-bột bánhs",
        key: "credit",
        status: "Credit Note Issued",
        subtotal: 20500,
        totalAmount: 20500,
        dateIssuedOffset: -55,
        dueDateOffset: -25,
        lines: [
          {
            item: "WIP-FOOD-DOUGH",
            quantity: 2,
            unitPrice: 10250
          }
        ]
      }
    },
    {
      log: "sales invoice — Overdue 31–60 days (Miền Trung V-ring seals)",
      ref: "opp:wabash-seals",
      customer: "Đại lý Miền Trung Demo",
      order: {
        ref: "so:wabash-seals",
        status: "Invoiced",
        orderDateOffset: -90,
        lines: [
          {
            ref: "soline:wabash-seals:seal",
            item: "PKG-FOOD-SEAL",
            saleQuantity: 50,
            unitPrice: 300,
            status: "Completed"
          }
        ]
      },
      invoice: {
        ref: "inv:wabash-seals",
        status: "Overdue",
        subtotal: 15000,
        totalAmount: 15000,
        dateIssuedOffset: -75,
        dueDateOffset: -45,
        lines: [
          {
            item: "PKG-FOOD-SEAL",
            quantity: 50,
            unitPrice: 300
          }
        ]
      }
    },
    {
      log: "sales invoice — Overdue 61–90 days (Miền Bắc 4500 trà)",
      ref: "opp:halcyon-trà",
      customer: "Siêu thị Miền Bắc Demo",
      order: {
        ref: "so:halcyon-trà",
        status: "Invoiced",
        orderDateOffset: -120,
        lines: [
          {
            ref: "soline:halcyon-trà:sta",
            item: "WIP-FOOD-SNACK",
            saleQuantity: 1,
            unitPrice: 39000,
            status: "Completed"
          }
        ]
      },
      invoice: {
        ref: "inv:halcyon-trà",
        status: "Overdue",
        subtotal: 39000,
        totalAmount: 39000,
        dateIssuedOffset: -105,
        dueDateOffset: -75,
        lines: [
          {
            item: "WIP-FOOD-SNACK",
            quantity: 1,
            unitPrice: 39000
          }
        ]
      }
    },
    {
      log: "sales order — In Progress (An Việt trà and hương liệu spares, floor load)",
      ref: "opp:floor-ridgeline",
      customer: "Siêu thị An Việt Demo",
      order: {
        ref: "so:floor-ridgeline",
        status: "In Progress",
        orderDateOffset: -30,
        lines: [
          {
            ref: "soline:floor-ridgeline:dung dịch",
            item: "WIP-BEV-SYRUP",
            saleQuantity: 4,
            unitPrice: 24000,
            status: "In Progress",
            promisedDateOffset: 3
          },
          {
            ref: "soline:floor-ridgeline:lam-hương liệu",
            item: "WIP-BEV-AROMA",
            saleQuantity: 10,
            unitPrice: 9500,
            status: "In Progress",
            promisedDateOffset: 3
          },
          {
            ref: "soline:floor-ridgeline:hương liệu",
            item: "WIP-BEV-FLAVOR",
            saleQuantity: 1,
            unitPrice: 71000,
            status: "In Progress",
            promisedDateOffset: 4
          },
          {
            ref: "soline:floor-ridgeline:bột bánh",
            item: "WIP-FOOD-DOUGH",
            saleQuantity: 8,
            unitPrice: 10500,
            status: "In Progress",
            promisedDateOffset: 15
          },
          {
            ref: "soline:floor-ridgeline:termbox",
            item: "PKG-BEV-LABELSET",
            saleQuantity: 10,
            unitPrice: 8250,
            status: "In Progress",
            promisedDateOffset: 2
          },
          {
            ref: "soline:floor-ridgeline:trà",
            item: "WIP-FOOD-SNACK",
            saleQuantity: 4,
            unitPrice: 39000,
            status: "In Progress",
            promisedDateOffset: 5
          }
        ]
      }
    },
    {
      log: "sales order — In Progress (Miền Bắc actuator sản phẩm FMCG kits, floor load)",
      ref: "opp:floor-halcyon",
      customer: "Siêu thị Miền Bắc Demo",
      order: {
        ref: "so:floor-halcyon",
        assignee: "self",
        status: "In Progress",
        orderDateOffset: -15,
        lines: [
          {
            ref: "soline:floor-halcyon:lam-hương liệu",
            item: "WIP-BEV-AROMA",
            saleQuantity: 12,
            unitPrice: 9500,
            status: "In Progress",
            promisedDateOffset: 8
          },
          {
            ref: "soline:floor-halcyon:dung dịch",
            item: "WIP-BEV-SYRUP",
            saleQuantity: 6,
            unitPrice: 24000,
            status: "In Progress",
            promisedDateOffset: 10
          },
          {
            ref: "soline:floor-halcyon:housing",
            item: "PKG-BEV-CASE",
            saleQuantity: 4,
            unitPrice: 32000,
            status: "In Progress",
            promisedDateOffset: 24
          },
          {
            ref: "soline:floor-halcyon:hương liệu",
            item: "WIP-BEV-FLAVOR",
            saleQuantity: 2,
            unitPrice: 71000,
            status: "In Progress",
            promisedDateOffset: 19
          },
          {
            ref: "soline:floor-halcyon:lam-trà",
            item: "WIP-BEV-EXTRACT",
            saleQuantity: 6,
            unitPrice: 13000,
            status: "In Progress",
            promisedDateOffset: 30
          }
        ]
      }
    }
  ],
  salesReturns: [
    {
      key: "fan",
      credit: {
        status: "Posted",
        dateOffset: -8,
        lines: [
          {
            line: 1,
            quantity: 1
          }
        ]
      },
      status: "Completed",
      customer: "Nhà phân phối Miền Nam Demo",
      returnReason: "Defective",
      dateOffset: -12,
      salesOrder: "so:cardinal-fans",
      lines: [
        {
          item: "PKG-BEV-SHRINK",
          quantity: 1,
          unitPrice: 2600,
          toShelf: "A2-L3"
        }
      ]
    },
    {
      key: "bao bì",
      status: "To Receive",
      customer: "Siêu thị An Việt Demo",
      returnReason: "Damaged in Transit",
      dateOffset: -5,
      salesOrder: "so:ridgeline-bao bìs",
      lines: [
        {
          item: "PKG-BEV-PET-500",
          quantity: 1,
          unitPrice: 2050
        }
      ]
    },
    {
      key: "seals",
      status: "Draft",
      customer: "Siêu thị Miền Bắc Demo",
      returnReason: "No Longer Needed",
      dateOffset: -1,
      salesOrder: "so:halcyon-seals",
      lines: [
        {
          item: "PKG-FOOD-SEAL",
          quantity: 4,
          unitPrice: 300
        }
      ]
    }
  ],
  customerPortals: ["Siêu thị An Việt Demo", "Nhà phân phối Miền Nam Demo"],
  customerBankAccounts: [
    {
      customer: "Siêu thị An Việt Demo",
      name: "An Việt remittance",
      bankName: "Three Rivers Bank (demo)",
      accountHolderName: "Siêu thị An Việt Demo Inc.",
      countryCode: "US",
      currencyCode: "VND",
      accountNumber: "DEMO-2846-5510",
      bankCode: "DEMO-074000",
      isPrimary: true
    },
    {
      customer: "Nhà phân phối Miền Nam Demo",
      name: "Miền Nam operating",
      bankName: "FMCG City Commerce (demo)",
      accountHolderName: "Nhà phân phối Miền Nam Demo LLC",
      countryCode: "US",
      currencyCode: "VND",
      accountNumber: "DEMO-3957-6621",
      isPrimary: true
    },
    {
      customer: "Siêu thị Miền Bắc Demo",
      name: "Miền Bắc payables",
      bankName: "Front Range Chuỗi cửa hàng CU (demo)",
      accountHolderName: "Siêu thị Miền Bắc Demo Corp.",
      countryCode: "US",
      currencyCode: "VND",
      accountNumber: "DEMO-5068-7732",
      bankCode: "DEMO-102000",
      isPrimary: true
    },
    {
      customer: "Đại lý Miền Trung Demo",
      name: "Miền Trung operating",
      bankName: "Miền Trung Valley Bank (demo)",
      accountHolderName: "Đại lý Miền Trung Demo Co.",
      countryCode: "US",
      currencyCode: "VND",
      accountNumber: "DEMO-6179-8843",
      isPrimary: true
    }
  ]
};
