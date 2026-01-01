import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
    CheckCircle,
    Package,
    Truck,
    MapPin,
    CreditCard,
    Home,
    ShoppingBag,
    Copy,
    Clock,
    Sparkles,
    ArrowRight
} from 'lucide-react'
import confetti from 'canvas-confetti'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getOrderData } from '../api/data.api'
import useSEO from '../hooks/useSEO'

const OrderSuccess = () => {
    const navigate = useNavigate()
    const [copied, setCopied] = useState(false)
    const [orderData, setOrderData] = useState(null)
    const { orderId } = useParams()

    const url = window.location.href;

    useSEO({
        title: "Order Success - The Vanilla Shop",
        description: "The Vanilla Shop is more than a café — it’s Sri Lanka’s first dedicated vanilla boutique.",
        url,
        image_alt: "Order Success",
        twitter_card: "summary_large_image",
    });

    useEffect(() => {
        if (!orderId) return

        getOrderData(orderId)
            .then(res => {
                setOrderData(res)
            })
            .catch(err => {
                console.error('Error fetching order data:', err)
            })
    }, [orderId])

    const totalPrice = orderData?.totalPrice;
    const status = orderData?.status;
    const email = orderData?.email;
    const shippingAddress = orderData?.shippingAddress;
    const paymentMethod = orderData?.paymentMethod;

    // Confetti effect on mount
    useEffect(() => {
        const duration = 3000
        const animationEnd = Date.now() + duration
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 }

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min
        }

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now()

            if (timeLeft <= 0) {
                return clearInterval(interval)
            }

            const particleCount = 50 * (timeLeft / duration)

            // Updated colors to match the Vanilla/Gold theme
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: ['#d4af37', '#5d4037', '#f7f1e3', '#3e2723'] 
            })
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ['#d4af37', '#5d4037', '#f7f1e3', '#3e2723']
            })
        }, 250)

        return () => clearInterval(interval)
    }, [])

    // Copy order number
    const copyOrderNumber = () => {
        navigator.clipboard.writeText(orderId)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    // Format price
    const formatPrice = (price = 0) => `LKR ${Number(price).toLocaleString('en-LK')}`

    // Order timeline steps
    const timelineSteps = [
        {
            title: 'Order Placed',
            description: 'Your order has been confirmed',
            icon: <CheckCircle className="w-5 h-5" />,
            status: 'completed',
        },
        {
            title: 'Processing',
            description: 'We are preparing your order',
            icon: <Package className="w-5 h-5" />,
            status: status === 'processing' ? 'current' : ['shipped', 'delivered'].includes(status) ? 'completed' : 'pending',
        },
        {
            title: 'Shipped',
            description: 'Your order is on its way',
            icon: <Truck className="w-5 h-5" />,
            status: status === 'shipped' ? 'current' : status === 'delivered' ? 'completed' : 'pending',
        },
        {
            title: 'Delivered',
            description: 'Package delivered to your address',
            icon: <MapPin className="w-5 h-5" />,
            status: status === 'delivered' ? 'completed' : 'pending',
        }
    ]

    return (
        <div className="min-h-screen bg-vanilla-50 font-sans text-vanilla-800">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-12 bg-gradient-to-b from-vanilla-100 to-vanilla-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    {/* Success Icon */}
                    <div className="relative inline-block mb-8">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg border-4 border-vanilla-100 animate-bounce-slow">
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                    </div>

                    {/* Success Message */}
                    <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-vanilla-900 mb-6">
                        Thank You!
                    </h1>
                    <p className="text-vanilla-800/70 text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
                        Your order has been successfully placed. We've sent a confirmation email to{' '}
                        <strong className="text-vanilla-900 border-b border-gold-500/50 pb-0.5">{email || 'your email address'}</strong>
                    </p>

                    {/* Order Number */}
                    <div className="inline-flex items-center gap-4 bg-white px-8 py-5 rounded-2xl shadow-sm border border-vanilla-100 hover:shadow-md transition-shadow duration-300">
                        <div className="text-left">
                            <p className="text-vanilla-800/50 text-xs font-bold uppercase tracking-wider mb-1">Order Number</p>
                            <p className="font-serif font-bold text-2xl text-vanilla-900">{orderId}</p>
                        </div>
                        <div className="h-10 w-px bg-vanilla-200 mx-2"></div>
                        <button
                            onClick={copyOrderNumber}
                            className={`p-3 rounded-xl transition-all duration-300 ${copied
                                ? 'bg-green-100 text-green-700'
                                : 'bg-vanilla-50 text-vanilla-400 hover:bg-vanilla-100 hover:text-gold-500'
                                }`}
                            title="Copy order number"
                        >
                            {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column - Order Details */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Order Timeline */}
                            <div className="bg-white rounded-3xl border border-vanilla-100 shadow-sm overflow-hidden">
                                <div className="p-6 bg-vanilla-50 border-b border-vanilla-100">
                                    <h2 className="font-serif font-bold text-xl text-vanilla-900 flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-gold-500" />
                                        Order Status
                                    </h2>
                                </div>
                                <div className="p-8">
                                    <div className="relative">
                                        {timelineSteps.map((step, index) => (
                                            <div key={index} className="flex gap-6 pb-10 last:pb-0">
                                                {/* Timeline Line */}
                                                {index < timelineSteps.length - 1 && (
                                                    <div className={`absolute left-6 top-12 w-0.5 h-full -ml-px ${
                                                        step.status === 'completed' ? 'bg-green-500' : 'bg-vanilla-200'
                                                        }`} />
                                                )}

                                                {/* Icon */}
                                                <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-sm ${
                                                    step.status === 'completed'
                                                        ? 'bg-green-100 text-green-600'
                                                        : step.status === 'current'
                                                            ? 'bg-vanilla-900 text-white ring-4 ring-vanilla-100'
                                                            : 'bg-vanilla-100 text-vanilla-300'
                                                    }`}>
                                                    {step.icon}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 pt-2">
                                                    <h3 className={`font-serif font-bold text-lg ${
                                                        step.status === 'pending' ? 'text-vanilla-800/40' : 'text-vanilla-900'
                                                        }`}>
                                                        {step.title}
                                                    </h3>
                                                    <p className={`text-sm mt-1 font-sans ${
                                                        step.status === 'pending' ? 'text-vanilla-800/30' : 'text-vanilla-800/70'
                                                        }`}>
                                                        {step.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    to="/products"
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 bg-vanilla-900 text-white rounded-xl font-bold hover:bg-gold-500 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    <ShoppingBag className="w-5 h-5" />
                                    Continue Shopping
                                </Link>
                                <Link
                                    to="/"
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-vanilla-200 text-vanilla-900 rounded-xl font-bold hover:border-gold-500 hover:text-gold-500 transition-colors duration-300"
                                >
                                    <Home className="w-5 h-5" />
                                    Back to Home
                                </Link>
                            </div>
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="space-y-6">
                            {/* Order Total */}
                            <div className="bg-white rounded-3xl border border-vanilla-100 shadow-sm overflow-hidden sticky top-24">
                                <div className="p-6 bg-vanilla-50 border-b border-vanilla-100">
                                    <h2 className="font-serif font-bold text-xl text-vanilla-900">Order Summary</h2>
                                </div>
                                <div className="p-8">
                                    <div className="text-center py-2">
                                        <p className="text-vanilla-800/60 text-sm font-bold uppercase tracking-wider mb-2">Total Amount</p>
                                        <p className="font-serif text-4xl font-bold text-gold-500">
                                            {formatPrice(totalPrice)}
                                        </p>
                                    </div>

                                    {paymentMethod && (
                                        <div className="mt-8 pt-6 border-t border-vanilla-100">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-vanilla-800/60 font-medium">Payment Method</span>
                                                <span className="font-bold text-vanilla-900 capitalize flex items-center gap-2 bg-vanilla-50 px-3 py-1.5 rounded-full">
                                                    <CreditCard className="w-4 h-4 text-gold-500" />
                                                    {paymentMethod.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Shipping Address */}
                            {shippingAddress && (
                                <div className="bg-white rounded-3xl border border-vanilla-100 shadow-sm overflow-hidden">
                                    <div className="p-6 bg-vanilla-50 border-b border-vanilla-100">
                                        <h2 className="font-serif font-bold text-xl text-vanilla-900 flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-gold-500" />
                                            Shipping To
                                        </h2>
                                    </div>
                                    <div className="p-8 font-sans">
                                        <p className="text-vanilla-900 font-bold text-lg mb-1">
                                            {shippingAddress.firstName} {shippingAddress.lastName}
                                        </p>
                                        <p className="text-vanilla-800/70">{shippingAddress.address}</p>
                                        <p className="text-vanilla-800/70">
                                            {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                                        </p>
                                        <p className="text-vanilla-800/70 font-medium mt-1">{shippingAddress.country}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default OrderSuccess