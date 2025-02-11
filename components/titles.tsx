import React from "react";

interface TitlesProps {
  title: string;
  description: string;
}

const Titles: React.FC<TitlesProps> = ({ title, description }) => {
  return (
    <div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default Titles;
