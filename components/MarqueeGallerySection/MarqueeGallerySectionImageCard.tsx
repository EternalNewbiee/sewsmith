import Image from "next/image";
import React from "react";

interface ProfileCardProps {
  name: string;
  title: string;
  tags: string[];
  imageUrl: string;
  grayscale?: boolean;
}

const GalleryProfile: React.FC<ProfileCardProps> = ({
  name,
  title,
  tags,
  imageUrl,
  grayscale,
}) => {
  return (
    <div
      className={`relative w-[273px] h-[340px] rounded-3xl flex flex-col justify-end leading-0 overflow-hidden ${
        grayscale ? "grayscale" : ""
      }`}
    >
      <div className="absolute top-0 left-0 right-0 bottom-0 z-0">
        <Image
          src={imageUrl}
          alt="Children smiling"
          width={273}
          height={340}
          className="h-full object-cover"
        />
      </div>

      <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-black to-transparent z-10 w-full h-full opacity-75">
        &nbsp;
      </div>

      <div className=" absolute bottom-0 left-0 right-0 px-5 py-4 text-white z-20">
        <h3 className="m-1 text-sm font-semibold">{name}</h3>
        <div className="m-1 text-xs">{title}</div>
        <ul className="grid  auto-cols-min grid-flow-col gap-2 ml-1 mt-3">
          {tags.map((tag, index) => (
            <li
              key={index}
              className="flex items-center h-6 rounded-full border-[1px] border-white whitespace-nowrap text-xs text-white px-3 py-1"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GalleryProfile;
