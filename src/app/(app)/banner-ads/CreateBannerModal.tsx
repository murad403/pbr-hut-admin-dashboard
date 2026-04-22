'use client';

import React from 'react';
import Image from 'next/image';
import { FileImage, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useAddBannerAdsMutation } from '@/redux/features/dashboard/dashboard.api';

type CreateBannerModalProps = {
  onClose: () => void;
};

const ctaColors = ['#000000', '#1D4ED8', '#EC4899', '#F59E0B'];

export default function CreateBannerModal({ onClose }: CreateBannerModalProps) {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [addBannerAds, { isLoading: isSaving }] = useAddBannerAdsMutation();

  const [order, setOrder] = React.useState(1);
  const [ctaTitle, setCtaTitle] = React.useState('');
  const [ctaColor, setCtaColor] = React.useState(ctaColors[0]);
  const [targetType, setTargetType] = React.useState<'ITEM' | 'URL'>('ITEM');
  const [targetData, setTargetData] = React.useState('');
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = React.useState<string>('');

  const showPreview = uploadedImage.length > 0 && ctaTitle.trim().length > 0 && ctaColor.length > 0;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    const objectUrl = URL.createObjectURL(file);
    setUploadedImage((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return objectUrl;
    });
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a banner image');
      return;
    }

    if (!ctaTitle.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!targetData.trim()) {
      toast.error('Please enter target data');
      return;
    }

    const formData = new FormData();
    formData.append(
      'data',
      JSON.stringify({
        order,
        title: ctaTitle.trim(),
        color: ctaColor,
        type: targetType,
        data: targetData.trim(),
      })
    );
    formData.append('media', selectedFile);

    try {
      await addBannerAds(formData).unwrap();
      toast.success('Banner created successfully');
      onClose();
    } catch {
      toast.error('Failed to create banner');
    }
  };

  React.useEffect(() => {
    return () => {
      if (uploadedImage) URL.revokeObjectURL(uploadedImage);
    };
  }, [uploadedImage]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-3 backdrop-blur-[1px]">
      <div className="flex w-full max-w-270 items-start gap-4">
        <div className="w-full max-w-135 rounded-xl bg-white p-4 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="inline-flex items-center gap-2 text-base font-semibold text-title">
              <FileImage className="size-4 text-[#1677FF]" />
              Asset Configuration
            </h3>
            <button type="button" onClick={onClose} className="inline-flex rounded-md p-1 text-black/60 hover:bg-black/5" aria-label="Close">
              <X className="size-4" />
            </button>
          </div>

          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mb-4 flex h-40 w-full flex-col items-center justify-center rounded-lg border border-dashed border-black/15 bg-[#F5F7FA]"
          >
            <span className="mb-2 inline-flex size-9 items-center justify-center rounded-lg bg-white text-[#1677FF] shadow-sm">
              <Upload className="size-4" />
            </span>
            <p className="text-sm font-semibold text-title">Drop banner asset here</p>
            <p className="mt-1 text-xs text-black/50">Recommended: 1080x1920px, SVG, PNG, JPG</p>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-black/60">CTA Title</label>
              <input
                value={ctaTitle}
                onChange={(event) => setCtaTitle(event.target.value)}
                placeholder="e.g. Shop Now"
                className="h-10 w-full rounded-md border border-black/10 bg-white px-3 text-sm text-title outline-none placeholder:text-black/35"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-black/60">CTA Button Color</label>
              <div className="flex h-10 items-center rounded-md border border-black/10 bg-white px-2">
                {ctaColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setCtaColor(color)}
                    className={cn(
                      'mr-1.5 h-5 w-5 rounded-full border',
                      ctaColor === color ? 'border-white ring-2 ring-black/70' : 'border-black/20'
                    )}
                    style={{ backgroundColor: color }}
                    aria-label={`Select ${color}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-black/60">Order</label>
              <input
                type="number"
                min={1}
                value={order}
                onChange={(event) => setOrder(Number(event.target.value) || 1)}
                className="h-10 w-full rounded-md border border-black/10 bg-white px-3 text-sm text-title outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-black/60">Type</label>
              <select
                value={targetType}
                onChange={(event) => setTargetType(event.target.value as 'ITEM' | 'URL')}
                className="h-10 w-full rounded-md border border-black/10 bg-white px-3 text-sm text-title outline-none"
              >
                <option value="ITEM">ITEM</option>
                <option value="URL">URL</option>
              </select>
            </div>
          </div>

          <div className="mt-3">
            <label className="mb-1 block text-xs font-semibold uppercase text-black/60">Target Data</label>
            <input
              value={targetData}
              onChange={(event) => setTargetData(event.target.value)}
              placeholder={targetType === 'ITEM' ? 'Item ID' : 'https://example.com'}
              className="h-10 w-full rounded-md border border-black/10 bg-white px-3 text-sm text-title outline-none placeholder:text-black/35"
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-full border border-[#F6C6A6] text-sm font-semibold text-[#D94906]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpload}
              disabled={isSaving}
              className="h-10 rounded-full bg-[#D94906] text-sm font-semibold text-white hover:bg-[#c34105]"
            >
              {isSaving ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>

        <div className="hidden w-full max-w-95 rounded-xl bg-white p-4 shadow-xl md:block">
          <h3 className="mb-4 inline-flex items-center gap-2 text-base font-semibold text-title">
            <FileImage className="size-4 text-[#1677FF]" />
            Mobile Preview
          </h3>

          <div className="mx-auto w-68 rounded-[22px] bg-[#0F1B35] p-2.5">
            <div className="relative h-120 w-full overflow-hidden rounded-[18px] bg-[#F5F7FA]">
              <div className="absolute left-1/2 top-0 h-5 w-18 -translate-x-1/2 rounded-b-xl bg-[#0F1B35]" />

              {showPreview ? (
                <>
                  <Image src={uploadedImage} alt="Banner preview" fill className="object-cover" unoptimized />
                  <div className="absolute inset-x-0 bottom-16 px-3 text-center">
                    <p className="mb-2 text-4 font-semibold leading-5 text-white drop-shadow">{ctaTitle}</p>
                    <button
                      type="button"
                      className="h-8 rounded-md px-4 text-xs font-semibold text-white"
                      style={{ backgroundColor: ctaColor }}
                    >
                      {ctaTitle}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute inset-x-0 bottom-16 px-3 text-center">
                    <p className="mb-2 text-4 font-semibold leading-5 text-white">Summer Flash Sale</p>
                    <button type="button" className="h-8 rounded-md bg-black px-4 text-xs font-semibold text-white">
                      Shop Now
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-black/55">Changes update in real-time</p>
        </div>
      </div>
    </div>
  );
}
