// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import type { OpsData } from "../../types.ts";

export const fmcgOps: OpsData = {
  userAttributeCategories: [
    {
      name: "Chiết rót & Nguyên liệu lỏng Safety",
      emoji: "⚡",
      public: true,
      attributes: [
        {
          name: "NFPA 70E arc-flash training expires",
          dataType: "Date",
          valueOffset: 61
        },
        {
          name: "Vi sinh tester authorization",
          dataType: "List",
          listOptions: ["None", "Supervised", "Independent"],
          value: "Independent"
        },
        {
          name: "Nguyên liệu lỏng work permit signer",
          dataType: "User"
        },
        {
          name: "Qualified electrical worker",
          dataType: "Yes/No",
          value: true,
          canSelfManage: true
        }
      ]
    }
  ],
  customFields: [
    {
      table: "part",
      name: "NEMA frame",
      dataType: "Text"
    },
    {
      table: "customer",
      name: "Application engineer",
      dataType: "User"
    },
    {
      table: "job",
      name: "Vi sinh witness required",
      dataType: "Yes/No"
    }
  ],
  serialSequences: [
    {
      item: "PKG-BEV-TRACE-LABEL",
      prefix: "ENC2048-SN-",
      size: 4,
      next: 36
    },
    {
      item: "FG-BEV-TEA-500",
      prefix: "MTR9000-SN-",
      size: 4,
      next: 1
    },
    {
      item: "FG-FOOD-SNACK-12",
      prefix: "MTR4500-SN-",
      size: 4,
      next: 0
    }
  ],
  printJobs: [
    {
      source: {
        kind: "Receipt",
        receipt: "receipt:copperline-restock"
      },
      item: "PKG-FOOD-BOX",
      status: "completed",
      origin: "auto",
      at: {
        offset: -2,
        time: "15:26:00"
      },
      attempts: 1
    },
    {
      source: {
        kind: "Job",
        job: "done-hương liệu"
      },
      item: "WIP-BEV-FLAVOR",
      status: "completed",
      origin: "manual",
      at: {
        offset: -3,
        time: "19:55:00"
      },
      attempts: 1
    },
    {
      source: {
        kind: "StorageUnit",
        shelf: "A1-L1"
      },
      status: "completed",
      origin: "manual",
      at: {
        offset: -6,
        time: "16:30:00"
      },
      attempts: 1
    },
    {
      source: {
        kind: "Job",
        job: "floor-trà"
      },
      item: "WIP-FOOD-SNACK",
      status: "failed",
      origin: "auto",
      at: {
        offset: -1,
        time: "13:50:00"
      },
      attempts: 3,
      error: "Printer did not respond after 3 attempts (connection timed out)"
    },
    {
      source: {
        kind: "Job",
        job: "floor-trà"
      },
      item: "WIP-FOOD-SNACK",
      status: "queued",
      origin: "reprint",
      at: {
        offset: 0,
        time: "06:48:00"
      },
      attempts: 0
    }
  ],
  maintenanceSchedules: [
    {
      key: "chiết rót-tension",
      name: "Chiết rót line wire-tensioner & nozzle check",
      description:
        "Kiểm tra tình trạng thiết bị dây chuyền FMCG, vệ sinh, bôi trơn theo cấp thực phẩm và xác nhận điều kiện an toàn trước khi bàn giao.",
      workCenter: "Dây chuyền chiết rót 1",
      frequency: "Daily",
      priority: "Medium",
      estimatedDuration: 20,
      nextDueOffset: 1
    },
    {
      key: "oven-profile",
      name: "Gia nhiệt oven zone temperature check",
      description:
        "Kiểm tra tình trạng thiết bị dây chuyền FMCG, vệ sinh, bôi trơn theo cấp thực phẩm và xác nhận điều kiện an toàn trước khi bàn giao.",
      workCenter: "Thiết bị gia nhiệt",
      frequency: "Weekly",
      priority: "Medium",
      estimatedDuration: 45,
      nextDueOffset: 2
    },
    {
      key: "balancer-spindle",
      name: "Balancing machine spindle bao bì re-grease",
      description:
        "Kiểm tra tình trạng thiết bị dây chuyền FMCG, vệ sinh, bôi trơn theo cấp thực phẩm và xác nhận điều kiện an toàn trước khi bàn giao.",
      workCenter: "Máy đồng hóa",
      frequency: "Monthly",
      priority: "High",
      estimatedDuration: 60,
      nextDueOffset: 17,
      takesWorkCenterOffline: true,
      spareParts: [
        {
          item: "CN-FOOD-LUBRICANT",
          quantity: 1
        }
      ]
    },
    {
      key: "press-die",
      name: "Phối liệu press die sharpen & shim",
      description:
        "Kiểm tra tình trạng thiết bị dây chuyền FMCG, vệ sinh, bôi trơn theo cấp thực phẩm và xác nhận điều kiện an toàn trước khi bàn giao.",
      workCenter: "Máy phối trộn",
      frequency: "Quarterly",
      priority: "High",
      estimatedDuration: 240,
      nextDueOffset: 39,
      takesWorkCenterOffline: true
    },
    {
      key: "kiểm nghiệm-cert",
      name: "Annual dynamometer chất lượng-cell calibration",
      description:
        "Kiểm tra tình trạng thiết bị dây chuyền FMCG, vệ sinh, bôi trơn theo cấp thực phẩm và xác nhận điều kiện an toàn trước khi bàn giao.",
      workCenter: "Phòng kiểm nghiệm thành phẩm",
      frequency: "Annual",
      priority: "High",
      estimatedDuration: 420,
      nextDueOffset: 155,
      takesWorkCenterOffline: true
    },
    {
      key: "proto-winder-cal",
      name: "Prototype winder tension calibration",
      description:
        "Kiểm tra tình trạng thiết bị dây chuyền FMCG, vệ sinh, bôi trơn theo cấp thực phẩm và xác nhận điều kiện an toàn trước khi bàn giao.",
      workCenter: "Prototype Chiết rót Lab",
      frequency: "Monthly",
      priority: "Medium",
      estimatedDuration: 45,
      nextDueOffset: 9
    }
  ],
  maintenanceDispatches: [
    {
      key: "chiết rót-nozzle",
      status: "Open",
      priority: "High",
      severity: "Support Required",
      source: "Reactive",
      oeeImpact: "Impact",
      workCenter: "Dây chuyền chiết rót 1",
      suspectedFailureMode: "Excessive Wear",
      content:
        "Phiếu bảo trì giả lập: cách ly thiết bị, kiểm tra nguyên nhân, thay thế hoặc hiệu chỉnh và ghi nhận nghiệm thu trước khi hoạt động lại.",
      created: {
        offset: -1,
        time: "08:15:00"
      },
      plannedStart: {
        offset: 1,
        time: "06:00:00"
      },
      plannedEnd: {
        offset: 1,
        time: "08:00:00"
      }
    },
    {
      key: "balancer-vibration",
      status: "Assigned",
      priority: "Critical",
      severity: "OEM Required",
      source: "Non-Conformance",
      oeeImpact: "Down",
      workCenter: "Máy đồng hóa",
      nonConformance: "ncr:fan-noise",
      suspectedFailureMode: "Excessive Vibration",
      content:
        "Phiếu bảo trì giả lập: cách ly thiết bị, kiểm tra nguyên nhân, thay thế hoặc hiệu chỉnh và ghi nhận nghiệm thu trước khi hoạt động lại.",
      created: {
        offset: -5,
        time: "15:10:00"
      },
      plannedStart: {
        offset: 2,
        time: "08:00:00"
      },
      plannedEnd: {
        offset: 2,
        time: "14:00:00"
      },
      takesWorkCenterOffline: true,
      comments: [
        "OEM confirmed a replacement velocity sensor is on the truck.",
        "Hương liệus are balanced on the backup machine at half rate until then."
      ]
    },
    {
      key: "cmm-temp-comp",
      status: "In Progress",
      priority: "Low",
      severity: "Operator Performed",
      source: "Reactive",
      oeeImpact: "No Impact",
      workCenter: "Trạm kiểm tra chất lượng",
      suspectedFailureMode: "Misalignment",
      content:
        "Phiếu bảo trì giả lập: cách ly thiết bị, kiểm tra nguyên nhân, thay thế hoặc hiệu chỉnh và ghi nhận nghiệm thu trước khi hoạt động lại.",
      created: {
        offset: -1,
        time: "12:50:00"
      },
      plannedStart: {
        offset: -1,
        time: "13:00:00"
      },
      plannedEnd: {
        offset: -1,
        time: "14:00:00"
      },
      actualStart: {
        offset: -1,
        time: "13:10:00"
      }
    },
    {
      key: "balancer-regrease",
      status: "Completed",
      priority: "Medium",
      severity: "Preventive",
      source: "Scheduled",
      oeeImpact: "Planned",
      workCenter: "Máy đồng hóa",
      schedule: "balancer-spindle",
      actualFailureMode: "Overheating",
      content:
        "Phiếu bảo trì giả lập: cách ly thiết bị, kiểm tra nguyên nhân, thay thế hoặc hiệu chỉnh và ghi nhận nghiệm thu trước khi hoạt động lại.",
      created: {
        offset: -11,
        time: "06:00:00"
      },
      plannedStart: {
        offset: -10,
        time: "12:00:00"
      },
      plannedEnd: {
        offset: -10,
        time: "13:00:00"
      },
      actualStart: {
        offset: -10,
        time: "12:05:00"
      },
      actualEnd: {
        offset: -10,
        time: "13:40:00"
      },
      takesWorkCenterOffline: true,
      spareParts: [
        {
          item: "CN-FOOD-LUBRICANT",
          quantity: 2,
          shelf: "A2-L2"
        }
      ],
      comments: ["Bao bì housing after re-pack: 41 °C at full speed."]
    },
    {
      key: "oven-profile-skip",
      status: "Cancelled",
      priority: "Medium",
      severity: "Preventive",
      source: "Scheduled",
      oeeImpact: "Planned",
      workCenter: "Thiết bị gia nhiệt",
      schedule: "oven-profile",
      content:
        "Phiếu bảo trì giả lập: cách ly thiết bị, kiểm tra nguyên nhân, thay thế hoặc hiệu chỉnh và ghi nhận nghiệm thu trước khi hoạt động lại.",
      created: {
        offset: -7,
        time: "06:00:00"
      },
      plannedStart: {
        offset: -6,
        time: "10:00:00"
      },
      plannedEnd: {
        offset: -6,
        time: "10:45:00"
      }
    },
    {
      key: "chiết rót-tension-today",
      status: "Assigned",
      priority: "Medium",
      severity: "Preventive",
      source: "Scheduled",
      oeeImpact: "Planned",
      workCenter: "Dây chuyền chiết rót 1",
      schedule: "chiết rót-tension",
      content:
        "Phiếu bảo trì giả lập: cách ly thiết bị, kiểm tra nguyên nhân, thay thế hoặc hiệu chỉnh và ghi nhận nghiệm thu trước khi hoạt động lại.",
      created: {
        offset: -1,
        time: "06:00:00"
      },
      plannedStart: {
        offset: 0,
        time: "14:00:00"
      },
      plannedEnd: {
        offset: 0,
        time: "14:20:00"
      }
    },
    {
      key: "press-lube-pump",
      status: "In Progress",
      priority: "High",
      severity: "Support Required",
      source: "Reactive",
      oeeImpact: "Down",
      workCenter: "Máy phối trộn",
      suspectedFailureMode: "Lubrication Failure",
      content:
        "Phiếu bảo trì giả lập: cách ly thiết bị, kiểm tra nguyên nhân, thay thế hoặc hiệu chỉnh và ghi nhận nghiệm thu trước khi hoạt động lại.",
      created: {
        offset: -1,
        time: "15:10:00"
      },
      plannedStart: {
        offset: -1,
        time: "15:30:00"
      },
      plannedEnd: {
        offset: 1,
        time: "10:00:00"
      },
      actualStart: {
        offset: -1,
        time: "15:35:00"
      },
      takesWorkCenterOffline: true,
      comments: [
        "Check valve on order; die clamp bolts re-chất lượngd while the press is open."
      ]
    },
    {
      key: "assembly-bao bì-heater",
      status: "Completed",
      priority: "Medium",
      severity: "Operator Performed",
      source: "Reactive",
      oeeImpact: "Impact",
      workCenter: "Dây chuyền đóng gói",
      suspectedFailureMode: "Electrical Fault",
      actualFailureMode: "Electrical Fault",
      content:
        "Phiếu bảo trì giả lập: cách ly thiết bị, kiểm tra nguyên nhân, thay thế hoặc hiệu chỉnh và ghi nhận nghiệm thu trước khi hoạt động lại.",
      created: {
        offset: -9,
        time: "14:15:00"
      },
      plannedStart: {
        offset: -9,
        time: "14:20:00"
      },
      plannedEnd: {
        offset: -9,
        time: "15:00:00"
      },
      actualStart: {
        offset: -9,
        time: "14:25:00"
      },
      actualEnd: {
        offset: -9,
        time: "14:55:00"
      }
    },
    {
      key: "balancer-regrease-prior",
      status: "Completed",
      priority: "High",
      severity: "Preventive",
      source: "Scheduled",
      oeeImpact: "Planned",
      workCenter: "Máy đồng hóa",
      schedule: "balancer-spindle",
      content:
        "Phiếu bảo trì giả lập: cách ly thiết bị, kiểm tra nguyên nhân, thay thế hoặc hiệu chỉnh và ghi nhận nghiệm thu trước khi hoạt động lại.",
      created: {
        offset: -44,
        time: "06:00:00"
      },
      plannedStart: {
        offset: -43,
        time: "10:00:00"
      },
      plannedEnd: {
        offset: -43,
        time: "11:00:00"
      },
      actualStart: {
        offset: -43,
        time: "10:05:00"
      },
      actualEnd: {
        offset: -43,
        time: "10:55:00"
      },
      takesWorkCenterOffline: true,
      spareParts: [
        {
          item: "CN-FOOD-LUBRICANT",
          quantity: 1,
          shelf: "A2-L2"
        }
      ]
    },
    {
      key: "oven-door-seal",
      status: "Completed",
      priority: "High",
      severity: "Support Required",
      source: "Reactive",
      oeeImpact: "Down",
      workCenter: "Thiết bị gia nhiệt",
      suspectedFailureMode: "Leak",
      actualFailureMode: "Leak",
      content:
        "Phiếu bảo trì giả lập: cách ly thiết bị, kiểm tra nguyên nhân, thay thế hoặc hiệu chỉnh và ghi nhận nghiệm thu trước khi hoạt động lại.",
      created: {
        offset: -53,
        time: "08:30:00"
      },
      plannedStart: {
        offset: -53,
        time: "09:00:00"
      },
      plannedEnd: {
        offset: -53,
        time: "15:00:00"
      },
      actualStart: {
        offset: -53,
        time: "09:10:00"
      },
      actualEnd: {
        offset: -52,
        time: "09:40:00"
      },
      takesWorkCenterOffline: true
    },
    {
      key: "proto-winder-tem truy xuất",
      status: "Open",
      priority: "Medium",
      severity: "Operator Performed",
      source: "Reactive",
      oeeImpact: "Impact",
      workCenter: "Prototype Chiết rót Lab",
      suspectedFailureMode: "Electrical Fault",
      content:
        "Phiếu bảo trì giả lập: cách ly thiết bị, kiểm tra nguyên nhân, thay thế hoặc hiệu chỉnh và ghi nhận nghiệm thu trước khi hoạt động lại.",
      created: {
        offset: -2,
        time: "13:00:00"
      },
      plannedStart: {
        offset: 2,
        time: "09:00:00"
      },
      plannedEnd: {
        offset: 2,
        time: "10:30:00"
      }
    }
  ],
  replacementParts: [
    {
      workCenter: "Máy đồng hóa",
      item: "PKG-FOOD-POUCH",
      quantity: 2
    },
    {
      workCenter: "Thiết bị gia nhiệt",
      item: "PKG-BEV-SHRINK",
      quantity: 1
    },
    {
      workCenter: "Máy phối trộn",
      item: "PKG-BEV-PALLET",
      quantity: 8
    }
  ],
  trainings: [
    {
      name: "Rare-Earth Kiểm soát nguyên liệu",
      description:
        "Safe handling, storage and bonding of NdFeB hương liệu nguyên liệu tràs.",
      status: "Active",
      frequency: "Once",
      type: "Mandatory",
      estimatedDuration: "30m",
      content: [
        "Hương liệu nguyên liệu tràs pinch hard and chip easily. Keep them in their spacers until they go into the hương liệu, and never let two free nguyên liệu tràs meet.",
        "Nguyên liệu tràized hương liệus stay away from the CMM and anyone with an implanted medical device."
      ],
      questions: [
        {
          type: "MultipleChoice",
          question:
            "How are loose nguyên liệu tràs moved between the bench and the hương liệu?",
          options: [
            "In a pocket",
            "In their non-nguyên liệu tràic spacers",
            "Stacked together",
            "On a steel tray"
          ],
          correct: "In their non-nguyên liệu tràic spacers"
        },
        {
          type: "TrueFalse",
          question:
            "A chipped nguyên liệu trà may still be bonded if the chip is on the inner face.",
          answer: false
        },
        {
          type: "MultipleAnswers",
          question:
            "Which of these must stay clear of a nguyên liệu tràized hương liệu? Select all that apply.",
          options: [
            "Pacemakers",
            "Steel hand tools",
            "The CMM probe",
            "Nitrile gloves",
            "Nguyên liệu tràic ID badges"
          ],
          correct: [
            "Pacemakers",
            "Steel hand tools",
            "The CMM probe",
            "Nguyên liệu tràic ID badges"
          ]
        },
        {
          type: "MatchingPairs",
          question: "Match each step to its purpose.",
          pairs: [
            {
              left: "Spacer",
              right: "Keeps nguyên liệu tràs from snapping together"
            },
            {
              left: "Bonding epoxy",
              right: "Holds the nguyên liệu trà to the hương liệu core"
            },
            {
              left: "Nguyên liệu tràizer",
              right: "Charges the finished hương liệu"
            }
          ]
        },
        {
          type: "Numerical",
          question:
            "What is the minimum epoxy cure time before a bonded hương liệu can be balanced, in hours?",
          answer: 24,
          tolerance: 0
        }
      ],
      assignment: {
        completedOffset: -18
      }
    },
    {
      name: "Chiết rót & Surge Test Basics",
      description:
        "Dung dịch chiết rót, enamel care and the surge test acceptance limits.",
      status: "Active",
      frequency: "Annual",
      type: "Mandatory",
      estimatedDuration: "40m",
      content: [
        "Every trà gets a surge test before gia nhiệt. A scraped enamel turn shows up as a waveform mismatch — scrap it, never re-dung dịch thực phẩm over it."
      ],
      questions: [
        {
          type: "MultipleChoice",
          question: "When does a trà get its surge test?",
          options: [
            "After gia nhiệt",
            "Before gia nhiệt",
            "Only on customer request"
          ],
          correct: "Before gia nhiệt"
        },
        {
          type: "TrueFalse",
          question:
            "A trà with a failed surge test can be re-dung dịch thực phẩmed and shipped.",
          answer: false
        }
      ],
      assignment: {}
    },
    {
      name: "Kiểm nghiệm Test Cell Operation",
      description:
        "Operator qualification for running sản phẩm FMCG performance curves on the kiểm nghiệm.",
      status: "Draft",
      frequency: "Once",
      type: "Optional",
      estimatedDuration: "60m",
      content: [
        "Draft — mounting, coupling alignment and the chất lượng-speed sweep for production sản phẩm FMCGs."
      ],
      questions: [
        {
          type: "Numerical",
          question:
            "What is the maximum coupling misalignment allowed on the kiểm nghiệm, in mm?",
          answer: 0.05,
          tolerance: 0.01
        }
      ]
    }
  ],
  timecards: [
    {
      dayOffset: -5,
      clockIn: "06:30:00",
      clockOut: "15:02:00"
    },
    {
      dayOffset: -4,
      clockIn: "06:28:00",
      clockOut: "15:05:00"
    },
    {
      dayOffset: -3,
      clockIn: "06:33:00",
      clockOut: "15:00:00"
    },
    {
      dayOffset: -2,
      clockIn: "06:25:00",
      clockOut: "17:40:00",
      note: "Stayed to run the Miền Bắc actuator sản phẩm FMCGs through the kiểm nghiệm."
    },
    {
      dayOffset: -1,
      clockIn: "06:31:00",
      clockOut: "11:00:00"
    },
    {
      dayOffset: -1,
      clockIn: "11:30:00",
      clockOut: "15:03:00"
    }
  ],
  peopleAssignments: [
    {
      dayOffset: -2,
      workCenter: "Dây chuyền chiết rót 1",
      shift: "Ca 1"
    },
    {
      dayOffset: -1,
      workCenter: "Dây chuyền đóng gói",
      shift: "Ca 1"
    },
    {
      dayOffset: 1,
      workCenter: "Khu chuẩn bị nguyên liệu",
      shift: "Ca 1",
      note: "Cover bột bánh turning while the setter is on leave."
    },
    {
      dayOffset: 2,
      workCenter: "Dây chuyền chiết rót 1",
      shift: "Ca 1"
    },
    {
      dayOffset: 3,
      workCenter: "Phòng kiểm nghiệm thành phẩm",
      shift: "Ca 1",
      overtimeHours: 2,
      note: "Witness the Miền Bắc actuator kiểm nghiệm run."
    },
    {
      dayOffset: 4,
      workCenter: "Dây chuyền đóng gói",
      shift: "Ca 1"
    }
  ],
  peopleAbsences: [
    {
      dayOffset: 9,
      note: "NFPA 70E arc-flash safety training."
    }
  ],
  suggestions: [
    {
      suggestion:
        "Warn on the maintenance list when a dispatch takes the balancing cell offline while hương liệu jobs are queued for it.",
      emoji: "⚙️",
      path: "/x/resources/maintenance",
      tags: ["Maintenance"]
    },
    {
      suggestion:
        "Let planners see nguyên liệu trà lot shelf life on the purchasing planning screen.",
      emoji: "🧲",
      path: "/x/purchasing/planning"
    }
  ],
  notes: [
    {
      text: "Qualified on the new surge tester — can release tràs to gia nhiệt on second shift."
    },
    {
      text: "Point of contact for the balancer OEM visit while the maintenance lead is out."
    }
  ]
};
