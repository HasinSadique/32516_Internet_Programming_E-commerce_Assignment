const adminOrders = [
  {
    id: "ORD-1001",
    customerName: "Olivia Carter",
    customerEmail: "olivia.carter@example.com",
    status: "pending",
    paymentStatus: "paid",
    total: 328.0,
    createdAt: "2026-03-21T09:10:00.000Z",
    items: [
      { name: "Pioneer 4 Channel Amplifier 520W - GMA4704", quantity: 1, unitPrice: 209 },
      { name: "Pioneer 6.5 Inch 2-Way 300W Car Speakers - TSG1620F-2", quantity: 1, unitPrice: 65 },
      { name: "Oil Filter", quantity: 2, unitPrice: 27 },
    ],
  },
  {
    id: "ORD-1002",
    customerName: "Noah Patel",
    customerEmail: "noah.patel@example.com",
    status: "processing",
    paymentStatus: "paid",
    total: 549.0,
    createdAt: "2026-03-22T14:35:00.000Z",
    items: [
      {
        name: "MTX RoadThunder Active Slimline 10in with Enclosure - 200W RMS - RTF10P",
        quantity: 1,
        unitPrice: 549,
      },
    ],
  },
  {
    id: "ORD-1003",
    customerName: "Ava Williams",
    customerEmail: "ava.williams@example.com",
    status: "shipped",
    paymentStatus: "paid",
    total: 828.0,
    createdAt: "2026-03-23T07:20:00.000Z",
    items: [
      { name: "TX6 Series - 6.5in Component - TX665S", quantity: 1, unitPrice: 399 },
      { name: "MTX 5 Channel Amplifier Terminator Series - TN800.5", quantity: 1, unitPrice: 499 },
    ],
  },
  {
    id: "ORD-1004",
    customerName: "Liam Nguyen",
    customerEmail: "liam.nguyen@example.com",
    status: "delivered",
    paymentStatus: "paid",
    total: 269.0,
    createdAt: "2026-03-19T11:05:00.000Z",
    items: [
      { name: "Pioneer 4 Channel Amplifier 520W - GMA4704", quantity: 1, unitPrice: 209 },
      { name: "Brake Pads", quantity: 1, unitPrice: 60 },
    ],
  },
  {
    id: "ORD-1005",
    customerName: "Sophia Kim",
    customerEmail: "sophia.kim@example.com",
    status: "cancelled",
    paymentStatus: "refunded",
    total: 65.0,
    createdAt: "2026-03-18T16:48:00.000Z",
    items: [{ name: "Pioneer 6.5 Inch 2-Way 300W Car Speakers - TSG1620F-2", quantity: 1, unitPrice: 65 }],
  },
  {
    id: "ORD-1006",
    customerName: "Ethan Brown",
    customerEmail: "ethan.brown@example.com",
    status: "processing",
    paymentStatus: "pending",
    total: 2759.0,
    createdAt: "2026-03-24T10:22:00.000Z",
    items: [
      {
        name: "Aerpro 10in Advanced Infotainment System - AMUTO53",
        quantity: 1,
        unitPrice: 2759,
      },
    ],
  },
];

export default adminOrders;
