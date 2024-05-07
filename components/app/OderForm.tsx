'use client'
import React, { useState, useRef, useEffect } from 'react';
import { getUser } from "@/lib/supabase/client";
import { createClient } from '@/lib/supabase/client';

import FabricCard from '@/components/app/FabricCard';
import ProductCard from '@/components/app/ProductCard';
import CustomDesign from '@/components/app/CustomDesign';
import UserHeader from '@/components/UserHeader';
import Footer from '@/components/Footer';

export default function OrderPage({ user }: { user: any }) {
  const [fabric, setFabric] = useState('');
  const [shirtType, setShirtType] = useState('');
  const [designFile, setDesignFile] = useState<File | null>(null);
  const [color, setColor] = useState('');
  const [sizes, setSizes] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<{ [size: string]: number }>({});
  const [fabricSelected, setFabricSelected] = useState(false);
  const [clothesSelected, setClothesSelected] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const sizesRef = useRef<HTMLDivElement>(null);
  const [redirected, setRedirected] = useState(false);
  const [clickedInsideDetails, setClickedInsideDetails] = useState(false);
  const supabase = createClient();
  
  const handleFabricSelect = (fabricType: string) => {
    setFabric(fabricType);
    setFabricSelected(true);
  };

  const handleSizeChange = (size: string) => {
    if (sizes.includes(size)) {
      setSizes(sizes.filter((s) => s !== size));
      setQuantities({ ...quantities, [size]: 0 });
    } else {
      setSizes([...sizes, size]);
    }
  };

  const handleUploadComplete = () => {
    setUploadComplete(true);
  };

  const handleRedirect = () => {
    setRedirected(true);
  };

  const handleFileUpload = (file: File) => {
    setDesignFile(file);
    setClothesSelected(true);
  };

  const handleProductSelect = (productType: string) => {
    setShirtType(productType);
    setClothesSelected(true);
  };

  const onRedirect = () => {
    console.log("Redirecting...");
  };

  useEffect(() => {
    const fetchData = async () => {
      const userData = await getUser();
      const user = userData.user;
    };
    fetchData();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const shippingAddress = (document.getElementById('address') as HTMLInputElement).value;
      const shippingFee = 150; 
      const totalPrice = 250;
      const status = 'pending';

      for (const size of sizes) {
        const { data, error } = await supabase.from('orders').insert([
          {
            fabric,
            shirt_type: shirtType,
            design_file: designFile,
            color,
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

      setFabric('');
      setShirtType('');
      setDesignFile(null);
      setColor('');
      setSizes([]);
      setQuantities({});
      setFabricSelected(false);
      setClothesSelected(false);

      if (sizesRef.current) {
        sizesRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error inserting order:', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  return (
    <div className='bg-white h-auto w-screen flex items-center justify-center'>
      <UserHeader></UserHeader>
      <main className='mt-20'>
        <form onSubmit={handleSubmit} className='h-screen w-full'>
          <div className="flex flex-col bg-white h-full w-full p-4 justify-center">

            {!clothesSelected && (
              <div className="grid grid-cols-4 grid-rows-2 gap-4 h-full w-auto">
                <ProductCard imageSrc="/img/shirt.png" altText="cotton" title="SHIRT" price={3} isCustom={false} onClick={() => handleProductSelect('Shirt')} />
                <ProductCard imageSrc="/img/polo shirt.png" altText="cotton" title="POLO SHIRT" price={4} isCustom={false} onClick={() => handleProductSelect('Polo Shirt')} />
                <ProductCard imageSrc="/img/shirtlongsleeve.png" altText="cotton" title="LONG SLEEVE SHIRT" price={5} isCustom={false} onClick={() => handleProductSelect('Long Sleeve Shirt')} />
                <ProductCard imageSrc="/img/croptop.png" altText="cotton" title="CROPTOP SHIRT" price={2} isCustom={false} onClick={() => handleProductSelect('Crop Shirt')} />
                <ProductCard imageSrc="/img/polo shirt longsleeve.png" altText="cotton" title="LONG SLEEVE POLO" price={4} isCustom={false} onClick={() => handleProductSelect('Long Sleeve Polo')} />
                <ProductCard imageSrc="/img/hoodie.png" altText="cotton" title="HOODIE" price={6} isCustom={false} onClick={() => handleProductSelect('Hoodie')} />
                <ProductCard imageSrc="/img/hoodie w zipper.png" altText="cotton" title="HOODIE WITH ZIPPER" price={6} isCustom={false} onClick={() => handleProductSelect('Hoodie With Zipper')} />
                <CustomDesign
                  onFileUpload={handleFileUpload}
                  onUploadComplete={handleUploadComplete}
                  onRedirect={handleRedirect}
                  uploadComplete={uploadComplete}
                />
              </div>
            )}

            {clothesSelected && !fabricSelected && (
              <div className="grid grid-cols-3 grid-rows-2 gap-4 h-full w-auto">
                <FabricCard imageSrc="img/cotton.jpg" altText="cotton" title="PURE COTTON" price={5} onClick={() => handleFabricSelect('Cotton')} />
                <FabricCard imageSrc="img/wool.jpg" altText="wool" title="PURE WOOL" price={4} onClick={() => handleFabricSelect('Wool')} />
                <FabricCard imageSrc="img/silk.jpg" altText="silk" title="PURE SILK" price={6} onClick={() => handleFabricSelect('Silk')} />
                <FabricCard imageSrc="img/satin.jpg" altText="satin" title="PURE SATIN" price={6} onClick={() => handleFabricSelect('Satin')} />
                <FabricCard imageSrc="img/linen.jpg" altText="linen" title="PURE LINEN" price={6} onClick={() => handleFabricSelect('Linen')} />
                <FabricCard imageSrc="img/polyester.jpg" altText="polyester" title="PURE POLYESTER" price={6} onClick={() => handleFabricSelect('Polyester')} />
              </div>
            )}

            {fabricSelected && (
              <div className='bg-white h-full w-full flex gap-5 justify-around'>
                <div className="flex flex-col w-[600px] h-full items-center gap-10">
                  <h2 className="text-xl font-semibold">Selected Fabric and Clothing Item</h2>
                  <div className='product-card cursor bg-gray-200 h-[190px] w-[190px] border rounded-lg cursor-pointer border-gray-400 relative'>
                    <img src={`/img/${fabric.toLowerCase()}.jpg`} alt={fabric} className="h-full w-full object-cover" />
                    <p className='text-center'>{fabric}</p>
                  </div>
                  <div className='product-card cursor bg-gray-200 h-[190px] w-[190px] border rounded-lg cursor-pointer border-gray-400 relative'>
                    <img src={`/img/${shirtType.toLowerCase().replace(/ /g, '-')}.png`} alt={shirtType} className="h-full w-full object-cover" />
                    <p className='text-center'>{shirtType}</p>
                  </div>
                  {designFile && (
                    <div className='product-card cursor bg-gray-200 h-[190px] w-[190px] border rounded-lg cursor-pointer border-gray-400 relative'>
                      <img src={URL.createObjectURL(designFile)} alt="Custom Design" className="h-full w-full object-cover" />
                      <p className='text-center'>Custom Design</p>
                    </div>
                  )}
                </div>
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
              </div>
            )}
          </div>
        </form>
        <Footer></Footer>
      </main>
    </div>
  );
}
