// OrderForm.tsx
import React, { useState, useRef, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { RadioGroup } from '@headlessui/react';
import { FABRICS } from '@/components/app/fabric-option'
import { getUser } from '@/lib/supabase/client';

import cn from 'classnames'

interface OrderFormProps {
  productTitle: string;
  productImage: string;
  productPrice: string;
  selectedProduct: any;
}

export default function OrderForm({ productTitle, productImage, productPrice }: OrderFormProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedFabric, setSelectedFabric] = useState<string>('');
  const [selectedShirt, setSelectedShirt] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [color, setColor] = useState('');
  const [sizes, setSizes] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<{ [size: string]: number }>({});
  const sizesRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const [user, setUser] = useState<any>(null); 
  

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    if (!sizes.includes(size)) {
      setSizes([...sizes, size]); // Add the selected size
    } else {
      setSizes(sizes.filter(s => s !== size)); // Remove the deselected size
    }
  };

  const handleFabricChange = (fabric: string) => {
    setSelectedFabric(fabric);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

    const [options, setOptions] = useState<{
      fabric: (typeof FABRICS)[number]
    }>({
      fabric: FABRICS[0]
    })

  useEffect(() => {
    const fetchData = async () => {
      const userData = await getUser();
      setUser(userData.user); // Set user state
    };
    fetchData();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const shippingAddress = (document.getElementById(
        'address'
      ) as HTMLInputElement).value;
      const shippingFee = 150;
      const totalPrice = 250;
      const status = 'pending';

      for (const size of sizes) {
        const { data, error } = await supabase.from('orders').insert([
          {
            fabric: selectedFabric,
            shirt_type: productTitle,
            color: selectedColor,
            sizes: size,
            quantities: quantities[size] || 0,
            order_date: new Date().toISOString(),
            shipping_address: shippingAddress,
            shipping_fee: shippingFee,
            total_price: totalPrice,
            user_id: user.id,
            status: status,
          },
        ]);

        if (error) {
          throw error;
        }

        console.log(`Order for ${size} inserted successfully:`, data);
      }

      // Reset form fields and states
      setSelectedFabric('');
      setSelectedColor('');
      setSizes([]);
      setQuantities({});

      if (sizesRef.current) {
        sizesRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error(
        'Error inserting order:',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  };

  


  return (
    <div className="flex">
      <div>
        <img src={productImage} alt={productTitle}/>
        <h2 className='text-3xl font-medium mt-4'>{productTitle}</h2>
        <p className='text-xl text-indigo-600'>{productPrice}</p>
      </div>
      <div className="lg:col-span-2 md:col-span-1">
        <form className='h-screen w-full ml-40' onSubmit={handleSubmit}>
        <div className="flex flex-col w-[500px] h-full" ref={sizesRef}>
                  <h1 className="text-3xl font-semibold">Order Details Forms</h1>
                  <div className='relative mt-4 h-full flex flex-col justify-between'>
                    <RadioGroup 
                      value={selectedFabric}
                      onChange={(val) => setSelectedFabric(val)}>
                      <label>Fabric: {selectedFabric}</label>
                      <div className='mt-3 flex items-center space-x-3'>
                        {FABRICS.map((fabric) => (
                          <RadioGroup.Option
                            key={fabric.label}
                            value={fabric.label}
                            className={({ active, checked }) => cn("relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 active:ring-0 focus:ring-0 active:outline-none focus:outline-none broder-2 border-transparent", 
                            {
                              [`border-${fabric.img}`]: active || checked,
                            })}>
                            <span className={cn(`bg-${fabric.img}`, "h-8 w-8 rounded-full border border-black border-opacity-10")}>
                              <img
                                src={fabric.img}
                                alt={fabric.label}
                                className="h-full w-full object-cover rounded-full"
                              />
                            </span>
                          </RadioGroup.Option>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                  {['Small', 'Medium', 'Large', 'Extra Large'].map((size) => (
                    <div key={size} className="flex flex-row mt-2 p-4">
                      <div className='mr-4'>
                        <input
                          type="checkbox"
                          id={`size-${size.toLowerCase().replace(/ /g, '-')}`}
                          name={`size-${size.toLowerCase().replace(/ /g, '-')}`}
                          value={size.toLowerCase()}
                          onChange={() => handleSizeChange(size.toLowerCase())}
                          checked={sizes.includes(size.toLowerCase())}
                        />
                        <label htmlFor={`size-${size.toLowerCase().replace(/ /g, '-')}`}>{size}:</label>
                      </div>
                      <input
                        type="number"
                        min="0"
                        value={quantities[size.toLowerCase()] || ''}
                        onChange={(e) => setQuantities({ ...quantities, [size.toLowerCase()]: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  ))}
                  <div>
                    <h2 className="text-xl font-semibold">Color</h2>
                    <input type="color" onChange={(e) => handleColorChange(e.target.value)} />
                  </div>
                  <div className="flex flex-col mt-4">
                    <h2 className="text-xl font-semibold">Shipping Address</h2>
                    <div className="flex flex-col mt-2">
                      <label htmlFor="address">Address:</label>
                      <input id="address" type="text" />
                    </div>
                    <div className="flex flex-col mt-2">
                      <label htmlFor="shipping-fee">Shipping Fee:</label>
                      <input id="shipping-fee" type="text" value="150" disabled />
                    </div>
                  </div>
                  <div className="flex flex-col mt-4">
                    <h2 className="text-xl font-semibold">Total Price</h2>
                    <div className="flex flex-col mt-2">
                      <label htmlFor="total-price">Total Price:</label>
                      <input id="total-price" type="text" defaultValue="250" disabled />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  >
                    Place Order
                  </button>
                </div>
        </form>
      </div>
    </div>
  );
};
