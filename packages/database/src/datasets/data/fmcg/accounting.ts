// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import type { AccountingData } from "../../types.ts";

export const fmcgAccounting: AccountingData = {
  fixedAssets: [
    {
      key: "oven",
      className: "Buildings",
      location: "Plant",
      name: "Thiết bị gia nhiệt Bay & Exđồ uống Plant",
      description:
        "Tài sản giả lập phục vụ chế biến, chiết rót hoặc đóng gói FMCG: Thiết bị gia nhiệt Bay & Exđồ uống Plant.",
      serialNumber: "OVN-BAY-77103",
      status: "Active",
      depreciationMethod: "Straight Line",
      usefulLifeMonths: 120,
      residualValuePercent: 5,
      acquisitionCost: 3000000000,
      acquisitionOffset: -941,
      depreciationStartOffset: -910,
      accumulatedDepreciation: 0,
      depreciationCharge: 712500000
    },
    {
      key: "kiểm nghiệm",
      className: "Machinery & Equipment",
      location: "Plant",
      name: "FMCG Kiểm nghiệm Test Stand",
      description:
        "Tài sản giả lập phục vụ chế biến, chiết rót hoặc đóng gói FMCG: FMCG Kiểm nghiệm Test Stand.",
      serialNumber: "DYN-4Q-00812",
      status: "Active",
      depreciationMethod: "Straight Line",
      usefulLifeMonths: 120,
      residualValuePercent: 5,
      acquisitionCost: 7200000000,
      acquisitionOffset: -521,
      depreciationStartOffset: -485,
      accumulatedDepreciation: 0,
      depreciationCharge: 912000000
    },
    {
      key: "winder",
      className: "Machinery & Equipment",
      location: "Plant",
      name: "Automatic Chiết rót Machine",
      description:
        "Tài sản giả lập phục vụ chế biến, chiết rót hoặc đóng gói FMCG: Automatic Chiết rót Machine.",
      serialNumber: "WND-AX8-20551",
      status: "Draft",
      depreciationMethod: "Straight Line",
      usefulLifeMonths: 120,
      residualValuePercent: 5,
      acquisitionCost: 0,
      acquisitionOffset: null,
      depreciationStartOffset: null,
      accumulatedDepreciation: 0
    },
    {
      key: "van",
      className: "Vehicles",
      location: "HQ",
      name: "Field Service Van",
      description:
        "Tài sản giả lập phục vụ chế biến, chiết rót hoặc đóng gói FMCG: Field Service Van.",
      serialNumber: "VIN-1FTBW2CM4LKB33127",
      status: "Fully Depreciated",
      depreciationMethod: "Straight Line",
      usefulLifeMonths: 60,
      residualValuePercent: 0,
      acquisitionCost: 1300000000,
      acquisitionOffset: -2617,
      depreciationStartOffset: -2586,
      accumulatedDepreciation: 1300000000
    },
    {
      key: "winder-gen1",
      className: "Machinery & Equipment",
      location: "Plant",
      name: "Chiết rót Machine (Gen 1)",
      description:
        "Tài sản giả lập phục vụ chế biến, chiết rót hoặc đóng gói FMCG: Chiết rót Machine (Gen 1).",
      serialNumber: "CW-G1-20944",
      status: "Disposed",
      depreciationMethod: "Straight Line",
      usefulLifeMonths: 120,
      residualValuePercent: 0,
      acquisitionCost: 1800000000,
      acquisitionOffset: -3100,
      depreciationStartOffset: -3080,
      accumulatedDepreciation: 1500000000,
      disposal: {
        dateOffset: -40,
        method: "Sale",
        saleProceeds: 225000000
      }
    },
    {
      key: "balancer",
      className: "Machinery & Equipment",
      location: "Plant",
      name: "Đồng hóa Machine",
      description:
        "Tài sản giả lập phục vụ chế biến, chiết rót hoặc đóng gói FMCG: Đồng hóa Machine.",
      serialNumber: "RBM-2P-61507",
      status: "Active",
      depreciationMethod: "Units of Production",
      usefulLifeMonths: 96,
      residualValuePercent: 0,
      acquisitionCost: 2100000000,
      acquisitionOffset: -120,
      depreciationStartOffset: -100,
      assetLifetimeUsage: 420000,
      accumulatedDepreciation: 19000000,
      usageLogs: [
        {
          monthsBack: 2,
          unitsProduced: 3800
        },
        {
          monthsBack: 1,
          unitsProduced: 4100
        }
      ],
      depreciationCharge: 20500000
    }
  ],
  journalEntries: [
    {
      ref: "journal:revenue",
      journalEntryId: "JE-SEED-001",
      description: "Revenue recognition — An Việt partial delivery",
      status: "Draft",
      postingOffset: -256,
      lines: [
        {
          accountClass: "Asset",
          description: "An Việt conveyor drive milestone",
          amount: 1410000,
          quantity: 6,
          journalLineReference: "JE-SEED-001"
        },
        {
          accountClass: "Revenue",
          description: "An Việt conveyor drive milestone",
          amount: 1410000,
          quantity: 6,
          journalLineReference: "JE-SEED-001"
        }
      ]
    },
    {
      ref: "journal:payroll-accrual",
      journalEntryId: "JE-SEED-002",
      description: "Payroll accrual — chiết rót and assembly crew, final week",
      status: "Posted",
      postingOffset: -12,
      lines: [
        {
          account: "6060",
          description: "Accrued chiết rót and assembly wages",
          amount: 735000000,
          quantity: 1,
          journalLineReference: "JE-SEED-002-1",
          dimensions: [
            {
              dimension: "Project",
              value: "ridgeline-đồ uống"
            },
            {
              dimension: "FMCG Family",
              value: "Đồ uống FMCGs"
            }
          ]
        },
        {
          account: "2150",
          description: "Accrued chiết rót and assembly wages",
          amount: 735000000,
          quantity: 1,
          journalLineReference: "JE-SEED-002-2"
        }
      ]
    },
    {
      ref: "journal:amortization",
      journalEntryId: "JE-SEED-003",
      description: "Monthly amortization — chiết rót pattern design license",
      status: "Posted",
      postingOffset: -23,
      lines: [
        {
          account: "6310",
          description: "Chiết rót pattern design license amortization",
          amount: 18000000,
          quantity: 1,
          journalLineReference: "JE-SEED-003"
        },
        {
          account: "1420",
          description: "Chiết rót pattern design license amortization",
          amount: -18000000,
          quantity: 1,
          journalLineReference: "JE-SEED-003"
        }
      ]
    },
    {
      ref: "journal:freight-accrual",
      journalEntryId: "JE-SEED-004",
      description: "Accrued outbound freight — duplicate of carrier invoice",
      status: "Reversed",
      postingOffset: -40,
      lines: [
        {
          account: "6040",
          description: "Outbound LTL freight",
          amount: 143000,
          quantity: 1,
          journalLineReference: "JE-SEED-004"
        },
        {
          account: "2140",
          description: "Outbound LTL freight",
          amount: 143000,
          quantity: 1,
          journalLineReference: "JE-SEED-004"
        }
      ],
      reversal: {
        ref: "journal:freight-accrual-reversal",
        journalEntryId: "JE-SEED-005",
        postingOffset: -33
      }
    },
    {
      ref: "journal:opening-balance",
      journalEntryId: "JE-SEED-006",
      description: "Opening balances — cutover from the legacy ledger",
      status: "Posted",
      sourceType: "Opening Balance",
      postingOffset: -242,
      lines: [
        {
          account: "1010",
          description: "Operating cash",
          amount: 15250000000,
          quantity: 1,
          journalLineReference: "JE-SEED-006-1"
        },
        {
          account: "1210",
          description: "Raw materials on hand",
          amount: 4500000000,
          quantity: 1,
          journalLineReference: "JE-SEED-006-2"
        },
        {
          account: "1220",
          description: "Finished goods on hand",
          amount: 3500000000,
          quantity: 1,
          journalLineReference: "JE-SEED-006-3"
        },
        {
          account: "1350",
          description: "Machinery & equipment at cost",
          amount: 28000000000,
          quantity: 1,
          journalLineReference: "JE-SEED-006-4"
        },
        {
          account: "1330",
          description: "Accumulated depreciation to date",
          amount: -7250000000,
          quantity: 1,
          journalLineReference: "JE-SEED-006-5"
        },
        {
          account: "2410",
          description: "Equipment term loan",
          amount: 16250000000,
          quantity: 1,
          journalLineReference: "JE-SEED-006-6"
        },
        {
          account: "3010",
          description: "Paid-in capital",
          amount: 15000000000,
          quantity: 1,
          journalLineReference: "JE-SEED-006-7"
        },
        {
          account: "3100",
          description: "Retained earnings brought forward",
          amount: 12750000000,
          quantity: 1,
          journalLineReference: "JE-SEED-006-8"
        }
      ]
    }
  ],
  payments: [
    {
      key: "wabash-ach",
      type: "Receipt",
      customer: "Đại lý Miền Trung Demo",
      dateOffset: -45,
      amount: 15000,
      reference: "ACH 9021-3345",
      applies: [
        {
          invoiceKey: "paid",
          amount: 15000
        }
      ]
    },
    {
      key: "ridgeline-wire",
      type: "Receipt",
      customer: "Siêu thị An Việt Demo",
      dateOffset: -10,
      amount: 35500,
      reference: "WIRE 61188",
      applies: [
        {
          invoiceKey: "partial",
          amount: 35500
        }
      ]
    },
    {
      key: "cardinal-credit",
      type: "Receipt",
      customer: "Nhà phân phối Miền Nam Demo",
      dateOffset: -49,
      amount: 0,
      reference: "Credit application",
      applies: [],
      credits: [
        {
          memoKey: "cardinal-bột bánhs",
          invoiceKey: "credit",
          amount: 20500
        }
      ]
    },
    {
      key: "copperline-ach",
      type: "Disbursement",
      supplier: "Nước Và Chiết Xuất Việt Demo",
      dateOffset: -31,
      amount: 51800,
      reference: "ACH 2217-8806",
      applies: [
        {
          invoiceKey: "paid",
          amount: 51800
        }
      ]
    },
    {
      key: "copperline-check",
      type: "Disbursement",
      supplier: "Nước Và Chiết Xuất Việt Demo",
      dateOffset: -12,
      amount: 8900,
      reference: "CHK 41209",
      applies: [
        {
          invoiceKey: "partial",
          amount: 8900
        }
      ]
    },
    {
      key: "lakeland-debit",
      type: "Disbursement",
      supplier: "Đường Thực Phẩm Việt Demo",
      dateOffset: -66,
      amount: 0,
      reference: "Debit application",
      applies: [],
      credits: [
        {
          memoKey: "lakeland-bar",
          invoiceKey: "debit-note",
          amount: 48750
        }
      ]
    },
    {
      key: "draft-receipt",
      type: "Receipt",
      status: "Draft",
      customer: "Nhà phân phối Miền Nam Demo",
      dateOffset: -1,
      amount: 39000,
      reference: "ACH advice 5580 — 4500 trà",
      applies: []
    },
    {
      key: "draft-disbursement",
      type: "Disbursement",
      status: "Draft",
      supplier: "Đường Thực Phẩm Việt Demo",
      dateOffset: 0,
      amount: 27000,
      reference: "ACH batch 0930 — phối liệu steel",
      applies: []
    }
  ],
  memos: [
    {
      key: "cardinal-bột bánhs",
      direction: "Credit",
      customer: "Nhà phân phối Miền Nam Demo",
      invoiceKey: "credit",
      dateOffset: -52,
      amount: 20500,
      notes:
        "Full credit — precision bột bánhs returned with bao bì-seat độ lệch khối lượng out of tolerance"
    },
    {
      key: "lakeland-bar",
      direction: "Debit",
      supplier: "Đường Thực Phẩm Việt Demo",
      invoiceKey: "debit-note",
      dateOffset: -70,
      amount: 48750,
      notes:
        "Bar stock failed the mill-cert review at Đường Việt — billing debited"
    }
  ],
  projects: [
    {
      key: "ridgeline-đồ uống",
      name: "An Việt EV Đồ uống FMCG Launch",
      description:
        "Production launch of the dòng đồ uống đồ uống sản phẩm FMCG for An Việt",
      purchaseInvoiceLine: {
        invoiceKey: "paid",
        item: "RM-WATER"
      }
    },
    {
      key: "kiểm nghiệm-automation",
      name: "Kiểm nghiệm Cell Automation",
      description:
        "Automated load profiles and data capture for end-of-line testing"
    }
  ],
  customDimension: {
    name: "FMCG Family",
    values: ["Đồ uống FMCGs", "Industrial FMCG"]
  },
  closeTasks: [
    {
      definition: "Post pending operational documents",
      status: "Done"
    },
    {
      definition: "Review negative on-hand inventory",
      status: "Skipped",
      skippedReason: "Physical count at month end found no negative bins"
    },
    {
      definition: "Review financial statements",
      status: "Open",
      notes: "Plant controller to review absorption variance"
    }
  ],
  exchangeRateOverrides: [
    {
      currencyCode: "EUR",
      rate: 0.00003686
    }
  ],
  billingAddresses: {
    receivable: {
      addressLine1: "Địa chỉ kế toán giả lập FMCG - không dùng giao dịch thật",
      city: "Thành phố Hồ Chí Minh",
      state: "Thành phố Hồ Chí Minh",
      postalCode: "70000",
      countryCode: "VN",
      phone: "+1-260-555-0174",
      email: "ar@fmcg-demo.example"
    },
    payable: {
      addressLine1: "Địa chỉ kế toán giả lập FMCG - không dùng giao dịch thật",
      city: "Thành phố Hồ Chí Minh",
      state: "Thành phố Hồ Chí Minh",
      postalCode: "70000",
      countryCode: "VN",
      phone: "+1-260-555-0175",
      email: "ap@fmcg-demo.example"
    }
  }
};
