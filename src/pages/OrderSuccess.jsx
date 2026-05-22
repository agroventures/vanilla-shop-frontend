import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
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

    // Confetti effect on mount (Transformed to elegant monochrome colors)
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

            // Updated colors to match minimalist high-end Black and White aesthetics
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: ['#171717', '#404040', '#a3a3a3', '#f5f5f5'] 
            })
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ['#171717', '#404040', '#a3a3a3', '#f5f5f5']
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

    // Order timeline steps (Synchronized to clean black/white statuses)
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

    const fadeUp = (delay = 0) => ({
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay }
    })

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="min-h-screen bg-neutral-50 font-sans text-neutral-800 antialiased leading-relaxed scroll-smooth">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-12 bg-neutral-50 border-b border-neutral-200/60">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    {/* Success Icon Wrapper */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                        className="relative inline-block mb-8"
                    >
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-neutral-200">
                            <CheckCircle className="w-12 h-12 text-neutral-900" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-10 h-10 bg-neutral-950 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                    </motion.div>

                    {/* Success Message */}
                    <motion.h1 {...fadeUp(0.2)} className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-950 mb-4 tracking-tight">
                        Thank You!
                    </motion.h1>
                    <motion.p {...fadeUp(0.3)} className="text-neutral-600 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                        Your order has been successfully placed. We've sent a confirmation email to{' '}
                        <strong className="text-neutral-950 font-medium border-b border-neutral-950 pb-0.5">{email || 'your email address'}</strong>
                    </motion.p>

                    {/* Order Number Badge */}
                    <motion.div {...fadeUp(0.4)} className="inline-flex items-center gap-4 bg-white px-8 py-4 rounded-md shadow-sm border border-neutral-200 transition-shadow duration-300">
                        <div className="text-left">
                            <p className="text-neutral-400 text-xs font-bold uppercase tracking-wider mb-0.5">Order Number</p>
                            <p className="font-serif font-bold text-xl sm:text-2xl text-neutral-950">{orderId}</p>
                        </div>
                        <div className="h-10 w-px bg-neutral-200 mx-2"></div>
                        <button
                            onClick={copyOrderNumber}
                            className={`p-3 rounded-md transition-all duration-300 ${copied
                                ? 'bg-neutral-100 text-neutral-900'
                                : 'bg-neutral-50 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900'
                                }`}
                            title="Copy order number"
                        >
                            {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Main Content Details Grid */}
            <section className="py-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        
                        {/* Left Column - Order Timeline Track */}
                        <div className="lg:col-span-2 space-y-8">
                            <motion.div {...fadeUp(0.5)} className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
                                <div className="p-5 bg-neutral-50 border-b border-neutral-200">
                                    <h2 className="font-serif font-bold text-lg text-neutral-950 flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-neutral-900" />
                                        Order Status
                                    </h2>
                                </div>
                                <div className="p-6 sm:p-8">
                                    <div className="relative">
                                        {timelineSteps.map((step, index) => (
                                            <div key={index} className="flex gap-6 pb-10 last:pb-0">
                                                {/* Timeline Line element */}
                                                {index < timelineSteps.length - 1 && (
                                                    <div className={`absolute left-6 top-12 w-0.5 h-full -ml-px ${
                                                        step.status === 'completed' ? 'bg-neutral-950' : 'bg-neutral-200'
                                                        }`} />
                                                )}

                                                {/* Step Status Icon */}
                                                <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-sm ${
                                                    step.status === 'completed'
                                                        ? 'bg-neutral-950 text-white'
                                                        : step.status === 'current'
                                                            ? 'bg-neutral-100 text-neutral-900 ring-2 ring-neutral-950'
                                                            : 'bg-neutral-50 text-neutral-300 border border-neutral-200'
                                                    }`}>
                                                    {step.icon}
                                                </div>

                                                {/* Content descriptions */}
                                                <div className="flex-1 pt-2">
                                                    <h3 className={`font-serif font-bold text-base sm:text-lg ${
                                                        step.status === 'pending' ? 'text-neutral-400' : 'text-neutral-950'
                                                        }`}>
                                                        {step.title}
                                                    </h3>
                                                    <p className={`text-sm mt-0.5 font-light ${
                                                        step.status === 'pending' ? 'text-neutral-400/70' : 'text-neutral-600'
                                                        }`}>
                                                        {step.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Main CTA Core Actions */}
                            <motion.div {...fadeUp(0.6)} className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    to="/products"
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 bg-neutral-950 text-white rounded-md font-bold text-sm hover:bg-neutral-800 transition-colors shadow-sm"
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    Continue Shopping
                                </Link>
                                <Link
                                    to="/"
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border border-neutral-200 text-neutral-800 rounded-md font-medium text-sm hover:border-neutral-950 hover:text-neutral-950 transition-colors"
                                >
                                    <Home className="w-4 h-4" />
                                    Back to Home
                                </Link>
                            </motion.div>
                        </div>

                        {/* Right Column - Briefings Panels */}
                        <div className="space-y-6">
                            {/* Order Total Overview Block */}
                            <motion.div {...fadeUp(0.55)} className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
                                <div className="p-5 bg-neutral-50 border-b border-neutral-200">
                                    <h2 className="font-serif font-bold text-lg text-neutral-950">Order Summary</h2>
                                </div>
                                <div className="p-6 sm:p-8">
                                    <div className="text-center py-2">
                                        <p className="text-neutral-400 text-xs font-bold uppercase tracking-wider mb-1">Total Amount</p>
                                        <p className="font-serif text-3xl sm:text-4xl font-bold text-neutral-950">
                                            {formatPrice(totalPrice)}
                                        </p>
                                    </div>

                                    {paymentMethod && (
                                        <div className="mt-6 pt-6 border-t border-neutral-200">
                                            <div className="flex items-center justify-between text-xs sm:text-sm">
                                                <span className="text-neutral-500 font-light">Payment Method</span>
                                                <span className="font-mono font-medium text-neutral-900 uppercase tracking-wider bg-neutral-50 border border-neutral-200 px-3 py-1 rounded">
                                                    {paymentMethod.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            {/* Delivery Despatched Target Address */}
                            {shippingAddress && (
                                <motion.div {...fadeUp(0.65)} className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
                                    <div className="p-5 bg-neutral-50 border-b border-neutral-200">
                                        <h2 className="font-serif font-bold text-lg text-neutral-950 flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-neutral-900" />
                                            Shipping Details
                                        </h2>
                                    </div>
                                    <div className="p-6 font-sans">
                                        <p className="text-neutral-950 font-bold text-base mb-1 font-serif">
                                            {shippingAddress.firstName} {shippingAddress.lastName}
                                        </p>
                                        <p className="text-neutral-600 text-sm font-light">{shippingAddress.address}</p>
                                        <p className="text-neutral-600 text-sm font-light">
                                            {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                                        </p>
                                        <p className="text-neutral-900 text-xs font-mono mt-2 pt-2 border-t border-neutral-100">{shippingAddress.country}</p>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                        
                    </div>
                </div>
            </section>

            <Footer />
        </motion.div>
    )
}

export default OrderSuccess