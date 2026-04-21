import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TopSellingItem } from "@/redux/features/dashboard/dashboard.type";

const defaultTopItems = [
  { rank: "#1", name: "Pepperoni Pizza", category: "Pizzas", sold: "123 sold" },
  { rank: "#2", name: "Smash Burger", category: "Burgers", sold: "94 sold" },
  { rank: "#3", name: "Jerk Chicken", category: "Jamaican", sold: "54 sold" },
  { rank: "#4", name: "Cheese Burger", category: "Burgers", sold: "32 sold" },
];

type TopSellingItemsProps = {
  topSellingItems?: TopSellingItem[];
};

const TopSellingItems = ({ topSellingItems }: TopSellingItemsProps) => {
  const topItems = topSellingItems && topSellingItems.length > 0
    ? topSellingItems.map((item, index) => ({
        rank: `#${index + 1}`,
        name: item.itemName,
        category: item.category,
        sold: `${item.unitsSold} sold`,
      }))
    : defaultTopItems;

  return (
    <Card>
      <CardHeader>
        <CardTitle>TOP SELLING ITEMS</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {topItems.map((item) => (
          <div key={item.rank} className="flex items-center justify-between pb-3 last:border-b-0">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-black/45">{item.rank}</span>
              <div>
                <p className="text-sm md:text-base font-medium text-title">{item.name}</p>
                <p className="text-sm text-description">{item.category}</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-[#D63B00]">{item.sold}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TopSellingItems;
