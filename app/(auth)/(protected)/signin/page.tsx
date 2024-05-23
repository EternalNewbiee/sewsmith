import React from 'react';
import { signInWith, signInWithPassword } from "@/lib/auth";

interface SearchParams {
  error?: string;
  success?: string;
}

export default function SignIn({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="min-h-screen flex flex-row-reverse">
      <div className="flex-1 flex items-center justify-start p-20 bg-blue-600 text-white relative">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/img/signin.jpg)' }}>
          <div className="absolute inset-0 bg-blue-600 opacity-70"></div>
        </div>
        <div className="text-left max-w-md z-10">
          <h2 className="text-lg font-semibold">Don`&apos;`t have an account yet?</h2>
          <p className="text-sm mb-4 my-2">Reconnect with your SewSmith community! Your designs and collaborations are just one login away.</p>
          <a href="/signup" className="inline-block bg-white text-blue-600 py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-50 transition duration-150 ease-in-out">
            Sign Up
          </a>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center p-12 bg-white relative">
        <img src="/img/logo.png" alt="SewSmith Logo" className="absolute top-5 left-5 w-12 h-12" />
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-2xl font-bold mb-6">Log In to Your Account</h2>
          {(searchParams?.error || searchParams?.success) && (
            <div
              className={`rounded-md ${searchParams.error ? "bg-red-50" : "bg-green-50"} p-4 mb-4`}
            >
              <p
                className={`text-center text-sm ${searchParams?.error ? "text-red-800" : "text-green-800"}`}
              >
                {searchParams?.error || searchParams?.success}
              </p>
            </div>
          )}
          <form className="space-y-6" method="post" action={signInWithPassword}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">Email address</label>
              <input type="email" id="email" name="email" required
                className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">Password</label>
              <input type="password" id="password" name="password" required
                className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"/>
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
              </div>
              <a href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">Forgot password?</a>
            </div>
            <button type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
