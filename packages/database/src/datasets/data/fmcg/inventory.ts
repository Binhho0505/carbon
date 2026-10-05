// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import type { InventoryData } from "../../types.ts";

export const fmcgInventory: InventoryData = {
  openingStock: [
    {
      item: "RM-TEA-GREEN",
      qty: 480,
      shelf: "Nguyên liệu trà-Vault"
    },
    {
      item: "RM-FOOD-SEASONING",
      qty: 360,
      shelf: "Nguyên liệu trà-Vault"
    },
    {
      item: "PKG-FOOD-POUCH",
      qty: 60,
      shelf: "A2-L1"
    },
    {
      item: "PKG-BEV-PET-500",
      qty: 44,
      shelf: "A2-L1"
    },
    {
      item: "PKG-FOOD-SEAL",
      qty: 120,
      shelf: "A1-L2"
    },
    {
      item: "PKG-BEV-TRACE-LABEL",
      qty: 6,
      shelf: "A1-L3"
    },
    {
      item: "PKG-FOOD-BOX",
      qty: 75,
      shelf: "A1-L2"
    },
    {
      item: "PKG-BEV-SHRINK",
      qty: 28,
      shelf: "A2-L3"
    },
    {
      item: "PKG-FOOD-CARTON",
      qty: 900,
      shelf: "A1-L1"
    },
    {
      item: "PKG-BEV-PALLET",
      qty: 500,
      shelf: "A1-L1"
    },
    {
      item: "PKG-LOT-LABEL",
      qty: 150,
      shelf: "A1-L3"
    },
    {
      item: "RM-SUGAR",
      qty: 2440,
      shelf: "A3-L1"
    },
    {
      item: "RM-WATER",
      qty: 640,
      shelf: "Chiết rót-Crib"
    },
    {
      item: "RM-TEA-EXTRACT",
      qty: 85,
      shelf: "Chiết rót-Crib"
    },
    {
      item: "RM-ACID-CITRIC",
      qty: 22,
      shelf: "A3-L3"
    },
    {
      item: "PKG-CORRUGATED",
      qty: 720,
      shelf: "A3-L2"
    },
    {
      item: "RM-WHEAT-FLOUR",
      qty: 540,
      shelf: "A3-L2"
    },
    {
      item: "CN-FOOD-SANITIZER",
      qty: 4,
      shelf: "A1-L3"
    },
    {
      item: "CN-FOOD-LUBRICANT",
      qty: 12,
      shelf: "A2-L2"
    }
  ],
  onHandTracked: [
    {
      item: "RM-TEA-GREEN",
      entities: [
        {
          readableId: "LOT-MAG45-2607",
          quantity: 300
        },
        {
          readableId: "LOT-MAG45-2608",
          quantity: 180
        },
        {
          readableId: "LOT-MAG45-2609",
          quantity: 3,
          status: "On Hold"
        }
      ]
    },
    {
      item: "RM-FOOD-SEASONING",
      entities: [
        {
          readableId: "LOT-MAG38-2606",
          quantity: 200
        },
        {
          readableId: "LOT-MAG38-2607",
          quantity: 160
        }
      ]
    },
    {
      item: "PKG-BEV-TRACE-LABEL",
      entities: [
        {
          readableId: "ENC2048-SN-0031",
          quantity: 1
        },
        {
          readableId: "ENC2048-SN-0032",
          quantity: 1
        },
        {
          readableId: "ENC2048-SN-0033",
          quantity: 1
        },
        {
          readableId: "ENC2048-SN-0034",
          quantity: 1
        },
        {
          readableId: "ENC2048-SN-0035",
          quantity: 1
        },
        {
          readableId: "ENC2048-SN-0036",
          quantity: 1
        }
      ]
    },
    {
      item: "RM-SUGAR",
      entities: [
        {
          readableId: "LOT-M19-2606",
          quantity: 1400
        },
        {
          readableId: "LOT-M19-2607",
          quantity: 1000
        },
        {
          readableId: "LOT-M19-2608",
          quantity: 3,
          status: "Rejected"
        },
        {
          readableId: "LOT-M19-2601",
          quantity: 40,
          status: "Scrapped",
          scrap: {
            shelf: "A3-L1",
            reason: "Quality",
            dateOffset: -36,
            comment:
              "Insulating coating flaked after a humidity excursion in storage"
          }
        }
      ]
    },
    {
      item: "RM-WATER",
      entities: [
        {
          readableId: "LOT-CU18-2608",
          quantity: 400
        },
        {
          readableId: "LOT-CU18-2609",
          quantity: 240,
          expiresOffset: 30
        }
      ]
    }
  ],
  kanbanItems: [
    {
      item: "PKG-FOOD-CARTON",
      qty: 300,
      supplier: "Carton Việt Demo"
    },
    {
      item: "PKG-BEV-PALLET",
      qty: 150,
      supplier: "Carton Việt Demo"
    },
    {
      item: "PKG-FOOD-SEAL",
      qty: 40,
      supplier: "Bao Bì Thực Phẩm Việt Demo"
    },
    {
      item: "WIP-FOOD-DOUGH",
      qty: 2,
      replenishmentSystem: "Make"
    },
    {
      item: "RM-ACID-CITRIC",
      qty: 5,
      replenishmentSystem: "Transfer",
      fromShelf: "A3-L3",
      toShelf: "Chiết rót-Crib"
    }
  ],
  inventoryCounts: [
    {
      key: "q3-draft",
      status: "Draft",
      notes:
        "Quarterly physical count — nguyên liệu trà vault and chiết rót crib",
      lines: [
        {
          item: "RM-TEA-GREEN",
          shelf: "Nguyên liệu trà-Vault",
          snapshotQuantity: 480,
          countedQuantity: 480
        },
        {
          item: "RM-FOOD-SEASONING",
          shelf: "Nguyên liệu trà-Vault",
          snapshotQuantity: 360,
          countedQuantity: 360
        },
        {
          item: "PKG-FOOD-POUCH",
          shelf: "A2-L1",
          snapshotQuantity: 60,
          countedQuantity: 60
        },
        {
          item: "PKG-BEV-PET-500",
          shelf: "A2-L1",
          snapshotQuantity: 44,
          countedQuantity: 44
        },
        {
          item: "PKG-FOOD-SEAL",
          shelf: "A1-L2",
          snapshotQuantity: 120,
          countedQuantity: 120
        },
        {
          item: "PKG-BEV-TRACE-LABEL",
          shelf: "A1-L3",
          snapshotQuantity: 6,
          countedQuantity: 6
        }
      ]
    },
    {
      key: "aug-cycle",
      status: "Posted",
      notes: "Cycle count — fastener & seal bins",
      postedOffset: -20,
      lines: [
        {
          item: "PKG-FOOD-CARTON",
          shelf: "A1-L1",
          snapshotQuantity: 900,
          countedQuantity: 898
        },
        {
          item: "PKG-BEV-PALLET",
          shelf: "A1-L1",
          snapshotQuantity: 500,
          countedQuantity: 500
        },
        {
          item: "PKG-FOOD-SEAL",
          shelf: "A1-L2",
          snapshotQuantity: 120,
          countedQuantity: 122
        },
        {
          item: "PKG-LOT-LABEL",
          shelf: "A1-L3",
          snapshotQuantity: 150,
          countedQuantity: 150
        },
        {
          item: "CN-FOOD-LUBRICANT",
          shelf: "A2-L2",
          snapshotQuantity: 12,
          countedQuantity: 12
        }
      ]
    }
  ],
  shelfLives: [
    {
      item: "RM-WATER",
      days: 270
    }
  ],
  stockTransfers: [
    {
      key: "st-completed",
      status: "Completed",
      fromShelf: "A1-L1",
      toShelf: "A2-L2",
      dateOffset: -10,
      lines: [
        {
          item: "PKG-FOOD-CARTON",
          quantity: 60
        }
      ]
    },
    {
      key: "st-released",
      status: "Released",
      fromShelf: "A3-L2",
      toShelf: "A3-L1",
      dateOffset: -1,
      lines: [
        {
          item: "PKG-CORRUGATED",
          quantity: 40
        }
      ]
    },
    {
      key: "st-draft",
      status: "Draft",
      fromShelf: "A2-L2",
      toShelf: "A2-L1",
      dateOffset: 0,
      lines: [
        {
          item: "CN-FOOD-LUBRICANT",
          quantity: 2
        }
      ]
    }
  ],
  warehouseTransfers: [
    {
      key: "wt-completed",
      status: "Completed",
      fromLocation: "Plant",
      toLocation: "HQ",
      dateOffset: -12,
      lines: [
        {
          item: "PKG-BEV-PALLET",
          quantity: 30,
          fromShelf: "A1-L1"
        }
      ]
    },
    {
      key: "wt-toship",
      status: "To Ship",
      fromLocation: "Plant",
      toLocation: "HQ",
      dateOffset: 0,
      lines: [
        {
          item: "RM-ACID-CITRIC",
          quantity: 2,
          fromShelf: "A3-L3"
        }
      ]
    },
    {
      key: "wt-draft",
      status: "Draft",
      fromLocation: "Plant",
      toLocation: "HQ",
      dateOffset: 2,
      lines: [
        {
          item: "PKG-FOOD-BOX",
          quantity: 6,
          fromShelf: "A1-L2"
        }
      ]
    }
  ]
};
