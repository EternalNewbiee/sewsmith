export type CardItem = {
    id: number;
    img: string;
    title: string;
    price: string;
    priceRange: string; // Add the priceRange property
};

const cardList: CardItem[] = [
    {
        id: 1,
        img: "/img/t-shirt.jpg",
        title: "T-Shirt",
        price: "₱150-1K",
        priceRange: "",
    },
    {
        id: 2,
        img: "/img/long-sleeve.jpg",
        title: "Long Sleeve Shirt",
        price: "₱320-2K",
        priceRange: "",
    },
    {
        id: 3,
        img: "/img/polo-shirt.jpg",
        title: "Polo Shirt",
        price: "₱210-1.5K",
        priceRange: "",
    },
    {
        id: 4,
        img: "/img/long-sleeve-polo.jpg",
        title: "Long Sleeve Polo",
        price: "₱350-2.5K",
        priceRange: "",
    },
    {
        id: 5,
        img: "/img/crop-top.jpg",
        title: "Corp Top",
        price: "₱80-1K",
        priceRange: "",
    },
    {
        id: 6,
        img: "/img/dress.jpg",
        title: "Dress",
        price: "₱450-2.5K",
        priceRange: "",
    },
    {
        id: 7,
        img: "/img/hoodie.jpg",
        title: "Hoodie",
        price: "₱450-2.5K",
        priceRange: "",
    },    
    {
        id: 8,
        img: "/img/jersey.jpg",
        title: "Sport Jersey",
        price: "₱450-2.5K",
        priceRange: "",
    },
    {
        id: 9,
        img: "/img/suit.jpg",
        title: "Suit",
        price: "₱450-2.5K",
        priceRange: "",
    },
].map(item => {
    const [start, end] = item.price.split('-');
    const startPrice = parseFloat(start.replace(/[^\d.]/g, ''));
    const endPrice = parseFloat(end.replace(/[^\d.]/g, ''));
    item.priceRange = `${startPrice.toLocaleString()} - ${endPrice.toLocaleString()} PHP`;
    return item;
});

export default cardList;