'use client'
import React, { useState } from 'react';
import { getUser } from "@/lib/supabase/client";
import { createClient } from '@/lib/supabase/client';
import Card from "@/components/app/Card";
import CustomizeCard from "@/components/app/CustomizeCard";
import Search from "@/components/app/Search";
import OrderForm from '@/components/app/OrderForm';
import cardList, { CardItem } from './data';

export default function OrderPage({ user }: { user: any }) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedCard, setSelectedCard] = useState<CardItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchVisible, setSearchVisible] = useState(true);
  const [customizeVisible, setCustomizeVisible] = useState(true);
  const supabase = createClient();

  const handleUploadComplete = (file: File | null) => {
    setUploadedFile(file);
  };

  const handleCardSelect = (card: CardItem) => {
    setSelectedCard(card);
    setSearchVisible(false);
    setCustomizeVisible(false);
  };

  const filteredCards = cardList.filter(card =>
    card.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  let selectedProduct = null;
  if (uploadedFile) {

    selectedProduct = {
      title: 'Custom Design',
      price: '₱500',
      img: URL.createObjectURL(uploadedFile)
    };
  } else if (selectedCard) {
    selectedProduct = selectedCard;
  }
  

  return (
    <main className="container mx-auto py-36 px-8">
      {selectedProduct ? (
        <OrderForm
          productTitle={selectedProduct.title}
          productImage={selectedProduct.img}
          productPrice={selectedProduct.price}
        />
      ) : (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-12">
          <Card onClick={handleCardSelect} cardList={filteredCards} />
          <div className="lg:col-span-1 md:col-span-1">
            {searchVisible && <Search onChange={setSearchQuery}/>}
            {customizeVisible && <CustomizeCard handleUploadComplete={handleUploadComplete} />}
          </div>
        </div>
      )}
    </main>
  );
}
