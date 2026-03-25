import adminOrders from "@/data/dummy-data/admin-orders";

function cloneOrder(order) {
  return {
    ...order,
    items: Array.isArray(order.items)
      ? order.items.map((item) => ({ ...item }))
      : [],
  };
}

const allOrders = adminOrders.map(cloneOrder);

export function getAllOrders() {
  return allOrders.map(cloneOrder);
}
