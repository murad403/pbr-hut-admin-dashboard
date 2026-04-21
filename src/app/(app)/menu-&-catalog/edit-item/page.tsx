"use client";

import React from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useFieldArray, useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload, Plus, Trash2, ArrowLeft } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import {
  useGetCategoriesQuery,
  useGetMenuItemQuery,
  useUpdateMenuItemMutation,
} from "@/redux/features/dashboard/dashboard.api";

const sizeEnum = ["SMALL", "MEDIUM", "LARGE", "REGULAR"] as const;

const schema = z.object({
  name: z.string().min(1, "Item name is required"),
  description: z.string().min(1, "Description is required"),
  categoryId: z.string().min(1, "Category is required"),
  subCategoryId: z.string().optional(),
  displayOrder: z.coerce.number().int().min(0).default(1),
  isDeliverable: z.boolean().default(true),
  isAvailable: z.boolean().default(true),
  allowCustomNote: z.boolean().default(true),
  isSideFree: z.boolean().default(true),
  isExtrasOptional: z.boolean().default(true),
  image: z.instanceof(File).optional(),
  sizeVariantsEnabled: z.boolean().default(false),
  addExtrasEnabled: z.boolean().default(false),
  addSideOptionsEnabled: z.boolean().default(false),
  sizeVariants: z
    .array(
      z.object({
        size: z.enum(sizeEnum),
        price: z.coerce.number().min(0, "Must be >= 0"),
      })
    )
    .default([
      { size: "SMALL", price: 0 },
      { size: "MEDIUM", price: 0 },
      { size: "LARGE", price: 0 },
      { size: "REGULAR", price: 0 },
    ]),
  extras: z
    .array(
      z.object({
        name: z.string().min(1, "Name required"),
        price: z.coerce.number().min(0, "Must be >= 0"),
      })
    )
    .default([]),
  sideOptions: z
    .array(
      z.object({
        name: z.string().min(1, "Name required"),
        price: z.coerce.number().min(0, "Must be >= 0"),
        isDefault: z.boolean().default(false),
      })
    )
    .default([]),
});

type FormValues = z.infer<typeof schema>;

const defaultValues: FormValues = {
  name: "",
  description: "",
  categoryId: "",
  subCategoryId: "",
  displayOrder: 1,
  isDeliverable: true,
  isAvailable: true,
  allowCustomNote: true,
  isSideFree: true,
  isExtrasOptional: true,
  image: undefined,
  sizeVariantsEnabled: false,
  addExtrasEnabled: false,
  addSideOptionsEnabled: false,
  sizeVariants: [
    { size: "SMALL", price: 0 },
    { size: "MEDIUM", price: 0 },
    { size: "LARGE", price: 0 },
    { size: "REGULAR", price: 0 },
  ],
  extras: [],
  sideOptions: [],
};

const toNumber = (value: string | number | null | undefined, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemId = searchParams.get("itemId");

  const [localImagePreview, setLocalImagePreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { data: categories = [], isLoading: loadingCategories } = useGetCategoriesQuery();
  const { data: item, isFetching: isItemLoading } = useGetMenuItemQuery(itemId ?? "", {
    skip: !itemId,
  });
  const [updateMenuItem, { isLoading: isSaving }] = useUpdateMenuItemMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
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

  const categoryId = useWatch({ control, name: "categoryId", defaultValue: "" });
  const sizeVariantsEnabled = useWatch({ control, name: "sizeVariantsEnabled", defaultValue: false });
  const addExtrasEnabled = useWatch({ control, name: "addExtrasEnabled", defaultValue: false });
  const addSideOptionsEnabled = useWatch({ control, name: "addSideOptionsEnabled", defaultValue: false });
  const isDeliverable = useWatch({ control, name: "isDeliverable", defaultValue: true });
  const isAvailable = useWatch({ control, name: "isAvailable", defaultValue: true });

  const sizeVariantsField = useFieldArray({ control, name: "sizeVariants" });
  const extrasField = useFieldArray({ control, name: "extras" });
  const sideOptionsField = useFieldArray({ control, name: "sideOptions" });

  const selectedCategory = React.useMemo(
    () => categories.find((category) => category.id === categoryId),
    [categories, categoryId]
  );

  React.useEffect(() => {
    if (!item) {
      return;
    }

    reset({
      ...defaultValues,
      name: item.name,
      description: item.description,
      categoryId: item.categoryId,
      subCategoryId: item.subCategoryId,
      displayOrder: item.displayOrder,
      isDeliverable: item.isDeliverable,
      isAvailable: item.isAvailable,
      allowCustomNote: item.allowCustomNote,
      isSideFree: item.isSideFree,
      isExtrasOptional: item.isExtrasOptional,
      image: undefined,
      sizeVariantsEnabled: item.hasSizeVariants,
      addExtrasEnabled: item.hasExtras,
      addSideOptionsEnabled: item.sideOptions.length > 0,
      sizeVariants: [
        { size: "SMALL", price: toNumber(item.sizeVariants.find((variant) => variant.size === "SMALL")?.price, 0) },
        { size: "MEDIUM", price: toNumber(item.sizeVariants.find((variant) => variant.size === "MEDIUM")?.price, 0) },
        { size: "LARGE", price: toNumber(item.sizeVariants.find((variant) => variant.size === "LARGE")?.price, 0) },
        { size: "REGULAR", price: toNumber(item.sizeVariants.find((variant) => variant.size === "REGULAR")?.price, 0) },
      ],
      extras: item.extras.map((extra) => ({ name: extra.name, price: toNumber(extra.price, 0) })),
      sideOptions: item.sideOptions.map((sideOption) => ({
        name: sideOption.name,
        price: toNumber(sideOption.price, 0),
        isDefault: sideOption.isDefault,
      })),
    });

  }, [item, reset]);

  React.useEffect(() => {
    if (categoryId) {
      return;
    }

    setValue("subCategoryId", "");
  }, [categoryId, setValue]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setValue("image", file, { shouldValidate: true });
    setLocalImagePreview(null);

    const reader = new FileReader();
    reader.onload = (value) => {
      setLocalImagePreview(value.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClose = () => {
    router.back();
  };

  const imagePreview = localImagePreview ?? item?.imageUrl ?? null;

  const handleSubmitForm = handleSubmit(async (values) => {
    if (!itemId) {
      toast.error("Missing item id");
      return;
    }

    const data = {
      name: values.name,
      description: values.description,
      displayOrder: values.displayOrder,
      isDeliverable: values.isDeliverable,
      isAvailable: values.isAvailable,
      allowCustomNote: values.allowCustomNote,
      isSideFree: values.isSideFree,
      isExtrasOptional: values.isExtrasOptional,
      categoryId: values.categoryId,
      subCategoryId: values.subCategoryId || "",
      tagIds: [],
      sizeVariants: values.sizeVariantsEnabled ? values.sizeVariants : [],
      sideOptions: values.addSideOptionsEnabled ? values.sideOptions : [],
      extras: values.addExtrasEnabled ? values.extras : [],
    };

    try {
      await updateMenuItem({ itemId, data: { data, image: values.image } }).unwrap();
      toast.success("Item updated successfully");
      router.back();
    } catch {
      toast.error("Failed to update item");
    }
  });

  if (!itemId) {
    return (
      <div className="space-y-3 rounded-2xl bg-white p-5">
        <h1 className="text-xl font-semibold text-title">Edit Item</h1>
        <p className="text-sm text-description">No item selected for editing.</p>
        <button type="button" onClick={handleClose} className="text-sm font-medium text-[#1677FF] hover:underline">
          Back to menu list
        </button>
      </div>
    );
  }

  if (isItemLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center rounded-2xl bg-white p-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-title shadow-sm">
          <Loader2 className="size-4 animate-spin text-[#D94906]" />
          Loading item details...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="sticky top-0 z-10 border-b border-black/5 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5"
          >
            <ArrowLeft className="size-4 text-black/60" />
          </button>
          <div>
            <h1 className="text-[16px] font-semibold tracking-[-0.02em] text-[#151515]">Edit Item</h1>
            <p className="text-[12px] text-black/45">Update the selected menu item</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmitForm} className="mx-auto max-w-2xl space-y-4 px-4 py-6">
        <Section title="Basic Info">
          <Field label="Item Name*" error={errors.name?.message}>
            <input className={inputCls(!!errors.name)} placeholder="e.g. Classic Margherita" {...register("name")} />
          </Field>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Category*" error={errors.categoryId?.message}>
              <Controller
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <select
                    className={selectCls(!!errors.categoryId)}
                    value={field.value ?? ""}
                    onChange={(event) => field.onChange(event.target.value)}
                    onBlur={field.onBlur}
                    disabled={loadingCategories}
                  >
                    <option value="">{loadingCategories ? "Loading…" : "Select category"}</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                )}
              />
            </Field>

            <Field label="Sub-category" error={errors.subCategoryId?.message}>
              <Controller
                control={control}
                name="subCategoryId"
                render={({ field }) => (
                  <select
                    className={selectCls(false, !categoryId)}
                    disabled={!categoryId}
                    value={field.value ?? ""}
                    onChange={(event) => field.onChange(event.target.value)}
                    onBlur={field.onBlur}
                  >
                    <option value="">
                      {!categoryId
                        ? "Select category first"
                        : (selectedCategory?.subCategories?.length ?? 0) === 0
                          ? "No sub-categories"
                          : "Select sub-category"}
                    </option>
                    {(selectedCategory?.subCategories ?? []).map((subCategory) => (
                      <option key={subCategory.id} value={subCategory.id}>
                        {subCategory.name}
                      </option>
                    ))}
                  </select>
                )}
              />
            </Field>
          </div>

          <Field label="Description*" error={errors.description?.message}>
            <textarea
              rows={4}
              className={cn(inputCls(!!errors.description), "resize-none py-2.5")}
              placeholder="Write a description for your item"
              {...register("description")}
            />
          </Field>

          <Field label="Display Order">
            <input type="number" min={0} className={inputCls(false)} placeholder="1" {...register("displayOrder")} />
          </Field>

          <Field label="Item Image">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center justify-center rounded-md border-2 border-dashed border-black/10 bg-black/2 py-6 transition-colors hover:border-black/20 hover:bg-black/4"
            >
              {imagePreview ? (
                <div className="flex flex-col items-center gap-2">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={80}
                    height={80}
                    unoptimized
                    className="h-20 w-20 rounded-md object-cover"
                  />
                  <span className="text-[12px] font-medium text-[#666]">Change image</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="size-5 text-black/30" />
                  <span className="text-[12px] font-medium text-black/30">Click to upload image</span>
                </div>
              )}
            </button>
          </Field>
        </Section>

        <Section title="Availability">
          <Toggle title="Delivery Available" checked={!!isDeliverable} onToggle={(value) => setValue("isDeliverable", value)} />
          <Toggle title="Item Available" checked={!!isAvailable} onToggle={(value) => setValue("isAvailable", value)} />
        </Section>

        <Section title="Size Variants">
          <Toggle
            title="Enable size variants"
            checked={!!sizeVariantsEnabled}
            onToggle={(value) => setValue("sizeVariantsEnabled", value)}
          />
          {sizeVariantsEnabled ? (
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {sizeVariantsField.fields.map((field, index) => (
                <div key={field.id} className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-black/40">{field.size}</p>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className={inputCls(!!errors.sizeVariants?.[index]?.price)}
                    placeholder="0.00"
                    {...register(`sizeVariants.${index}.price`)}
                  />
                  {errors.sizeVariants?.[index]?.price ? (
                    <p className="text-[10px] text-red-500">{errors.sizeVariants[index]?.price?.message}</p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </Section>

        <Section title="Extras">
          <Toggle title="Enable extras" checked={!!addExtrasEnabled} onToggle={(value) => setValue("addExtrasEnabled", value)} />
          {addExtrasEnabled ? (
            <div className="mt-3 space-y-2">
              {extrasField.fields.length === 0 ? <p className="text-center text-[12px] text-black/30">No extras yet.</p> : null}
              {extrasField.fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <input
                    className={cn(inputCls(!!errors.extras?.[index]?.name), "flex-1")}
                    placeholder="Extra name (e.g. Extra Sauce)"
                    {...register(`extras.${index}.name`)}
                  />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className={cn(inputCls(!!errors.extras?.[index]?.price), "w-24")}
                    placeholder="Price"
                    {...register(`extras.${index}.price`)}
                  />
                  <button
                    type="button"
                    onClick={() => extrasField.remove(index)}
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-red-400 hover:bg-red-50"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => extrasField.append({ name: "", price: 0 })}
                className="flex items-center gap-1.5 text-[12px] font-medium text-[#D04900] hover:text-[#b94400]"
              >
                <Plus className="size-3.5" /> Add extra
              </button>
            </div>
          ) : null}
        </Section>

        <Section title="Side Options">
          <Toggle
            title="Enable side options"
            checked={!!addSideOptionsEnabled}
            onToggle={(value) => setValue("addSideOptionsEnabled", value)}
          />
          {addSideOptionsEnabled ? (
            <div className="mt-3 space-y-2">
              {sideOptionsField.fields.length === 0 ? (
                <p className="text-center text-[12px] text-black/30">No side options yet.</p>
              ) : null}
              {sideOptionsField.fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <input
                    className={cn(inputCls(!!errors.sideOptions?.[index]?.name), "flex-1")}
                    placeholder="Side name (e.g. Cajun Fries)"
                    {...register(`sideOptions.${index}.name`)}
                  />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className={cn(inputCls(!!errors.sideOptions?.[index]?.price), "w-20")}
                    placeholder="Price"
                    {...register(`sideOptions.${index}.price`)}
                  />
                  <Controller
                    control={control}
                    name={`sideOptions.${index}.isDefault`}
                    render={({ field: currentField }) => (
                      <button
                        type="button"
                        onClick={() => currentField.onChange(!currentField.value)}
                        className={cn(
                          "h-9 shrink-0 rounded-md border px-2.5 text-[11px] font-medium transition-colors",
                          currentField.value
                            ? "border-[#21B26B]/30 bg-[#21B26B]/10 text-[#21B26B]"
                            : "border-black/10 bg-white text-black/30 hover:border-black/20 hover:text-black/50"
                        )}
                      >
                        Default
                      </button>
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => sideOptionsField.remove(index)}
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-red-400 hover:bg-red-50"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => sideOptionsField.append({ name: "", price: 0, isDefault: false })}
                className="flex items-center gap-1.5 text-[12px] font-medium text-[#D04900] hover:text-[#b94400]"
              >
                <Plus className="size-3.5" /> Add side option
              </button>
            </div>
          ) : null}
        </Section>

        <div className="flex gap-3 pb-8 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="h-11 flex-1 rounded-full border border-[#f4cbb7] bg-white text-[13px] font-medium text-[#D94906] transition-colors hover:bg-[#fff8f4]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isSaving}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#D04900] text-[13px] font-medium text-white transition-colors hover:bg-[#b94400] disabled:opacity-60"
          >
            {isSubmitting || isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
            Update Item
          </button>
        </div>
      </form>
    </div>
  );
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      <p className="mb-3 text-[13px] font-semibold text-[#151515]">{title}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-[12px] font-medium text-[#333]">{label}</label>
      {children}
      {error ? <p className="mt-1 text-[11px] text-red-500">{error}</p> : null}
    </div>
  );
}

function Toggle({ title, checked, onToggle }: { title: string; checked: boolean; onToggle: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-black/8 px-3 py-2.5">
      <p className="text-[13px] font-medium text-[#252525]">{title}</p>
      <button
        type="button"
        onClick={() => onToggle(!checked)}
        aria-pressed={checked}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
          checked ? "bg-[#21B26B]" : "bg-[#E5DDD9]"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.18)] transition-transform",
            checked ? "translate-x-5" : "translate-x-0.5"
          )}
        />
      </button>
    </div>
  );
}

function inputCls(hasError = false) {
  return cn(
    "h-10 w-full rounded-md border bg-white px-3 text-[13px] text-[#222] outline-none transition placeholder:text-black/25",
    "focus:ring-2 focus:ring-black/10",
    hasError ? "border-red-300 focus:ring-red-200" : "border-black/10"
  );
}

function selectCls(hasError = false, disabled = false) {
  return cn(
    "h-10 w-full rounded-md border bg-white px-3 text-[13px] outline-none transition",
    "focus:ring-2 focus:ring-black/10",
    hasError ? "border-red-300 focus:ring-red-200" : "border-black/10",
    disabled ? "cursor-not-allowed bg-black/[0.03] text-black/30" : "text-[#444]"
  );
}

export default Page;
