import React from "react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon }) => {
  return (
    <div className="px-4 pb-2 pt-4 border rounded-lg flex items-end justify-between overflow-hidden relative group hover:bg-muted transition-colors">
      <div className="">
        <h3 className="text-lg text-muted-foreground">{title}</h3>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <div className="translate-x-5 translate-y-5 absolute right-0 bottom-0 group-hover:scale-110 duration-500 transition-transform">
        {icon}
      </div>
    </div>
  );
};

export default StatsCard;
