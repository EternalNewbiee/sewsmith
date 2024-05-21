"use client";
import { motion } from "framer-motion";
import React from "react";

import MarqueeGallerySectionImageCard from "@/components/MarqueeGallerySection/MarqueeGallerySectionImageCard";

const profiles = [
  {
    name: "Lilla Chu",
    title: "Breast Cancer Survivor",
    tags: ["Cancer", "Women"],
    imageUrl:
      "https://images.pexels.com/photos/6798704/pexels-photo-6798704.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Replace with actual image path
    grayscale: false,
  },
  {
    name: "Anacleta Corazon",
    title: "Successful Medical Assistance",
    tags: ["Elderly", "Medical"],
    imageUrl:
      "https://images.pexels.com/photos/6975046/pexels-photo-6975046.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Replace with actual image path
    grayscale: false,
  },
  {
    name: "Lucinda Ruiz",
    title: "Granting a Memorial Wish",
    tags: ["Elderly", "Memorial", "Financial"],
    imageUrl:
      "https://images.pexels.com/photos/11514916/pexels-photo-11514916.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Replace with actual image path
    grayscale: true, // Example of a grayscale image
  },
  {
    name: "FoodPH Initiative",
    title: "Feeding a million children",
    tags: ["Nonprofit", "Children"],
    imageUrl: "https://www.fmsc.org/-/media/hfh_blog/marinel-feature.jpg?iar=0", // Replace with actual image path
    grayscale: false,
  },
  {
    name: "Typhoon Ocampo",
    title: "Over 100k Relief Goods Distributed",
    tags: ["Disaster Relief", "Major Campaign"],
    imageUrl:
      "https://assets-global.website-files.com/6287850a0485ea045a5e0ce2/632899641cb192d7f88998c5_DRRM%203.jpg", // Replace with actual image path
    grayscale: false,
  },
  {
    name: "Philtrees",
    title: "Planted 4 million Trees",
    tags: ["Environment", "Major Campaign"],
    imageUrl:
      "https://images.pexels.com/photos/1390371/pexels-photo-1390371.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Replace with actual image path
    grayscale: false,
  },
];

const MarqueeGallerySection = () => {
  const marqueeVariants = {
    animate: {
      x: [0, -1782],
      transition: {
        x: {
          repeat: Infinity,
          repeatDelay: 1, // Delay in seconds before the animation repeats
          duration: 30, // Duration of the animation in seconds
          ease: "easeInOut", // Easing function for a smoother transition
        },
      },
    },
  };

  return (
    <div className="relative overflow-hidden w-full">
      <motion.div
        className="grid grid-flow-col auto-cols-min gap-6 py-10 w-auto"
        variants={marqueeVariants}
        animate="animate"
      >
        {[...profiles, ...profiles].map((profile, index) => (
          <MarqueeGallerySectionImageCard
            key={`${profile.name}-${index}`}
            {...profile}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default MarqueeGallerySection;
