import React, { useState, useMemo, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import { Link } from 'react-router-dom';

// --- MOCK DATA (Fallback if API fails) ---
const MOCK_PRODUCTS = [
    {
        _id: '1',
        name: 'Pure Vanilla Extract',
        slug: 'pure-vanilla-extract',
        description: 'Our signature Bourbon-style vanilla extract, hand-cured and slowly steeped.',
        category: 'Extracts',
        price: 3500,
        images: ['https://images.unsplash.com/photo-1629851720239-2c7075c3f915?auto=format&fit=crop&q=80&w=600'],
        stock: 50,
        highlights: ['Alcohol-Free', 'No Sugar'],
        variants: [{ label: '50ml', price: 1800, stock: 20 }, { label: '100ml', price: 3500, stock: 30 }]
    },
    {
        _id: '2',
        name: 'Gourmet Vanilla Syrup',
        slug: 'vanilla-syrup',
        description: 'Velvety-smooth syrup made with pure vanilla extract and cane sugar.',
        category: 'Syrups',
        price: 2500,
        images: ['https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=600'],
        stock: 100,
        highlights: ['For Coffee', 'Cocktails'],
        variants: []
    },
    {
        _id: '3',
        name: 'Vanilla Infused Tea',
        slug: 'vanilla-tea',
        description: 'A soothing fusion of Ceylon tea and natural vanilla.',
        category: 'Tea',
        price: 1500,
        images: ['https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=600'],
        stock: 20,
        highlights: ['Relaxing', 'Aromatic'],
        variants: []
    }
];

const Shop = () => {
    // --- STATE ---
    const [allProducts, setAllProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
    const [showFilters, setShowFilters] = useState(false);
    const [visibleCount, setVisibleCount] = useState(9);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState('featured');
    const [viewMode, setViewMode] = useState('grid');
    const [selectedCategory, setSelectedCategory] = useState('all');
    
    // Variant & Cart State
    const [selectedVariants, setSelectedVariants] = useState({}); 
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [addingToCart, setAddingToCart] = useState(null);

    // --- DATA FETCHING ---
    useEffect(() => {
        setIsLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL;

        // If no API URL is set, use mock data immediately
        if (!apiUrl) {
            console.warn("No VITE_API_URL found. Using mock data.");
            setAllProducts(MOCK_PRODUCTS);
            setIsLoading(false);
            return;
        }

        axios.get(`${apiUrl}/products`)
            .then((response) => {
                const activeProducts = response.data.filter(product => product.isActive !== false);
                setAllProducts(activeProducts.length > 0 ? activeProducts : MOCK_PRODUCTS);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching products, switching to mock data:", error);
                setAllProducts(MOCK_PRODUCTS); // Fallback to mock data on error
                setIsLoading(false);
            });
    }, []);

    // --- DERIVED STATE ---
    const categories = useMemo(() => {
        if (!allProducts) return ['all'];
        return ['all', ...new Set(allProducts.map(p => p.category || 'Uncategorized'))];
    }, [allProducts]);

    // Scroll to top
    useEffect(() => window.scrollTo(0, 0), []);

    // --- HELPERS ---
    const formatPrice = (price) => new Intl.NumberFormat('en-LK').format(price || 0);

    const getPriceInfo = (product) => {
        if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
            const prices = product.variants.map(v => v.price || 0);
            return {
                min: Math.min(...prices),
                max: Math.max(...prices),
                hasVariants: true,
                variants: product.variants
            };
        }
        return { min: product.price || 0, max: product.price || 0, hasVariants: false, variants: [] };
    };

    const isProductInStock = (product) => {
        if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
            return product.variants.some(v => (v.stock || 0) > 0);
        }
        return (product.stock || 0) > 0;
    };

    const getProductImage = (product) => {
        if (product.images && product.images.length > 0) return product.images[0];
        return "https://via.placeholder.com/600x600?text=No+Image"; // Fallback image
    };

    // --- FILTER & SORT LOGIC ---
    const filteredProducts = useMemo(() => {
        let result = allProducts.filter(product => {
            const prodName = product.name || "";
            const prodCat = product.category || "";
            
            const matchesSearch = prodName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  prodCat.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesCategory = selectedCategory === 'all' || prodCat === selectedCategory;
            
            const priceInfo = getPriceInfo(product);
            const matchesPrice = priceInfo.min <= priceRange.max && priceInfo.max >= priceRange.min;
            
            return matchesSearch && matchesCategory && matchesPrice;
        });

        // Sorting
        if (sortBy === 'price-low') result.sort((a, b) => getPriceInfo(a).min - getPriceInfo(b).min);
        if (sortBy === 'price-high') result.sort((a, b) => getPriceInfo(a).max - getPriceInfo(b).max);
        if (sortBy === 'name-a-z') result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        
        return result;
    }, [allProducts, searchQuery, selectedCategory, priceRange, sortBy]);

    const displayedProducts = filteredProducts.slice(0, visibleCount);

    // --- HANDLERS ---
    const handleVariantSelect = (productId, variantIndex) => {
        setSelectedVariants(prev => ({ ...prev, [productId]: variantIndex }));
    };

    const handleAddToCart = (product, e) => {
        if(e) e.preventDefault();
        setAddingToCart(product._id);
        
        // Mock Cart Action
        setTimeout(() => {
            alert(`Added ${product.name} to cart!`);
            setAddingToCart(null);
            if(quickViewProduct) setQuickViewProduct(null); 
        }, 800);
    };

    // --- RENDER HELPERS ---
    const renderPrice = (product) => {
        const priceInfo = getPriceInfo(product);
        const selectedIndex = selectedVariants[product._id];
        
        if (selectedIndex !== undefined && priceInfo.variants[selectedIndex]) {
            return <span className="font-serif font-bold text-vanilla-900">LKR {formatPrice(priceInfo.variants[selectedIndex].price)}</span>;
        }

        if (priceInfo.hasVariants) {
            return (
                <span className="font-serif font-bold text-vanilla-900">
                    LKR {formatPrice(priceInfo.min)} {priceInfo.min !== priceInfo.max && `- ${formatPrice(priceInfo.max)}`}
                </span>
            );
        }
        return <span className="font-serif font-bold text-vanilla-900">LKR {formatPrice(product.price)}</span>;
    };

    return (
        <div className="bg-vanilla-50 min-h-screen">
            <Navbar />
            
            {/* --- HEADER --- */}
            <div className="relative pt-32 pb-16 bg-vanilla-900 text-white text-center px-4">
                <div className="max-w-4xl mx-auto">
                    <span className="text-gold-500 font-bold tracking-widest uppercase text-sm">Our Collection</span>
                    <h1 className="font-serif text-4xl md:text-5xl font-bold mt-2 mb-4">Shop Vanilla</h1>
                    <p className="opacity-80 text-lg">Discover our complete collection of premium vanilla products, sourced and crafted in Sri Lanka.</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                
                {/* --- CONTROLS BAR --- */}
                <div className="bg-white rounded-xl shadow-sm border border-vanilla-200 p-4 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
                        
                        {/* Search */}
                        <div className="relative w-full lg:w-96">
                            <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                            <input 
                                type="text" 
                                placeholder="Search products..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-vanilla-50 border border-vanilla-200 rounded-lg focus:outline-none focus:border-gold-500 transition"
                            />
                        </div>

                        {/* Filters & View */}
                        <div className="flex flex-wrap gap-4 items-center w-full lg:w-auto justify-between lg:justify-end">
                            
                            {/* Mobile Filter Toggle */}
                            <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden flex items-center gap-2 px-4 py-3 bg-vanilla-100 rounded-lg font-medium">
                                <i className="fa-solid fa-sliders"></i> Filters
                            </button>

                            {/* Sort */}
                            <div className="relative">
                                <select 
                                    value={sortBy} 
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="appearance-none pl-4 pr-10 py-3 bg-vanilla-50 border border-vanilla-200 rounded-lg focus:outline-none cursor-pointer"
                                >
                                    <option value="featured">Featured</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="name-a-z">Name: A - Z</option>
                                </select>
                                <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                            </div>

                            {/* View Toggle */}
                            <div className="hidden sm:flex bg-vanilla-100 rounded-lg p-1">
                                <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow text-vanilla-900' : 'text-gray-500'}`}>
                                    <i className="fa-solid fa-table-cells-large"></i>
                                </button>
                                <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow text-vanilla-900' : 'text-gray-500'}`}>
                                    <i className="fa-solid fa-list"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* --- EXPANDABLE FILTERS --- */}
                    <div className={`mt-4 pt-4 border-t border-vanilla-100 ${showFilters || window.innerWidth >= 1024 ? 'block' : 'hidden'}`}>
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Categories */}
                            <div className="flex items-center gap-3 overflow-x-auto pb-2">
                                <span className="font-bold text-sm text-vanilla-900">Category:</span>
                                {categories.map(cat => (
                                    <button 
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-3 py-1.5 rounded-full text-sm capitalize whitespace-nowrap transition ${selectedCategory === cat ? 'bg-vanilla-900 text-white' : 'bg-vanilla-100 text-gray-700 hover:bg-vanilla-200'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- PRODUCT GRID --- */}
                {isLoading ? (
                    <div className="text-center py-20">
                         <i className="fa-solid fa-spinner fa-spin text-4xl text-gold-500 mb-4"></i>
                         <p className="text-gray-500">Loading products...</p>
                    </div>
                ) : displayedProducts.length > 0 ? (
                    <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-6"}>
                        {displayedProducts.map(product => {
                            const inStock = isProductInStock(product);
                            const priceInfo = getPriceInfo(product);
                            
                            return (
                                <Link key={product._id} to={`/products/${product.slug}`} className={`group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl border border-vanilla-100 transition duration-300 ${viewMode === 'list' ? 'flex flex-row h-64' : ''}`}>
                                    
                                    {/* Image Area */}
                                    <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-1/3' : 'aspect-square'}`}>
                                        <img 
                                            src={getProductImage(product)} 
                                            alt={product.name} 
                                            className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                                        />
                                        
                                        {!inStock && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                <span className="bg-white text-vanilla-900 px-3 py-1 rounded text-sm font-bold">Out of Stock</span>
                                            </div>
                                        )}

                                        {/* Actions Overlay (Grid Only) */}
                                        {viewMode === 'grid' && (
                                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition duration-300 translate-y-4 group-hover:translate-y-0">
                                                <button onClick={() => setQuickViewProduct(product)} className="bg-white text-vanilla-900 w-10 h-10 rounded-full shadow flex items-center justify-center hover:bg-gold-500 hover:text-white transition">
                                                    <i className="fa-solid fa-eye"></i>
                                                </button>
                                                {inStock && !priceInfo.hasVariants && (
                                                    <button onClick={(e) => handleAddToCart(product, e)} className="bg-vanilla-900 text-white w-10 h-10 rounded-full shadow flex items-center justify-center hover:bg-gold-500 transition">
                                                        <i className="fa-solid fa-shopping-bag"></i>
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        <span className="absolute top-4 left-4 bg-vanilla-100 text-vanilla-900 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                                            {product.category}
                                        </span>
                                    </div>

                                    {/* Content Area */}
                                    <div className={`p-6 flex flex-col ${viewMode === 'list' ? 'w-2/3' : ''}`}>
                                        <h3 className="font-serif text-xl font-bold text-vanilla-900 mb-2">{product.name}</h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                                        
                                        {/* Highlights */}
                                        <div className="flex gap-2 mb-4 flex-wrap">
                                            {(product.highlights || []).slice(0, 2).map((h, i) => (
                                                <span key={i} className="text-xs bg-vanilla-50 text-gold-600 px-2 py-1 rounded border border-vanilla-100">{h}</span>
                                            ))}
                                        </div>

                                        {/* Variants Selector (Grid) */}
                                        {priceInfo.hasVariants && (
                                            <div className="flex gap-2 mb-4">
                                                {product.variants.map((v, idx) => (
                                                    <button 
                                                        key={idx}
                                                        disabled={v.stock === 0}
                                                        onClick={() => handleVariantSelect(product._id, idx)}
                                                        className={`text-xs px-2 py-1 rounded border ${selectedVariants[product._id] === idx ? 'bg-vanilla-900 text-white border-vanilla-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gold-500'} ${v.stock === 0 ? 'opacity-50 cursor-not-allowed line-through' : ''}`}
                                                    >
                                                        {v.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        <div className="mt-auto flex justify-between items-center">
                                            <div>{renderPrice(product)}</div>
                                            
                                            {/* List View Action */}
                                            {viewMode === 'list' && (
                                                <div className="flex gap-2">
                                                    <button onClick={() => setQuickViewProduct(product)} className="px-4 py-2 border border-vanilla-300 rounded hover:bg-vanilla-50 transition">
                                                        View
                                                    </button>
                                                    <button 
                                                        onClick={(e) => handleAddToCart(product, e)}
                                                        disabled={!inStock || (priceInfo.hasVariants && selectedVariants[product._id] === undefined)}
                                                        className="px-4 py-2 bg-vanilla-900 text-white rounded hover:bg-gold-500 transition disabled:opacity-50"
                                                    >
                                                        Add to Cart
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl border border-vanilla-100">
                        <i className="fa-solid fa-box-open text-4xl text-gray-300 mb-4"></i>
                        <h3 className="text-xl font-bold text-gray-900">No products found</h3>
                        <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
                        <button onClick={() => {setSearchQuery(''); setPriceRange({min:0, max:10000}); setSelectedCategory('all')}} className="mt-4 text-gold-500 hover:underline">Clear Filters</button>
                    </div>
                )}
            </div>

            {/* --- QUICK VIEW MODAL --- */}
            {quickViewProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-vanilla-900/60 backdrop-blur-sm" onClick={() => setQuickViewProduct(null)}></div>
                    <div className="relative bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row">
                        <button onClick={() => setQuickViewProduct(null)} className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                            <i className="fa-solid fa-times"></i>
                        </button>

                        <div className="w-full md:w-1/2 bg-gray-50">
                            <img src={getProductImage(quickViewProduct)} alt={quickViewProduct.name} className="w-full h-full object-cover aspect-square" />
                        </div>

                        <div className="w-full md:w-1/2 p-8 flex flex-col">
                            <span className="text-gold-500 text-sm font-bold uppercase tracking-wide mb-2">{quickViewProduct.category}</span>
                            <h2 className="text-3xl font-serif font-bold text-vanilla-900 mb-4">{quickViewProduct.name}</h2>
                            <div className="text-2xl font-bold text-gray-900 mb-6">{renderPrice(quickViewProduct)}</div>
                            
                            <p className="text-gray-600 mb-6 leading-relaxed">{quickViewProduct.description}</p>
                            
                            {/* Variants in Modal */}
                            {getPriceInfo(quickViewProduct).hasVariants && (
                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Select Size:</label>
                                    <div className="flex flex-wrap gap-2">
                                        {quickViewProduct.variants.map((v, idx) => (
                                            <button 
                                                key={idx}
                                                disabled={v.stock === 0}
                                                onClick={() => handleVariantSelect(quickViewProduct._id, idx)}
                                                className={`px-4 py-2 rounded border ${selectedVariants[quickViewProduct._id] === idx ? 'bg-vanilla-900 text-white border-vanilla-900' : 'bg-white text-gray-700 border-gray-300'} ${v.stock === 0 ? 'opacity-50' : ''}`}
                                            >
                                                {v.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-auto pt-6 border-t border-gray-100">
                                <button 
                                    onClick={(e) => handleAddToCart(quickViewProduct, e)}
                                    disabled={!isProductInStock(quickViewProduct) || addingToCart}
                                    className="w-full py-4 bg-gold-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                                >
                                    {addingToCart ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-shopping-cart"></i>}
                                    {isProductInStock(quickViewProduct) ? 'Add to Cart' : 'Out of Stock'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Shop;