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
  Eye,
  X,
  User,
  MapPin,
  CreditCard,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";
import { StatCard } from "../../components/admin/StatCard";
import PageTitle from "../../components/admin/PageTitle";
import { getOrders, getProducts, getTodayOrders, getTotalRevenue } from "../../api/data.api";
import useSEO from "../../hooks/useSEO";

// --- Helper Functions ---
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

// --- Status Badge Component ---
const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: {
      bg: "bg-amber-100",
      text: "text-amber-800",
      border: "border-amber-200",
      icon: Clock
    },
    processing: {
      bg: "bg-blue-50",
      text: "text-blue-800",
      border: "border-blue-200",
      icon: Package
    },
    cancelled: {
      bg: "bg-red-50",
      text: "text-red-800",
      border: "border-red-200",
      icon: XCircle
    },
    delivered: {
      bg: "bg-emerald-50",
      text: "text-emerald-800",
      border: "border-emerald-200",
      icon: CheckCircle
    },
    shipped: {
      bg: "bg-purple-50",
      text: "text-purple-800",
      border: "border-purple-200",
      icon: Truck
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
      <Icon className="w-3 h-3" />
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
};

// --- Main Dashboard Component ---
function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [todayOrders, setTodayOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const url = window.location.href;

  useSEO({
    title: "Dashboard - The Vanilla Shop",
    url,
    image_alt: "Dashboard",
    twitter_card: "summary_large_image",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
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

  // Calculate top products
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

    const productsArray = Array.from(productMap.values());
    productsArray.sort((a, b) => b.sales - a.sales);
    return productsArray.slice(0, 4);
  }, [orders]);

  const recentOrders = orders.slice(0, 5);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowViewModal(true);
  };

  // --- Modal Component ---
  const ViewOrderModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-vanilla-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

        {/* Modal Content */}
        <div className="relative bg-vanilla-50 w-full h-[90vh] sm:h-auto sm:max-w-3xl sm:max-h-[85vh] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col font-sans border border-vanilla-200">

          {/* Fixed Header */}
          <div className="flex-none flex items-center justify-between p-5 border-b border-vanilla-200 bg-white sm:rounded-t-2xl">
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-bold font-serif text-vanilla-900 truncate">Order Details</h2>
              <p className="text-vanilla-800/70 text-sm mt-1">
                ID: <span className="font-mono text-gold-500 font-medium">#{order.orderId?.slice(-8) || order._id?.slice(-8)}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-vanilla-800 hover:bg-vanilla-100 hover:text-vanilla-900 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-8 bg-vanilla-50">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Customer Info */}
              <div className="space-y-3">
                <h3 className="font-bold text-vanilla-900 flex items-center gap-2 text-sm uppercase tracking-wider">
                  <User className="w-4 h-4 text-gold-500" />
                  Customer
                </h3>
                <div className="bg-white border border-vanilla-200 rounded-xl p-4 space-y-2 text-sm shadow-sm">
                  <div>
                    <p className="text-vanilla-800/60 text-xs">Name</p>
                    <p className="font-medium text-vanilla-900">{getCustomerName(order)}</p>
                  </div>
                  <div>
                    <p className="text-vanilla-800/60 text-xs">Email</p>
                    <a href={`mailto:${order.email}`} className="text-gold-500 hover:underline break-all">
                      {order.email}
                    </a>
                  </div>
                  <div>
                    <p className="text-vanilla-800/60 text-xs">Phone</p>
                    <a href={`tel:${order.phone}`} className="text-vanilla-900 hover:text-gold-500">
                      {order.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-3">
                <h3 className="font-bold text-vanilla-900 flex items-center gap-2 text-sm uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-gold-500" />
                  Shipping To
                </h3>
                <div className="bg-white border border-vanilla-200 rounded-xl p-4 text-sm shadow-sm h-full">
                  <p className="text-vanilla-900 font-medium mb-1">{order.shippingAddress?.address}</p>
                  <p className="text-vanilla-800/80">
                    {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
                  </p>
                  <p className="text-vanilla-800/80">{order.shippingAddress?.country}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-3">
              <h3 className="font-bold text-vanilla-900 flex items-center gap-2 text-sm uppercase tracking-wider">
                <ShoppingBag className="w-4 h-4 text-gold-500" />
                Items ({order.orderItems?.length || 0})
              </h3>

              {/* Mobile List */}
              <div className="sm:hidden space-y-3">
                {order.orderItems?.map((item, index) => (
                  <div key={index} className="bg-white border border-vanilla-200 rounded-xl p-3 flex gap-3 shadow-sm">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover bg-vanilla-100 shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-vanilla-100 rounded-lg flex items-center justify-center shrink-0">
                        <Package className="w-6 h-6 text-vanilla-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-vanilla-900 text-sm truncate">{item.name}</p>
                      <p className="text-vanilla-800/60 text-xs mt-0.5">{item.quantity} × {formatPrice(item.price)}</p>
                      <p className="text-gold-500 font-bold text-sm mt-1">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table */}
              <div className="hidden sm:block bg-white rounded-xl overflow-hidden border border-vanilla-200 shadow-sm">
                <table className="w-full text-sm">
                  <thead className="bg-vanilla-100 text-vanilla-800">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Product</th>
                      <th className="px-4 py-3 text-center font-semibold">Qty</th>
                      <th className="px-4 py-3 text-right font-semibold">Price</th>
                      <th className="px-4 py-3 text-right font-semibold">Total</th>
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
                                className="w-10 h-10 rounded-lg object-cover bg-vanilla-100"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-vanilla-100 rounded-lg flex items-center justify-center">
                                <Package className="w-5 h-5 text-vanilla-400" />
                              </div>
                            )}
                            <span className="font-medium text-vanilla-900">{item.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center text-vanilla-800">{item.quantity}</td>
                        <td className="px-4 py-3 text-right text-vanilla-800">{formatPrice(item.price)}</td>
                        <td className="px-4 py-3 text-right font-medium text-vanilla-900">
                          {formatPrice(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Summary & Payment */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-bold text-vanilla-900 flex items-center gap-2 text-sm uppercase tracking-wider">
                  <CreditCard className="w-4 h-4 text-gold-500" />
                  Status
                </h3>
                <div className="bg-white border border-vanilla-200 rounded-xl p-4 space-y-3 text-sm shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-vanilla-800/70">Payment Method</span>
                    <span className="font-medium text-vanilla-900">
                      {PAYMENT_METHODS[order.paymentMethod] || order.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-vanilla-800/70">Order Status</span>
                    <StatusBadge status={order.status || 'pending'} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-vanilla-800/70">Placed On</span>
                    <span className="font-medium text-vanilla-900">{formatDate(order.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-vanilla-900 flex items-center gap-2 text-sm uppercase tracking-wider">
                  <FileText className="w-4 h-4 text-gold-500" />
                  Summary
                </h3>
                <div className="bg-white border border-vanilla-200 rounded-xl p-4 space-y-2 text-sm shadow-sm">
                  <div className="flex justify-between">
                    <span className="text-vanilla-800/70">Subtotal</span>
                    <span className="text-vanilla-900">{formatPrice(order.itemsPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-vanilla-800/70">Shipping</span>
                    <span>
                      {order.shippingPrice === 0
                        ? <span className="text-green-600 font-medium">Free</span>
                        : <span className="text-vanilla-900">{formatPrice(order.shippingPrice)}</span>
                      }
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-vanilla-100 mt-2">
                    <span className="font-bold text-vanilla-900 text-base">Total</span>
                    <span className="font-bold text-gold-500 text-lg">{formatPrice(order.totalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="flex-none p-4 bg-white border-t border-vanilla-200 sm:rounded-b-2xl">
            <button
              onClick={onClose}
              className="w-full py-3 bg-vanilla-900 text-vanilla-50 font-medium rounded-lg hover:bg-vanilla-800 transition-colors shadow-lg"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <PageTitle title="Dashboard" subtitle="Welcome back! Here's what's happening with your store today." />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Orders"
          value={loading ? "..." : todayOrders.length}
          icon={<ShoppingBag className="w-6 h-6 text-gold-500" />}
        />
        <StatCard
          title="Revenue"
          value={`LKR ${loading ? "..." : new Intl.NumberFormat().format(totalRevenue)}`}
          icon={<DollarSign className="w-6 h-6 text-gold-500" />}
        />
        <StatCard
          title="Products"
          value={loading ? "..." : products.length}
          icon={<Gift className="w-6 h-6 text-gold-500" />}
        />
        <StatCard
          title="Total Orders"
          value={loading ? "..." : orders.length}
          icon={<ShoppingBag className="w-6 h-6 text-gold-500" />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Recent Orders Table */}
        <div className="xl:col-span-2 bg-vanilla-50 rounded-2xl border border-vanilla-200 shadow-xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-vanilla-200 flex items-center justify-between bg-white">
            <div>
              <h2 className="text-xl font-bold font-serif text-vanilla-900">Recent Orders</h2>
              <p className="text-sm text-vanilla-800/70 mt-1">Latest transactions from your store</p>
            </div>
            <Link to='/admin/orders'>
              <button className="text-sm font-semibold text-gold-500 hover:text-vanilla-900 transition-colors flex items-center gap-1">
                View All →
              </button>
            </Link>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full">
              <thead className="bg-vanilla-100">
                <tr>
                  <th className="text-left text-xs font-bold text-vanilla-800 uppercase tracking-wider px-6 py-4">Order</th>
                  <th className="text-left text-xs font-bold text-vanilla-800 uppercase tracking-wider px-6 py-4">Customer</th>
                  <th className="text-left text-xs font-bold text-vanilla-800 uppercase tracking-wider px-6 py-4">Status</th>
                  <th className="text-left text-xs font-bold text-vanilla-800 uppercase tracking-wider px-6 py-4">Amount</th>
                  <th className="text-left text-xs font-bold text-vanilla-800 uppercase tracking-wider px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-vanilla-200 bg-white">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-vanilla-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-vanilla-900 font-mono text-sm">#{order.orderId}</p>
                      <p className="text-xs text-vanilla-800/60 mt-0.5">{formatDate(order.createdAt).split(',')[0]}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-vanilla-900 flex items-center justify-center text-gold-500 font-serif font-bold text-sm shadow-sm">
                          {order.avatar ? order.avatar : (order.firstName?.charAt(0) || '') + (order.lastName?.charAt(0) || '')}
                        </div>
                        <div>
                          <p className="font-medium text-vanilla-900 text-sm">{order.firstName + " " + order.lastName}</p>
                          <p className="text-xs text-vanilla-800/60 truncate max-w-30">{order.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-vanilla-900">LKR {new Intl.NumberFormat().format(order.totalPrice)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="p-2 text-vanilla-400 hover:text-gold-500 hover:bg-vanilla-100 rounded-lg transition-all"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products Sidebar */}
        <div className="space-y-6">
          <div className="bg-vanilla-50 rounded-2xl border border-vanilla-200 shadow-xl overflow-hidden h-full">
            <div className="p-6 border-b border-vanilla-200 bg-white">
              <h3 className="text-xl font-bold font-serif text-vanilla-900">Top Products</h3>
            </div>

            <div className="p-4 space-y-2 bg-white h-full">
              {loading ? (
                <div className="text-center py-8 text-vanilla-400 animate-pulse">Loading data...</div>
              ) : topProducts.length > 0 ? (
                topProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-vanilla-50 border border-transparent hover:border-vanilla-200 transition-all group"
                  >
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover bg-vanilla-100 shadow-sm"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-vanilla-100 flex items-center justify-center">
                        <Package className="w-6 h-6 text-vanilla-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-vanilla-900 truncate group-hover:text-gold-600 transition-colors">{product.name}</p>
                      <p className="text-xs text-vanilla-800/60">{product.sales} sales generated</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-vanilla-900 text-sm">{formatPrice(product.revenue)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-vanilla-400 italic">No product data available</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* View Order Modal */}
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