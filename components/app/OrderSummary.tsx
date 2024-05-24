'use client'
import { useState, useEffect } from 'react'
import { CheckCircleIcon, TrashIcon } from '@heroicons/react/20/solid'
import { getUser, getCart, cancelCart, getUserInfo, deleteCart, createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod'
import Swal from 'sweetalert2'
import UserHeader from "@/components/UserHeader";
import Footer from '../Footer'


// Define Zod schema for validation
const shippingSchema = z.object({
  shipping_address: z.string().nonempty("Shipping address is required"),
  city: z.string().nonempty("City is required"),
  region: z.string().nonempty("Region is required"),
  postal_code: z.string().nonempty("Postal Code is required"),
  phone_number: z.string().nonempty("Phone Number is required"),
})

interface Cart {
  inStock: any
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
  custom_design: string;
  is_custom: boolean;
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
  const [formSubmitted, setFormSubmitted] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialState = searchParams.get('state');

  const SUPABASE_URL = "https://aasjrchinevrqjlqldvr.supabase.co"; // Replace with your actual Supabase URL
  const SUPABASE_BUCKET = "public";



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

  const handleBackToOrderForm = () => {
    const stateString = JSON.stringify(initialState);
    router.push(`/order?state=${encodeURIComponent(stateString)}`);
  };

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
        throw new Error(`Not enough ${item.color} ${fabricType} fabric in inventory`);
      }

      const { error: updateError } = await supabase
        .from('inventory')
        .update({ quantity: newQuantity })
        .eq('id', item.id);
      if (updateError) throw updateError;

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  };

  const handleConfirmOrder = async () => {
    setFormSubmitted(true) //gi add ni nako para mu indicate kung ni attempt ug confirm order si user
    if (user && userInfo) {
      try {
        // Validate shipping information
        const shippingInfo = {
          shipping_address,
          city,
          region,
          postal_code,
          phone_number,
        };
  
        shippingSchema.parse(shippingInfo); // Validate using Zod
  
        for (const item of cart) {
          const { fabric, shirt_type, sizes, color, quantities, status, shipping_address, is_custom } = item;
  
          await updateInventory(fabric, quantities);  // Update inventory for each item
  
          const { data, error } = await supabase.from('orders').insert([
            {
              fabric,
              shirt_type,
              sizes,
              color,
              quantities,
              order_date: new Date().toISOString(),
              shipping_address: shippingInfo.shipping_address,
              city,
              postal_code,
              region,
              phone_number,
              shipping_fee: calculateShipping(),
              total_price: calculateTotal(),
              user_id: user.id,
              status,
              is_custom, 
            },
          ]);
  
          if (error) {
            console.error('Error placing order:', error);
          } else {
            console.log('Order placed:', data);
          }
        }
  
        await deleteCart(); // Use deleteCart function to delete all items from the cart
        Swal.fire({
          icon: 'success',
          title: 'Order placed',
          text: 'Your order has been successfully placed!',
        }).then(() => {
          router.push('/order_history');
        });
        
        console.log('Cart cleared');
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error('Validation error:', error.errors);
          return;
        } else {
          console.error('Error confirming order:', error instanceof Error ? error.message : 'Unknown error');
        }
      }
    }
  };

  const CancelOrder = async () => {
    await deleteCart();
    alert("Order Canceled");
    router.push('/order');
  };

  console.log(cart)

  return (
    <div className="bg-gray-50">
        {user && <UserHeader user={user} />}
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-24 sm:px-6 lg:max-w-7xl lg:px-8">
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
                        id="address"
                        name="address"
                        autoComplete='street-address'
                        value={shipping_address}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                          formSubmitted && !shipping_address && 'border-red-500' 
                        }`}
                      />
                      {formSubmitted && !shipping_address && (
                        <p className="mt-1 text-xs text-red-500">*required</p> 
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                          formSubmitted && !city && 'border-red-500' 
                        }`}
                      />
                      {formSubmitted && !city && (
                        <p className="mt-1 text-xs text-red-500">*required</p> 
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                      State / Province
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="region"
                        name="region"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                          formSubmitted && !region && 'border-red-500'
                        }`}
                      />
                      {formSubmitted && !region && (
                        <p className="mt-1 text-xs text-red-500">*required</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">
                      Postal code
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        id="postal-code"
                        name="postal-code"
                        autoComplete='postal-code'
                        value={postal_code}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                          formSubmitted && !postal_code && 'border-red-500' 
                        }`}
                      />
                        {formSubmitted && !postal_code && (
                          <p className="mt-1 text-xs text-red-500">*required</p>
                        )}
                        {formSubmitted && postal_code && postal_code.length < 4 && (
                          <p className="mt-1 text-xs text-red-500">Postal code must be at least 4 digits</p>
                        )}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700">
                      Phone number
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        id="phone-number"
                        name="phone-number"
                        value={phone_number}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                          formSubmitted && !phone_number && 'border-red-500' 
                        }`}
                      />
                       {formSubmitted && !phone_number && (
                        <p className="mt-1 text-xs text-red-500">*required</p>
                      )}
                      {formSubmitted && phone_number && phone_number.length < 11 && (
                        <p className="mt-1 text-xs text-red-500">Phone number must be at least 11 digits</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-10 border-t border-gray-200 pt-10">
              <fieldset>
                <legend className="text-lg font-medium text-gray-900">Payment details</legend>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center">
                    <input
                      id="cash"
                      name="payment-type"
                      type="radio"
                      value="cash"
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="cash" className="ml-3 block text-sm font-medium text-gray-700">
                      Cash on delivery
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>

          <div className="mt-10 lg:mt-0">
            <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

            <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
              <h3 className="sr-only">Items in your cart</h3>
              <ul role="list" className="divide-y divide-gray-200">
                {cart.map((product) => (
                  <li key={product.id} className="flex px-4 py-6 sm:px-6">
                    <div className="flex-shrink-0">
                    <img
                      src={product.is_custom ? `${SUPABASE_URL}/storage/v1/object/public/Images/${product.shirt_type}` 
                      : `/img/${product.shirt_type}.jpg`}
                      alt={product.shirt_type}
                      className="h-20 w-20 rounded-md"
                    />
                    </div>

                    <div className="ml-6 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between">
                          <h4 className="text-sm">
                          <a href={product.is_custom ? `${SUPABASE_URL}/storage/v1/object/public/Images/${product.shirt_type}` : `${product.shirt_type}.jpg`} className="font-medium text-gray-700 hover:text-gray-800">
                               {product.is_custom ? product.shirt_type.split('.')[0] : product.shirt_type}
                              </a>
                          </h4>
                          <p className="ml-4 text-sm font-medium text-gray-900">{product.price} Pesos</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                        <p className="mt-1 text-sm text-gray-500">{product.sizes} {product.quantities} pcs</p>
                      </div>

                      <div className="flex flex-1 items-end justify-between pt-2">
                        {/* <p className="flex items-center space-x-2 text-sm text-gray-700">
                          <CheckCircleIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
                          <span>{product.inStock ? 'In stock' : 'Out of stock'}</span>
                        </p> */}
                        <div className="flex">
                          <button
                            type="button"
                            onClick={() => handleCancelOrder(product.id)}
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            <TrashIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                            <span className="sr-only">Remove</span>
                          </button>
                        </div>
                      </div>
                      
                    </div>
                  </li>
                ))}
              </ul>
              <dl className="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
                <div className="flex items-center justify-between">
                  <dt className="text-sm">Subtotal</dt>
                  <dd className="text-sm font-medium text-gray-900">{calculateSubtotal()}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm">Shipping</dt>
                  <dd className="text-sm font-medium text-gray-900">{calculateShipping()}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm">Total</dt>
                  <dd className="text-sm font-medium text-gray-900">{calculateTotal()}</dd>
                </div>
              </dl>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={CancelOrder}
                className="flex items-center justify-center rounded-md border border-transparent bg-red-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-red-700"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmOrder}
                className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                Confirm order
              </button>
            </div>
          </div>
        </form>
      </div>
      <Footer/>
    </div>
  )
}