import React from 'react';
import Image from 'next/image';

import logo from '@/assets/logo/logo.png';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className=" bg-[#F9F8F5] px-4 sm:px-0">
      <div className="mx-auto w-full max-w-2xl text-center flex justify-center items-center min-h-screen flex-col">
        <Image src={logo} alt="PBR Hut" width={236} height={121} className="mx-auto h-auto w-56 sm:w-60" priority />
        <div className="mx-auto mt-8 w-full max-w-xl text-left">{children}</div>
      </div>
    </main>
  );
}
