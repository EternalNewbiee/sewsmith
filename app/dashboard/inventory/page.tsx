import StatisticSection from "@/components/app/Statistics";
import FetchInventory from "@/components/inventory/FetchInventory";

export default async function InventoryPage() {

  return (
    <div className="bg-white">
      <FetchInventory />
    </div>
  );
}
