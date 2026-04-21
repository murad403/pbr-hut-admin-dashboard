'use client';

import React from 'react';
import { useForm, useWatch } from 'react-hook-form';

type SettingsFormValues = {
  restaurantName: string;
  restaurantAddress: string;
  openingHour: string;
  closingHour: string;
  deliveryRadius: string;
  baseDeliveryFee: string;
  minCodAmount: string;
  paymentGatewayStatus: 'CONNECTED' | 'DISCONNECTED';
  cashOnDeliveryEnabled: boolean;
  emailNotificationEnabled: boolean;
  adminName: string;
  adminEmail: string;
  newPassword: string;
};

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-black/8 bg-white p-3 sm:p-4">
      <h3 className="mb-3 text-sm font-semibold text-title">{title}</h3>
      {children}
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1 block text-[11px] font-semibold text-black/60">{children}</label>;
}

function ToggleSwitch({
  checked,
  onToggle,
  label,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onToggle}
      className={`relative h-6 w-11 rounded-full p-1 transition-colors focus-visible:ring-2 focus-visible:ring-black/20 ${
        checked ? 'bg-[#13A568]' : 'bg-black/20'
      }`}
      aria-label={label}
    >
      <span
        className={`block size-4 rounded-full bg-white transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const { register, control, setValue, handleSubmit } = useForm<SettingsFormValues>({
    defaultValues: {
      restaurantName: 'PBR Hut',
      restaurantAddress: '15 Ocean Aven, Albion',
      openingHour: '9:00 AM',
      closingHour: '12:00 PM',
      deliveryRadius: '10 KM',
      baseDeliveryFee: '$2',
      minCodAmount: '$10',
      paymentGatewayStatus: 'CONNECTED',
      cashOnDeliveryEnabled: true,
      emailNotificationEnabled: true,
      adminName: 'Admin',
      adminEmail: 'admin@gmail.com',
      newPassword: '*****',
    },
  });

  const cashOnDeliveryEnabled = useWatch({ control, name: 'cashOnDeliveryEnabled' });
  const emailNotificationEnabled = useWatch({ control, name: 'emailNotificationEnabled' });

  const onSubmit = (values: SettingsFormValues) => {
    console.log('Settings saved:', values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto w-full max-w-3xl space-y-2.5 pb-6">
      <SectionCard title="Restaurant Information">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div>
            <Label>Name</Label>
            <input {...register('restaurantName')} className="h-9 w-full rounded-sm border border-black/10 px-3 text-sm text-title" />
          </div>
          <div>
            <Label>Address</Label>
            <input {...register('restaurantAddress')} className="h-9 w-full rounded-sm border border-black/10 px-3 text-sm text-title" />
          </div>
          <div>
            <Label>Opening Hour</Label>
            <input {...register('openingHour')} className="h-9 w-full rounded-sm border border-black/10 px-3 text-sm text-title" />
          </div>
          <div>
            <Label>Closing Hour</Label>
            <input {...register('closingHour')} className="h-9 w-full rounded-sm border border-black/10 px-3 text-sm text-title" />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Delivery Settings">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div>
            <Label>Delivery Radius (KM)</Label>
            <input {...register('deliveryRadius')} className="h-9 w-full rounded-sm border border-black/10 px-3 text-sm text-title" />
          </div>
          <div>
            <Label>Base Delivery Fee</Label>
            <input {...register('baseDeliveryFee')} className="h-9 w-full rounded-sm border border-black/10 px-3 text-sm text-title" />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Order Settings">
        <div>
          <Label>Minimum Order Amount for COD</Label>
          <input {...register('minCodAmount')} className="h-9 w-full rounded-sm border border-black/10 px-3 text-sm text-title" />
        </div>
      </SectionCard>

      <SectionCard title="Payment Settings">

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-title">Cash On Delivery (COD)</p>
            <p className="text-[11px] text-black/45">Allow customer to pay with cash upon delivery</p>
          </div>

          <ToggleSwitch
            checked={cashOnDeliveryEnabled}
            onToggle={() =>
              setValue('cashOnDeliveryEnabled', !cashOnDeliveryEnabled, {
                shouldDirty: true,
                shouldTouch: true,
              })
            }
            label="Toggle cash on delivery"
          />
        </div>
      </SectionCard>

      <SectionCard title="Notifications">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-title">Email Notification</p>
            <p className="text-[11px] text-black/45">Allow your platform to send notifications for new orders</p>
          </div>

          <ToggleSwitch
            checked={emailNotificationEnabled}
            onToggle={() =>
              setValue('emailNotificationEnabled', !emailNotificationEnabled, {
                shouldDirty: true,
                shouldTouch: true,
              })
            }
            label="Toggle email notification"
          />
        </div>
      </SectionCard>

      <SectionCard title="Admin Account Settings">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div>
            <Label>Name</Label>
            <input {...register('adminName')} className="h-9 w-full rounded-sm border border-black/10 px-3 text-sm text-title" />
          </div>
          <div>
            <Label>Address</Label>
            <input {...register('adminEmail')} className="h-9 w-full rounded-sm border border-black/10 px-3 text-sm text-title" />
          </div>
          <div className="sm:col-span-2">
            <Label>New Password</Label>
            <input {...register('newPassword')} className="h-9 w-full rounded-sm border border-black/10 px-3 text-sm text-title" />
          </div>
        </div>
      </SectionCard>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="inline-flex h-10 items-center rounded-full bg-[#D94906] px-5 text-sm font-semibold text-white hover:bg-[#c34105]"
        >
          Save changes
        </button>
      </div>
    </form>
  );
}
