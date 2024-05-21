import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import { ChartPieIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const supabase = createClient();

const OrderStat = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [cancelledOrders, setCancelledOrders] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch total orders count
      const { count: orderCount, error: orderError } = await supabase
        .from('orders')
        .select('*', { count: 'exact' });

      if (orderError) {
        console.error('Error fetching total orders data:', orderError);
      } else {
        setTotalOrders(orderCount || 0);
      }

      // Fetch pending orders count
      const { count: pendingCount, error: pendingError } = await supabase
        .from('orders')
        .select('*', { count: 'exact' })
        .eq('status', 'pending');

      if (pendingError) {
        console.error('Error fetching pending orders data:', pendingError);
      } else {
        setPendingOrders(pendingCount || 0);
      }

      // Fetch completed orders count
      const { count: completedCount, error: completedError } = await supabase
        .from('orders')
        .select('*', { count: 'exact' })
        .eq('status', 'completed');

      if (completedError) {
        console.error('Error fetching completed orders data:', completedError);
      } else {
        setCompletedOrders(completedCount || 0);
      }

      // Fetch cancelled orders count
      const { count: cancelledCount, error: cancelledError } = await supabase
        .from('orders')
        .select('*', { count: 'exact' })
        .eq('status', 'cancelled');

      if (cancelledError) {
        console.error('Error fetching cancelled orders data:', cancelledError);
      } else {
        setCancelledOrders(cancelledCount || 0);  // Corrected line
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow flex items-center justify-between">
        <div>
          <p className="text-blue-500">Total Orders</p>
          <p className="text-2xl font-semibold text-gray-900">{totalOrders}</p>
        </div>
        <div className="text-indigo-600 bg-indigo-50 rounded-full p-3">
          <ChartPieIcon className="h-6 w-6" />
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow flex items-center justify-between">
        <div>
          <p className="text-yellow-500">Pending Orders</p>
          <p className="text-2xl font-semibold text-gray-900">{pendingOrders}</p>
        </div>
        <div className="text-yellow-600 bg-yellow-50 rounded-full p-3">
          <ClockIcon className="h-6 w-6" />
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow flex items-center justify-between">
        <div>
          <p className="text-green-500">Completed Orders</p>
          <p className="text-2xl font-semibold text-gray-900">{completedOrders}</p>
        </div>
        <div className="text-green-600 bg-green-50 rounded-full p-3">
          <CheckCircleIcon className="h-6 w-6" />
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow flex items-center justify-between">
        <div>
          <p className="text-red-500">Cancelled Orders</p>  {/* Changed text color for clarity */}
          <p className="text-2xl font-semibold text-gray-900">{cancelledOrders}</p>
        </div>
        <div className="text-red-600 bg-red-50 rounded-full p-3">  {/* Changed background color for clarity */}
          <CheckCircleIcon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

export default OrderStat;
