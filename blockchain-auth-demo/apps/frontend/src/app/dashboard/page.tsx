'use client';

import { Loader } from '@/components/Loader';
import { useSession } from '@demo/sdk-next';
import { decodeJwt } from 'jose';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const { user, accessToken, expiresAt, logout } = useSession();

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-4">
          <Link
            href="/"
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Home
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>
      <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <h3 className="text-xl font-semibold">User Profile</h3>
          <p className="text-sm opacity-70">Your account information from JWT</p>
        </div>
        <div className="p-6">
          {user ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
                  <h4 className="text-sm font-medium opacity-70 mb-1">User ID</h4>
                  <p className="font-mono">{user.id}</p>
                </div>
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
                  <h4 className="text-sm font-medium opacity-70 mb-1">Expiration</h4>
                  <p className="font-mono">{expiresAt?.toLocaleString() ?? 'N/A'}</p>
                </div>
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
                  <h4 className="text-sm font-medium opacity-70 mb-1">Name</h4>
                  <p className="font-mono">{user.name ?? 'N/A'}</p>
                </div>
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
                  <h4 className="text-sm font-medium opacity-70 mb-1">Email</h4>
                  <p className="font-mono">{user.email}</p>
                </div>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
                <h4 className="text-sm font-medium opacity-70 mb-2">All JWT Claims</h4>
                <pre className="text-xs overflow-auto p-2 bg-gray-200 dark:bg-gray-900 rounded-md">
                  {JSON.stringify(decodeJwt(accessToken ?? ''), null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Loader />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
