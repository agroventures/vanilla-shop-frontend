import React, { useEffect, useState } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    Search,
    ChevronLeft,
    ChevronRight,
    Package,
    X,
    ChevronDown,
    ChevronUp,
    Eye,
    EyeOff,
    Layers,
    Loader2,
} from "lucide-react";
import axios from "axios";
import PageTitle from "../../components/admin/PageTitle";
import { Link } from "react-router-dom";
import { getProducts } from "../../api/data.api";
import DeleteConfirmModal from "./AdminProductDeleteModal";
import toast from "react-hot-toast";
import useSEO from "../../hooks/useSEO";

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [stockFilter, setStockFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [expandedProduct, setExpandedProduct] = useState(null);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);

    const url = window.location.href;

    useSEO({
        title: "Products - The Vanilla Shop",
        description: "The Vanilla Shop is more than a café — it’s Sri Lanka’s first dedicated vanilla boutique.",
        url,
        image_alt: "Products",
        twitter_card: "summary_large_image",
    });

    useEffect(() => {
        getProducts()
            .then((res) => {
                setProducts(res);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    }, []);

    // Helper functions
    const getPriceDisplay = (product) => {
        if (product.variants && product.variants.length > 0) {
            const prices = product.variants.map((v) => v.priceInLKR);
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            if (minPrice === maxPrice) return `LKR ${minPrice.toLocaleString()}`;
            return `LKR ${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()}`;
        }
        return product.priceInLKR ? `LKR ${product.priceInLKR.toLocaleString()}` : "N/A";
    };

    const getTotalStock = (product) => {
        if (product.variants && product.variants.length > 0) {
            return product.variants.reduce((total, v) => total + (v.stock || 0), 0);
        }
        return product.stock || 0;
    };

    const getStockStatus = (product) => {
        const totalStock = getTotalStock(product);
        if (totalStock === 0) return "out";
        if (totalStock <= 10) return "low";
        return "in";
    };

    const categories = ["all", ...new Set(products.map((product) => product.category))];

    // Filter products
    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.slug.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
        const stockStatus = getStockStatus(product);
        const matchesStock =
            stockFilter === "all" ||
            (stockFilter === "in" && stockStatus === "in") ||
            (stockFilter === "low" && stockStatus === "low") ||
            (stockFilter === "out" && stockStatus === "out");
        return matchesSearch && matchesCategory && matchesStock;
    });

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);

    useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedCategory, stockFilter]);

    const goToPage = (page) => setCurrentPage(page);
    const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push("...");
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push("...");
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push("...");
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push("...");
                pages.push(totalPages);
            }
        }
        return pages;
    };

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedCategory("all");
        setStockFilter("all");
    };

    const toggleExpand = (productId) => {
        setExpandedProduct(expandedProduct === productId ? null : productId);
    };

    const StockBadge = ({ product, variant = null }) => {
        const stock = variant ? variant.stock : getTotalStock(product);
        const status = variant ? (stock === 0 ? "out" : stock <= 5 ? "low" : "in") : getStockStatus(product);
        const styles = {
            in: "bg-emerald-50 text-emerald-700 border-emerald-200",
            low: "bg-amber-50 text-amber-700 border-amber-200",
            out: "bg-red-50 text-red-700 border-red-200",
        };
        const labels = {
            in: `${stock} in stock`,
            low: `${stock} low stock`,
            out: "Out of stock",
        };
        return (
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium border whitespace-nowrap ${styles[status]}`}>
                {labels[status]}
            </span>
        );
    };

    const StatusBadge = ({ isActive }) => (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium border ${isActive ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-vanilla-100 text-vanilla-600 border-vanilla-200"}`}>
            {isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            {isActive ? "Active" : "Inactive"}
        </span>
    );

    const handleDelete = async () => {
        if (!selectedProductId) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/products/${selectedProductId}`);
            toast.success("Product deleted successfully!");
            setProducts((prev) => prev.filter((p) => p._id !== selectedProductId));
            setDeleteModalOpen(false);
            setSelectedProductId(null);
        } catch (error) {
            toast.error("Failed to delete product");
        }
    };

    return (
        <div className="w-full max-w-full overflow-x-hidden space-y-4 sm:space-y-6 font-sans pb-20 sm:pb-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <PageTitle title="Products" subtitle="Manage your store catalog" />
                <Link to='/admin/products/add' className="w-full sm:w-auto">
                    <button className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-vanilla-900 text-white font-medium hover:bg-vanilla-800 transition-all shadow-md">
                        <Plus className="w-4 h-4" />
                        Add Product
                    </button>
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-vanilla-200 p-3 sm:p-4 shadow-sm w-full">
                <div className="flex flex-col lg:flex-row gap-3">
                    {/* Search */}
                    <div className="relative w-full lg:flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-vanilla-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-white border border-vanilla-200 text-vanilla-900 placeholder-vanilla-400 focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition text-sm"
                        />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-vanilla-400 hover:text-vanilla-800">
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Filters Stack/Row */}
                    <div className="flex flex-col sm:flex-row flex-wrap lg:flex-nowrap gap-3 w-full lg:w-auto">
                        <div className="relative w-full sm:w-auto sm:min-w-35">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-3 py-2.5 pr-8 rounded-lg bg-white border border-vanilla-200 text-vanilla-900 focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition cursor-pointer text-sm appearance-none truncate"
                            >
                                {categories.map((category) => <option key={category} value={category}>{category === "all" ? "All Categories" : category}</option>)}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-vanilla-400 pointer-events-none" />
                        </div>

                        <div className="relative w-full sm:w-auto sm:min-w-30">
                            <select
                                value={stockFilter}
                                onChange={(e) => setStockFilter(e.target.value)}
                                className="w-full px-3 py-2.5 pr-8 rounded-lg bg-white border border-vanilla-200 text-vanilla-900 focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition cursor-pointer text-sm appearance-none"
                            >
                                <option value="all">All Stock</option>
                                <option value="in">In Stock</option>
                                <option value="low">Low Stock</option>
                                <option value="out">Out of Stock</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-vanilla-400 pointer-events-none" />
                        </div>

                        <div className="relative w-full sm:w-auto sm:min-w-27.5">
                            <select
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                className="w-full px-3 py-2.5 pr-8 rounded-lg bg-white border border-vanilla-200 text-vanilla-900 focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition cursor-pointer text-sm appearance-none"
                            >
                                <option value={5}>5 / page</option>
                                <option value={10}>10 / page</option>
                                <option value={25}>25 / page</option>
                                <option value={50}>50 / page</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-vanilla-400 pointer-events-none" />
                        </div>

                        {(searchTerm || selectedCategory !== "all" || stockFilter !== "all") && (
                            <button
                                onClick={clearFilters}
                                className="w-full sm:w-auto px-3 py-2.5 rounded-lg border border-vanilla-200 text-vanilla-600 hover:bg-vanilla-50 hover:text-red-600 transition text-sm font-medium"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Results Info */}
            <div className="flex flex-wrap items-center justify-between text-xs sm:text-sm text-vanilla-600 px-1 gap-2">
                <p>Showing {filteredProducts.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, filteredProducts.length)} of <span className="font-semibold text-vanilla-900">{filteredProducts.length}</span></p>
                {filteredProducts.length !== products.length && <p className="text-vanilla-400 text-xs">(filtered from {products.length})</p>}
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-gold-500 animate-spin" /></div>
            ) : (
                <>
                    {/* Desktop Table */}
                    <div className="hidden lg:block w-full overflow-hidden rounded-xl border border-vanilla-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-vanilla-50 border-b border-vanilla-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left font-bold text-vanilla-900">Product</th>
                                        <th className="px-6 py-4 text-left font-bold text-vanilla-900">Category</th>
                                        <th className="px-6 py-4 text-left font-bold text-vanilla-900">Price</th>
                                        <th className="px-6 py-4 text-left font-bold text-vanilla-900">Stock</th>
                                        <th className="px-6 py-4 text-left font-bold text-vanilla-900">Status</th>
                                        <th className="px-6 py-4 text-right font-bold text-vanilla-900">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentProducts.length > 0 ? (
                                        currentProducts.map((product) => (
                                            <React.Fragment key={product._id}>
                                                <tr className={`border-b border-vanilla-100 hover:bg-vanilla-50 transition-colors ${expandedProduct === product._id ? "bg-vanilla-50" : ""}`}>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-lg bg-vanilla-100 flex items-center justify-center overflow-hidden shrink-0 border border-vanilla-200">
                                                                {product.images && product.images[0] ? <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover" /> : <Package className="w-6 h-6 text-vanilla-400" />}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-medium text-vanilla-900 truncate">{product.name}</span>
                                                                    {product.variants && product.variants.length > 0 && (
                                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-vanilla-200 text-vanilla-800 font-medium"><Layers className="w-3 h-3" /> {product.variants.length}</span>
                                                                    )}
                                                                </div>
                                                                <p className="text-xs text-vanilla-500 truncate mt-0.5">{product.slug}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4"><span className="px-2.5 py-1 rounded-full text-xs font-medium bg-vanilla-100 text-vanilla-700 border border-vanilla-200">{product.category}</span></td>
                                                    <td className="px-6 py-4"><span className="font-bold text-vanilla-900">{getPriceDisplay(product)}</span></td>
                                                    <td className="px-6 py-4"><StockBadge product={product} /></td>
                                                    <td className="px-6 py-4"><StatusBadge isActive={product.isActive} /></td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-end gap-2">
                                                            {product.variants && product.variants.length > 0 && (
                                                                <button onClick={() => toggleExpand(product._id)} className="p-2 rounded-lg hover:bg-vanilla-200 text-vanilla-500 hover:text-vanilla-900 transition">{expandedProduct === product._id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</button>
                                                            )}
                                                            <Link to={`/admin/products/edit/${product.slug}`}><button className="p-2 rounded-lg hover:bg-blue-50 text-vanilla-400 hover:text-blue-600 transition"><Pencil className="w-4 h-4" /></button></Link>
                                                            <button onClick={() => { setSelectedProductId(product._id); setDeleteModalOpen(true); }} className="p-2 rounded-lg hover:bg-red-50 text-vanilla-400 hover:text-red-600 transition"><Trash2 className="w-4 h-4" /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                {expandedProduct === product._id && product.variants && product.variants.length > 0 && (
                                                    <tr className="bg-vanilla-50/50">
                                                        <td colSpan="6" className="px-6 py-4">
                                                            <div className="ml-16 space-y-3 pl-4 border-l-2 border-vanilla-200">
                                                                <h4 className="text-xs font-bold uppercase tracking-wider text-vanilla-500 mb-2">Variants ({product.variants.length})</h4>
                                                                <div className="grid gap-3">
                                                                    {product.variants.map((variant, index) => (
                                                                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-vanilla-200 shadow-sm">
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="w-10 h-10 rounded-lg bg-vanilla-100 flex items-center justify-center overflow-hidden border border-vanilla-100">
                                                                                    {variant.images && variant.images[0] ? <img src={variant.images[0]} alt={variant.label} className="w-10 h-10 object-cover" /> : <Package className="w-5 h-5 text-vanilla-400" />}
                                                                                </div>
                                                                                <div><p className="font-medium text-vanilla-900 text-sm">{variant.label}</p>{variant.weight && <p className="text-xs text-vanilla-500">{variant.weight}</p>}</div>
                                                                            </div>
                                                                            <div className="flex items-center gap-8 text-sm">
                                                                                <div className="text-right"><p className="text-[10px] uppercase text-vanilla-400 font-semibold">Price</p><p className="font-semibold text-vanilla-900">LKR {variant.priceInLKR.toLocaleString()}</p></div>
                                                                                <div className="text-right min-w-25"><p className="text-[10px] uppercase text-vanilla-400 font-semibold mb-1">Stock</p><StockBadge product={product} variant={variant} /></div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))
                                    ) : (
                                        <tr><td colSpan="6" className="px-6 py-16 text-center"><Package className="w-12 h-12 text-vanilla-300 mx-auto mb-3" /><p className="text-vanilla-800 font-medium">No products found</p></td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile/Tablet Cards */}
                    <div className="lg:hidden space-y-4 w-full">
                        {currentProducts.length > 0 ? (
                            currentProducts.map((product) => (
                                <div
                                    key={product._id}
                                    className="bg-white rounded-xl border border-vanilla-200 shadow-sm overflow-hidden w-full max-w-full"
                                >
                                    <div className="p-4">
                                        {/* Header */}
                                        <div className="flex items-start gap-3 w-full min-w-0">
                                            <div className="w-16 h-16 rounded-lg bg-vanilla-100 flex items-center justify-center overflow-hidden shrink-0 border border-vanilla-200">
                                                {product.images && product.images[0] ? (
                                                    <img
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        className="w-16 h-16 object-cover"
                                                    />
                                                ) : (
                                                    <Package className="w-8 h-8 text-vanilla-400" />
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-start gap-2 min-w-0">
                                                    <div className="min-w-0 flex-1 overflow-hidden">
                                                        <h3 className="font-bold text-vanilla-900 truncate">
                                                            {product.name.length > 20 ? `${product.name.slice(0, 20)}...` : product.name}
                                                        </h3>
                                                        <p className="text-xs text-vanilla-500 font-mono mt-0.5 truncate">
                                                            {product.slug}
                                                        </p>
                                                    </div>

                                                    <div className="shrink-0">
                                                        <StatusBadge isActive={product.isActive} />
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2 mt-2 min-w-0">
                                                    <span className="px-2 py-0.5 rounded-full text-xs bg-vanilla-100 text-vanilla-700 border border-vanilla-200 truncate max-w-[60vw] sm:max-w-full">
                                                        {product.category}
                                                    </span>

                                                    {product.variants && product.variants.length > 0 && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-vanilla-100 text-vanilla-600 border border-vanilla-200 shrink-0">
                                                            <Layers className="w-3 h-3" />
                                                            {product.variants.length}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Price / Stock */}
                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-vanilla-100 min-w-0">
                                            <div className="min-w-0 flex-1">
                                                <p className="text-[10px] uppercase text-vanilla-400 font-semibold">
                                                    Price
                                                </p>
                                                <p className="font-bold text-vanilla-900 truncate max-w-full">
                                                    {getPriceDisplay(product)}
                                                </p>
                                            </div>

                                            <div className="text-right shrink-0 ml-4">
                                                <p className="text-[10px] uppercase text-vanilla-400 font-semibold mb-1">
                                                    Stock
                                                </p>
                                                <StockBadge product={product} />
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-vanilla-100 min-w-0">
                                            {product.variants && product.variants.length > 0 ? (
                                                <button
                                                    onClick={() => toggleExpand(product._id)}
                                                    className="flex items-center gap-1 text-sm text-vanilla-600 hover:text-vanilla-900 transition shrink-0"
                                                >
                                                    {expandedProduct === product._id ? (
                                                        <>
                                                            <ChevronUp className="w-4 h-4" />
                                                            Hide variants
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ChevronDown className="w-4 h-4" />
                                                            Show variants
                                                        </>
                                                    )}
                                                </button>
                                            ) : (
                                                <span />
                                            )}

                                            <div className="flex gap-2 shrink-0">
                                                <Link to={`/admin/products/edit/${product.slug}`}>
                                                    <button className="p-2 rounded-lg bg-vanilla-50 text-vanilla-400 hover:text-blue-600 hover:bg-blue-50 border border-vanilla-200 transition">
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                </Link>

                                                <button
                                                    onClick={() => {
                                                        setSelectedProductId(product._id);
                                                        setDeleteModalOpen(true);
                                                    }}
                                                    className="p-2 rounded-lg bg-vanilla-50 text-vanilla-400 hover:text-red-600 hover:bg-red-50 border border-vanilla-200 transition"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Variants */}
                                    {expandedProduct === product._id &&
                                        product.variants &&
                                        product.variants.length > 0 && (
                                            <div className="bg-vanilla-50/50 border-t border-vanilla-200 p-3 sm:p-4 space-y-3">
                                                <h4 className="text-xs font-bold uppercase text-vanilla-500">
                                                    Variants
                                                </h4>

                                                {product.variants.map((variant, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-vanilla-200 shadow-sm min-w-0"
                                                    >
                                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                                            <div className="w-10 h-10 rounded-lg bg-vanilla-100 flex items-center justify-center overflow-hidden border border-vanilla-100 shrink-0">
                                                                {variant.images && variant.images[0] ? (
                                                                    <img
                                                                        src={variant.images[0]}
                                                                        alt={variant.label}
                                                                        className="w-10 h-10 object-cover"
                                                                    />
                                                                ) : (
                                                                    <Package className="w-5 h-5 text-vanilla-400" />
                                                                )}
                                                            </div>

                                                            <div className="min-w-0 flex-1">
                                                                <p className="font-medium text-vanilla-900 text-sm truncate">
                                                                    {variant.label}
                                                                </p>
                                                                {variant.weight && (
                                                                    <p className="text-xs text-vanilla-500 truncate">
                                                                        {variant.weight}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="text-right shrink-0 ml-3">
                                                            <p className="font-bold text-vanilla-900 text-sm whitespace-nowrap">
                                                                LKR {variant.priceInLKR.toLocaleString()}
                                                            </p>
                                                            <div className="mt-1">
                                                                <StockBadge product={product} variant={variant} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                </div>
                            ))
                        ) : (
                            <div className="bg-white rounded-xl border border-vanilla-200 p-8 text-center">
                                <Package className="w-12 h-12 text-vanilla-300 mx-auto mb-3" />
                                <p className="text-vanilla-800 font-medium">No products found</p>
                            </div>
                        )}
                    </div>

                    <DeleteConfirmModal open={deleteModalOpen} onClose={() => { setDeleteModalOpen(false); setSelectedProductId(null); }} onConfirm={handleDelete} title="Delete Product" description="Are you sure you want to delete this product? This action cannot be undone." />

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-vanilla-200">
                            <div className="flex items-center gap-2 sm:hidden w-full">
                                <button onClick={goToPreviousPage} disabled={currentPage === 1} className="flex-1 flex items-center justify-center gap-1 px-4 py-2.5 rounded-lg border border-vanilla-200 bg-white text-vanilla-900 disabled:opacity-50 hover:bg-vanilla-50 transition"><ChevronLeft className="w-4 h-4" />Prev</button>
                                <span className="px-4 py-2.5 text-sm text-vanilla-600 font-medium whitespace-nowrap">{currentPage} / {totalPages}</span>
                                <button onClick={goToNextPage} disabled={currentPage === totalPages} className="flex-1 flex items-center justify-center gap-1 px-4 py-2.5 rounded-lg border border-vanilla-200 bg-white text-vanilla-900 disabled:opacity-50 hover:bg-vanilla-50 transition">Next<ChevronRight className="w-4 h-4" /></button>
                            </div>
                            <div className="hidden sm:flex items-center gap-1">
                                <button onClick={goToPreviousPage} disabled={currentPage === 1} className="p-2 rounded-lg border border-vanilla-200 text-vanilla-900 disabled:opacity-50 hover:bg-vanilla-50 transition bg-white"><ChevronLeft className="w-4 h-4" /></button>
                                {getPageNumbers().map((page, index) => page === "..." ? <span key={index} className="px-3 py-2 text-vanilla-400">...</span> : <button key={index} onClick={() => goToPage(page)} className={`min-w-10 px-3 py-2 rounded-lg font-medium transition text-sm ${currentPage === page ? "bg-vanilla-900 text-white shadow-md" : "border border-vanilla-200 text-vanilla-900 hover:bg-vanilla-50 bg-white"}`}>{page}</button>)}
                                <button onClick={goToNextPage} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-vanilla-200 text-vanilla-900 disabled:opacity-50 hover:bg-vanilla-50 transition bg-white"><ChevronRight className="w-4 h-4" /></button>
                            </div>
                            <div className="hidden lg:flex items-center gap-2 text-sm text-vanilla-600">
                                <span>Go to page:</span>
                                <input type="number" min={1} max={totalPages} value={currentPage} onChange={(e) => { const page = parseInt(e.target.value); if (page >= 1 && page <= totalPages) goToPage(page); }} className="w-16 px-2 py-1.5 rounded-lg border border-vanilla-200 text-center text-vanilla-900 focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 bg-white" />
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}