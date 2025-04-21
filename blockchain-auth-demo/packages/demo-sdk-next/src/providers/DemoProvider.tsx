import type { DemoConfig } from '@demo/sdk';
import { configureServices } from '@demo/sdk';
import { ReactNode } from 'react';
import { DemoProviderClient } from './DemoProviderClient';

export const DemoProvider = ({ config, children }: { config: DemoConfig; children: ReactNode }) => {
  const safeConfig = configureServices(config); // Server-side initialization
  return <DemoProviderClient config={safeConfig}>{children}</DemoProviderClient>;
};
