'use client';

import React from 'react';
import Image from 'next/image';
import { CirclePlus, Trash2 } from 'lucide-react';

import CreateBannerModal from './CreateBannerModal';
import { cn } from '@/lib/utils';
import cardBack from '@/assets/card/back.png';

type BannerRow = {
  id: string;
  title: string;
  campaign: string;
  ctaTitle: string;
  ctaColor: string;
  clicks: number;
  status: 'ACTIVE';
  image: typeof cardBack;
};

const bannerRows: BannerRow[] = [
  {
    id: '1',
    title: 'Summer Flash Sale',
    campaign: 'Campaign: Summer_24_V1',
    ctaTitle: 'Shop Now',
    ctaColor: '#000000',
    clicks: 4200,
    status: 'ACTIVE',
    image: cardBack,
  },
  {
    id: '2',
    title: 'Summer Flash Sale',
    campaign: 'Campaign: Summer_24_V1',
    ctaTitle: 'Shop Now',
    ctaColor: '#000000',
    clicks: 4200,
    status: 'ACTIVE',
    image: cardBack,
  },
];

export default function BannerAdsPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

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
                      <Image src={row.image} alt={row.title} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-title">{row.title}</p>
                      <p className="text-xs text-description">{row.campaign}</p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <div className="space-y-1.5">
                    <p className="inline-flex items-center gap-2 text-sm text-title">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: row.ctaColor }} />
                      {row.ctaTitle}
                    </p>
                    <div className=" w-40 rounded-sm bg-black/8 px-1 py-1 flex text-xs text-black/55">{row.ctaColor}</div>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <p className="text-sm font-semibold text-title">4.2K <span className="font-normal text-black/50">clicks</span></p>
                  <div className="mt-1 h-1.5 w-40 rounded-full bg-[#D7E5F8]">
                    <div className="h-1.5 w-3/4 rounded-full bg-[#1677FF]" />
                  </div>
                </td>

                <td className="px-4 py-3">
                  <span className="inline-flex rounded-full bg-[#22C55E] px-2.5 py-1 text-[11px] font-semibold uppercase text-white">
                    {row.status}
                  </span>
                </td>

                <td className="px-4 py-3 text-center">
                  <button type="button" className="inline-flex items-center justify-center text-[#FF4D4F]" aria-label="Delete banner">
                    <Trash2 className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen ? <CreateBannerModal onClose={() => setIsModalOpen(false)} /> : null}
    </div>
  );
}
