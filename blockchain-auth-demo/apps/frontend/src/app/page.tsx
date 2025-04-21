import AuthFlow from '@/components/AuthFlow';
import AuthStatus from '@/components/AuthStatus';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold tracking-tight mb-4">JWT Authentication Demo</h2>
        <p className="text-lg opacity-70 max-w-2xl mx-auto">
          A demonstration of secure authentication using NestJS, Next.js, and JWT with public/private key signing
        </p>
      </div>
      <div className="mb-12">
        <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden card">
          <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4">
            <h3 className="text-xl font-semibold">Authentication Status</h3>
            <p className="text-sm opacity-70">Your current authentication state and token information</p>
          </div>
          <div className="p-6">
            <AuthStatus />
          </div>
          <div className="border-t border-gray-200 dark:border-gray-800 px-6 py-4 flex justify-end gap-4">
            <Link
              href="/login"
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/login/register"
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Sign Up
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
      <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden card">
        <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <h3 className="text-xl font-semibold">How It Works</h3>
          <p className="text-sm opacity-70">The JWT authentication flow with public/private key signing</p>
        </div>
        <div className="p-6">
          <AuthFlow />
        </div>
      </div>
    </div>
  );
}
