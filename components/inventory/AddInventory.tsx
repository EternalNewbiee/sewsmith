'use client'

import React, { useState } from 'react';
import { createClient, SupabaseClient, PostgrestSingleResponse, PostgrestError } from '@supabase/supabase-js';
import Link from 'next/link';

const supabaseUrl = 'https://aasjrchinevrqjlqldvr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhc2pyY2hpbmV2cnFqbHFsZHZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE3MjI0NjEsImV4cCI6MjAyNzI5ODQ2MX0.pa32Bwe9UvDxTkhXdP7swUvRuFUJp7He5f54w5pbj80';

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);


export default function Home() {

    const [itemName, setItemName] = useState<string>('')
    const [itemQuantity, setItemQuantity] = useState<string>('')    
    const [formError, setFormError] = useState(null)
    const [formSuccessful, setFormSuccessful] = useState(null)

  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setFormError(null);
        setFormSuccessful(null);

        if (!itemName || !itemQuantity) {
            setFormError('Please fill in all the fields correcty')
            return;
        }

        try {
            const { data, error }= await supabase
            .from('inventory')
            .insert([{ item: itemName, quantity: itemQuantity }]);

            if (error) {
            throw error;
            }
            setFormSuccessful('Data added successfully.')
            console.log('Data added successfully:', data);
            
        } catch (error) {
            console.error('Error adding data:', error);
            setFormError(error.message)
            
        }
    };
  

    return (

        <div className="flex items-center justify-center min-h-screen">
            <div className = "bg-blue-100 p-5 max-w-2xl rounded-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-blue-900 sm:text-4xl">ADD NEW MATERIAL</h2>
            
            <form onSubmit={handleSubmit}>
            <div className="sm:col-span-2 mt-5">
                <label htmlFor="itemName" className="block text-sm font-semibold leading-6 text-gray-900">
                    Item Name:
                </label>
                <div className="mt-2.5">
                    <input
                        type="text"
                        name="ItemName"
                        id="ItemName"
                        className="block w-full p-1.5 box-border border border-white my-2.5 mt-5 mb-10 rounded-md"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                    />
                </div>
            </div>

            <div className="sm:col-span-2 mt-5">
                <label htmlFor="quantity" className="block text-sm font-semibold leading-6 text-gray-900">
                    Quantity (Roll):
                </label>
                <div className="mt-2.5">
                    <input
                        type="number"
                        name="ItemQuantity"
                        id="ItemQuantity"
                        className="block w-full p-1.5 box-border border border-white my-2.5 mt-5 mb-10 rounded-md"
                        value={itemQuantity}
                        onChange={(e) => setItemQuantity(e.target.value)}
                    />
                </div>
            </div>

            <div className="container mx-auto">
                <div className = "flex space-x-4 justify-center"> 
                <button
                    type="submit"
                    className="w-35 rounded-md bg-blue-900 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Add
                </button>
                
                <Link href="/dashboard/inventory">
                <button
                    type="button"
                    className="flex-1 rounded-md bg-red-400 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Cancel
                </button>
                </Link>
                </div>
            </div>
            {formError && <p className = "text-red-500">{formError}</p>}
            {formSuccessful && <p className = "text-green-500">{formSuccessful}</p>}
            </form>
            </div>
        </div>
  );
}