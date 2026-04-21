import { z } from "zod";

const priceSchema = z.string().min(1, "Price is required");

export const addItemSchema = z.object({
  itemName: z.string().min(1, "Item name is required"),
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().min(1, "Sub-category is required"),
  description: z.string().min(1, "Description is required"),
  offeringItem: z.string().min(1, "Offering item is required"),
  sizeVariantsEnabled: z.boolean(),
  deliveryAvailable: z.boolean(),
  itemAvailable: z.boolean(),
  addExtrasEnabled: z.boolean(),
  sizeVariants: z.array(
    z.object({
      label: z.string().min(1, "Size label is required"),
      price: priceSchema,
    })
  ),
  extras: z.array(
    z.object({
      label: z.string().min(1, "Extra label is required"),
      price: z.string().optional(),
    })
  ),
});

export type AddItemFormValues = z.infer<typeof addItemSchema>;