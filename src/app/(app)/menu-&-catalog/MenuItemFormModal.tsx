"use client";

import React from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { MenuCategory } from "@/redux/features/dashboard/dashboard.type";

import { addItemSchema, type AddItemFormValues } from "./validation/add-item.validation";

type MenuItemFormModalProps = {
    title: string;
    open: boolean;
    isSaving: boolean;
    categories: MenuCategory[];
    initialValues: AddItemFormValues;
    submitLabel: string;
    onClose: () => void;
    onSave: (values: AddItemFormValues) => Promise<void> | void;
};

const MenuItemFormModal = ({
    title,
    open,
    isSaving,
    categories,
    initialValues,
    submitLabel,
    onClose,
    onSave,
}: MenuItemFormModalProps) => {
    const form = useForm<AddItemFormValues>({
        resolver: zodResolver(addItemSchema),
        defaultValues: initialValues,
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
    const selectedCategoryId = useWatch({ control, name: "categoryId" });
    const selectedSubCategoryId = useWatch({ control, name: "subCategoryId" });

    const sizeVariants = useFieldArray({ control, name: "sizeVariants" });
    const extras = useFieldArray({ control, name: "extras" });

    const selectedCategory = React.useMemo(
        () => categories.find((category) => category.id === selectedCategoryId),
        [categories, selectedCategoryId]
    );

    React.useEffect(() => {
        if (!open) {
            return;
        }

        reset(initialValues);
    }, [initialValues, open, reset]);

    React.useEffect(() => {
        if (!selectedCategoryId) {
            if (selectedSubCategoryId) {
                setValue("subCategoryId", "");
            }

            return;
        }

        const hasSelectedSubCategory = selectedCategory?.subCategories.some(
            (subCategory) => subCategory.id === selectedSubCategoryId
        );

        if (selectedCategory && !hasSelectedSubCategory) {
            setValue("subCategoryId", "");
        }
    }, [selectedCategory, selectedCategoryId, selectedSubCategoryId, setValue]);

    const submitHandler = handleSubmit(async (values) => {
        await onSave(values);
    });

    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-3 py-4 backdrop-blur-[2px]">
            <div className="relative w-full max-w-xl rounded-[18px] border border-black/5 bg-white p-4 shadow-[0_22px_64px_rgba(0,0,0,0.16)] sm:p-5">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-3.5 top-3.5 inline-flex h-7 w-7 items-center justify-center rounded-full text-black/65 transition-colors hover:bg-black/5 hover:text-black"
                    aria-label="Close modal"
                >
                      <X className="size-4" />
                </button>

                <form className="space-y-3" onSubmit={submitHandler}>
                    <div className="pr-8">
                        <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-[#151515]">{title}</h2>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="mb-1 block text-[12px] font-medium text-[#222]">Item Name*</label>
                            <Input
                                className="h-10 rounded-md border-black/10 px-3 text-[13px] placeholder:text-black/30"
                                placeholder="e.g. Pepperoni Spicy Pizza"
                                {...register("itemName")}
                            />
                            {errors.itemName ? <p className="mt-1 text-[11px] text-red-500">{errors.itemName.message}</p> : null}
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-[12px] font-medium text-[#222]">Category*</label>
                                <select
                                      className="h-10 w-full rounded-md border border-black/10 bg-white px-3 text-[13px] text-[#444] outline-none transition focus:ring-2 focus:ring-black/10 disabled:cursor-not-allowed disabled:bg-black/5"
                                    {...register("categoryId")}
                                >
                                    <option value="">Select category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.categoryId ? <p className="mt-1 text-[11px] text-red-500">{errors.categoryId.message}</p> : null}
                            </div>

                            <div>
                                <label className="mb-1 block text-[12px] font-medium text-[#222]">Sub-category*</label>
                                <select
                                      className="h-10 w-full rounded-md border border-black/10 bg-white px-3 text-[13px] text-[#444] outline-none transition focus:ring-2 focus:ring-black/10 disabled:cursor-not-allowed disabled:bg-black/5"
                                    {...register("subCategoryId")}
                                    disabled={!selectedCategoryId}
                                >
                                    <option value="">Select sub-category</option>
                                    {(selectedCategory?.subCategories ?? []).map((subCategory) => (
                                        <option key={subCategory.id} value={subCategory.id}>
                                            {subCategory.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.subCategoryId ? <p className="mt-1 text-[11px] text-red-500">{errors.subCategoryId.message}</p> : null}
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-[12px] font-medium text-[#222]">Description*</label>
                            <textarea
                                rows={4}
                                className="min-h-27 w-full rounded-md border border-black/10 bg-white px-3 py-2.5 text-[13px] text-[#222] outline-none placeholder:text-black/30 focus:ring-2 focus:ring-black/10"
                                placeholder="Write a description for your item"
                                {...register("description")}
                            />
                            {errors.description ? <p className="mt-1 text-[11px] text-red-500">{errors.description.message}</p> : null}
                        </div>

                        <div>
                            <label className="mb-1 block text-[12px] font-medium leading-tight text-[#222]">
                                What you&apos;re offering with the item (Customers can select single item)*
                            </label>
                            <Input
                                className="h-10 rounded-md border-black/10 px-3 text-[13px] placeholder:text-black/30"
                                placeholder="e.g. Salad"
                                {...register("offeringItem")}
                            />
                            {errors.offeringItem ? <p className="mt-1 text-[11px] text-red-500">{errors.offeringItem.message}</p> : null}
                        </div>
                    </div>

                    <SectionRow
                        title="Size Variants (set price)"
                        checked={sizeVariantsEnabled}
                        onToggle={(checked) => setValue("sizeVariantsEnabled", checked, { shouldValidate: true })}
                    />

                    {sizeVariantsEnabled ? (
                        <div className="space-y-2 pt-1">
                            <div className="grid grid-cols-3 gap-2.5">
                                {sizeVariants.fields.map((field, index) => (
                                    <div key={field.id} className="space-y-1">
                                        <p className="text-[11px] font-medium text-[#252525]">{field.label}</p>
                                        <Input
                                              className="h-10 rounded-md border-black/10 px-3 text-[13px] placeholder:text-black/30"
                                            placeholder=""
                                            {...register(`sizeVariants.${index}.price`)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    <div className="space-y-2.5">
                        <SectionRow
                            title="Delivery Available"
                            checked={deliveryAvailable}
                            onToggle={(checked) => setValue("deliveryAvailable", checked, { shouldValidate: true })}
                        />

                        <SectionRow
                            title="Item Available"
                            checked={itemAvailable}
                            onToggle={(checked) => setValue("itemAvailable", checked, { shouldValidate: true })}
                        />

                        <SectionRow
                            title="Add Extras"
                            checked={addExtrasEnabled}
                            onToggle={(checked) => setValue("addExtrasEnabled", checked, { shouldValidate: true })}
                        />
                    </div>

                    {addExtrasEnabled ? (
                        <div className="space-y-2 pt-1">
                            <div className="grid grid-cols-3 gap-2.5">
                                {extras.fields.map((field, index) => (
                                    <div key={field.id} className="space-y-1">
                                        <p className="text-[11px] font-medium text-[#252525]">{field.label || `Extra ${index + 1}`}</p>
                                        <Input
                                              className="h-10 rounded-md border-black/10 px-3 text-[13px] placeholder:text-black/30"
                                            placeholder=""
                                            {...register(`extras.${index}.price`)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="h-10 flex-1 rounded-full border-[#f4cbb7] bg-white text-[13px] font-medium text-[#D94906] shadow-none hover:bg-[#fff8f4]"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="h-10 flex-1 rounded-full bg-[#D04900] text-[13px] font-medium text-white shadow-none hover:bg-[#b94400]"
                            disabled={isSubmitting || isSaving}
                        >
                            {isSubmitting || isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
                            {submitLabel}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

type SectionRowProps = {
    title: string;
    checked: boolean;
    onToggle: (checked: boolean) => void;
};

const SectionRow = ({ title, checked, onToggle }: SectionRowProps) => {
    return (
        <div className="flex items-center justify-between gap-3 rounded-[14px] border border-black/10 px-3 py-2.5">
            <p className="text-[13px] font-medium text-[#252525]">{title}</p>
            <ToggleSwitch checked={checked} onChange={onToggle} />
        </div>
    );
};

type ToggleSwitchProps = {
    checked: boolean;
    onChange: (checked: boolean) => void;
};

const ToggleSwitch = ({ checked, onChange }: ToggleSwitchProps) => {
    return (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            aria-pressed={checked}
            className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full border border-transparent transition-colors",
                checked ? "bg-[#21B26B]" : "bg-[#F0E8E4]"
            )}
        >
            <span
                className={cn(
                    "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.18)] transition-transform",
                    checked ? "translate-x-5" : "translate-x-0.5"
                )}
            />
        </button>
    );
};

export default MenuItemFormModal;