/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Edit3, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDeleteMenuItemMutation, useGetAllMenuItemsQuery, useGetCategoriesQuery } from "@/redux/features/dashboard/dashboard.api";
import type { GetMenuItemsQueryParams, MenuItemEntity, MenuSize } from "@/redux/features/dashboard/dashboard.type";
import CustomPagination from "@/components/shared/CustomPagination";



const formatCurrency = (amount: string | number) => {
  const numericValue = Number(amount);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(numericValue) ? numericValue : 0);
};

const getSizeLabel = (size: MenuSize) => {
  if (size === "SMALL") return "SM";
  if (size === "MEDIUM") return "MD";
  if (size === "LARGE") return "L";

  return "REG";
};

const getDefaultSizeVariant = (item: MenuItemEntity) => {
  return item.sizeVariants.find((variant) => variant.size === "REGULAR") ?? item.sizeVariants[0];
};

const Page = () => {
  const router = useRouter();
  const [activeCategoryId, setActiveCategoryId] = React.useState<string>("ALL");
  const [page, setPage] = React.useState(1);

  const { data: categories = [], isFetching: isCategoriesLoading } = useGetCategoriesQuery();

  const queryParams = React.useMemo<GetMenuItemsQueryParams>(
    () => ({
      page,
      limit: 20,
      categoryId: activeCategoryId === "ALL" ? undefined : activeCategoryId,
    }),
    [activeCategoryId, page]
  );

  const {
    data: itemsResponse,
    isFetching: isItemsLoading,
    refetch: refetchItems,
  } = useGetAllMenuItemsQuery(queryParams);
  const [deleteMenuItem, { isLoading: isDeletingItem }] = useDeleteMenuItemMutation();

  const items = itemsResponse?.data ?? [];
  const pagination = itemsResponse?.pagination;

  const categoryTabs = React.useMemo(
    () => [{ id: "ALL", name: "All" }, ...categories.map((category) => ({ id: category.id, name: category.name }))],
    [categories]
  );

  const handleDelete = async (id: string) => {
    // console.log(id)
    try {
      await deleteMenuItem(id).unwrap();
      toast.success("Item deleted successfully");
      refetchItems();
    } catch {
      toast.error("Failed to delete item");
    }
  };

  const handleEdit = (itemId: string) => {
    router.push(`/menu-&-catalog/edit-item?itemId=${itemId}`);
  };

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2 rounded-full bg-[#FAEEE8] p-1.5 text-sm text-black/65">
          {categoryTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveCategoryId(tab.id);
                setPage(1);
              }}
              className={cn(
                "rounded-full px-3 py-1.5 transition-colors",
                activeCategoryId === tab.id ? "bg-white text-title shadow-sm" : "hover:text-title"
              )}
            >
              {tab.name}
            </button>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          className="rounded-full border-[#F6C6A6] px-4 text-[#D94906]"
          onClick={() => router.push("/menu-&-catalog/add-item")}
          disabled={isCategoriesLoading}
        >
          <Plus className="size-4" />
          Add a new item
        </Button>
      </div>

      <section className="rounded-[28px] bg-white">
        <div className="relative overflow-x-auto rounded-2xl border border-black/8">
          {isItemsLoading ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-title shadow-sm">
                <Loader2 className="size-4 animate-spin text-[#D94906]" />
                Loading menu items...
              </div>
            </div>
          ) : null}

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
              {items.map((item, index) => {
                const defaultSizeVariant = getDefaultSizeVariant(item);
                const defaultSize = defaultSizeVariant ? getSizeLabel(defaultSizeVariant.size) : "-";
                const price = defaultSizeVariant ? formatCurrency(defaultSizeVariant.price) : "$0.00";
                const sizeVariants = item.sizeVariants.map((variant) => getSizeLabel(variant.size)).join(", ");

                return (
                  <tr
                    key={item.id}
                    className={cn(
                      "border-b border-black/8 transition-colors hover:bg-black/3",
                      index % 2 === 1 && "bg-black/2"
                    )}
                  >
                    <td className="px-4 py-3 text-title">{item.name}</td>
                    <td className="px-4 py-3 text-title">{item.category?.name ?? "-"}</td>
                    <td className="px-4 py-3 text-title">{item.subCategory?.name ?? "-"}</td>
                    <td className="px-4 py-3 text-title">{defaultSize}</td>
                    <td className="px-4 py-3 text-title">{price}</td>
                    <td className="px-4 py-3 text-title">{sizeVariants || "-"}</td>
                    <td className="px-4 py-3">
                      <Badge variant={item.isDeliverable ? "delivered" : "cancelled"}>
                        {item.isDeliverable ? "AVAILABLE" : "NOT AVAILABLE"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={item.isAvailable ? "delivered" : "cancelled"}>
                        {item.isAvailable ? "AVAILABLE" : "NOT AVAILABLE"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="text-[#FB6A6A] hover:text-[#ef4444] disabled:opacity-50"
                          aria-label={`Delete ${item.name}`}
                          disabled={isDeletingItem}
                        >
                          <Trash2 className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEdit(item.id)}
                          className="font-semibold text-[#1677FF] hover:underline"
                        >
                          <Edit3 className="mr-1 inline size-4 align-[-2px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {!isItemsLoading && items.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-description">
                    No menu items found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <CustomPagination
        page={pagination?.page ?? page}
        totalPages={pagination?.totalPages ?? 1}
        onPageChange={setPage}
        disabled={isItemsLoading}
      />
    </div>
  );
};

export default Page;
