'use client';

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { createClient } from '@/lib/supabase/client';
import { PlusIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";
import OrderStat from './OrderStat';
import Modal from './Modal';

const supabase = createClient();

interface Order {
  id: number;
  fabric: string;
  shirt_type: string;
  design_file: string | null;
  color: string;
  sizes: string[];
  quantities: number;
  order_date: string;
  shipping_address: string;
  shipping_fee: number;
  status: string;
  total_price: number;
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
};

export default function FetchDataPage() {
  const [data, setData] = useState<Order[]>([]);
  const [filteredData, setFilteredData] = useState<Order[]>([]);
  const [selectedItem, setSelectedItem] = useState<Order | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); 

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchText.length > 0) {
      const filtered = data.filter(item =>
        item.status.toLowerCase().includes(searchText.toLowerCase()) ||
        item.shirt_type.toLowerCase().includes(searchText.toLowerCase()) ||
        item.fabric.toLowerCase().includes(searchText.toLowerCase()) ||
        item.id.toString().includes(searchText.toLowerCase()) ||
        item.order_date.toString().includes(searchText.toLowerCase()) ||
        item.quantities.toString().includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchText, data]);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase.from('orders').select('*');
      if (error) {
        throw error;
      }
      setData(data);
      setFilteredData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleEdit = (item: Order) => {
    setSelectedItem(item); // Set the selected item
    setIsEditModalOpen(true); // Open the edit modal
  };

  // color change status
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500';
      case 'completed':
        return 'text-green-500';
      case 'cancelled':
        return 'text-red-500';
      default:
        return '';
    }
  };

  // Table UI
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-4">
          <h1 className="text-2xl font-semibold leading-7 text-gray-900">Order Status</h1>
          <p className="mt-2 text-sm text-gray-600">
            View order status and details.
          </p>
        </div>
      </div>
      <OrderStat />
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
                  <th scope="col" className="w-1/6 text-center px-6 py-3 border-b border-gray-200 text-left text-xs font-large text-black-500 uppercase tracking-wider">Order ID</th>
                  <th scope="col" className="w-1/6 text-center px-6 py-3 border-b border-gray-200 text-left text-xs font-large text-black-500 uppercase tracking-wider">Fabric</th>
                  <th scope="col" className="w-1/3 text-center px-6 py-3 border-b border-gray-200 text-left text-xs font-large text-black-500 uppercase tracking-wider">Shirt Type</th>
                  <th scope="col" className="w-1/6 text-center px-6 py-3 border-b border-gray-200 text-left text-xs font-large text-black-500 uppercase tracking-wider">Color</th>
                  <th scope="col" className="w-1/6 text-center px-6 py-3 border-b border-gray-200 text-left text-xs font-large text-black-500 uppercase tracking-wider">Size</th>
                  <th scope="col" className="w-1/6 text-center px-6 py-3 border-b border-gray-200 text-left text-xs font-large text-black-500 uppercase tracking-wider">Quantities</th>
                  <th scope="col" className="w-1/6 text-center px-6 py-3 border-b border-gray-200 text-left text-xs font-large text-black-500 uppercase tracking-wider">Order Date</th>
                  <th scope="col" className="w-1/6 text-center px-6 py-3 border-b border-gray-200 text-left text-xs font-large text-black-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="w-1/6 text-center px-6 py-3 border-b border-gray-200 text-left text-xs font-large text-black-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map(item => (
                  <tr key={item.id}>
                    <td className="w-1/6 text-center px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.id}</td>
                    <td className="w-1/6 text-center px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.fabric}</td>
                    <td className="w-1/3 text-center px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.shirt_type}</td>
                    <td className="w-1/6 text-center px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.color}</td>
                    <td className="w-1/6 text-center px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.sizes}</td>
                    <td className="w-1/6 text-center px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantities}</td>
                    <td className="w-1/6 text-center px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(item.order_date)}</td>
                    <td className={`w-1/6 text-center px-6 py-4 whitespace-nowrap text-sm ${getStatusClass(item.status)}`}>{item.status}</td>
                    <td className="w-1/6 text-center px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => handleEdit(item)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {isEditModalOpen && selectedItem && (
        <Modal
          onClose={() => setIsEditModalOpen(false)}
          item={selectedItem} // Pass the selected item 
          onSubmit={() => {
            setIsEditModalOpen(false); // Close the edit modal after submission
            fetchData(); // Refresh data after editing
          }}
        />
      )}
    </div>
  );
}
