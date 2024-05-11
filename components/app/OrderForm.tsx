// OrderForm.tsx
import React, { useState, useRef, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';


interface OrderFormProps {
  productTitle: string;
  productImage: string;
  productPrice: string;
}

export default function OrderForm({ productTitle, productImage, productPrice }: OrderFormProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedFabric, setSelectedFabric] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [color, setColor] = useState('');
  const [sizes, setSizes] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<{ [size: string]: number }>({});
  const sizesRef = useRef<HTMLDivElement>(null);

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
  };

  const handleFabricChange = (fabric: string) => {
    setSelectedFabric(fabric);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  return (
    <div className="flex">
      <div>
        <img src={productImage} alt={productTitle}/>
        <h2 className='text-3xl font-medium mt-4'>{productTitle}</h2>
        <p className='text-xl text-indigo-600'>{productPrice}</p>
      </div>
      <div className="lg:col-span-2 md:col-span-1">
        <form className='h-screen w-full ml-40'>
        <div className="flex flex-col w-[500px] h-full" ref={sizesRef}>
                  <h2 className="text-xl font-semibold">Sizes and Quantities</h2>
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

