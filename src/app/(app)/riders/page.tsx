'use client';

import React from 'react';
import { Eye, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import CustomPagination from '@/components/shared/CustomPagination';
import { useGetRidersQuery } from '@/redux/features/dashboard/dashboard.api';
import type {
  GetRidersQueryParams,
  RiderEntity,
  RiderFilterStatus,
} from '@/redux/features/dashboard/dashboard.type';
import ViewRiderProfileModal from './ViewRiderProfileModal';
import ReviewApplicationModal from './ReviewApplicationModal';

type RiderTab = {
  label: string;
  status: RiderFilterStatus;
};

const ridersTabs: RiderTab[] = [
  { label: 'Active Rider', status: 'active' },
  { label: 'Pending Application', status: 'pending' },
];

const formatCurrency = (amount: string | number) => {
  const numericValue = Number(amount);

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(numericValue) ? numericValue : 0);
};

const formatDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function RidersPage() {
  const [activeTab, setActiveTab] = React.useState<RiderTab>(ridersTabs[0]);
  const [page, setPage] = React.useState(1);
  const [selectedRider, setSelectedRider] = React.useState<RiderEntity | null>(null);
  const [selectedApplication, setSelectedApplication] = React.useState<RiderEntity | null>(null);

  const queryParams = React.useMemo<GetRidersQueryParams>(
    () => ({
      page,
      limit: 10,
      status: activeTab.status,
    }),
    [activeTab.status, page]
  );

  const { data: ridersResponse, isFetching: isRidersLoading } = useGetRidersQuery(queryParams);

  const riders = ridersResponse?.data ?? [];
  const pagination = ridersResponse?.pagination;

  const handleTabChange = (tab: RiderTab) => {
    setActiveTab(tab);
    setPage(1);
    setSelectedRider(null);
    setSelectedApplication(null);
  };

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between w-full gap-2 md:gap-3">
          <div className="flex flex-wrap items-center gap-2 rounded-full bg-[#FAEEE8] p-1.5 text-sm text-black/65">
            {ridersTabs.map((tab) => (
              <button
                key={tab.status}
                type="button"
                onClick={() => handleTabChange(tab)}
                className={cn(
                  'rounded-full px-3 py-1.5 transition-colors',
                  activeTab.status === tab.status ? 'bg-white text-title shadow-sm' : 'hover:text-title'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section>
        <div className="relative mt-4 overflow-x-auto rounded-2xl border border-black/8">
          {isRidersLoading ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-title shadow-sm">
                <Loader2 className="size-4 animate-spin text-[#D94906]" />
                Loading riders...
              </div>
            </div>
          ) : null}

          <table className="min-w-230 w-full border-separate border-spacing-0 text-sm">
            {activeTab.status === 'active' ? (
              <>
                <thead className="bg-[#FAFAFA] text-left text-description">
                  <tr>
                    <th className="px-4 py-3 font-medium text-description">Rider Name</th>
                    <th className="px-4 py-3 font-medium text-description">Phone</th>
                    <th className="px-4 py-3 font-medium text-description">Email</th>
                    <th className="px-4 py-3 font-medium text-description">Availability</th>
                    <th className="px-4 py-3 font-medium text-description">Total Earned</th>
                    <th className="px-4 py-3 font-medium text-description">Balance</th>
                    <th className="px-4 py-3 font-medium text-description">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {riders.map((rider, index) => (
                    <tr
                      key={rider.userId}
                      className={cn(
                        'border-b border-black/8 transition-colors hover:bg-black/3',
                        index % 2 === 1 && 'bg-black/2'
                      )}
                    >
                      <td className="px-4 py-3 text-title">{rider.user.name}</td>
                      <td className="px-4 py-3 text-title">{rider.user.phone}</td>
                      <td className="px-4 py-3 text-title">{rider.user.email}</td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase text-white',
                            rider.isAvailable ? 'bg-emerald-500' : 'bg-gray-500'
                          )}
                        >
                          {rider.isAvailable ? 'available' : 'offline'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-title">{formatCurrency(rider.totalEarned)}</td>
                      <td className="px-4 py-3 text-title">{formatCurrency(rider.availableBalance)}</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setSelectedRider(rider)}
                          className="text-title cursor-pointer"
                        >
                          <Eye size={17} />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {!isRidersLoading && riders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-description">
                        No active riders found.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </>
            ) : (
              <>
                <thead className="bg-[#FAFAFA] text-left text-description">
                  <tr>
                    <th className="px-4 py-3 font-medium text-description">Applicant Name</th>
                    <th className="px-4 py-3 font-medium text-description">Date</th>
                    <th className="px-4 py-3 font-medium text-description">Email</th>
                    <th className="px-4 py-3 font-medium text-description">Phone</th>
                    <th className="px-4 py-3 font-medium text-description">NID Status</th>
                    <th className="px-4 py-3 font-medium text-description">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {riders.map((rider, index) => (
                    <tr
                      key={rider.userId}
                      className={cn(
                        'border-b border-black/8 transition-colors hover:bg-black/3',
                        index % 2 === 1 && 'bg-black/2'
                      )}
                    >
                      <td className="px-4 py-3 text-title">{rider.user.name}</td>
                      <td className="px-4 py-3 text-title">{formatDate(rider.createdAt)}</td>
                      <td className="px-4 py-3 text-title">{rider.user.email}</td>
                      <td className="px-4 py-3 text-title">{rider.user.phone}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full bg-amber-500 px-2.5 py-1 text-xs font-semibold uppercase text-white">
                          {rider.nidStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setSelectedApplication(rider)}
                          className="text-title cursor-pointer"
                        >
                          <Eye size={17} />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {!isRidersLoading && riders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-description">
                        No pending applications found.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </>
            )}
          </table>
        </div>

        <div className="mt-4">
          <CustomPagination
            page={pagination?.page ?? page}
            totalPages={pagination?.totalPages ?? 1}
            onPageChange={setPage}
            disabled={isRidersLoading}
          />
        </div>
      </section>

      {selectedRider ? <ViewRiderProfileModal rider={selectedRider} onClose={() => setSelectedRider(null)} /> : null}
      {selectedApplication ? (
        <ReviewApplicationModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
        />
      ) : null}
    </div>
  );
}
