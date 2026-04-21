"use client";

import React from "react";

import type { MenuCategory } from "@/redux/features/dashboard/dashboard.type";

import MenuItemFormModal from "./MenuItemFormModal";
import { type AddItemFormValues } from "./validation/add-item.validation";

type AddItemModalProps = {
  open: boolean;
  title?: string;
  initialValues?: AddItemFormValues;
  submitLabel?: string;
  categories: MenuCategory[];
  isSaving: boolean;
  onClose: () => void;
  onSave: (values: AddItemFormValues) => Promise<void> | void;
};

const addItemDefaults: AddItemFormValues = {
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

const AddItemModal = ({
  open,
  title = "Add New item",
  initialValues = addItemDefaults,
  submitLabel = "Add",
  categories,
  isSaving,
  onClose,
  onSave,
}: AddItemModalProps) => {
  return (
    <MenuItemFormModal
      title={title}
      open={open}
      isSaving={isSaving}
      categories={categories}
      initialValues={initialValues}
      submitLabel={submitLabel}
      onClose={onClose}
      onSave={onSave}
    />
  );
};

export default AddItemModal;
