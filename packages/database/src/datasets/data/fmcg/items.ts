// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import type { ItemsData } from "../../types.ts";

export const fmcgItems: ItemsData = {
  buyParts: [
    {
      readableId: "RM-TEA-GREEN",
      name: "Trà xanh nguyên liệu",
      type: "Part",
      replenishment: "Buy",
      trackingType: "Batch",
      standardCost: 925,
      unitSalePrice: 1400,
      leadTime: 60
    },
    {
      readableId: "RM-FOOD-SEASONING",
      name: "Gia vị bánh snack",
      type: "Part",
      replenishment: "Buy",
      trackingType: "Batch",
      standardCost: 710,
      unitSalePrice: 1075,
      leadTime: 60
    },
    {
      readableId: "PKG-FOOD-POUCH",
      name: "Túi bánh snack",
      type: "Part",
      replenishment: "Buy",
      standardCost: 620,
      unitSalePrice: 950,
      leadTime: 21
    },
    {
      readableId: "PKG-BEV-PET-500",
      name: "Chai PET 500 ml",
      type: "Part",
      replenishment: "Buy",
      standardCost: 1340,
      unitSalePrice: 2050,
      leadTime: 21
    },
    {
      readableId: "PKG-FOOD-SEAL",
      name: "Màng niêm phong thực phẩm",
      type: "Part",
      replenishment: "Buy",
      standardCost: 180,
      unitSalePrice: 300,
      leadTime: 14
    },
    {
      readableId: "PKG-BEV-TRACE-LABEL",
      name: "Tem truy xuất nguồn gốc đồ uống",
      type: "Part",
      replenishment: "Buy",
      trackingType: "Serial",
      standardCost: 4800,
      unitSalePrice: 7250,
      leadTime: 35
    },
    {
      readableId: "PKG-FOOD-BOX",
      name: "Hộp thực phẩm",
      type: "Part",
      replenishment: "Buy",
      standardCost: 445,
      unitSalePrice: 700,
      leadTime: 14
    },
    {
      readableId: "PKG-BEV-SHRINK",
      name: "Màng co lốc chai",
      type: "Part",
      replenishment: "Buy",
      standardCost: 1700,
      unitSalePrice: 2600,
      leadTime: 21
    },
    {
      readableId: "PKG-FOOD-CARTON",
      name: "Thùng carton thực phẩm",
      type: "Part",
      replenishment: "Buy",
      standardCost: 21,
      unitSalePrice: 37.5,
      leadTime: 10
    },
    {
      readableId: "PKG-BEV-PALLET",
      name: "Pallet đồ uống",
      type: "Part",
      replenishment: "Buy",
      standardCost: 57.5,
      unitSalePrice: 95,
      leadTime: 10
    },
    {
      readableId: "PKG-LOT-LABEL",
      name: "Nhãn lô sản xuất",
      type: "Part",
      replenishment: "Buy",
      standardCost: 112.5,
      unitSalePrice: 190,
      leadTime: 12
    },
    {
      readableId: "PKG-FOOD-POUCH-ECO",
      name: "Túi thực phẩm thân thiện môi trường",
      type: "Part",
      replenishment: "Buy",
      standardCost: 1700,
      unitSalePrice: 2600,
      leadTime: 28
    },
    {
      readableId: "PKG-CARE-BOTTLE-500",
      name: "Chai dầu gội 500 ml",
      type: "Part",
      replenishment: "Buy",
      trackingType: "Batch",
      standardCost: 3500,
      unitSalePrice: 5000,
      leadTime: 5
    }
  ],
  materials: [
    {
      readableId: "RM-SUGAR",
      name: "Đường tinh luyện",
      type: "Material",
      trackingType: "Batch",
      standardCost: 92.5,
      unitOfMeasureCode: "LB",
      leadTime: 28,
      material: {
        substance: "Đường thực phẩm",
        form: "Nguyên liệu bao",
        materialType: "Đường tinh luyện đóng bao",
        grade: "M19",
        finish: "C5 Chỉ tiêu an toàn thực phẩm Coating",
        dimension: "0.35mm x 200mm"
      }
    },
    {
      readableId: "RM-WATER",
      name: "Nước xử lý RO",
      type: "Material",
      trackingType: "Batch",
      standardCost: 320,
      unitOfMeasureCode: "LB",
      leadTime: 21,
      material: {
        substance: "Nguyên liệu lỏng",
        grade: "MW 35-C",
        finish: "Polyamide-Imide Overcoat"
      }
    },
    {
      readableId: "RM-TEA-EXTRACT",
      name: "Chiết xuất trà xanh",
      type: "Material",
      standardCost: 625,
      unitOfMeasureCode: "LB",
      leadTime: 21
    },
    {
      readableId: "RM-ACID-CITRIC",
      name: "Axit citric thực phẩm",
      type: "Material",
      standardCost: 4200,
      unitOfMeasureCode: "LT",
      leadTime: 14
    },
    {
      readableId: "PKG-CORRUGATED",
      name: "Giấy carton sóng",
      type: "Material",
      standardCost: 195,
      unitOfMeasureCode: "LB",
      leadTime: 10
    },
    {
      readableId: "RM-WHEAT-FLOUR",
      name: "Bột mì",
      type: "Material",
      standardCost: 135,
      unitOfMeasureCode: "LB",
      leadTime: 14
    },
    {
      readableId: "RM-CARE-SURFACTANT",
      name: "Chất hoạt động bề mặt SLES",
      type: "Material",
      replenishment: "Buy",
      trackingType: "Batch",
      standardCost: 32000,
      unitSalePrice: 48000,
      leadTime: 7
    },
    {
      readableId: "RM-CARE-FRAGRANCE",
      name: "Hương liệu dầu gội",
      type: "Material",
      replenishment: "Buy",
      trackingType: "Batch",
      standardCost: 180000,
      unitSalePrice: 260000,
      leadTime: 14
    }
  ],
  consumables: [
    {
      readableId: "CN-FOOD-SANITIZER",
      name: "Dung dịch vệ sinh dây chuyền thực phẩm",
      type: "Consumable",
      standardCost: 6400,
      leadTime: 14
    },
    {
      readableId: "CN-FOOD-LUBRICANT",
      name: "Dầu bôi trơn cấp thực phẩm",
      type: "Consumable",
      standardCost: 1900,
      unitOfMeasureCode: "LB"
    }
  ],
  tools: [
    {
      readableId: "TL-FILL-NOZZLE",
      name: "Bộ đầu chiết rót",
      type: "Tool",
      standardCost: 210000
    },
    {
      readableId: "TL-CHECK-WEIGHT",
      name: "Bộ chuẩn cân kiểm tra",
      type: "Tool",
      standardCost: 92500
    }
  ],
  services: [
    {
      readableId: "SVC-LAB-TEST",
      name: "Dịch vụ kiểm nghiệm sản phẩm",
      type: "Service",
      replenishment: "Buy",
      standardCost: 72500,
      leadTime: 21
    }
  ],
  makeParts: [
    {
      readableId: "FG-BEV-TEA-500",
      name: "Thùng trà xanh 500 ml - 24 chai",
      type: "Part",
      replenishment: "Make",
      trackingType: "Serial",
      standardCost: 133500,
      unitSalePrice: 242500
    },
    {
      readableId: "FG-FOOD-SNACK-12",
      name: "Thùng bánh snack 12 gói",
      type: "Part",
      replenishment: "Make",
      trackingType: "Serial",
      standardCost: 81000,
      unitSalePrice: 147500
    },
    {
      readableId: "WIP-BEV-TEA",
      name: "Bán thành phẩm trà xanh",
      type: "Part",
      replenishment: "Make",
      standardCost: 32450,
      unitSalePrice: 59000
    },
    {
      readableId: "WIP-FOOD-SNACK",
      name: "Bán thành phẩm bánh snack",
      type: "Part",
      replenishment: "Make",
      standardCost: 21450,
      unitSalePrice: 39000
    },
    {
      readableId: "WIP-BEV-FLAVOR",
      name: "Hỗn hợp hương trà",
      type: "Part",
      replenishment: "Make",
      standardCost: 39050,
      unitSalePrice: 71000
    },
    {
      readableId: "PKG-BEV-CASE",
      name: "Bộ bao bì thùng đồ uống",
      type: "Part",
      replenishment: "Make",
      standardCost: 17600,
      unitSalePrice: 32000
    },
    {
      readableId: "WIP-FOOD-DOUGH",
      name: "Bột bánh đã phối trộn",
      type: "Part",
      replenishment: "Make",
      standardCost: 5800,
      unitSalePrice: 10500
    },
    {
      readableId: "WIP-BEV-SYRUP",
      name: "Siro đường pha chế",
      type: "Part",
      replenishment: "Make",
      standardCost: 13200,
      unitSalePrice: 24000
    },
    {
      readableId: "WIP-BEV-EXTRACT",
      name: "Dịch chiết trà sơ cấp",
      type: "Part",
      replenishment: "Make",
      standardCost: 7150,
      unitSalePrice: 13000
    },
    {
      readableId: "WIP-BEV-AROMA",
      name: "Dung dịch hương trà sơ cấp",
      type: "Part",
      replenishment: "Make",
      standardCost: 5250,
      unitSalePrice: 9500
    },
    {
      readableId: "PKG-BEV-LABELSET",
      name: "Bộ nhãn đồ uống",
      type: "Part",
      replenishment: "Make",
      standardCost: 4537.5,
      unitSalePrice: 8250
    },
    {
      readableId: "WIP-CARE-SHAMPOO",
      name: "Bán thành phẩm dầu gội",
      type: "Part",
      replenishment: "Make",
      trackingType: "Batch",
      standardCost: 12000,
      unitSalePrice: 18000,
      leadTime: 2
    },
    {
      readableId: "FG-CARE-SHAMPOO-500",
      name: "Dầu gội 500 ml - thùng 12 chai",
      type: "Part",
      replenishment: "Make",
      trackingType: "Batch",
      standardCost: 240000,
      unitSalePrice: 360000,
      leadTime: 3
    }
  ],
  methods: [
    {
      readableId: "WIP-BEV-EXTRACT",
      bom: [
        {
          component: "RM-SUGAR",
          quantity: 18,
          order: 1
        }
      ],
      bop: [
        {
          process: "Trộn phối liệu",
          workCenter: "Máy phối trộn",
          description:
            "Trộn phối liệu: thực hiện theo quy trình chuẩn và ghi nhận kết quả cho WIP-BEV-EXTRACT.",
          order: 1,
          laborTime: 1.25
        },
        {
          process: "Kiểm tra trong quá trình",
          workCenter: "Trạm kiểm tra chất lượng",
          description:
            "Kiểm tra trong quá trình: thực hiện theo quy trình chuẩn và ghi nhận kết quả cho WIP-BEV-EXTRACT.",
          order: 2,
          laborTime: 0.5
        }
      ]
    },
    {
      readableId: "WIP-BEV-AROMA",
      bom: [
        {
          component: "RM-SUGAR",
          quantity: 11,
          order: 1
        }
      ],
      bop: [
        {
          process: "Trộn phối liệu",
          workCenter: "Máy phối trộn",
          description:
            "Trộn phối liệu: thực hiện theo quy trình chuẩn và ghi nhận kết quả cho WIP-BEV-AROMA.",
          order: 1,
          setupTime: 0.75,
          machineTime: 0.5,
          laborTime: 1
        },
        {
          process: "Kiểm tra trong quá trình",
          workCenter: "Trạm kiểm tra chất lượng",
          description:
            "Kiểm tra trong quá trình: thực hiện theo quy trình chuẩn và ghi nhận kết quả cho WIP-BEV-AROMA.",
          order: 2,
          laborTime: 0.5
        }
      ]
    },
    {
      readableId: "WIP-FOOD-DOUGH",
      bom: [
        {
          component: "RM-WHEAT-FLOUR",
          quantity: 9,
          order: 1
        }
      ],
      bop: [
        {
          process: "Chuẩn bị nguyên liệu",
          workCenter: "Khu chuẩn bị nguyên liệu",
          description:
            "Chuẩn bị nguyên liệu: thực hiện theo quy trình chuẩn và ghi nhận kết quả cho WIP-FOOD-DOUGH.",
          order: 1,
          setupTime: 0.5,
          machineTime: 1.25,
          laborTime: 1.5
        },
        {
          process: "Outside Processing",
          description:
            "Outside Processing: thực hiện theo quy trình chuẩn và ghi nhận kết quả cho WIP-FOOD-DOUGH.",
          order: 2,
          operationType: "Outside Processing",
          supplierProcess: "sp:Gia Công Thực Phẩm Demo:Outside Processing",
          operationLeadTime: 6,
          operationUnitCost: 2400,
          laborTime: 0,
          laborUnit: "Total Hours"
        },
        {
          process: "Kiểm tra trong quá trình",
          workCenter: "Trạm kiểm tra chất lượng",
          description:
            "Kiểm tra trong quá trình: thực hiện theo quy trình chuẩn và ghi nhận kết quả cho WIP-FOOD-DOUGH.",
          order: 3,
          laborTime: 0.5,
          operationType: "Inspection",
          inspectionPlan: "WIP-FOOD-DOUGH-JOURNAL"
        }
      ]
    },
    {
      readableId: "WIP-BEV-SYRUP",
      bom: [
        {
          component: "RM-WATER",
          quantity: 6.5,
          order: 1
        },
        {
          component: "RM-TEA-EXTRACT",
          quantity: 0.5,
          order: 2
        }
      ],
      bop: [
        {
          process: "Chiết rót",
          workCenter: "Dây chuyền chiết rót 1",
          description:
            "Chiết rót: thực hiện theo quy trình chuẩn và ghi nhận kết quả cho WIP-BEV-SYRUP.",
          order: 1,
          setupTime: 0.5,
          machineTime: 2,
          laborTime: 2.5
        },
        {
          process: "Kiểm tra trong quá trình",
          workCenter: "Trạm kiểm tra chất lượng",
          description:
            "Kiểm tra trong quá trình: thực hiện theo quy trình chuẩn và ghi nhận kết quả cho WIP-BEV-SYRUP.",
          order: 2,
          laborTime: 0.5
        }
      ]
    },
    {
      readableId: "WIP-BEV-TEA",
      bom: [
        {
          component: "WIP-BEV-EXTRACT",
          quantity: 1,
          order: 1
        },
        {
          component: "WIP-BEV-SYRUP",
          quantity: 1,
          order: 2
        },
        {
          component: "RM-TEA-EXTRACT",
          quantity: 0.25,
          order: 3
        },
        {
          component: "RM-ACID-CITRIC",
          quantity: 0.25,
          order: 4
        }
      ],
      bop: [
        {
          process: "Chiết rót",
          workCenter: "Dây chuyền chiết rót 1",
          description:
            "Chiết rót: thực hiện theo quy trình chuẩn và ghi nhận kết quả cho WIP-BEV-TEA.",
          order: 1,
          laborTime: 3,
          procedure: "procedure:Trà Chiết rót & Gia nhiệt"
        },
        {
          process: "Gia nhiệt",
          workCenter: "Thiết bị gia nhiệt",
          description:
            "Gia nhiệt: thực hiện theo quy trình chuẩn và ghi nhận kết quả cho WIP-BEV-TEA.",
          order: 2,
          laborTime: 6,
          laborUnit: "Total Hours"
        },
        {
          process: "Kiểm tra trong quá trình",
          workCenter: "Trạm kiểm tra chất lượng",
          description:
            "Kiểm tra trong quá trình: thực hiện theo quy trình chuẩn và ghi nhận kết quả cho WIP-BEV-TEA.",
          order: 3,
          laborTime: 1,
          procedure: "procedure:In-Process Trà Inspection"
        }
      ]
    },
    {
      readableId: "WIP-BEV-FLAVOR",
      bom: [
        {
          component: "WIP-BEV-AROMA",
          quantity: 1,
          order: 1
        },
        {
          component: "WIP-FOOD-DOUGH",
          quantity: 1,
          order: 2
        },
        {
          component: "RM-TEA-GREEN",
          quantity: 24,
          order: 3
        },
        {
          component: "CN-FOOD-SANITIZER",
          quantity: 0.125,
          order: 4
        }
      ],
      bop: [
        {
          process: "Đóng gói",
          workCenter: "Dây chuyền đóng gói",
          description:
            "Đóng gói: thực hiện theo quy trình chuẩn và ghi nhận kết quả cho WIP-BEV-FLAVOR.",
          order: 1,
          setupTime: 0.5,
          laborTime: 2.5,
          tools: [
            {
              tool: "TL-FILL-NOZZLE",
              quantity: 1
            }
          ],
          parameters: [
            {
              key: "Press-Fit Force",
              value: "Giới hạn theo SOP FMCG"
            },
            {
              key: "Epoxy Cure",
              value: "80 degC for 2 hours"
            }
          ]
        },
        {
          process: "Đồng hóa",
          workCenter: "Máy đồng hóa",
          description:
            "Đồng hóa: thực hiện theo quy trình chuẩn và ghi nhận kết quả cho WIP-BEV-FLAVOR.",
          order: 2,
          laborTime: 1,
          procedure: "procedure:Hương liệu Balance Verification",
          parameters: [
            {
              key: "Balance Grade",
              value: "ISO 21940 G2.5 at 3000 rpm"
            },
            {
              key: "Correction Method",
              value: "Material removal, drive-end plane first"
            }
          ]
        },
        {
          process: "Kiểm tra trong quá trình",
          workCenter: "Trạm kiểm tra chất lượng",
          description:
            "Kiểm tra trong quá trình: thực hiện theo quy trình chuẩn và ghi nhận kết quả cho WIP-BEV-FLAVOR.",
          order: 3,
          laborTime: 0.5
        }
      ]
    },
    {
      readableId: "PKG-BEV-CASE",
      bom: [
        {
          component: "PKG-CORRUGATED",
          quantity: 26,
          order: 1
        },
        {
          component: "PKG-FOOD-SEAL",
          quantity: 2,
          order: 2
        },
        {
          component: "PKG-BEV-PALLET",
          quantity: 8,
          order: 3
        }
      ],
      bop: [
        {
          process: "Chuẩn bị nguyên liệu",
          workCenter: "Khu chuẩn bị nguyên liệu",
          description:
            "Chuẩn bị nguyên liệu: thực hiện theo quy trình chuẩn và ghi nhận kết quả cho PKG-BEV-CASE.",
          order: 1,
          laborTime: 3
        },
        {
          process: "Outside Processing",
          description:
            "Outside Processing: thực hiện theo quy trình chuẩn và ghi nhận kết quả cho PKG-BEV-CASE.",
          order: 2,
          operationType: "Outside Processing",
          supplierProcess: "sp:Gia Công Thực Phẩm Demo:Outside Processing",
          operationLeadTime: 7,
          operationUnitCost: 4750,
          laborTime: 0,
          laborUnit: "Total Hours"
        },
        {
          process: "Kiểm tra trong quá trình",
          workCenter: "Trạm kiểm tra chất lượng",
          description:
            "Kiểm tra trong quá trình: thực hiện theo quy trình chuẩn và ghi nhận kết quả cho PKG-BEV-CASE.",
          order: 3,
          laborTime: 0.75
        }
      ]
    },
    {
      readableId: "PKG-BEV-LABELSET",
      bom: [
        {
          component: "PKG-FOOD-BOX",
          quantity: 1,
          order: 1
        },
        {
          component: "PKG-CORRUGATED",
          quantity: 2.5,
          order: 2
        },
        {
          component: "PKG-FOOD-CARTON",
          quantity: 6,
          order: 3
        }
      ],
      bop: [
        {
          process: "Chuẩn bị nguyên liệu",
          workCenter: "Khu chuẩn bị nguyên liệu",
          description:
            "Chuẩn bị nguyên liệu: thực hiện theo quy trình chuẩn và ghi nhận kết quả cho PKG-BEV-LABELSET.",
          order: 1,
          laborTime: 0.75
        },
        {
          process: "Đóng gói",
          workCenter: "Dây chuyền đóng gói",
          description:
            "Đóng gói: thực hiện theo quy trình chuẩn và ghi nhận kết quả cho PKG-BEV-LABELSET.",
          order: 2,
          laborTime: 0.5
        }
      ]
    },
    {
      readableId: "WIP-FOOD-SNACK",
      bom: [
        {
          component: "RM-SUGAR",
          quantity: 11,
          order: 1
        },
        {
          component: "RM-WATER",
          quantity: 4,
          order: 2
        },
        {
          component: "RM-TEA-EXTRACT",
          quantity: 0.375,
          order: 3
        },
        {
          component: "RM-ACID-CITRIC",
          quantity: 0.125,
          order: 4
        }
      ],
      bop: [
        {
          process: "Trộn phối liệu",
          workCenter: "Máy phối trộn",
          description:
            "Trộn phối liệu: thực hiện theo quy trình chuẩn và ghi nhận kết quả cho WIP-FOOD-SNACK.",
          order: 1,
          laborTime: 1
        },
        {
          process: "Chiết rót",
          workCenter: "Dây chuyền chiết rót 1",
          description:
            "Chiết rót: thực hiện theo quy trình chuẩn và ghi nhận kết quả cho WIP-FOOD-SNACK.",
          order: 2,
          laborTime: 2.5,
          procedure: "procedure:Trà Chiết rót & Gia nhiệt"
        },
        {
          process: "Gia nhiệt",
          workCenter: "Thiết bị gia nhiệt",
          description:
            "Gia nhiệt: thực hiện theo quy trình chuẩn và ghi nhận kết quả cho WIP-FOOD-SNACK.",
          order: 3,
          laborTime: 5,
          laborUnit: "Total Hours"
        },
        {
          process: "Kiểm tra trong quá trình",
          workCenter: "Trạm kiểm tra chất lượng",
          description:
            "Kiểm tra trong quá trình: thực hiện theo quy trình chuẩn và ghi nhận kết quả cho WIP-FOOD-SNACK.",
          order: 4,
          laborTime: 0.75,
          procedure: "procedure:In-Process Trà Inspection"
        }
      ]
    },
    {
      readableId: "FG-BEV-TEA-500",
      bom: [
        {
          component: "WIP-BEV-TEA",
          quantity: 1,
          order: 1
        },
        {
          component: "WIP-BEV-FLAVOR",
          quantity: 1,
          order: 2
        },
        {
          component: "PKG-BEV-CASE",
          quantity: 1,
          order: 3
        },
        {
          component: "PKG-BEV-LABELSET",
          quantity: 1,
          order: 4
        },
        {
          component: "PKG-BEV-PET-500",
          quantity: 2,
          order: 5
        },
        {
          component: "PKG-BEV-TRACE-LABEL",
          quantity: 1,
          order: 6
        },
        {
          component: "PKG-BEV-SHRINK",
          quantity: 1,
          order: 7
        },
        {
          component: "PKG-LOT-LABEL",
          quantity: 1,
          order: 8
        },
        {
          component: "CN-FOOD-LUBRICANT",
          quantity: 0.25,
          order: 9
        }
      ],
      bop: [
        {
          process: "Đóng gói",
          workCenter: "Dây chuyền đóng gói",
          description:
            "Đóng gói: thực hiện theo quy trình chuẩn và ghi nhận kết quả cho FG-BEV-TEA-500.",
          order: 1,
          laborTime: 4,
          operationType: "Assembly",
          procedure: "procedure:Đóng gói thành phẩm FMCG"
        },
        {
          process: "Kiểm nghiệm và xuất xưởng",
          workCenter: "Phòng kiểm nghiệm thành phẩm",
          description:
            "Kiểm nghiệm và xuất xưởng: thực hiện theo quy trình chuẩn và ghi nhận kết quả cho FG-BEV-TEA-500.",
          order: 2,
          laborTime: 3,
          procedure: "procedure:Kiểm nghiệm xuất xưởng FMCG"
        },
        {
          process: "Kiểm nghiệm và xuất xưởng",
          workCenter: "Trạm kiểm tra chất lượng",
          description:
            "Kiểm nghiệm và xuất xưởng: thực hiện theo quy trình chuẩn và ghi nhận kết quả cho FG-BEV-TEA-500.",
          order: 3,
          laborTime: 1
        }
      ]
    },
    {
      readableId: "FG-FOOD-SNACK-12",
      bom: [
        {
          component: "WIP-FOOD-SNACK",
          quantity: 1,
          order: 1
        },
        {
          component: "RM-FOOD-SEASONING",
          quantity: 18,
          order: 2
        },
        {
          component: "RM-WHEAT-FLOUR",
          quantity: 5,
          order: 3
        },
        {
          component: "PKG-FOOD-POUCH",
          quantity: 2,
          order: 4
        },
        {
          component: "PKG-FOOD-SEAL",
          quantity: 2,
          order: 5
        },
        {
          component: "PKG-FOOD-BOX",
          quantity: 1,
          order: 6
        },
        {
          component: "PKG-LOT-LABEL",
          quantity: 1,
          order: 7
        },
        {
          component: "PKG-FOOD-CARTON",
          quantity: 8,
          order: 8
        },
        {
          component: "CN-FOOD-LUBRICANT",
          quantity: 0.125,
          order: 9
        }
      ],
      bop: [
        {
          process: "Đóng gói",
          workCenter: "Dây chuyền đóng gói",
          description:
            "Đóng gói: thực hiện theo quy trình chuẩn và ghi nhận kết quả cho FG-FOOD-SNACK-12.",
          order: 1,
          laborTime: 3,
          operationType: "Assembly",
          procedure: "procedure:Đóng gói thành phẩm FMCG"
        },
        {
          process: "Kiểm nghiệm và xuất xưởng",
          workCenter: "Phòng kiểm nghiệm thành phẩm",
          description:
            "Kiểm nghiệm và xuất xưởng: thực hiện theo quy trình chuẩn và ghi nhận kết quả cho FG-FOOD-SNACK-12.",
          order: 2,
          laborTime: 2,
          procedure: "procedure:Kiểm nghiệm xuất xưởng FMCG"
        }
      ]
    },
    {
      readableId: "WIP-CARE-SHAMPOO",
      bom: [
        {
          component: "RM-CARE-SURFACTANT",
          quantity: 0.15,
          order: 1
        },
        {
          component: "RM-CARE-FRAGRANCE",
          quantity: 0.01,
          order: 2
        },
        {
          component: "RM-WATER",
          quantity: 0.34,
          order: 3
        }
      ],
      bop: [
        {
          process: "Trộn phối liệu",
          workCenter: "Máy phối trộn",
          description:
            "Trộn phối liệu: thực hiện theo quy trình chuẩn và ghi nhận kết quả cho WIP-CARE-SHAMPOO.",
          order: 1,
          laborTime: 0.5
        },
        {
          process: "Kiểm tra trong quá trình",
          workCenter: "Trạm kiểm tra chất lượng",
          description:
            "Kiểm tra trong quá trình: thực hiện theo quy trình chuẩn và ghi nhận kết quả cho WIP-CARE-SHAMPOO.",
          order: 2,
          laborTime: 0.1,
          operationType: "Inspection",
          inspectionPlan: "CARE-SHAMPOO-PH"
        }
      ]
    },
    {
      readableId: "FG-CARE-SHAMPOO-500",
      bom: [
        {
          component: "WIP-CARE-SHAMPOO",
          quantity: 12,
          order: 1
        },
        {
          component: "PKG-CARE-BOTTLE-500",
          quantity: 12,
          order: 2
        },
        {
          component: "PKG-LOT-LABEL",
          quantity: 12,
          order: 3
        },
        {
          component: "PKG-FOOD-CARTON",
          quantity: 1,
          order: 4
        }
      ],
      bop: [
        {
          process: "Chiết rót",
          workCenter: "Dây chuyền chiết rót 1",
          description:
            "Chiết rót: thực hiện theo quy trình chuẩn và ghi nhận kết quả cho FG-CARE-SHAMPOO-500.",
          order: 1,
          laborTime: 0.25
        },
        {
          process: "Đóng gói",
          workCenter: "Dây chuyền đóng gói",
          description:
            "Đóng gói: thực hiện theo quy trình chuẩn và ghi nhận kết quả cho FG-CARE-SHAMPOO-500.",
          order: 2,
          laborTime: 0.2,
          operationType: "Assembly"
        },
        {
          process: "Kiểm nghiệm và xuất xưởng",
          workCenter: "Phòng kiểm nghiệm thành phẩm",
          description:
            "Kiểm nghiệm và xuất xưởng: thực hiện theo quy trình chuẩn và ghi nhận kết quả cho FG-CARE-SHAMPOO-500.",
          order: 3,
          laborTime: 0.1
        }
      ]
    }
  ],
  supplierLinks: [
    {
      supplier: "Trà Nguyên Liệu Việt Demo",
      item: "RM-TEA-GREEN",
      price: 925,
      leadTime: 60
    },
    {
      supplier: "Trà Nguyên Liệu Việt Demo",
      item: "RM-FOOD-SEASONING",
      price: 710,
      leadTime: 60
    },
    {
      supplier: "Nước Và Chiết Xuất Việt Demo",
      item: "RM-WATER",
      price: 320,
      leadTime: 21
    },
    {
      supplier: "Nước Và Chiết Xuất Việt Demo",
      item: "RM-TEA-EXTRACT",
      price: 625,
      leadTime: 21
    },
    {
      supplier: "Nước Và Chiết Xuất Việt Demo",
      item: "RM-ACID-CITRIC",
      price: 4200,
      leadTime: 14
    },
    {
      supplier: "Nước Và Chiết Xuất Việt Demo",
      item: "PKG-FOOD-BOX",
      price: 445,
      leadTime: 14
    },
    {
      supplier: "Nước Và Chiết Xuất Việt Demo",
      item: "PKG-BEV-TRACE-LABEL",
      price: 4800,
      leadTime: 35
    },
    {
      supplier: "Đường Thực Phẩm Việt Demo",
      item: "RM-SUGAR",
      price: 92.5,
      leadTime: 28
    },
    {
      supplier: "Đường Thực Phẩm Việt Demo",
      item: "RM-WHEAT-FLOUR",
      price: 135,
      leadTime: 14
    },
    {
      supplier: "Đường Thực Phẩm Việt Demo",
      item: "PKG-CORRUGATED",
      price: 195,
      leadTime: 10
    },
    {
      supplier: "Bao Bì Thực Phẩm Việt Demo",
      item: "PKG-FOOD-POUCH",
      price: 620,
      leadTime: 21
    },
    {
      supplier: "Bao Bì Thực Phẩm Việt Demo",
      item: "PKG-BEV-PET-500",
      price: 1340,
      leadTime: 21
    },
    {
      supplier: "Bao Bì Thực Phẩm Việt Demo",
      item: "PKG-FOOD-SEAL",
      price: 180,
      leadTime: 14
    },
    {
      supplier: "Carton Việt Demo",
      item: "PKG-FOOD-CARTON",
      price: 21,
      leadTime: 10
    },
    {
      supplier: "Carton Việt Demo",
      item: "PKG-BEV-PALLET",
      price: 57.5,
      leadTime: 10
    },
    {
      supplier: "Bao Bì Thực Phẩm Việt Demo",
      item: "PKG-FOOD-POUCH-ECO",
      price: 1700,
      leadTime: 28
    }
  ],
  supersessions: [
    {
      predecessor: "PKG-FOOD-POUCH",
      successor: "PKG-FOOD-POUCH-ECO",
      mode: "Consume First",
      successorEffectivityOffset: -14
    }
  ],
  customerParts: [
    {
      item: "FG-BEV-TEA-500",
      customer: "Siêu thị An Việt Demo",
      customerPartId: "RDS-FG-BEV-TEA-500",
      customerRevision: "B"
    },
    {
      item: "FG-FOOD-SNACK-12",
      customer: "Nhà phân phối Miền Nam Demo",
      customerPartId: "CMW-SRV-4500"
    }
  ],
  priceOverrides: [
    {
      item: "FG-FOOD-SNACK-12",
      customer: "Nhà phân phối Miền Nam Demo",
      notes: "Blanket-order pricing for the CY conveyor retrofit program.",
      breaks: [
        {
          quantity: 10,
          overridePrice: 145000
        },
        {
          quantity: 50,
          overridePrice: 138000
        }
      ]
    }
  ],
  pricingRules: [
    {
      name: "An Việt OEM volume discount",
      ruleType: "Discount",
      amountType: "Percentage",
      amount: 5,
      customer: "Siêu thị An Việt Demo",
      minQuantity: 10,
      priority: 10
    },
    {
      name: "Chuỗi cửa hàng documentation markup",
      ruleType: "Markup",
      amountType: "Percentage",
      amount: 8,
      customerType: "Chuỗi cửa hàng",
      items: ["FG-FOOD-SNACK-12", "FG-BEV-TEA-500"],
      priority: 5
    },
    {
      name: "Distributor spares case break",
      ruleType: "Discount",
      amountType: "Percentage",
      amount: 6,
      customerType: "Đại lý",
      items: ["PKG-FOOD-POUCH", "PKG-BEV-PET-500", "PKG-BEV-SHRINK"],
      minQuantity: 20,
      priority: 1
    }
  ],
  configuration: {
    item: "FG-BEV-TEA-500",
    group: "Quy cách đóng gói FMCG",
    parameters: [
      {
        key: "fill_volume_ml",
        label: "Định lượng chiết rót (ml)",
        dataType: "numeric"
      },
      {
        key: "pack_format",
        label: "Kiểu bao bì",
        dataType: "list",
        listOptions: ["PET", "GLASS", "POUCH"]
      },
      {
        key: "premium_label",
        label: "Nhãn cao cấp",
        dataType: "boolean"
      }
    ],
    rules: [
      {
        target: {
          operation: 1
        },
        field: "laborTime",
        code: "return params.premium_label ? 5 : 4;"
      },
      {
        target: {
          operation: 2
        },
        field: "laborTime",
        code: "return params.fill_volume_ml > 80 ? 3.5 : 3;"
      }
    ]
  },
  revisionLadder: [
    {
      item: "PKG-BEV-CASE",
      obsoleteRevision: "A",
      nextRevision: "B",
      nextStatus: "Prototype"
    }
  ],
  inspectionPlans: [
    {
      key: "WIP-FOOD-DOUGH-JOURNAL",
      item: "WIP-FOOD-DOUGH",
      drawingNumber: "FMCG-BEV-500-SH Rev E",
      aql: 1,
      features: [
        {
          label: "1",
          description: "Drive-end bao bì khối lượng bán thành phẩm",
          nominalValue: "40.010",
          tolerancePlus: "0.008",
          toleranceMinus: "0.008",
          unit: "mm"
        },
        {
          label: "2",
          description: "Journal độ lệch khối lượng, drive end to non-drive end",
          nominalValue: "0.008",
          tolerancePlus: "0.007",
          toleranceMinus: "0.008",
          unit: "mm"
        }
      ]
    },
    {
      key: "CARE-SHAMPOO-PH",
      item: "WIP-CARE-SHAMPOO",
      drawingNumber: "QC-CARE-PH-001",
      aql: 1,
      features: [
        {
          label: "1",
          description: "pH dầu gội ở nhiệt độ phòng",
          nominalValue: "6.0",
          tolerancePlus: "0.5",
          toleranceMinus: "0.5",
          unit: "pH"
        }
      ]
    }
  ],
  enforcementRules: [
    {
      family: "sales",
      name: "Đồ uống sản phẩm FMCG — US and Canada ship-to only",
      description: "QC-FMCG review pending for the dòng đồ uống drive.",
      message:
        "The FG-BEV-TEA-500 is cleared for US and Canadian customers only. Route export requests through Trade Compliance.",
      severity: "error",
      surfaces: ["salesOrderLine", "salesInvoiceLine"],
      match: "all",
      conditions: [
        {
          field: "customer.location.countryCode",
          op: "in",
          value: ["US", "CA"]
        }
      ],
      items: ["FG-BEV-TEA-500"]
    },
    {
      family: "sales",
      name: "Distributors order the 4500 by the pallet",
      message:
        "Đại lý partners order the FG-FOOD-SNACK-12 in pallet quantities (4 or more).",
      severity: "warn",
      surfaces: ["quoteLine", "salesOrderLine"],
      match: "any",
      conditions: [
        {
          field: "customer.customerTypeId",
          op: "notIn",
          value: {
            customerTypes: ["Đại lý"]
          }
        },
        {
          field: "transaction.quantity",
          op: "gt",
          value: 3
        }
      ],
      items: ["FG-FOOD-SNACK-12"]
    },
    {
      family: "storage",
      targetType: "item",
      name: "Nguyên liệu trà in the cabinet",
      message:
        "Sintered NdFeB nguyên liệu tràs are stored in the shielded cabinet, never on open shelving.",
      severity: "warn",
      surfaces: ["place"],
      match: "all",
      conditions: [
        {
          field: "storageUnit.storageTypeId",
          op: "eq",
          value: {
            storageType: "Cabinet"
          }
        }
      ],
      items: ["RM-TEA-GREEN", "RM-FOOD-SEASONING"]
    },
    {
      family: "storage",
      targetType: "item",
      name: "Tem truy xuấts stay at the plant",
      message:
        "Tem truy xuấts are kitted at the Bình Dương plant only — pick a plant bin.",
      severity: "warn",
      surfaces: ["receipt", "stockTransfer"],
      match: "all",
      conditions: [
        {
          field: "storageUnit.locationId",
          op: "eq",
          value: {
            location: "Plant"
          }
        }
      ],
      items: ["PKG-BEV-TRACE-LABEL"]
    },
    {
      family: "storage",
      targetType: "workCenter",
      name: "Gia nhiệt oven in service",
      message:
        "The gia nhiệt oven is out of service — hold the cure until maintenance releases it.",
      severity: "error",
      surfaces: ["operationStart"],
      match: "all",
      conditions: [
        {
          field: "workCenter.active",
          op: "eq",
          value: true
        }
      ],
      workCenters: ["Thiết bị gia nhiệt"]
    }
  ],
  batchProperties: [
    {
      item: "RM-TEA-GREEN",
      label: "Truy xuất nguyên liệu lot",
      dataType: "text"
    },
    {
      item: "RM-TEA-GREEN",
      label: "Cấp chất lượng nguyên liệu",
      dataType: "list",
      listOptions: ["SH", "UH"]
    },
    {
      item: "RM-FOOD-SEASONING",
      label: "Truy xuất nguyên liệu lot",
      dataType: "text"
    },
    {
      item: "RM-SUGAR",
      label: "Số lô đường",
      dataType: "text"
    },
    {
      item: "RM-SUGAR",
      label: "Độ ẩm nguyên liệu (%)",
      dataType: "numeric"
    },
    {
      item: "RM-WATER",
      label: "Lô number",
      dataType: "text"
    },
    {
      item: "RM-WATER",
      label: "Cấp chất lượng nước",
      dataType: "list",
      listOptions: ["H", "N"]
    },
    {
      item: "WIP-CARE-SHAMPOO",
      label: "Lô nguyên liệu / thành phẩm",
      dataType: "text"
    },
    {
      item: "FG-CARE-SHAMPOO-500",
      label: "Lô nguyên liệu / thành phẩm",
      dataType: "text"
    },
    {
      item: "PKG-CARE-BOTTLE-500",
      label: "Lô nguyên liệu / thành phẩm",
      dataType: "text"
    },
    {
      item: "RM-CARE-SURFACTANT",
      label: "Lô nguyên liệu / thành phẩm",
      dataType: "text"
    },
    {
      item: "RM-CARE-FRAGRANCE",
      label: "Lô nguyên liệu / thành phẩm",
      dataType: "text"
    }
  ]
};
