import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const categoryLegend = [
  { label: "Pizza", color: "#D94906" },
  { label: "Grill", color: "#F2A700" },
  { label: "Burgers", color: "#22C55E" },
  { label: "Jamaican", color: "#3B82F6" },
  { label: "Desserts", color: "#8B5CF6" },
];

const OrdersByCategory = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ORDERS BY CATEGORY</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border border-black/8 p-4">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-around">
            <div
              className="relative h-36 w-36 rounded-full"
              style={{
                background:
                  "conic-gradient(#D94906 0deg 120deg, #F2A700 120deg 200deg, #22C55E 200deg 270deg, #3B82F6 270deg 320deg, #8B5CF6 320deg 360deg)",
              }}
            >
              <div className="absolute inset-6.5 rounded-full bg-white" />
            </div>

            <div className="grid w-full max-w-57.5 grid-cols-2 gap-x-4 gap-y-2 text-xs sm:text-sm">
              {categoryLegend.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-black/65">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrdersByCategory;
