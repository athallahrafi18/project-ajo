import React from "react";
import { Bell, Menu } from "lucide-react";
import { User } from "../types/index";

interface DashboardNavbarProps {
  user?: User;
  toggleSidebar?: (mode: "mobile" | "collapse") => void;
  collapsed?: boolean;
}

const DashboardNavbar: React.FC<DashboardNavbarProps> = ({ user, toggleSidebar, collapsed }) => {
  const navbarWidth = collapsed
    ? "lg:left-20 lg:w-[calc(100%-5rem)]" // sidebar 80px
    : "lg:left-64 lg:w-[calc(100%-16rem)]"; // sidebar 256px

  return (
    <header
      className={`
        fixed top-0 right-0 z-40 h-16 px-4 bg-white shadow-sm flex items-center justify-between
        w-full transition-all duration-300
        ${navbarWidth}
      `}
    >
      {/* Hamburger Button */}
      <div className="flex items-center">
        <button
          onClick={() => {
            if (window.innerWidth >= 1024) {
              toggleSidebar?.("collapse");
            } else {
              toggleSidebar?.("mobile");
            }
          }}
          className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Notification & User */}
      <div className="flex items-center space-x-4">
        <button
          className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full"
          aria-label="Notifications"
        >
          <Bell className="h-6 w-6" />
          <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Hello,</span>
          <span className="text-sm font-medium text-gray-900">{user?.username}</span>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
