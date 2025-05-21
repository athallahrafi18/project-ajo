import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import { getRoleName } from "../utils/formatRole";

const DashboardLayout: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);     // For mobile toggle
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // For desktop collapse

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = getRoleName(user.role_id);
  const allowedRoles = ["admin", "cashier", "manager", "owner"];
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  // 🔀 Toggle handler
  const handleSidebarToggle = (mode: "mobile" | "collapse") => {
    if (mode === "mobile") {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex overflow-x-hidden">
      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 transition-transform duration-300 ease-in-out z-40
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 
          ${isSidebarCollapsed ? "lg:w-16" : "lg:w-64"}
        `}
      >
        <Sidebar collapsed={isSidebarCollapsed} />
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-x-hidden transition-all duration-300 ${isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
        <DashboardNavbar
          user={user}
          toggleSidebar={handleSidebarToggle}
          collapsed={isSidebarCollapsed}
        />

        <main className="pt-16 mt-8 px-4 md:px-6 pb-6 w-full overflow-x-hidden">
          <div className="w-full max-w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
