import React from 'react';
import Image from "next/image";

interface StatCardProps {
    icon: React.ComponentType;
    number: number;
    heading: string;
    description: string;
    onClick: () => void;
};

export const StatCard = ({ 
  icon: Icon, 
  number, 
  heading, 
  description, 
  onClick,
}: StatCardProps) => {
  return (
    <div 
      onClick={onClick}
      className="bg-zinc-900 p-4 rounded-xl relative cursor-pointer w-48"
    >
      {/* Icon */}
      <div className="mb-4">
        <div className="text-2xl text-white"> 
          {<Icon/>}
        </div>
      </div>

      {/* Number */}
      <div className="text-3xl font-semibold mb-1">
        {number}
      </div>

      {/* Heading and Description */}
      <div>
        <div className="font-medium text-slate-400">{heading}</div>
        <div className="text-slate-500 text-sm">{description}</div>
      </div>
    </div>
  );
};