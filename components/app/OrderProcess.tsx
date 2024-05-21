'use client'
import React, { useState, useRef, useEffect } from 'react';
import { getUser } from "@/lib/supabase/client";
import { createClient } from '@/lib/supabase/client';

import Card from "@/components/app/Card";
import CustomizeCard from "@/components/app/CustomizeCard";
import Search from "@/components/app/Search";
import OrderForm from '@/components/app/OrderForm';
import cardList from './data';

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
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchVisible, setSearchVisible] = useState(true);
  const [customizeVisible, setCustomizeVisible] = useState(true);
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

  const handleProductSelect = (title: string) => {
    const product = cardList.find((card) => card.title === title);
    setSelectedProduct(product);
    setSearchVisible(false);
    setCustomizeVisible(false);
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
    <main className="container mx-auto h-auto py-36 px-8 flex justify-center">
      {selectedProduct ? (
        <OrderForm
          productTitle={selectedProduct.title}
          productImage={selectedProduct.img}
          productPrice={selectedProduct.price} selectedProduct={undefined}        />
      ) : (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-12">
          <Card onClick={(product) => handleProductSelect(product)} />
          <div className="lg:col-span-1 md:col-span-1">
            {searchVisible && <Search />}
            {customizeVisible && <CustomizeCard />}
          </div>
        </div>
      )}
    </main>
  );
}
