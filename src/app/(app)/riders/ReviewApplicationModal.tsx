import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import card1 from "@/assets/card/back.png"
import card2 from "@/assets/card/front.png"

interface PendingApplication {
  id: string;
  name: string;
  date: string;
  email: string;
  phone: string;
  profileImage?: string;
  idCard?: string;
  address?: string;
  deliveryHistory?: {
    today: number;
    delivered: number;
    totalIncome: string;
  };
}

interface ReviewApplicationModalProps {
  application: PendingApplication;
  onClose: () => void;
}

export default function ReviewApplicationModal({ application, onClose }: ReviewApplicationModalProps) {
  const handleApprove = () => {
    console.log('Approved:', application.id);
    onClose();
  };

  const handleDecline = () => {
    console.log('Declined:', application.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-xl bg-white p-6 shadow-xl my-8">
        {/* Header with Close Button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-title">Review Application</h2>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center p-1 hover:bg-black/5 rounded transition-colors"
          >
            <X className="h-5 w-5 text-title/60" />
          </button>
        </div>

        {/* Applicant Profile */}
         <div className="flex items-center gap-3 pb-4 border-b border-black/5 mb-6">
          <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-lg font-bold text-orange-600">
            {application.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-sm md:text-base font-semibold text-title">{application.name}</h3>
            <p className="text-xs text-description">{application.email}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm font-semibold text-description mb-1">Phone</p>
            <p className="text-sm text-title font-medium">{application.phone}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-description mb-1">Address</p>
            <p className="text-sm text-title font-medium">{application.address}</p>
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
        {application.deliveryHistory && (
          <div className="mb-6">
            <p className="text-sm font-semibold text-description mb-3">Delivery History</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-black/8 p-3 text-center">
                <p className="text-xl md:text-2xl font-bold text-title mb-0.5">${application.deliveryHistory.today}</p>
                <p className="text-sm text-description">Today</p>
              </div>
              <div className="rounded-lg border border-black/8 p-3 text-center">
                <p className="text-xl md:text-2xl font-bold text-title mb-0.5">{application.deliveryHistory.delivered}</p>
                <p className="text-sm text-description">Delivered</p>
              </div>
              <div className="rounded-lg border border-black/8 p-3 text-center">
                <p className="text-xl md:text-2xl font-bold text-title mb-0.5">{application.deliveryHistory.totalIncome}</p>
                <p className="text-sm text-description">Total Income</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 ">
          <Button
            variant="outline"
            onClick={handleDecline}
            className="flex-1 py-3 text-red-600 border-red-300 hover:bg-red-50 text-sm font-medium rounded-xl cursor-pointer"
          >
            Decline request
          </Button>
          <Button
            onClick={handleApprove}
            className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl cursor-pointer"
          >
            Approve
          </Button>
        </div>
      </div>
    </div>
  );
}
