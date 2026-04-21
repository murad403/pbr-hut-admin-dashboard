import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { title: "TODAY ORDER(S)", value: "43" },
  { title: "ORDER TOTAL", value: "$6,320" },
  { title: "ACTIVE ORDER(S)", value: "20" },
  { title: "PENDING", value: "19" },
  { title: "CANCELLED", value: "0" },
  { title: "DELIVERED", value: "4" },
  { title: "REVENUE", value: "$6,320" },
];

const weeklyRevenue = [1200, 2450, 1850, 2100, 1820, 1650, 2120];
const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const orders = [
  { id: "#4821", customer: "Michael Johnson", qty: "2x", total: "$45.00", status: "pending", time: "8:15 AM" },
  { id: "#4824", customer: "John Doe", qty: "1x", total: "$14.99", status: "preparing", time: "8:17 AM" },
  { id: "#4827", customer: "Emily Clarke", qty: "4x", total: "$29.99", status: "delivered", time: "8:20 AM" },
  { id: "#4829", customer: "David Smith", qty: "3x", total: "$59.99", status: "scheduled", time: "8:22 AM" },
  { id: "#4832", customer: "Sophia Turner", qty: "5x", total: "$19.99", status: "cancelled", time: "8:25 AM" },
] as const;

const topItems = [
  { rank: "#1", name: "Pepperoni Pizza", category: "Pizzas", sold: "123 sold" },
  { rank: "#2", name: "Smash Burger", category: "Burgers", sold: "94 sold" },
  { rank: "#3", name: "Jerk Chicken", category: "Jamaican", sold: "54 sold" },
  { rank: "#4", name: "Cheese Burger", category: "Burgers", sold: "32 sold" },
];

export default function Page() {
  return (
    <div className="space-y-4 md:space-y-5">
      <section className="grid gap-3 rounded-2xl bg-[#FAEEE8] p-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {stats.map((item) => (
          <div key={item.title}>
            <p className="text-xs font-medium text-black/65">{item.title}</p>
            <p className="text-[34px] leading-tight font-semibold text-[#1A1A1A]">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>WEEKLY REVENUE</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-black/8 p-4">
              <div className="mb-3 grid h-[150px] grid-cols-7 items-end gap-3">
                {weeklyRevenue.map((value, index) => (
                  <div key={weekdays[index]} className="flex flex-col items-center gap-2">
                    <div
                      className="w-full max-w-[42px] rounded-[999px] bg-gradient-to-b from-[#D94906] to-[#FAEEE8]"
                      style={{ height: `${(value / 2500) * 120}px` }}
                    />
                    <span className="text-xs text-black/45">{weekdays[index]}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ORDERS BY CATEGORY</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-[207px] items-center justify-center rounded-xl border border-black/8">
              <div
                className="relative h-36 w-36 rounded-full"
                style={{
                  background:
                    "conic-gradient(#D94906 0deg 120deg, #F2A700 120deg 200deg, #22C55E 200deg 270deg, #3B82F6 270deg 320deg, #8B5CF6 320deg 360deg)",
                }}
              >
                <div className="absolute inset-[26px] rounded-full bg-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>RECENT ORDERS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-1 text-sm">
                <thead>
                  <tr className="text-left text-black/50">
                    <th className="px-2 py-2 font-medium">Order#</th>
                    <th className="px-2 py-2 font-medium">Customer</th>
                    <th className="px-2 py-2 font-medium">Items Qty.</th>
                    <th className="px-2 py-2 font-medium">Order Total</th>
                    <th className="px-2 py-2 font-medium">Status</th>
                    <th className="px-2 py-2 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={order.id} className={index === 1 ? "rounded-xl bg-black/5" : ""}>
                      <td className="px-2 py-2.5 font-semibold text-black/75">{order.id}</td>
                      <td className="px-2 py-2.5 text-[#1A1A1A]">{order.customer}</td>
                      <td className="px-2 py-2.5 text-black/70">{order.qty}</td>
                      <td className="px-2 py-2.5 text-black/70">{order.total}</td>
                      <td className="px-2 py-2.5">
                        <Badge variant={order.status}>{order.status}</Badge>
                      </td>
                      <td className="px-2 py-2.5 text-black/70">{order.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>TOP SELLING ITEMS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topItems.map((item) => (
              <div key={item.rank} className="flex items-start justify-between border-b border-black/6 pb-3 last:border-b-0">
                <div className="flex items-start gap-3">
                  <span className="text-sm font-semibold text-black/45">{item.rank}</span>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A1A]">{item.name}</p>
                    <p className="text-xs text-black/45">{item.category}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-[#D94906]">{item.sold}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
