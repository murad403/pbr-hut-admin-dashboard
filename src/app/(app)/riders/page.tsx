'use client';

import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Eye, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import ViewRiderProfileModal from './ViewRiderProfileModal';
import ReviewApplicationModal from './ReviewApplicationModal';

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

const ridersTabs = ['Active Rider', 'Pending Application'];

const initialRiders: Rider[] = [
  {
    id: '1',
    name: 'Savannah Nguyen',
    phone: '(303) 555-0105',
    email: 'Sara.Cruz@Example.Com',
    status: 'AVAILABLE',
    deliveredToday: 940,
    earned: '$5,000.00',
    profileImage: '/api/placeholder/48/48',
  },
  {
    id: '2',
    name: 'Albert Flores',
    phone: '(808) 555-0111',
    email: 'Bill.Sanders@Example.Com',
    status: 'OFFLINE',
    deliveredToday: 2318,
    earned: '$4,000.00',
    profileImage: '/api/placeholder/48/48',
  },
  {
    id: '3',
    name: 'Kathryn Murphy',
    phone: '(671) 555-0110',
    email: 'Georgia.Young@Example.Com',
    status: 'AVAILABLE',
    deliveredToday: 2737,
    earned: '$0.00',
    profileImage: '/api/placeholder/48/48',
  },
  {
    id: '4',
    name: 'Dianne Russell',
    phone: '(319) 555-0115',
    email: 'Michelle.Rivera@Example.Com',
    status: 'OFFLINE',
    deliveredToday: 932,
    earned: '$3,500.00',
    profileImage: '/api/placeholder/48/48',
  },
  {
    id: '5',
    name: 'Jerome Bell',
    phone: '(629) 555-0129',
    email: 'Michael.Mite@Example.Com',
    status: 'AVAILABLE',
    deliveredToday: 3364,
    earned: '$500.00',
    profileImage: '/api/placeholder/48/48',
  },
  {
    id: '6',
    name: 'Annette Black',
    phone: '(505) 555-0125',
    email: 'Alma.Lawson@Example.Com',
    status: 'OFFLINE',
    deliveredToday: 2952,
    earned: '$1,000.00',
    profileImage: '/api/placeholder/48/48',
  },
  {
    id: '7',
    name: 'Eleanor Pena',
    phone: '(316) 555-0116',
    email: 'Deanna.Curtis@Example.Com',
    status: 'AVAILABLE',
    deliveredToday: 3552,
    earned: '$3,000.00',
    profileImage: '/api/placeholder/48/48',
  },
  {
    id: '8',
    name: 'Devon Lane',
    phone: '(209) 555-0104',
    email: 'Debbie.Baker@Example.Com',
    status: 'OFFLINE',
    deliveredToday: 2544,
    earned: '$4,000.00',
    profileImage: '/api/placeholder/48/48',
  },
  {
    id: '9',
    name: 'Marvin McKinney',
    phone: '(480) 555-0103',
    email: 'Tanya.Hill@Example.Com',
    status: 'AVAILABLE',
    deliveredToday: 3307,
    earned: '$2,000.00',
    profileImage: '/api/placeholder/48/48',
  },
  {
    id: '10',
    name: 'Ralph Edwards',
    phone: '(208) 555-0112',
    email: 'Michelle.Rivera@Example.Com',
    status: 'OFFLINE',
    deliveredToday: 1885,
    earned: '$2,500.00',
    profileImage: '/api/placeholder/48/48',
  },
];

const initialPendingApplications: PendingApplication[] = [
  {
    id: '1',
    name: 'Savannah Nguyen',
    date: 'May 6, 2012',
    email: 'Sara.Cruz@Example.Com',
    phone: '(505) 555-0125',
    profileImage: '/api/placeholder/48/48',
    idCard: '/api/placeholder/300/200',
    address: '15 Ocean Aven, Albion',
    deliveryHistory: {
      today: 62,
      delivered: 4,
      totalIncome: '$3,482',
    },
  },
  {
    id: '2',
    name: 'Albert Flores',
    date: 'May 20, 2015',
    email: 'Bill.Sanders@Example.Com',
    phone: '(303) 555-0105',
    profileImage: '/api/placeholder/48/48',
    idCard: '/api/placeholder/300/200',
    address: '456 Oak Street, Springfield',
    deliveryHistory: {
      today: 45,
      delivered: 3,
      totalIncome: '$2,100',
    },
  },
  {
    id: '3',
    name: 'Kathryn Murphy',
    date: 'May 31, 2015',
    email: 'Georgia.Young@Example.Com',
    phone: '(671) 555-0110',
    profileImage: '/api/placeholder/48/48',
    idCard: '/api/placeholder/300/200',
    address: '789 Pine Road, Metropolis',
    deliveryHistory: {
      today: 58,
      delivered: 5,
      totalIncome: '$4,200',
    },
  },
  {
    id: '4',
    name: 'Dianne Russell',
    date: 'November 28, 2015',
    email: 'Michelle.Rivera@Example.Com',
    phone: '(702) 555-0122',
    profileImage: '/api/placeholder/48/48',
    idCard: '/api/placeholder/300/200',
    address: '321 Elm Avenue, Gotham',
    deliveryHistory: {
      today: 35,
      delivered: 2,
      totalIncome: '$1,500',
    },
  },
  {
    id: '5',
    name: 'Jerome Bell',
    date: 'May 9, 2014',
    email: 'Michael.Mite@Example.Com',
    phone: '(629) 555-0120',
    profileImage: '/api/placeholder/48/48',
    idCard: '/api/placeholder/300/200',
    address: '654 Maple Drive, Smallville',
    deliveryHistory: {
      today: 72,
      delivered: 6,
      totalIncome: '$5,100',
    },
  },
];

export default function RidersPage() {
  const [activeTab, setActiveTab] = useState('Active Rider');
  const [searchValue, setSearchValue] = useState('');
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<PendingApplication | null>(null);

  const filteredRiders = useMemo(() => {
    if (activeTab !== 'Active Rider') return [];
    return initialRiders.filter(
      (rider) =>
        rider.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        rider.phone.includes(searchValue) ||
        rider.email.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [activeTab, searchValue]);

  const filteredApplications = useMemo(() => {
    if (activeTab !== 'Pending Application') return [];
    return initialPendingApplications.filter(
      (app) =>
        app.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        app.phone.includes(searchValue) ||
        app.email.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [activeTab, searchValue]);

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between w-full gap-2 md:gap-3">
          <div className="flex flex-wrap items-center gap-2 rounded-full bg-[#FAEEE8] p-1.5 text-sm text-black/65">
            {ridersTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setActiveTab(tab);
                  setSearchValue('');
                }}
                className={cn(
                  'rounded-full px-3 py-1.5 transition-colors',
                  activeTab === tab ? 'bg-white text-title shadow-sm' : 'hover:text-title'
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-black/8">
          <table className="min-w-230 w-full border-separate border-spacing-0 text-sm">
            {activeTab === 'Active Rider' ? (
              <>
                <thead className="bg-[#FAFAFA] text-left text-description">
                  <tr>
                    <th className="px-4 py-3 font-medium text-description">Rider Name</th>
                    <th className="px-4 py-3 font-medium text-description">Phone</th>
                    <th className="px-4 py-3 font-medium text-description">Email</th>
                    <th className="px-4 py-3 font-medium text-description">Status</th>
                    <th className="px-4 py-3 font-medium text-description">Delivered Today</th>
                    <th className="px-4 py-3 font-medium text-description">Earned</th>
                    <th className="px-4 py-3 font-medium text-description">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRiders.map((rider, index) => (
                    <tr
                      key={rider.id}
                      className={cn(
                        'border-b border-black/8 transition-colors hover:bg-black/3',
                        index % 2 === 1 && 'bg-black/2'
                      )}
                    >
                      <td className="px-4 py-3 text-title">{rider.name}</td>
                      <td className="px-4 py-3 text-title">{rider.phone}</td>
                      <td className="px-4 py-3 text-title">{rider.email}</td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase text-white',
                            rider.status === 'AVAILABLE' ? 'bg-emerald-500' : 'bg-gray-500'
                          )}
                        >
                          {rider.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-title">{rider.deliveredToday}</td>
                      <td className="px-4 py-3 text-title">{rider.earned}</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setSelectedRider(rider)}
                          className=" text-title cursor-pointer"
                        >
                          <Eye size={17} />
                        </button>
                      </td>
                    </tr>
                  ))}
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
                    <th className="px-4 py-3 font-medium text-description">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app, index) => (
                    <tr
                      key={app.id}
                      className={cn(
                        'border-b border-black/8 transition-colors hover:bg-black/3',
                        index % 2 === 1 && 'bg-black/2'
                      )}
                    >
                      <td className="px-4 py-3 text-title">{app.name}</td>
                      <td className="px-4 py-3 text-title">{app.date}</td>
                      <td className="px-4 py-3 text-title">{app.email}</td>
                      <td className="px-4 py-3 text-title">{app.phone}</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setSelectedApplication(app)}
                          className=" text-title cursor-pointer"
                        >
                          <Eye size={17} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </>
            )}
          </table>
        </div>
      </section>

      {selectedRider && <ViewRiderProfileModal rider={selectedRider} onClose={() => setSelectedRider(null)} />}
      {selectedApplication && (
        <ReviewApplicationModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
        />
      )}
    </div>
  );
}
