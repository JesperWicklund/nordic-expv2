"use client";
// components/AccommodationCard.tsx
import React from "react";
import Link from "next/link";
import { Accommodation } from "@/types/accommodation";
import Image from "next/image";

type AccommodationCardProps = {
  accommodation: Accommodation;
};

const AccommodationCard: React.FC<AccommodationCardProps> = ({
  accommodation,
}) => {
  return (
    <Link href={`/housing/${accommodation.id}`}>
      <div className=" p-4 border-b-2">
        <div className="border border-slate-900 rounded-xl">
          <Image
            width={500}
            height={500}
            src={accommodation.images[0]}
            alt={accommodation.name}
            className="w-full h-64 object-cover rounded-xl"
          />
        </div>
        <div className="p-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold ">{accommodation.name}</h2>
            <p>
              {accommodation.country}, {accommodation.city}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-[#DE8022]">
              ${accommodation.price}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AccommodationCard;
