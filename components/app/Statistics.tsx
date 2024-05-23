import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/20/solid";
import { CursorArrowRaysIcon, EnvelopeOpenIcon, UsersIcon } from "@heroicons/react/24/outline";

interface Statistic {
  order_date: string;
  pending_orders: number;
  cancelled_orders: number;
  completed_orders: number;
  total_revenue: number;
  previous_day_revenue?: number;
}

interface Props {
  statistics: Statistic[];
}

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}

export default function StatisticSection({ statistics }: Props) {
  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">Pending Orders</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">Cancelled Orders</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">Completed Orders</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">Total Revenue (PHP)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {statistics.map((statistic: Statistic, index: number) => (
                  <tr key={index} className={classNames(
                    index === statistics.length - 1 ? "bg-blue-50 font-semibold" : "",
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  )}>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">{new Date(statistic.order_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">{statistic.pending_orders}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">{statistic.cancelled_orders}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">{statistic.completed_orders}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-xs text-gray-500 ${statistic.total_revenue < (statistic.previous_day_revenue || 0) ? 'text-red-600' : 'text-green-600'}`}>
                      ₱{statistic.total_revenue.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      {statistic.previous_day_revenue && (
                        <>
                          {statistic.total_revenue > statistic.previous_day_revenue ? (
                            <ArrowUpIcon className="h-4 w-4 text-green-600 inline-block ml-1" />
                          ) : (
                            <ArrowDownIcon className="h-4 w-4 text-red-600 inline-block ml-1" />
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
