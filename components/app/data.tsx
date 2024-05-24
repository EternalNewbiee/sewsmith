export type CardItem = {
    id: number;
    img: string;
    title: string;
    price: string;
};

const cardList: CardItem[] = [
    {
        id: 1,
        img: "/img/T-shirt.jpg",
        title: "T-Shirt",
        price: "150",
    },
    {
        id: 2,
        img: "/img/Long Sleeve Shirt.jpg",
        title: "Long Sleeve Shirt",
        price: "320",
    },
    {
        id: 3,
        img: "/img/Polo Shirt.jpg",
        title: "Polo Shirt",
        price: "210",
    },
    {
        id: 4,
        img: "/img/Long Sleeve Polo.jpg",
        title: "Long Sleeve Polo",
        price: "350",
    },
    {
        id: 5,
        img: "/img/Crop Top.jpg",
        title: "Crop Top",
        price: "80",
    },
    {
        id: 6,
        img: "/img/Dress.jpg",
        title: "Dress",
        price: "450",
    },
    {
        id: 7,
        img: "/img/Hoodie.jpg",
        title: "Hoodie",
        price: "450",
    },    
    {
        id: 8,
        img: "/img/Sport Jersey.jpg",
        title: "Sport Jersey",
        price: "450",
    },
    {
        id: 9,
        img: "/img/Suit.jpg",
        title: "Suit",
        price: "2500",
    },
].map(item => {
    return {
        ...item,
        price: `₱${item.price}`,
    };
});

export default cardList;
