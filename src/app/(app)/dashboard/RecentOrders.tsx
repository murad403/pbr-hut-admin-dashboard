import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const orders = [
  { id: "#4821", customer: "Michael Johnson", qty: "2x", total: "$45.00", status: "pending", time: "8:15 AM" },
  { id: "#4824", customer: "John Doe", qty: "1x", total: "$14.99", status: "preparing", time: "8:17 AM" },
  { id: "#4827", customer: "Emily Clarke", qty: "4x", total: "$29.99", status: "delivered", time: "8:20 AM" },
  { id: "#4829", customer: "David Smith", qty: "3x", total: "$59.99", status: "scheduled", time: "8:22 AM" },
  { id: "#4832", customer: "Sophia Turner", qty: "5x", total: "$19.99", status: "cancelled", time: "8:25 AM" },
] as const;

const RecentOrders = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>RECENT ORDERS</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-170 w-full border-separate border-spacing-y-1 text-sm">
            <thead>
              <tr className="text-left text-description text-sm">
                <th className="px-2 py-2 font-medium">Order#</th>
                <th className="px-2 py-2 font-medium">Customer</th>
                <th className="hidden px-2 py-2 font-medium md:table-cell">Items Qty.</th>
                <th className="px-2 py-2 font-medium">Order Total</th>
                <th className="px-2 py-2 font-medium">Status</th>
                <th className="hidden px-2 py-2 font-medium lg:table-cell">Time</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-[#E8E8E8] [&>td]:border-b [&>td]:border-black/8 last:[&>td]:border-b-0">
                  <td className="px-2 py-3 font-semibold text-title">{order.id}</td>
                  <td className="px-2 py-3 text-title">{order.customer}</td>
                  <td className="hidden px-2 py-3 text-title md:table-cell">{order.qty}</td>
                  <td className="px-2 py-3 text-title">{order.total}</td>
                  <td className="px-2 py-3">
                    <Badge variant={order.status}>{order.status}</Badge>
                  </td>
                  <td className="hidden px-2 py-3 text-title lg:table-cell">{order.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentOrders;
