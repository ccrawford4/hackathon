import React from "react";

interface StatCardProps {
  icon: React.ComponentType;
  number: number;
  heading: string;
  description: string;
  onClick: () => void;
}

export default function StatCard({ icon: Icon, number, heading, description, onClick }: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-black rounded-xl p-6 cursor-pointer transition-all hover:bg-black/90 hover:scale-[1.02]"
    >
      <Icon /* className="text-white mb-4 text-xl"*/ />
      <div className="text-4xl font-medium text-white mb-2">{number}</div>
      <div className="text-white mb-1">{heading}</div>
      <div className="text-gray-500 text-sm">{description}</div>
    </div>
  );
}