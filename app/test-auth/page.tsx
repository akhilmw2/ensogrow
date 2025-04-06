'use client';

import AuthButton from '@/components/AuthButton';

export default function TestAuth() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Firebase Auth Test
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Test your Google authentication below
          </p>
        </div>
        <div className="mt-8">
          <AuthButton />
        </div>
      </div>
    </div>
  );
} 