import React from 'react';
import { X } from 'lucide-react';
import type { RiderEntity } from '@/redux/features/dashboard/dashboard.type';

interface ViewRiderProfileModalProps {
  rider: RiderEntity;
  onClose: () => void;
}

const formatCurrency = (amount: string | number) => {
  const numericValue = Number(amount);

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(numericValue) ? numericValue : 0);
};

export default function ViewRiderProfileModal({ rider, onClose }: ViewRiderProfileModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-xl bg-white p-6 shadow-xl my-8">
        {/* Header with Close Button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-title">Rider Profile</h2>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center p-1 hover:bg-black/5 rounded transition-colors"
          >
            <X className="h-5 w-5 text-description" />
          </button>
        </div>

        {/* Rider Profile */}
        <div className="flex items-center gap-3 pb-4 border-b border-black/5 mb-6">
          <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-lg font-bold text-orange-600">
            {rider.user.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-sm md:text-base font-semibold text-title">{rider.user.name}</h3>
            <p className="text-xs text-description">{rider.user.email}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm font-semibold text-description mb-1">Phone</p>
            <p className="text-sm text-title font-medium">{rider.user.phone}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-description mb-1">H3 Index</p>
            <p className="text-sm text-title font-medium">{rider.h3Index}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-description mb-1">Rider ID</p>
            <p className="text-sm text-title font-medium">{rider.userId}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-description mb-1">ID Verified</p>
            <div>
              <span className="inline-block px-2 py-1 rounded-full text-sm font-semibold bg-emerald-600 text-white">
                {rider.nidStatus}
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-description mb-1">Status</p>
            <div>
              <span className="inline-block px-2 py-1 rounded-full text-sm font-semibold bg-green-600 text-white">
                {rider.isAvailable ? 'AVAILABLE' : 'OFFLINE'}
              </span>
            </div>
          </div>
        </div>

        {/* Government ID Card */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-description mb-2">Govt. Issued ID Card</p>
          <div className="grid grid-cols-2 gap-3 overflow-hidden rounded-lg">
            <div>
              {rider.nidBackUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={rider.nidBackUrl} alt="ID card back" className="h-34.25 w-full object-cover rounded-md" />
                </>
              ) : (
                <div className="h-34.25 w-full rounded-md border border-black/10 bg-black/3 text-description text-xs flex items-center justify-center">
                  No ID back image
                </div>
              )}
            </div>
            <div >
              {rider.nidFrontUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={rider.nidFrontUrl} alt="ID card front" className="h-34.25 w-full object-cover rounded-md" />
                </>
              ) : (
                <div className="h-34.25 w-full rounded-md border border-black/10 bg-black/3 text-description text-xs flex items-center justify-center">
                  No ID front image
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Delivery History */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-description mb-3">Delivery History</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-black/8 p-3 text-center">
              <p className="text-xl md:text-2xl font-bold text-title mb-0.5">{formatCurrency(rider.totalEarned)}</p>
              <p className="text-sm text-description">Total Earned</p>
            </div>
            <div className="rounded-lg border border-black/8 p-3 text-center">
              <p className="text-xl md:text-2xl font-bold text-title mb-0.5">{formatCurrency(rider.availableBalance)}</p>
              <p className="text-sm text-description">Available Balance</p>
            </div>
            <div className="rounded-lg border border-black/8 p-3 text-center">
              <p className="text-xl md:text-2xl font-bold text-title mb-0.5">{rider.isBusy ? 'YES' : 'NO'}</p>
              <p className="text-sm text-description">Busy Now</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
