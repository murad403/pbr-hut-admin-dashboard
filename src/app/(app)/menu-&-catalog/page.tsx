"use client";

import React from "react";
import { Edit3, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import AddItemModal from "./AddItemModal";
import { type AddItemFormValues } from "./validation/add-item.validation";

const categoryTabs = [
  "All",
  "Pizzas",
  "Burgers",
  "Ribz",
  "Rotisserie",
  "Jamaican",
  "Cookie Meals",
  "Beverages",
  "Miyones",
  "Event Supplies",
] as const;

type MenuItem = {
  id: string;
  category: string;
  subCategory: string;
  defaultSize: string;
  price: string;
  sizeVariants: string;
  deliveryAvailable: boolean;
  itemAvailable: boolean;
};

const initialItems: MenuItem[] = [
  { id: "#4821", category: "Burgers", subCategory: "Chocolate", defaultSize: "Medium", price: "$5.22", sizeVariants: "SM, MD, L, XL", deliveryAvailable: true, itemAvailable: true },
  { id: "#4824", category: "Burgers", subCategory: "Paket Hemat", defaultSize: "Medium", price: "$5.22", sizeVariants: "SM, MD, L, XL", deliveryAvailable: false, itemAvailable: false },
  { id: "#4827", category: "Beverages", subCategory: "Cream", defaultSize: "Medium", price: "$6.48", sizeVariants: "SM, MD, L, XL", deliveryAvailable: true, itemAvailable: true },
  { id: "#4830", category: "Ribz", subCategory: "Boba", defaultSize: "Medium", price: "$11.70", sizeVariants: "SM, MD, L, XL", deliveryAvailable: true, itemAvailable: true },
  { id: "#4833", category: "Jamaican", subCategory: "Cream", defaultSize: "Medium", price: "$11.70", sizeVariants: "SM, MD, L, XL", deliveryAvailable: true, itemAvailable: true },
  { id: "#4836", category: "Jamaican", subCategory: "Coca Cola", defaultSize: "Medium", price: "$8.99", sizeVariants: "SM, MD, L, XL", deliveryAvailable: true, itemAvailable: true },
  { id: "#4839", category: "Rotisserie", subCategory: "Cheese", defaultSize: "Medium", price: "$14.81", sizeVariants: "SM, MD, L, XL", deliveryAvailable: true, itemAvailable: true },
  { id: "#4842", category: "Cookie Meals", subCategory: "No Sugar", defaultSize: "Medium", price: "$8.99", sizeVariants: "SM, MD, L, XL", deliveryAvailable: true, itemAvailable: true },
  { id: "#4845", category: "Beverages", subCategory: "Chicken", defaultSize: "Medium", price: "$11.70", sizeVariants: "SM, MD, L, XL", deliveryAvailable: true, itemAvailable: true },
  { id: "#4848", category: "Pizzas", subCategory: "Ice Cream", defaultSize: "Medium", price: "$6.48", sizeVariants: "SM, MD, L, XL", deliveryAvailable: true, itemAvailable: true },
  { id: "#4851", category: "Nuts", subCategory: "Beef", defaultSize: "Medium", price: "$17.84", sizeVariants: "SM, MD, L, XL", deliveryAvailable: true, itemAvailable: true },
  { id: "#4854", category: "Nuts", subCategory: "Less Sugar", defaultSize: "Medium", price: "$8.99", sizeVariants: "SM, MD, L, XL", deliveryAvailable: true, itemAvailable: true },
  { id: "#4857", category: "Nuts", subCategory: "Burger", defaultSize: "Medium", price: "$8.99", sizeVariants: "SM, MD, L, XL", deliveryAvailable: true, itemAvailable: true },
  { id: "#4860", category: "Chicken", subCategory: "Fried Fries", defaultSize: "Medium", price: "$6.48", sizeVariants: "SM, MD, L, XL", deliveryAvailable: true, itemAvailable: true },
];

const Page = () => {
  const [activeCategory, setActiveCategory] = React.useState<string>("All");
  const [items, setItems] = React.useState<MenuItem[]>(initialItems);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<MenuItem | null>(null);

  const filteredItems = React.useMemo(() => {
    if (activeCategory === "All") {
      return items;
    }

    return items.filter((item) => item.category === activeCategory);
  }, [activeCategory, items]);

  const handleDelete = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2 rounded-full bg-[#FAEEE8] p-1.5 text-sm text-black/65">
          {categoryTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveCategory(tab)}
              className={cn(
                "rounded-full px-3 py-1.5 transition-colors",
                activeCategory === tab ? "bg-white text-title shadow-sm" : "hover:text-title"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          className="rounded-full border-[#F6C6A6] px-4 text-[#D94906]"
          onClick={() => {
            setEditingItem(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="size-4" />
          Add a new item
        </Button>
      </div>

      <section className="rounded-[28px] bg-white">
        <div className="overflow-x-auto rounded-2xl border border-black/8">
          <table className="min-w-262.5 w-full border-separate border-spacing-0 text-sm">
            <thead className="bg-[#FAFAFA] text-left text-black/45">
              <tr>
                <th className="px-4 py-3 font-medium">Item</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Sub-Category</th>
                <th className="px-4 py-3 font-medium">Default Size</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Size Variants</th>
                <th className="px-4 py-3 font-medium">Deliver Availability</th>
                <th className="px-4 py-3 font-medium">Item Availability</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.map((item, index) => (
                <tr
                  key={item.id}
                  className={cn(
                    "border-b border-black/8 transition-colors hover:bg-black/3",
                    index % 2 === 1 && "bg-black/2"
                  )}
                >
                  <td className="px-4 py-3 text-title">{item.id}</td>
                  <td className="px-4 py-3 text-title">{item.category}</td>
                  <td className="px-4 py-3 text-title">{item.subCategory}</td>
                  <td className="px-4 py-3 text-title">{item.defaultSize}</td>
                  <td className="px-4 py-3 text-title">{item.price}</td>
                  <td className="px-4 py-3 text-title">{item.sizeVariants}</td>
                  <td className="px-4 py-3">
                    <Badge variant={item.deliveryAvailable ? "delivered" : "cancelled"}>
                      {item.deliveryAvailable ? "AVAILABLE" : "NOT AVAILABLE"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={item.itemAvailable ? "delivered" : "cancelled"}>
                      {item.itemAvailable ? "AVAILABLE" : "NOT AVAILABLE"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="text-[#FB6A6A] hover:text-[#ef4444]"
                        aria-label={`Delete ${item.id}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className="font-semibold text-[#1677FF] hover:underline"
                      >
                        <Edit3 className="mr-1 inline size-4 align-[-2px]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {isModalOpen ? (
        <AddItemModal
          open={isModalOpen}
          item={editingItem}
          onClose={() => {
            setIsModalOpen(false);
            setEditingItem(null);
          }}
          onSave={(values: AddItemFormValues) => {
            const nextItem: MenuItem = {
              id: editingItem?.id ?? `#${4821 + items.length}`,
              category: values.category,
              subCategory: values.subCategory,
              defaultSize: values.sizeVariantsEnabled ? "Medium" : "Medium",
              price: values.sizeVariants[1]?.price ? `$${values.sizeVariants[1].price}` : "$0.00",
              sizeVariants: values.sizeVariantsEnabled ? "SM, MD, L, XL" : "",
              deliveryAvailable: values.deliveryAvailable,
              itemAvailable: values.itemAvailable,
            };

            setItems((current) => {
              if (editingItem) {
                return current.map((item) => (item.id === editingItem.id ? nextItem : item));
              }

              return [nextItem, ...current];
            });
            setIsModalOpen(false);
            setEditingItem(null);
          }}
        />
      ) : null}
    </div>
  );
};

export default Page;
