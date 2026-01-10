import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
    ChevronRight,
    ChevronLeft,
    Home,
    ShoppingCart,
    User,
    MapPin,
    CreditCard,
    Truck,
    CheckCircle,
    AlertCircle,
    Info,
    Lock,
    ShieldCheck,
    Package,
    Clock,
    Phone,
    Mail,
    Building,
    Globe,
    Edit2,
    ChevronDown,
    ChevronUp,
    Wallet,
    Banknote,
    Smartphone,
    ArrowRight,
    Loader2,
    ImageIcon,
    X
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import { 
    getCart, 
    emptyCart, 
    getPreferredCurrency, 
    setPreferredCurrency,
    formatPrice as formatPriceUtil,
    getItemPrice,
    getItemsMissingPrice,
    canCheckoutInCurrency
} from '../utils/Cart'
import useSEO from '../hooks/useSEO'

// ============================================
// HELPER COMPONENTS
// ============================================

const Input = ({ label, error, name, ...props }) => (
    <div className="font-sans">
        <label className="block text-sm font-bold text-vanilla-900 mb-1.5">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
            name={name}
            {...props}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all bg-white text-vanilla-800 placeholder-vanilla-800/30 ${error
                ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
                : 'border-vanilla-200 focus:ring-gold-500/20 focus:border-gold-500'
                }`}
        />
        {error && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {error}
            </p>
        )}
    </div>
)

const Select = ({ label, error, name, children, ...props }) => (
    <div className="font-sans">
        <label className="block text-sm font-bold text-vanilla-900 mb-1.5">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <select
            name={name}
            {...props}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all appearance-none bg-white text-vanilla-800 ${error
                ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
                : 'border-vanilla-200 focus:ring-gold-500/20 focus:border-gold-500'
                }`}
        >
            {children}
        </select>
        {error && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {error}
            </p>
        )}
    </div>
)

// Currency Selector Component
const CurrencySelector = ({ currency, onCurrencyChange, className = "", compact = false }) => {
    if (compact) {
        return (
            <div className={`relative ${className}`}>
                <select 
                    value={currency} 
                    onChange={(e) => onCurrencyChange(e.target.value)} 
                    className="appearance-none pl-7 pr-6 py-1.5 bg-white border border-vanilla-200 rounded-lg text-vanilla-900 font-medium text-xs focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 cursor-pointer shadow-sm hover:border-vanilla-300 transition-colors"
                >
                    <option value="LKR">LKR</option>
                    <option value="USD">USD</option>
                </select>
                <Globe className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-vanilla-500 pointer-events-none" />
                <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-vanilla-400 pointer-events-none" />
            </div>
        )
    }

    return (
        <div className={`relative ${className}`}>
            <select 
                value={currency} 
                onChange={(e) => onCurrencyChange(e.target.value)} 
                className="appearance-none pl-9 pr-8 py-2.5 bg-white border border-vanilla-200 rounded-xl text-vanilla-900 font-medium text-sm focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 cursor-pointer shadow-sm hover:border-vanilla-300 transition-colors"
            >
                <option value="LKR">🇱🇰 LKR (Rs)</option>
                <option value="USD">🇺🇸 USD ($)</option>
            </select>
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-vanilla-500 pointer-events-none" />
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-vanilla-400 pointer-events-none" />
        </div>
    )
}

// Missing Price Warning Component
const MissingPriceWarning = ({ missingItems, currency, onChangeCurrency }) => {
    if (missingItems.length === 0) return null

    return (
        <div className="mb-4 sm:mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                    <h4 className="font-bold text-amber-800 text-sm sm:text-base">
                        Price Not Available in {currency}
                    </h4>
                    <p className="text-amber-700 text-xs sm:text-sm mt-1">
                        The following items don't have prices in {currency === 'USD' ? 'US Dollars' : 'Sri Lankan Rupees'}:
                    </p>
                    <ul className="mt-2 space-y-1">
                        {missingItems.map((item, index) => (
                            <li key={index} className="text-amber-800 text-xs sm:text-sm flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                                {item.name} {item.variantLabel && `(${item.variantLabel})`}
                            </li>
                        ))}
                    </ul>
                    <div className="mt-3 flex flex-wrap gap-2">
                        <button
                            onClick={() => onChangeCurrency(currency === 'USD' ? 'LKR' : 'USD')}
                            className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-bold rounded-lg transition-colors"
                        >
                            Switch to {currency === 'USD' ? 'LKR' : 'USD'}
                        </button>
                        <Link
                            to="/cart"
                            className="px-3 py-1.5 bg-white hover:bg-amber-50 text-amber-800 text-xs font-bold rounded-lg border border-amber-300 transition-colors"
                        >
                            Edit Cart
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

const OrderSummaryContent = ({
    cartItems,
    subtotal,
    shippingCost,
    total,
    formatPrice,
    selectedShipping,
    getItemKey,
    getPriceValue,
    currency,
    onCurrencyChange,
    showCurrencySelector = false
}) => {
    return (
        <div className="font-sans">
            {/* Currency Selector in Summary */}
            {showCurrencySelector && (
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-vanilla-100">
                    <span className="text-sm text-vanilla-800/70 flex items-center gap-1.5">
                        <Globe className="w-4 h-4" />
                        Currency
                    </span>
                    <CurrencySelector 
                        currency={currency} 
                        onCurrencyChange={onCurrencyChange}
                        compact
                    />
                </div>
            )}

            {/* Cart Items */}
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-vanilla-200">
                {cartItems.map((item) => {
                    const itemPrice = getPriceValue(item);
                    const hasPrice = itemPrice > 0;
                    
                    return (
                        <div key={getItemKey(item)} className="flex gap-3">
                            <div className="relative w-16 h-16 bg-vanilla-50 rounded-lg shrink-0 overflow-hidden border border-vanilla-100">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.style.display = 'none'
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Package className="w-6 h-6 text-vanilla-200" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-vanilla-900 text-sm line-clamp-1 font-serif">{item.name}</h4>
                                {item.variantLabel && (
                                    <p className="text-vanilla-800/60 text-xs">{item.variantLabel} × {item.quantity}</p>
                                )}
                                {!item.variantLabel && (
                                    <p className="text-vanilla-800/60 text-xs">Qty: {item.quantity}</p>
                                )}
                                {item.weight && (
                                    <p className="text-vanilla-800/50 text-xs">{item.weight}</p>
                                )}
                            </div>
                            <span className={`font-medium text-sm shrink-0 ${hasPrice ? 'text-vanilla-900' : 'text-red-500'}`}>
                                {hasPrice ? formatPrice(itemPrice * item.quantity) : 'N/A'}
                            </span>
                        </div>
                    )
                })}
            </div>

            <div className="h-px bg-vanilla-100 mb-4" />

            {/* Price Breakdown */}
            <div className="space-y-3 text-sm">
                <div className="flex justify-between text-vanilla-800/70">
                    <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span className="font-medium text-vanilla-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-vanilla-800/70">
                    <span>Shipping</span>
                    {shippingCost === 0 ? (
                        <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded text-xs">FREE</span>
                    ) : (
                        <span className="font-medium text-vanilla-900">{formatPrice(shippingCost)}</span>
                    )}
                </div>
            </div>

            <div className="h-px bg-vanilla-100 my-4" />

            {/* Total */}
            <div className="flex justify-between items-center">
                <span className="text-lg font-serif font-bold text-vanilla-900">Total</span>
                <div className="text-right">
                    <span className="text-2xl font-serif font-bold text-vanilla-900">{formatPrice(total)}</span>
                    <p className="text-xs text-vanilla-500 mt-0.5">{currency === 'USD' ? 'US Dollars' : 'Sri Lankan Rupees'}</p>
                </div>
            </div>

            {/* Shipping Method */}
            {selectedShipping && (
                <div className="mt-4 p-3 bg-vanilla-50 rounded-lg border border-vanilla-100">
                    <div className="flex items-center gap-2 text-sm text-vanilla-900 font-medium">
                        <Truck className="w-4 h-4 text-gold-500" />
                        <span>{selectedShipping.name}</span>
                    </div>
                    <p className="text-xs text-vanilla-800/60 mt-1 ml-6">
                        {selectedShipping.description}
                    </p>
                </div>
            )}
        </div>
    )
}

// ============================================
// CONSTANTS
// ============================================

const COUNTRIES = [
    'Sri Lanka', 'India', 'United States', 'United Kingdom', 'Australia', 'Canada',
    'Germany', 'France', 'Japan', 'Singapore', 'Malaysia', 'United Arab Emirates',
    'Saudi Arabia', 'Qatar', 'Maldives', 'New Zealand', 'Netherlands', 'Belgium',
    'Switzerland', 'Italy', 'Spain', 'Sweden', 'Norway', 'Denmark', 'South Korea',
    'China', 'Hong Kong', 'Thailand', 'Indonesia', 'Philippines', 'Vietnam',
    'Pakistan', 'Bangladesh', 'Nepal', 'South Africa', 'Nigeria', 'Kenya', 'Egypt',
    'Brazil', 'Mexico', 'Argentina', 'Chile', 'Other'
].sort((a, b) => {
    if (a === 'Sri Lanka') return -1
    if (b === 'Sri Lanka') return 1
    return a.localeCompare(b)
})

const SRI_LANKAN_STATES = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
    'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
    'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
    'Moneragala', 'Ratnapura', 'Kegalle'
].sort()

const PAYMENT_METHODS = [
    {
        id: 'cod',
        name: 'Cash on Delivery',
        description: 'Pay when you receive (Sri Lanka only)',
        icon: <Banknote className="w-5 h-5" />,
        localOnly: true,
        lkrOnly: true
    },
    {
        id: 'card',
        name: 'Credit / Debit Card',
        description: 'Visa, Mastercard, Amex',
        icon: <CreditCard className="w-5 h-5" />,
        localOnly: false,
        lkrOnly: false
    },
    {
        id: 'bank',
        name: 'Bank Transfer',
        description: 'Direct bank transfer',
        icon: <Building className="w-5 h-5" />,
        localOnly: false,
        lkrOnly: false
    },
    {
        id: 'mobile',
        name: 'Mobile Payment',
        description: 'FriMi, eZ Cash, mCash',
        icon: <Smartphone className="w-5 h-5" />,
        localOnly: true,
        lkrOnly: true
    }
]

const STEPS = [
    { id: 1, name: 'Information', icon: <User className="w-5 h-5" /> },
    { id: 2, name: 'Shipping', icon: <Truck className="w-5 h-5" /> },
    { id: 3, name: 'Payment', icon: <CreditCard className="w-5 h-5" /> }
]

const getItemKey = (item) => `${item.productId}-${item.variantLabel || 'no-variant'}`

// ============================================
// MAIN CHECKOUT COMPONENT
// ============================================

const Checkout = () => {
    const navigate = useNavigate()
    const location = useLocation()

    // State
    const [cartItems, setCartItems] = useState([])
    const [isLoadingCart, setIsLoadingCart] = useState(true)
    const [currentStep, setCurrentStep] = useState(1)
    const [completedSteps, setCompletedSteps] = useState([])
    const [errors, setErrors] = useState({})
    const [isProcessing, setIsProcessing] = useState(false)
    const [showOrderSummary, setShowOrderSummary] = useState(false)
    const [agreedToTerms, setAgreedToTerms] = useState(false)
    const [shippingMethod, setShippingMethod] = useState('standard')
    
    // Currency State - Initialize from localStorage or location state
    const [currency, setCurrency] = useState(() => {
        // Check location state first (passed from cart page)
        if (location.state?.currency) {
            return location.state.currency
        }
        // Fall back to stored preference
        return getPreferredCurrency()
    })

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', phone: '',
        address: '', city: '', state: '', zipCode: '',
        country: 'Sri Lanka', paymentMethod: 'cod'
    })

    const url = window.location.href;

    useSEO({
        title: "Checkout - The Vanilla Shop",
        url,
        image_alt: "Checkout",
        twitter_card: "summary_large_image",
    });

    // Currency change handler
    const handleCurrencyChange = (newCurrency) => {
        setCurrency(newCurrency)
        setPreferredCurrency(newCurrency)
        
        // Update payment method if switching to USD and using LKR-only method
        if (newCurrency === 'USD' && (formData.paymentMethod === 'cod' || formData.paymentMethod === 'mobile')) {
            setFormData(prev => ({ ...prev, paymentMethod: 'card' }))
        }
    }

    // Helper: Price Formatter
    const formatPrice = (price) => {
        if (currency === 'USD') {
            return new Intl.NumberFormat('en-US', { 
                style: 'currency', 
                currency: 'USD',
                minimumFractionDigits: 2
            }).format(price)
        }
        return `LKR ${new Intl.NumberFormat('en-LK', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price)}`
    }

    // Helper: Get Price Value based on Currency
    const getPriceValue = (item) => {
        if (currency === 'USD') {
            return item.priceInUSD || 0
        }
        return item.priceInLKR || item.price || 0
    }

    // Get items missing price in current currency
    const missingPriceItems = cartItems.filter(item => getPriceValue(item) <= 0)
    const canCheckout = missingPriceItems.length === 0

    // Shipping Logic with Currency Support
    const getShippingMethods = () => {
        const isLocal = formData.country === 'Sri Lanka'
        
        if (isLocal) {
            if (currency === 'USD') {
                return [
                    { id: 'standard', name: 'Standard Delivery', description: '3-5 business days', price: 2, freeOver: 25 },
                    { id: 'express', name: 'Express Delivery', description: '1-2 business days', price: 5, freeOver: null },
                    { id: 'pickup', name: 'Store Pickup', description: 'Pick up from our Colombo store', price: 0, freeOver: null }
                ]
            }
            return [
                { id: 'standard', name: 'Standard Delivery', description: '3-5 business days', price: 350, freeOver: 5000 },
                { id: 'express', name: 'Express Delivery', description: '1-2 business days', price: 750, freeOver: null },
                { id: 'pickup', name: 'Store Pickup', description: 'Pick up from our Colombo store', price: 0, freeOver: null }
            ]
        } else {
            // International
            if (currency === 'USD') {
                return [
                    { id: 'international-standard', name: 'International Standard', description: '10-15 business days', price: 15, freeOver: 100 },
                    { id: 'international-express', name: 'International Express', description: '5-7 business days', price: 30, freeOver: null }
                ]
            }
            return [
                { id: 'international-standard', name: 'International Standard', description: '10-15 business days', price: 2500, freeOver: 25000 },
                { id: 'international-express', name: 'International Express', description: '5-7 business days', price: 5000, freeOver: null }
            ]
        }
    }

    const shippingMethods = getShippingMethods()
    
    // Filter payment methods based on country and currency
    const availablePaymentMethods = PAYMENT_METHODS.filter(m => {
        // Filter out local-only methods for international
        if (formData.country !== 'Sri Lanka' && m.localOnly) return false
        // Filter out LKR-only methods when using USD
        if (currency === 'USD' && m.lkrOnly) return false
        return true
    })

    // Load Cart
    useEffect(() => {
        const loadCart = () => {
            const items = getCart()
            setCartItems(items)
            setIsLoadingCart(false)
            if (items.length === 0) navigate('/cart')
        }
        loadCart()

        const handleCartUpdate = () => {
            const items = getCart()
            setCartItems(items)
            if (items.length === 0) navigate('/cart')
        }

        const handleCurrencyUpdate = () => {
            setCurrency(getPreferredCurrency())
        }

        window.addEventListener('cartUpdated', handleCartUpdate)
        window.addEventListener('currencyUpdated', handleCurrencyUpdate)
        
        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate)
            window.removeEventListener('currencyUpdated', handleCurrencyUpdate)
        }
    }, [navigate])

    // Effect: Update shipping/payment on country or currency change
    useEffect(() => {
        const methods = getShippingMethods()
        if (!methods.find(m => m.id === shippingMethod)) {
            setShippingMethod(methods[0]?.id || 'standard')
        }
        
        // Reset payment method if current one is not available
        const currentPaymentAvailable = availablePaymentMethods.find(m => m.id === formData.paymentMethod)
        if (!currentPaymentAvailable && availablePaymentMethods.length > 0) {
            setFormData(prev => ({ ...prev, paymentMethod: availablePaymentMethods[0].id }))
        }
        
        if (formData.country !== 'Sri Lanka') {
            setFormData(prev => ({ ...prev, state: '' }))
        }
    }, [formData.country, currency])

    // Scroll top on step change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [currentStep])

    // Calculations
    const subtotal = cartItems.reduce((sum, item) => sum + (getPriceValue(item) * item.quantity), 0)
    const selectedShipping = shippingMethods.find(m => m.id === shippingMethod)

    const getShippingCost = () => {
        if (selectedShipping?.freeOver && subtotal >= selectedShipping.freeOver) return 0
        return selectedShipping?.price || 0
    }

    const shippingCost = getShippingCost()
    const total = subtotal + shippingCost

    // Free shipping progress
    const getFreeShippingProgress = () => {
        if (!selectedShipping?.freeOver) return null
        const threshold = selectedShipping.freeOver
        const remaining = Math.max(0, threshold - subtotal)
        const progress = Math.min(100, (subtotal / threshold) * 100)
        return { threshold, remaining, progress, qualifies: remaining === 0 }
    }

    const freeShippingProgress = getFreeShippingProgress()

    // Handlers
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
    }

    const validateStep = (step) => {
        const newErrors = {}
        
        // Always check for missing prices
        if (!canCheckout) {
            newErrors.currency = `Some items don't have prices in ${currency}. Please switch currency or remove those items.`
        }
        
        if (step === 1) {
            if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
            if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
            if (!formData.email.trim()) newErrors.email = 'Email is required'
            else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format'
            if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
            else if (!/^[0-9+\-\s()]{8,15}$/.test(formData.phone.replace(/\s/g, ''))) newErrors.phone = 'Invalid phone number'
            if (!formData.address.trim()) newErrors.address = 'Address is required'
            if (!formData.city.trim()) newErrors.city = 'City is required'
            if (!formData.state.trim()) newErrors.state = formData.country === 'Sri Lanka' ? 'District is required' : 'State/Province is required'
            if (!formData.zipCode.trim()) newErrors.zipCode = 'Postal/ZIP code is required'
        }
        if (step === 2) {
            if (!shippingMethod) newErrors.shippingMethod = 'Please select a shipping method'
        }
        if (step === 3) {
            if (!formData.paymentMethod) newErrors.paymentMethod = 'Please select a payment method'
            if (!agreedToTerms) newErrors.terms = 'You must agree to the terms and conditions'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleNextStep = () => {
        if (validateStep(currentStep)) {
            setCompletedSteps([...completedSteps, currentStep])
            setCurrentStep(currentStep + 1)
        }
    }

    const handlePrevStep = () => setCurrentStep(currentStep - 1)

    const handlePlaceOrder = async () => {
        if (!validateStep(3)) return
        if (!canCheckout) {
            toast.error(`Some items don't have prices in ${currency}`)
            return
        }
        
        setIsProcessing(true)
        try {
            const orderData = {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim().toLowerCase(),
                phone: formData.phone.trim(),
                currency: currency,
                orderItems: cartItems.map(item => ({
                    name: item.variantLabel ? `${item.name} (${item.variantLabel})` : item.name,
                    quantity: item.quantity,
                    image: item.image || '/images/placeholder.jpg',
                    price: getPriceValue(item),
                    priceInLKR: item.priceInLKR || item.price || null,
                    priceInUSD: item.priceInUSD || null,
                    product: item.productId
                })),
                shippingAddress: {
                    address: formData.address.trim(),
                    city: formData.city.trim(),
                    state: formData.state.trim(),
                    zipCode: formData.zipCode.trim(),
                    country: formData.country
                },
                paymentMethod: formData.paymentMethod,
                itemsPrice: subtotal,
                shippingPrice: shippingCost,
                totalPrice: total
            }

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/orders`, orderData)
            if (response.data) {
                emptyCart()
                window.dispatchEvent(new Event('cartUpdated'))
                toast.success('Order placed successfully!')
                navigate(`/order-success/${response.data.order.orderId}`)
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to place order.'
            toast.error(errorMessage)
            setErrors({ submit: errorMessage })
        } finally {
            setIsProcessing(false)
        }
    }

    // Loading & Empty States
    if (isLoadingCart) {
        return (
            <div className="pt-24 min-h-screen bg-vanilla-50 font-sans">
                <Navbar />
                <div className="flex items-center justify-center py-32">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 text-gold-500 animate-spin mx-auto mb-4" />
                        <p className="text-vanilla-800/60">Loading checkout...</p>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="pt-24 min-h-screen bg-vanilla-50 font-sans text-vanilla-800">
            <Navbar />

            {/* Breadcrumbs with Currency Selector */}
            <div className="bg-white border-b border-vanilla-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-sm overflow-x-auto">
                            <Link to="/" className="text-vanilla-800/60 hover:text-gold-500 transition-colors flex items-center gap-1 shrink-0">
                                <Home className="w-4 h-4" />
                                <span className="hidden sm:inline">Home</span>
                            </Link>
                            <ChevronRight className="w-4 h-4 text-vanilla-200 shrink-0" />
                            <Link to="/cart" className="text-vanilla-800/60 hover:text-gold-500 transition-colors shrink-0">
                                Cart
                            </Link>
                            <ChevronRight className="w-4 h-4 text-vanilla-200 shrink-0" />
                            <span className="text-vanilla-900 font-medium shrink-0">Checkout</span>
                        </div>
                        
                        {/* Currency Selector */}
                        <CurrencySelector 
                            currency={currency} 
                            onCurrencyChange={handleCurrencyChange}
                            className="shrink-0"
                        />
                    </nav>
                </div>
            </div>

            {/* Steps Indicator */}
            <div className="bg-white border-b border-vanilla-100 sticky top-24 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-center">
                        {STEPS.map((step, index) => (
                            <React.Fragment key={step.id}>
                                <button
                                    onClick={() => {
                                        if (completedSteps.includes(step.id) || step.id < currentStep) {
                                            setCurrentStep(step.id)
                                        }
                                    }}
                                    disabled={step.id > currentStep && !completedSteps.includes(step.id)}
                                    className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full transition-all ${currentStep === step.id
                                        ? 'bg-vanilla-900 text-white shadow-md'
                                        : completedSteps.includes(step.id)
                                            ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-100'
                                            : 'bg-vanilla-50 text-vanilla-800/50 border border-vanilla-100'
                                        }`}
                                >
                                    {completedSteps.includes(step.id) ? (
                                        <CheckCircle className="w-5 h-5" />
                                    ) : (
                                        step.icon
                                    )}
                                    <span className="hidden sm:inline font-bold font-serif">{step.name}</span>
                                </button>
                                {index < STEPS.length - 1 && (
                                    <div className={`w-8 sm:w-12 lg:w-20 h-0.5 mx-1 sm:mx-2 ${completedSteps.includes(step.id) ? 'bg-green-400' : 'bg-vanilla-200'
                                        }`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Layout */}
            <section className="py-6 sm:py-8 lg:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                        {/* LEFT COLUMN: FORMS */}
                        <div className="flex-1">
                            {/* Mobile Order Summary Toggle */}
                            <div className="lg:hidden mb-4 sm:mb-6">
                                <button
                                    onClick={() => setShowOrderSummary(!showOrderSummary)}
                                    className="w-full flex items-center justify-between p-3 sm:p-4 bg-white border border-vanilla-200 rounded-xl shadow-sm"
                                >
                                    <div className="flex items-center gap-2">
                                        <ShoppingCart className="w-5 h-5 text-gold-500" />
                                        <span className="font-bold text-vanilla-900 text-sm sm:text-base font-serif">
                                            {showOrderSummary ? 'Hide' : 'Show'} Summary
                                        </span>
                                        <span className="text-vanilla-800/60 text-xs sm:text-sm">
                                            ({cartItems.length})
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-vanilla-900 text-sm sm:text-base font-serif">{formatPrice(total)}</span>
                                        {showOrderSummary ? <ChevronUp className="w-5 h-5 text-vanilla-400" /> : <ChevronDown className="w-5 h-5 text-vanilla-400" />}
                                    </div>
                                </button>

                                {showOrderSummary && (
                                    <div className="mt-3 sm:mt-4 bg-white rounded-xl border border-vanilla-100 p-3 sm:p-4 shadow-sm">
                                        <OrderSummaryContent
                                            cartItems={cartItems}
                                            subtotal={subtotal}
                                            shippingCost={shippingCost}
                                            total={total}
                                            formatPrice={formatPrice}
                                            getItemKey={getItemKey}
                                            selectedShipping={selectedShipping}
                                            getPriceValue={getPriceValue}
                                            currency={currency}
                                            onCurrencyChange={handleCurrencyChange}
                                            showCurrencySelector={true}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Missing Price Warning */}
                            <MissingPriceWarning 
                                missingItems={missingPriceItems}
                                currency={currency}
                                onChangeCurrency={handleCurrencyChange}
                            />

                            {/* Global Error */}
                            {errors.submit && (
                                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-red-800 text-sm sm:text-base">Order Failed</h4>
                                        <p className="text-red-600 text-xs sm:text-sm">{errors.submit}</p>
                                    </div>
                                </div>
                            )}

                            {/* Currency Error */}
                            {errors.currency && (
                                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                    <p className="text-amber-800 text-sm">{errors.currency}</p>
                                </div>
                            )}

                            {/* Step 1: Contact & Shipping Information */}
                            {currentStep === 1 && (
                                <div className="space-y-4 sm:space-y-6">
                                    {/* Contact Information */}
                                    <div className="bg-white rounded-xl sm:rounded-2xl border border-vanilla-100 shadow-sm overflow-hidden">
                                        <div className="p-4 sm:p-5 bg-vanilla-50 border-b border-vanilla-100">
                                            <h2 className="font-bold text-base sm:text-lg text-vanilla-900 flex items-center gap-2 font-serif">
                                                <User className="w-5 h-5 text-gold-500" />
                                                Contact Information
                                            </h2>
                                        </div>
                                        <div className="p-4 sm:p-5 lg:p-6 space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <Input label="First Name" name="firstName" required placeholder="John" value={formData.firstName} onChange={handleChange} error={errors.firstName} />
                                                <Input label="Last Name" name="lastName" required placeholder="Doe" value={formData.lastName} onChange={handleChange} error={errors.lastName} />
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <Input label="Email Address" name="email" type="email" required placeholder="your@email.com" value={formData.email} onChange={handleChange} error={errors.email} />
                                                <Input label="Phone Number" name="phone" type="tel" required placeholder="+94 77 123 4567" value={formData.phone} onChange={handleChange} error={errors.phone} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Shipping Address */}
                                    <div className="bg-white rounded-xl sm:rounded-2xl border border-vanilla-100 shadow-sm overflow-hidden">
                                        <div className="p-4 sm:p-5 bg-vanilla-50 border-b border-vanilla-100">
                                            <h2 className="font-bold text-base sm:text-lg text-vanilla-900 flex items-center gap-2 font-serif">
                                                <MapPin className="w-5 h-5 text-gold-500" />
                                                Shipping Address
                                            </h2>
                                        </div>
                                        <div className="p-4 sm:p-5 lg:p-6 space-y-4">
                                            <Select label="Country" name="country" required value={formData.country} onChange={handleChange} error={errors.country}>
                                                {COUNTRIES.map((country) => <option key={country} value={country}>{country}</option>)}
                                            </Select>

                                            <Input label="Street Address" name="address" required placeholder="123 Main Street" value={formData.address} onChange={handleChange} error={errors.address} />

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <Input label="City" name="city" required placeholder="City" value={formData.city} onChange={handleChange} error={errors.city} />

                                                {formData.country === 'Sri Lanka' ? (
                                                    <Select label="District" name="state" required value={formData.state} onChange={handleChange} error={errors.state}>
                                                        <option value="">Select District</option>
                                                        {SRI_LANKAN_STATES.map((state) => <option key={state} value={state}>{state}</option>)}
                                                    </Select>
                                                ) : (
                                                    <Input label="State / Province" name="state" required placeholder="State" value={formData.state} onChange={handleChange} error={errors.state} />
                                                )}

                                                <Input label="Postal / ZIP Code" name="zipCode" required placeholder="00000" value={formData.zipCode} onChange={handleChange} error={errors.zipCode} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Currency Notice */}
                                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                                        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-blue-800 text-sm">
                                                You're checking out in <span className="font-bold">{currency === 'USD' ? 'US Dollars ($)' : 'Sri Lankan Rupees (LKR)'}</span>.
                                                {formData.country !== 'Sri Lanka' && currency === 'LKR' && (
                                                    <span className="block mt-1 text-blue-700">
                                                        For international orders, you may prefer to 
                                                        <button 
                                                            onClick={() => handleCurrencyChange('USD')}
                                                            className="mx-1 text-blue-600 hover:text-blue-800 font-bold underline"
                                                        >
                                                            switch to USD
                                                        </button>
                                                        for easier payment.
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Shipping Method */}
                            {currentStep === 2 && (
                                <div className="space-y-4 sm:space-y-6">
                                    <div className="bg-white rounded-xl sm:rounded-2xl border border-vanilla-100 shadow-sm overflow-hidden">
                                        <div className="p-4 sm:p-5 bg-vanilla-50 border-b border-vanilla-100">
                                            <h2 className="font-bold text-base sm:text-lg text-vanilla-900 flex items-center gap-2 font-serif">
                                                <Truck className="w-5 h-5 text-gold-500" />
                                                Shipping Method
                                            </h2>
                                            <div className="flex items-center gap-4 mt-1">
                                                {formData.country !== 'Sri Lanka' && (
                                                    <p className="text-vanilla-800/60 text-xs sm:text-sm flex items-center gap-1">
                                                        <Globe className="w-4 h-4" />
                                                        Shipping to {formData.country}
                                                    </p>
                                                )}
                                                <p className="text-vanilla-800/60 text-xs sm:text-sm flex items-center gap-1">
                                                    <Wallet className="w-4 h-4" />
                                                    Prices in {currency}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* Free Shipping Progress */}
                                        {freeShippingProgress && !freeShippingProgress.qualifies && (
                                            <div className="px-4 sm:px-5 lg:px-6 pt-4">
                                                <div className="p-3 bg-green-50 border border-green-100 rounded-lg">
                                                    <div className="flex items-center justify-between text-sm mb-2">
                                                        <span className="text-green-800 font-medium">
                                                            🚚 Add {formatPrice(freeShippingProgress.remaining)} for free shipping!
                                                        </span>
                                                        <span className="text-green-600 text-xs">
                                                            {Math.round(freeShippingProgress.progress)}%
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-green-100 rounded-full h-2">
                                                        <div 
                                                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                                            style={{ width: `${freeShippingProgress.progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div className="p-4 sm:p-5 lg:p-6 space-y-3">
                                            {shippingMethods.map((method) => {
                                                const isFree = method.freeOver && subtotal >= method.freeOver
                                                return (
                                                    <label
                                                        key={method.id}
                                                        className={`flex items-start sm:items-center justify-between p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all ${shippingMethod === method.id
                                                            ? 'border-gold-500 bg-vanilla-50'
                                                            : 'border-vanilla-100 hover:border-vanilla-200'
                                                            }`}
                                                    >
                                                        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                                                            <input
                                                                type="radio"
                                                                name="shippingMethod"
                                                                value={method.id}
                                                                checked={shippingMethod === method.id}
                                                                onChange={(e) => setShippingMethod(e.target.value)}
                                                                className="w-5 h-5 mt-0.5 sm:mt-0 text-gold-500 focus:ring-gold-500"
                                                            />
                                                            <div>
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    <span className="font-bold text-vanilla-900 text-sm sm:text-base font-serif">
                                                                        {method.name}
                                                                    </span>
                                                                    {isFree && method.price > 0 && (
                                                                        <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs font-bold rounded-full">
                                                                            FREE
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-vanilla-800/60 text-xs sm:text-sm flex items-center gap-1 mt-0.5">
                                                                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                    {method.description}
                                                                </p>
                                                                {method.freeOver && !isFree && (
                                                                    <p className="text-green-600 text-xs mt-1">
                                                                        Free on orders over {formatPrice(method.freeOver)}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <span className={`font-bold text-sm sm:text-base ml-2 ${isFree && method.price > 0 ? 'text-green-600 line-through decoration-2' : 'text-vanilla-900'}`}>
                                                            {method.price === 0 ? 'Free' : formatPrice(method.price)}
                                                        </span>
                                                    </label>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* Address Summary */}
                                    <div className="bg-white rounded-xl sm:rounded-2xl border border-vanilla-100 shadow-sm overflow-hidden">
                                        <div className="p-4 sm:p-5 bg-vanilla-50 border-b border-vanilla-100 flex items-center justify-between">
                                            <h2 className="font-bold text-base sm:text-lg text-vanilla-900 flex items-center gap-2 font-serif">
                                                <MapPin className="w-5 h-5 text-gold-500" />
                                                Shipping To
                                            </h2>
                                            <button onClick={() => setCurrentStep(1)} className="text-gold-500 hover:text-vanilla-900 text-sm font-bold flex items-center gap-1">
                                                <Edit2 className="w-4 h-4" /> Edit
                                            </button>
                                        </div>
                                        <div className="p-4 sm:p-5 lg:p-6">
                                            <p className="text-vanilla-900 font-bold text-sm sm:text-base">{formData.firstName} {formData.lastName}</p>
                                            <p className="text-vanilla-800/70 text-sm mt-1">{formData.address}</p>
                                            <p className="text-vanilla-800/70 text-sm">{formData.city}, {formData.state} {formData.zipCode}</p>
                                            <p className="text-vanilla-800/70 text-sm">{formData.country}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Payment */}
                            {currentStep === 3 && (
                                <div className="space-y-4 sm:space-y-6">
                                    <div className="bg-white rounded-xl sm:rounded-2xl border border-vanilla-100 shadow-sm overflow-hidden">
                                        <div className="p-4 sm:p-5 bg-vanilla-50 border-b border-vanilla-100">
                                            <h2 className="font-bold text-base sm:text-lg text-vanilla-900 flex items-center gap-2 font-serif">
                                                <Wallet className="w-5 h-5 text-gold-500" />
                                                Payment Method
                                            </h2>
                                            <p className="text-vanilla-800/60 text-xs sm:text-sm mt-1 flex items-center gap-1">
                                                <Globe className="w-4 h-4" />
                                                Paying in {currency === 'USD' ? 'US Dollars' : 'Sri Lankan Rupees'}
                                            </p>
                                        </div>
                                        <div className="p-4 sm:p-5 lg:p-6 space-y-3">
                                            {availablePaymentMethods.map((method) => (
                                                <label
                                                    key={method.id}
                                                    className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentMethod === method.id
                                                        ? 'border-gold-500 bg-vanilla-50'
                                                        : 'border-vanilla-100 hover:border-vanilla-200'
                                                        }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="paymentMethod"
                                                        value={method.id}
                                                        checked={formData.paymentMethod === method.id}
                                                        onChange={handleChange}
                                                        className="w-5 h-5 text-gold-500 focus:ring-gold-500"
                                                    />
                                                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white border border-vanilla-200 rounded-lg flex items-center justify-center text-gold-500 shrink-0">
                                                        {method.icon}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <span className="font-bold text-vanilla-900 block text-sm sm:text-base font-serif">
                                                            {method.name}
                                                        </span>
                                                        <span className="text-vanilla-800/60 text-xs sm:text-sm">
                                                            {method.description}
                                                        </span>
                                                    </div>
                                                </label>
                                            ))}
                                            
                                            {/* Note about available payment methods */}
                                            {(currency === 'USD' || formData.country !== 'Sri Lanka') && (
                                                <div className="mt-4 p-3 bg-vanilla-50 rounded-lg border border-vanilla-100">
                                                    <p className="text-vanilla-800/70 text-xs flex items-start gap-2">
                                                        <Info className="w-4 h-4 shrink-0 mt-0.5 text-vanilla-500" />
                                                        <span>
                                                            {currency === 'USD' 
                                                                ? 'Cash on Delivery and Mobile Payment are only available for LKR orders within Sri Lanka.'
                                                                : 'Cash on Delivery and Mobile Payment are only available within Sri Lanka.'}
                                                        </span>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Order Review */}
                                    <div className="bg-white rounded-xl sm:rounded-2xl border border-vanilla-100 shadow-sm overflow-hidden">
                                        <div className="p-4 sm:p-5 bg-vanilla-50 border-b border-vanilla-100 flex items-center justify-between">
                                            <h2 className="font-bold text-base sm:text-lg text-vanilla-900 flex items-center gap-2 font-serif">
                                                <Package className="w-5 h-5 text-gold-500" />
                                                Order Review
                                            </h2>
                                            <span className="text-vanilla-800/60 text-xs px-2 py-1 bg-vanilla-100 rounded-full">
                                                {currency}
                                            </span>
                                        </div>
                                        <div className="p-4 sm:p-5 lg:p-6">
                                            <div className="space-y-3 sm:space-y-4">
                                                {cartItems.map((item) => {
                                                    const itemPrice = getPriceValue(item)
                                                    const hasPrice = itemPrice > 0
                                                    
                                                    return (
                                                        <div key={getItemKey(item)} className="flex gap-3 sm:gap-4">
                                                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-vanilla-50 rounded-lg shrink-0 overflow-hidden border border-vanilla-100">
                                                                {item.image ? (
                                                                    <img
                                                                        src={item.image}
                                                                        alt={item.name}
                                                                        className="w-full h-full object-cover"
                                                                        onError={(e) => e.target.style.display = 'none'}
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center">
                                                                        <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-vanilla-200" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-bold text-vanilla-900 text-sm line-clamp-1 font-serif">{item.name}</h4>
                                                                {item.variantLabel && <p className="text-vanilla-800/60 text-xs">{item.variantLabel}</p>}
                                                                <p className="text-vanilla-800/60 text-xs">Qty: {item.quantity}</p>
                                                            </div>
                                                            <span className={`font-medium text-sm shrink-0 ${hasPrice ? 'text-vanilla-900' : 'text-red-500'}`}>
                                                                {hasPrice ? formatPrice(itemPrice * item.quantity) : 'N/A'}
                                                            </span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                            <div className="mt-4 sm:mt-6 pt-4 border-t border-vanilla-100 space-y-2">
                                                <div className="flex justify-between text-sm text-vanilla-800/70">
                                                    <span>Subtotal</span>
                                                    <span>{formatPrice(subtotal)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm text-vanilla-800/70">
                                                    <span>Shipping ({selectedShipping?.name})</span>
                                                    <span>{shippingCost === 0 ? <span className="text-green-600 font-bold">FREE</span> : formatPrice(shippingCost)}</span>
                                                </div>
                                                <div className="flex justify-between font-bold text-base sm:text-lg pt-2 text-vanilla-900">
                                                    <span className="font-serif">Total</span>
                                                    <span className="font-serif">{formatPrice(total)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Terms */}
                                    <div className="bg-white rounded-xl sm:rounded-2xl border border-vanilla-100 shadow-sm p-4 sm:p-5">
                                        <label className="flex items-start gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={agreedToTerms}
                                                onChange={(e) => {
                                                    setAgreedToTerms(e.target.checked)
                                                    if (errors.terms) setErrors(prev => ({ ...prev, terms: null }))
                                                }}
                                                className="w-5 h-5 mt-0.5 rounded border-vanilla-300 text-gold-500 focus:ring-gold-500"
                                            />
                                            <span className="text-vanilla-800/70 text-xs sm:text-sm">
                                                I agree to the{' '}
                                                <Link to="/terms" className="text-gold-500 hover:text-vanilla-900 font-bold" target="_blank">Terms & Conditions</Link>
                                                {' '}and{' '}
                                                <Link to="/privacy" className="text-gold-500 hover:text-vanilla-900 font-bold" target="_blank">Privacy Policy</Link>
                                            </span>
                                        </label>
                                        {errors.terms && <p className="text-red-500 text-xs sm:text-sm mt-2 ml-8">{errors.terms}</p>}
                                    </div>
                                </div>
                            )}

                            {/* Nav Buttons */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-vanilla-200">
                                {currentStep > 1 ? (
                                    <button
                                        onClick={handlePrevStep}
                                        className="order-2 sm:order-1 flex items-center justify-center gap-2 px-6 py-3 text-vanilla-800 hover:text-vanilla-900 font-bold transition-colors"
                                    >
                                        <ChevronLeft className="w-5 h-5" /> Back
                                    </button>
                                ) : (
                                    <Link
                                        to="/cart"
                                        className="order-2 sm:order-1 flex items-center justify-center gap-2 px-6 py-3 text-vanilla-800 hover:text-vanilla-900 font-bold transition-colors"
                                    >
                                        <ChevronLeft className="w-5 h-5" /> Return to Cart
                                    </Link>
                                )}

                                {currentStep < 3 ? (
                                    <button
                                        onClick={handleNextStep}
                                        disabled={!canCheckout}
                                        className="order-1 sm:order-2 flex items-center justify-center gap-2 px-8 py-3 bg-vanilla-900 text-white rounded-xl font-bold hover:bg-gold-500 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-vanilla-900 disabled:hover:shadow-none disabled:hover:translate-y-0"
                                    >
                                        Continue <ArrowRight className="w-5 h-5" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handlePlaceOrder}
                                        disabled={isProcessing || !canCheckout}
                                        className="order-1 sm:order-2 flex items-center justify-center gap-2 px-6 sm:px-8 py-3 bg-vanilla-900 text-white rounded-xl font-bold hover:bg-gold-500 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="w-5 h-5" /> Pay {formatPrice(total)}
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: DESKTOP SUMMARY */}
                        <div className="hidden lg:block lg:w-96">
                            <div className="bg-white rounded-2xl border border-vanilla-100 shadow-sm overflow-hidden sticky top-44">
                                <div className="p-5 bg-vanilla-50 border-b border-vanilla-100 flex items-center justify-between">
                                    <h2 className="font-bold text-lg text-vanilla-900 font-serif">Order Summary</h2>
                                    <CurrencySelector 
                                        currency={currency} 
                                        onCurrencyChange={handleCurrencyChange}
                                        compact
                                    />
                                </div>
                                <div className="p-5">
                                    <OrderSummaryContent
                                        cartItems={cartItems}
                                        subtotal={subtotal}
                                        shippingCost={shippingCost}
                                        total={total}
                                        formatPrice={formatPrice}
                                        selectedShipping={selectedShipping}
                                        getItemKey={getItemKey}
                                        getPriceValue={getPriceValue}
                                        currency={currency}
                                        onCurrencyChange={handleCurrencyChange}
                                        showCurrencySelector={false}
                                    />
                                    
                                    {/* Free Shipping Progress in Summary */}
                                    {freeShippingProgress && !freeShippingProgress.qualifies && (
                                        <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-lg">
                                            <p className="text-green-800 text-xs font-medium mb-2">
                                                🚚 {formatPrice(freeShippingProgress.remaining)} away from free shipping!
                                            </p>
                                            <div className="w-full bg-green-100 rounded-full h-1.5">
                                                <div 
                                                    className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                                                    style={{ width: `${freeShippingProgress.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="p-5 bg-vanilla-50 border-t border-vanilla-100">
                                    <div className="flex items-center justify-center gap-6">
                                        <div className="text-center">
                                            <Lock className="w-5 h-5 text-gold-500 mx-auto mb-1" />
                                            <span className="text-xs font-bold text-vanilla-800/60 uppercase tracking-wider">Secure</span>
                                        </div>
                                        <div className="text-center">
                                            <ShieldCheck className="w-5 h-5 text-gold-500 mx-auto mb-1" />
                                            <span className="text-xs font-bold text-vanilla-800/60 uppercase tracking-wider">Protected</span>
                                        </div>
                                        <div className="text-center">
                                            <Truck className="w-5 h-5 text-gold-500 mx-auto mb-1" />
                                            <span className="text-xs font-bold text-vanilla-800/60 uppercase tracking-wider">Tracked</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default Checkout