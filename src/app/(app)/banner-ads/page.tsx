'use client';

import React from 'react';
import Image from 'next/image';
import { CirclePlus, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { useDeleteBannerAdsMutation, useGetBannerAdsQuery } from '@/redux/features/dashboard/dashboard.api';
import CreateBannerModal from './CreateBannerModal';

export default function BannerAdsPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const { data: bannerRows = [], isFetching, isError } = useGetBannerAdsQuery();
  const [deleteBannerAds] = useDeleteBannerAdsMutation();
  const maxClicks = React.useMemo(() => Math.max(...bannerRows.map((row) => row.clickCount), 1), [bannerRows]);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteBannerAds(id).unwrap();
      toast.success('Banner deleted successfully');
    } catch {
      toast.error('Failed to delete banner');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-title">Active &amp; Scheduled Banners</h2>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-[#F6C6A6] px-4 text-sm font-semibold text-[#D94906]"
        >
          <CirclePlus className="size-4" />
          Create New Banner
        </button>
      </header>

      <div className="overflow-x-auto rounded-2xl border border-black/8">
        <table className="w-full min-w-230 border-separate border-spacing-0 text-sm">
          <thead className="bg-[#FAFAFA] text-left text-description">
            <tr>
              <th className="px-4 py-3 font-medium">Banner Asset</th>
              <th className="px-4 py-3 font-medium">CTA &amp; Color</th>
              <th className="px-4 py-3 font-medium">Perfomance</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {isFetching ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center">
                  <div className="inline-flex items-center gap-2 text-sm font-medium text-title">
                    <Loader2 className="size-4 animate-spin text-[#D94906]" />
                    Loading banner ads...
                  </div>
                </td>
              </tr>
            ) : null}

            {isError ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-red-500">
                  Failed to load banner ads.
                </td>
              </tr>
            ) : null}

            {bannerRows.map((row, index) => (
              <tr
                key={row.id}
                className={cn(
                  'border-b border-black/8 transition-colors hover:bg-black/3',
                  index % 2 === 1 && 'bg-black/2'
                )}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-14 w-14 overflow-hidden rounded-md">
                      <Image src={row.mediaUrl} alt={row.title} fill className="object-cover" unoptimized />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-title">{row.title}</p>
                      <p className="text-xs text-description">Campaign: {row.type}_{row.order}</p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <div className="space-y-1.5">
                    <p className="inline-flex items-center gap-2 text-sm text-title">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: row.color }} />
                      {row.title}
                    </p>
                    <div className="flex w-40 rounded-sm bg-black/8 px-1 py-1 text-xs text-black/55">{row.color}</div>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <p className="text-sm font-semibold text-title">
                    {row.clickCount.toLocaleString()} <span className="font-normal text-black/50">clicks</span>
                  </p>
                  <div className="mt-1 h-1.5 w-40 rounded-full bg-[#D7E5F8]">
                    <div
                      className="h-1.5 rounded-full bg-[#1677FF]"
                      style={{ width: `${Math.max((row.clickCount / maxClicks) * 100, 8)}%` }}
                    />
                  </div>
                </td>

                <td className="px-4 py-3">
                  <span className="inline-flex rounded-full bg-[#22C55E] px-2.5 py-1 text-[11px] font-semibold uppercase text-white">
                    ACTIVE
                  </span>
                </td>

                <td className="px-4 py-3 text-center">
                  <button
                    type="button"
                    onClick={() => handleDelete(row.id)}
                    disabled={deletingId === row.id}
                    className="inline-flex items-center justify-center text-[#FF4D4F] disabled:opacity-50"
                    aria-label="Delete banner"
                  >
                    {deletingId === row.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                  </button>
                </td>
              </tr>
            ))}

            {!isFetching && !isError && bannerRows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-description">
                  No banner ads found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {isModalOpen ? <CreateBannerModal onClose={() => setIsModalOpen(false)} /> : null}
    </div>
  );
}
