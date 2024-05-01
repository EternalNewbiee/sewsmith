import React from 'react';

type ProductCardProps = {
  imageSrc: string;
  altText: string;
  title: string;
  price: number;
  isCustom: boolean;
  onClick?: () => void;
};

const ProductCard: React.FC<ProductCardProps> = ({ imageSrc, altText, title, price, isCustom, onClick }) => {

  return (
    <div className="product-card bg-gray-200 border rounded-lg border-gray-400 relative cursor-pointer flex flex-col" onClick={onClick}>
      <div className="image-container flex-grow flex justify-center items-center rounded-t-lg overflow-hidden">
        <img src={imageSrc} alt={altText} className="rounded-lg" />
      </div>
      <div className="details-container flex-grow-0 bg-white rounded-b-lg p-2 flex  justify-between">
        <div className='flex flex-col '>
          <h4>{title}</h4>
          <h2>${price}</h2>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
