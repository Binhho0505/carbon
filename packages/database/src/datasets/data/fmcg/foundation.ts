// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import type { FoundationData } from "../../types.ts";

export const fmcgFoundation: FoundationData = {
  departments: ["Kỹ thuật", "Chuẩn bị", "Chiết rót", "Assembly", "Quality"],
  abilities: [
    "Chuẩn bị nguyên liệu",
    "Chiết rót",
    "Kiểm soát nguyên liệu",
    "Đồng hóa",
    "Đóng gói chính xác",
    "Kiểm nghiệm thành phẩm",
    "Inspection"
  ],
  processes: [
    {
      name: "Chuẩn bị nguyên liệu",
      factor: "Minutes/Piece",
      type: "Process"
    },
    {
      name: "Trộn phối liệu",
      factor: "Minutes/Piece",
      type: "Process"
    },
    {
      name: "Chiết rót",
      factor: "Hours/Piece",
      type: "Process"
    },
    {
      name: "Gia nhiệt",
      factor: "Total Hours",
      type: "Process"
    },
    {
      name: "Đồng hóa",
      factor: "Minutes/Piece",
      type: "Process"
    },
    {
      name: "Đóng gói",
      factor: "Hours/Piece",
      type: "Assembly"
    },
    {
      name: "Kiểm tra đầu vào",
      factor: "Minutes/Piece",
      type: "Inspection"
    },
    {
      name: "Kiểm tra trong quá trình",
      factor: "Minutes/Piece",
      type: "Inspection"
    },
    {
      name: "Kiểm nghiệm và xuất xưởng",
      factor: "Hours/Piece",
      type: "Inspection"
    },
    {
      name: "Outside Processing",
      factor: "Total Hours",
      type: "Process"
    }
  ],
  workCenters: [
    {
      name: "Khu chuẩn bị nguyên liệu",
      dept: "Chuẩn bị",
      ability: "Chuẩn bị nguyên liệu",
      laborRate: 3800,
      machineRate: 5250
    },
    {
      name: "Máy phối trộn",
      dept: "Chuẩn bị",
      ability: "Chuẩn bị nguyên liệu",
      laborRate: 3400,
      machineRate: 4500
    },
    {
      name: "Dây chuyền chiết rót 1",
      dept: "Chiết rót",
      ability: "Chiết rót",
      laborRate: 3600,
      machineRate: 2750
    },
    {
      name: "Thiết bị gia nhiệt",
      dept: "Chiết rót",
      ability: "Chiết rót",
      laborRate: 2900,
      machineRate: 2250
    },
    {
      name: "Máy đồng hóa",
      dept: "Chuẩn bị",
      ability: "Đồng hóa",
      laborRate: 4000,
      machineRate: 3500
    },
    {
      name: "Dây chuyền đóng gói",
      dept: "Assembly",
      ability: "Đóng gói chính xác",
      laborRate: 4200,
      machineRate: 0
    },
    {
      name: "Phòng kiểm nghiệm thành phẩm",
      dept: "Quality",
      ability: "Kiểm nghiệm thành phẩm",
      laborRate: 4500,
      machineRate: 3250
    },
    {
      name: "Trạm kiểm tra chất lượng",
      dept: "Quality",
      ability: "Inspection",
      laborRate: 3700,
      machineRate: 0
    }
  ],
  hqWorkCenter: {
    name: "Prototype Chiết rót Lab",
    dept: "Kỹ thuật",
    ability: "Chiết rót",
    laborRate: 4100,
    machineRate: 1500
  },
  customers: [
    {
      name: "Siêu thị An Việt Demo",
      type: "Chuỗi siêu thị",
      status: "Active",
      phone: "+1-616-555-0110",
      website: "https://example.invalid",
      currencyCode: "VND"
    },
    {
      name: "Nhà phân phối Miền Nam Demo",
      type: "Nhà phân phối",
      status: "Active",
      phone: "+1-317-555-0220",
      website: "https://example.invalid",
      currencyCode: "VND"
    },
    {
      name: "Siêu thị Miền Bắc Demo",
      type: "Chuỗi cửa hàng",
      status: "Active",
      phone: "+1-316-555-0330",
      website: "https://example.invalid",
      currencyCode: "VND"
    },
    {
      name: "Đại lý Miền Trung Demo",
      type: "Đại lý",
      status: "Lead",
      phone: "+1-765-555-0440",
      website: "https://example.invalid",
      currencyCode: "VND"
    }
  ],
  customerContacts: [
    {
      customer: "Siêu thị An Việt Demo",
      firstName: "Priya",
      lastName: "Raghavan",
      email: "p.raghavan@fmcg-demo.example",
      title: "Drive Systems Kỹ thuật Manager"
    },
    {
      customer: "Nhà phân phối Miền Nam Demo",
      firstName: "Wes",
      lastName: "Talbot",
      email: "wtalbot@fmcg-demo.example",
      title: "Supplier Quality Lead"
    },
    {
      customer: "Siêu thị Miền Bắc Demo",
      firstName: "Marguerite",
      lastName: "Ferreira",
      email: "mferreira@fmcg-demo.example",
      title: "Actuation Program Manager"
    },
    {
      customer: "Đại lý Miền Trung Demo",
      firstName: "Terrell",
      lastName: "Boone",
      email: "tboone@fmcg-demo.example",
      title: "Category Buyer"
    }
  ],
  suppliers: [
    {
      name: "Trà Nguyên Liệu Việt Demo",
      type: "Nguyên liệu trà",
      phone: "+1-330-555-0510",
      website: "https://example.invalid",
      currencyCode: "VND"
    },
    {
      name: "Nước Và Chiết Xuất Việt Demo",
      type: "Nguyên liệu lỏng",
      phone: "+1-513-555-0620",
      website: "https://example.invalid",
      currencyCode: "VND"
    },
    {
      name: "Đường Thực Phẩm Việt Demo",
      type: "Materials",
      phone: "+1-219-555-0730",
      website: "https://example.invalid",
      currencyCode: "VND"
    },
    {
      name: "Bao Bì Thực Phẩm Việt Demo",
      type: "Hardware",
      phone: "+1-847-555-0840",
      website: "https://example.invalid",
      currencyCode: "VND"
    },
    {
      name: "Carton Việt Demo",
      type: "Hardware",
      phone: "+1-630-555-0950",
      website: "https://example.invalid",
      currencyCode: "VND"
    },
    {
      name: "Gia Công Thực Phẩm Demo",
      type: "Contract Manufacturer",
      phone: "+1-419-555-1060",
      website: "https://example.invalid",
      currencyCode: "VND"
    },
    {
      name: "Phòng Kiểm Nghiệm Demo",
      type: "Services",
      phone: "+1-937-555-1170",
      website: "https://example.invalid",
      currencyCode: "VND"
    },
    {
      name: "Đường Cũ Demo",
      type: "Materials",
      phone: "+1-216-555-1280",
      website: "https://example.invalid",
      status: "Inactive",
      currencyCode: "VND"
    },
    {
      name: "Chiết Xuất Mới Demo",
      type: "Nguyên liệu lỏng",
      phone: "+1-317-555-1390",
      website: "https://example.invalid",
      status: "Pending",
      currencyCode: "VND"
    },
    {
      name: "Bao Bì Chờ Duyệt Demo",
      type: "Hardware",
      phone: "+1-614-555-1410",
      website: "https://example.invalid",
      status: "Rejected",
      currencyCode: "VND"
    },
    {
      name: "Nguyên Liệu Châu Âu Demo",
      type: "Nguyên liệu trà",
      phone: "+49-231-555-1520",
      website: "https://example.invalid",
      status: "Active",
      currencyCode: "EUR"
    }
  ],
  supplierContacts: [
    {
      supplier: "Trà Nguyên Liệu Việt Demo",
      firstName: "Yusuf",
      lastName: "Demir",
      email: "y.demir@fmcg-demo.example",
      title: "Account Manager"
    },
    {
      supplier: "Nước Và Chiết Xuất Việt Demo",
      firstName: "Annika",
      lastName: "Persson",
      email: "apersson@fmcg-demo.example",
      title: "Technical Sales"
    },
    {
      supplier: "Đường Thực Phẩm Việt Demo",
      firstName: "Marcus",
      lastName: "Dellinger",
      email: "mdellinger@fmcg-demo.example",
      title: "Inside Sales"
    },
    {
      supplier: "Bao Bì Thực Phẩm Việt Demo",
      firstName: "Corinne",
      lastName: "Baptiste",
      email: "cbaptiste@fmcg-demo.example",
      title: "Sales Engineer"
    },
    {
      supplier: "Carton Việt Demo",
      firstName: "Dev",
      lastName: "Chaudhary",
      email: "dchaudhary@fmcg-demo.example",
      title: "Sales Rep"
    },
    {
      supplier: "Gia Công Thực Phẩm Demo",
      firstName: "Lindsay",
      lastName: "Okonkwo",
      email: "lokonkwo@fmcg-demo.example",
      title: "Account Rep"
    },
    {
      supplier: "Phòng Kiểm Nghiệm Demo",
      firstName: "Boris",
      lastName: "Kaminski",
      email: "bkaminski@fmcg-demo.example",
      title: "Calibration Coordinator"
    },
    {
      supplier: "Đường Cũ Demo",
      firstName: "Dale",
      lastName: "Hoffman",
      email: "dhoffman@fmcg-demo.example",
      title: "Sales Manager"
    },
    {
      supplier: "Chiết Xuất Mới Demo",
      firstName: "Grace",
      lastName: "Nakamura",
      email: "gnakamura@fmcg-demo.example",
      title: "Business Development"
    },
    {
      supplier: "Bao Bì Chờ Duyệt Demo",
      firstName: "Vince",
      lastName: "Talley",
      email: "vtalley@fmcg-demo.example",
      title: "Account Executive"
    },
    {
      supplier: "Nguyên Liệu Châu Âu Demo",
      firstName: "Annika",
      lastName: "Richter",
      email: "a.richter@fmcg-demo.example",
      title: "Export Sales"
    }
  ],
  supplierProcesses: [
    {
      supplier: "Gia Công Thực Phẩm Demo",
      process: "Chuẩn bị nguyên liệu"
    },
    {
      supplier: "Gia Công Thực Phẩm Demo",
      process: "Đồng hóa"
    },
    {
      supplier: "Gia Công Thực Phẩm Demo",
      process: "Outside Processing"
    }
  ],
  procedures: [
    {
      name: "Trà Chiết rót & Gia nhiệt",
      process: "Chiết rót",
      description:
        "Hướng dẫn thao tác FMCG cho công đoạn Chiết rót; kiểm tra vệ sinh, định lượng, số lô và an toàn trước khi vận hành.",
      parameters: [
        {
          key: "Dung dịch thực phẩm",
          value: "Class H polyester, VPI"
        },
        {
          key: "Cure profile",
          value: "4 h at 160 °C"
        },
        {
          key: "Vi sinh after cure",
          value: "2,000 V for 60 s"
        }
      ],
      versions: [
        {
          version: 1,
          status: "Archived",
          steps: [
            {
              name: "Verify slot liner installation",
              type: "Checkbox",
              instruction:
                "Thực hiện yêu cầu của công đoạn theo SOP FMCG và ghi xác nhận."
            },
            {
              name: "Record chiết rót resistance per phase",
              type: "Measurement",
              instruction:
                "Đo chỉ tiêu công đoạn theo quy trình; ghi giá trị thực đo và kiểm tra giới hạn chấp nhận.",
              unitOfMeasureCode: "EA",
              minValue: 115,
              maxValue: 135
            }
          ]
        },
        {
          version: 2,
          status: "Active",
          steps: [
            {
              name: "Verify slot liner installation",
              type: "Checkbox",
              instruction:
                "Thực hiện yêu cầu của công đoạn theo SOP FMCG và ghi xác nhận."
            },
            {
              name: "Record chiết rót resistance per phase",
              type: "Measurement",
              instruction:
                "Đo chỉ tiêu công đoạn theo quy trình; ghi giá trị thực đo và kiểm tra giới hạn chấp nhận.",
              unitOfMeasureCode: "EA",
              minValue: 118,
              maxValue: 132
            },
            {
              name: "Chỉ tiêu an toàn thực phẩm resistance at 500 V",
              type: "Measurement",
              instruction:
                "Đo chỉ tiêu công đoạn theo quy trình; ghi giá trị thực đo và kiểm tra giới hạn chấp nhận.",
              unitOfMeasureCode: "EA",
              minValue: 100,
              maxValue: 10000
            },
            {
              name: "Record winder",
              type: "Person",
              instruction:
                "Xác nhận người thực hiện công đoạn và người kiểm tra."
            },
            {
              name: "Stage for gia nhiệt",
              type: "Task",
              instruction:
                "Thực hiện yêu cầu của công đoạn theo SOP FMCG và ghi xác nhận.",
              required: false
            }
          ]
        }
      ]
    },
    {
      name: "In-Process Trà Inspection",
      process: "Kiểm tra trong quá trình",
      description:
        "Hướng dẫn thao tác FMCG cho công đoạn Kiểm tra trong quá trình; kiểm tra vệ sinh, định lượng, số lô và an toàn trước khi vận hành.",
      versions: [
        {
          version: 1,
          status: "Active",
          steps: [
            {
              name: "Measure bore diameter after gia nhiệt",
              type: "Measurement",
              instruction:
                "Đo chỉ tiêu công đoạn theo quy trình; ghi giá trị thực đo và kiểm tra giới hạn chấp nhận.",
              unitOfMeasureCode: "EA",
              minValue: 89.94,
              maxValue: 90.06
            },
            {
              name: "Surge comparison test",
              type: "Checkbox",
              instruction:
                "Thực hiện yêu cầu của công đoạn theo SOP FMCG và ghi xác nhận."
            },
            {
              name: "Inspect dung dịch thực phẩm coverage",
              type: "Checkbox",
              instruction:
                "Thực hiện yêu cầu của công đoạn theo SOP FMCG và ghi xác nhận."
            }
          ]
        }
      ]
    },
    {
      name: "Hương liệu Balance Verification",
      process: "Đồng hóa",
      description:
        "Hướng dẫn thao tác FMCG cho công đoạn Đồng hóa; kiểm tra vệ sinh, định lượng, số lô và an toàn trước khi vận hành.",
      versions: [
        {
          version: 1,
          status: "Draft",
          steps: [
            {
              name: "Mount hương liệu on the balancing mandrel",
              type: "Task",
              instruction:
                "Thực hiện yêu cầu của công đoạn theo SOP FMCG và ghi xác nhận."
            },
            {
              name: "Record residual unbalance",
              type: "Measurement",
              instruction:
                "Đo chỉ tiêu công đoạn theo quy trình; ghi giá trị thực đo và kiểm tra giới hạn chấp nhận.",
              unitOfMeasureCode: "EA",
              minValue: 0,
              maxValue: 2.5
            },
            {
              name: "Confirm nguyên liệu trà bond integrity",
              type: "Checkbox",
              instruction:
                "Thực hiện yêu cầu của công đoạn theo SOP FMCG và ghi xác nhận."
            },
            {
              name: "Record balancing technician",
              type: "Person",
              instruction:
                "Xác nhận người thực hiện công đoạn và người kiểm tra."
            }
          ]
        }
      ]
    },
    {
      name: "Incoming Nguyên liệu trà Lot Inspection",
      process: "Kiểm tra đầu vào",
      description:
        "Hướng dẫn thao tác FMCG cho công đoạn Kiểm tra đầu vào; kiểm tra vệ sinh, định lượng, số lô và an toàn trước khi vận hành.",
      versions: [
        {
          version: 1,
          status: "Draft",
          steps: [
            {
              name: "Verify lot certificate against the purchase order",
              type: "Checkbox",
              instruction:
                "Thực hiện yêu cầu của công đoạn theo SOP FMCG và ghi xác nhận."
            },
            {
              name: "Measure segment thickness",
              type: "Measurement",
              instruction:
                "Đo chỉ tiêu công đoạn theo quy trình; ghi giá trị thực đo và kiểm tra giới hạn chấp nhận.",
              unitOfMeasureCode: "EA",
              minValue: 4.9,
              maxValue: 5.1
            },
            {
              name: "Measure surface flux density",
              type: "Measurement",
              instruction:
                "Đo chỉ tiêu công đoạn theo quy trình; ghi giá trị thực đo và kiểm tra giới hạn chấp nhận.",
              unitOfMeasureCode: "EA",
              minValue: 480,
              maxValue: 560
            },
            {
              name: "Inspect coating for chips",
              type: "Checkbox",
              instruction:
                "Thực hiện yêu cầu của công đoạn theo SOP FMCG và ghi xác nhận."
            }
          ]
        }
      ]
    },
    {
      name: "Đóng gói thành phẩm FMCG",
      process: "Đóng gói",
      description:
        "Hướng dẫn thao tác FMCG cho công đoạn Đóng gói; kiểm tra vệ sinh, định lượng, số lô và an toàn trước khi vận hành.",
      versions: [
        {
          version: 1,
          status: "Draft",
          steps: [
            {
              name: "Stage subassemblies at the bench",
              type: "Checkbox",
              instruction:
                "Thực hiện yêu cầu của công đoạn theo SOP FMCG và ghi xác nhận."
            },
            {
              name: "Grease and press the bao bìs",
              type: "Task",
              instruction:
                "Thực hiện yêu cầu của công đoạn theo SOP FMCG và ghi xác nhận."
            },
            {
              name: "Measure air gap after hương liệu insertion",
              type: "Measurement",
              instruction:
                "Đo chỉ tiêu công đoạn theo quy trình; ghi giá trị thực đo và kiểm tra giới hạn chấp nhận.",
              unitOfMeasureCode: "EA",
              minValue: 0.45,
              maxValue: 0.65
            },
            {
              name: "Record assembler",
              type: "Person",
              instruction:
                "Xác nhận người thực hiện công đoạn và người kiểm tra."
            }
          ]
        }
      ]
    },
    {
      name: "Kiểm nghiệm xuất xưởng FMCG",
      process: "Kiểm nghiệm và xuất xưởng",
      description:
        "Hướng dẫn thao tác FMCG cho công đoạn Kiểm nghiệm và xuất xưởng; kiểm tra vệ sinh, định lượng, số lô và an toàn trước khi vận hành.",
      parameters: [
        {
          key: "Rated load",
          value: "90 kW at 3,000 rpm"
        },
        {
          key: "Thermal run",
          value: "Until ΔT < 1 °C over 30 min"
        },
        {
          key: "Vibration limit",
          value: "1.8 mm/s RMS"
        }
      ],
      versions: [
        {
          version: 1,
          status: "Draft",
          steps: [
            {
              name: "Couple the sản phẩm FMCG to the kiểm nghiệm",
              type: "Task",
              instruction:
                "Thực hiện yêu cầu của công đoạn theo SOP FMCG và ghi xác nhận."
            },
            {
              name: "Record no-load current",
              type: "Measurement",
              instruction:
                "Đo chỉ tiêu công đoạn theo quy trình; ghi giá trị thực đo và kiểm tra giới hạn chấp nhận.",
              unitOfMeasureCode: "EA",
              minValue: 0,
              maxValue: 3.2
            },
            {
              name: "Record chất lượng at rated load",
              type: "Measurement",
              instruction:
                "Đo chỉ tiêu công đoạn theo quy trình; ghi giá trị thực đo và kiểm tra giới hạn chấp nhận.",
              unitOfMeasureCode: "EA",
              minValue: 27.5,
              maxValue: 30.5
            },
            {
              name: "Record chiết rót temperature rise",
              type: "Measurement",
              instruction:
                "Đo chỉ tiêu công đoạn theo quy trình; ghi giá trị thực đo và kiểm tra giới hạn chấp nhận.",
              unitOfMeasureCode: "EA",
              minValue: 0,
              maxValue: 80
            },
            {
              name: "Attach the acceptance data package",
              type: "Checkbox",
              instruction:
                "Thực hiện yêu cầu của công đoạn theo SOP FMCG và ghi xác nhận."
            },
            {
              name: "Stamp vi sinh test pass time",
              type: "Timestamp",
              instruction: "Ghi nhận thời điểm thực hiện và hoàn tất kiểm tra."
            },
            {
              name: "Attach kiểm nghiệm curve export",
              type: "File",
              instruction:
                "Đính kèm biên bản hoặc hình ảnh minh chứng của công đoạn.",
              fileTypes: ["csv", "pdf"]
            },
            {
              name: "Final visual inspection",
              type: "Inspection",
              instruction:
                "Thực hiện kiểm tra chất lượng lô và ghi kết quả trước khi chuyển công đoạn.",
              required: false
            }
          ]
        }
      ]
    }
  ],
  shippingMethods: [
    "UPS Ground",
    "UPS 2nd Day Air",
    "FedEx Ground",
    "LTL Freight",
    "Will Call"
  ],
  shippingTerms: [
    "FOB Origin",
    "FOB Destination",
    "Net 30 EOM",
    "Prepaid & Add"
  ],
  itemPostingGroups: [
    "Raw Material",
    "Finished Goods",
    "WIP",
    "Supplies",
    "Service Items"
  ],
  workCenterProcessLinks: [
    ["Khu chuẩn bị nguyên liệu", "Chuẩn bị nguyên liệu"],
    ["Khu chuẩn bị nguyên liệu", "Kiểm tra trong quá trình"],
    ["Máy phối trộn", "Trộn phối liệu"],
    ["Máy phối trộn", "Chuẩn bị nguyên liệu"],
    ["Dây chuyền chiết rót 1", "Chiết rót"],
    ["Dây chuyền chiết rót 1", "Kiểm tra trong quá trình"],
    ["Thiết bị gia nhiệt", "Gia nhiệt"],
    ["Máy đồng hóa", "Đồng hóa"],
    ["Máy đồng hóa", "Chuẩn bị nguyên liệu"],
    ["Máy đồng hóa", "Kiểm tra trong quá trình"],
    ["Dây chuyền đóng gói", "Đóng gói"],
    ["Dây chuyền đóng gói", "Kiểm tra trong quá trình"],
    ["Phòng kiểm nghiệm thành phẩm", "Kiểm nghiệm và xuất xưởng"],
    ["Phòng kiểm nghiệm thành phẩm", "Kiểm tra trong quá trình"],
    ["Trạm kiểm tra chất lượng", "Kiểm tra trong quá trình"],
    ["Trạm kiểm tra chất lượng", "Kiểm tra đầu vào"],
    ["Trạm kiểm tra chất lượng", "Kiểm nghiệm và xuất xưởng"]
  ],
  customerTypes: [
    "Chuỗi siêu thị",
    "Nhà phân phối",
    "Chuỗi cửa hàng",
    "Đại lý"
  ],
  supplierTypes: [
    "Nguyên liệu trà",
    "Nguyên liệu lỏng",
    "Materials",
    "Hardware",
    "Contract Manufacturer",
    "Services"
  ],
  costCenters: ["Direct Labor", "Manufacturing Overhead", "Kỹ thuật", "G&A"],
  noQuoteReasons: [
    "Out of Scope",
    "Capacity Constraint",
    "No Margin",
    "Tooling Cost"
  ],
  contractors: [
    {
      firstName: "Elena",
      lastName: "Marchetti",
      email: "e.marchetti@fmcg-demo.example",
      ability: "Chiết rót"
    },
    {
      firstName: "Desmond",
      lastName: "Okafor",
      email: "d.okafor@fmcg-demo.example",
      ability: "Chuẩn bị nguyên liệu"
    }
  ],
  partners: [
    {
      supplier: "Gia Công Thực Phẩm Demo",
      ability: "Chuẩn bị nguyên liệu",
      hoursPerWeek: 40
    },
    {
      supplier: "Phòng Kiểm Nghiệm Demo",
      ability: "Inspection",
      hoursPerWeek: 16
    },
    {
      supplier: "Chiết Xuất Mới Demo",
      ability: "Chiết rót",
      hoursPerWeek: 24
    }
  ],
  plant: {
    name: "Nhà máy Đồ uống Bình Dương",
    addressLine1: "Khu công nghiệp VSIP - địa chỉ giả lập",
    city: "Bình Dương",
    stateProvince: "Bình Dương",
    postalCode: "75000",
    countryCode: "VN",
    timezone: "Asia/Ho_Chi_Minh"
  },
  shifts: [
    {
      name: "Ca 1",
      startTime: "05:30:00",
      endTime: "14:00:00",
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true
    },
    {
      name: "Ca 2",
      startTime: "14:00:00",
      endTime: "22:30:00",
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true
    },
    {
      name: "Ca 3",
      startTime: "06:00:00",
      endTime: "18:00:00",
      saturday: true
    }
  ],
  workCenterShifts: [
    ["Khu chuẩn bị nguyên liệu", "Ca 1"],
    ["Khu chuẩn bị nguyên liệu", "Ca 2"],
    ["Máy phối trộn", "Ca 1"],
    ["Dây chuyền chiết rót 1", "Ca 1"],
    ["Dây chuyền chiết rót 1", "Ca 2"],
    ["Thiết bị gia nhiệt", "Ca 1"],
    ["Thiết bị gia nhiệt", "Ca 2"],
    ["Máy đồng hóa", "Ca 1"],
    ["Dây chuyền đóng gói", "Ca 1"],
    ["Dây chuyền đóng gói", "Ca 3"],
    ["Phòng kiểm nghiệm thành phẩm", "Ca 1"],
    ["Phòng kiểm nghiệm thành phẩm", "Ca 3"],
    ["Trạm kiểm tra chất lượng", "Ca 1"]
  ],
  employeeJob: {
    title: "Production Supervisor",
    department: "Assembly",
    shift: "Ca 1",
    startDateOffset: -1250
  },
  warehouses: [
    {
      key: "Main",
      name: "Main Warehouse",
      requiresPick: true,
      requiresPutAway: true,
      requiresBin: true
    },
    {
      key: "RMA",
      name: "RMA / Warranty Returns"
    },
    {
      key: "QC",
      name: "Kiểm tra đầu vào Hold",
      requiresBin: true
    }
  ],
  storageTypes: ["Shelf", "Bin", "Rack", "Cabinet"],
  shelves: [
    {
      name: "Aisle-A",
      warehouse: "Main",
      storageType: "Rack"
    },
    {
      name: "A1-L1",
      warehouse: "Main",
      storageType: "Bin",
      parent: "Aisle-A"
    },
    {
      name: "A1-L2",
      warehouse: "Main",
      storageType: "Bin",
      parent: "Aisle-A"
    },
    {
      name: "A1-L3",
      warehouse: "Main",
      storageType: "Bin",
      parent: "Aisle-A"
    },
    {
      name: "A2-L1",
      warehouse: "Main",
      storageType: "Bin",
      parent: "Aisle-A"
    },
    {
      name: "A2-L2",
      warehouse: "Main",
      storageType: "Bin",
      parent: "Aisle-A"
    },
    {
      name: "A2-L3",
      warehouse: "Main",
      storageType: "Bin",
      parent: "Aisle-A"
    },
    {
      name: "A3-L1",
      warehouse: "Main",
      storageType: "Bin",
      parent: "Aisle-A"
    },
    {
      name: "A3-L2",
      warehouse: "Main",
      storageType: "Bin",
      parent: "Aisle-A"
    },
    {
      name: "A3-L3",
      warehouse: "Main",
      storageType: "Bin",
      parent: "Aisle-A"
    },
    {
      name: "Nguyên liệu trà-Vault",
      warehouse: "Main",
      storageType: "Cabinet"
    },
    {
      name: "Chiết rót-Crib",
      warehouse: "Main",
      storageType: "Shelf"
    }
  ],
  printerRoute: {
    name: "FMCG Nameplate Printer",
    format: "zpl",
    printerUrl: "https://example.invalid"
  },
  holidays: [
    {
      name: "Founders Day",
      dateOffset: 40
    },
    {
      name: "Plant Retooling Shutdown",
      dateOffset: 100
    },
    {
      name: "Year-End Shutdown",
      dateOffset: 160
    }
  ],
  tags: [
    {
      name: "High Voltage",
      table: "operation"
    },
    {
      name: "UL Listed",
      table: "procedure"
    },
    {
      name: "Chiết rót Certified",
      table: "training"
    },
    {
      name: "Kiểm soát nguyên liệu",
      table: "material"
    },
    {
      name: "Calibrated",
      table: "tool"
    }
  ],
  materialTaxonomy: {
    substances: [
      {
        name: "Đường thực phẩm",
        code: "ESTL"
      },
      {
        name: "Nguyên liệu lỏng",
        code: "ENCU"
      }
    ],
    forms: [
      {
        name: "Nguyên liệu bao",
        code: "LAMCOIL"
      }
    ],
    types: [
      {
        name: "Đường tinh luyện đóng bao",
        code: "ESTL-LAM",
        substance: "Đường thực phẩm",
        form: "Nguyên liệu bao"
      }
    ],
    grades: [
      {
        name: "M19",
        substance: "Đường thực phẩm"
      },
      {
        name: "M27",
        substance: "Đường thực phẩm"
      },
      {
        name: "MW 35-C",
        substance: "Nguyên liệu lỏng"
      }
    ],
    finishes: [
      {
        name: "C5 Chỉ tiêu an toàn thực phẩm Coating",
        substance: "Đường thực phẩm"
      },
      {
        name: "Polyamide-Imide Overcoat",
        substance: "Nguyên liệu lỏng"
      }
    ],
    dimensions: [
      {
        name: "0.35mm x 200mm",
        form: "Nguyên liệu bao",
        isMetric: true
      },
      {
        name: "0.50mm x 150mm",
        form: "Nguyên liệu bao",
        isMetric: true
      }
    ]
  },
  defaultShippingMethod: "UPS Ground",
  contractorAgency: {
    name: "Three Rivers Technical Services",
    type: "Services",
    phone: "+1-260-555-0170"
  },
  partyAddressCity: "Thành phố Hồ Chí Minh",
  partyAddressStateProvince: "Thành phố Hồ Chí Minh",
  partyAddressPostalCode: "70000",
  partyAddressCountryCode: "VN"
};
