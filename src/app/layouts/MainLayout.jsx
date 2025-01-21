"use client";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const MainLayout = ({ children }) => {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isLoginPage = pathname === "/pages/login";

  if (!isClient) {
    return null;
  }

  return (
    <div className={` ${isLoginPage ? "bg-blue-500" : "bg-gray-100"}`}>
      {/* Hide Sidebar and Navbar on login page */}
      {!isLoginPage && <Sidebar />}
      <div className={` ${isLoginPage ? "bg-blue-500" : "bg-gray-100"}`}>
        {/* Hide Navbar on login page */}
        {!isLoginPage && <Navbar />}
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
