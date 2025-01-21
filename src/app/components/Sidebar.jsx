"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, ClipboardList, LogOut } from "lucide-react";
import { toast } from "react-toastify";
import { logoutUser } from "../utils/Api";

const Sidebar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false); // Sidebar closed by default on mobile
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role) {
      setUserRole(role);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await logoutUser(token);
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setUserRole(null);
        toast.success("Logged out successfully");
        router.push("/pages/login");
      }
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  const MenuItem = ({ icon: Icon, label, onClick }) => (
    <Button variant="ghost" className="w-full justify-start gap-2 hover:bg-primary/10" onClick={onClick}>
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Button>
  );

  const SidebarContent = () => {
    if (!userRole) return null;

    return (
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center border-b px-3 font-semibold">{isOpen ? "Material Management" : "MM"}</div>
        <div className="flex-1 space-y-4 p-2 mt-4">
          {userRole === "WAREHOUSE" && <MenuItem icon={Home} label="Dashboard" onClick={() => router.push("/pages/dashboard")} />}
          {userRole === "PRODUCTION" && (
            <>
              <MenuItem icon={ClipboardList} label="Material Request" onClick={() => router.push("/pages/request")} />
              <MenuItem icon={ClipboardList} label="Request Material History" onClick={() => router.push("/pages/history")} />
            </>
          )}
          <MenuItem icon={LogOut} label="Logout" onClick={handleLogout} />
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed left-4 top-3 z-50" onClick={() => setIsOpen(!isOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className={`w-64 p-0 bg-primary text-primary-foreground transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed inset-y-0 z-50 flex-col w-64 bg-primary text-primary-foreground transition-all duration-300 ease-in-out">
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;
