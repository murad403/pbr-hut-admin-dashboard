import React from 'react';

import MainWrapper from '@/components/wrapper/MainWrapper';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <MainWrapper>{children}</MainWrapper>;
}
