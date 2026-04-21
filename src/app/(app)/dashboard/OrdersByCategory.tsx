"use client";
import { PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { OrdersByCategoryPoint } from "@/redux/features/dashboard/dashboard.type";

const defaultData = [
  { name: "PIZZAS",         value: 110, color: "#E14A00" },
  { name: "BURGERS",        value: 80,  color: "#F5AE00" },
  { name: "JAMAICAN",       value: 58,  color: "#28C85E" },
  { name: "EVENT\nSUPPLIES",value: 60,  color: "#3E82F7" },
  { name: "BEVERAGES",      value: 52,  color: "#8F4AD7" },
];

const categoryColors = ["#E14A00", "#F5AE00", "#28C85E", "#3E82F7", "#8F4AD7"];

const RADIAN = Math.PI / 180;

const renderCustomLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, name,
}: {
  cx?: number; cy?: number; midAngle?: number;
  innerRadius?: number; outerRadius?: number; name?: string;
}) => {
  if (
    typeof cx !== "number"
    || typeof cy !== "number"
    || typeof midAngle !== "number"
    || typeof innerRadius !== "number"
    || typeof outerRadius !== "number"
    || typeof name !== "string"
  ) {
    return null;
  }

  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const rotate = -midAngle + 90;

  const lines = name.split("\n");

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      transform={`rotate(${rotate}, ${x}, ${y})`}
      fontSize={13}
      fontWeight="700"
      fontFamily="sans-serif"
      letterSpacing="0.5"
    >
      {lines.map((line, i) => (
        <tspan
          key={i}
          x={x}
          dy={i === 0 ? (lines.length > 1 ? "-0.6em" : "0") : "1.2em"}
        >
          {line}
        </tspan>
      ))}
    </text>
  );
};

type OrdersByCategoryProps = {
  ordersByCategory?: OrdersByCategoryPoint[];
};

const OrdersByCategory = ({ ordersByCategory }: OrdersByCategoryProps) => {
  const data = ordersByCategory && ordersByCategory.length > 0
    ? ordersByCategory.map((item, index) => ({
        name: item.category.toUpperCase(),
        value: item.count,
        color: categoryColors[index % categoryColors.length],
      }))
    : defaultData;

  return (
    <Card>
      <CardHeader className="p-6 pb-0 sm:p-7 sm:pb-0">
        <CardTitle className="text-2xl font-semibold tracking-tight text-white/10 sm:text-[28px]">
          ORDERS BY CATEGORY
        </CardTitle>
      </CardHeader>

      <CardContent className="flex min-h-105 items-center justify-center p-6 pt-0 sm:min-h-130 sm:p-7 sm:pt-0">
        <PieChart width={360} height={360}>
          <Pie
            data={data}
            cx={175}
            cy={175}
            innerRadius={80}
            outerRadius={175}
            paddingAngle={4}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            labelLine={false}
            label={renderCustomLabel}
            cornerRadius={6}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} stroke="none" />
            ))}
          </Pie>
        </PieChart>
      </CardContent>
    </Card>
  );
};

export default OrdersByCategory;