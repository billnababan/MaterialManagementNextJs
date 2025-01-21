"use client";

import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, LogOut } from "lucide-react";
import { toast } from "react-toastify";
import { logoutUser } from "../utils/Api";

const Navbar = () => {
  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await logoutUser(token);
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        toast.success("Logged out successfully");
        router.push("/pages/login");
      } else {
        router.push("/pages/login");
      }
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-between items-center bg-primary text-primary-foreground px-6 py-4 fixed w-full z-50">
      {/* Left section (optional logo or title) */}
      <div className="flex items-center space-x-2">
        <Menu className="h-5 w-5 cursor-pointer md:hidden" onClick={() => router.push("/pages/dashboard")} />
        <span className="text-xl font-semibold">Material Management</span>
      </div>

      {/* Right section: Profile and Logout */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <FaUser className="text-xl" />
          <span className="text-white">{user?.username || "Guest"}</span>
        </div>
        <Button variant="outline" size="sm" className="flex items-center gap-1 text-black hover:bg-red-600 hover:text-gray-400" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
