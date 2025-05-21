// import { Order } from '../types';
// import { menuData } from './menuData';
// import { format, subDays, subHours, subMinutes } from 'date-fns';

// // Helper function to create an order ID
// const generateOrderId = () => {
//   return `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
// };

// // Sample customer data
// const customers = [
//   {
//     name: 'Sarah Johnson',
//     email: 'sarah.j@example.com',
//     phone: '(555) 123-4567',
//     address: '789 Oak Avenue, Suite 101, Portland, OR 97201',
//   },
//   {
//     name: 'Michael Chen',
//     email: 'mchen@example.com',
//     phone: '(555) 234-5678',
//     address: '456 Pine Street, Apt 3B, Portland, OR 97202',
//   },
//   {
//     name: 'Emily Rodriguez',
//     email: 'emily.r@example.com',
//     phone: '(555) 345-6789',
//     address: '123 Maple Drive, Portland, OR 97203',
//   },
//   {
//     name: 'James Wilson',
//     email: 'jwilson@example.com',
//     phone: '(555) 456-7890',
//     address: '321 Cedar Lane, Portland, OR 97204',
//   },
//   {
//     name: 'Aisha Patel',
//     email: 'aisha.p@example.com',
//     phone: '(555) 567-8901',
//     address: '654 Birch Road, Portland, OR 97205',
//   }
// ];

// // Sample special requests
// const specialRequests = [
//   'Extra hot',
//   'No ice',
//   'Light ice',
//   'Sugar-free syrup',
//   'Dairy-free milk',
//   'Extra shot of espresso',
//   'Whipped cream on top',
//   'Chocolate drizzle',
//   'Cinnamon powder',
//   'To-go packaging'
// ];

// export const sampleOrders: Order[] = [
//   {
//     id: generateOrderId(),
//     items: [
//       {
//         product: menuData[2],
//         quantity: 2,
//         customizations: {
//           'Temperature': 'Extra hot',
//           'Milk': 'Oat milk',
//           'Extra shot': 'Yes'
//         }
//       },
//       {
//         product: menuData[6],
//         quantity: 1,
//         customizations: {
//           'Toppings': 'Extra whipped cream',
//           'Temperature': 'Warm'
//         }
//       }
//     ],
//     total: 29.97,
//     status: 'delivered',
//     paymentMethod: 'card',
//     createdAt: format(subDays(new Date(), 2), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
//     estimatedDelivery: format(subDays(new Date(), 2), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
//     trackingNumber: 'TRK123456789',
//     shippingAddress: customers[0].address,
//     billingAddress: customers[0].address,
//     notes: ['Ring doorbell twice', 'Leave at door if no answer'],
//     customer: customers[0]
//   },
//   {
//     id: generateOrderId(),
//     items: [
//       {
//         product: menuData[1],
//         quantity: 4,
//         customizations: {
//           'Temperature': 'Iced',
//           'Size': 'Large'
//         }
//       }
//     ],
//     total: 39.96,
//     status: 'processing',
//     paymentMethod: 'ewallet',
//     createdAt: format(subHours(new Date(), 3), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
//     shippingAddress: customers[1].address,
//     billingAddress: customers[1].address,
//     notes: ['Office building - check in at reception'],
//     customer: customers[1]
//   },
//   {
//     id: generateOrderId(),
//     items: [
//       {
//         product: menuData[3],
//         quantity: 1,
//         customizations: {
//           'Spice Level': 'Medium',
//           'Add-ons': 'Extra cheese'
//         }
//       },
//       {
//         product: menuData[8],
//         quantity: 2,
//         customizations: {
//           'Toppings': 'Berry compote',
//           'Temperature': 'Chilled'
//         }
//       }
//     ],
//     total: 42.97,
//     status: 'pending',
//     paymentMethod: 'qris',
//     createdAt: format(subMinutes(new Date(), 15), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
//     shippingAddress: customers[2].address,
//     billingAddress: customers[2].address,
//     customer: customers[2]
//   },
//   {
//     id: generateOrderId(),
//     items: [
//       {
//         product: menuData[10],
//         quantity: 2,
//         customizations: {
//           'Type': 'Non-alcoholic',
//           'Ice': 'Light ice'
//         }
//       }
//     ],
//     total: 25.98,
//     status: 'shipped',
//     paymentMethod: 'card',
//     createdAt: format(subDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
//     estimatedDelivery: format(subHours(new Date(), 2), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
//     trackingNumber: 'TRK987654321',
//     shippingAddress: customers[3].address,
//     billingAddress: customers[3].address,
//     notes: ['Contactless delivery preferred'],
//     customer: customers[3]
//   },
//   {
//     id: generateOrderId(),
//     items: [
//       {
//         product: menuData[4],
//         quantity: 1,
//         customizations: {
//           'Doneness': 'Medium rare',
//           'Side': 'Sweet potato fries'
//         }
//       },
//       {
//         product: menuData[11],
//         quantity: 2,
//         customizations: {
//           'Temperature': 'Hot',
//           'Milk': 'Almond milk'
//         }
//       }
//     ],
//     total: 39.97,
//     status: 'delivered',
//     paymentMethod: 'cash',
//     createdAt: format(subDays(new Date(), 3), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
//     shippingAddress: customers[4].address,
//     billingAddress: customers[4].address,
//     customer: customers[4]
//   },
//   {
//     id: generateOrderId(),
//     items: [
//       {
//         product: menuData[5],
//         quantity: 2,
//         customizations: {
//           'Add-ons': 'Truffle oil',
//           'Portion': 'Large'
//         }
//       }
//     ],
//     total: 39.98,
//     status: 'processing',
//     paymentMethod: 'card',
//     createdAt: format(subHours(new Date(), 5), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
//     shippingAddress: customers[0].address,
//     billingAddress: customers[0].address,
//     notes: ['Please include extra napkins'],
//     customer: customers[0]
//   },
//   {
//     id: generateOrderId(),
//     items: [
//       {
//         product: menuData[7],
//         quantity: 3,
//         customizations: {
//           'Temperature': 'Room temperature',
//           'Sauce': 'Extra caramel'
//         }
//       }
//     ],
//     total: 23.97,
//     status: 'pending',
//     paymentMethod: 'ewallet',
//     createdAt: format(subMinutes(new Date(), 30), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
//     shippingAddress: customers[1].address,
//     billingAddress: customers[1].address,
//     customer: customers[1]
//   },
//   {
//     id: generateOrderId(),
//     items: [
//       {
//         product: menuData[9],
//         quantity: 1,
//         customizations: {
//           'Size': 'Family size',
//           'Toppings': 'Mixed berries'
//         }
//       },
//       {
//         product: menuData[2],
//         quantity: 2,
//         customizations: {
//           'Spice Level': 'Mild',
//           'Add-ons': 'Extra sauce'
//         }
//       }
//     ],
//     total: 35.97,
//     status: 'shipped',
//     paymentMethod: 'qris',
//     createdAt: format(subDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
//     estimatedDelivery: format(subHours(new Date(), 4), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
//     trackingNumber: 'TRK456789123',
//     shippingAddress: customers[2].address,
//     billingAddress: customers[2].address,
//     customer: customers[2]
//   },
//   {
//     id: generateOrderId(),
//     items: [
//       {
//         product: menuData[0],
//         quantity: 2,
//         customizations: {
//           'Sauce': 'Spicy marinara',
//           'Add-ons': 'Extra crispy'
//         }
//       },
//       {
//         product: menuData[10],
//         quantity: 2,
//         customizations: {
//           'Type': 'Signature cocktail',
//           'Ice': 'Regular'
//         }
//       }
//     ],
//     total: 51.96,
//     status: 'delivered',
//     paymentMethod: 'card',
//     createdAt: format(subDays(new Date(), 4), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
//     shippingAddress: customers[3].address,
//     billingAddress: customers[3].address,
//     notes: ['Birthday celebration - include candle'],
//     customer: customers[3]
//   },
//   {
//     id: generateOrderId(),
//     items: [
//       {
//         product: menuData[6],
//         quantity: 4,
//         customizations: {
//           'Temperature': 'Warm',
//           'Sauce': 'Extra chocolate'
//         }
//       },
//       {
//         product: menuData[11],
//         quantity: 4,
//         customizations: {
//           'Temperature': 'Hot',
//           'Milk': 'Soy milk'
//         }
//       }
//     ],
//     total: 55.92,
//     status: 'processing',
//     paymentMethod: 'ewallet',
//     createdAt: format(subHours(new Date(), 2), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
//     shippingAddress: customers[4].address,
//     billingAddress: customers[4].address,
//     notes: ['Office party order - need serving utensils'],
//     customer: customers[4]
//   }
// ];

// // Export individual orders for specific use cases
// export const getRecentOrders = () => {
//   return sampleOrders.sort((a, b) => 
//     new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//   );
// };

// export const getPendingOrders = () => {
//   return sampleOrders.filter(order => order.status === 'pending');
// };

// export const getDeliveredOrders = () => {
//   return sampleOrders.filter(order => order.status === 'delivered');
// };

// export const getOrdersByCustomer = (email: string) => {
//   return sampleOrders.filter(order => order.customer.email === email);
// };

// export const getOrderById = (id: string) => {
//   return sampleOrders.find(order => order.id === id);
// };