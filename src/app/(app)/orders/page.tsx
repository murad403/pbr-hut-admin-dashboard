"use client";
import React from "react";
import { Download, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";



import OrderDetailsModal from "./OrderDetailsModal";

type OrderStatus = "pending" | "preparing" | "delivered" | "scheduled" | "cancelled" | "on the way";
type FulfillmentType = "delivery" | "pickup";
type PaymentType = "paid" | "cod";

type Order = {
  id: string;
  dateTime: string;
  customer: string;
  itemsQty: string;
  orderTotal: string;
  fulfillment: FulfillmentType;
  payment: PaymentType;
  status: OrderStatus;
  phone: string;
  address: string;
  items: Array<{ name: string; qty: string; price: string }>;
  subtotal: string;
  deliveryFee: string;
  tax: string;
  total: string;
  note: string;
};

const statusTabs = ["all", "pending", "preparing", "on the way", "delivered", "cancelled", "scheduled"] as const;

const orders: Order[] = [
  {
    id: "#4821",
    dateTime: "Apr 14 2:14pm",
    customer: "Michael Johnson",
    itemsQty: "2x",
    orderTotal: "$45.00",
    fulfillment: "delivery",
    payment: "paid",
    status: "pending",
    phone: "(876) 555-1001",
    address: "15 Ocean Aven, Albion",
    items: [
      { name: "2x Pepperoni Pizza (Large)", qty: "$33.99", price: "$33.99" },
      { name: "2x Pepsi 500ml", qty: "$4.00", price: "$4.00" },
    ],
    subtotal: "$37.99",
    deliveryFee: "$4.00",
    tax: "$1.00",
    total: "$39.99",
    note: "E.g., No onions, extra napkins...",
  },
  {
    id: "#4824",
    dateTime: "Feb 12 8:55am",
    customer: "John Doe",
    itemsQty: "1x",
    orderTotal: "$14.99",
    fulfillment: "pickup",
    payment: "cod",
    status: "preparing",
    phone: "(876) 555-1002",
    address: "Kingston, Jamaica",
    items: [{ name: "1x Smash Burger", qty: "$14.99", price: "$14.99" }],
    subtotal: "$14.99",
    deliveryFee: "$0.00",
    tax: "$0.00",
    total: "$14.99",
    note: "",
  },
  {
    id: "#4827",
    dateTime: "Mar 10 4:30pm",
    customer: "Alice Smith",
    itemsQty: "3x",
    orderTotal: "$29.99",
    fulfillment: "delivery",
    payment: "paid",
    status: "delivered",
    phone: "(876) 555-1003",
    address: "Spanish Town, St. Catherine",
    items: [{ name: "3x Jerk Chicken", qty: "$29.99", price: "$29.99" }],
    subtotal: "$29.99",
    deliveryFee: "$0.00",
    tax: "$0.00",
    total: "$29.99",
    note: "",
  },
  {
    id: "#4830",
    dateTime: "Jan 5 9:00am",
    customer: "Bob Brown",
    itemsQty: "4x",
    orderTotal: "$89.00",
    fulfillment: "pickup",
    payment: "cod",
    status: "scheduled",
    phone: "(876) 555-1004",
    address: "Portmore, St. Catherine",
    items: [{ name: "4x Family Meal", qty: "$89.00", price: "$89.00" }],
    subtotal: "$89.00",
    deliveryFee: "$0.00",
    tax: "$0.00",
    total: "$89.00",
    note: "",
  },
  {
    id: "#4833",
    dateTime: "Dec 25 11:15am",
    customer: "Charlie Davis",
    itemsQty: "5x",
    orderTotal: "$24.50",
    fulfillment: "delivery",
    payment: "paid",
    status: "cancelled",
    phone: "(876) 555-1005",
    address: "May Pen, Clarendon",
    items: [{ name: "5x Chicken Wings", qty: "$24.50", price: "$24.50" }],
    subtotal: "$24.50",
    deliveryFee: "$0.00",
    tax: "$0.00",
    total: "$24.50",
    note: "",
  },
  {
    id: "#4836",
    dateTime: "Nov 3 2:45pm",
    customer: "Diana Evans",
    itemsQty: "6x",
    orderTotal: "$67.75",
    fulfillment: "delivery",
    payment: "cod",
    status: "on the way",
    phone: "(876) 555-1006",
    address: "Montego Bay, St. James",
    items: [{ name: "6x Burger Box", qty: "$67.75", price: "$67.75" }],
    subtotal: "$67.75",
    deliveryFee: "$0.00",
    tax: "$0.00",
    total: "$67.75",
    note: "",
  },
];

const tabsLabel = statusTabs.map((tab) => tab);

const formatStatus = (status: string) =>
  status.replace(/\b\w/g, (match) => match.toUpperCase());

const getStatusVariant = (status: OrderStatus) => {
  if (status === "pending") return "pending";
  if (status === "preparing") return "preparing";
  if (status === "delivered") return "delivered";
  if (status === "scheduled") return "scheduled";
  return "cancelled";
};

const toCsvValue = (value: string) => `"${value.replace(/"/g, '""')}"`;

const Page = () => {
  const [activeTab, setActiveTab] = React.useState<(typeof statusTabs)[number]>("all");
  const [searchValue, setSearchValue] = React.useState("");
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);

  const visibleOrders = React.useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesTab = activeTab === "all" || order.status === activeTab;
      const matchesQuery =
        query.length === 0 ||
        [order.id, order.customer, order.dateTime, order.status, order.fulfillment, order.payment]
          .join(" ")
          .toLowerCase()
          .includes(query);

      return matchesTab && matchesQuery;
    });
  }, [activeTab, searchValue]);

  const handleDownloadCsv = () => {
    const rows = [
      ["Order#", "Date & Time", "Customer", "Items Qty.", "Order Total", "Fulfilment", "Paymet", "Status"],
      ...visibleOrders.map((order) => [
        order.id,
        order.dateTime,
        order.customer,
        order.itemsQty,
        order.orderTotal,
        order.fulfillment,
        order.payment,
        order.status,
      ]),
    ];

    const csv = rows.map((row) => row.map(toCsvValue).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "orders.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between w-full gap-2 md:gap-3">

          <div className="flex flex-wrap items-center gap-2 rounded-full bg-[#FAEEE8] p-1.5 text-sm text-black/65">
            {tabsLabel.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "rounded-full px-3 py-1.5 transition-colors",
                  activeTab === tab ? "bg-white text-title shadow-sm" : "hover:text-title"
                )}
              >
                {formatStatus(tab)}
              </button>
            ))}
          </div>
          <Button variant="outline" onClick={handleDownloadCsv} className="rounded-full border-[#F6C6A6] px-4 text-[#D94906]">
            <Download className="size-4" />
            Download CSV
          </Button>
        </div>
      </header>

      <section className="">
        <div className="mt-4 overflow-x-auto rounded-2xl border border-black/8">
          <table className="min-w-[920px] w-full border-separate border-spacing-0 text-sm">
            <thead className="bg-[#FAFAFA] text-left text-description">
              <tr>
                <th className="px-4 py-3 font-medium text-description">Order#</th>
                <th className="px-4 py-3 font-medium text-description">Date &amp; Time</th>
                <th className="px-4 py-3 font-medium text-description">Customer</th>
                <th className="px-4 py-3 font-medium text-description">Items Qty.</th>
                <th className="px-4 py-3 font-medium text-description">Order Total</th>
                <th className="px-4 py-3 font-medium text-description">Fulfilment</th>
                <th className="px-4 py-3 font-medium text-description">Paymet</th>
                <th className="px-4 py-3 font-medium text-description">Status</th>
                <th className="px-4 py-3 font-medium text-description">Action</th>
              </tr>
            </thead>

            <tbody>
              {visibleOrders.map((order, index) => (
                <tr
                  key={order.id}
                  className={cn(
                    "border-b border-black/8 transition-colors hover:bg-black/[0.03]",
                    index % 2 === 1 && "bg-black/[0.02]"
                  )}
                >
                  <td className="px-4 py-3 text-title">{order.id}</td>
                  <td className="px-4 py-3 text-title">{order.dateTime}</td>
                  <td className="px-4 py-3 text-title">{order.customer}</td>
                  <td className="px-4 py-3 text-title">{order.itemsQty}</td>
                  <td className="px-4 py-3 text-title">{order.orderTotal}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase text-white",
                        order.fulfillment === "delivery" ? "bg-[#E44D12]" : "bg-[#1477FF]"
                      )}
                    >
                      {order.fulfillment}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase text-white",
                        order.payment === "paid" ? "bg-emerald-500" : "bg-amber-500"
                      )}
                    >
                      {order.payment}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="font-semibold text-[#1677FF] hover:underline cursor-pointer"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedOrder ? (
        <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      ) : null}
    </div>
  );
};

export default Page;
