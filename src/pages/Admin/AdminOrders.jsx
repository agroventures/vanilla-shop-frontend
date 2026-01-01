import React, { useEffect, useState } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    Eye,
    Search,
    Filter,
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    Package,
    Truck,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    MoreVertical,
    Download,
    RefreshCcw,
    Mail,
    Phone,
    MapPin,
    Calendar,
    CreditCard,
    X,
    Loader2,
    FileText,
    User,
    ShoppingBag,
    SlidersHorizontal
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import PageTitle from "../../components/admin/PageTitle";
import { getOrders } from "../../api/data.api";

// Order Status Configuration
const ORDER_STATUSES = {
    pending: {
        label: 'Pending',
        color: 'bg-yellow-100 text-yellow-800',
        icon: Clock
    },
    processing: {
        label: 'Processing',
        color: 'bg-blue-100 text-blue-800',
        icon: Package
    },
    shipped: {
        label: 'Shipped',
        color: 'bg-purple-100 text-purple-800',
        icon: Truck
    },
    delivered: {
        label: 'Delivered',
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle
    },
    cancelled: {
        label: 'Cancelled',
        color: 'bg-red-100 text-red-800',
        icon: XCircle
    }
};

// Payment Method Labels
const PAYMENT_METHODS = {
    cod: 'Cash on Delivery',
    card: 'Credit/Debit Card',
    bank: 'Bank Transfer',
    mobile: 'Mobile Payment'
};

export default function AdminOrders() {
    // State
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filters & Search
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [showFilters, setShowFilters] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Modals
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);

    // Actions
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Expanded mobile cards
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    // Fetch orders
    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setIsLoading(true);
        setError(null);

        getOrders()
            .then((res) => {
                setOrders(res);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setError('Failed to load orders');
                setIsLoading(false);
            });
    };

    // Filter and search orders
    useEffect(() => {
        let result = [...orders];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(order =>
                order.orderId?.toLowerCase().includes(query) ||
                order.firstName?.toLowerCase().includes(query) ||
                order.lastName?.toLowerCase().includes(query) ||
                order.email?.toLowerCase().includes(query) ||
                order.phone?.includes(query) ||
                `${order.firstName} ${order.lastName}`.toLowerCase().includes(query)
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            result = result.filter(order => order.status === statusFilter);
        }

        // Date filter
        if (dateFilter !== 'all') {
            const now = new Date();
            const filterDate = new Date();

            switch (dateFilter) {
                case 'today':
                    filterDate.setHours(0, 0, 0, 0);
                    result = result.filter(order => new Date(order.createdAt) >= filterDate);
                    break;
                case 'week':
                    filterDate.setDate(now.getDate() - 7);
                    result = result.filter(order => new Date(order.createdAt) >= filterDate);
                    break;
                case 'month':
                    filterDate.setMonth(now.getMonth() - 1);
                    result = result.filter(order => new Date(order.createdAt) >= filterDate);
                    break;
                case 'year':
                    filterDate.setFullYear(now.getFullYear() - 1);
                    result = result.filter(order => new Date(order.createdAt) >= filterDate);
                    break;
            }
        }

        // Sort
        switch (sortBy) {
            case 'newest':
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'oldest':
                result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'highest':
                result.sort((a, b) => b.totalPrice - a.totalPrice);
                break;
            case 'lowest':
                result.sort((a, b) => a.totalPrice - b.totalPrice);
                break;
        }

        setFilteredOrders(result);
        setCurrentPage(1);
    }, [orders, searchQuery, statusFilter, dateFilter, sortBy]);

    // Pagination
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

    // Format price
    const formatPrice = (price) => {
        return `LKR ${(price || 0).toLocaleString()}`;
    };

    // Format date
    const formatDate = (dateString, short = false) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);

        if (short) {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            });
        }

        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get customer full name
    const getCustomerName = (order) => {
        return `${order.firstName || ''} ${order.lastName || ''}`.trim() || 'N/A';
    };

    // Get order items summary
    const getOrderItemsSummary = (order) => {
        if (!order.orderItems || order.orderItems.length === 0) return 'No items';

        const totalItems = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
        const firstItem = order.orderItems[0]?.name || 'Unknown';

        if (order.orderItems.length === 1) {
            return `${firstItem} (x${order.orderItems[0].quantity})`;
        }

        return `${firstItem} +${order.orderItems.length - 1} more (${totalItems} items)`;
    };

    // Update order status
    const handleUpdateStatus = async (orderId, newStatus) => {
        setIsUpdating(true);

        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/orders/${orderId}`, {
                status: newStatus
            });

            setOrders(prev => prev.map(order =>
                order._id === orderId ? { ...order, status: newStatus } : order
            ));

            toast.success(`Order status updated to ${ORDER_STATUSES[newStatus]?.label}`);
            setShowStatusModal(false);
            setSelectedOrder(null);
        } catch (err) {
            console.error('Error updating order:', err);
            toast.error('Failed to update order status');
        } finally {
            setIsUpdating(false);
        }
    };

    // Delete order
    const handleDeleteOrder = async () => {
        if (!selectedOrder) return;

        setIsDeleting(true);

        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/orders/${selectedOrder._id}`);

            setOrders(prev => prev.filter(order => order._id !== selectedOrder._id));
            toast.success('Order deleted successfully');
            setShowDeleteModal(false);
            setSelectedOrder(null);
        } catch (err) {
            console.error('Error deleting order:', err);
            toast.error('Failed to delete order');
        } finally {
            setIsDeleting(false);
        }
    };

    // Export orders
    const handleExport = () => {
        const csvContent = [
            ['Order ID', 'Customer', 'Email', 'Phone', 'Items', 'Total', 'Status', 'Payment', 'Date'].join(','),
            ...filteredOrders.map(order => [
                order._id,
                getCustomerName(order),
                order.email,
                order.phone,
                order.orderItems?.length || 0,
                order.totalPrice,
                order.status || 'pending',
                order.paymentMethod,
                formatDate(order.createdAt)
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();

        toast.success('Orders exported successfully');
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchQuery('');
        setStatusFilter('all');
        setDateFilter('all');
        setSortBy('newest');
    };

    const hasActiveFilters = searchQuery || statusFilter !== 'all' || dateFilter !== 'all' || sortBy !== 'newest';

    // Status Badge Component
    const StatusBadge = ({ status, size = 'default' }) => {
        const statusConfig = ORDER_STATUSES[status] || ORDER_STATUSES.pending;
        const Icon = statusConfig.icon;

        const sizeClasses = size === 'small'
            ? 'px-2 py-0.5 text-[10px]'
            : 'px-2.5 py-1 text-xs';

        return (
            <span className={`inline-flex items-center gap-1 rounded-full font-medium whitespace-nowrap ${sizeClasses} ${statusConfig.color}`}>
                <Icon className={size === 'small' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
                {statusConfig.label}
            </span>
        );
    };

    // View Order Modal
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
                                ID: <span className="font-mono">{order.orderId?.slice(-8)}</span>
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
                            onClick={() => {
                                setShowViewModal(false);
                                setShowStatusModal(true);
                            }}
                            className="flex-1 px-4 py-2.5 bg-vanilla-600 text-white rounded-lg hover:bg-vanilla-700 transition-colors text-sm font-medium"
                        >
                            Update Status
                        </button>
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

    // Update Status Modal
    const UpdateStatusModal = ({ order, onClose }) => {
        if (!order) return null;

        return (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

                <div className="relative bg-white w-full sm:max-w-md shadow-xl rounded-t-2xl sm:rounded-2xl flex flex-col max-h-[90vh]">
                    <div className="flex-none p-4 border-b border-vanilla-100">
                        <h2 className="text-lg font-semibold text-dark">Update Order Status</h2>
                        <p className="text-charcoal/60 text-xs mt-1">
                            Order: <span className="font-mono">{order.orderId?.slice(-8)}</span>
                        </p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {Object.entries(ORDER_STATUSES).map(([key, config]) => {
                            const Icon = config.icon;
                            const isActive = order.status === key;

                            return (
                                <button
                                    key={key}
                                    onClick={() => handleUpdateStatus(order._id, key)}
                                    disabled={isUpdating}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${isActive
                                        ? 'border-vanilla-400 bg-vanilla-50'
                                        : 'border-vanilla-100 hover:border-vanilla-300 active:scale-[0.98]'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.color}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="font-medium text-dark">{config.label}</p>
                                    </div>
                                    {isActive && (
                                        <CheckCircle className="w-5 h-5 text-vanilla-600" />
                                    )}
                                    {isUpdating && isActive && (
                                        <Loader2 className="w-4 h-4 animate-spin text-vanilla-600" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex-none p-4 border-t border-vanilla-100 bg-vanilla-50">
                        <button
                            onClick={onClose}
                            disabled={isUpdating}
                            className="w-full px-4 py-2.5 border border-vanilla-200 bg-white rounded-lg hover:bg-vanilla-100 transition-colors text-sm font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Delete Confirmation Modal
    const DeleteModal = ({ order, onClose }) => {
        if (!order) return null;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

                <div className="relative bg-white w-full max-w-sm shadow-xl rounded-2xl overflow-hidden">
                    <div className="p-6 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-dark mb-2">Delete Order?</h2>
                        <p className="text-charcoal/60 text-sm">
                            Are you sure you want to delete order <span className="font-mono font-medium">{order.orderId?.slice(-8)}</span>?
                            This action cannot be undone.
                        </p>
                    </div>

                    <div className="p-4 border-t border-vanilla-100 bg-vanilla-50 flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={isDeleting}
                            className="flex-1 px-4 py-2.5 border border-vanilla-200 bg-white rounded-lg hover:bg-vanilla-100 transition-colors text-sm font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteOrder}
                            disabled={isDeleting}
                            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Mobile Order Card Component
    const MobileOrderCard = ({ order }) => {
        const isExpanded = expandedOrderId === order._id;

        return (
            <div className="bg-white rounded-xl border border-vanilla-100 shadow-sm overflow-hidden w-full">
                {/* Card Header - Always Visible */}
                <div className="p-3 sm:p-4">
                    <div className="flex items-start justify-between gap-3 w-full">
                        <div className="flex-1 min-w-0">
                            {/* Badges Row */}
                            <div className="flex items-center gap-2 flex-wrap mb-1.5">
                                <span className="font-mono text-[10px] sm:text-xs font-medium bg-vanilla-100 px-2 py-0.5 rounded text-charcoal">
                                    {order.orderId?.slice(-8)}
                                </span>
                                <StatusBadge status={order.status || 'pending'} size="small" />
                            </div>
                            
                            {/* Customer Name */}
                            <p className="font-medium text-dark text-sm sm:text-base truncate">{getCustomerName(order)}</p>
                            
                            {/* Email */}
                            <p className="text-charcoal/60 text-xs truncate block max-w-full">{order.email}</p>
                        </div>
                        
                        {/* Price & Date */}
                        <div className="text-right shrink-0">
                            <p className="font-bold text-dark text-sm sm:text-base">{formatPrice(order.totalPrice)}</p>
                            <p className="text-charcoal/50 text-[10px] uppercase mt-0.5">{formatDate(order.createdAt, true)}</p>
                        </div>
                    </div>

                    {/* Items Summary - Fixed Truncation */}
                    <div className="mt-3 p-2 bg-vanilla-50 rounded-lg flex items-center gap-2 max-w-full">
                        <Package className="w-3.5 h-3.5 text-charcoal/60 shrink-0" />
                        <span className="text-charcoal/70 text-xs truncate min-w-0 flex-1">
                            {getOrderItemsSummary(order)}
                        </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 gap-2 mt-4">
                        <button
                            onClick={() => setExpandedOrderId(isExpanded ? null : order._id)}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium border border-vanilla-200 rounded-lg hover:bg-vanilla-50 transition-colors text-charcoal/80"
                        >
                            {isExpanded ? (
                                <>
                                    <ChevronUp className="w-3.5 h-3.5" />
                                    Less
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="w-3.5 h-3.5" />
                                    Details
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => {
                                setSelectedOrder(order);
                                setShowViewModal(true);
                            }}
                            className="p-2 text-blue-600 border border-blue-100 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors shrink-0"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => {
                                setSelectedOrder(order);
                                setShowStatusModal(true);
                            }}
                            className="p-2 text-amber-600 border border-amber-100 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors shrink-0"
                        >
                            <Pencil className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                    <div className="px-3 pb-3 pt-0 border-t border-vanilla-100 bg-vanilla-50/50">
                        <div className="pt-3 space-y-3">
                            {/* Contact Info */}
                            <div className="flex items-center gap-2 text-xs">
                                <Phone className="w-3.5 h-3.5 text-charcoal/40 shrink-0" />
                                <a href={`tel:${order.phone}`} className="text-vanilla-600 font-medium truncate">{order.phone}</a>
                            </div>

                            {/* Shipping Address */}
                            <div className="flex items-start gap-2 text-xs">
                                <MapPin className="w-3.5 h-3.5 text-charcoal/40 mt-0.5 shrink-0" />
                                <div className="text-charcoal/70 min-w-0 flex-1">
                                    <p className="font-medium text-dark truncate">{order.shippingAddress?.address}</p>
                                    <p className="truncate">{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="flex items-center gap-2 text-xs">
                                <CreditCard className="w-3.5 h-3.5 text-charcoal/40 shrink-0" />
                                <span className="text-charcoal/70 truncate">
                                    {PAYMENT_METHODS[order.paymentMethod] || order.paymentMethod}
                                </span>
                            </div>

                            {/* Order Items Preview */}
                            <div className="pt-2 border-t border-vanilla-100">
                                <p className="text-[10px] uppercase font-bold text-charcoal/40 mb-2">Items</p>
                                <div className="space-y-2">
                                    {order.orderItems?.slice(0, 3).map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-xs">
                                            {item.image ? (
                                                <img src={item.image} alt="" className="w-8 h-8 rounded object-cover max-w-full border border-vanilla-100 shrink-0" />
                                            ) : (
                                                <div className="w-8 h-8 bg-vanilla-200 rounded flex items-center justify-center shrink-0">
                                                    <Package className="w-4 h-4 text-vanilla-400" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="truncate text-dark font-medium">{item.name}</p>
                                                <p className="text-charcoal/50">x{item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {order.orderItems?.length > 3 && (
                                        <p className="text-xs text-charcoal/50 text-center py-1">
                                            +{order.orderItems.length - 3} more items
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        // Added overflow-x-hidden and max-w-full to prevent horizontal blowout
        <div className="w-full max-w-full overflow-x-hidden space-y-4 sm:space-y-6 pb-20 sm:pb-0">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <PageTitle
                        title="Orders"
                        subtitle={`${filteredOrders.length} order${filteredOrders.length !== 1 ? 's' : ''}`}
                    />

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                            onClick={fetchOrders}
                            disabled={isLoading}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 border border-vanilla-200 rounded-lg hover:bg-vanilla-50 transition-colors text-xs sm:text-sm bg-white"
                        >
                            <RefreshCcw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isLoading ? 'animate-spin' : ''}`} />
                            <span className="inline">Refresh</span>
                        </button>
                        <button
                            onClick={handleExport}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-vanilla-600 text-white rounded-lg hover:bg-vanilla-700 transition-colors text-xs sm:text-sm"
                        >
                            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span className="inline">Export</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards - Removed negative margins that caused overflow */}
            <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {Object.entries(ORDER_STATUSES).map(([key, config]) => {
                        const count = orders.filter(o => (o.status || 'pending') === key).length;
                        const Icon = config.icon;

                        return (
                            <button
                                key={key}
                                onClick={() => setStatusFilter(statusFilter === key ? 'all' : key)}
                                className={`shrink-0 w-full sm:w-auto p-3 sm:p-4 rounded-xl border-2 transition-all flex flex-col justify-between ${statusFilter === key
                                    ? 'border-vanilla-400 bg-vanilla-50'
                                    : 'border-vanilla-100 bg-white hover:border-vanilla-200'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-2 sm:mb-3 w-full">
                                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${config.color}`}>
                                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>
                                    <span className="text-xl sm:text-2xl font-bold text-dark">{count}</span>
                                </div>
                                <p className="text-xs font-medium text-charcoal/60 text-left">{config.label}</p>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Search & Filters */}
            <div className="bg-white rounded-xl border border-vanilla-100 p-3 sm:p-4 shadow-sm">
                {/* Search Row */}
                <div className="flex gap-2">
                    <div className="relative flex-1 min-w-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 border border-vanilla-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-vanilla-400 focus:border-transparent text-sm"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Filter Toggle - Mobile */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`lg:hidden p-2.5 border rounded-lg transition-colors flex items-center justify-center shrink-0 ${showFilters || hasActiveFilters
                            ? 'border-vanilla-400 bg-vanilla-50 text-vanilla-700'
                            : 'border-vanilla-200 text-charcoal/60 hover:bg-vanilla-50'
                            }`}
                    >
                        <SlidersHorizontal className="w-5 h-5" />
                    </button>
                </div>

                {/* Filter Dropdowns */}
                <div className={`${showFilters ? 'grid' : 'hidden'} lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3 pt-3 border-t border-vanilla-100 lg:border-0 lg:pt-0`}>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-3 py-2.5 border border-vanilla-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-vanilla-400 text-sm bg-white"
                    >
                        <option value="all">All Statuses</option>
                        {Object.entries(ORDER_STATUSES).map(([key, config]) => (
                            <option key={key} value={key}>{config.label}</option>
                        ))}
                    </select>

                    <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-full px-3 py-2.5 border border-vanilla-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-vanilla-400 text-sm bg-white"
                    >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">Last 7 Days</option>
                        <option value="month">Last 30 Days</option>
                        <option value="year">Last Year</option>
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-3 py-2.5 border border-vanilla-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-vanilla-400 text-sm bg-white"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="highest">Highest Amount</option>
                        <option value="lowest">Lowest Amount</option>
                    </select>

                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="w-full px-3 py-2.5 text-vanilla-600 border border-vanilla-200 hover:bg-vanilla-50 rounded-lg transition-colors text-sm font-medium"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            </div>

            {/* Content Area */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-vanilla-500 animate-spin" />
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center py-20 px-4">
                    <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
                    <p className="text-charcoal/60 text-center">{error}</p>
                    <button
                        onClick={fetchOrders}
                        className="mt-4 px-4 py-2 bg-vanilla-600 text-white rounded-lg hover:bg-vanilla-700 text-sm"
                    >
                        Try Again
                    </button>
                </div>
            ) : paginatedOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-xl border border-vanilla-100">
                    <Package className="w-12 h-12 text-vanilla-300 mb-4" />
                    <p className="text-charcoal/60 text-center font-medium">No orders found</p>
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="mt-2 text-vanilla-600 hover:text-vanilla-700 text-sm"
                        >
                            Clear current filters
                        </button>
                    )}
                </div>
            ) : (
                <>
                    {/* Mobile: Card View */}
                    <div className="lg:hidden grid grid-cols-1 gap-4 w-full">
                        {paginatedOrders.map((order) => (
                            <MobileOrderCard key={order._id} order={order} />
                        ))}
                    </div>

                    {/* Desktop: Table View */}
                    <div className="hidden lg:block overflow-hidden rounded-xl border border-vanilla-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-vanilla-50/50 border-b border-vanilla-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left font-semibold text-charcoal">Order ID</th>
                                        <th className="px-6 py-4 text-left font-semibold text-charcoal">Customer</th>
                                        <th className="px-6 py-4 text-left font-semibold text-charcoal">Products</th>
                                        <th className="px-6 py-4 text-left font-semibold text-charcoal">Total</th>
                                        <th className="px-6 py-4 text-left font-semibold text-charcoal">Status</th>
                                        <th className="px-6 py-4 text-left font-semibold text-charcoal">Date</th>
                                        <th className="px-6 py-4 text-right font-semibold text-charcoal">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-vanilla-100">
                                    {paginatedOrders.map((order) => (
                                        <tr
                                            key={order._id}
                                            className="hover:bg-vanilla-50 transition-colors group"
                                        >
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-xs font-medium bg-vanilla-100 text-charcoal px-2 py-1 rounded">
                                                    {order.orderId?.slice(-8)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-dark">{getCustomerName(order)}</p>
                                                    <p className="text-charcoal/60 text-xs">{order.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="max-w-50 truncate text-charcoal/70" title={getOrderItemsSummary(order)}>
                                                    {getOrderItemsSummary(order)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-semibold text-dark">
                                                    {formatPrice(order.totalPrice)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={order.status || 'pending'} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-charcoal/60 text-xs">
                                                    {formatDate(order.createdAt)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="inline-flex items-center justify-end gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedOrder(order);
                                                            setShowViewModal(true);
                                                        }}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedOrder(order);
                                                            setShowStatusModal(true);
                                                        }}
                                                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                        title="Update Status"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedOrder(order);
                                                            setShowDeleteModal(true);
                                                        }}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete Order"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-vanilla-100">
                    <p className="text-xs sm:text-sm text-charcoal/60">
                        Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredOrders.length)} of {filteredOrders.length}
                    </p>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        {/* Mobile Simple Pagination */}
                        <div className="flex sm:hidden w-full max-w-full overflow-hidden">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="flex-1 px-3 py-2 hover:bg-vanilla-50 disabled:opacity-50 disabled:cursor-not-allowed border-r border-vanilla-200 flex justify-center"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 text-sm font-medium bg-white whitespace-nowrap">
                                {currentPage} / {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="flex-1 px-3 py-2 hover:bg-vanilla-50 disabled:opacity-50 disabled:cursor-not-allowed border-l border-vanilla-200 flex justify-center"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Desktop Numbered Pagination */}
                        <div className="hidden sm:flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-2 border border-vanilla-200 rounded-lg hover:bg-vanilla-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`w-10 h-10 rounded-lg font-medium transition-colors text-sm ${currentPage === pageNum
                                            ? 'bg-vanilla-600 text-white'
                                            : 'border border-vanilla-200 hover:bg-vanilla-50'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="p-2 border border-vanilla-200 rounded-lg hover:bg-vanilla-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modals */}
            {showViewModal && (
                <ViewOrderModal
                    order={selectedOrder}
                    onClose={() => {
                        setShowViewModal(false);
                        setSelectedOrder(null);
                    }}
                />
            )}

            {showStatusModal && (
                <UpdateStatusModal
                    order={selectedOrder}
                    onClose={() => {
                        setShowStatusModal(false);
                        setSelectedOrder(null);
                    }}
                />
            )}

            {showDeleteModal && (
                <DeleteModal
                    order={selectedOrder}
                    onClose={() => {
                        setShowDeleteModal(false);
                        setSelectedOrder(null);
                    }}
                />
            )}
        </div>
    );
}