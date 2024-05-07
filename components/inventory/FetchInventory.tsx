'use client'

import React, { useState, useEffect } from 'react';
import { SupabaseClient, PostgrestResponse } from '@supabase/supabase-js';
import Swal from "sweetalert2";
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

interface InventoryItem {
  id: number;
  item: string;
  quantity: number;
}

const Modal = ({ isOpen, onClose, item, onSubmit, isEditMode }) => {
  const [itemName, setItemName] = useState(item ? item.item : '');
  const [itemQuantity, setItemQuantity] = useState(item ? item.quantity : 0);

  useEffect(() => {
    if (item) {
      setItemName(item.item);
      setItemQuantity(item.quantity);
    }
  }, [item]);


  const handleSubmit = async () => {
    try {
      console.log('itemName:', itemName);
      console.log('quantity:', itemQuantity);
  
      if (isEditMode) {
        const { error } = await supabase
          .from('inventory')
          .update({ item: itemName, quantity: itemQuantity })
          .match({ id: item.id });
        if (error) throw error;
        onSubmit(item.id, itemName, itemQuantity);
        Swal.fire('Updated!', 'The item has been updated successfully.', 'success');
      } else {
        const { data, error } = await supabase
          .from('inventory')
          .insert([{ item: itemName, quantity: itemQuantity }]);
        if (error) throw error;
        
        if (data && data.length > 0) {
          const newItem = data[0];
          onSubmit(newItem.id, newItem.item, newItem.quantity);
        }
        Swal.fire('Added!', 'The item has been added successfully.', 'success');
      }
      onClose();
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error!', 'Failed.', 'error');
    }
  };
  

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full">
        <div className="p-5">
          <h3 className="text-lg font-semibold">{isEditMode ? 'Edit Inventory Item' : 'Add Inventory Item'}</h3>
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
            value={itemQuantity}
            onChange={(e) => setItemQuantity(parseInt(e.target.value) || 0)}
          />
          <div className="flex justify-end mt-4 space-x-2">
            <button onClick={onClose} className="px-4 py-2 rounded text-white bg-gray-500 hover:bg-gray-600">Cancel</button>
            <button onClick={handleSubmit} className="px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600">{isEditMode ? 'Update' : 'Add'}</button>
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
      .from('inventory')
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

  const handleUpdate = (id: number, item: any, quantity: any) => {
    setData(data.map(x => x.id === id ? { ...x, item, quantity } : x));
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleSubmitAdd = (newItem: InventoryItem) => {
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
          <button onClick={handleAdd} className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Add Product</button>
        </div>
      </div>
      <div className="mt-8">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
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
      </div>
      </div>
      <Modal isOpen={selectedItem != null} onClose={() => setSelectedItem(null)} item={selectedItem} onSubmit={handleUpdate} isEditMode />
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleSubmitAdd} item={undefined} isEditMode={undefined} />
    </div>
  );
}