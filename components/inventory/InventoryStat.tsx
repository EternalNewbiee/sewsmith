import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import { ChartPieIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const supabase = createClient();

const InventoryStat = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [lowStockItems, setLowStockItems] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const { data: inventoryData, error: inventoryError, count: inventoryCount } = await supabase
        .from('inventory')
        .select('*', { count: 'exact' });

      if (inventoryError) {
        console.error('Error fetching inventory data:', inventoryError);
      } else {
        setTotalItems(inventoryCount || 0);
      }

      const { data: lowStockData, error: lowStockError } = await supabase
        .from('inventory')
        .select('*', { count: 'exact' })
        .lt('quantity', 200);

      if (lowStockError) {
        console.error('Error fetching low stock data:', lowStockError);
      } else {
        setLowStockItems(lowStockData?.length || 0);
      }
    };

    fetchData();
  }, []);

  return (
   
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow flex items-center justify-between">
          <div>
            <p className="text-blue-500">Total Items</p>
            <p className="text-2xl font-semibold text-gray-900">{totalItems}</p>
          </div>
          <div className="text-indigo-600 bg-indigo-50 rounded-full p-3">
            <ChartPieIcon className="h-6 w-6" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow flex items-center justify-between">
          <div>
            <p className="text-red-500">Low Stock Items</p>
            <p className="text-2xl font-semibold text-gray-900">{lowStockItems}</p>
          </div>
          <div className="text-yellow-500 bg-yellow-50 rounded-full p-3">
            <ExclamationTriangleIcon className="h-6 w-6" />
          </div>
        </div>
      </div>
    
  );
};

export default InventoryStat;