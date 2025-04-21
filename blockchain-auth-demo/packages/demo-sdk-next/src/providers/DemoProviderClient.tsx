'use client';

import type { DemoConfig } from '@demo/sdk';
import { configureServices } from '@demo/sdk';
import { ReactNode } from 'react';

export const DemoProviderClient = ({
  config,
  children
}: {
  config: Omit<DemoConfig, 'cookies'>;
  children: ReactNode;
}) => {
  configureServices(config); // Client-side initialization
  return children;
};
