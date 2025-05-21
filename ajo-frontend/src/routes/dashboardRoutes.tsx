import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminDashboard from "../pages/dashboard/admin/dashboard-admin";
import UserManagement from "../pages/dashboard/admin/UserManagement";
import MenuManagement from "../pages/dashboard/sharedPages/MenuManagement";
import CategoryPage from "../pages/dashboard/sharedPages/CategoryPage";
import { getRoleName } from "../utils/formatRole";

const DashboardRoutes = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  const userRole = getRoleName(user.role_id);

  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        {/* Admin Dashboard */}
        {userRole === "admin" && (
          <>
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/user-management" element={<UserManagement />} />
            <Route path="admin/menu-management" element={<MenuManagement />} />
            <Route path="admin/category-management" element={<CategoryPage />} />
          </>
        )}

        {/* Manager Dashboard */}
        {userRole === "manager" && (
          <>
            <Route path="manager/menu-management" element={<MenuManagement />} />
            <Route path="manager/category-management" element={<CategoryPage />} />
          </>
        )}

        {/* Redirect halaman tidak ditemukan ke dashboard sesuai role */}
        <Route path="*" element={<Navigate to={`/dashboard/${userRole === "admin" ? "admin" : userRole === "manager" ? "manager" : ""}`} />} />
      </Route>
    </Routes>
  );
};

export default DashboardRoutes;
