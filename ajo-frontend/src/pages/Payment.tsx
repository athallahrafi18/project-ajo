import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Coffee, Phone, Mail } from 'lucide-react';
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { formatRupiah } from '../utils/formatCurrency';
import { Order, CartItem } from '../types/index';

const Payment = () => {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<Order | null>(null);

  useEffect(() => {
    const data = localStorage.getItem('checkoutData');
    if (data) {
      const parsed = JSON.parse(data);

      const mappedOrder: Order = {
        id: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        createdAt: new Date().toISOString(),
        status: 'paid',
        paymentMethod: parsed.paymentMethod,
        total: parsed.total,
        items: parsed.cartItems,
        notes: [],
        customer: {
          name: parsed.customerInfo.fullName,
          table: parsed.customerInfo.tableNumber,
        }
      };

      setOrderData(mappedOrder);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const downloadReceipt = async () => {
    const receipt = document.getElementById('receipt');
    if (receipt) {
      const canvas = await html2canvas(receipt);
      const pdf = new jsPDF();
      const imgData = canvas.toDataURL('image/png');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`receipt-${orderData?.id}.pdf`);
    }
  };

  if (!orderData) return null;

  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div id="receipt" className="bg-white p-8 rounded-lg shadow-md">
          {/* Header */}
          <div className="text-center mb-6 border-b pb-6">
            <div className="flex items-center justify-center mb-2">
              <Coffee className="h-8 w-8 text-primary-600 mr-2" />
              <h2 className="text-2xl font-serif font-bold text-secondary-900">Oomi Lezato</h2>
            </div>
            <p className="text-secondary-600">Jl. Abdul Hakim No.2, Padang Bulan Selayang I, Kec. Medan Selayang, Kota Medan, Sumatera Utara 20131</p>
            <div className="flex items-center justify-center gap-4 mt-2 text-sm text-secondary-600">
              <span className="flex items-center"><Phone className="w-4 h-4 mr-1" /> 081268356935</span>
              <span className="flex items-center"><Mail className="w-4 h-4 mr-1" /> hello@oomiLezato.com</span>
            </div>
          </div>

          {/* Order Info */}
          <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold">Order ID:</p>
              <p className="text-secondary-600">{orderData.id}</p>
            </div>
            <div>
              <p className="font-semibold">Date & Time:</p>
              <p className="text-secondary-600">{format(new Date(orderData.createdAt), 'PPpp')}</p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="mb-6 border-b pb-6">
            <h3 className="font-semibold mb-3">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Name:</p>
                <p className="text-secondary-600">{orderData.customer.name}</p>
                <p className="font-medium mt-2">Table Number:</p>
                <p className="text-secondary-600">{orderData.customer.table}</p>
              </div>
              <div>
                <p className="font-medium">Payment Method:</p>
                <p className="text-secondary-600 capitalize">{orderData.paymentMethod}</p>
                <p className="text-green-600 mt-2">Status: Paid</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Order Details</h3>
            <div className="space-y-2 text-sm">
              {orderData.items.map((item: CartItem) => (
                <div key={item.product.id} className="flex justify-between">
                  <span>{item.product.name} x {item.quantity}</span>
                  <span>{formatRupiah(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="border-t border-b py-4 text-sm">
            <div className="flex justify-between font-semibold text-lg pt-2">
              <span>Total</span>
              <span>{formatRupiah(orderData.total)}</span>
            </div>
          </div>

          {/* QR Code */}
          <div className="text-center mt-6">
            <QRCode
              value={`https://cafehaven.com/orders/${orderData.id}`}
              size={100}
              className="mx-auto"
            />
            <p className="text-xs text-secondary-500 mt-1">Scan to track your order</p>
          </div>

          {/* Footer */}
          <div className="text-sm text-center mt-4 text-secondary-600">
            <p>Thank you for your order!</p>
            <p className="mt-1">See you again soon ☕</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-4 justify-center">
          <button
            onClick={downloadReceipt}
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
          >
            Download Receipt
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-secondary-100 text-secondary-700 px-6 py-2 rounded-md hover:bg-secondary-200 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Payment;
