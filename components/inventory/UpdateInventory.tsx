'use client'

import React, { useState, useEffect } from 'react';
import { createClient, SupabaseClient, PostgrestResponse } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useParams } from 'next/navigation';

const supabaseUrl = 'https://aasjrchinevrqjlqldvr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhc2pyY2hpbmV2cnFqbHFsZHZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE3MjI0NjEsImV4cCI6MjAyNzI5ODQ2MX0.pa32Bwe9UvDxTkhXdP7swUvRuFUJp7He5f54w5pbj80';

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
    const [itemId, setItemId] = useState('');
    const [itemName, setItemName] = useState('');
    const [itemQuantity, setItemQuantity] = useState('');
    const [formError, setFormError] = useState(null);
    const [formSuccessful, setFormSuccessful] = useState(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError(null);
        setFormSuccessful(null);

        if (!itemName || !itemQuantity || !itemId) {
            setFormError('Please fill in all fields correctly.');
            return;
        }

        const parsedItemId = parseInt(itemId);
        const parsedQuantity = parseInt(itemQuantity);
        if (isNaN(parsedItemId) || isNaN(parsedQuantity)) {
            setFormError('Invalid input for ID or quantity.');
            return;
        }

        try {
            const { data, error } = await supabase
                .from('inventory')
                .update({ item: itemName, quantity: parsedQuantity })
                .eq('id', parsedItemId);

            if (error) throw error;
            setFormSuccessful('Data updated successfully.');
            console.log('Data updated successfully:', data);
        } catch (error) {
            console.error('Error updating data:', error);
            setFormError(error.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-blue-100 p-5 max-w-2xl rounded-2xl">
                <h2 className="text-3xl font-bold tracking-tight text-blue-900 sm:text-4xl">UPDATE MATERIAL</h2>
                <form onSubmit={handleSubmit}>
                    <div className="sm:col-span-2 mt-5">
                        <label htmlFor="itemId" className="block text-sm font-semibold leading-6 text-gray-900">Item ID:</label>
                        <input
                            type="text"
                            name="ItemId"
                            id="ItemId"
                            className="block w-full p-1.5 box-border border border-white my-2.5 mt-5 mb-10 rounded-md"
                            value={itemId}
                            onChange={(e) => setItemId(e.target.value)}
                        />
                    </div>
                    <div className="sm:col-span-2 mt-5">
                        <label htmlFor="ItemName" className="block text-sm font-semibold leading-6 text-gray-900">Item Name:</label>
                        <input
                            type="text"
                            name="ItemName"
                            id="ItemName"
                            className="block w-full p-1.5 box-border border border-white my-2.5 mt-5 mb-10 rounded-md"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                        />
                    </div>
                    <div className="sm:col-span-2 mt-5">
                        <label htmlFor="ItemQuantity" className="block text-sm font-semibold leading-6 text-gray-900">Quantity (Roll):</label>
                        <input
                            type="number"
                            name="ItemQuantity"
                            id="ItemQuantity"
                            className="block w-full p-1.5 box-border border border-white my-2.5 mt-5 mb-10 rounded-md"
                            value={itemQuantity}
                            onChange={(e) => setItemQuantity(e.target.value)}
                        />
                    </div>
                    <div className="container mx-auto">
                        <div className="flex space-x-4 justify-center"> 
                            <button
                                type="submit"
                                className="w-35 rounded-md bg-blue-900 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                            >
                                Update
                            </button>
                            <Link href="/dashboard/inventory">
                                <button
                                    type="button"
                                    className="flex-1 rounded-md bg-red-400 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                                >
                                    Cancel
                                </button>
                            </Link>
                        </div>
                    </div>
                    {formError && <p className="text-red-500">{formError}</p>}
                    {formSuccessful && <p className="text-green-500">{formSuccessful}</p>}
                </form>
            </div>
        </div>
    );
}