'use client'

import React, { useState, useEffect } from 'react';
import { createClient, SupabaseClient, PostgrestResponse } from '@supabase/supabase-js';
import Link from 'next/link';
import { getAllUsers } from "@/lib/supabase/server";
import { User } from "@supabase/auth-js/dist/module/lib/types";
import InventoryActionButton from "./inventory_action_button";
import Swal from "sweetalert2";

const supabaseUrl = 'https://aasjrchinevrqjlqldvr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhc2pyY2hpbmV2cnFqbHFsZHZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE3MjI0NjEsImV4cCI6MjAyNzI5ODQ2MX0.pa32Bwe9UvDxTkhXdP7swUvRuFUJp7He5f54w5pbj80';

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

interface InventoryItem {
  id: string;
  item: string;
  quantity: number;
}

const Modal = ({ isOpen, onClose, item, onSubmit, isAddMode }) => {
  const [itemName, setItemName] = useState(item ? item.item : '');
  const [quantity, setQuantity] = useState(item ? item.quantity : 0);

  useEffect(() => {
    if (item) {
      setItemName(item.item);
      setQuantity(item.quantity);
    }
  }, [item]);

  const handleSubmit = async () => {
    try {
      console.log('itemName:', itemName);
      console.log('quantity:', quantity);
  
      if (isAddMode) {
        const { data, error } = await supabase
          .from('inventory')
          .insert([{ item: itemName, quantity }]);
        if (error) throw error;
        onSubmit(data[0]);
        Swal.fire('Added!', 'The item has been added successfully.', 'success');
      } else {
        const { error } = await supabase
          .from('inventory')
          .update({ item: itemName, quantity })
          .match({ id: item.id });
        if (error) throw error;
        onSubmit(item.id, itemName, quantity);
        Swal.fire('Updated!', 'The item has been updated successfully.', 'success');
      }
      onClose();
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error!', 'Failed to perform the operation.', 'error');
    }
  };
  

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full">
        <div className="p-5">
          <h3 className="text-lg font-semibold">{isAddMode ? 'Add Inventory Item' : 'Edit Inventory Item'}</h3>
          <input
            type="text"
            className="mt-2 p-2 w-full border rounded"
            placeholder="Item Name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <input
            type="number"
            className="mt-2 p-2 w-full border rounded"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
          />
          <div className="flex justify-end mt-4 space-x-2">
            <button onClick={onClose} className="px-4 py-2 rounded text-white bg-gray-500 hover:bg-gray-600">Cancel</button>
            <button onClick={handleSubmit} className="px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600">{isAddMode ? 'Add' : 'Update'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function FetchDataPage() {
  const [data, setData] = useState<InventoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: inventoryData, error } = await supabase
      .from<InventoryItem>('inventory')
      .select('*');
    if (error) {
      console.error('Error fetching data:', error);
    } else {
      setData(inventoryData);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('inventory')
      .delete()
      .match({ id });
    if (error) {
      console.error('Error deleting item:', error);
      Swal.fire('Error!', 'Failed to delete the item.', 'error');
    } else {
      setData(data.filter(item => item.id !== id));
      Swal.fire('Deleted!', 'The item has been deleted.', 'success');
    }
  };

  const handleUpdate = (id, item, quantity) => {
    setData(data.map(x => x.id === id ? { ...x, item, quantity } : x));
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleSubmitAdd = (newItem) => {
    setData([...data, newItem]);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-lg font-semibold text-gray-900">Inventory</h1>
          <p className="text-sm text-gray-700">A list of all the items in the system including the Product ID, name, and quantity.</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-4">
          <button onClick={handleAdd} className="px-4 py-2 rounded text-white bg-green-500 hover:bg-green-600">Add Item</button>
        </div>
      </div>
      <div className="mt-8">
        <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Product ID
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Quantity (Roll)
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => (
                <tr key={item.id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {item.id}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {item.item}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {item.quantity}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <button onClick={() => setSelectedItem(item)} className="text-indigo-600 hover:text-indigo-900 mr-3">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal isOpen={selectedItem != null} onClose={() => setSelectedItem(null)} item={selectedItem} onSubmit={handleUpdate} />
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleSubmitAdd} isAddMode />
    </div>
  );
}