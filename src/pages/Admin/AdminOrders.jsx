import React, { useEffect, useState } from "react";
import {
    Pencil,
    Trash2,
    Eye,
    Search,
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
    Download,
    RefreshCcw,
    Phone,
    MapPin,
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
import useSEO from "../../hooks/useSEO";

// Order Status Configuration
const ORDER_STATUSES = {
    pending: {
        label: 'Pending',
        bg: 'bg-amber-50',
        text: 'text-amber-800',
        border: 'border-amber-200',
        icon: Clock
    },
    processing: {
        label: 'Processing',
        bg: 'bg-blue-50',
        text: 'text-blue-800',
        border: 'border-blue-200',
        icon: Package
    },
    shipped: {
        label: 'Shipped',
        bg: 'bg-purple-50',
        text: 'text-purple-800',
        border: 'border-purple-200',
        icon: Truck
    },
    delivered: {
        label: 'Delivered',
        bg: 'bg-emerald-50',
        text: 'text-emerald-800',
        border: 'border-emerald-200',
        icon: CheckCircle
    },
    cancelled: {
        label: 'Cancelled',
        bg: 'bg-red-50',
        text: 'text-red-800',
        border: 'border-red-200',
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

    const url = window.location.href;

    useSEO({
        title: "Orders - The Vanilla Shop",
        description: "The Vanilla Shop is more than a café — it’s Sri Lanka’s first dedicated vanilla boutique.",
        url,
        image_alt: "Orders",
        twitter_card: "summary_large_image",
    });

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

    // Helper Functions
    const formatPrice = (price) => `LKR ${(price || 0).toLocaleString()}`;

    const formatDate = (dateString, short = false) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return short
            ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const getCustomerName = (order) => `${order.firstName || ''} ${order.lastName || ''}`.trim() || 'N/A';

    const getOrderItemsSummary = (order) => {
        if (!order.orderItems || order.orderItems.length === 0) return 'No items';
        const totalItems = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
        const firstItem = order.orderItems[0]?.name || 'Unknown';
        if (order.orderItems.length === 1) return `${firstItem} (x${order.orderItems[0].quantity})`;
        return `${firstItem} +${order.orderItems.length - 1} more (${totalItems} items)`;
    };

    // API Handlers
    const handleUpdateStatus = async (orderId, newStatus) => {
        setIsUpdating(true);
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/orders/${orderId}`, { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setOrders(prev => prev.map(order => order._id === orderId ? { ...order, status: newStatus } : order));
            toast.success(`Order status updated to ${ORDER_STATUSES[newStatus]?.label}`);
            setShowStatusModal(false);
            setSelectedOrder(null);
        } catch (err) {
            toast.error('Failed to update order status');
        } finally {
            setIsUpdating(false);
        }
    };

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
            toast.error('Failed to delete order');
        } finally {
            setIsDeleting(false);
        }
    };

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
        const sizeClasses = size === 'small' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

        return (
            <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${sizeClasses} ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
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
                <div className="absolute inset-0 bg-vanilla-900/60 backdrop-blur-sm" onClick={onClose} />
                <div className="relative bg-white w-full h-[90vh] sm:h-auto sm:max-w-3xl sm:max-h-[90vh] rounded-t-2xl sm:rounded-2xl shadow-xl flex flex-col border border-vanilla-200">
                    {/* Header */}
                    <div className="flex-none flex items-center justify-between p-5 border-b border-vanilla-200 bg-white sm:rounded-t-2xl">
                        <div className="min-w-0 flex-1">
                            <h2 className="text-xl font-bold font-serif text-vanilla-900 truncate">Order Details</h2>
                            <p className="text-vanilla-800/70 text-sm mt-1">
                                ID: <span className="font-mono text-gold-500 font-medium">#{order.orderId?.slice(-8)}</span>
                            </p>
                        </div>
                        <button onClick={onClose} className="p-2 text-vanilla-800 hover:bg-vanilla-100 rounded-lg transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-5 sm:p-8 bg-vanilla-50 space-y-8">
                        {/* Customer & Address */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <h3 className="font-bold text-vanilla-900 flex items-center gap-2 text-sm uppercase tracking-wider">
                                    <User className="w-4 h-4 text-gold-500" /> Customer
                                </h3>
                                <div className="bg-white border border-vanilla-200 rounded-xl p-4 space-y-2 text-sm shadow-sm">
                                    <div><p className="text-vanilla-800/60 text-xs">Name</p><p className="font-medium text-vanilla-900">{getCustomerName(order)}</p></div>
                                    <div><p className="text-vanilla-800/60 text-xs">Email</p><a href={`mailto:${order.email}`} className="text-gold-500 hover:underline">{order.email}</a></div>
                                    <div><p className="text-vanilla-800/60 text-xs">Phone</p><a href={`tel:${order.phone}`} className="text-vanilla-900">{order.phone}</a></div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h3 className="font-bold text-vanilla-900 flex items-center gap-2 text-sm uppercase tracking-wider">
                                    <MapPin className="w-4 h-4 text-gold-500" /> Shipping To
                                </h3>
                                <div className="bg-white border border-vanilla-200 rounded-xl p-4 text-sm shadow-sm h-full">
                                    <p className="text-vanilla-900 font-medium mb-1">{order.shippingAddress?.address}</p>
                                    <p className="text-vanilla-800/80">{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
                                    <p className="text-vanilla-800/80">{order.shippingAddress?.country}</p>
                                </div>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="space-y-3">
                            <h3 className="font-bold text-vanilla-900 flex items-center gap-2 text-sm uppercase tracking-wider">
                                <ShoppingBag className="w-4 h-4 text-gold-500" /> Items
                            </h3>
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
                                                        {item.image ? <img src={item.image} className="w-10 h-10 rounded-lg object-cover bg-vanilla-100" /> : <div className="w-10 h-10 bg-vanilla-100 rounded-lg flex items-center justify-center"><Package className="w-5 h-5 text-vanilla-400" /></div>}
                                                        <span className="font-medium text-vanilla-900">{item.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-center text-vanilla-800">{item.quantity}</td>
                                                <td className="px-4 py-3 text-right text-vanilla-800">{formatPrice(item.price)}</td>
                                                <td className="px-4 py-3 text-right font-medium text-vanilla-900">{formatPrice(item.price * item.quantity)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {/* Mobile Items List */}
                            <div className="sm:hidden space-y-3">
                                {order.orderItems?.map((item, index) => (
                                    <div key={index} className="bg-white border border-vanilla-200 rounded-xl p-3 flex gap-3 shadow-sm">
                                        {item.image ? <img src={item.image} className="w-16 h-16 rounded-lg object-cover bg-vanilla-100 shrink-0" /> : <div className="w-16 h-16 bg-vanilla-100 rounded-lg flex items-center justify-center shrink-0"><Package className="w-6 h-6 text-vanilla-400" /></div>}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-vanilla-900 text-sm truncate">{item.name}</p>
                                            <p className="text-vanilla-800/60 text-xs mt-0.5">{item.quantity} × {formatPrice(item.price)}</p>
                                            <p className="text-gold-500 font-bold text-sm mt-1">{formatPrice(item.price * item.quantity)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Summary & Payment */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <h3 className="font-bold text-vanilla-900 flex items-center gap-2 text-sm uppercase tracking-wider"><CreditCard className="w-4 h-4 text-gold-500" /> Status</h3>
                                <div className="bg-white border border-vanilla-200 rounded-xl p-4 space-y-3 text-sm shadow-sm">
                                    <div className="flex justify-between items-center"><span className="text-vanilla-800/70">Payment</span><span className="font-medium text-vanilla-900">{PAYMENT_METHODS[order.paymentMethod] || order.paymentMethod}</span></div>
                                    <div className="flex justify-between items-center"><span className="text-vanilla-800/70">Status</span><StatusBadge status={order.status || 'pending'} /></div>
                                    <div className="flex justify-between items-center"><span className="text-vanilla-800/70">Date</span><span className="font-medium text-vanilla-900">{formatDate(order.createdAt)}</span></div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h3 className="font-bold text-vanilla-900 flex items-center gap-2 text-sm uppercase tracking-wider"><FileText className="w-4 h-4 text-gold-500" /> Summary</h3>
                                <div className="bg-white border border-vanilla-200 rounded-xl p-4 space-y-2 text-sm shadow-sm">
                                    <div className="flex justify-between"><span className="text-vanilla-800/70">Subtotal</span><span className="text-vanilla-900">{formatPrice(order.itemsPrice)}</span></div>
                                    <div className="flex justify-between"><span className="text-vanilla-800/70">Shipping</span><span>{order.shippingPrice === 0 ? <span className="text-emerald-600 font-medium">Free</span> : formatPrice(order.shippingPrice)}</span></div>
                                    <div className="flex justify-between pt-3 border-t border-vanilla-100 mt-2"><span className="font-bold text-vanilla-900 text-base">Total</span><span className="font-bold text-gold-500 text-lg">{formatPrice(order.totalPrice)}</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Footer */}
                    <div className="flex-none p-4 bg-white border-t border-vanilla-200 sm:rounded-b-2xl flex gap-3">
                        <button onClick={() => { setShowViewModal(false); setShowStatusModal(true); }} className="flex-1 px-4 py-2.5 bg-vanilla-900 text-white rounded-lg hover:bg-vanilla-800 transition-colors text-sm font-medium shadow-md">Update Status</button>
                        <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-vanilla-200 bg-white text-vanilla-900 rounded-lg hover:bg-vanilla-50 transition-colors text-sm">Close</button>
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
                <div className="absolute inset-0 bg-vanilla-900/60 backdrop-blur-sm" onClick={onClose} />
                <div className="relative bg-white w-full sm:max-w-md shadow-2xl rounded-t-2xl sm:rounded-2xl flex flex-col max-h-[90vh] border border-vanilla-200">
                    <div className="flex-none p-4 border-b border-vanilla-100">
                        <h2 className="text-lg font-bold font-serif text-vanilla-900">Update Order Status</h2>
                        <p className="text-vanilla-800/60 text-xs mt-1">Order: <span className="font-mono">{order.orderId?.slice(-8)}</span></p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-vanilla-50">
                        {Object.entries(ORDER_STATUSES).map(([key, config]) => {
                            const Icon = config.icon;
                            const isActive = order.status === key;
                            return (
                                <button key={key} onClick={() => handleUpdateStatus(order._id, key)} disabled={isUpdating}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${isActive ? 'border-gold-500 bg-white shadow-md' : 'border-vanilla-100 bg-white hover:border-vanilla-300'}`}>
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.bg} ${config.text}`}><Icon className="w-5 h-5" /></div>
                                    <div className="flex-1 text-left"><p className={`font-medium ${isActive ? 'text-vanilla-900' : 'text-vanilla-800'}`}>{config.label}</p></div>
                                    {isActive && <CheckCircle className="w-5 h-5 text-gold-500" />}
                                    {isUpdating && isActive && <Loader2 className="w-4 h-4 animate-spin text-gold-500" />}
                                </button>
                            );
                        })}
                    </div>
                    <div className="flex-none p-4 border-t border-vanilla-100 bg-white sm:rounded-b-2xl">
                        <button onClick={onClose} disabled={isUpdating} className="w-full px-4 py-2.5 border border-vanilla-200 bg-white text-vanilla-900 rounded-lg hover:bg-vanilla-50 transition-colors text-sm font-medium">Cancel</button>
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
                <div className="absolute inset-0 bg-vanilla-900/60 backdrop-blur-sm" onClick={onClose} />
                <div className="relative bg-white w-full max-w-sm shadow-2xl rounded-2xl overflow-hidden border border-vanilla-200 font-sans">
                    <div className="p-6 text-center">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"><AlertCircle className="w-8 h-8 text-red-600" /></div>
                        <h2 className="text-xl font-bold font-serif text-vanilla-900 mb-2">Delete Order?</h2>
                        <p className="text-vanilla-800/70 text-sm">Are you sure you want to delete order <span className="font-mono font-medium text-vanilla-900">{order.orderId?.slice(-8)}</span>? This action cannot be undone.</p>
                    </div>
                    <div className="p-4 border-t border-vanilla-100 bg-vanilla-50 flex gap-3">
                        <button onClick={onClose} disabled={isDeleting} className="flex-1 px-4 py-2.5 border border-vanilla-200 bg-white text-vanilla-900 rounded-lg hover:bg-vanilla-100 transition-colors text-sm font-medium">Cancel</button>
                        <button onClick={handleDeleteOrder} disabled={isDeleting} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                            {isDeleting ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</> : <><Trash2 className="w-4 h-4" /> Delete</>}
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
            <div className="bg-white rounded-xl border border-vanilla-200 shadow-sm overflow-hidden w-full">
                <div className="p-4">
                    <div className="flex items-start justify-between gap-3 w-full">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                                <span className="font-mono text-[10px] font-medium bg-vanilla-100 text-vanilla-800 px-2 py-0.5 rounded border border-vanilla-200">{order.orderId?.slice(-8)}</span>
                                <StatusBadge status={order.status || 'pending'} size="small" />
                            </div>
                            <p className="font-medium text-vanilla-900 text-sm truncate">{getCustomerName(order)}</p>
                            <p className="text-vanilla-800/60 text-xs truncate block max-w-full">{order.email}</p>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="font-bold text-vanilla-900 text-sm">{formatPrice(order.totalPrice)}</p>
                            <p className="text-vanilla-800/50 text-[10px] uppercase mt-0.5">{formatDate(order.createdAt, true)}</p>
                        </div>
                    </div>
                    <div className="mt-3 p-2 bg-vanilla-50 rounded-lg flex items-center gap-2 border border-vanilla-100">
                        <Package className="w-3.5 h-3.5 text-vanilla-400 shrink-0" />
                        <span className="text-vanilla-800/80 text-xs truncate flex-1">{getOrderItemsSummary(order)}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-4">
                        <button onClick={() => setExpandedOrderId(isExpanded ? null : order._id)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium border border-vanilla-200 rounded-lg hover:bg-vanilla-50 text-vanilla-800">
                            {isExpanded ? <><ChevronUp className="w-3.5 h-3.5" /> Less</> : <><ChevronDown className="w-3.5 h-3.5" /> Details</>}
                        </button>
                        <button onClick={() => { setSelectedOrder(order); setShowViewModal(true); }} className="p-2 text-vanilla-600 border border-vanilla-200 bg-white hover:border-gold-500 hover:text-gold-500 rounded-lg transition-colors shrink-0"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => { setSelectedOrder(order); setShowStatusModal(true); }} className="p-2 text-vanilla-600 border border-vanilla-200 bg-white hover:border-gold-500 hover:text-gold-500 rounded-lg transition-colors shrink-0"><Pencil className="w-4 h-4" /></button>
                    </div>
                </div>
                {isExpanded && (
                    <div className="px-4 pb-4 pt-0 border-t border-vanilla-100 bg-vanilla-50/50">
                        <div className="pt-3 space-y-3">
                            <div className="flex items-center gap-2 text-xs"><Phone className="w-3.5 h-3.5 text-vanilla-400 shrink-0" /><a href={`tel:${order.phone}`} className="text-gold-600 font-medium truncate">{order.phone}</a></div>
                            <div className="flex items-start gap-2 text-xs"><MapPin className="w-3.5 h-3.5 text-vanilla-400 mt-0.5 shrink-0" /><div className="text-vanilla-800/80 min-w-0 flex-1"><p className="font-medium text-vanilla-900 truncate">{order.shippingAddress?.address}</p><p className="truncate">{order.shippingAddress?.city}, {order.shippingAddress?.state}</p></div></div>
                            <div className="flex items-center gap-2 text-xs"><CreditCard className="w-3.5 h-3.5 text-vanilla-400 shrink-0" /><span className="text-vanilla-800/80 truncate">{PAYMENT_METHODS[order.paymentMethod] || order.paymentMethod}</span></div>
                            <div className="pt-2 border-t border-vanilla-100">
                                <p className="text-[10px] uppercase font-bold text-vanilla-400 mb-2">Items</p>
                                <div className="space-y-2">
                                    {order.orderItems?.slice(0, 3).map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-xs">
                                            {item.image ? <img src={item.image} className="w-8 h-8 rounded object-cover border border-vanilla-200 shrink-0" /> : <div className="w-8 h-8 bg-vanilla-100 rounded flex items-center justify-center shrink-0"><Package className="w-4 h-4 text-vanilla-400" /></div>}
                                            <div className="flex-1 min-w-0"><p className="truncate text-vanilla-900 font-medium">{item.name}</p><p className="text-vanilla-800/50">x{item.quantity}</p></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="w-full max-w-full overflow-x-hidden space-y-6 pb-20 sm:pb-0 font-sans">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <PageTitle title="Orders" subtitle={`${filteredOrders.length} order${filteredOrders.length !== 1 ? 's' : ''}`} />
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button onClick={fetchOrders} disabled={isLoading} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border border-vanilla-200 rounded-lg hover:bg-vanilla-50 transition-colors text-xs sm:text-sm bg-white text-vanilla-900">
                            <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> <span className="inline">Refresh</span>
                        </button>
                        <button onClick={handleExport} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-vanilla-900 text-white rounded-lg hover:bg-vanilla-800 transition-colors text-xs sm:text-sm shadow-md">
                            <Download className="w-4 h-4" /> <span className="inline">Export</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {Object.entries(ORDER_STATUSES).map(([key, config]) => {
                        const count = orders.filter(o => (o.status || 'pending') === key).length;
                        const Icon = config.icon;
                        const isActive = statusFilter === key;
                        return (
                            <button key={key} onClick={() => setStatusFilter(isActive ? 'all' : key)}
                                className={`shrink-0 w-full sm:w-auto p-4 rounded-xl border transition-all flex flex-col justify-between ${isActive ? 'border-gold-500 bg-white shadow-md' : 'border-vanilla-200 bg-white hover:border-gold-500/50'}`}>
                                <div className="flex items-start justify-between mb-3 w-full">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.bg} ${config.text}`}><Icon className="w-5 h-5" /></div>
                                    <span className="text-2xl font-bold font-serif text-vanilla-900">{count}</span>
                                </div>
                                <p className={`text-xs font-medium text-left ${isActive ? 'text-gold-600' : 'text-vanilla-800/60'}`}>{config.label}</p>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Search & Filters */}
            <div className="bg-white rounded-xl border border-vanilla-200 p-4 shadow-sm">
                <div className="flex gap-2">
                    <div className="relative flex-1 min-w-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-vanilla-400" />
                        <input type="text" placeholder="Search orders..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-vanilla-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 text-sm text-vanilla-900 placeholder:text-vanilla-400" />
                        {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-vanilla-400 hover:text-vanilla-800"><X className="w-4 h-4" /></button>}
                    </div>
                    <button onClick={() => setShowFilters(!showFilters)} className={`lg:hidden p-2.5 border rounded-lg transition-colors flex items-center justify-center shrink-0 ${showFilters || hasActiveFilters ? 'border-gold-500 bg-vanilla-50 text-gold-600' : 'border-vanilla-200 text-vanilla-600 hover:bg-vanilla-50'}`}><SlidersHorizontal className="w-5 h-5" /></button>
                </div>

                <div className={`${showFilters ? 'grid' : 'hidden'} lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3 pt-3 border-t border-vanilla-100 lg:border-0 lg:pt-0`}>
                    <div className="relative">
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-3 py-2.5 border border-vanilla-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 text-sm bg-white text-vanilla-900 appearance-none">
                            <option value="all">All Statuses</option>
                            {Object.entries(ORDER_STATUSES).map(([key, config]) => (<option key={key} value={key}>{config.label}</option>))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-vanilla-400 pointer-events-none" />
                    </div>
                    <div className="relative">
                        <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="w-full px-3 py-2.5 border border-vanilla-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 text-sm bg-white text-vanilla-900 appearance-none">
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">Last 7 Days</option>
                            <option value="month">Last 30 Days</option>
                            <option value="year">Last Year</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-vanilla-400 pointer-events-none" />
                    </div>
                    <div className="relative">
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full px-3 py-2.5 border border-vanilla-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 text-sm bg-white text-vanilla-900 appearance-none">
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="highest">Highest Amount</option>
                            <option value="lowest">Lowest Amount</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-vanilla-400 pointer-events-none" />
                    </div>
                    {hasActiveFilters && <button onClick={clearFilters} className="w-full px-3 py-2.5 text-vanilla-800 border border-vanilla-200 hover:border-red-200 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium">Clear Filters</button>}
                </div>
            </div>

            {/* Content Area */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-gold-500 animate-spin" /></div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center py-20 px-4"><AlertCircle className="w-12 h-12 text-red-400 mb-4" /><p className="text-vanilla-800/60 text-center">{error}</p><button onClick={fetchOrders} className="mt-4 px-4 py-2 bg-vanilla-900 text-white rounded-lg hover:bg-vanilla-800 text-sm">Try Again</button></div>
            ) : paginatedOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-xl border border-vanilla-200"><Package className="w-12 h-12 text-vanilla-300 mb-4" /><p className="text-vanilla-800/60 text-center font-medium">No orders found</p>{hasActiveFilters && <button onClick={clearFilters} className="mt-2 text-gold-600 hover:text-gold-700 text-sm underline">Clear current filters</button>}</div>
            ) : (
                <>
                    {/* Mobile: Card View */}
                    <div className="lg:hidden grid grid-cols-1 gap-4 w-full">
                        {paginatedOrders.map((order) => (<MobileOrderCard key={order._id} order={order} />))}
                    </div>

                    {/* Desktop: Table View */}
                    <div className="hidden lg:block overflow-hidden rounded-xl border border-vanilla-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-vanilla-50 border-b border-vanilla-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left font-bold text-vanilla-900">Order ID</th>
                                        <th className="px-6 py-4 text-left font-bold text-vanilla-900">Customer</th>
                                        <th className="px-6 py-4 text-left font-bold text-vanilla-900">Products</th>
                                        <th className="px-6 py-4 text-left font-bold text-vanilla-900">Total</th>
                                        <th className="px-6 py-4 text-left font-bold text-vanilla-900">Status</th>
                                        <th className="px-6 py-4 text-left font-bold text-vanilla-900">Date</th>
                                        <th className="px-6 py-4 text-right font-bold text-vanilla-900">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-vanilla-100">
                                    {paginatedOrders.map((order) => (
                                        <tr key={order._id} className="hover:bg-vanilla-50 transition-colors group">
                                            <td className="px-6 py-4"><span className="font-mono text-xs font-medium bg-vanilla-100 text-vanilla-900 px-2 py-1 rounded border border-vanilla-200">{order.orderId?.slice(-8)}</span></td>
                                            <td className="px-6 py-4"><div><p className="font-medium text-vanilla-900">{getCustomerName(order)}</p><p className="text-vanilla-800/60 text-xs">{order.email}</p></div></td>
                                            <td className="px-6 py-4"><div className="max-w-50 truncate text-vanilla-800/70" title={getOrderItemsSummary(order)}>{getOrderItemsSummary(order)}</div></td>
                                            <td className="px-6 py-4"><span className="font-bold text-vanilla-900">{formatPrice(order.totalPrice)}</span></td>
                                            <td className="px-6 py-4"><StatusBadge status={order.status || 'pending'} /></td>
                                            <td className="px-6 py-4"><span className="text-vanilla-800/60 text-xs">{formatDate(order.createdAt)}</span></td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="inline-flex items-center justify-end gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => { setSelectedOrder(order); setShowViewModal(true); }} className="p-2 text-vanilla-400 hover:text-gold-500 hover:bg-vanilla-100 rounded-lg transition-colors" title="View Details"><Eye className="w-4 h-4" /></button>
                                                    <button onClick={() => { setSelectedOrder(order); setShowStatusModal(true); }} className="p-2 text-vanilla-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Update Status"><Pencil className="w-4 h-4" /></button>
                                                    <button onClick={() => { setSelectedOrder(order); setShowDeleteModal(true); }} className="p-2 text-vanilla-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Order"><Trash2 className="w-4 h-4" /></button>
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
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-vanilla-200">
                    <p className="text-xs sm:text-sm text-vanilla-800/60">Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredOrders.length)} of {filteredOrders.length}</p>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        {/* Mobile Pagination */}
                        <div className="flex sm:hidden w-full overflow-hidden border border-vanilla-200 rounded-lg">
                            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="flex-1 px-3 py-2 bg-white hover:bg-vanilla-50 disabled:opacity-50 border-r border-vanilla-200 flex justify-center text-vanilla-900"><ChevronLeft className="w-4 h-4" /></button>
                            <span className="px-4 py-2 text-sm font-medium bg-vanilla-50 text-vanilla-900 whitespace-nowrap flex items-center">{currentPage} / {totalPages}</span>
                            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="flex-1 px-3 py-2 bg-white hover:bg-vanilla-50 disabled:opacity-50 border-l border-vanilla-200 flex justify-center text-vanilla-900"><ChevronRight className="w-4 h-4" /></button>
                        </div>
                        {/* Desktop Pagination */}
                        <div className="hidden sm:flex items-center gap-2">
                            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2 border border-vanilla-200 rounded-lg hover:bg-vanilla-50 disabled:opacity-50 text-vanilla-900"><ChevronLeft className="w-5 h-5" /></button>
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) pageNum = i + 1;
                                else if (currentPage <= 3) pageNum = i + 1;
                                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                                else pageNum = currentPage - 2 + i;
                                return (
                                    <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`w-10 h-10 rounded-lg font-medium transition-colors text-sm ${currentPage === pageNum ? 'bg-vanilla-900 text-white shadow-md' : 'border border-vanilla-200 hover:bg-vanilla-50 text-vanilla-900'}`}>{pageNum}</button>
                                );
                            })}
                            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 border border-vanilla-200 rounded-lg hover:bg-vanilla-50 disabled:opacity-50 text-vanilla-900"><ChevronRight className="w-5 h-5" /></button>
                        </div>
                    </div>
                </div>
            )}

            {showViewModal && <ViewOrderModal order={selectedOrder} onClose={() => { setShowViewModal(false); setSelectedOrder(null); }} />}
            {showStatusModal && <UpdateStatusModal order={selectedOrder} onClose={() => { setShowStatusModal(false); setSelectedOrder(null); }} />}
            {showDeleteModal && <DeleteModal order={selectedOrder} onClose={() => { setShowDeleteModal(false); setSelectedOrder(null); }} />}
        </div>
    );
}