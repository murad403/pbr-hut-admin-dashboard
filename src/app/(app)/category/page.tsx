"use client";

import { useState } from "react";
import { ChevronRight, Plus, Pencil, Trash2, Loader2, Tag, Layers, AlertTriangle } from "lucide-react";
import {
  useCreateCategoryMutation,
  useCreateSubCategoryMutation,
  useDeleteCategoryMutation,
  useDeleteSubCategoryMutation,
  useListCategoriesQuery,
  useUpdateCategoryMutation,
  useUpdateSubCategoryMutation,
} from "@/redux/features/dashboard/dashboard.api";
import type { Category, SubCategory } from "@/redux/features/dashboard/dashboard.type";
import { Button } from "@/components/ui/button";

function ConfirmDeleteModal({
  label,
  onConfirm,
  onCancel,
  loading,
}: {
  label: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-[2px]">
      <div className="w-full max-w-sm rounded-xl border border-black/8 bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
        <div className="mb-5 flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-500">
            <AlertTriangle size={16} />
          </div>
          <div>
            <p className="mb-1 text-sm font-semibold text-title">Confirm Delete</p>
            <p className="text-xs leading-relaxed text-description">{label}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-lg border border-black/10 px-4 py-2 text-xs font-medium text-title hover:bg-black/5"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg bg-red-500 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function InlineInput({
  defaultValue = "",
  placeholder = "Enter name...",
  onConfirm,
  onCancel,
  loading,
}: {
  defaultValue?: string;
  placeholder?: string;
  onConfirm: (v: string) => void;
  onCancel: () => void;
  loading?: boolean;
}) {
  const [val, setVal] = useState(defaultValue);

  return (
    <span className="inline-flex flex-wrap items-center gap-2" onClick={(event) => event.stopPropagation()}>
      <input
        autoFocus
        value={val}
        placeholder={placeholder}
        onChange={(event) => setVal(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") onConfirm(val);
          if (event.key === "Escape") onCancel();
        }}
        className="h-10 w-48 rounded-md border border-black/10 bg-white px-3 text-sm text-title outline-none placeholder:text-black/40 focus-visible:ring-2 focus-visible:ring-black/10"
      />
      <button
        onClick={() => onConfirm(val)}
        disabled={loading || !val.trim()}
        className="flex items-center gap-1.5 rounded-md bg-[#D94906] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#c34105] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? <Loader2 size={12} className="animate-spin" /> : null}
        Save
      </button>
      <button
        onClick={onCancel}
        className="rounded-md border border-black/10 px-2 py-2 text-xs text-description hover:bg-black/5"
      >
        X
      </button>
    </span>
  );
}

function SubCategoryRow({ sub }: { sub: SubCategory }) {
  const [editing, setEditing] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [updateSub, { isLoading: updating }] = useUpdateSubCategoryMutation();
  const [deleteSub, { isLoading: deleting }] = useDeleteSubCategoryMutation();

  return (
    <>
      <div className="group mb-1.5 flex items-center justify-between rounded-xl border border-black/8 bg-white px-4 py-2.5 transition-colors hover:bg-black/2">
        <div className="min-w-0 flex items-center gap-3">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#D94906]/60" />
          {editing ? (
            <InlineInput
              defaultValue={sub.name}
              onConfirm={async (name) => {
                if (!name.trim()) return;
                await updateSub({ subId: sub.id, name: name.trim() });
                setEditing(false);
              }}
              onCancel={() => setEditing(false)}
              loading={updating}
            />
          ) : (
            <span className="truncate text-sm text-title">{sub.name}</span>
          )}
        </div>

        {!editing ? (
          <div className="ml-2 flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={() => setEditing(true)}
              className="rounded-lg p-1.5 text-description transition-colors hover:bg-[#D94906]/10 hover:text-[#D94906]"
              title="Edit"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={() => setConfirmDel(true)}
              className="rounded-lg p-1.5 text-description transition-colors hover:bg-red-500/10 hover:text-red-500"
              title="Delete"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ) : null}
      </div>

      {confirmDel ? (
        <ConfirmDeleteModal
          label={`Delete sub-category "${sub.name}"? This cannot be undone.`}
          onConfirm={async () => {
            await deleteSub(sub.id);
            setConfirmDel(false);
          }}
          onCancel={() => setConfirmDel(false)}
          loading={deleting}
        />
      ) : null}
    </>
  );
}

function AddSubCategoryRow({
  categoryId,
  onDone,
}: {
  categoryId: string;
  onDone: () => void;
}) {
  const [createSub, { isLoading }] = useCreateSubCategoryMutation();

  return (
    <div className="px-2 py-2">
      <InlineInput
        placeholder="Sub-category name..."
        onConfirm={async (name) => {
          if (!name.trim()) return;
          await createSub({ categoryId, name: name.trim() });
          onDone();
        }}
        onCancel={onDone}
        loading={isLoading}
      />
    </div>
  );
}

function CategoryCard({
  category,
  index,
}: {
  category: Category;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const [editName, setEditName] = useState(false);
  const [addingSub, setAddingSub] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  const [updateCat, { isLoading: updating }] = useUpdateCategoryMutation();
  const [deleteCat, { isLoading: deleting }] = useDeleteCategoryMutation();

  const subCount = category.subCategories?.length ?? 0;

  return (
    <>
      <div
        className="group/card overflow-hidden rounded-2xl border border-black/8 bg-white transition-all duration-200 hover:border-black/15 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div
          className="flex cursor-pointer select-none items-center gap-3 px-5 py-4"
          onClick={() => !editName && setOpen((prev) => !prev)}
        >
          <ChevronRight
            size={15}
            className={`shrink-0 text-description transition-transform duration-300 ${open ? "rotate-90" : ""}`}
          />

          {editName ? (
            <span className="flex-1">
              <InlineInput
                defaultValue={category.name}
                onConfirm={async (name) => {
                  if (!name.trim()) return;
                  await updateCat({ id: category.id, name: name.trim() });
                  setEditName(false);
                }}
                onCancel={() => setEditName(false)}
                loading={updating}
              />
            </span>
          ) : (
            <span className="flex-1 truncate text-sm font-semibold tracking-wide text-title">{category.name}</span>
          )}

          <span className="shrink-0 rounded-full border border-black/10 bg-black/3 px-2.5 py-0.5 text-[11px] font-medium text-description">
            {subCount} {subCount === 1 ? "sub" : "subs"}
          </span>

          {!editName ? (
            <div
              className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover/card:opacity-100"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                onClick={() => {
                  setEditName(true);
                  setOpen(true);
                }}
                className="rounded-lg p-1.5 text-description transition-colors hover:bg-[#D94906]/10 hover:text-[#D94906]"
                title="Rename category"
              >
                <Pencil size={13} />
              </button>
              <button
                onClick={() => setConfirmDel(true)}
                className="rounded-lg p-1.5 text-description transition-colors hover:bg-red-500/10 hover:text-red-500"
                title="Delete category"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ) : null}
        </div>

        {open ? (
          <div className="border-t border-black/8 bg-black/1.5 px-4 pb-4 pt-3">
            {subCount === 0 && !addingSub ? (
              <p className="mb-3 px-2 text-xs text-description">No sub-categories yet.</p>
            ) : null}

            {category.subCategories?.map((sub) => (
              <SubCategoryRow key={sub.id} sub={sub} />
            ))}

            {addingSub ? (
              <AddSubCategoryRow categoryId={category.id} onDone={() => setAddingSub(false)} />
            ) : (
              <button
                onClick={() => setAddingSub(true)}
                className="ml-1 mt-1 flex items-center gap-1.5 rounded-xl border border-dashed border-black/12 px-3 py-2 text-xs text-description transition-colors hover:border-[#D94906]/40 hover:text-[#D94906]"
              >
                <Plus size={13} />
                Add sub-category
              </button>
            )}
          </div>
        ) : null}
      </div>

      {confirmDel ? (
        <ConfirmDeleteModal
          label={`Delete "${category.name}" and all its sub-categories? This cannot be undone.`}
          onConfirm={async () => {
            await deleteCat(category.id);
            setConfirmDel(false);
          }}
          onCancel={() => setConfirmDel(false)}
          loading={deleting}
        />
      ) : null}
    </>
  );
}

function AddCategoryBar() {
  const [open, setOpen] = useState(false);
  const [createCat, { isLoading }] = useCreateCategoryMutation();

  if (open) {
    return (
      <div className="mb-5 flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-5 py-4">
        <Tag size={15} className="shrink-0 text-[#D94906]" />
        <span className="shrink-0 text-sm text-description">New category:</span>
        <InlineInput
          placeholder="e.g. Pizzas"
          onConfirm={async (name) => {
            if (!name.trim()) return;
            await createCat({ name: name.trim() });
            setOpen(false);
          }}
          onCancel={() => setOpen(false)}
          loading={isLoading}
        />
      </div>
    );
  }

  return (
    <Button
    variant="outline"
      onClick={() => setOpen(true)}
      className="rounded-full border-[#F6C6A6] px-4 text-[#D94906]"
    >
      <Plus size={15} />
      New Category
    </Button>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-black/8 bg-white px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="h-3.5 w-3.5 rounded bg-black/10" />
        <div className="h-4 w-40 rounded-lg bg-black/10" />
        <div className="ml-auto h-5 w-14 rounded-full bg-black/10" />
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  const { data: categories, isLoading, isError } = useListCategoriesQuery();

  const totalSubs = categories?.reduce((acc, category) => acc + (category.subCategories?.length ?? 0), 0) ?? 0;

  return (
    <div>
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl text-[#D94906]">
                <Layers size={16} />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-title">Categories</h1>
            </div>
            {!isLoading && categories ? (
              <p className="pl-10.5 text-xs text-description">
                {categories.length} categories &middot; {totalSubs} sub-categories
              </p>
            ) : null}
          </div>

          <AddCategoryBar />
        </div>

        {isError ? (
          <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/8 px-5 py-4 text-sm text-red-500">
            <AlertTriangle size={16} className="shrink-0" />
            Failed to load categories. Please try again.
          </div>
        ) : null}

        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : null}

        {!isLoading && !isError && categories?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-black/5 text-description">
              <Tag size={24} />
            </div>
            <p className="text-sm font-medium text-title">No categories yet</p>
            <p className="mt-1 text-xs text-description">Create your first category to get started.</p>
          </div>
        ) : null}

        {!isLoading && !isError && categories && categories.length > 0 ? (
          <div className="flex flex-col gap-3">
            {categories.map((category, index) => (
              <CategoryCard key={category.id} category={category} index={index} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
