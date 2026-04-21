import type { DashboardStats as DashboardStatsData } from "@/redux/features/dashboard/dashboard.type";

const formatCurrency = (amount: string | number | undefined) => {
  const parsedAmount = Number(amount ?? 0);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(parsedAmount) ? parsedAmount : 0);
};

type DashboardStatsProps = {
  stats?: DashboardStatsData;
};

const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const statCards = [
    { title: "TODAY ORDER(S)", value: String(stats?.todayOrders ?? 0) },
    { title: "ORDER TOTAL", value: formatCurrency(stats?.orderTotal) },
    { title: "ACTIVE ORDER(S)", value: String(stats?.activeOrders ?? 0) },
    { title: "PENDING", value: String(stats?.pending ?? 0) },
    { title: "CANCELLED", value: String(stats?.cancelled ?? 0) },
    { title: "DELIVERED", value: String(stats?.delivered ?? 0) },
    { title: "REVENUE", value: formatCurrency(stats?.revenue) },
  ];
 
  return (
    <section className="grid gap-3 rounded-2xl bg-[#FBEBE6] p-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
      {statCards.map((item) => (
        <div key={item.title}>
          <p className="text-xs md:text-sm font-medium text-description">{item.title}</p>
          <p className="text-2xl md:text-3xl leading-tight font-semibold text-title">{item.value}</p>
        </div>
      ))}
    </section>
  );
};

export default DashboardStats;
