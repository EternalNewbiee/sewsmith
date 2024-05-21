"use client";

import React, { useState } from 'react';
import { forgotPassword } from "@/lib/auth";

interface SearchParams {
  error?: string;
  success?: string;
}

export default function ForgotPassword({ searchParams }: { searchParams: SearchParams }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleForgotPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('email', email); // Assuming 'email' is the key expected by your backend

    try {
      const response = await forgotPassword(formData);
      setMessage('Check your email for the reset link.');
      setTimeout(() => setMessage(''), 300000); // Optionally clear message after 60 seconds
    } catch (error) {
      // Use type guard or casting to handle 'unknown' type
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage('For security purposes, you can only request this once every 60 seconds.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 relative"
    >
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(rgba(0, 97, 242, 0.9), rgba(0, 97, 242, 0.2)), url('/img/bg.jpg')`,
          backgroundSize: 'cover',
          backgroundBlendMode: 'overlay',
          filter: 'blur(8px)',
          zIndex: -1,
        }}
      />
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="m-3 rounded-lg bg-white px-6 py-12 shadow sm:px-12">
          <div className="mb-6 sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-3 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Reset your password</h2>
            <p className="text-center text-sm text-gray-600">Enter your email to receive instructions on how to reset your password.</p>
          </div>

          {/* Success / Error Message */}
          {message && (
            <div className={`rounded-md ${message.includes('Check') ? 'bg-green-50' : 'bg-red-50'} p-4`}>
              <p className={`text-center text-sm font-medium ${message.includes('Check') ? 'text-green-800' : 'text-red-800'}`}>
                {message}
              </p>
            </div>
          )}

          <form onSubmit={handleForgotPassword} className="space-y-3">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                onChange={e => setEmail(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                disabled={isSubmitting}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full justify-center rounded-md bg-blue-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              style={{ backgroundColor: '#005DC5' }}
            >
              {isSubmitting ? 'Sending...' : 'Reset Password'}
              
            </button>
          </form>
        </div>
        <p className="mt-6 text-center text-sm text-gray-500">
          <a href="/signin" className="font-semibold text-indigo-600 hover:text-indigo-500">Return to login</a>
        </p>
      </div>
    </div>
  );
}
