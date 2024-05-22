'use client'
import { useState, useEffect } from 'react'
import { CheckCircleIcon, TrashIcon } from '@heroicons/react/20/solid'
import { getUser, getCart, cancelCart, getUserInfo, deleteCart, createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation';

interface Cart {
  id: string
  fabric: string
  color: string
  shirt_type: string
  sizes: string
  quantities: number
  status: string
  shipping_address: string
  phone_number: string
  price: string
}

interface UserInfo {
  id: string
  userid: string
  first_name: string
  last_name: string
}

export default function OrderSummary() {
  const [cart, setCart] = useState<Cart[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [shipping_address, setShippingAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [region, setRegion] = useState<string>('');
  const [postal_code, setPostalCode] = useState<string>('');
  const [phone_number, setPhoneNumber] = useState<string>('');
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUser()
        if (userData?.user) {
          setUser(userData.user)
          const userInfoData = await getUserInfo(userData.user.id)
          if (userInfoData && userInfoData.length > 0) {
            setUserInfo(userInfoData[0])
          }
        }
        const cartData = await getCart()
        if (cartData) {
          setCart(cartData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  const handleCancelOrder = async (orderId: string) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        const canceledOrder = await cancelCart(orderId)
        console.log('Order canceled:', canceledOrder)
        setCart(prevCart => prevCart.filter(order => order.id !== orderId))
      } catch (error) {
        console.error('Error canceling order:', error)
      }
    }
  }

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + parseInt(item.price) * item.quantities, 0);
  };
  
  const calculateShipping = () => {
    return 150;
  };
  
  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const updateInventory = async (fabricType: string, quantity: number) => {
    try {
      const { data: inventoryData, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('fabric', fabricType);
      if (error) throw error;

      if (inventoryData.length === 0) {
        throw new Error('No matching fabric found in inventory');
      }

      const item = inventoryData[0];
      const newQuantity = item.quantity - quantity;
      if (newQuantity < 0) {
        throw new Error(`Not enough ${fabricType} fabric in inventory`);
      }

      const { error: updateError } = await supabase
        .from('inventory')
        .update({ quantity: newQuantity })
        .eq('id', item.id);
      if (updateError) throw updateError;

      console.log('Inventory updated successfully');
    } catch (error) {
      console.error('Error updating inventory:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  };

  const handleConfirmOrder = async () => {
    if (user && userInfo) {
      try {
        for (const item of cart) {
          const { fabric, shirt_type, sizes, color, quantities, status, shipping_address } = item;

          await updateInventory(fabric, quantities);  // Update inventory for each item

          const { data, error } = await supabase.from('orders').insert([
            {
              fabric,
              shirt_type,
              sizes,
              color,
              quantities,
              order_date: new Date().toISOString(),
              shipping_address,
              city,
              postal_code,
              region,
              phone_number,
              shipping_fee: calculateShipping(),
              total_price: calculateTotal(),
              user_id: user.id,
              status,
            },
          ])
          if (error) {
            console.error('Error placing order:', error)
          } else {
            console.log('Order placed:', data)
          }
        }
        await deleteCart(); // Use deleteCart function to delete all items from the cart
        router.push('/order_history');
        console.log('Cart cleared');
      } catch (error) {
        console.error('Error confirming order:', error instanceof Error ? error.message : 'Unknown error');
      }
    }
  }

  const CancelOrder = async () => {
    await deleteCart();
    alert("Order Canceled");
    router.push('/order'); // Redirect to the order page after cancelling
  };

  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Checkout</h2>

        <form className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          <div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">Contact information</h2>
              {user && (
                <div className="mt-4">
                  <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      id="email-address"
                      name="email-address"
                      autoComplete="email"
                      value={user.email}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      readOnly
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-10 border-t border-gray-200 pt-10">
              <h2 className="text-lg font-medium text-gray-900">Shipping information</h2>
              {userInfo && (
                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  <div>
                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                      First name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="first-name"
                        name="first-name"
                        autoComplete="given-name"
                        value={userInfo.first_name}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        readOnly
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                      Last name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="last-name"
                        name="last-name"
                        autoComplete="family-name"
                        value={userInfo.last_name}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="address"
                        id="address"
                        autoComplete="street-address"
                        value={shipping_address}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="city"
                        id="city"
                        autoComplete="address-level2"
                        value={city}
                        onChange={(e) => setCity(e.target.value)} // Add this line to handle changes
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                      Region
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="region"
                        id="region"
                        autoComplete="address-level1"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)} // Add this line to handle changes
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">
                      Postal code
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="postal-code"
                        id="postal-code"
                        autoComplete="postal-code"
                        value={postal_code}
                        onChange={(e) => setPostalCode(e.target.value)} // Add this line to handle changes
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>


                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        autoComplete="tel"
                        value={phone_number}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-10 lg:mt-0">
            <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

            <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
              <h3 className="sr-only">Items in your cart</h3>
              <ul role="list" className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <li key={item.id} className="flex px-4 py-6 sm:px-6">
                    <div className="flex-shrink-0">
                      <img src={`/img/${item.shirt_type}.jpg`} alt={item.shirt_type} className="h-20 w-20 rounded-md" />
                    </div>

                    <div className="ml-6 flex flex-1 flex-col">
                      <div className="flex">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm">
                            <a href="#" className="font-medium text-gray-700 hover:text-gray-800">
                              {item.shirt_type}
                            </a>
                          </h4>
                          <p className="mt-1 text-sm text-gray-500">{item.fabric} - {item.color}</p>
                          <p className="mt-1 text-sm text-gray-500">Size: {item.sizes}</p>
                          <p className="mt-1 text-sm text-gray-500">Quantity: {item.quantities}</p>
                        </div>

                        <div className="ml-4 flow-root flex-shrink-0">
                          <button
                            type="button"
                            className="-m-2.5 inline-flex p-2.5 text-gray-400 hover:text-gray-500"
                            onClick={() => handleCancelOrder(item.id)}
                          >
                            <span className="sr-only">Remove</span>
                            <TrashIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-end justify-between pt-2">
                        <div className="ml-auto flex items-center">
                          <CheckCircleIcon
                            className={`h-5 w-5 ${item.status === 'completed' ? 'text-green-500' : 'text-gray-300'}`}
                            aria-hidden="true"
                          />
                          <p className="ml-2 text-sm font-medium text-gray-900">{item.status}</p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>₱{calculateSubtotal()}</p>
                </div>
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Shipping</p>
                  <p>₱{calculateShipping()}</p>
                </div>
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Total</p>
                  <p>₱{calculateTotal()}</p>
                </div>
                <div className="mt-6">
                  <button
                    type="button"
                    className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={handleConfirmOrder}
                  >
                    Confirm order
                  </button>
                </div>
                <div className="mt-6 flex justify-center text-sm text-gray-500">
                  <p>
                    or{' '}
                    <a
                      href="#"
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                      onClick={CancelOrder}
                    >
                      Cancel order
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
