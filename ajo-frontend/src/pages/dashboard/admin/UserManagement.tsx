import React from "react";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { User, UserAuditLog } from "../../../types/index"; // ✅ Sesuaikan path import
import {
  Plus,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Trash2,
  ChevronUp,
  ChevronDown,
  Clock,
  Edit,
  MoreHorizontal,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { getRoleName } from "../../../utils/formatRole";
import UserModal from "../../../components/modals/UserModal";
import Loading from "../../../components/Loading";
import toast from "react-hot-toast";

const API_URL = "http://localhost:8000/api/users";

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenModal = (user?: User) => {
    setSelectedUser(user || null);
    setIsModalOpen(true);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | string>("all");
  const [dateFilter, setDateFilter] = useState<"all" | "7days" | "30days" | "90days">("all");

  // Toggle Mobile Filters
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sort
  const [sortField, setSortField] = useState<
    "name" | "role_id" | "status" | "last_login" | "created_at"
  >("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (
    field: "name" | "role_id" | "status" | "last_login" | "created_at"
  ) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Selection
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  // Expanded Row & Selected User
  const [expandedUser, setExpandedUser] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Audit Logs per User
  const [userAuditLogs, setUserAuditLogs] = useState<Record<number, UserAuditLog[]>>({});

  // Toggle reset page to 1 on filter/search change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, roleFilter, statusFilter, dateFilter]);

  // Auto fallback to last page if current page > totalPages
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  // 📦 Fetch Data Users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          search: searchQuery || undefined,
          role: roleFilter !== "all" ? roleFilter : undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
          date: dateFilter !== "all" ? dateFilter : undefined,
          sort: sortField,
          order: sortDirection,
          page,
          per_page: itemsPerPage,
        },
      });

      setUsers(response.data.data);
      setTotalPages(response.data.last_page);
      setTotalItems(response.data.total);
    } catch (err) {
      console.error(err);
      setError("Gagal mengambil data user");
    } finally {
      setLoading(false);
    }
  }, [
    searchQuery,
    roleFilter,
    statusFilter,
    dateFilter,
    sortField,
    sortDirection,
    page,
    itemsPerPage,
  ]);

  // 📦 Fetch Audit Logs (dibungkus dengan useCallback)
  const fetchAuditLogsByUserId = useCallback(async (userId: number) => {
    // Cek apakah log sudah ada agar tidak fetch ulang
    if (userAuditLogs[userId]) return;

    try {
      const response = await axios.get<UserAuditLog[]>(
        `http://localhost:8000/api/users/${userId}/audit-logs`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!Array.isArray(response.data)) {
        console.warn(`Audit log untuk user ${userId} tidak valid.`);
        return;
      }

      setUserAuditLogs(prev => ({
        ...prev,
        [userId]: response.data,
      }));
    } catch (err) {
      console.error(`Gagal mengambil audit log untuk user ${userId}:`, err);
    }
  }, [userAuditLogs]);

  // 🧠 useEffect untuk fetch data
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // 🧹 Reset selected user saat pagination berganti
  useEffect(() => {
    setSelectedUsers([]);
    setExpandedUser(null);
    setSelectedUser(null);
  }, [page]);

  // Bulk Action handler (dummy)
  const handleBulkAction = async (action: "activate" | "deactivate" | "delete") => {
    if (selectedUsers.length === 0) return;

    try {
      setLoading(true);

      // Jalankan aksi ke setiap user ID
      await Promise.all(
        selectedUsers.map(async (id) => {
          if (action === "delete") {
            await axios.delete(`http://localhost:8000/api/users/${id}`, {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
          } else {
            await axios.patch(`http://localhost:8000/api/users/${id}/status`, {
              status: action === "activate" ? "active" : "inactive",
            }, {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
          }
        })
      );

      toast.success(`Berhasil melakukan aksi ${action} ke ${selectedUsers.length} user`);
      setSelectedUsers([]);
      fetchUsers(); // Refresh data setelah aksi selesai
    } catch (error) {
      console.error("Gagal melakukan bulk action:", error);
      toast.error("Terjadi kesalahan saat melakukan aksi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          User Management
        </h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center justify-center">
          <Plus className="h-5 w-5 sm:mr-2" />
          <span className="hidden sm:inline">Add New User</span>
        </button>
      </div>

      {/* Modal (Hanya ditampilkan jika isModalOpen = true) */}
      {isModalOpen && (
        <UserModal
          user={selectedUser} // Jika ada user, modal akan menjadi Edit
          onClose={() => setIsModalOpen(false)}
          onUserUpdated={() => {
            fetchUsers();
            setIsModalOpen(false);
            // ✅ Tambahkan fungsi fetchUsers untuk refresh data setelah add/edit
          }}
        />
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-wrap sm:flex-nowrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Toggle for mobile */}
          <div className="sm:hidden mt-3">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="text-primary-600 font-medium text-sm flex items-center gap-1"
            >
              {showMobileFilters ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Hide Filters
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Show Filters
                </>
              )}
            </button>
          </div>

          {/* Select filters: tetap inline di desktop, stacking di mobile */}
          <div
            className={`${showMobileFilters ? "flex" : "hidden"
              } sm:flex flex-col xs:flex-row sm:flex-row items-stretch sm:items-center gap-4 flex-wrap sm:flex-nowrap w-full sm:w-auto`}
          >
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
              className="border border-gray-300 rounded-md py-2 px-3 w-full sm:w-auto"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="cashier">Cashier</option>
              <option value="Owner">Owner</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="border border-gray-300 rounded-md py-2 px-3 w-full sm:w-auto"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as typeof dateFilter)}
              className="border border-gray-300 rounded-md py-2 px-3 w-full sm:w-auto"
            >
              <option value="all">All Time</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>

            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-50 w-fit">
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Bulk actions tetap */}
        {selectedUsers.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-4 p-2 bg-gray-50 rounded-md">
            <span className="text-sm text-gray-600">
              {selectedUsers.length} users selected
            </span>
            <button
              onClick={() => handleBulkAction("activate")}
              className="text-green-600 text-sm font-medium">
              <CheckCircle className="h-4 w-4 inline-block mr-1" />
              Activate
            </button>
            <button
              onClick={() => handleBulkAction("deactivate")}
              className="text-yellow-600 text-sm font-medium">
              <AlertTriangle className="h-4 w-4 inline-block mr-1" />
              Deactivate
            </button>
            <button
              onClick={() => handleBulkAction("delete")}
              className="text-red-600 text-sm font-medium">
              <Trash2 className="h-4 w-4 inline-block mr-1" />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Table Users */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto max-w-full scrollbar scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <table className="min-w-[1024px] md:min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedUsers.length ===
                      users.length
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(
                          users.map((u) => u.id)
                        );
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                {[
                  { label: "User", field: "name" },
                  { label: "Role", field: "role_id" },
                  { label: "Status", field: "status" },
                  { label: "Last Login", field: "last_login" },
                  { label: "Registered", field: "created_at" },
                ].map(({ label, field }) => (
                  <th
                    key={field}
                    className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() =>
                      handleSort(
                        field as
                        | "name"
                        | "role_id"
                        | "status"
                        | "last_login"
                        | "created_at"
                      )
                    }>
                    <div className="flex items-center">
                      {label}
                      {sortField === field &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="h-4 w-4 ml-1" />
                        ) : (
                          <ChevronDown className="h-4 w-4 ml-1" />
                        ))}
                    </div>
                  </th>
                ))}
                <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Loading State */}
              {loading && (
                <tr>
                  <td colSpan={7} className="py-12">
                    <div className="h-[300px] flex items-center justify-center">
                      <Loading />
                    </div>
                  </td>
                </tr>
              )}

              {/* Error State */}
              {!loading && error && (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-red-500">
                    {error}
                  </td>
                </tr>
              )}

              {/* No Data */}
              {!loading && !error && users.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-400">
                    No users found.
                  </td>
                </tr>
              )}

              {!loading && !error && users.map((user) => (
                <React.Fragment key={user.id}>
                  <tr
                    className={
                      selectedUsers.includes(user.id)
                        ? "bg-primary-50"
                        : ""
                    }>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(
                          user.id
                        )}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([
                              ...selectedUsers,
                              user.id,
                            ]);
                          } else {
                            setSelectedUsers(
                              selectedUsers.filter(
                                (id) =>
                                  id !==
                                  user.id
                              )
                            );
                          }
                        }}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-primary-600 font-medium">
                              {user.name
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                        {getRoleName(user.role_id)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : user.status ===
                            "inactive"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-red-100 text-red-800"
                          }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.last_login
                        ? formatDistanceToNow(
                          new Date(user.last_login),
                          { addSuffix: true }
                        )
                        : "Never"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(
                        new Date(user.created_at),
                        "MMM dd, yyyy"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleOpenModal(user)}
                        className="text-primary-600 hover:text-primary-900 mr-3">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          const newExpanded = expandedUser === user.id ? null : user.id;
                          setExpandedUser(newExpanded);
                          if (newExpanded) fetchAuditLogsByUserId(user.id); // hanya fetch saat expand
                        }}
                        className="text-primary-600 hover:text-primary-900 mr-3">
                        {expandedUser === user.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                  {/* Detail Row untuk Audit Log */}
                  {expandedUser === user.id && (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Detail User */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">User Details</h4>
                            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                              <dt className="text-gray-500">Department</dt>
                              <dd className="text-gray-900">{user.metadata?.department || "-"}</dd>
                              <dt className="text-gray-500">Position</dt>
                              <dd className="text-gray-900">{user.metadata?.position || "-"}</dd>
                              <dt className="text-gray-500">Phone</dt>
                              <dd className="text-gray-900">{user.metadata?.phoneNumber || "-"}</dd>
                              <dt className="text-gray-500">Notes</dt>
                              <dd className="text-gray-900">{user.metadata?.notes || "-"}</dd>
                            </dl>
                          </div>

                          {/* Log Aktivitas User */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Activity</h4>
                            <div className="space-y-2">
                              {userAuditLogs[user.id]?.slice(0, 3).map((log) => (
                                <div key={log.id} className="flex items-center text-sm">
                                  <Clock className="h-4 w-4 text-gray-400 mr-2" />
                                  <span className="text-gray-600">{log.details.description}</span>
                                  <span className="text-gray-400 ml-2">
                                    {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                                  </span>
                                </div>
                              )) ?? <p className="text-gray-500 text-sm">No logs found</p>}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 sm:hidden">
            <div className="text-center text-sm text-gray-600 mb-2">
              Showing {(page - 1) * itemsPerPage + 1} to{" "}
              {Math.min(page * itemsPerPage, totalItems)} of {totalItems} results
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setPage(page > 1 ? page - 1 : 1)}
                disabled={page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
                disabled={page === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(page - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-medium">{Math.min(page * itemsPerPage, totalItems)}</span>{' '}
                of <span className="font-medium">{totalItems}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <ChevronDown className="h-5 w-5 rotate-90" />
                  <ChevronDown className="h-5 w-5 -ml-2 rotate-90" />
                </button>
                <button
                  onClick={() => setPage(page > 1 ? page - 1 : 1)}
                  disabled={page === 1}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <ChevronDown className="h-5 w-5 rotate-90" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => Math.abs(p - page) < 2 || p === 1 || p === totalPages)
                  .map((p, i, arr) => {
                    if (i > 0 && arr[i - 1] !== p - 1) {
                      return (
                        <React.Fragment key={p}>
                          <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                            ...
                          </span>
                          <button
                            onClick={() => setPage(p)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === p
                              ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                          >
                            {p}
                          </button>
                        </React.Fragment>
                      );
                    }
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === p
                          ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                <button
                  onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
                  disabled={page === totalPages}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <ChevronDown className="h-5 w-5 -rotate-90" />
                </button>
                <button
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <ChevronDown className="h-5 w-5 -rotate-90" />
                  <ChevronDown className="h-5 w-5 -ml-2 -rotate-90" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
