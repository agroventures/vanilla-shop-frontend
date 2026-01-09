import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    ChevronRight,
    Home,
    ShoppingCart,
    Trash2,
    Plus,
    Minus,
    X,
    Truck,
    ShieldCheck,
    ArrowRight,
    ArrowLeft,
    Package,
    RefreshCcw,
    AlertCircle,
    CheckCircle,
    Percent,
    Gift,
    Clock,
    Info,
    Lock,
    Globe // Added Globe icon
} from 'lucide-react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import { emptyCart, getCart, updateQuantity, removeFromCart } from '../utils/Cart'
import useSEO from '../hooks/useSEO'

const Cart = () => {
    const navigate = useNavigate()

    // Cart state
    const [cartItems, setCartItems] = useState([])
    const [promoCode, setPromoCode] = useState('')
    const [appliedPromo, setAppliedPromo] = useState(null)
    const [promoError, setPromoError] = useState('')
    const [promoLoading, setPromoLoading] = useState(false)
    const [isUpdating, setIsUpdating] = useState(null)

    // Currency State
    const [currency, setCurrency] = useState('LKR')

    // Load cart on mount and listen for updates
    useEffect(() => {
        setCartItems(getCart())

        // Listen for cart updates from other components
        const handleCartUpdate = () => {
            setCartItems(getCart())
        }

        window.addEventListener('cartUpdated', handleCartUpdate)

        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate)
        }
    }, [])

    const url = window.location.href;

    useSEO({
        title: "Cart - The Vanilla Shop",
        description: "The Vanilla Shop is more than a café — it’s Sri Lanka’s first dedicated vanilla boutique.",
        url,
        image_alt: "Cart",
        twitter_card: "summary_large_image",
    });

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    // Update quantity handler
    const handleUpdateQuantity = (productId, newQuantity, variantLabel = null) => {
        if (newQuantity < 1) return

        setIsUpdating(`${productId}-${variantLabel}`)

        // Update in localStorage
        updateQuantity(productId, newQuantity, variantLabel)

        // Trigger event so Navbar updates count immediately
        window.dispatchEvent(new Event('cartUpdated'));

        // Update local state
        setCartItems(getCart())

        setTimeout(() => setIsUpdating(null), 300)
    }

    // Remove item handler
    const handleRemoveItem = (productId, variantLabel = null) => {
        removeFromCart(productId, variantLabel)
        window.dispatchEvent(new Event('cartUpdated')); // Update Navbar
        setCartItems(getCart())
    }

    // Clear entire cart
    const handleEmptyCart = () => {
        emptyCart()
        window.dispatchEvent(new Event('cartUpdated')); // Update Navbar
        setCartItems([])
    }
    
    const getPriceValue = (item) => {
        if (currency === 'USD') {
            // Fallback to item.price if priceInUSD isn't explicitly on the cart object
            // (depends on how much data addToCart stored)
            return item.priceInUSD || item.price || 0; 
        }
        return item.priceInLKR || item.price || 0;
    }

    // Calculations
    const subtotal = cartItems.reduce((sum, item) => sum + (getPriceValue(item) * item.quantity), 0)
    
    const savings = cartItems.reduce((sum, item) => {
        const itemOriginalPrice = currency === 'USD' ? item.originalPriceInUSD : item.originalPrice;
        const itemPrice = getPriceValue(item);
        
        if (itemOriginalPrice) {
            return sum + ((itemOriginalPrice - itemPrice) * item.quantity)
        }
        return sum
    }, 0)

    const promoDiscount = appliedPromo ? (subtotal * appliedPromo.discount / 100) : 0
    const total = subtotal - promoDiscount

    // Format currency
    const formatPrice = (price) => {
        if (currency === 'USD') {
            return new Intl.NumberFormat('en-US', { 
                style: 'currency', 
                currency: 'USD' 
            }).format(price)
        }
        return `LKR ${price.toLocaleString('en-LK')}`
    }

    // Get unique key for cart item
    const getItemKey = (item) => {
        return `${item.productId}-${item.variantLabel || 'no-variant'}`
    }

    // Check if item is being updated
    const isItemUpdating = (item) => {
        return isUpdating === `${item.productId}-${item.variantLabel}`
    }

    // ============================================
    // EMPTY CART STATE
    // ============================================
    if (cartItems.length === 0) {
        return (
            <div className="pt-24 min-h-screen bg-vanilla-50 font-sans">
                <Navbar />

                {/* Breadcrumbs */}
                <div className="bg-white border-b border-vanilla-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <nav className="flex items-center gap-2 text-sm">
                            <Link to="/" className="text-vanilla-800/60 hover:text-gold-500 transition-colors flex items-center gap-1">
                                <Home className="w-4 h-4" />
                                <span>Home</span>
                            </Link>
                            <ChevronRight className="w-4 h-4 text-vanilla-200" />
                            <span className="text-vanilla-900 font-medium">Shopping Cart</span>
                        </nav>
                    </div>
                </div>

                {/* Empty Cart Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                    <div className="text-center max-w-md mx-auto">
                        <div className="w-24 h-24 bg-vanilla-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-vanilla-200">
                            <ShoppingCart className="w-10 h-10 text-gold-500" />
                        </div>
                        <h1 className="text-3xl font-serif font-bold text-vanilla-900 mb-4">
                            Your Cart is Empty
                        </h1>
                        <p className="text-vanilla-800/60 mb-8 leading-relaxed">
                            Looks like you haven't added any items to your cart yet.
                            Explore our premium vanilla products and find something you'll love!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/shop"
                                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-vanilla-900 text-white rounded-full font-medium hover:bg-gold-500 transition-colors shadow-md hover:-translate-y-0.5 duration-300"
                            >
                                <Package className="w-5 h-5" />
                                Browse Products
                            </Link>
                            <Link
                                to="/"
                                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-vanilla-900 border border-vanilla-200 rounded-full font-medium hover:bg-vanilla-50 hover:border-gold-500 transition-all"
                            >
                                <Home className="w-5 h-5" />
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        )
    }

    // ============================================
    // MAIN CART VIEW
    // ============================================
    return (
        <div className="pt-24 min-h-screen bg-vanilla-50 font-sans text-vanilla-800">
            <Navbar />

            {/* Breadcrumbs */}
            <div className="bg-white border-b border-vanilla-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <Link to="/" className="text-vanilla-800/60 hover:text-gold-500 transition-colors flex items-center gap-1">
                                <Home className="w-4 h-4" />
                                <span>Home</span>
                            </Link>
                            <ChevronRight className="w-4 h-4 text-vanilla-200" />
                            <Link to="/shop" className="text-vanilla-800/60 hover:text-gold-500 transition-colors">
                                Products
                            </Link>
                            <ChevronRight className="w-4 h-4 text-vanilla-200" />
                            <span className="text-vanilla-900 font-medium">Shopping Cart</span>
                        </div>
                        
                        {/* Currency Selector */}
                        <div className="relative">
                            <select 
                                value={currency} 
                                onChange={(e) => setCurrency(e.target.value)} 
                                className="appearance-none pl-3 pr-8 py-1.5 bg-vanilla-50 border border-vanilla-200 rounded-lg text-vanilla-900 font-medium text-xs focus:outline-none focus:border-gold-500 cursor-pointer shadow-sm"
                            >
                                <option value="LKR">LKR (Rs)</option>
                                <option value="USD">USD ($)</option>
                            </select>
                            <Globe className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-vanilla-400 pointer-events-none" />
                        </div>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <section className="py-8 lg:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-serif font-bold text-vanilla-900">
                                Shopping Cart
                            </h1>
                            <p className="text-vanilla-800/60 mt-1">
                                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
                            </p>
                        </div>
                        <button
                            onClick={handleEmptyCart}
                            className="inline-flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                        >
                            <Trash2 className="w-4 h-4" />
                            Clear Cart
                        </button>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Cart Items List (Left Side) */}
                        <div className="flex-1">
                            <div className="bg-white rounded-2xl border border-vanilla-100 shadow-sm overflow-hidden">
                                {/* Table Header - Desktop */}
                                <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-vanilla-50 border-b border-vanilla-100 text-sm font-serif font-bold text-vanilla-900 tracking-wide">
                                    <div className="col-span-6">Product</div>
                                    <div className="col-span-2 text-center">Price</div>
                                    <div className="col-span-2 text-center">Quantity</div>
                                    <div className="col-span-2 text-right">Subtotal</div>
                                </div>

                                {/* Cart Items */}
                                <div className="divide-y divide-vanilla-100">
                                    {cartItems.map((item) => {
                                        const unitPrice = getPriceValue(item);
                                        const originalPrice = currency === 'USD' ? item.originalPriceInUSD : item.originalPrice;
                                        
                                        return (
                                            <div
                                                key={getItemKey(item)}
                                                className={`p-4 lg:p-6 transition-opacity duration-300 ${isItemUpdating(item) ? 'opacity-50' : 'opacity-100'
                                                    }`}
                                            >
                                                <div className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
                                                    {/* Product Info */}
                                                    <div className="col-span-6 flex gap-4">
                                                        {/* Image */}
                                                        <Link
                                                            to={`/products/${item.slug}`}
                                                            className="w-20 h-20 lg:w-24 lg:h-24 bg-vanilla-50 rounded-xl overflow-hidden shrink-0 border border-vanilla-100"
                                                        >
                                                            {item.image ? (
                                                                <img
                                                                    src={item.image}
                                                                    alt={item.name}
                                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                                    onError={(e) => {
                                                                        e.target.style.display = 'none'
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <Package className="w-8 h-8 text-vanilla-200" />
                                                                </div>
                                                            )}
                                                        </Link>

                                                        {/* Details */}
                                                        <div className="flex-1 min-w-0 self-center">
                                                            <Link
                                                                to={`/products/${item.slug}`}
                                                                className="font-serif font-bold text-lg text-vanilla-900 hover:text-gold-500 transition-colors line-clamp-2"
                                                            >
                                                                {item.name}
                                                            </Link>

                                                            {/* Variant Label */}
                                                            {item.variantLabel && (
                                                                <div className="text-vanilla-800/60 text-sm mt-1">
                                                                    Option: <span className="text-vanilla-900 font-medium">{item.variantLabel}</span>
                                                                </div>
                                                            )}

                                                            {/* Weight */}
                                                            {item.weight && (
                                                                <div className="text-vanilla-800/50 text-xs mt-0.5 flex items-center gap-1">
                                                                    <Package className="w-3 h-3" />
                                                                    {item.weight}
                                                                </div>
                                                            )}

                                                            {/* Stock Status */}
                                                            {item.stock && item.stock > 0 ? (
                                                                <span className="inline-flex items-center gap-1 text-green-700 text-xs mt-2 bg-green-50 px-2 py-0.5 rounded-full">
                                                                    <CheckCircle className="w-3 h-3" />
                                                                    In Stock
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1 text-red-600 text-xs mt-2 bg-red-50 px-2 py-0.5 rounded-full">
                                                                    <AlertCircle className="w-3 h-3" />
                                                                    Out of Stock
                                                                </span>
                                                            )}

                                                            {/* Mobile Price */}
                                                            <div className="md:hidden mt-2">
                                                                <span className="font-serif font-bold text-vanilla-900">
                                                                    {formatPrice(unitPrice)}
                                                                </span>
                                                                {originalPrice && (
                                                                    <span className="text-vanilla-800/40 text-sm line-through ml-2">
                                                                        {formatPrice(originalPrice)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Price - Desktop */}
                                                    <div className="hidden md:block col-span-2 text-center">
                                                        <span className="font-medium text-vanilla-900">
                                                            {formatPrice(unitPrice)}
                                                        </span>
                                                        {originalPrice && (
                                                            <span className="block text-vanilla-800/40 text-sm line-through">
                                                                {formatPrice(originalPrice)}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Quantity */}
                                                    <div className="col-span-2 flex items-center justify-center mt-4 md:mt-0">
                                                        <div className="flex items-center border border-vanilla-200 rounded-lg bg-white">
                                                            <button
                                                                onClick={() => handleUpdateQuantity(
                                                                    item.productId,
                                                                    item.quantity - 1,
                                                                    item.variantLabel
                                                                )}
                                                                disabled={item.quantity <= 1}
                                                                className="w-8 h-8 flex items-center justify-center text-vanilla-800/60 hover:text-vanilla-900 hover:bg-vanilla-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                            >
                                                                <Minus className="w-3 h-3" />
                                                            </button>
                                                            <span className="w-8 text-center font-bold text-vanilla-900 text-sm">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => handleUpdateQuantity(
                                                                    item.productId,
                                                                    item.quantity + 1,
                                                                    item.variantLabel
                                                                )}
                                                                disabled={item.stock && item.quantity >= item.stock}
                                                                className="w-8 h-8 flex items-center justify-center text-vanilla-800/60 hover:text-vanilla-900 hover:bg-vanilla-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Subtotal */}
                                                    <div className="col-span-2 flex items-center justify-between md:justify-end gap-4 mt-4 md:mt-0">
                                                        <span className="font-serif font-bold text-vanilla-900 md:mr-4">
                                                            {formatPrice(unitPrice * item.quantity)}
                                                        </span>
                                                        <button
                                                            onClick={() => handleRemoveItem(item.productId, item.variantLabel)}
                                                            className="w-8 h-8 flex items-center justify-center text-vanilla-800/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Remove item"
                                                        >
                                                            <X className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Continue Shopping */}
                            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <Link
                                    to="/shop"
                                    className="inline-flex items-center gap-2 text-gold-500 hover:text-vanilla-900 font-medium transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Continue Shopping
                                </Link>
                                <button
                                    onClick={() => {
                                        setCartItems(getCart());
                                        window.dispatchEvent(new Event('cartUpdated'));
                                    }}
                                    className="inline-flex items-center gap-2 text-vanilla-800/60 hover:text-vanilla-900 font-medium transition-colors"
                                >
                                    <RefreshCcw className="w-4 h-4" />
                                    Refresh Cart
                                </button>
                            </div>
                        </div>

                        {/* Order Summary (Right Side) */}
                        <div className="lg:w-96">
                            <div className="bg-white rounded-2xl border border-vanilla-100 shadow-sm overflow-hidden sticky top-28">
                                <div className="p-5 bg-vanilla-50 border-b border-vanilla-100">
                                    <h2 className="font-serif font-bold text-xl text-vanilla-900">Order Summary</h2>
                                </div>

                                <div className="p-6 space-y-4">
                                    {/* Price Breakdown */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-vanilla-800/70">
                                            <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                                            <span className="font-medium text-vanilla-900">{formatPrice(subtotal)}</span>
                                        </div>

                                        {savings > 0 && (
                                            <div className="flex justify-between text-green-700">
                                                <span className="flex items-center gap-1 font-medium">
                                                    <Percent className="w-4 h-4" />
                                                    You Save
                                                </span>
                                                <span className="font-medium">-{formatPrice(savings)}</span>
                                            </div>
                                        )}

                                        {appliedPromo && appliedPromo.discount > 0 && (
                                            <div className="flex justify-between text-green-700">
                                                <span className="font-medium">Promo Discount</span>
                                                <span className="font-medium">-{formatPrice(promoDiscount)}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="h-px bg-vanilla-100" />

                                    {/* Total */}
                                    <div className="flex justify-between items-end">
                                        <span className="text-lg font-bold text-vanilla-900">Total</span>
                                        <span className="text-3xl font-serif font-bold text-vanilla-900">{formatPrice(total)}</span>
                                    </div>

                                    {/* Checkout Button */}
                                    <button
                                        onClick={() => navigate('/checkout', { state: { currency } })}
                                        className="w-full py-4 bg-vanilla-900 text-white rounded-xl font-bold hover:bg-gold-500 transition-all duration-300 shadow-lg hover:-translate-y-1 flex items-center justify-center gap-2 mt-4"
                                    >
                                        Proceed to Checkout
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Trust Badges */}
                                <div className="p-4 bg-vanilla-50 border-t border-vanilla-100">
                                    <div className="grid grid-cols-3 gap-2 text-center">
                                        <div>
                                            <Lock className="w-5 h-5 text-gold-500 mx-auto mb-1" />
                                            <span className="text-[10px] uppercase tracking-wider font-bold text-vanilla-800/60">Secure</span>
                                        </div>
                                        <div>
                                            <Truck className="w-5 h-5 text-gold-500 mx-auto mb-1" />
                                            <span className="text-[10px] uppercase tracking-wider font-bold text-vanilla-800/60">Fast</span>
                                        </div>
                                        <div>
                                            <ShieldCheck className="w-5 h-5 text-gold-500 mx-auto mb-1" />
                                            <span className="text-[10px] uppercase tracking-wider font-bold text-vanilla-800/60">Authentic</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Bar */}
            <section className="py-12 bg-white border-t border-vanilla-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-vanilla-50 rounded-full flex items-center justify-center border border-vanilla-100">
                                <RefreshCcw className="w-6 h-6 text-gold-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-vanilla-900 text-sm">Easy Returns</h3>
                                <p className="text-vanilla-800/60 text-xs mt-0.5">14-day return policy</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-vanilla-50 rounded-full flex items-center justify-center border border-vanilla-100">
                                <ShieldCheck className="w-6 h-6 text-gold-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-vanilla-900 text-sm">Secure Payment</h3>
                                <p className="text-vanilla-800/60 text-xs mt-0.5">100% secure checkout</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-vanilla-50 rounded-full flex items-center justify-center border border-vanilla-100">
                                <Clock className="w-6 h-6 text-gold-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-vanilla-900 text-sm">24/7 Support</h3>
                                <p className="text-vanilla-800/60 text-xs mt-0.5">Dedicated support team</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default Cart