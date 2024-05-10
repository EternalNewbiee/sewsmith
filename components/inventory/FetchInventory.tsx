'use client';

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

interface InventoryItem {
  id: number;
  color: string;
  quantity: number;
  fabric: string;
}

const Modal = ({ isOpen, onClose, item, onSubmit, isEditMode }) => {
  const [color, setColor] = useState(item ? item.color : '');
  const [quantity, setQuantity] = useState(item ? item.quantity : 0);
  const [fabric, setFabric] = useState(item ? item.fabric : '');

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
      console.log('quantity:', quantity);
      console.log('fabric:', fabric);

      if (isEditMode) {
        const { error } = await supabase
          .from('inventory')
          .update({ color, quantity, fabric })
          .match({ id: item.id });
        if (error) throw error;
        onSubmit(item.id, color, quantity, fabric);
        Swal.fire('Updated!', 'The item has been updated successfully.', 'success');
      } else {
        const { data, error } = await supabase
          .from('inventory')
          .insert([{ color, quantity, fabric }]);
        if (error) throw error;

        if ( !color || !quantity || !fabric ) {
          Swal.fire('Error!', 'Kindly fill in all the necessary details before submitting.', 'error');
        }

        if (data && data.length > 0) {
          const newItem = data[0];
          onSubmit(newItem.id, newItem.color, newItem.quantity, newItem.fabric);
        }
        Swal.fire('Added!', 'The item has been added successfully.', 'success');
      }
      onClose();
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error!', 'Something went wrong', 'error');
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full flex flex-nowrap">
        <div className="p-5">
          <h3 className="text-lg font-semibold">{isEditMode ? 'Edit Inventory Item' : 'Add Inventory Item'}</h3>
          <input
            type="text"
            className="mt-2 p-2 w-full border rounded"
            placeholder="Color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
          <input
            type="number"
            className="mt-2 p-2 w-full border rounded"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
          />
          <input
            type="text"
            className="mt-2 p-2 w-full border rounded"
            placeholder="Fabric"
            value={fabric}
            onChange={(e) => setFabric(e.target.value)}
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

  const handleUpdate = (id: number, color: string, quantity: number, fabric: string) => {
    setData(data.map(x => x.id === id ? { ...x, color, quantity, fabric } : x));
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleSubmitAdd = (id: number, color: string, quantity: number, fabric: string) => {
    setData([...data, { id, color, quantity, fabric }]);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-lg font-semibold text-gray-900">Inventory</h1>
          <p className="text-sm text-gray-700">A list of all the items in the system including the Product ID, color, quantity, and fabric.</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-4">
          <button onClick={handleAdd} className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Add Product</button>
        </div>
      </div>
      <div className="mt-8 -mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th scope="col" className="w-1/6 text-center p-4 border-b border-gray-200 bg-blue-100 text-left text-xs font-semibold text-gray-600 uppercase">
                  Product ID
                </th>
                <th scope="col" className="w-1/6 text-center p-4 border-b border-gray-200 bg-blue-100 text-left text-xs font-semibold text-gray-600 uppercase">
                  Color
                </th>
                <th scope="col" className="w-1/3 text-center p-4 border-b border-gray-200 bg-blue-100 text-left text-xs font-semibold text-gray-600 uppercase">
                  Fabric
                </th>
                <th scope="col" className="w-1/6 text-center p-4 border-b border-gray-200 bg-blue-100 text-left text-xs font-semibold text-gray-600 uppercase">
                  Quantity (Roll)
                </th>
                <th scope="col" className="w-1/6 text-center p-4 border-b border-gray-200 bg-blue-100 text-left text-xs font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
          </table>
          <div className="max-h-[546px]  min-w-full overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-300">
              <tbody>
                {data.map(item => (
                  <tr key={item.id}>
                    <td className="w-1/6 text-center p-4 h-10 border-b border-gray-200 bg-white text-sm">
                      {item.id}
                    </td>
                    <td className="w-1/6 text-center p-4 h-10 border-b border-gray-200 bg-white text-sm">
                      {item.color}
                    </td>
                    <td className="w-1/3 text-center p-4 h-10 border-b border-gray-200 bg-white text-sm">
                      {item.fabric}
                    </td>
                    <td className="w-1/6 text-center p-4 h-10 border-b border-gray-200 bg-white text-sm">
                      {item.quantity}
                    </td>
                    <td className="w-1/6 text-center p-4 h-10 border-b border-gray-200 bg-white text-sm">
                      <button onClick={() => setSelectedItem(item)} className="text-indigo-600 hover:text-indigo-900 mr-4">
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
      <Modal isOpen={selectedItem != null} onClose={() => setSelectedItem(null)} item={selectedItem} onSubmit={handleUpdate} isEditMode />
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleSubmitAdd} item={undefined} isEditMode={false} />
    </div>
  );
}
