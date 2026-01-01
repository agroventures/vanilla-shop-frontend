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
    Lock
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

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const savings = cartItems.reduce((sum, item) => {
        if (item.originalPrice) {
            return sum + ((item.originalPrice - item.price) * item.quantity)
        }
        return sum
    }, 0)

    const shippingThreshold = 5000
    const shippingCost = subtotal >= shippingThreshold ? 0 : 350
    const promoDiscount = appliedPromo ? (subtotal * appliedPromo.discount / 100) : 0
    const total = subtotal + shippingCost - promoDiscount

    // Format currency
    const formatPrice = (price) => {
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
                                to="/products"
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
                    <nav className="flex items-center gap-2 text-sm">
                        <Link to="/" className="text-vanilla-800/60 hover:text-gold-500 transition-colors flex items-center gap-1">
                            <Home className="w-4 h-4" />
                            <span>Home</span>
                        </Link>
                        <ChevronRight className="w-4 h-4 text-vanilla-200" />
                        <Link to="/products" className="text-vanilla-800/60 hover:text-gold-500 transition-colors">
                            Products
                        </Link>
                        <ChevronRight className="w-4 h-4 text-vanilla-200" />
                        <span className="text-vanilla-900 font-medium">Shopping Cart</span>
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

                    {/* Free Shipping Progress */}
                    {subtotal < shippingThreshold ? (
                        <div className="bg-vanilla-100 rounded-xl p-4 mb-8 border border-vanilla-200">
                            <div className="flex items-center gap-3 mb-2">
                                <Truck className="w-5 h-5 text-gold-500" />
                                <span className="text-vanilla-900 font-medium">
                                    Add <span className="text-gold-500 font-bold">{formatPrice(shippingThreshold - subtotal)}</span> more for FREE shipping!
                                </span>
                            </div>
                            <div className="h-2 bg-white rounded-full overflow-hidden border border-vanilla-200">
                                <div
                                    className="h-full bg-gold-500 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min((subtotal / shippingThreshold) * 100, 100)}%` }}
                                />
                            </div>
                        </div>
                    ) : (
                         <div className="bg-green-50 rounded-xl p-4 mb-8 flex items-center gap-3 border border-green-100">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-green-800 font-medium">
                                Congratulations! You've unlocked FREE shipping! 🎉
                            </span>
                        </div>
                    )}

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
                                    {cartItems.map((item) => (
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
                                                                {formatPrice(item.price)}
                                                            </span>
                                                            {item.originalPrice && (
                                                                <span className="text-vanilla-800/40 text-sm line-through ml-2">
                                                                    {formatPrice(item.originalPrice)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Price - Desktop */}
                                                <div className="hidden md:block col-span-2 text-center">
                                                    <span className="font-medium text-vanilla-900">
                                                        {formatPrice(item.price)}
                                                    </span>
                                                    {item.originalPrice && (
                                                        <span className="block text-vanilla-800/40 text-sm line-through">
                                                            {formatPrice(item.originalPrice)}
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
                                                        {formatPrice(item.price * item.quantity)}
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
                                    ))}
                                </div>
                            </div>

                            {/* Continue Shopping */}
                            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <Link
                                    to="/products"
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

                                        <div className="flex justify-between text-vanilla-800/70">
                                            <span className="flex items-center gap-1">
                                                Shipping
                                                <button className="text-vanilla-800/40 hover:text-gold-500 transition-colors">
                                                    <Info className="w-3 h-3" />
                                                </button>
                                            </span>
                                            {shippingCost === 0 ? (
                                                <span className="text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded text-xs">FREE</span>
                                            ) : (
                                                <span className="font-medium text-vanilla-900">{formatPrice(shippingCost)}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="h-px bg-vanilla-100" />

                                    {/* Total */}
                                    <div className="flex justify-between items-end">
                                        <span className="text-lg font-bold text-vanilla-900">Total</span>
                                        <span className="text-3xl font-serif font-bold text-vanilla-900">{formatPrice(total)}</span>
                                    </div>

                                    {/* Checkout Button */}
                                    <button
                                        onClick={() => navigate('/checkout')}
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

                            {/* Help Card */}
                            <div className="mt-6 bg-vanilla-100 rounded-xl p-5 border border-vanilla-200">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                                        <Gift className="w-5 h-5 text-gold-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-vanilla-900 mb-1">Need Help?</h3>
                                        <p className="text-vanilla-800/60 text-sm mb-3">
                                            Our support team is here to assist you.
                                        </p>
                                        <Link
                                            to="/contact"
                                            className="text-gold-500 hover:text-vanilla-900 font-bold text-sm transition-colors"
                                        >
                                            Contact Us →
                                        </Link>
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-vanilla-50 rounded-full flex items-center justify-center border border-vanilla-100">
                                <Truck className="w-6 h-6 text-gold-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-vanilla-900 text-sm">Free Shipping</h3>
                                <p className="text-vanilla-800/60 text-xs mt-0.5">On orders over LKR 5,000</p>
                            </div>
                        </div>
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