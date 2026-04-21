"use client";

import DashboardStats from "./dashboard/DashboardStats";
import OrdersByCategory from "./dashboard/OrdersByCategory";
import RecentOrders from "./dashboard/RecentOrders";
import TopSellingItems from "./dashboard/TopSellingItems";
import WeeklyRevenue from "./dashboard/WeeklyRevenue";
import { useGetDashboardQuery } from "@/redux/features/dashboard/dashboard.api";

export default function Page() {
  const { data } = useGetDashboardQuery();

  return (
    <div className="space-y-4 md:space-y-5">
      <DashboardStats stats={data?.stats} />

      <section className="grid gap-4 lg:grid-cols-2">
        <WeeklyRevenue weeklyRevenue={data?.weeklyRevenue} />
        <OrdersByCategory ordersByCategory={data?.ordersByCategory} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <RecentOrders recentOrders={data?.recentOrders} />
        <TopSellingItems topSellingItems={data?.topSellingItems} />
      </section>
    </div>
  );
}
