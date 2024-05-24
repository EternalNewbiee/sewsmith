'use client'
import UserHeader from "@/components/UserHeader";
import React, { useEffect, useState } from 'react';
import { getUser } from "@/lib/supabase/client";
import { createClient } from '@/lib/supabase/client';
import Footer from "@/components/Footer"
import Swal from 'sweetalert2';
import { redirect } from "next/navigation";

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
  city: string;
  postal_code: string;
  region: string;
  shipping_fee: number;
  status: string;
  total_price: number;
  imageUrl?: string;
  is_custom: boolean;
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchUserAndOrders() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (!user) return;

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching orders:', error.message);
        return;
      }

      if (data) {
        setOrders(data);
      }
    }

    fetchUserAndOrders();
  }, []);

  const formatShirtTypeName = (shirtType: string, isCustom: boolean) => {

    if (isCustom) {
      return shirtType.split('.')[0];
    } else {
      return shirtType;
    }
  };

  const cancelOrder = async (id: number) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to cancel this order?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { data: updatedOrder, error } = await supabase
          .from('orders')
          .update({ status: 'cancelled' })
          .eq('id', id);
  
        if (error) {
          console.error('Error canceling order:', error.message);
          Swal.fire('Error!', 'An error occurred while canceling the order', 'error');
          return;
        }
  
        if (updatedOrder) {
          const updatedOrders = orders.map(order => {
            if (order.id === id) {
              return { ...order, status: 'cancelled' };
            }
            return order;
          });
          setOrders(updatedOrders);
          Swal.fire('Cancelled!', 'Your order has been cancelled.', 'success');
        }
      }
    });
  };
  
  if (!user) {
    return <div className="min-h-screen p-10 bg-cover bg-fixed bg-gradient-to-tr from-grey-100 to-blue-50">
      Fetching User...</div>;
  }

  const SUPABASE_URL = "https://aasjrchinevrqjlqldvr.supabase.co"; 

  console.log(orders)

  const formatOrderDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen flex flex-col ">
      <UserHeader user={user}/>
      <div className={`flex-grow bg-${orders.length === 0 ? 'white' : 'gray-50'}`}>
        <div className="mx-auto max-w-2xl pt-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="space-y-2 px-4 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 sm:px-0">
            <div className="flex sm:items-baseline sm:space-x-4">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Order History</h1>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="mt-6 flex items-center justify-center">
              <h2 className="text-xl font-semibold text-gray-700">No orders Found</h2>
            </div>
          ) : (
            <div className="mt-6">
              <h2 className="sr-only">Orders</h2>

              <div className="space-y-8">
                {orders.map((order) => (
                  <div key={order.id} className="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border">
                    <div className="px-4 py-6 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:p-8">
                      <div className="sm:flex lg:col-span-7">
                        <div className="aspect-h-1 aspect-w-1 w-full flex-shrink-0 overflow-hidden rounded-lg sm:aspect-none sm:h-40 sm:w-40">
                        <img
                            src={order.is_custom ? `${SUPABASE_URL}/storage/v1/object/public/Images/${order.shirt_type}` : `/img/${order.shirt_type}.jpg`}
                            alt=""
                            className="h-full w-full object-cover object-center sm:h-full sm:w-full"
                          />
                        </div>

                        <div className="mt-6 sm:ml-6 sm:mt-0">
                          <h3 className="text-base font-medium text-gray-900">
                            <a href='#'>Order#{order.id}</a>
                          </h3>
                          <p className="mt-2 text-sm font-medium text-gray-900">$ {order.total_price}</p>
                          <p className="mt-3 text-sm text-gray-500">{formatShirtTypeName(order.shirt_type, order.is_custom)} made with {order.color} {order.fabric}</p>
                        </div>
                      </div>

                      <div className="mt-6 lg:col-span-5 lg:mt-0">
                        <dl className="grid grid-cols-2 gap-x-6 text-sm">
                          <div>
                            <dt className="font-medium text-gray-900">Delivery address</dt>
                            <dd className="mt-3 text-gray-500">
                              {order.shipping_address}, {order.city}, {order.postal_code}, {order.region} 
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

                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6 lg:p-8 flex">
                      <div className="mr-4 w-[85%]">
                        <h4 className='mb-2'>Status: {order.status} </h4>
                        <p className="text-sm font-medium text-gray-900">
                        Received: <time dateTime={order.order_date}>{formatOrderDate(order.order_date)}</time>
                        </p>
                      </div>
                      <button onClick={() => cancelOrder(order.id)} className="text-red-500 font-semibold justify-end">Cancel Order</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
