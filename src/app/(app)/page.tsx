import DashboardStats from "./dashboard/DashboardStats";
import OrdersByCategory from "./dashboard/OrdersByCategory";
import RecentOrders from "./dashboard/RecentOrders";
import TopSellingItems from "./dashboard/TopSellingItems";
import WeeklyRevenue from "./dashboard/WeeklyRevenue";

export default function Page() {
  return (
    <div className="space-y-4 md:space-y-5">
      <DashboardStats />

      <section className="grid gap-4 lg:grid-cols-2">
        <WeeklyRevenue />
        <OrdersByCategory />
      </section>

      <section className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <RecentOrders />
        <TopSellingItems />
      </section>
    </div>
  );
}
