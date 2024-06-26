import React from 'react';
import { CardItem } from './data';

export default function Card({ onClick, cardList }: { onClick: (card: CardItem) => void, cardList: CardItem[] }) {
  return (
    <div className="lg:col-span-2 md:col-span-1">
      <div className="grid grid-cols-3 gap-6"> 
        {cardList.map(card => (
          <div key={card.id} className='max-w-xs shadow-lg rounded-lg bg-gray-200 border border-gray-300 transform transition-transform hover:scale-105' onClick={() => onClick(card)}>
            <img 
              className='rounded-t-lg'
              src={card.img} 
              alt={card.title}
            />
            <div className='bg-white p-5'>
              <h3 className='text-xl font-bold text-slate-700 mb-3'>{card.title}</h3>
              <p className='text-lg font-normal text-gray-600'>{card.price}</p>                    
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
