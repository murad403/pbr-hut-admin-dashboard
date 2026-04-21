const stats = [
  { title: "TODAY ORDER(S)", value: "43" },
  { title: "ORDER TOTAL", value: "$6,320" },
  { title: "ACTIVE ORDER(S)", value: "20" },
  { title: "PENDING", value: "19" },
  { title: "CANCELLED", value: "0" },
  { title: "DELIVERED", value: "4" },
  { title: "REVENUE", value: "$6,320" },
];

const DashboardStats = () => {
  return (
    <section className="grid gap-3 rounded-2xl bg-[#FBEBE6] p-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
      {stats.map((item) => (
        <div key={item.title}>
          <p className="text-xs md:text-sm font-medium text-description">{item.title}</p>
          <p className="text-2xl md:text-3xl leading-tight font-semibold text-title">{item.value}</p>
        </div>
      ))}
    </section>
  );
};

export default DashboardStats;
