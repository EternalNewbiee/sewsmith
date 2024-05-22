"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPassword } from '@/lib/auth';

export default function ResetPassword() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('code'); 
    const email = searchParams.get('email'); 
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!token || !email) {
            setMessage('Token or email is missing or invalid.');
            return;
        }

        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        try {
            await resetPassword(password, token, email);
            setMessage('Your password has been successfully reset.');
            setTimeout(() => router.push('/signin'), 3000); 
        } catch (error: unknown) {
            if (error instanceof Error) {
                setMessage(`Failed to reset password. ${error.message}`);
            } else {
                setMessage('Failed to reset password due to an unknown error');
            }
        }
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
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
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
                    <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">Reset Your Password</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                New Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white"
                                style={{ backgroundColor: '#005DC5' }}
                            >
                                Reset Password
                            </button>
                        </div>
                    </form>
                    {message && (
                        <div
                            className={`mt-6 text-center text-sm font-medium ${
                                message.includes('successfully') ? 'text-green-600' : 'text-red-600'
                            }`}
                        >
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
