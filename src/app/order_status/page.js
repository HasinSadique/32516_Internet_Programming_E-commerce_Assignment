export const metadata = {
  title: "Order Status | Shop",
  description: "Check your order status.",
};

export default function OrderStatusPage() {
  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold text-slate-900">Order Status</h1>
        <p className="mb-6 text-slate-700">
          Enter your order number to check the status of your order.
        </p>
        <form className="flex items-start gap-4">
          <input
            type="text"
            placeholder="Order Number"
            className=" rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Check Status
          </button>
        </form>
      </div>
      {/* Example status block for demonstration */}
      <div className="container mx-auto px-4">
        <div className="rounded-xl border border-slate-200 bg-white shadow-lg">
          <div className="p-6">
            {/* Top 4 columns: Order #, Status, Delivery Date, Tracking # */}
            <div className="mb-6 grid grid-cols-2 gap-4 rounded-lg border border-slate-200 p-4 md:grid-cols-4">
              <div>
                <div className="mb-1 text-xs uppercase text-slate-500">
                  Order #
                </div>
                <div className="text-lg font-bold text-blue-600">123456</div>
              </div>
              <div>
                <div className="mb-1 text-xs uppercase text-slate-500">
                  Status
                </div>
                <div className="font-bold text-emerald-600">Shipped</div>
              </div>
              <div>
                <div className="mb-1 text-xs uppercase text-slate-500">
                  Estimated Delivery
                </div>
                <div className="font-semibold text-slate-800">
                  June 26, 2024
                </div>
              </div>
              <div>
                <div className="mb-1 text-xs uppercase text-slate-500">
                  Tracking #
                </div>
                <div className="break-all font-mono text-xs text-slate-700">
                  1Z999AA10123456784
                </div>
              </div>
            </div>

            {/* Ordered items table */}
            <h3 className="mb-3 mt-2 text-lg font-bold text-slate-900">
              Ordered Items
            </h3>
            <div className="mb-4 overflow-x-auto">
              <table className="w-full min-w-[520px] text-sm text-slate-700">
                <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold">Item</th>
                    <th className="px-3 py-2 text-center font-semibold">Qty</th>
                    <th className="px-3 py-2 text-right font-semibold">
                      Unit Price
                    </th>
                    <th className="px-3 py-2 text-right font-semibold">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {/* Row 1 */}
                  <tr className="bg-white">
                    <td className="px-3 py-2">Brake Pads</td>
                    <td className="px-3 py-2 text-center">2</td>
                    <td className="px-3 py-2 text-right">$24.99</td>
                    <td className="px-3 py-2 text-right">$49.98</td>
                  </tr>
                  {/* Row 2 */}
                  <tr className="bg-slate-50/60">
                    <td className="px-3 py-2">Oil Filter</td>
                    <td className="px-3 py-2 text-center">1</td>
                    <td className="px-3 py-2 text-right">$10.99</td>
                    <td className="px-3 py-2 text-right">$10.99</td>
                  </tr>
                </tbody>
                <tfoot className="border-t border-slate-200 bg-slate-50">
                  <tr>
                    <td
                      colSpan="3"
                      className="px-3 py-2 text-right font-semibold"
                    >
                      Subtotal
                    </td>
                    <td className="px-3 py-2 text-right">$60.97</td>
                  </tr>
                  <tr>
                    <td
                      colSpan="3"
                      className="px-3 py-2 text-right font-semibold"
                    >
                      Delivery Charge
                    </td>
                    <td className="px-3 py-2 text-right">$4.95</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="px-3 py-2 text-right font-bold">
                      Total
                    </td>
                    <td className="px-3 py-2 text-right font-bold text-slate-900">
                      $65.92
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
