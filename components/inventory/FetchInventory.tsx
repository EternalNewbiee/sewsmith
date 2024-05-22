'use client'

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { createClient } from '@/lib/supabase/client';
import { PlusIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";
import InventoryStat from './InventoryStat';

const supabase = createClient();


interface InventoryItem {
  id: number;
  color: string;
  quantity: number;
  fabric: string;
}

const Modal = ({ isOpen, onClose, item, onSubmit, isEditMode }: { isOpen: boolean, onClose: () => void, item: any, onSubmit: () => void, isEditMode: boolean }) => {
  const [color, setColor] = useState(item ? item.color : '');
  const [quantity, setQuantity] = useState(item ? item.quantity : 0);
  const [fabric, setFabric] = useState(item ? item.fabric : '');

  // Main Add & edit function
  useEffect(() => {
    if (item) {
      setColor(item.color);
      setQuantity(item.quantity);
      setFabric(item.fabric);
    }
  }, [item]);

  const handleSubmit = async () => {
    try {
        console.log('color:', color);
        console.log('fabric:', fabric);
        console.log('quantity:', quantity);

        if (!color || !quantity || !fabric) {
          Swal.fire('Error!', 'Kindly fill in all the necessary details before submitting.', 'error');
        return;
        }

        if (isEditMode) {
            const { error } = await supabase
                .from('inventory')
                .update({ color, fabric, quantity })
                .match({ id: item.id });
            if (error) throw error;
            console.log('Item updated successfully');
            Swal.fire('Updated!', 'The item has been updated successfully.', 'success');
            onSubmit();
        } else {
           
            const { data: existingItems, error: checkError } = await supabase
                .from('inventory')
                .select('*')
                .eq('color', color)
                .eq('fabric', fabric);

            if (checkError) throw checkError;

            if (existingItems.length > 0) {
              
                const existingItem = existingItems[0];
                const newQuantity = existingItem.quantity + quantity;
                const { error } = await supabase
                    .from('inventory')
                    .update({ quantity: newQuantity })
                    .match({ id: existingItem.id });
                if (error) throw error;
                console.log('Quantity updated successfully');
                Swal.fire('Updated!', 'The item quantity has been updated successfully.', 'success');
            } else {
               
                const { error } = await supabase
                    .from('inventory')
                    .insert([{ color, fabric, quantity }]);
                if (error) throw error;
                console.log('Item added successfully');
                Swal.fire('Added!', 'The item has been added successfully.', 'success');
            }
            onSubmit();
        }
        onClose();
    } catch (error) {
        console.error('Error:', error);
        Swal.fire('Error!', 'Something went wrong', 'error');
    }
  };
    // Bubble UI 
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full flex flex-nowrap">
        <div className="p-5">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-semibold">{isEditMode ? 'Edit Inventory Item' : 'Add Inventory Item'}</h3>
            <XMarkIcon className="w-8 h-8 text-red-500 hover:text-red-600" aria-hidden="true" onClick={onClose}/>
          </div>
          <input
            type="text"
            className="mt-2 p-2 w-full border rounded"
            placeholder="Color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
          <input
            type="text"
            className="mt-2 p-2 w-full border rounded"
            placeholder="Fabric"
            value={fabric}
            onChange={(e) => setFabric(e.target.value)}
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
            <button onClick={handleSubmit} className="px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600">{isEditMode ? 'Update' : 'Add'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Delete,Update Function
export default function FetchDataPage() {
  const [data, setData] = useState<InventoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchText.length > 0) {
      const filteredData = data.filter(item =>
        item.color.toLowerCase().includes(searchText.toLowerCase()) ||
        item.fabric.toLowerCase().includes(searchText.toLowerCase()) ||
        item.quantity.toString().includes(searchText.toLowerCase()) ||
        item.id.toString().includes(searchText.toLowerCase())
      );
      setData(filteredData);
    } else {
      fetchData();
    }
  }, [searchText]);

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
  

  const handleDelete = async (id: number) => {
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

  const handleUpdate = (id: number, color: string, fabric: string, quantity: number) => {
    setData(data.map(x => x.id === id ? { ...x, color, fabric, quantity } : x));
    fetchData();
  };
  

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleSubmitAdd = () => {
    fetchData();
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  //order processing function
  const processOrder = async (orderItems: { id: number; quantity: number }[]) => {
    try {
      for (const orderItem of orderItems) {
        const item = data.find(i => i.id === orderItem.id);
        if (item) {
          const newQuantity = item.quantity - orderItem.quantity;
          if (newQuantity < 0) {
            throw new Error(`Not enough fabric for item ID ${item.id}`);
          }

          // Update the item in the table
          setData(prevData =>
            prevData.map(i =>
              i.id === item.id ? { ...i, quantity: newQuantity } : i
            )
          );

          // Update the item in the database
          const { error } = await supabase
            .from('inventory')
            .update({ quantity: newQuantity })
            .match({ id: item.id });
          if (error) throw error;
        }
      }
      Swal.fire('Order Processed', 'The order has been processed successfully.', 'success');
    } catch (error) {
      console.error('Error processing order:', error);
      Swal.fire('Error!', 'Failed to process the order.', 'error');
    }
  };
    // Table UI
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center"> 
        <div className="mb-4 md:mb-4"> 
          <h1 className="text-2xl font-semibold leading-7 text-gray-900">Inventory</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your products, colors, fabrics, and quantities.
          </p>
        </div>
        <button 
          onClick={handleAdd} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Product
        </button>
      </div>
      <InventoryStat/>
      <div className="mt-8 flow-root">
        <div className="mt-4 mb-4 flex justify-end">
          <div className="relative rounded-md shadow-sm w-64">
            <input
              type="text"
              name="search"
              id="search-field"
              className="block w-full rounded-md border-gray-300 pr-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Search..."
              value={searchText}
              onChange={handleSearch}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
          </div>
        </div>
        <div className="sm:flex sm:items-center">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="w-1/6 text-center px-6 py-3 border-b border-gray-200 text-left text-xs font-large text-black-500 uppercase tracking-wider">Product ID</th>
                  <th scope="col" className="w-1/6 text-center px-6 py-3 border-b border-gray-200 text-left text-xs font-large text-black-500 uppercase tracking-wider">Color</th>
                  <th scope="col" className="w-1/3 text-center px-6 py-3 border-b border-gray-200 text-left text-xs font-large text-black-500 uppercase tracking-wider">Fabric</th>
                  <th scope="col" className="w-1/6 text-center px-6 py-3 border-b border-gray-200 text-left text-xs font-large text-black-500 uppercase tracking-wider">Quantity (Roll)</th>
                  <th scope="col" className="w-1/6 text-center px-6 py-3 border-b border-gray-200 text-left text-xs font-large text-black-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map(item => (
                  <tr key={item.id}>
                    <td className="w-1/6 text-center px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.id}</td>
                    <td className="w-1/6 text-center px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.color}</td>
                    <td className="w-1/3 text-center px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.fabric}</td>
                    <td className="w-1/6 text-center px-6 py-4 whitespace-nowrap text-sm text-gray-500" style={{ color: item.quantity < 200 ? 'red' : 'black' }}>{item.quantity}</td>
                    <td className="w-1/6 text-center px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => setSelectedItem(item)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Modal isOpen={selectedItem != null} onClose={() => setSelectedItem(null)} item={selectedItem} onSubmit={() => handleUpdate} isEditMode={true} />
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleSubmitAdd} item={undefined} isEditMode={false} />
    </div>
  );
}
