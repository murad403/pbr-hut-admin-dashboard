"use client";

import React from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { addItemSchema, type AddItemFormValues } from "./validation/add-item.validation";

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

type AddItemModalProps = {
  open: boolean;
  item: MenuItem | null;
  onClose: () => void;
  onSave: (values: AddItemFormValues) => void;
};

const defaultValues: AddItemFormValues = {
  itemName: "",
  category: "",
  subCategory: "",
  description: "",
  offeringItem: "",
  sizeVariantsEnabled: true,
  deliveryAvailable: true,
  itemAvailable: true,
  addExtrasEnabled: false,
  sizeVariants: [
    { label: "Small", price: "" },
    { label: "Medium", price: "" },
    { label: "Large", price: "" },
  ],
  extras: [
    { label: "Hand made Salad", price: "" },
    { label: "Miyones", price: "" },
    { label: "Black Olives", price: "" },
  ],
};

const categories = [
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

const AddItemModal = ({ open, item, onClose, onSave }: AddItemModalProps) => {
  const form = useForm<AddItemFormValues>({
    resolver: zodResolver(addItemSchema),
    defaultValues,
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const sizeVariantsEnabled = useWatch({ control, name: "sizeVariantsEnabled" });
  const addExtrasEnabled = useWatch({ control, name: "addExtrasEnabled" });
  const deliveryAvailable = useWatch({ control, name: "deliveryAvailable" });
  const itemAvailable = useWatch({ control, name: "itemAvailable" });

  const sizeVariants = useFieldArray({ control, name: "sizeVariants" });
  const extras = useFieldArray({ control, name: "extras" });

  React.useEffect(() => {
    if (!open) {
      return;
    }

    if (item) {
      reset({
        ...defaultValues,
        itemName: item.id,
        category: item.category,
        subCategory: item.subCategory,
        offeringItem: item.subCategory,
        sizeVariantsEnabled: true,
        deliveryAvailable: item.deliveryAvailable,
        itemAvailable: item.itemAvailable,
      });
      return;
    }

    reset(defaultValues);
  }, [item, open, reset]);

  const submitHandler = handleSubmit((values) => {
    onSave(values);
  });

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-6 backdrop-blur-[2px]">
      <div className="relative w-full max-w-115 rounded-xl bg-white p-5 shadow-[0_24px_80px_rgba(0,0,0,0.18)] sm:p-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-black/60 hover:bg-black/5 hover:text-black"
          aria-label="Close modal"
        >
          <X className="size-5" />
        </button>

        <form className="space-y-3" onSubmit={submitHandler}>
          <h2 className="text-lg font-semibold text-title">Add New item</h2>

          <div>
            <label className="mb-1 block text-sm font-medium text-title">Item Name*</label>
            <Input placeholder="e.g. Pepperoni Spicy Pizza" {...register("itemName")} />
            {errors.itemName ? <p className="mt-1 text-xs text-red-500">{errors.itemName.message}</p> : null}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-title">Category*</label>
              <select
                className="h-11 w-full rounded-sm border border-black/10 bg-white px-4 text-sm text-title shadow-sm outline-none focus:ring-2 focus:ring-black/10"
                {...register("category")}
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category ? <p className="mt-1 text-xs text-red-500">{errors.category.message}</p> : null}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-title">Sub-category*</label>
              <Input placeholder="" {...register("subCategory")} />
              {errors.subCategory ? <p className="mt-1 text-xs text-red-500">{errors.subCategory.message}</p> : null}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-title">Description*</label>
            <textarea
              rows={4}
              className="min-h-24 w-full rounded-sm border border-black/10 bg-white px-4 py-3 text-sm text-title shadow-sm outline-none placeholder:text-black/40 focus:ring-2 focus:ring-black/10"
              placeholder="Write a description for your item"
              {...register("description")}
            />
            {errors.description ? <p className="mt-1 text-xs text-red-500">{errors.description.message}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-title">
              What you&apos;re offering with the item (Customers can select single item)*
            </label>
            <Input placeholder="e.g. Salad" {...register("offeringItem")} />
            {errors.offeringItem ? <p className="mt-1 text-xs text-red-500">{errors.offeringItem.message}</p> : null}
          </div>

          <ToggleRow
            label="Size Variants"
            checked={sizeVariantsEnabled}
            onChange={(checked) => setValue("sizeVariantsEnabled", checked, { shouldValidate: true })}
          />

          {sizeVariantsEnabled ? (
            <div className="rounded-2xl border border-black/10 p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-title">Size Variants with Price</p>
                <span className="text-xs text-black/45">{sizeVariants.fields.length} options</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {sizeVariants.fields.map((field, index) => (
                  <div key={field.id} className="space-y-1">
                    <p className="text-xs font-medium text-title">{field.label}</p>
                    <Input placeholder="Price" {...register(`sizeVariants.${index}.price`)} />
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <ToggleRow
            label="Delivery Available"
            checked={deliveryAvailable}
            onChange={(checked) => setValue("deliveryAvailable", checked, { shouldValidate: true })}
          />

          <ToggleRow
            label="Item Available"
            checked={itemAvailable}
            onChange={(checked) => setValue("itemAvailable", checked, { shouldValidate: true })}
          />

          <ToggleRow
            label="Add Extras"
            checked={addExtrasEnabled}
            onChange={(checked) => setValue("addExtrasEnabled", checked, { shouldValidate: true })}
          />

          {addExtrasEnabled ? (
            <div className="rounded-sm border border-black/10 p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-title">Add Extras (set price)</p>
                <span className="text-xs text-black/45">Optional add-ons</span>
              </div>

              <div className="grid gap-2 sm:grid-cols-3">
                {extras.fields.map((field, index) => (
                  <div key={field.id} className="space-y-1">
                    <p className="text-xs font-medium text-title">{field.label || `Extra ${index + 1}`}</p>
                    <Input placeholder="Price" {...register(`extras.${index}.price`)} />
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" className="h-11 flex-1 rounded-full border-[#F6C6A6] text-[#D94906]" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="h-11 flex-1 rounded-full bg-[#D94906] hover:bg-[#bf4305]" disabled={isSubmitting}>
              Add
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

type ToggleRowProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

const ToggleRow = ({ label, checked, onChange }: ToggleRowProps) => {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-sm border border-black/10 px-3 py-2 text-left text-sm text-title"
    >
      <span>{label}</span>
      <span
        className={cn(
          "relative h-5 w-10 rounded-full transition-colors",
          checked ? "bg-emerald-500" : "bg-black/10"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-5" : "translate-x-0.5"
          )}
        />
      </span>
    </button>
  );
};

export default AddItemModal;
