"use client";
import React from "react";
import { Download, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGetOrdersQuery, useOrderDetailsQuery} from "@/redux/features/dashboard/dashboard.api";
import type { GetOrdersQueryParams, OrderDetails, OrderStatusApi, OrderSummary} from "@/redux/features/dashboard/dashboard.type";
import { getAccessToken } from "@/utils/auth";
import OrderDetailsModal from "./OrderDetailsModal";
import CustomPagination from "@/components/shared/CustomPagination";

const statusTabs: Array<"ALL" | OrderStatusApi> = [
    "ALL",
    "PENDING",
    "CONFIRMED",
    "PREPARING",
    "READY_FOR_PICKUP",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "PICKED_UP",
    "CANCELLED",
    "SCHEDULED",
];

const formatStatusLabel = (status: string) =>
    status
        .toLowerCase()
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

const formatDateTime = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
};

const formatCurrency = (amount: string | number) => {
    const numericValue = Number(amount);

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number.isFinite(numericValue) ? numericValue : 0);
};

const getStatusVariant = (status: OrderStatusApi) => {
    if (status === "PENDING" || status === "CONFIRMED") return "pending";
    if (status === "PREPARING" || status === "READY_FOR_PICKUP" || status === "OUT_FOR_DELIVERY") return "preparing";
    if (status === "DELIVERED" || status === "PICKED_UP") return "delivered";
    if (status === "SCHEDULED") return "scheduled";

    return "cancelled";
};

const getPaymentPill = (paymentMethod: OrderSummary["paymentMethod"]) => {
    if (paymentMethod === "CASH_ON_DELIVERY") {
        return "cod";
    }

    return "paid";
};

const mapOrderDetailsForModal = (order: OrderDetails | undefined | null) => {
    if (!order) {
        return null;
    }

    return {
        id: `#${order.orderNumber}`,
        customer: order.deliveryAddress?.name ?? "N/A",
        phone: order.deliveryAddress?.phoneNumber ?? "N/A",
        fulfillment: order.type === "DELIVERY" ? "delivery" : "pickup",
        payment: getPaymentPill(order.paymentMethod),
        address: order.deliveryAddress?.address ?? "N/A",
        items: order.items.map((item) => ({
            id: item.id,
            name: `${item.quantity}x ${item.itemName}`,
            qty: String(item.quantity),
            price: formatCurrency(item.totalPrice),
        })),
        subtotal: formatCurrency(order.itemsTotal),
        deliveryFee: formatCurrency(order.deliveryCharge),
        tax: formatCurrency(order.taxes),
        total: formatCurrency(order.totalAmount),
        note: order.items.map((item) => item.customNote).filter(Boolean).join(" | "),
    } as const;
};

const Page = () => {
    const [activeTab, setActiveTab] = React.useState<(typeof statusTabs)[number]>("ALL");
    const [page, setPage] = React.useState(1);
    const [selectedOrderId, setSelectedOrderId] = React.useState<string | null>(null);

    const queryParams = React.useMemo<GetOrdersQueryParams>(
        () => ({
            page,
            limit: 20,
            status: activeTab === "ALL" ? undefined : activeTab,
        }),
        [activeTab, page]
    );

    const { data: ordersResponse, isFetching: isOrdersLoading } = useGetOrdersQuery(queryParams);

    const { data: orderDetailsData, isFetching: isOrderDetailsLoading } = useOrderDetailsQuery(selectedOrderId ?? "", {
        skip: !selectedOrderId,
    });

    const orders = ordersResponse?.data ?? [];
    const pagination = ordersResponse?.pagination;

    const handleTabChange = (tab: (typeof statusTabs)[number]) => {
        setActiveTab(tab);
        setPage(1);
    };

    const handleDownloadCsv = () => {
        const token = getAccessToken() ?? "";
        const csvUrl = new URL("https://plbck79v-45598.inc1.devtunnels.ms/api/v1/admin/orders/download/csv/");
        csvUrl.searchParams.set("token", token);
        window.location.href = csvUrl.toString();
    };

    return (
        <div className="space-y-4">
            <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center justify-between w-full gap-2 md:gap-3">
                    <div className="flex flex-wrap items-center gap-2 rounded-full bg-[#FAEEE8] p-1.5 text-sm text-black/65">
                        {statusTabs.map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => handleTabChange(tab)}
                                className={cn(
                                    "rounded-full px-3 py-1.5 transition-colors",
                                    activeTab === tab ? "bg-white text-title shadow-sm" : "hover:text-title"
                                )}
                            >
                                {formatStatusLabel(tab)}
                            </button>
                        ))}
                    </div>

                    <Button variant="outline" onClick={handleDownloadCsv} className="rounded-full border-[#F6C6A6] px-4 text-[#D94906]">
                        <Download className="size-4" />
                        Download CSV
                    </Button>
                </div>
            </header>

            <section>
                <div className="relative mt-4 overflow-x-auto rounded-2xl border border-black/8">
                    {isOrdersLoading ? (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-title shadow-sm">
                                <Loader2 className="size-4 animate-spin text-[#D94906]" />
                                Loading orders...
                            </div>
                        </div>
                    ) : null}

                    <table className="min-w-230 w-full border-separate border-spacing-0 text-sm">
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
                            {orders.map((order, index) => {
                                const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
                                const isDelivery = order.type === "DELIVERY";
                                const paymentPill = getPaymentPill(order.paymentMethod);

                                return (
                                    <tr
                                        key={order.id}
                                        className={cn(
                                            "border-b border-black/8 transition-colors hover:bg-black/3",
                                            index % 2 === 1 && "bg-black/2"
                                        )}
                                    >
                                        <td className="px-4 py-3 text-title">#{order.orderNumber}</td>
                                        <td className="px-4 py-3 text-title">{formatDateTime(order.createdAt)}</td>
                                        <td className="px-4 py-3 text-title">{order.deliveryAddress?.name ?? "N/A"}</td>
                                        <td className="px-4 py-3 text-title">{totalQuantity}x</td>
                                        <td className="px-4 py-3 text-title">{formatCurrency(order.totalAmount)}</td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={cn(
                                                    "inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase text-white",
                                                    isDelivery ? "bg-[#E44D12]" : "bg-[#1477FF]"
                                                )}
                                            >
                                                {isDelivery ? "delivery" : "pickup"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={cn(
                                                    "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase text-white",
                                                    paymentPill === "paid" ? "bg-emerald-500" : "bg-amber-500"
                                                )}
                                            >
                                                {paymentPill}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant={getStatusVariant(order.status)}>{formatStatusLabel(order.status)}</Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedOrderId(order.id)}
                                                className="font-semibold text-[#1677FF] hover:underline cursor-pointer"
                                            >
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}

                            {!isOrdersLoading && orders.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-4 py-8 text-center text-description">
                                        No orders found.
                                    </td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4">
                    <CustomPagination
                        page={pagination?.page ?? page}
                        totalPages={pagination?.totalPages ?? 1}
                        onPageChange={setPage}
                        disabled={isOrdersLoading}
                    />
                </div>
            </section>

            {selectedOrderId ? (
                <OrderDetailsModal
                    order={mapOrderDetailsForModal(orderDetailsData)}
                    isLoading={isOrderDetailsLoading}
                    onClose={() => setSelectedOrderId(null)}
                />
            ) : null}
        </div>
    );
};

export default Page;
