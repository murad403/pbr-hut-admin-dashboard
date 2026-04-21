import React from 'react'
import logo from "@/assets/logo/logo.png";
import Image from 'next/image';

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='bg-[#F9F8F5] min-h-screen justify-center items-center'>

      <Image src={logo} alt="Logo" width={319} height={163} className='object-cover' />

      {children}
    </main>
  )
}

export default layout
