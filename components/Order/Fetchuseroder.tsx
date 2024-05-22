'use client'

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { createClient } from '@/lib/supabase/client';
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";
//import OrderDetailsModal from './OrderDetailsModal';

const supabase = createClient();

interface Order {
  id: number;
  customerName: string;
  totalAmount: number;
  items: {
    id: number;
    itemName: string;
    quantity: number;
    price: number;
  }[];
  // Add more properties as needed for order history
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (searchText.length > 0) {
      // Filter orders based on search text
      // Update orders state
    } else {
      fetchOrders();
    }
  }, [searchText]);

  const fetchOrders = async () => {
    // Fetch order data from database
    // Update orders state
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold leading-7 text-gray-900">Order History</h1>
        <p className="mt-2 text-sm text-gray-600">
          View orders and details.
        </p>
      </div>
      <div className="mt-8 flow-root">
        <div className="mt-4 mb-4 flex justify-end">
          <div className="relative rounded-md shadow-sm w-64">
            <input
              type="text"
              name="search"
              id="search-field"
              className="block w-full rounded-md border-gray-300 pr-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Search by customer name or order details"
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
                  <th scope="col" className="w-2/6 text-center px-6 py-3 border-b border-gray-200 text-left text-xs font-large text-black-500 uppercase tracking-wider">Customer Name</th>
                  <th scope="col" className="w-1/6 text-center px-6 py-3 border-b border-gray-200 text-left text-xs font-large text-black-500 uppercase tracking-wider">Total Amount</th>
                  <th scope="col" className="w-2/6 text-center px-6 py-3 border-b border-gray-200 text-left text-xs font-large text-black-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map(order => (
                  <tr key={order.id}>
                    <td className="w-1/6 text-center px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.id}</td>
                    <td className="w-2/6 text-center px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customerName}</td>
                    <td className="w-1/6 text-center px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.totalAmount}</td>
                    <td className="w-2/6 text-center px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => handleViewDetails(order)} className="text-indigo-600 hover:text-indigo-900">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
     {/* <OrderDetailsModal isOpen={selectedOrder !== null} onClose={() => setSelectedOrder(null)} order={selectedOrder} /> */}
    </div>
  );
}
