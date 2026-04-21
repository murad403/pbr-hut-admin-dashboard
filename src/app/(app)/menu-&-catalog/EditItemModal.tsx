"use client";

import React from "react";

import type { MenuCategory, MenuItemEntity } from "@/redux/features/dashboard/dashboard.type";

import AddItemModal from "./AddItemModal";
import { type AddItemFormValues } from "./validation/add-item.validation";

type EditItemModalProps = {
  open: boolean;
  item: MenuItemEntity | null;
  categories: MenuCategory[];
  isSaving: boolean;
  onClose: () => void;
  onSave: (values: AddItemFormValues) => Promise<void> | void;
};

const editItemDefaults: AddItemFormValues = {
  itemName: "",
  categoryId: "",
  subCategoryId: "",
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

const mapItemToFormValues = (item: MenuItemEntity | null): AddItemFormValues => {
  if (!item) {
    return editItemDefaults;
  }

  return {
    itemName: item.name,
    categoryId: item.categoryId,
    subCategoryId: item.subCategoryId,
    description: item.description,
    offeringItem: item.sideOptions[0]?.name ?? "",
    sizeVariantsEnabled: item.hasSizeVariants,
    deliveryAvailable: item.isDeliverable,
    itemAvailable: item.isAvailable,
    addExtrasEnabled: item.hasExtras,
    sizeVariants: [
      { label: "Small", price: item.sizeVariants.find((variant) => variant.size === "SMALL")?.price ?? "" },
      { label: "Medium", price: item.sizeVariants.find((variant) => variant.size === "MEDIUM")?.price ?? "" },
      { label: "Large", price: item.sizeVariants.find((variant) => variant.size === "LARGE")?.price ?? "" },
    ],
    extras:
      item.extras.length > 0
        ? item.extras.map((extra) => ({ label: extra.name, price: extra.price }))
        : editItemDefaults.extras,
  };
};

const EditItemModal = ({ open, item, categories, isSaving, onClose, onSave }: EditItemModalProps) => {
  return (
    <AddItemModal
      open={open}
      title="Edit Item"
      isSaving={isSaving}
      categories={categories}
      initialValues={mapItemToFormValues(item)}
      submitLabel="Update"
      onClose={onClose}
      onSave={onSave}
    />
  );
};

export default EditItemModal;
