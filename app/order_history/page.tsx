'use client'
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aasjrchinevrqjlqldvr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhc2pyY2hpbmV2cnFqbHFsZHZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE3MjI0NjEsImV4cCI6MjAyNzI5ODQ2MX0.pa32Bwe9UvDxTkhXdP7swUvRuFUJp7He5f54w5pbj80';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Order {
  id: number;
  fabric: string;
  shirt_type: string;
  design_file: string | null;
  color: string;
  sizes: string[];
  quantities: { [size: string]: number };
  order_date: string;
  shipping_address: string;
  shipping_fee: number;
  status: string;
  total_price: number;
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function fetchOrders() {
      const { data, error } = await supabase.from('orders').select('*');
      if (error) {
        console.error('Error fetching orders:', error.message);
        return;
      }
      if (data) {
        setOrders(data);
      }
    }

    fetchOrders();
  }, []);

  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-2xl pt-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="space-y-2 px-4 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 sm:px-0">
          <div className="flex sm:items-baseline sm:space-x-4">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Order History</h1>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="sr-only">Orders</h2>

          <div className="space-y-8">
          {orders.map((order) => (
  <div key={order.id} className="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border">
    <div className="px-4 py-6 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:p-8">
      <div className="sm:flex lg:col-span-7">
        <div className="aspect-h-1 aspect-w-1 w-full flex-shrink-0 overflow-hidden rounded-lg sm:aspect-none sm:h-40 sm:w-40">
          <img
            src={`/img/${order.fabric.toLowerCase()}.jpg`}
            alt=''
            className="h-full w-full object-cover object-center sm:h-full sm:w-full"
          />
        </div>

        <div className="mt-6 sm:ml-6 sm:mt-0">
          <h3 className="text-base font-medium text-gray-900">
            <a href='#'>Order#{order.id}</a>
          </h3>
          <p className="mt-2 text-sm font-medium text-gray-900">$ {order.total_price}</p>
          <p className="mt-3 text-sm text-gray-500">{order.shirt_type} with the fabric of {order.fabric}  </p>
        </div>
      </div>

      <div className="mt-6 lg:col-span-5 lg:mt-0">
        <dl className="grid grid-cols-2 gap-x-6 text-sm">
          <div>
            <dt className="font-medium text-gray-900">Delivery address</dt>
            <dd className="mt-3 text-gray-500">
              {order.shipping_address}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-gray-900">Shipping Fee</dt>
            <dd className="mt-3 space-y-3 text-gray-500">
              <p>{order.shipping_fee}</p>
             
            </dd>
          </div>
        </dl>
      </div>
    </div>

    <div className="border-t border-gray-200 px-4 py-6 sm:px-6 lg:p-8">
      <h4 className="sr-only">Status</h4>
      <p className="text-sm font-medium text-gray-900">
        {order.status} on <time dateTime={order.order_date}>{order.order_date}</time>
      </p>
    </div>
  </div>
))}


          </div>
        </div>
      </div>
    </div>
  );
}

