/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Upload, Plus, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAddMenuItemMutation, useListCategoriesQuery } from "@/redux/features/dashboard/dashboard.api";
import type { Category } from "@/redux/features/dashboard/dashboard.type";

// ─── Schema ───────────────────────────────────────────────────────────────────

const sizeEnum = ["SMALL", "MEDIUM", "LARGE", "REGULAR"] as const;

const schema = z.object({
  name:                  z.string().min(1, "Item name is required"),
  description:           z.string().min(1, "Description is required"),
  categoryId:            z.string().min(1, "Category is required"),
  subCategoryId:         z.string().optional(),
  displayOrder:          z.coerce.number().int().min(0).default(1),
  isDeliverable:         z.boolean().default(true),
  isAvailable:           z.boolean().default(true),
  allowCustomNote:       z.boolean().default(true),
  isSideFree:            z.boolean().default(true),
  isExtrasOptional:      z.boolean().default(true),
  image:                 z.instanceof(File).optional(),
  // simple mode (hasSizeVariants: false)
  basePrice:             z.coerce.number().min(0, "Must be ≥ 0").optional(),
  // full mode toggles (hasSizeVariants: true)
  sizeVariantsEnabled:   z.boolean().default(false),
  addExtrasEnabled:      z.boolean().default(false),
  addSideOptionsEnabled: z.boolean().default(false),
  // arrays
  sizeVariants: z.array(z.object({
    size:  z.enum(sizeEnum),
    price: z.coerce.number().min(0, "Must be ≥ 0"),
  })).default([
    { size: "SMALL",   price: 0 },
    { size: "MEDIUM",  price: 0 },
    { size: "LARGE",   price: 0 },
    { size: "REGULAR", price: 0 },
  ]),
  extras: z.array(z.object({
    name:  z.string().min(1, "Name required"),
    price: z.coerce.number().min(0, "Must be ≥ 0"),
  })).default([]),
  sideOptions: z.array(z.object({
    name:      z.string().min(1, "Name required"),
    price:     z.coerce.number().min(0, "Must be ≥ 0"),
    isDefault: z.boolean().default(false),
  })).default([]),
});

type FormValues = z.infer<typeof schema>;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AddMenuItemPage() {
  const router = useRouter();
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { data: categories = [] as Category[], isLoading: loadingCategories } = useListCategoriesQuery();
  const [addMenuItem, { isLoading: isSaving }] = useAddMenuItemMutation();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      name:                  "",
      description:           "",
      categoryId:            "",
      subCategoryId:         "",
      displayOrder:          1,
      isDeliverable:         true,
      isAvailable:           true,
      allowCustomNote:       true,
      isSideFree:            true,
      isExtrasOptional:      true,
      image:                 undefined,
      basePrice:             undefined,
      sizeVariantsEnabled:   false,
      addExtrasEnabled:      false,
      addSideOptionsEnabled: false,
      sizeVariants: [
        { size: "SMALL",   price: 0 },
        { size: "MEDIUM",  price: 0 },
        { size: "LARGE",   price: 0 },
        { size: "REGULAR", price: 0 },
      ],
      extras:      [],
      sideOptions: [],
    },
  });

  const categoryId            = useWatch({ control, name: "categoryId",            defaultValue: "" });
  const subCategoryId         = useWatch({ control, name: "subCategoryId",         defaultValue: "" });
  const sizeVariantsEnabled   = useWatch({ control, name: "sizeVariantsEnabled",   defaultValue: false });
  const addExtrasEnabled      = useWatch({ control, name: "addExtrasEnabled",      defaultValue: false });
  const addSideOptionsEnabled = useWatch({ control, name: "addSideOptionsEnabled", defaultValue: false });
  const isDeliverable         = useWatch({ control, name: "isDeliverable",         defaultValue: true });
  const isAvailable           = useWatch({ control, name: "isAvailable",           defaultValue: true });

  const sizeVariantsField = useFieldArray({ control, name: "sizeVariants" });
  const extrasField       = useFieldArray({ control, name: "extras" });
  const sideOptionsField  = useFieldArray({ control, name: "sideOptions" });

  // ── Resolve hasSizeVariants: sub takes priority over category ────────────
  const selectedCategory = React.useMemo(
    () => categories.find((c) => c.id === categoryId) ?? null,
    [categories, categoryId]
  );
  const selectedSubCategory = React.useMemo(
    () => (subCategoryId ? selectedCategory?.subCategories?.find((s) => s.id === subCategoryId) ?? null : null),
    [selectedCategory, subCategoryId]
  );
  const hasSizeVariants = React.useMemo(() => {
    if (selectedSubCategory) return selectedSubCategory.hasSizeVariants ?? false;
    return selectedCategory?.hasSizeVariants ?? false;
  }, [selectedCategory, selectedSubCategory]);

  // Clear subCategoryId on category change
  const prevCategoryIdRef = React.useRef(categoryId);
  React.useEffect(() => {
    if (prevCategoryIdRef.current === categoryId) return;
    prevCategoryIdRef.current = categoryId;
    setValue("subCategoryId", "");
  }, [categoryId, setValue]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setValue("image", file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const onSubmit = handleSubmit(async (values) => {
    // Manual basePrice validation in simple mode
    if (!hasSizeVariants && (values.basePrice === undefined || values.basePrice === null || isNaN(values.basePrice))) {
      setError("basePrice", { message: "Base price is required" });
      return;
    }

    const { image, basePrice, sizeVariantsEnabled, addExtrasEnabled, addSideOptionsEnabled, ...rest } = values;

    const data = hasSizeVariants
      ? {
          // full mode — original logic
          ...rest,
          subCategoryId: rest.subCategoryId || undefined,
          sizeVariants:  sizeVariantsEnabled   ? rest.sizeVariants  : undefined,
          extras:        addExtrasEnabled       ? rest.extras        : undefined,
          sideOptions:   addSideOptionsEnabled  ? rest.sideOptions   : undefined,
          tagIds:        [] as string[],
        }
      : {
          // simple mode
          name:          rest.name,
          description:   rest.description,
          categoryId:    rest.categoryId,
          subCategoryId: rest.subCategoryId || undefined,
          displayOrder:  rest.displayOrder,
          isDeliverable: rest.isDeliverable,
          isAvailable:   rest.isAvailable,
          basePrice,
        };

    try {
      await addMenuItem({ data: data as any, image: image ?? null as any }).unwrap();
      router.back();
    } catch (err) {
      console.error("Failed to add item:", err);
    }
  });

  // ── Shared fields ────────────────────────────────────────────────────────
  const categorySubSelects = (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label="Category*" error={errors.categoryId?.message}>
        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <select
              className={selectCls(!!errors.categoryId)}
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
            >
              <option value="">{loadingCategories ? "Loading…" : "Select category"}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
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
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
            >
              <option value="">
                {!categoryId
                  ? "Select category first"
                  : (selectedCategory?.subCategories?.length ?? 0) === 0
                  ? "No sub-categories"
                  : "Select sub-category"}
              </option>
              {(selectedCategory?.subCategories ?? []).map((sub) => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          )}
        />
      </Field>
    </div>
  );

  const imageUpload = (
    <Field label="Item Image">
      <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="flex w-full items-center justify-center rounded-md border-2 border-dashed border-black/10 bg-black/2 py-6 transition-colors hover:border-black/20 hover:bg-black/4"
      >
        {imagePreview ? (
          <div className="flex flex-col items-center gap-2">
            <Image src={imagePreview} alt="Preview" width={80} height={80} className="h-20 w-20 rounded-md object-cover" />
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
  );

  return (
    <div>
      <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-4 px-4 py-6">

        {/* ── Basic Info ───────────────────────────────────────────── */}
        <Section title="Basic Info">
          <Field label="Item Name*" error={errors.name?.message}>
            <input className={inputCls(!!errors.name)} placeholder="e.g. Classic Margherita" {...register("name")} />
          </Field>

          {categorySubSelects}

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

          {/* Price area — conditional on hasSizeVariants */}
          {!hasSizeVariants ? (
            <Field label="Base Price*" error={errors.basePrice?.message}>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-black/40">৳</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className={cn(inputCls(!!errors.basePrice), "pl-7")}
                  placeholder="0.00"
                  {...register("basePrice")}
                />
              </div>
            </Field>
          ) : (
            <div className="flex items-center gap-2 rounded-xl border border-black/8 bg-black/2 px-3 py-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D94906]/60" />
              <p className="text-[12px] text-description">
                Price is managed via <span className="font-medium text-title">size variants</span>
              </p>
            </div>
          )}

          {imageUpload}
        </Section>

        {/* ── Availability ─────────────────────────────────────────── */}
        <Section title="Availability">
          <Toggle title="Delivery Available" checked={isDeliverable} onToggle={(v) => setValue("isDeliverable", v)} />
          <Toggle title="Item Available" checked={isAvailable} onToggle={(v) => setValue("isAvailable", v)} />
        </Section>

        {/* ── Full mode only (hasSizeVariants: true) ───────────────── */}
        {hasSizeVariants && (
          <>
            <Section title="Size Variants">
              <Toggle title="Enable size variants" checked={sizeVariantsEnabled} onToggle={(v) => setValue("sizeVariantsEnabled", v)} />
              {sizeVariantsEnabled && (
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
                      {errors.sizeVariants?.[index]?.price && (
                        <p className="text-[10px] text-red-500">{errors.sizeVariants[index]?.price?.message}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Section>

            <Section title="Extras">
              <Toggle title="Enable extras" checked={addExtrasEnabled} onToggle={(v) => setValue("addExtrasEnabled", v)} />
              {addExtrasEnabled && (
                <div className="mt-3 space-y-2">
                  {extrasField.fields.length === 0 && (
                    <p className="text-center text-[12px] text-black/30">No extras yet.</p>
                  )}
                  {extrasField.fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <input
                        className={cn(inputCls(!!errors.extras?.[index]?.name), "flex-1")}
                        placeholder="Extra name (e.g. Extra Sauce)"
                        {...register(`extras.${index}.name`)}
                      />
                      <input
                        type="number" step="0.01" min="0"
                        className={cn(inputCls(!!errors.extras?.[index]?.price), "w-24")}
                        placeholder="Price"
                        {...register(`extras.${index}.price`)}
                      />
                      <button type="button" onClick={() => extrasField.remove(index)}
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-red-400 hover:bg-red-50">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => extrasField.append({ name: "", price: 0 })}
                    className="flex items-center gap-1.5 text-[12px] font-medium text-[#D04900] hover:text-[#b94400]">
                    <Plus className="size-3.5" /> Add extra
                  </button>
                </div>
              )}
            </Section>

            <Section title="Side Options">
              <Toggle title="Enable side options" checked={addSideOptionsEnabled} onToggle={(v) => setValue("addSideOptionsEnabled", v)} />
              {addSideOptionsEnabled && (
                <div className="mt-3 space-y-2">
                  {sideOptionsField.fields.length === 0 && (
                    <p className="text-center text-[12px] text-black/30">No side options yet.</p>
                  )}
                  {sideOptionsField.fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <input
                        className={cn(inputCls(!!errors.sideOptions?.[index]?.name), "flex-1")}
                        placeholder="Side name (e.g. Cajun Fries)"
                        {...register(`sideOptions.${index}.name`)}
                      />
                      <input
                        type="number" step="0.01" min="0"
                        className={cn(inputCls(!!errors.sideOptions?.[index]?.price), "w-20")}
                        placeholder="Price"
                        {...register(`sideOptions.${index}.price`)}
                      />
                      <Controller
                        control={control}
                        name={`sideOptions.${index}.isDefault`}
                        render={({ field: f }) => (
                          <button
                            type="button"
                            onClick={() => f.onChange(!f.value)}
                            className={cn(
                              "h-9 shrink-0 rounded-md border px-2.5 text-[11px] font-medium transition-colors",
                              f.value
                                ? "border-[#21B26B]/30 bg-[#21B26B]/10 text-[#21B26B]"
                                : "border-black/10 bg-white text-black/30 hover:border-black/20 hover:text-black/50"
                            )}
                          >
                            Default
                          </button>
                        )}
                      />
                      <button type="button" onClick={() => sideOptionsField.remove(index)}
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-red-400 hover:bg-red-50">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => sideOptionsField.append({ name: "", price: 0, isDefault: false })}
                    className="flex items-center gap-1.5 text-[12px] font-medium text-[#D04900] hover:text-[#b94400]">
                    <Plus className="size-3.5" /> Add side option
                  </button>
                </div>
              )}
            </Section>
          </>
        )}

        {/* ── Submit ───────────────────────────────────────────────── */}
        <div className="flex gap-3 pb-8 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="h-11 flex-1 rounded-full border border-[#f4cbb7] bg-white text-[13px] font-medium text-[#D94906] transition-colors hover:bg-[#fff8f4]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isSaving}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#D04900] text-[13px] font-medium text-white transition-colors hover:bg-[#b94400] disabled:opacity-60"
          >
            {(isSubmitting || isSaving) && <Loader2 className="size-4 animate-spin" />}
            Add Item
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
      {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
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
        <span className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.18)] transition-transform",
          checked ? "translate-x-5" : "translate-x-0.5"
        )} />
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
    disabled  ? "cursor-not-allowed bg-black/[0.03] text-black/30" : "text-[#444]"
  );
}