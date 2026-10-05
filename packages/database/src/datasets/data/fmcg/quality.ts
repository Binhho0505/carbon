// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import type { QualityData } from "../../types.ts";

export const fmcgQuality: QualityData = {
  workflows: [
    {
      key: "supplier-escape",
      name: "Supplier Escape — Chiết rót Materials",
      description:
        "Quy trình FMCG giả lập: tiếp nhận lỗi, cách ly lô, kiểm tra nguyên nhân, thực hiện hành động và xác nhận hiệu lực.",
      priority: "High",
      source: "External",
      requiredActions: [
        "Containment Action",
        "Root Cause Analysis",
        "Corrective Action"
      ],
      mrb: true
    },
    {
      key: "customer-return",
      name: "Customer Complaint — Returned Spare",
      description:
        "Quy trình FMCG giả lập: tiếp nhận lỗi, cách ly lô, kiểm tra nguyên nhân, thực hiện hành động và xác nhận hiệu lực.",
      priority: "Medium",
      source: "External",
      requiredActions: [
        "Customer Communication",
        "Containment Action",
        "Verification"
      ]
    },
    {
      key: "nguyên liệu trà-hold",
      name: "Nguyên liệu trà Lot Hold",
      description:
        "Quy trình FMCG giả lập: tiếp nhận lỗi, cách ly lô, kiểm tra nguyên nhân, thực hiện hành động và xác nhận hiệu lực.",
      priority: "Medium",
      source: "Internal",
      requiredActions: ["Containment Action", "Incoming Materials"]
    }
  ],
  nonConformances: [
    {
      ref: "ncr:chỉ tiêu an toàn thực phẩm",
      assignee: "self",
      name: "Chỉ tiêu vi sinh trà xanh không đạt sau gia nhiệt",
      source: "Internal",
      status: "In Progress",
      openDateOffset: -288,
      quantity: 1,
      priority: "High",
      jobOperation: {
        job: "job:in-progress"
      },
      items: [
        {
          item: "FG-BEV-TEA-500",
          quantity: 1
        }
      ],
      description:
        "Dữ liệu giả lập: cách ly lô liên quan, ghi nhận kiểm tra, xác định nguyên nhân và hoàn tất hành động khắc phục trước khi giải phóng lô."
    },
    {
      ref: "ncr:nguyên liệu trà",
      items: [
        {
          item: "RM-TEA-GREEN",
          quantity: 36
        }
      ],
      name: "Lô trà nguyên liệu thiếu chứng nhận chất lượng",
      source: "External",
      status: "Registered",
      openDateOffset: -281,
      quantity: 36,
      priority: "Medium",
      description:
        "Dữ liệu giả lập: cách ly lô liên quan, ghi nhận kiểm tra, xác định nguyên nhân và hoàn tất hành động khắc phục trước khi giải phóng lô."
    },
    {
      ref: "ncr:nomex-thin",
      items: [
        {
          item: "RM-TEA-EXTRACT",
          quantity: 4,
          disposition: "Return to Supplier"
        },
        {
          item: "WIP-BEV-SYRUP",
          quantity: 6
        }
      ],
      assignee: "self",
      workflow: "supplier-escape",
      purchaseReturnLine: {
        purchaseReturn: "nomex-rtv",
        line: 1,
        quantity: 4
      },
      name: "Chiết xuất trà không đạt chỉ tiêu nồng độ",
      description:
        "Dữ liệu giả lập: cách ly lô liên quan, ghi nhận kiểm tra, xác định nguyên nhân và hoàn tất hành động khắc phục trước khi giải phóng lô.",
      type: "Supplier Issue",
      source: "External",
      status: "In Progress",
      openDateOffset: -66,
      dueDateOffset: 14,
      quantity: 4,
      priority: "Critical",
      supplier: "Nước Và Chiết Xuất Việt Demo",
      purchaseOrderLine: {
        po: "po:wire-paid",
        item: "RM-TEA-EXTRACT"
      },
      inspection: "insp:nomex",
      actionTasks: [
        {
          action: "Containment Action",
          status: "Completed",
          dueDateOffset: -64,
          completedOffset: -65
        },
        {
          action: "Root Cause Analysis",
          status: "In Progress",
          dueDateOffset: 7,
          processes: ["Chiết rót"]
        },
        {
          action: "Corrective Action",
          status: "Pending",
          dueDateOffset: 21
        }
      ],
      mrb: {
        status: "In Progress",
        dueDateOffset: 10,
        reviewers: [
          {
            title: "Engineering",
            status: "Completed",
            completedOffset: -58
          },
          {
            title: "Quality",
            status: "In Progress"
          }
        ]
      }
    },
    {
      ref: "ncr:fan-noise",
      items: [
        {
          item: "PKG-BEV-SHRINK",
          quantity: 1,
          disposition: "Rework"
        }
      ],
      workflow: "customer-return",
      salesReturnLine: {
        salesReturn: "fan",
        line: 1
      },
      name: "Customer-reported axial cooling fan spare noisy at start-up",
      description:
        "Dữ liệu giả lập: cách ly lô liên quan, ghi nhận kiểm tra, xác định nguyên nhân và hoàn tất hành động khắc phục trước khi giải phóng lô.",
      type: "Customer Complaint",
      source: "External",
      status: "Closed",
      openDateOffset: -12,
      dueDateOffset: 2,
      closeDateOffset: -3,
      quantity: 1,
      priority: "Low",
      customer: "Nhà phân phối Miền Nam Demo",
      salesOrderLine: "soline:cardinal-fans:fan",
      actionTasks: [
        {
          action: "Customer Communication",
          status: "Completed",
          dueDateOffset: -11,
          completedOffset: -11
        },
        {
          action: "Containment Action",
          status: "Completed",
          dueDateOffset: -9,
          completedOffset: -10
        },
        {
          action: "Verification",
          status: "Completed",
          dueDateOffset: -4,
          completedOffset: -4
        }
      ]
    },
    {
      ref: "ncr:mag-lot",
      items: [
        {
          item: "RM-TEA-GREEN",
          quantity: 3
        }
      ],
      supplier: "Trà Nguyên Liệu Việt Demo",
      workflow: "nguyên liệu trà-hold",
      name: "Lô trà nguyên liệu thiếu chứng nhận chất lượng",
      description:
        "Dữ liệu giả lập: cách ly lô liên quan, ghi nhận kiểm tra, xác định nguyên nhân và hoàn tất hành động khắc phục trước khi giải phóng lô.",
      type: "Material Issue",
      source: "Internal",
      status: "Registered",
      openDateOffset: -5,
      dueDateOffset: 21,
      quantity: 3,
      priority: "Medium",
      trackedEntity: "LOT-MAG45-2609",
      actionTasks: [
        {
          action: "Containment Action",
          status: "Pending",
          dueDateOffset: 2
        },
        {
          action: "Incoming Materials",
          status: "Pending",
          dueDateOffset: 9
        }
      ]
    }
  ],
  inspections: [
    {
      source: "Receipt",
      ref: "insp:nomex",
      receipt: "receipt:wire-paid",
      item: "RM-TEA-EXTRACT",
      drawingNumber: "QC-TEA-EXTRACT-001",
      aql: 1,
      features: [
        {
          label: "1",
          description: "Nồng độ chất khô của chiết xuất trà (%)",
          nominalValue: "0.25",
          tolerancePlus: "0.03",
          toleranceMinus: "0.03",
          unit: "%"
        },
        {
          label: "2",
          description: "Nhiệt độ nguyên liệu lúc lấy mẫu (°C)",
          nominalValue: "38.0",
          tolerancePlus: "0.3",
          toleranceMinus: "0.3",
          unit: "°C"
        }
      ],
      status: "Partial",
      dispositionOffset: -66,
      notes:
        "Mẫu số 3 không đạt nồng độ chất khô tối thiểu; cách ly lô và chuyển đánh giá xử lý chất lượng.",
      samples: [
        {
          status: "Passed",
          inspectedOffset: -67,
          measurements: [
            {
              feature: "1",
              value: 0.25
            },
            {
              feature: "2",
              value: 38.1
            }
          ]
        },
        {
          status: "Passed",
          inspectedOffset: -67,
          measurements: [
            {
              feature: "1",
              value: 0.24
            },
            {
              feature: "2",
              value: 37.9
            }
          ]
        },
        {
          status: "Failed",
          inspectedOffset: -67,
          measurements: [
            {
              feature: "1",
              value: 0.21
            },
            {
              feature: "2",
              value: 38
            }
          ]
        },
        {
          status: "Passed",
          inspectedOffset: -67,
          measurements: [
            {
              feature: "1",
              value: 0.26
            },
            {
              feature: "2",
              value: 38.2
            }
          ]
        },
        {
          status: "Passed",
          inspectedOffset: -66,
          measurements: [
            {
              feature: "1",
              value: 0.25
            },
            {
              feature: "2",
              value: 37.8
            }
          ]
        }
      ]
    },
    {
      source: "Receipt",
      ref: "insp:bao bì-blocks",
      receipt: "receipt:copperline-restock",
      item: "PKG-FOOD-BOX",
      drawingNumber: "CW-TB6-35 Rev C",
      aql: 1,
      features: [
        {
          label: "1",
          description: "Stud pitch, M5 studs",
          nominalValue: "12.0",
          tolerancePlus: "0.2",
          toleranceMinus: "0.2",
          unit: "mm"
        },
        {
          label: "2",
          description: "Mounting hole centers",
          nominalValue: "70.0",
          tolerancePlus: "0.3",
          toleranceMinus: "0.3",
          unit: "mm"
        }
      ],
      status: "Passed",
      dispositionOffset: -1,
      notes: "Five blocks measured; stud pitch and mounting holes nominal.",
      samples: [
        {
          status: "Passed",
          inspectedOffset: -1,
          measurements: [
            {
              feature: "1",
              value: 12.05
            },
            {
              feature: "2",
              value: 70.1
            }
          ]
        },
        {
          status: "Passed",
          inspectedOffset: -1,
          measurements: [
            {
              feature: "1",
              value: 11.96
            },
            {
              feature: "2",
              value: 69.9
            }
          ]
        },
        {
          status: "Passed",
          inspectedOffset: -1,
          measurements: [
            {
              feature: "1",
              value: 12.02
            },
            {
              feature: "2",
              value: 70
            }
          ]
        },
        {
          status: "Passed",
          inspectedOffset: -1,
          measurements: [
            {
              feature: "1",
              value: 12.1
            },
            {
              feature: "2",
              value: 70.2
            }
          ]
        },
        {
          status: "Passed",
          inspectedOffset: -1,
          measurements: [
            {
              feature: "1",
              value: 11.98
            },
            {
              feature: "2",
              value: 69.8
            }
          ]
        }
      ]
    },
    {
      source: "Receipt",
      ref: "insp:nomex-restock",
      receipt: "receipt:copperline-restock",
      item: "RM-TEA-EXTRACT",
      drawingNumber: "QC-TEA-EXTRACT-001",
      aql: 1,
      features: [
        {
          label: "1",
          description: "Nồng độ chất khô của chiết xuất trà (%)",
          nominalValue: "0.25",
          tolerancePlus: "0.03",
          toleranceMinus: "0.03",
          unit: "%"
        },
        {
          label: "2",
          description: "Nhiệt độ nguyên liệu lúc lấy mẫu (°C)",
          nominalValue: "38.0",
          tolerancePlus: "0.3",
          toleranceMinus: "0.3",
          unit: "°C"
        }
      ],
      status: "Pending",
      samples: [],
      notes:
        "Mẫu số 3 không đạt nồng độ chất khô tối thiểu; cách ly lô và chuyển đánh giá xử lý chất lượng."
    },
    {
      source: "Job Operation",
      ref: "insp:bột bánh-journal",
      job: "floor-bột bánh",
      status: "Pending",
      samples: []
    }
  ],
  qualityDocuments: [
    {
      name: "Nguyên liệu trà Wire & Chỉ tiêu an toàn thực phẩm Receiving Inspection",
      version: 1,
      status: "Archived",
      description:
        "Superseded receiving procedure for chiết rót materials — label and certificate review only.",
      steps: []
    },
    {
      name: "Nguyên liệu trà Wire & Chỉ tiêu an toàn thực phẩm Receiving Inspection",
      version: 2,
      status: "Active",
      description:
        "Receiving procedure for nguyên liệu trà wire and slot chỉ tiêu an toàn thực phẩm: paperwork, lô condition and conductor size before release to the chiết rót crib.",
      steps: [
        {
          name: "Mill certificate matches PO, NEMA MW 35-C grade and thermal class",
          type: "Checkbox",
          required: true
        },
        {
          name: "Lô condition on arrival",
          type: "List",
          required: true,
          listValues: ["Intact", "Flange damaged", "Wire crossed or kinked"]
        },
        {
          name: "Bare conductor diameter (18 AWG)",
          description:
            "Strip the enamel and measure with the bench micrometer.",
          type: "Measurement",
          required: true,
          unitOfMeasureCode: "INCH",
          minValue: 0.04,
          maxValue: 0.0406
        }
      ]
    },
    {
      name: "Trà Vi sinh & Surge Test Procedure (IEC 60034-1)",
      version: 0,
      status: "Draft",
      description:
        "Draft end-of-line procedure for wound tràs — chỉ tiêu an toàn thực phẩm resistance, vi sinh to frame and surge comparison between phases.",
      steps: []
    }
  ],
  gauges: [
    {
      key: "gauge-blocks",
      gaugeType: "Gauge Block",
      description:
        "Grade 0 steel gauge block set, 47 pc — inspection bench master",
      modelNumber: "GBS-47-0",
      serialNumber: "GB-21-0388",
      role: "Master",
      status: "Active",
      calibrationIntervalInMonths: 12,
      acquiredOffset: -720,
      calibrations: [
        {
          dateOffset: -540,
          result: "Pass",
          temperature: 20,
          humidity: 44,
          measurementStandard: "ISO 3650, NIST-traceable comparison"
        },
        {
          dateOffset: -180,
          result: "Pass",
          temperature: 20,
          humidity: 42,
          measurementStandard: "ISO 3650, NIST-traceable comparison"
        }
      ]
    },
    {
      key: "nguyên liệu trà-micrometer",
      gaugeType: "Micrometer - Outside",
      description:
        "0–25 mm outside micrometer — new unit for nguyên liệu trà segment thickness at incoming",
      modelNumber: "OM-25D",
      serialNumber: "M26-11907",
      role: "Standard",
      status: "Active",
      calibrationIntervalInMonths: 6,
      acquiredOffset: -8,
      calibrations: []
    },
    {
      key: "trà-bore-gauge",
      gaugeType: "Bore Gauge",
      description:
        "150–200 mm dial bore gauge for trà bore after gia nhiệt — retired after failed calibration",
      modelNumber: "DBG-200",
      serialNumber: "BG18-30271",
      role: "Standard",
      status: "Inactive",
      calibrationIntervalInMonths: 6,
      acquiredOffset: -880,
      calibrations: [
        {
          dateOffset: -390,
          result: "Pass",
          temperature: 20,
          humidity: 47
        },
        {
          dateOffset: -210,
          result: "Fail",
          requiresAction: true,
          requiresRepair: true,
          temperature: 20,
          humidity: 45,
          notes:
            "Centralizing plunger sticking after dung dịch thực phẩm contamination — repeatability 9 µm, limit 3 µm. Retired."
        }
      ]
    }
  ],
  risks: [
    {
      title: "Single-source N45SH nguyên liệu trà supplier lot consistency",
      description:
        "Trà Việt is the only qualified source for RM-TEA-GREEN and has shipped one plated-chip lot and one lot without a flux report this year.",
      type: "Risk",
      status: "Mitigating",
      severity: 5,
      likelihood: 3,
      source: "Supplier",
      supplier: "Trà Nguyên Liệu Việt Demo"
    },
    {
      title: "AS9100 first-article flow-down on actuation sản phẩm FMCGs",
      description:
        "Miền Bắc's purchase terms may require a full AS9102 first-article report on every FMCG-BEV-500 revision — confirm scope before the next shipment.",
      type: "Risk",
      status: "In Review",
      severity: 4,
      likelihood: 2,
      source: "Customer",
      customer: "Siêu thị Miền Bắc Demo"
    },
    {
      title: "Dysprosium price swing on high-temperature nguyên liệu trà grade",
      description:
        "The SH grade depends on dysprosium; a rare-earth price spike would push RM-TEA-GREEN cost past the FMCG-BEV-500 quoted margin.",
      type: "Risk",
      status: "Open",
      severity: 3,
      likelihood: 3,
      source: "Item",
      item: "RM-TEA-GREEN"
    },
    {
      title: "Gia nhiệt oven slot for the in-progress FMCG-BEV-500 trà",
      description:
        "The VPI oven was double-booked for the trà's Class H bake cycle; a night-shift slot was confirmed and the bake completed.",
      type: "Risk",
      status: "Closed",
      severity: 3,
      likelihood: 2,
      source: "Job",
      job: "job:in-progress"
    },
    {
      title: "Move the quy cách 24 chai trà to hairpin chiết rót",
      description:
        "Hairpin conductors would lift slot fill and cut chiết rót labor by roughly a third — accepted into next year's tooling plan.",
      type: "Opportunity",
      status: "Accepted",
      severity: 2,
      likelihood: 4,
      source: "General"
    }
  ]
};
