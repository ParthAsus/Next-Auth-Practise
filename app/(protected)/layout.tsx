import React from "react";
import Navbar from "./_components/navbar";



interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({children}: ProtectedLayoutProps) => {
  return (
    <div className="h-full w-full flex justify-center items-center bg-blue-500 flex-col gap-y-10">
      <Navbar />
      {children}
    </div>
  )
}

export default ProtectedLayout;