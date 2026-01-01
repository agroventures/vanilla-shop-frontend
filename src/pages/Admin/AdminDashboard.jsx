import React, { useEffect, useState, useMemo } from "react";
import {
  Gift,
  ShoppingBag,
  DollarSign,
  Truck,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  MoreVertical,
  Eye,
  X,
  User,
  MapPin,
  CreditCard,
  FileText,
} from "lucide-react";
import axios from "axios";
import { StatCard } from "../../components/admin/StatCard";
import PageTitle from "../../components/admin/PageTitle";
import { getOrders, getProducts, getTodayOrders, getTotalRevenue } from "../../api/data.api";
import { Link } from "react-router-dom";

// Helper functions
const formatPrice = (price) => {
  return `LKR ${new Intl.NumberFormat().format(price || 0)}`;
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getCustomerName = (order) => {
  return `${order.firstName || ''} ${order.lastName || ''}`.trim() || 'Unknown Customer';
};

const PAYMENT_METHODS = {
  cod: 'Cash on Delivery',
  card: 'Credit/Debit Card',
  paypal: 'PayPal',
  bank: 'Bank Transfer'
};

// Order Status Badge
const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { bg: "bg-yellow-100", text: "text-yellow-800", icon: Clock },
    processing: { bg: "bg-blue-100", text: "text-blue-800", icon: Package },
    cancelled: { bg: "bg-red-100", text: "text-red-800", icon: XCircle },
    delivered: { bg: "bg-green-100", text: "text-green-800", icon: CheckCircle },
    shipped: { bg: "bg-purple-100", text: "text-purple-800", icon: Truck },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <Icon className="w-3 h-3" />
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
};

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [todayOrders, setTodayOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
    }

    setLoading(true);

    Promise.all([
      getProducts(),
      getOrders(),
      getTodayOrders(),
      getTotalRevenue(),
    ])
      .then(([products, orders, todayOrders, totalRevenue]) => {
        setProducts(products);
        setOrders(orders);
        setTodayOrders(todayOrders);
        setTotalRevenue(totalRevenue);
      })
      .catch((err) => {
        console.error("Dashboard fetch error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Calculate top products from orders
  const topProducts = useMemo(() => {
    if (!orders || orders.length === 0) return [];

    const productMap = new Map();

    orders.forEach(order => {
      if (order.orderItems && Array.isArray(order.orderItems)) {
        order.orderItems.forEach(item => {
          const productId = item.product || item._id || item.name;
          const existing = productMap.get(productId);

          if (existing) {
            existing.sales += item.quantity || 1;
            existing.revenue += (item.price || 0) * (item.quantity || 1);
          } else {
            productMap.set(productId, {
              name: item.name || 'Unknown Product',
              image: item.image,
              sales: item.quantity || 1,
              revenue: (item.price || 0) * (item.quantity || 1),
            });
          }
        });
      }
    });

    // Convert to array and sort by sales
    const productsArray = Array.from(productMap.values());
    productsArray.sort((a, b) => b.sales - a.sales);

    // Calculate growth (mock calculation - you can implement real logic)
    return productsArray.slice(0, 4).map((product, index) => ({
      ...product,
      growth: `+${Math.floor(Math.random() * 20) + 1}%`, // Replace with real growth calculation
    }));
  }, [orders]);

  const recentOrders = orders.slice(0, 5);

  // Handle view order click
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowViewModal(true);
  };

  const ViewOrderModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

        <div className="relative bg-white w-full h-[90vh] sm:h-auto sm:max-w-3xl sm:max-h-[90vh] rounded-t-2xl sm:rounded-2xl shadow-xl flex flex-col">
          {/* Fixed Header */}
          <div className="flex-none flex items-center justify-between p-4 border-b border-vanilla-100 bg-white rounded-t-2xl">
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold text-dark truncate">Order Details</h2>
              <p className="text-charcoal/60 text-xs mt-0.5">
                ID: <span className="font-mono">{order.orderId?.slice(-8) || order._id?.slice(-8)}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-vanilla-100 rounded-lg transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Customer Info */}
              <div className="space-y-3">
                <h3 className="font-semibold text-dark flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-vanilla-600" />
                  Customer Information
                </h3>
                <div className="bg-vanilla-50 rounded-xl p-4 space-y-3 text-sm">
                  <div>
                    <p className="text-charcoal/60 text-xs">Name</p>
                    <p className="font-medium text-dark">{getCustomerName(order)}</p>
                  </div>
                  <div>
                    <p className="text-charcoal/60 text-xs">Email</p>
                    <a href={`mailto:${order.email}`} className="text-vanilla-600 hover:underline break-all">
                      {order.email}
                    </a>
                  </div>
                  <div>
                    <p className="text-charcoal/60 text-xs">Phone</p>
                    <a href={`tel:${order.phone}`} className="text-vanilla-600 hover:underline">
                      {order.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-3">
                <h3 className="font-semibold text-dark flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-vanilla-600" />
                  Shipping Address
                </h3>
                <div className="bg-vanilla-50 rounded-xl p-4 text-sm">
                  <p className="text-dark font-medium mb-1">{order.shippingAddress?.address}</p>
                  <p className="text-charcoal/70">
                    {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
                  </p>
                  <p className="text-charcoal/70">{order.shippingAddress?.country}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mt-6 space-y-3">
              <h3 className="font-semibold text-dark flex items-center gap-2 text-sm">
                <ShoppingBag className="w-4 h-4 text-vanilla-600" />
                Order Items ({order.orderItems?.length || 0})
              </h3>

              {/* Mobile Item List */}
              <div className="sm:hidden space-y-3">
                {order.orderItems?.map((item, index) => (
                  <div key={index} className="bg-vanilla-50 rounded-xl p-3 flex gap-3 border border-vanilla-100">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover max-w-full shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-vanilla-200 rounded-lg flex items-center justify-center shrink-0">
                        <Package className="w-6 h-6 text-vanilla-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-dark text-sm truncate">{item.name}</p>
                      <p className="text-charcoal/60 text-xs mt-0.5">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                      <p className="text-dark font-semibold text-sm mt-1">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Item Table */}
              <div className="hidden sm:block bg-vanilla-50 rounded-xl overflow-hidden border border-vanilla-100">
                <table className="w-full text-sm">
                  <thead className="bg-vanilla-100">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Product</th>
                      <th className="px-4 py-3 text-center font-medium">Qty</th>
                      <th className="px-4 py-3 text-right font-medium">Price</th>
                      <th className="px-4 py-3 text-right font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-vanilla-100">
                    {order.orderItems?.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-10 h-10 rounded-lg object-cover max-w-full"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-vanilla-200 rounded-lg flex items-center justify-center">
                                <Package className="w-5 h-5 text-vanilla-400" />
                              </div>
                            )}
                            <span className="font-medium text-dark">{item.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">{item.quantity}</td>
                        <td className="px-4 py-3 text-right">{formatPrice(item.price)}</td>
                        <td className="px-4 py-3 text-right font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Summary */}
            <div className="mt-6 grid md:grid-cols-2 gap-6">
              {/* Payment & Status */}
              <div className="space-y-3">
                <h3 className="font-semibold text-dark flex items-center gap-2 text-sm">
                  <CreditCard className="w-4 h-4 text-vanilla-600" />
                  Payment & Status
                </h3>
                <div className="bg-vanilla-50 rounded-xl p-4 space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-charcoal/60">Payment</span>
                    <span className="font-medium text-dark">
                      {PAYMENT_METHODS[order.paymentMethod] || order.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-charcoal/60">Status</span>
                    <StatusBadge status={order.status || 'pending'} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-charcoal/60">Date</span>
                    <span className="font-medium text-dark">{formatDate(order.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Price Summary */}
              <div className="space-y-3">
                <h3 className="font-semibold text-dark flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-vanilla-600" />
                  Price Summary
                </h3>
                <div className="bg-vanilla-50 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-charcoal/60">Subtotal</span>
                    <span>{formatPrice(order.itemsPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal/60">Shipping</span>
                    <span>
                      {order.shippingPrice === 0
                        ? <span className="text-green-600">Free</span>
                        : formatPrice(order.shippingPrice)
                      }
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-vanilla-200 mt-2">
                    <span className="font-semibold text-dark text-base">Total</span>
                    <span className="font-bold text-dark text-base">{formatPrice(order.totalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="flex-none p-4 bg-vanilla-50 border-t border-vanilla-100 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-vanilla-200 bg-white rounded-lg hover:bg-vanilla-100 transition-colors text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <PageTitle title="Dashboard" subtitle="Welcome back! Here's what's happening with your store today." />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Orders"
          value={loading ? "..." : todayOrders.length}
          icon={<ShoppingBag className="w-6 h-6" />}
        />
        <StatCard
          title="Revenue"
          value={`LKR ${loading ? "..." : new Intl.NumberFormat().format(totalRevenue)}`}
          icon={<DollarSign className="w-6 h-6" />}
        />
        <StatCard
          title="Products"
          value={loading ? "..." : products.length}
          icon={<Gift className="w-6 h-6" />}
        />
        <StatCard
          title="Total Orders"
          value={loading ? "..." : orders.length}
          icon={<ShoppingBag className="w-6 h-6" />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="xl:col-span-2 bg-cream rounded-2xl border border-vanilla-200 shadow-md overflow-hidden">
          <div className="p-6 border-b border-vanilla-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-dark">Recent Orders</h2>
                <p className="text-sm text-vanilla-600 mt-1">
                  Latest transactions from your store
                </p>
              </div>
              <Link to='/admin/orders'>
                <button className="text-sm font-medium text-dark cursor-pointer hover:underline transition-colors">
                  View All →
                </button>
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-vanilla-100">
                <tr>
                  <th className="text-left text-xs font-semibold text-vanilla-700 uppercase tracking-wider px-6 py-4">
                    Order
                  </th>
                  <th className="text-left text-xs font-semibold text-vanilla-700 uppercase tracking-wider px-6 py-4">
                    Customer
                  </th>
                  <th className="text-left text-xs font-semibold text-vanilla-700 uppercase tracking-wider px-6 py-4">
                    Status
                  </th>
                  <th className="text-left text-xs font-semibold text-vanilla-700 uppercase tracking-wider px-6 py-4">
                    Amount
                  </th>
                  <th className="text-left text-xs font-semibold text-vanilla-700 uppercase tracking-wider px-6 py-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-vanilla-200">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-vanilla-100 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-dark">{order.orderId}</p>
                        <p className="text-xs text-vanilla-600">{order.date}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-dark flex items-center justify-center text-cream font-semibold text-sm">
                          {order.avatar ? order.avatar : (order.firstName?.charAt(0) || '') + (order.lastName?.charAt(0) || '')}
                        </div>
                        <div>
                          <p className="font-medium text-dark">{order.firstName + " " + order.lastName}</p>
                          <p className="text-xs text-vanilla-600">{order.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-dark">LKR {new Intl.NumberFormat().format(order.totalPrice)}</span>
                    </td>
                    <td className="px-6 py-4">
                      {/* Fixed: Added onClick handler to show modal */}
                      <button 
                        onClick={() => handleViewOrder(order)} 
                        className="p-2 hover:bg-vanilla-200 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4 text-vanilla-700" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Top Products - Now dynamic from orders */}
          <div className="bg-cream rounded-2xl border border-vanilla-200 shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-dark">Top Products</h3>
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-4 text-vanilla-600">Loading...</div>
              ) : topProducts.length > 0 ? (
                topProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-vanilla-100 transition-colors"
                  >
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-vanilla-100 flex items-center justify-center">
                        <Package className="w-5 h-5 text-dark" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-dark truncate">{product.name}</p>
                      {/* <p className="text-xs text-vanilla-600">{product.sales} sales</p> */}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-dark text-sm">{formatPrice(product.revenue)}</p>
                      {/* <p className="text-xs text-green-600 font-medium">{product.growth}</p> */}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-vanilla-600">No product data available</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed: Modal now shows based on showViewModal state */}
      {showViewModal && selectedOrder && (
        <ViewOrderModal
          order={selectedOrder}
          onClose={() => {
            setShowViewModal(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
}

export default AdminDashboard;