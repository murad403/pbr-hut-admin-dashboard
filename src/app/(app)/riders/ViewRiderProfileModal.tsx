import React from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';
import card1 from "@/assets/card/back.png"
import card2 from "@/assets/card/front.png"

interface Rider {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: 'AVAILABLE' | 'OFFLINE';
  deliveredToday: number;
  earned: string;
  profileImage?: string;
}

interface ViewRiderProfileModalProps {
  rider: Rider;
  onClose: () => void;
}

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
            {rider.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-sm md:text-base font-semibold text-title">{rider.name}</h3>
            <p className="text-xs text-description">{rider.email}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm font-semibold text-description mb-1">Phone</p>
            <p className="text-sm text-title font-medium">{rider.phone}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-description mb-1">Address</p>
            <p className="text-sm text-title font-medium">15 Ocean Aven, Albion</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-description mb-1">ID Verified</p>
            <div>
              <span className="inline-block px-2 py-1 rounded-full text-sm font-semibold bg-green-600 text-white">
                VERIFIED
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-description mb-1">Status</p>
            <div>
              <span className="inline-block px-2 py-1 rounded-full text-sm font-semibold bg-green-600 text-white">
                ONLINE
              </span>
            </div>
          </div>
        </div>

        {/* Government ID Card */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-description mb-2">Govt. Issued ID Card</p>
          <div className="grid grid-cols-2 gap-3 overflow-hidden rounded-lg">
            <div>
              <Image src={card2} alt="ID card back" width={211} height={137} className="object-cover rounded-md" />
            </div>
            <div >
              <Image src={card1} alt="ID card front" width={211} height={137} className="object-cover rounded-md" />
            </div>

          </div>
        </div>

        {/* Delivery History */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-description mb-3">Delivery History</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-black/8 p-3 text-center">
              <p className="text-xl md:text-2xl font-bold text-title mb-0.5">${rider.deliveredToday}</p>
              <p className="text-sm text-description">Today</p>
            </div>
            <div className="rounded-lg border border-black/8 p-3 text-center">
              <p className="text-xl md:text-2xl font-bold text-title mb-0.5">0</p>
              <p className="text-sm text-description">Delivered</p>
            </div>
            <div className="rounded-lg border border-black/8 p-3 text-center">
              <p className="text-xl md:text-2xl font-bold text-title mb-0.5">{rider.earned}</p>
              <p className="text-sm text-description">Total Income</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
