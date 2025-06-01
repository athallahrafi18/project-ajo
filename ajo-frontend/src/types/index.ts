export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  status: 'In Stock' | 'Out of Stock';

  category: {
    id: number;
    name: string;
    parent: {
      id: number;
      name: string;
    } | null;
  };

  is_best_seller: boolean;

  customization?: {
    options: CustomizationOption[];
  };
}

export interface CustomizationOption {
  name: string;
  choices: string[];
  price?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customizations?: Record<string, string>;
}

export interface Review {
  id: string;
  productId: string;
  rating: number;
  criteria: {
    quality: number;
    value: number;
    shipping: number;
  };
  comment: string;
  photos: string[];
  helpful: number;
  notHelpful: number;
  createdAt: string;
  edited: boolean;
  verified: boolean;
}

export interface Customer {
  name: string;
  table: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: "pending" | "paid" | "cancelled";
  paymentMethod: "cash" | "qris";
  createdAt: string;
  notes?: string[];
  customer: Customer;
}

export interface User { 
  id: number;
  name: string;
  username: string;
  email: string;
  role_id: number; // ✅ Gunakan role_id langsung dari backend
  status: "active" | "inactive" | "suspended";
  last_login: string | null;
  metadata?: Record<string, string | null>; // ✅ Menyesuaikan metadata agar fleksibel
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// ✅ Tambahkan ini untuk mendukung audit log di frontend
export interface UserAuditLog {
  id: number;
  user_id: number;
  action_type: "create" | "update" | "delete" | "status_change";
  details: {
    description: string;
    updated_fields?: string[]; // hanya tersedia jika action_type = update
  };
  timestamp: string;
}
