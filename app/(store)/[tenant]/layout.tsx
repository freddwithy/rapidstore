import React from "react";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full mx-auto max-w-[1080px] flex flex-col animate-fade">
      {children}
    </div>
  );
};

export default PageLayout;
