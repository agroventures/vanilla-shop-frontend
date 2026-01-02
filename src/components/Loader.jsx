import React, { useEffect } from "react";
import logo from "/logo.png";

const Loader = () => {
  useEffect(() => {
        document.title = 'ELEVARE Magazine'
      })
      
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="w-30 h-30 flex items-center justify-center rounded-full border border-black">
      <img
        src={logo}
        alt="Loading..."
        className="w-20 animate-pulse"
      />
      </div>
    </div>
  );
};

export default Loader;
