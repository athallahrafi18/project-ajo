import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import { clearCart } from '../store/slices/cartSlice';
import { QrCode, Wallet } from 'lucide-react';
import { formatRupiah } from '../utils/formatCurrency';

interface CustomerInfo {
  fullName: string;
  tableNumber: string; // Nomor Meja
}

interface PaymentDetails {
  method: 'cash' | 'qris';
}

const Checkout = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const total = useSelector((state: RootState) => state.cart.total);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: '',
    tableNumber: '',
  });

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    method: 'cash', // Default metode pembayaran adalah cash
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    // Simpan data checkout sementara di localStorage
    localStorage.setItem("checkoutData", JSON.stringify({
      customerInfo,
      cartItems,
      total,
      paymentMethod: paymentDetails.method
    }));

    dispatch(clearCart()); // Kosongkan cart setelah checkout
    navigate('/payment'); // Pindah ke halaman pembayaran
  };

  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-serif font-bold text-secondary-900 mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Customer Information Section */}
          <div className="lg:col-span-7">
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-6">Customer Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-secondary-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      value={customerInfo.fullName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="tableNumber" className="block text-sm font-medium text-secondary-700">
                      Table Number
                    </label>
                    <input
                      type="text"
                      id="tableNumber"
                      name="tableNumber"
                      required
                      value={customerInfo.tableNumber}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Section */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => setPaymentDetails({ method: 'cash' })}
                    className={`flex items-center justify-center gap-2 p-3 rounded-md border ${
                      paymentDetails.method === 'cash'
                        ? 'border-primary-600 bg-primary-50 text-primary-600'
                        : 'border-secondary-200 hover:bg-secondary-50'
                    }`}
                  >
                    <Wallet className="w-5 h-5" />
                    <span>Cash</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentDetails(prev => ({ ...prev, method: 'qris' }))}
                    className={`flex items-center justify-center gap-2 p-3 rounded-md border ${
                      paymentDetails.method === 'qris'
                        ? 'border-primary-600 bg-primary-50 text-primary-600'
                        : 'border-secondary-200 hover:bg-secondary-50'
                    }`}
                  >
                    <QrCode className="w-5 h-5" />
                    <span>QRIS</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary Section */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex justify-between">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-secondary-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-medium">{formatRupiah(item.product.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t mt-6 pt-4 space-y-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatRupiah(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                onClick={handlePlaceOrder}
                className="w-full mt-6 bg-primary-600 text-white py-3 rounded-md hover:bg-primary-700 transition-colors"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Checkout;