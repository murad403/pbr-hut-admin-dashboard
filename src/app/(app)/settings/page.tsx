'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { useGetProfileQuery, useUpdateProfileMutation } from '@/redux/features/dashboard/dashboard.api';
import { useChangePasswordMutation } from '@/redux/features/auth/auth.api';

type SettingsFormValues = {
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  openingHour: string;
  closingHour: string;
  deliveryRadius: string;
  baseDeliveryFee: string;
  minimumOrderAmountCOD: string;
  isCODEnabled: boolean;
};

type ChangePasswordFormValues = {
  currentPassword: string;
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

const toNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

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

  return 'Something went wrong. Please try again.';
};

export default function SettingsPage() {
  const { data: profileData, isFetching: isProfileLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const { register, control, setValue, handleSubmit, reset, formState: { errors: settingsErrors } } = useForm<SettingsFormValues>({
    defaultValues: {
      name: '',
      address: '',
      latitude: '',
      longitude: '',
      openingHour: '',
      closingHour: '',
      deliveryRadius: '',
      baseDeliveryFee: '',
      minimumOrderAmountCOD: '',
      isCODEnabled: false,
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm<ChangePasswordFormValues>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
    },
  });

  const isCODEnabled = useWatch({ control, name: 'isCODEnabled' });

  React.useEffect(() => {
    if (!profileData) return;

    reset({
      name: profileData.name,
      address: profileData.address,
      latitude: String(profileData.latitude),
      longitude: String(profileData.longitude),
      openingHour: profileData.openingHour,
      closingHour: profileData.closingHour,
      deliveryRadius: String(profileData.deliveryRadius),
      baseDeliveryFee: String(profileData.baseDeliveryFee),
      minimumOrderAmountCOD: String(profileData.minimumOrderAmountCOD),
      isCODEnabled: profileData.isCODEnabled,
    });
  }, [profileData, reset]);

  const onSubmitProfile = async (values: SettingsFormValues) => {
    try {
      await updateProfile({
        name: values.name.trim(),
        address: values.address.trim(),
        latitude: toNumber(values.latitude),
        longitude: toNumber(values.longitude),
        openingHour: values.openingHour,
        closingHour: values.closingHour,
        deliveryRadius: toNumber(values.deliveryRadius),
        baseDeliveryFee: values.baseDeliveryFee.trim(),
        minimumOrderAmountCOD: values.minimumOrderAmountCOD.trim(),
        isCODEnabled: values.isCODEnabled,
      }).unwrap();

      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const onSubmitPassword = async (values: ChangePasswordFormValues) => {
    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }).unwrap();

      toast.success('Password changed successfully');
      resetPasswordForm();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (isProfileLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-black/40" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-3 pb-6">
      <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-2.5">
        <SectionCard title="Restaurant Information">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <Label>Name</Label>
              <input
                {...register('name', { required: 'Restaurant name is required' })}
                className="h-9 w-full rounded-sm border border-black/10 px-3 text-sm text-title"
              />
              {settingsErrors.name ? <p className="mt-1 text-xs text-red-600">{settingsErrors.name.message}</p> : null}
            </div>
            <div>
              <Label>Address</Label>
              <input
                {...register('address', { required: 'Address is required' })}
                className="h-9 w-full rounded-sm border border-black/10 px-3 text-sm text-title"
              />
              {settingsErrors.address ? <p className="mt-1 text-xs text-red-600">{settingsErrors.address.message}</p> : null}
            </div>
            <div>
              <Label>Latitude</Label>
              <input
                type="number"
                step="any"
                {...register('latitude', { required: 'Latitude is required' })}
                className="h-9 w-full rounded-sm border border-black/10 px-3 text-sm text-title"
              />
              {settingsErrors.latitude ? <p className="mt-1 text-xs text-red-600">{settingsErrors.latitude.message}</p> : null}
            </div>
            <div>
              <Label>Longitude</Label>
              <input
                type="number"
                step="any"
                {...register('longitude', { required: 'Longitude is required' })}
                className="h-9 w-full rounded-sm border border-black/10 px-3 text-sm text-title"
              />
              {settingsErrors.longitude ? <p className="mt-1 text-xs text-red-600">{settingsErrors.longitude.message}</p> : null}
            </div>
            <div>
              <Label>Opening Hour</Label>
              <input
                type="time"
                {...register('openingHour', { required: 'Opening hour is required' })}
                className="h-9 w-full rounded-sm border border-black/10 px-3 text-sm text-title"
              />
              {settingsErrors.openingHour ? <p className="mt-1 text-xs text-red-600">{settingsErrors.openingHour.message}</p> : null}
            </div>
            <div>
              <Label>Closing Hour</Label>
              <input
                type="time"
                {...register('closingHour', { required: 'Closing hour is required' })}
                className="h-9 w-full rounded-sm border border-black/10 px-3 text-sm text-title"
              />
              {settingsErrors.closingHour ? <p className="mt-1 text-xs text-red-600">{settingsErrors.closingHour.message}</p> : null}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Delivery Settings">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <Label>Delivery Radius (KM)</Label>
              <input
                type="number"
                step="any"
                {...register('deliveryRadius', { required: 'Delivery radius is required' })}
                className="h-9 w-full rounded-sm border border-black/10 px-3 text-sm text-title"
              />
              {settingsErrors.deliveryRadius ? <p className="mt-1 text-xs text-red-600">{settingsErrors.deliveryRadius.message}</p> : null}
            </div>
            <div>
              <Label>Base Delivery Fee</Label>
              <input
                type="number"
                step="any"
                {...register('baseDeliveryFee', { required: 'Base delivery fee is required' })}
                className="h-9 w-full rounded-sm border border-black/10 px-3 text-sm text-title"
              />
              {settingsErrors.baseDeliveryFee ? <p className="mt-1 text-xs text-red-600">{settingsErrors.baseDeliveryFee.message}</p> : null}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Order Settings">
          <div>
            <Label>Minimum Order Amount for COD</Label>
            <input
              type="number"
              step="any"
              {...register('minimumOrderAmountCOD', { required: 'Minimum COD amount is required' })}
              className="h-9 w-full rounded-sm border border-black/10 px-3 text-sm text-title"
            />
            {settingsErrors.minimumOrderAmountCOD ? (
              <p className="mt-1 text-xs text-red-600">{settingsErrors.minimumOrderAmountCOD.message}</p>
            ) : null}
          </div>
        </SectionCard>

        <SectionCard title="Payment Settings">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-title">Cash On Delivery (COD)</p>
              <p className="text-[11px] text-black/45">Allow customer to pay with cash upon delivery</p>
            </div>

            <ToggleSwitch
              checked={isCODEnabled}
              onToggle={() =>
                setValue('isCODEnabled', !isCODEnabled, {
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }
              label="Toggle cash on delivery"
            />
          </div>
        </SectionCard>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isUpdatingProfile || isProfileLoading}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-[#D94906] px-5 text-sm font-semibold text-white hover:bg-[#c34105] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUpdatingProfile ? <Loader2 className="size-4 animate-spin" /> : null}
            Save changes
          </button>
        </div>
      </form>

      <SectionCard title="Change Password">
        <form onSubmit={handlePasswordSubmit(onSubmitPassword)} className="space-y-3">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <Label>Current Password</Label>
              <input
                type="password"
                {...registerPassword('currentPassword', {
                  required: 'Current password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' },
                })}
                className="h-9 w-full rounded-sm border border-black/10 px-3 text-sm text-title"
              />
              {passwordErrors.currentPassword ? (
                <p className="mt-1 text-xs text-red-600">{passwordErrors.currentPassword.message}</p>
              ) : null}
            </div>
            <div>
              <Label>New Password</Label>
              <input
                type="password"
                {...registerPassword('newPassword', {
                  required: 'New password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' },
                })}
                className="h-9 w-full rounded-sm border border-black/10 px-3 text-sm text-title"
              />
              {passwordErrors.newPassword ? <p className="mt-1 text-xs text-red-600">{passwordErrors.newPassword.message}</p> : null}
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-black px-5 text-sm font-semibold text-white hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isChangingPassword ? <Loader2 className="size-4 animate-spin" /> : null}
              Change password
            </button>
          </div>
        </form>
      </SectionCard>
    </div>
  );
}