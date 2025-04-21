import { config as appConfig } from '@/app.config';
import type { DemoConfig } from '@demo/sdk';
import { DemoProvider, SessionProvider } from '@demo/sdk-next';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Blockchain Auth Demo',
  description: 'Blockchain auth demo app'
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const demoConfig = {
    appEnv: appConfig.environment,
    appId: appConfig.appId,
    appVersion: appConfig.appVersion,
    cookies: await cookies().then((result) => result.toString())
  } satisfies DemoConfig;

  return (
    <html lang="en">
      <body className="antialiased">
        <DemoProvider config={demoConfig}>
          <SessionProvider>{children}</SessionProvider>
        </DemoProvider>
      </body>
    </html>
  );
}
