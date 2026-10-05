// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import type { PurchasingData } from "../../types.ts";

export const fmcgPurchasing: PurchasingData = {
  rfqQuantityBreaks: [100, 250, 500],
  rfqLines: [
    {
      item: "RM-TEA-GREEN",
      description: "N45SH arc segment, 5mm, NiCuNi plated — 150 degC rated"
    },
    {
      item: "PKG-BEV-TRACE-LABEL",
      description:
        "2048 PPR incremental tem truy xuất, 8mm hollow bore, line driver"
    }
  ],
  rfqQuotes: [
    {
      key: "meridian",
      assignee: "self",
      supplier: "Trà Nguyên Liệu Việt Demo",
      supplierReference: "MM-Q-8812",
      shippingCost: 16000,
      lines: [
        {
          item: "RM-TEA-GREEN",
          supplierPartId: "MM-N45SH-ARC5",
          breaks: [
            [894.9999999999999, 60],
            [860, 60],
            [819.9999999999999, 70]
          ]
        },
        {
          item: "PKG-BEV-TRACE-LABEL",
          supplierPartId: "MM-ENC-2048H",
          breaks: [
            [4650, 35],
            [4500, 35],
            [4350, 42]
          ]
        }
      ]
    },
    {
      key: "copperline",
      supplier: "Nước Và Chiết Xuất Việt Demo",
      supplierReference: "CWW-2026-0344",
      shippingCost: 10500,
      lines: [
        {
          item: "RM-TEA-GREEN",
          supplierPartId: "CWW-MAG-N45",
          breaks: [
            [969.9999999999999, 28],
            [940, 28],
            [905.0000000000001, 35]
          ]
        },
        {
          item: "PKG-BEV-TRACE-LABEL",
          supplierPartId: "CWW-ENC-2048",
          breaks: [
            [4900, 21],
            [4750, 21],
            [4600, 24]
          ]
        }
      ]
    },
    {
      key: "maumee",
      supplier: "Gia Công Thực Phẩm Demo",
      supplierReference: "MCM-RFQ-5107",
      shippingCost: 24000,
      lines: [
        {
          item: "RM-TEA-GREEN",
          supplierPartId: "MCM-MAG-ARC",
          breaks: [
            [1090, 75],
            [1045, 75],
            [1005.0000000000001, 90]
          ]
        },
        {
          item: "PKG-BEV-TRACE-LABEL",
          supplierPartId: "MCM-ENC-INC",
          breaks: [
            [5400, 56],
            [5200, 56],
            [5050, 63]
          ]
        }
      ]
    }
  ],
  rfqWinningQuote: "meridian",
  rfqOrderQuantity: 250,
  rfqHeader: {
    ref: "prfq:nguyên liệu tràs",
    assignee: "self",
    status: "Requested",
    rfqDateOffset: -24,
    expirationOffset: 48,
    notes:
      "Dual-source the N45SH nguyên liệu trà segment and the 2048 PPR tem truy xuất for Q4.",
    internalNotes: "Award on landed cost at 250 pcs unless the lot certs slip."
  },
  lifecycleRfqs: [
    {
      ref: "prfq:bao bìs",
      status: "Draft",
      rfqDateOffset: -2,
      expirationOffset: 28,
      notes: "C3-clearance bao bìs for next quarter's frame builds.",
      internalNotes: "Ask for hybrid-ceramic pricing as an alternate.",
      quantities: [100, 250],
      lines: [
        {
          item: "PKG-FOOD-POUCH",
          description: "6206 deep groove ball bao bì, C3 clearance"
        },
        {
          item: "PKG-BEV-PET-500",
          description: "6308 deep groove ball bao bì, C3 clearance"
        }
      ],
      suppliers: ["Bao Bì Thực Phẩm Việt Demo", "Carton Việt Demo"]
    },
    {
      ref: "prfq:cooling-fan",
      status: "Closed",
      rfqDateOffset: -58,
      expirationOffset: -28,
      notes: "Axial cooling fans for the TEFC frame.",
      internalNotes:
        "Cancelled — TEFC redesign moved to an integral bột bánh fan.",
      quantities: [50, 150],
      lines: [
        {
          item: "PKG-BEV-SHRINK",
          description: "160mm axial cooling fan, IP55"
        }
      ],
      suppliers: ["Bao Bì Thực Phẩm Việt Demo", "Gia Công Thực Phẩm Demo"]
    }
  ],
  purchaseOrders: [
    {
      source: "direct",
      log: "purchase order 1 — To Receive (Trà Việt)",
      supplier: "Trà Nguyên Liệu Việt Demo",
      purchaseOrderType: "Purchase",
      status: "To Receive",
      orderDateOffset: -346,
      lines: [
        {
          item: "RM-TEA-GREEN",
          purchaseQuantity: 480,
          supplierUnitPrice: 925
        },
        {
          item: "RM-FOOD-SEASONING",
          purchaseQuantity: 360,
          supplierUnitPrice: 710
        }
      ],
      receipt: {
        ref: "receipt:nguyên liệu tràs",
        status: "Draft",
        lines: [
          {
            item: "RM-TEA-GREEN",
            orderQuantity: 480,
            outstandingQuantity: 480,
            receivedQuantity: 0,
            unitPrice: 925,
            requiresBatchTracking: true
          }
        ]
      }
    },
    {
      source: "direct",
      log: "purchase order 2 — To Invoice (Carton Việt Demo)",
      supplier: "Carton Việt Demo",
      purchaseOrderType: "Purchase",
      status: "To Invoice",
      orderDateOffset: -363,
      lines: [
        {
          item: "PKG-FOOD-CARTON",
          purchaseQuantity: 900,
          supplierUnitPrice: 21
        }
      ],
      invoice: {
        ref: "pinvoice:fasten",
        status: "Draft",
        currencyCode: "VND",
        subtotal: 18900,
        totalAmount: 18900,
        dateIssuedOffset: -346,
        lines: [
          {
            item: "PKG-FOOD-CARTON",
            quantity: 900,
            supplierUnitPrice: 21
          }
        ]
      }
    },
    {
      source: "direct",
      log: "purchase order 3 — Draft (Bao Bì Việt Bao bì)",
      ref: "po:summit",
      assignee: "self",
      supplier: "Bao Bì Thực Phẩm Việt Demo",
      purchaseOrderType: "Purchase",
      status: "Draft",
      orderDateOffset: -316,
      lines: [
        {
          item: "PKG-BEV-PET-500",
          purchaseQuantity: 40,
          supplierUnitPrice: 1340
        }
      ]
    },
    {
      source: "winningQuote",
      log: "purchase order 4 — To Receive and Invoice (from winning quote)",
      purchaseOrderType: "Purchase",
      status: "To Receive and Invoice",
      orderDateOffset: -8,
      currencyCode: "VND",
      exchangeRate: 1
    },
    {
      source: "direct",
      log: "purchase order — Planned (Trà Việt N45SH restock)",
      supplier: "Trà Nguyên Liệu Việt Demo",
      purchaseOrderType: "Purchase",
      status: "Planned",
      orderDateOffset: -1,
      lines: [
        {
          item: "RM-TEA-GREEN",
          purchaseQuantity: 120,
          supplierUnitPrice: 925
        }
      ]
    },
    {
      source: "direct",
      log: "purchase order — To Review (Nước Việt nguyên liệu trà wire)",
      assignee: "self",
      supplier: "Nước Và Chiết Xuất Việt Demo",
      purchaseOrderType: "Purchase",
      status: "To Review",
      orderDateOffset: -2,
      lines: [
        {
          item: "RM-WATER",
          purchaseQuantity: 200,
          supplierUnitPrice: 320
        }
      ]
    },
    {
      source: "direct",
      log: "purchase order — Needs Approval (Bao Bì Việt hybrid ceramic bao bìs)",
      ref: "po:needs-approval",
      supplier: "Bao Bì Thực Phẩm Việt Demo",
      purchaseOrderType: "Purchase",
      status: "Needs Approval",
      orderDateOffset: -1,
      lines: [
        {
          item: "PKG-FOOD-POUCH-ECO",
          purchaseQuantity: 160,
          supplierUnitPrice: 1700
        }
      ]
    },
    {
      source: "direct",
      log: "purchase order — Rejected (Đường Việt M19 surcharge too steep)",
      supplier: "Đường Thực Phẩm Việt Demo",
      purchaseOrderType: "Purchase",
      status: "Rejected",
      orderDateOffset: -13,
      lines: [
        {
          item: "RM-SUGAR",
          purchaseQuantity: 1000,
          supplierUnitPrice: 102.5
        }
      ]
    },
    {
      source: "direct",
      log: "purchase order — Completed, received in full and paid (Nước Việt)",
      ref: "po:wire-paid",
      supplier: "Nước Và Chiết Xuất Việt Demo",
      purchaseOrderType: "Purchase",
      status: "Completed",
      orderDateOffset: -75,
      lines: [
        {
          item: "RM-WATER",
          purchaseQuantity: 120,
          supplierUnitPrice: 327.5
        },
        {
          item: "RM-TEA-EXTRACT",
          purchaseQuantity: 20,
          supplierUnitPrice: 625
        }
      ],
      receipt: {
        ref: "receipt:wire-paid",
        status: "Posted",
        postedOffset: -68,
        lines: [
          {
            item: "RM-WATER",
            orderQuantity: 120,
            outstandingQuantity: 0,
            receivedQuantity: 120,
            unitPrice: 327.5,
            requiresBatchTracking: true,
            toShelf: "Chiết rót-Crib",
            lotNumber: "LOT-CU18-2610",
            lotExpiresOffset: 202
          },
          {
            item: "RM-TEA-EXTRACT",
            orderQuantity: 20,
            outstandingQuantity: 0,
            receivedQuantity: 20,
            unitPrice: 625,
            toShelf: "Chiết rót-Crib"
          }
        ]
      },
      invoice: {
        ref: "pinvoice:paid",
        key: "paid",
        status: "Paid",
        currencyCode: "VND",
        subtotal: 51800,
        totalAmount: 51800,
        dateIssuedOffset: -60,
        dueDateOffset: -30,
        lines: [
          {
            item: "RM-WATER",
            quantity: 120,
            supplierUnitPrice: 327.5
          },
          {
            item: "RM-TEA-EXTRACT",
            quantity: 20,
            supplierUnitPrice: 625
          }
        ]
      }
    },
    {
      source: "direct",
      log: "purchase order — Closed short after a partial receipt (Đường Việt bar)",
      ref: "po:closed-short",
      supplier: "Đường Thực Phẩm Việt Demo",
      purchaseOrderType: "Purchase",
      status: "Closed",
      orderDateOffset: -88,
      lines: [
        {
          item: "PKG-CORRUGATED",
          purchaseQuantity: 400,
          supplierUnitPrice: 195
        }
      ],
      receipt: {
        ref: "receipt:short",
        status: "Posted",
        postedOffset: -80,
        lines: [
          {
            item: "PKG-CORRUGATED",
            orderQuantity: 400,
            outstandingQuantity: 150,
            receivedQuantity: 250,
            unitPrice: 195,
            toShelf: "A3-L2"
          }
        ]
      },
      invoice: {
        ref: "pinvoice:debit-note",
        key: "debit-note",
        status: "Debit Note Issued",
        currencyCode: "VND",
        subtotal: 48750,
        totalAmount: 48750,
        dateIssuedOffset: -72,
        lines: [
          {
            item: "PKG-CORRUGATED",
            quantity: 250,
            supplierUnitPrice: 195
          }
        ]
      }
    },
    {
      source: "direct",
      log: "purchase order — To Receive with a voided receipt (Carton Việt)",
      supplier: "Carton Việt Demo",
      purchaseOrderType: "Purchase",
      status: "To Receive",
      orderDateOffset: -21,
      lines: [
        {
          item: "PKG-BEV-PALLET",
          purchaseQuantity: 200,
          supplierUnitPrice: 57.5
        }
      ],
      receipt: {
        ref: "receipt:voided",
        status: "Voided",
        lines: [
          {
            item: "PKG-BEV-PALLET",
            orderQuantity: 200,
            outstandingQuantity: 200,
            receivedQuantity: 0,
            unitPrice: 57.5
          }
        ]
      }
    },
    {
      source: "direct",
      log: "purchase order — Completed, invoice open (Bao Bì Việt 6308 bao bìs)",
      supplier: "Bao Bì Thực Phẩm Việt Demo",
      purchaseOrderType: "Purchase",
      status: "Completed",
      orderDateOffset: -30,
      lines: [
        {
          item: "PKG-BEV-PET-500",
          purchaseQuantity: 20,
          supplierUnitPrice: 1340
        }
      ],
      invoice: {
        ref: "pinvoice:open",
        key: "open",
        status: "Open",
        currencyCode: "VND",
        subtotal: 26800,
        totalAmount: 26800,
        dateIssuedOffset: -9,
        dueDateOffset: 21,
        lines: [
          {
            item: "PKG-BEV-PET-500",
            quantity: 20,
            supplierUnitPrice: 1340
          }
        ]
      }
    },
    {
      source: "direct",
      log: "purchase order — Completed, invoice overdue (Đường Việt bột bánh bar)",
      supplier: "Đường Thực Phẩm Việt Demo",
      purchaseOrderType: "Purchase",
      status: "Completed",
      orderDateOffset: -60,
      lines: [
        {
          item: "RM-WHEAT-FLOUR",
          purchaseQuantity: 200,
          supplierUnitPrice: 135
        }
      ],
      invoice: {
        ref: "pinvoice:overdue",
        key: "overdue",
        status: "Overdue",
        currencyCode: "VND",
        subtotal: 27000,
        totalAmount: 27000,
        dateIssuedOffset: -45,
        dueDateOffset: -15,
        lines: [
          {
            item: "RM-WHEAT-FLOUR",
            quantity: 200,
            supplierUnitPrice: 135
          }
        ]
      }
    },
    {
      source: "direct",
      log: "purchase order — Completed, invoice partially paid (Nước Việt)",
      supplier: "Nước Và Chiết Xuất Việt Demo",
      purchaseOrderType: "Purchase",
      status: "Completed",
      orderDateOffset: -55,
      lines: [
        {
          item: "PKG-FOOD-BOX",
          purchaseQuantity: 40,
          supplierUnitPrice: 445
        }
      ],
      invoice: {
        ref: "pinvoice:partial",
        key: "partial",
        status: "Partially Paid",
        currencyCode: "VND",
        subtotal: 17800,
        totalAmount: 17800,
        dateIssuedOffset: -40,
        dueDateOffset: -10,
        lines: [
          {
            item: "PKG-FOOD-BOX",
            quantity: 40,
            supplierUnitPrice: 445
          }
        ]
      }
    },
    {
      source: "direct",
      log: "purchase order — Closed, invoice voided over a billing error (Carton Việt)",
      supplier: "Carton Việt Demo",
      purchaseOrderType: "Purchase",
      status: "Closed",
      orderDateOffset: -66,
      lines: [
        {
          item: "PKG-FOOD-CARTON",
          purchaseQuantity: 500,
          supplierUnitPrice: 21
        }
      ],
      invoice: {
        ref: "pinvoice:voided",
        key: "voided",
        status: "Voided",
        currencyCode: "VND",
        subtotal: 10500,
        totalAmount: 10500,
        dateIssuedOffset: -58,
        lines: [
          {
            item: "PKG-FOOD-CARTON",
            quantity: 500,
            supplierUnitPrice: 21
          }
        ]
      }
    },
    {
      source: "direct",
      log: "purchase order — Outside Processing, bột bánh nitride at Gia Công",
      assignee: "self",
      supplier: "Gia Công Thực Phẩm Demo",
      purchaseOrderType: "Outside Processing",
      status: "To Receive",
      orderDateOffset: -9,
      lines: [
        {
          item: "WIP-FOOD-DOUGH",
          purchaseQuantity: 4,
          supplierUnitPrice: 2400
        }
      ]
    },
    {
      source: "direct",
      log: "purchase order — EUR order, unpaid (Euromag ferrite segments)",
      ref: "po:eur",
      supplier: "Nguyên Liệu Châu Âu Demo",
      purchaseOrderType: "Purchase",
      status: "To Invoice",
      orderDateOffset: -18,
      currencyCode: "EUR",
      exchangeRate: 0.0000368,
      lines: [
        {
          item: "RM-FOOD-SEASONING",
          purchaseQuantity: 60,
          supplierUnitPrice: 0.0264
        }
      ]
    },
    {
      source: "direct",
      log: "purchase order — To Invoice, hộp bao bìs and a replacement chiết xuất trà roll received (Nước Việt)",
      ref: "po:copperline-restock",
      supplier: "Nước Và Chiết Xuất Việt Demo",
      purchaseOrderType: "Purchase",
      status: "To Invoice",
      orderDateOffset: -12,
      lines: [
        {
          item: "PKG-FOOD-BOX",
          purchaseQuantity: 20,
          supplierUnitPrice: 445
        },
        {
          item: "RM-TEA-EXTRACT",
          purchaseQuantity: 20,
          supplierUnitPrice: 625
        }
      ],
      receipt: {
        ref: "receipt:copperline-restock",
        status: "Posted",
        postedOffset: -2,
        lines: [
          {
            item: "PKG-FOOD-BOX",
            orderQuantity: 20,
            outstandingQuantity: 0,
            receivedQuantity: 20,
            unitPrice: 445,
            toShelf: "A1-L2"
          },
          {
            item: "RM-TEA-EXTRACT",
            orderQuantity: 20,
            outstandingQuantity: 0,
            receivedQuantity: 20,
            unitPrice: 625,
            toShelf: "Chiết rót-Crib"
          }
        ]
      }
    }
  ],
  standaloneSupplierQuotes: [
    {
      key: "ironwood-hardware-blanket",
      assignee: "self",
      supplier: "Carton Việt Demo",
      status: "Draft",
      supplierReference: "IWF-2026-0781",
      quotedOffset: -3,
      expirationOffset: 60,
      lines: [
        {
          item: "PKG-BEV-PALLET",
          supplierPartId: "IWF-M10X35-A2",
          prices: [
            {
              quantity: 500,
              unitPrice: 54,
              leadTime: 10
            },
            {
              quantity: 1500,
              unitPrice: 51,
              leadTime: 10
            }
          ]
        }
      ]
    },
    {
      key: "lakeland-m19-annual",
      supplier: "Đường Thực Phẩm Việt Demo",
      status: "Expired",
      supplierReference: "LES-Q-5523",
      quotedOffset: -220,
      expirationOffset: -25,
      lines: [
        {
          item: "RM-SUGAR",
          supplierPartId: "LES-M19-035C5",
          prices: [
            {
              quantity: 2000,
              unitPrice: 89,
              leadTime: 28
            }
          ]
        }
      ]
    },
    {
      key: "summit-hybrid-study",
      supplier: "Bao Bì Thực Phẩm Việt Demo",
      status: "Declined",
      supplierReference: "SBS-2026-0114",
      quotedOffset: -40,
      expirationOffset: 20,
      lines: [
        {
          item: "PKG-FOOD-POUCH-ECO",
          supplierPartId: "SBS-6206-HC5",
          prices: [
            {
              quantity: 50,
              unitPrice: 1625,
              leadTime: 28
            }
          ]
        }
      ]
    }
  ],
  purchaseReturns: [
    {
      key: "bolt-plating",
      credit: {
        status: "Draft",
        dateOffset: -4,
        lines: [
          {
            line: 1,
            quantity: 40
          }
        ]
      },
      status: "Completed",
      supplier: "Carton Việt Demo",
      dateOffset: -6,
      lines: [
        {
          item: "PKG-BEV-PALLET",
          quantity: 40,
          unitPrice: 57.5,
          fromShelf: "A1-L1"
        }
      ]
    },
    {
      key: "bao bì-brinelling",
      status: "To Ship",
      supplier: "Bao Bì Thực Phẩm Việt Demo",
      dateOffset: -2,
      lines: [
        {
          item: "PKG-BEV-PET-500",
          quantity: 2,
          unitPrice: 1340
        }
      ]
    },
    {
      key: "bao bì-block-recall",
      status: "Draft",
      supplier: "Nước Và Chiết Xuất Việt Demo",
      dateOffset: 0,
      lines: [
        {
          item: "PKG-FOOD-BOX",
          quantity: 3,
          unitPrice: 445
        }
      ]
    },
    {
      key: "nomex-rtv",
      status: "Draft",
      supplier: "Nước Và Chiết Xuất Việt Demo",
      dateOffset: -3,
      lines: [
        {
          item: "RM-TEA-EXTRACT",
          quantity: 4,
          unitPrice: 625
        }
      ]
    }
  ],
  approvalRules: [
    {
      documentType: "purchaseOrder",
      lowerBoundAmount: 250000
    },
    {
      documentType: "purchaseOrder",
      lowerBoundAmount: 1250000,
      escalationDays: 3
    },
    {
      documentType: "supplier",
      lowerBoundAmount: 0
    }
  ],
  approvalRequests: [
    {
      purchaseOrder: "po:needs-approval",
      requestedOffset: -1
    },
    {
      supplier: "Chiết Xuất Mới Demo",
      requestedOffset: -4
    }
  ],
  supplierBankAccounts: [
    {
      supplier: "Trà Nguyên Liệu Việt Demo",
      name: "Trà Việt remittance",
      bankName: "Bao Bì Việt City Bank (demo)",
      accountHolderName: "Trà Nguyên Liệu Việt Demo Inc.",
      countryCode: "US",
      currencyCode: "VND",
      accountNumber: "DEMO-7745-1068",
      bankCode: "DEMO-074100",
      isPrimary: true
    },
    {
      supplier: "Nước Và Chiết Xuất Việt Demo",
      name: "Nước Việt operating",
      bankName: "Gia Công Valley Savings (demo)",
      accountHolderName: "Nước Và Chiết Xuất Việt Demo LLC",
      countryCode: "US",
      currencyCode: "VND",
      accountNumber: "DEMO-8856-2179",
      isPrimary: true
    },
    {
      supplier: "Bao Bì Thực Phẩm Việt Demo",
      name: "Bao Bì Việt remittance",
      bankName: "Hoosier Commerce (demo)",
      accountHolderName: "Bao Bì Thực Phẩm Việt Demo Co.",
      countryCode: "US",
      currencyCode: "VND",
      accountNumber: "DEMO-9967-3280",
      isPrimary: true
    },
    {
      supplier: "Nguyên Liệu Châu Âu Demo",
      name: "Euromag EUR account",
      bankName: "Rhein-Ruhr Handelsbank (demo)",
      accountHolderName: "Nguyên Liệu Châu Âu Demo",
      countryCode: "DE",
      currencyCode: "EUR",
      accountNumber: "DEMO-DE00-0000-6634",
      swiftBic: "DEMODEXX",
      isPrimary: true
    }
  ]
};
