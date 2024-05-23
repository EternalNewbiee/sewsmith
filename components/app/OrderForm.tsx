import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { RadioGroup } from '@headlessui/react';
import { FABRICS } from '@/components/app/fabric-option';
import { COLORS } from '@/components/app/color-option';
import { getUser } from '@/lib/supabase/client';
import cn from 'classnames';
import { z } from 'zod';

interface OrderFormProps {
  productTitle: string;
  productImage: string;
  productPrice: string;
}

const OrderFormSchema = z.object({
  fabric: z.string().nonempty('* Fabric is required'),
  color: z.string().nonempty('* Color is required'),
  sizes: z.array(z.string()).min(1, '* At least one size must be selected'),
});

export default function OrderForm({ productTitle, productImage, productPrice }: OrderFormProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedFabric, setSelectedFabric] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [sizes, setSizes] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<{ [size: string]: number }>({});
  const sizesRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  // Strip currency symbol and convert to number
  const cleanedPrice = productPrice.replace(/[^\d.-]/g, '');
  const price = parseFloat(cleanedPrice);

  useEffect(() => {
    const fetchData = async () => {
      const userData = await getUser();
      setUser(userData.user);
    };
    fetchData();
  }, []);

  const validateForm = () => {
    try {
      OrderFormSchema.parse({
        fabric: selectedFabric,
        color: selectedColor,
        sizes: sizes,
      });
      setErrors({});
      return true;
    } catch (error) {
      const newErrors: { [key: string]: string } = {};
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          if (err.path) newErrors[err.path[0]] = err.message;
        });
      }
      setErrors(newErrors);
      return false;
    }
  };

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (isNaN(price)) {
      console.error('Invalid product price:', productPrice);
      return;
    }

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
            price: price,
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
        <p className="text-xl text-indigo-600 text-center">{productPrice}</p>
      </div>
      <div className="w-2/3">
        <form className="ml-8" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-semibold text-center">Order Details Form</h1>
            <RadioGroup value={selectedFabric} onChange={handleFabricChange}>
              <label>Fabric: {selectedFabric} {errors.fabric && <span className="text-red-500">{errors.fabric}</span>}</label>
              <div className="flex items-center space-x-3 mt-2">
                {FABRICS.map((fabric) => (
                  <RadioGroup.Option
                    key={fabric.label}
                    value={fabric.label}
                    className={cn(
                      'h-10 w-10 relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 active:ring-0 focus:ring-0 active:outline-none focus:outline-none border-2 border-transparent',
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

            <RadioGroup value={selectedColor} onChange={handleColorChange} className="mt-4">
              <label>Color: {selectedColor} {errors.color && <span className="text-red-500">{errors.color}</span>}</label>
              <div className="flex items-center space-x-3 mt-2">
                {COLORS.map((color) => (
                  <RadioGroup.Option
                    key={color.label}
                    value={color.label}
                    className={cn(
                      'h-10 w-10 relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 active:ring-0 focus:ring-0 active:outline-none focus:outline-none border-2 border-transparent',
                      {
                        'border-black': selectedColor === color.label,
                      }
                    )}
                  >
                    <span className="h-8 w-8 rounded-full border border-black border-opacity-10" style={{ backgroundColor: color.label }}></span>
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>
            <p className="col-span-2">Sizes: {errors.sizes && <span className="text-red-500">{errors.sizes}</span>}</p>
            <div className="grid grid-cols-2 gap-2 place-items-center">
              {['Small', 'Medium', 'Large', 'Extra Large'].map((size) => (
                <div key={size} className="flex items-center justify-start mt-2 p-4 w-[260px] gap-0">
                  <input
                    type="checkbox"
                    id={`size-${size.toLowerCase().replace(/ /g, '-')}`}
                    name={`size-${size.toLowerCase().replace(/ /g, '-')}`}
                    value={size.toLowerCase()}
                    onChange={() => handleSizeChange(size.toLowerCase())}
                    checked={sizes.includes(size.toLowerCase())}
                    className="w-6 h-6"
                  />
                  <label htmlFor={`size-${size.toLowerCase().replace(/ /g, '-')}`} className="ml-2">{size}:</label>
                  <input
                    type="number"
                    min="0"
                    value={quantities[size.toLowerCase()] || ''}
                    onChange={(e) => setQuantities({ ...quantities, [size.toLowerCase()]: parseInt(e.target.value) || 0 })}
                    className="ml-2 w-32"
                  />
                </div>
              ))}
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

