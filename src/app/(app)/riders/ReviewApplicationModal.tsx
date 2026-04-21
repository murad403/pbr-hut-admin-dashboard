import React from 'react';
import { Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useApproveRiderMutation, useDeclineRiderMutation } from '@/redux/features/dashboard/dashboard.api';
import type { RiderEntity } from '@/redux/features/dashboard/dashboard.type';

interface ReviewApplicationModalProps {
  application: RiderEntity;
  onClose: () => void;
}

export default function ReviewApplicationModal({ application, onClose }: ReviewApplicationModalProps) {
  const [rejectionReason, setRejectionReason] = React.useState('');
  const [approveRider, { isLoading: isApproving }] = useApproveRiderMutation();
  const [declineRider, { isLoading: isDeclining }] = useDeclineRiderMutation();
  const isSubmitting = isApproving || isDeclining;

  const getErrorMessage = (error: unknown) => {
    if (
      typeof error === 'object' &&
      error !== null &&
      'data' in error &&
      typeof (error as { data?: unknown }).data === 'object' &&
      (error as { data?: unknown }).data !== null &&
      'message' in ((error as { data?: { message?: unknown } }).data ?? {})
    ) {
      const maybeMessage = (error as { data?: { message?: unknown } }).data?.message;
      if (typeof maybeMessage === 'string' && maybeMessage.trim()) {
        return maybeMessage;
      }
    }

    return 'Request failed. Please try again.';
  };

  const handleApprove = async () => {
    try {
      await approveRider({ userId: application.userId }).unwrap();
      toast.success('Rider NID approved successfully');
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleDecline = async () => {
    const reason = rejectionReason.trim();
    if (!reason) {
      toast.error('Rejection reason is required');
      return;
    }

    try {
      await declineRider({ userId: application.userId, rejectionReason: reason }).unwrap();
      toast.success('Rider NID declined successfully');
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-xl bg-white p-6 shadow-xl my-8">
        {/* Header with Close Button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-title">Review Application</h2>
          <button
            disabled={isSubmitting}
            onClick={onClose}
            className="inline-flex items-center justify-center p-1 hover:bg-black/5 rounded transition-colors disabled:opacity-60"
          >
            <X className="h-5 w-5 text-title/60" />
          </button>
        </div>

        {/* Applicant Profile */}
         <div className="flex items-center gap-3 pb-4 border-b border-black/5 mb-6">
          <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-lg font-bold text-orange-600">
            {application.user.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-sm md:text-base font-semibold text-title">{application.user.name}</h3>
            <p className="text-xs text-description">{application.user.email}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm font-semibold text-description mb-1">Phone</p>
            <p className="text-sm text-title font-medium">{application.user.phone}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-description mb-1">NID Status</p>
            <p className="text-sm text-title font-medium">{application.nidStatus}</p>
          </div>
        </div>

        {/* Government ID Card */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-description mb-2">Govt. Issued ID Card</p>
          <div className="grid grid-cols-2 gap-3 overflow-hidden rounded-lg">
            <div>
              {application.nidBackUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={application.nidBackUrl} alt="ID card back" className="h-34.25 w-full object-cover rounded-md" />
                </>
              ) : (
                <div className="h-34.25 w-full rounded-md border border-black/10 bg-black/3 text-description text-xs flex items-center justify-center">
                  No ID back image
                </div>
              )}
            </div>
            <div >
              {application.nidFrontUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={application.nidFrontUrl} alt="ID card front" className="h-34.25 w-full object-cover rounded-md" />
                </>
              ) : (
                <div className="h-34.25 w-full rounded-md border border-black/10 bg-black/3 text-description text-xs flex items-center justify-center">
                  No ID front image
                </div>
              )}
            </div>

          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm font-semibold text-description mb-2">Rejection Reason</p>
          <Input
            value={rejectionReason}
            onChange={(event) => setRejectionReason(event.target.value)}
            placeholder="Write reason if declining"
            disabled={isSubmitting}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 ">
          <Button
            variant="outline"
            onClick={handleDecline}
            disabled={isSubmitting}
            className="flex-1 py-3 text-red-600 border-red-300 hover:bg-red-50 text-sm font-medium rounded-xl cursor-pointer"
          >
            {isDeclining ? <Loader2 className="size-4 animate-spin" /> : null}
            Decline request
          </Button>
          <Button
            onClick={handleApprove}
            disabled={isSubmitting}
            className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl cursor-pointer"
          >
            {isApproving ? <Loader2 className="size-4 animate-spin" /> : null}
            Approve
          </Button>
        </div>
      </div>
    </div>
  );
}
