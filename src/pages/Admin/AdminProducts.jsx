import React, { useEffect, useState } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    Package,
    X,
    ChevronDown,
    ChevronUp,
    Eye,
    EyeOff,
    Layers,
} from "lucide-react";
import axios from "axios";
import PageTitle from "../../components/admin/PageTitle";
import { Link } from "react-router-dom";
import { getProducts } from "../../api/data.api";
import DeleteConfirmModal from "./AdminProductDeleteModal";
import toast from "react-hot-toast";

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

    // Helper function to get price display
    const getPriceDisplay = (product) => {
        if (product.variants && product.variants.length > 0) {
            const prices = product.variants.map((v) => v.price);
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);

            if (minPrice === maxPrice) {
                return `LKR ${minPrice.toLocaleString()}`;
            }
            return `LKR ${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()}`;
        }
        return product.price ? `LKR ${product.price.toLocaleString()}` : "N/A";
    };

    // Helper function to get total stock
    const getTotalStock = (product) => {
        if (product.variants && product.variants.length > 0) {
            return product.variants.reduce((total, v) => total + (v.stock || 0), 0);
        }
        return product.stock || 0;
    };

    // Helper function to check if any variant is low stock
    const getStockStatus = (product) => {
        const totalStock = getTotalStock(product);
        if (totalStock === 0) return "out";
        if (totalStock <= 10) return "low";
        return "in";
    };

    // Get unique categories
    const categories = [
        "all",
        ...new Set(products.map((product) => product.category)),
    ];

    // Filter products
    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.slug.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
            selectedCategory === "all" || product.category === selectedCategory;

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

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategory, stockFilter]);

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

    // Stock badge component
    const StockBadge = ({ product, variant = null }) => {
        const stock = variant ? variant.stock : getTotalStock(product);
        const status = variant
            ? stock === 0
                ? "out"
                : stock <= 5
                    ? "low"
                    : "in"
            : getStockStatus(product);

        const styles = {
            in: "bg-green-100 text-green-700",
            low: "bg-amber-100 text-amber-700",
            out: "bg-red-100 text-red-700",
        };

        const labels = {
            in: `${stock} in stock`,
            low: `${stock} low stock`,
            out: "Out of stock",
        };

        return (
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
                {labels[status]}
            </span>
        );
    };

    // Status badge component
    const StatusBadge = ({ isActive }) => (
        <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                }`}
        >
            {isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            {isActive ? "Active" : "Inactive"}
        </span>
    );

    // Delete Function
    const handleDelete = async () => {
        if (!selectedProductId) return;

        try {
            await axios.delete(
                `${import.meta.env.VITE_API_URL}/products/${selectedProductId}`
            );

            toast.success("Product deleted successfully!");

            setProducts((prev) =>
                prev.filter((p) => p._id !== selectedProductId)
            );

            setDeleteModalOpen(false);
            setSelectedProductId(null);
        } catch (error) {
            toast.error("Failed to delete product");
        }
    };


    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <PageTitle title="Products" subtitle="Manage store products" />

                <Link to='/admin/products/add'>
                    <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-dark text-cream font-medium hover:opacity-90 transition w-full sm:w-auto">
                        <Plus className="w-4 h-4" />
                        Add Product
                    </button>
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-vanilla-500" />
                    <input
                        type="text"
                        placeholder="Search by name, category, or slug..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-cream border border-vanilla-200 text-dark placeholder-vanilla-500 focus:outline-none focus:ring-2 focus:ring-vanilla-300 transition"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-vanilla-500 hover:text-dark"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap gap-3">
                    {/* Category Filter */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-3 py-2.5 rounded-lg bg-cream border border-vanilla-200 text-dark focus:outline-none focus:ring-2 focus:ring-vanilla-300 transition cursor-pointer min-w-37.5"
                    >
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category === "all" ? "All Categories" : category}
                            </option>
                        ))}
                    </select>

                    {/* Stock Filter */}
                    <select
                        value={stockFilter}
                        onChange={(e) => setStockFilter(e.target.value)}
                        className="px-3 py-2.5 rounded-lg bg-cream border border-vanilla-200 text-dark focus:outline-none focus:ring-2 focus:ring-vanilla-300 transition cursor-pointer"
                    >
                        <option value="all">All Stock</option>
                        <option value="in">In Stock</option>
                        <option value="low">Low Stock</option>
                        <option value="out">Out of Stock</option>
                    </select>

                    {/* Items per page */}
                    <select
                        value={itemsPerPage}
                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                        className="px-3 py-2.5 rounded-lg bg-cream border border-vanilla-200 text-dark focus:outline-none focus:ring-2 focus:ring-vanilla-300 transition cursor-pointer"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>

                    {/* Clear Filters */}
                    {(searchTerm || selectedCategory !== "all" || stockFilter !== "all") && (
                        <button
                            onClick={clearFilters}
                            className="px-3 py-2.5 rounded-lg border border-vanilla-200 text-vanilla-700 hover:bg-vanilla-100 transition"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Results Info */}
            <div className="flex items-center justify-between text-sm text-vanilla-600">
                <p>
                    Showing {filteredProducts.length > 0 ? startIndex + 1 : 0} to{" "}
                    {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
                </p>
                {filteredProducts.length !== products.length && (
                    <p className="text-vanilla-500">(filtered from {products.length} total)</p>
                )}
            </div>

            {/* Loading */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark"></div>
                </div>
            ) : (
                <>
                    {/* Desktop Table */}
                    <div className="hidden lg:block overflow-x-auto rounded-2xl border border-vanilla-200 bg-cream shadow-md">
                        <table className="w-full text-sm">
                            <thead className="bg-vanilla-100">
                                <tr>
                                    <th className="px-6 py-4 text-left font-semibold text-dark">Product</th>
                                    <th className="px-6 py-4 text-left font-semibold text-dark">Category</th>
                                    <th className="px-6 py-4 text-left font-semibold text-dark">Price</th>
                                    <th className="px-6 py-4 text-left font-semibold text-dark">Stock</th>
                                    <th className="px-6 py-4 text-left font-semibold text-dark">Status</th>
                                    <th className="px-6 py-4 text-right font-semibold text-dark">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {currentProducts.length > 0 ? (
                                    currentProducts.map((product) => (
                                        <React.Fragment key={product._id}>
                                            {/* Main Product Row */}
                                            <tr
                                                className={`border-t border-vanilla-200 hover:bg-vanilla-50 transition-colors ${expandedProduct === product._id ? "bg-vanilla-50" : ""
                                                    }`}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 rounded-lg bg-vanilla-100 flex items-center justify-center overflow-hidden shrink-0">
                                                            {product.images && product.images[0] ? (
                                                                <img
                                                                    src={product.images[0]}
                                                                    alt={product.name}
                                                                    className="w-12 h-12 object-cover"
                                                                />
                                                            ) : (
                                                                <Package className="w-6 h-6 text-vanilla-500" />
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-medium text-dark truncate">
                                                                    {product.name}
                                                                </span>
                                                                {product.variants && product.variants.length > 0 && (
                                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-vanilla-200 text-vanilla-700">
                                                                        <Layers className="w-3 h-3" />
                                                                        {product.variants.length} variants
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-vanilla-500 truncate">{product.slug}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-vanilla-100 text-vanilla-700">
                                                        {product.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-medium text-dark">{getPriceDisplay(product)}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <StockBadge product={product} />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <StatusBadge isActive={product.isActive} />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {product.variants && product.variants.length > 0 && (
                                                            <button
                                                                onClick={() => toggleExpand(product._id)}
                                                                className="p-2 rounded-lg hover:bg-vanilla-100 text-vanilla-600 transition"
                                                                title="View variants"
                                                            >
                                                                {expandedProduct === product._id ? (
                                                                    <ChevronUp className="w-4 h-4" />
                                                                ) : (
                                                                    <ChevronDown className="w-4 h-4" />
                                                                )}
                                                            </button>
                                                        )}
                                                        <Link to={`/admin/products/edit/${product.slug}`}>
                                                            <button className="p-2 rounded-lg hover:bg-vanilla-100 text-blue-600 hover:text-blue-800 transition">
                                                                <Pencil className="w-4 h-4" />
                                                            </button>
                                                        </Link>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedProductId(product._id);
                                                                setDeleteModalOpen(true);
                                                            }}
                                                            className="p-2 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-800 transition"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>

                                            {/* Expanded Variants Row */}
                                            {expandedProduct === product._id &&
                                                product.variants &&
                                                product.variants.length > 0 && (
                                                    <tr className="bg-vanilla-50">
                                                        <td colSpan="6" className="px-6 py-4">
                                                            <div className="ml-12 space-y-3">
                                                                <h4 className="text-sm font-semibold text-dark mb-3">
                                                                    Product Variants
                                                                </h4>
                                                                <div className="grid gap-3">
                                                                    {product.variants.map((variant, index) => (
                                                                        <div
                                                                            key={index}
                                                                            className="flex items-center justify-between p-4 bg-cream rounded-xl border border-vanilla-200"
                                                                        >
                                                                            <div className="flex items-center gap-4">
                                                                                <div className="w-10 h-10 rounded-lg bg-vanilla-100 flex items-center justify-center overflow-hidden">
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
                                                                                <div>
                                                                                    <p className="font-medium text-dark">{variant.label}</p>
                                                                                    {variant.weight && (
                                                                                        <p className="text-xs text-vanilla-500">
                                                                                            {variant.weight}
                                                                                        </p>
                                                                                    )}
                                                                                </div>
                                                                            </div>

                                                                            <div className="flex items-center gap-8">
                                                                                <div className="text-right">
                                                                                    <p className="text-xs text-vanilla-500">Price</p>
                                                                                    <p className="font-semibold text-dark">
                                                                                        LKR {variant.price.toLocaleString()}
                                                                                    </p>
                                                                                </div>
                                                                                <div className="text-right min-w-25">
                                                                                    <p className="text-xs text-vanilla-500">Stock</p>
                                                                                    <StockBadge product={product} variant={variant} />
                                                                                </div>
                                                                                {variant.highlights && variant.highlights.length > 0 && (
                                                                                    <div className="hidden xl:block text-right max-w-50">
                                                                                        <p className="text-xs text-vanilla-500">Highlights</p>
                                                                                        <p className="text-xs text-dark truncate">
                                                                                            {variant.highlights.join(", ")}
                                                                                        </p>
                                                                                    </div>
                                                                                )}
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
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center">
                                            <Package className="w-12 h-12 text-vanilla-300 mx-auto mb-3" />
                                            <p className="text-vanilla-600 font-medium">No products found</p>
                                            <p className="text-vanilla-500 text-sm mt-1">
                                                Try adjusting your search or filters
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile/Tablet Cards */}
                    <div className="lg:hidden space-y-4">
                        {currentProducts.length > 0 ? (
                            currentProducts.map((product) => (
                                <div
                                    key={product._id}
                                    className="bg-cream rounded-xl border border-vanilla-200 shadow-sm overflow-hidden"
                                >
                                    {/* Card Header */}
                                    <div className="p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-16 h-16 rounded-lg bg-vanilla-100 flex items-center justify-center overflow-hidden shrink-0">
                                                {product.images && product.images[0] ? (
                                                    <img
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        className="w-16 h-16 object-cover"
                                                    />
                                                ) : (
                                                    <Package className="w-8 h-8 text-vanilla-500" />
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <h3 className="font-semibold text-dark">{product.name}</h3>
                                                        <p className="text-xs text-vanilla-500">{product.slug}</p>
                                                    </div>
                                                    <StatusBadge isActive={product.isActive} />
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                                    <span className="px-2 py-0.5 rounded-full text-xs bg-vanilla-100 text-vanilla-700">
                                                        {product.category}
                                                    </span>
                                                    {product.variants && product.variants.length > 0 && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-vanilla-200 text-vanilla-700">
                                                            <Layers className="w-3 h-3" />
                                                            {product.variants.length} variants
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Price & Stock */}
                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-vanilla-200">
                                            <div>
                                                <p className="text-xs text-vanilla-500">Price</p>
                                                <p className="font-semibold text-dark">{getPriceDisplay(product)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-vanilla-500">Stock</p>
                                                <StockBadge product={product} />
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-vanilla-200">
                                            {product.variants && product.variants.length > 0 ? (
                                                <button
                                                    onClick={() => toggleExpand(product._id)}
                                                    className="flex items-center gap-1 text-sm text-vanilla-600 hover:text-dark transition"
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
                                                <span></span>
                                            )}

                                            <div className="flex gap-2">
                                                <Link to={`/admin/products/edit/${product.slug}`} className="p-2 rounded-lg bg-vanilla-50 text-vanilla-600">
                                                    <button className="p-2 rounded-lg bg-vanilla-100 text-blue-600">
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        setSelectedProductId(product._id);
                                                        setDeleteModalOpen(true);
                                                    }}
                                                    className="p-2 rounded-lg bg-red-50 text-red-600"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>

                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Variants */}
                                    {expandedProduct === product._id &&
                                        product.variants &&
                                        product.variants.length > 0 && (
                                            <div className="bg-vanilla-50 border-t border-vanilla-200 p-4 space-y-3">
                                                <h4 className="text-sm font-semibold text-dark">Variants</h4>
                                                {product.variants.map((variant, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between p-3 bg-cream rounded-lg border border-vanilla-200"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-lg bg-vanilla-100 flex items-center justify-center overflow-hidden">
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
                                                            <div>
                                                                <p className="font-medium text-dark text-sm">{variant.label}</p>
                                                                {variant.weight && (
                                                                    <p className="text-xs text-vanilla-500">{variant.weight}</p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="text-right">
                                                            <p className="font-semibold text-dark text-sm">
                                                                LKR {variant.price.toLocaleString()}
                                                            </p>
                                                            <StockBadge product={product} variant={variant} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                </div>
                            ))
                        ) : (
                            <div className="bg-cream rounded-xl border border-vanilla-200 p-8 text-center">
                                <Package className="w-12 h-12 text-vanilla-300 mx-auto mb-3" />
                                <p className="text-vanilla-600 font-medium">No products found</p>
                                <p className="text-vanilla-500 text-sm mt-1">
                                    Try adjusting your search or filters
                                </p>
                            </div>
                        )}
                    </div>

                    <DeleteConfirmModal
                        open={deleteModalOpen}
                        onClose={() => {
                            setDeleteModalOpen(false);
                            setSelectedProductId(null);
                        }}
                        onConfirm={handleDelete}
                        title="Delete Product"
                        description="Are you sure you want to delete this product? This action cannot be undone."
                    />

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                            {/* Mobile Pagination */}
                            <div className="flex items-center gap-2 sm:hidden w-full">
                                <button
                                    onClick={goToPreviousPage}
                                    disabled={currentPage === 1}
                                    className="flex-1 flex items-center justify-center gap-1 px-4 py-2.5 rounded-lg border border-vanilla-200 text-dark disabled:opacity-50 disabled:cursor-not-allowed hover:bg-vanilla-100 transition"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </button>
                                <span className="px-4 py-2.5 text-sm text-vanilla-600">
                                    {currentPage} / {totalPages}
                                </span>
                                <button
                                    onClick={goToNextPage}
                                    disabled={currentPage === totalPages}
                                    className="flex-1 flex items-center justify-center gap-1 px-4 py-2.5 rounded-lg border border-vanilla-200 text-dark disabled:opacity-50 disabled:cursor-not-allowed hover:bg-vanilla-100 transition"
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Desktop Pagination */}
                            <div className="hidden sm:flex items-center gap-1">
                                <button
                                    onClick={goToPreviousPage}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border border-vanilla-200 text-dark disabled:opacity-50 disabled:cursor-not-allowed hover:bg-vanilla-100 transition"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>

                                {getPageNumbers().map((page, index) =>
                                    page === "..." ? (
                                        <span key={index} className="px-3 py-2 text-vanilla-500">
                                            ...
                                        </span>
                                    ) : (
                                        <button
                                            key={index}
                                            onClick={() => goToPage(page)}
                                            className={`min-w-10 px-3 py-2 rounded-lg font-medium transition ${currentPage === page
                                                ? "bg-dark text-cream"
                                                : "border border-vanilla-200 text-dark hover:bg-vanilla-100"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    )
                                )}

                                <button
                                    onClick={goToNextPage}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg border border-vanilla-200 text-dark disabled:opacity-50 disabled:cursor-not-allowed hover:bg-vanilla-100 transition"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Page Jump */}
                            <div className="hidden lg:flex items-center gap-2 text-sm text-vanilla-600">
                                <span>Go to page:</span>
                                <input
                                    type="number"
                                    min={1}
                                    max={totalPages}
                                    value={currentPage}
                                    onChange={(e) => {
                                        const page = parseInt(e.target.value);
                                        if (page >= 1 && page <= totalPages) {
                                            goToPage(page);
                                        }
                                    }}
                                    className="w-16 px-2 py-1.5 rounded-lg border border-vanilla-200 text-center text-dark focus:outline-none focus:ring-2 focus:ring-vanilla-300"
                                />
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

