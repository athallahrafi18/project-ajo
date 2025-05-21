import { useState } from "react";
import { motion } from "framer-motion";
import { X, Save } from "lucide-react";
import axios from "axios";
import { User } from "../../types/index"; // ✅ Sesuaikan path import
import toast from "react-hot-toast";

interface UserModalProps {
  user?: User | null;
  onClose: () => void;
  onUserUpdated: () => void;
}

const UserModal = ({ user, onClose, onUserUpdated }: UserModalProps) => {
  const [formData, setFormData] = useState({
    email: user?.email || "",
    username: user?.username || "",
    fullName: user?.name || "",
    password: "",
    confirmPassword: "",
    role: user?.role_id.toString() || "1",
    status: user?.status || "active",
    metadata: {
      phoneNumber: user?.metadata?.phoneNumber || "",
      department: user?.metadata?.department || "",
      position: user?.metadata?.position || "",
      notes: user?.metadata?.notes || "",
    },
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("metadata.")) {
      const metadataKey = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        metadata: { ...prev.metadata, [metadataKey]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    if (!formData.email.includes("@")) {
      setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
      return;
    }
    if (!formData.fullName.trim()) {
      setErrors((prev) => ({ ...prev, fullName: "Full name is required" }));
      return;
    }
    if (!formData.username.trim()) {
      setErrors((prev) => ({ ...prev, username: "Username is required" }));
      return;
    }
    if (!user && formData.password.length < 6) {
      setErrors((prev) => ({ ...prev, password: "Password must be at least 6 characters" }));
      return;
    }
    if (!user && formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
      return;
    }

    try {
      const requestData = {
        name: formData.fullName,
        username: formData.username,
        email: formData.email,
        role_id: parseInt(formData.role),
        status: formData.status,
        metadata: formData.metadata,
        ...(user ? {} : { password: formData.password }),
      };

      if (user) {
        await axios.put(`http://localhost:8000/api/users/${user.id}`, requestData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast.success("User successfully updated");
      } else {
        await axios.post("http://localhost:8000/api/users", requestData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast.success("User successfully created");
      }

      onUserUpdated();
      onClose();
    } catch (error) {
      console.error("Failed to save user:", error);
    
      // Coba parsing error sebagai AxiosError
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
        toast.error("Validation failed");
      } else {
        setErrors({ general: "Failed to save user. Please try again." });
        toast.error("Failed to save user");
      } 
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {user ? "Edit User" : "Add New User"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full rounded-md border shadow-sm ${
                  errors.username
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                }`}
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className={`w-full rounded-md border shadow-sm ${
                  errors.username
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                }`}
              />
              {errors.fullName && <p className="text-sm text-red-600">{errors.fullName}</p>}
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className={`w-full rounded-md border shadow-sm ${
                  errors.username
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                }`}
              />
              {errors.username && <p className="text-sm text-red-600">{errors.username}</p>}
            </div>

            {/* Password (only if new user) */}
            {!user && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={`w-full rounded-md border shadow-sm ${
                      errors.password
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className={`w-full rounded-md border shadow-sm ${
                      errors.confirmPassword
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                    }`}
                  />
                </div>
              </>
            )}

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="1">Admin</option>
                <option value="2">Cashier</option>
                <option value="3">Manager</option>
                <option value="4">Owner</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            {/* Metadata */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Info</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Phone Number"
                  name="metadata.phoneNumber"
                  value={formData.metadata.phoneNumber}
                  onChange={handleChange}
                  className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
                <input
                  type="text"
                  placeholder="Department"
                  name="metadata.department"
                  value={formData.metadata.department}
                  onChange={handleChange}
                  className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
                <input
                  type="text"
                  placeholder="Position"
                  name="metadata.position"
                  value={formData.metadata.position}
                  onChange={handleChange}
                  className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
                <input
                  type="text"
                  placeholder="Notes"
                  name="metadata.notes"
                  value={formData.metadata.notes}
                  onChange={handleChange}
                  className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Saving...
                </span>
              ) : (
                <>
                  <Save className="h-4 w-4 inline-block mr-2" />
                  {user ? "Update User" : "Create User"}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default UserModal;
