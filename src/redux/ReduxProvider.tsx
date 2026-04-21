'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';

import store from './store';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {children}
      <Toaster richColors position="top-right" closeButton />
    </Provider>
  );
}