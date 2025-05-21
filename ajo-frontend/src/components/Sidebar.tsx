import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { logout } from "../store/slices/authSlice";
import { LayoutDashboard, Coffee, LogOut, Users, BookOpen, FolderTree } from "lucide-react";
import { getRoleName } from "../utils/formatRole";

interface SidebarProps {
  collapsed?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) return null;

  const userRole = getRoleName(user.role_id);

  return (
    <aside
      className={`${collapsed ? "w-20" : "w-64"
        } bg-white shadow-md h-full transition-all duration-300`}
    >
      <div className="h-full flex flex-col">
        <div className="p-4">
          <Link to="/dashboard/admin" className="flex items-center space-x-2">
            <Coffee className="h-8 w-8 text-primary-600" />
            {!collapsed && (
              <span className="text-xl font-semibold text-gray-900">
                Oōmi Lezato
              </span>
            )}
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {(userRole === "admin" || userRole === "manager") && (
              <>
                {userRole === "admin" && (
                  <li>
                    <Link
                      to="/dashboard/admin"
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${location.pathname === "/dashboard/admin"
                          ? "bg-primary-50 text-primary-600"
                          : "text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      {!collapsed && <span>Dashboard</span>}
                    </Link>
                  </li>
                )}

                <li>
                  <Link
                    to={`/dashboard/${userRole}/category-management`}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${location.pathname === `/dashboard/${userRole}/category-management`
                        ? "bg-primary-50 text-primary-600"
                        : "text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    <FolderTree className="h-5 w-5" />
                    {!collapsed && <span>Categories</span>}
                  </Link>
                </li>

                <li>
                  <Link
                    to={`/dashboard/${userRole}/menu-management`}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${location.pathname === `/dashboard/${userRole}/menu-management`
                        ? "bg-primary-50 text-primary-600"
                        : "text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    <BookOpen className="h-5 w-5" />
                    {!collapsed && <span>Menu</span>}
                  </Link>
                </li>

                {userRole === "admin" && (
                  <li>
                    <Link
                      to="/dashboard/admin/user-management"
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${location.pathname === "/dashboard/admin/user-management"
                          ? "bg-primary-50 text-primary-600"
                          : "text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                      <Users className="h-5 w-5" />
                      {!collapsed && <span>User</span>}
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-600 font-medium">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </span>
            </div>
            {!collapsed && (
              <div>
                <p className="text-sm font-medium text-gray-900">{user.name || "Unknown"}</p>
                <p className="text-xs text-gray-500 capitalize">{userRole}</p>
              </div>
            )}
          </div>
          <button
            onClick={() => dispatch(logout())}
            className={`w-full flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors ${collapsed ? "justify-center" : ""
              }`}
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
