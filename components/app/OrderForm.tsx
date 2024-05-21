import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { RadioGroup } from '@headlessui/react';
import { FABRICS } from '@/components/app/fabric-option';
import { getUser } from '@/lib/supabase/client';
import cn from 'classnames';

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
  const [shippingAddress, setShippingAddress] = useState<string>('');
  const [shippingFee, setShippingFee] = useState<number>(150);
  const [totalPrice, setTotalPrice] = useState<number>(250);

  const router = useRouter();

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    if (!sizes.includes(size)) {
      setSizes([...sizes, size]);
    } else {
      setSizes(sizes.filter(s => s !== size));
    }
  };

  const handleFabricChange = (fabric: string) => {
    setSelectedFabric(fabric);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  useEffect(() => {
    const fetchData = async () => {
      const userData = await getUser();
      setUser(userData.user);
    };
    fetchData();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await handleCheckout();
  };

  const handleCheckout = async () => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const status = 'pending';

      for (const size of sizes) {
        const { data, error } = await supabase.from('cart').insert([
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

      router.push('/order/checkout');
    } catch (error) {
      console.error(
        'Error inserting order:',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  };

  return (
    <div className="flex justify-evenly">
      <div className="w-1/4 p-2">
        <img src={productImage} alt={productTitle} className="w-full rounded-xl" />
        <h2 className="text-3xl font-medium mt-4 text-center">{productTitle}</h2>
        <p className="text-xl text-indigo-600">{productPrice}</p>
      </div>
      <div className="w-2/3">
        <form className="ml-8" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-semibold text-center">Order Details Form</h1>
            <RadioGroup value={selectedFabric} onChange={(val) => setSelectedFabric(val)}>
              <label>Fabric: {selectedFabric}</label>
              <div className="flex items-center space-x-3 mt-2">
                {FABRICS.map((fabric) => (
                  <RadioGroup.Option
                    key={fabric.label}
                    value={fabric.label}
                    className={cn(
                      'h-10 w-10 relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 active:ring-0 focus:ring-0 active:outline-none focus:outline-none broder-2 border-transparent',
                      {
                        [`border-${fabric.img}`]: selectedFabric === fabric.label,
                      }
                    )}
                  >
                    <span className={cn(`bg-${fabric.img}`, 'h-8 w-8 rounded-full border border-black border-opacity-10')}>
                      <img src={fabric.img} alt={fabric.label} className="h-full w-full object-cover rounded-full" />
                    </span>
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>
            <div className="grid grid-cols-2 gap-4 items-center">
  <p className="col-span-2">Sizes:</p>
  {['Small', 'Medium', 'Large', 'Extra Large'].map((size) => (
    <div key={size} className="flex items-center justify-start mt-2 p-4 w-auto">
      <input
        type="checkbox"
        id={`size-${size.toLowerCase().replace(/ /g, '-')}`}
        name={`size-${size.toLowerCase().replace(/ /g, '-')}`}
        value={size.toLowerCase()}
        onChange={() => handleSizeChange(size.toLowerCase())}
        checked={sizes.includes(size.toLowerCase())}
        className="w-6 h-6" // Adjusts the checkbox size
      />
      <label htmlFor={`size-${size.toLowerCase().replace(/ /g, '-')}`} className="ml-2">{size}:</label>
      <input
        type="number"
        min="0"
        value={quantities[size.toLowerCase()] || ''}
        onChange={(e) => setQuantities({ ...quantities, [size.toLowerCase()]: parseInt(e.target.value) || 0 })}
        className="ml-2 w-20 "
      />
    </div>
  ))}
</div>


            <div className="flex items-center mt-2">
              <h2 className="text-xl font-semibold mr-2">Color:</h2>
              <input type="color" onChange={(e) => handleColorChange(e.target.value)} />
            </div>
            <div className="flex flex-col mt-4">
  <h2 className="text-xl font-semibold">Shipping Address</h2>
  <div className="flex flex-col mt-2">
    <label htmlFor="address" className="font-medium">Address:</label>
    <input
      id="address"
      type="text"
      value={shippingAddress}
      onChange={(e) => setShippingAddress(e.target.value)}
      className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
  <div className="flex flex-col mt-2">
    <label htmlFor="shipping-fee" className="font-medium">Shipping Fee:</label>
    <input
      id="shipping-fee"
      type="text"
      value={shippingFee}
      disabled
      className="mt-1 p-2 bg-gray-100 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
</div>

<div className="flex flex-col mt-2">
  <div className="flex flex-col mt-2">
    <label htmlFor="total-price" className="font-medium">Total Price:</label>
    <input
      id="total-price"
      type="text"
      value={totalPrice.toString()}
      disabled
      className="mt-1 p-2 bg-gray-100 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
</div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md mt-4 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            >
              Place Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
