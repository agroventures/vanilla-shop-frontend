import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import {
    XCircle,
    AlertTriangle,
    RefreshCcw,
    ShoppingCart,
    Home,
    Phone,
    Mail,
    MessageCircle,
    CreditCard,
    Shield,
    HelpCircle,
    ArrowLeft,
    Clock,
    ChevronRight,
    AlertCircle,
    FileQuestion,
    Headphones
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import useSEO from '../hooks/useSEO'

const OrderCancel = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    // 1. Read internal router state or fall back to URL queries (Robust PayHere Integration)
    const stateData = location.state || {}
    const reason = stateData.reason || (searchParams.get('payment_failed') ? 'payment_failed' : 'default')
    const orderId = stateData.orderId || searchParams.get('order_id')
    const errorCode = stateData.errorCode || searchParams.get('status_code')
    const errorMessage = stateData.errorMessage
    const canRetry = stateData.canRetry ?? true

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const url = window.location.href;

    useSEO({
        title: "Order Cancelled - The Vanilla Shop",
        url,
        image_alt: "Order Cancelled",
        twitter_card: "summary_large_image",
    });

    // Monochrome layout reason mapping
    const cancelReasons = {
        'payment_failed': {
            title: 'Payment Failed',
            description: 'Your payment could not be processed. This might be due to insufficient funds, incorrect card details, or a temporary issue with your bank.',
            icon: <CreditCard className="w-8 h-8" />,
            suggestions: [
                'Check your card details and try again',
                'Ensure you have sufficient funds',
                'Try a different payment method',
                'Contact your bank if the issue persists'
            ]
        },
        'payment_cancelled': {
            title: 'Payment Cancelled',
            description: 'You cancelled the payment process. Your cart items are still saved and you can complete your purchase anytime.',
            icon: <XCircle className="w-8 h-8" />,
            suggestions: [
                'Return to checkout to complete your order',
                'Your cart items are still saved',
                'Try a different payment method if needed'
            ]
        },
        'session_expired': {
            title: 'Session Expired',
            description: 'Your checkout session has expired due to inactivity. Please start the checkout process again.',
            icon: <Clock className="w-8 h-8" />,
            suggestions: [
                'Return to cart and try again',
                'Complete checkout within 30 minutes',
                'Ensure a stable internet connection'
            ]
        },
        'order_cancelled': {
            title: 'Order Cancelled',
            description: 'Your order has been cancelled. If you did not request this cancellation, please contact our support team.',
            icon: <AlertTriangle className="w-8 h-8" />,
            suggestions: [
                'Contact support if this was unexpected',
                'Place a new order if needed',
                'Check your email for details'
            ]
        },
        'technical_error': {
            title: 'Technical Error',
            description: 'We encountered a technical issue while processing your order. Our team has been notified and is working on it.',
            icon: <AlertCircle className="w-8 h-8" />,
            suggestions: [
                'Try again in a few minutes',
                'Clear your browser cache',
                'Try a different browser',
                'Contact support if the issue persists'
            ]
        },
        'default': {
            title: 'Order Not Completed',
            description: 'Your order could not be completed. Please try again or contact our support team for assistance.',
            icon: <FileQuestion className="w-8 h-8" />,
            suggestions: [
                'Return to cart and try again',
                'Contact our support team',
                'Check your payment method'
            ]
        }
    }

    const reasonKey = reason || 'default'
    const reasonDetails = cancelReasons[reasonKey] || cancelReasons['default']

    const faqItems = [
        {
            question: 'Why was my payment declined?',
            answer: 'Payments can be declined for various reasons including insufficient funds, incorrect card details, expired cards, or security blocks by your bank. Try a different payment method or contact your bank.'
        },
        {
            question: 'Will I be charged if my order failed?',
            answer: 'No, if your order failed, you will not be charged. Any pending authorization on your card will be automatically released within 3-5 business days.'
        },
        {
            question: 'Are my cart items still saved?',
            answer: 'Yes, your cart items are saved in your browser. You can return to checkout anytime to complete your purchase.'
        },
        {
            question: 'How can I contact support?',
            answer: 'You can reach our support team via email at support@ceylonvanilla.com or call us at +94 77 123 4567. We are available Monday to Saturday, 9 AM to 6 PM.'
        }
    ]

    return (
        <div className="min-h-screen bg-neutral-50 font-sans text-neutral-800 antialiased leading-relaxed scroll-smooth">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-12 bg-neutral-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    {/* Monochrome Minimalist Icon */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-neutral-200"
                    >
                        <div className="text-neutral-900">
                            {reasonDetails.icon}
                        </div>
                    </motion.div>

                    {/* Title & Desc */}
                    <motion.h1
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-950 mb-4 tracking-tight"
                    >
                        {reasonDetails.title}
                    </motion.h1>
                    
                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="text-neutral-600 text-base sm:text-lg max-w-2xl mx-auto mb-8 font-light"
                    >
                        {reasonDetails.description}
                    </motion.p>

                    {/* Metadata Badges */}
                    {(errorCode || orderId) && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.4 }}
                            className="inline-flex flex-wrap justify-center items-center gap-x-6 gap-y-2 bg-white px-6 py-3 rounded-md shadow-sm border border-neutral-200 text-xs sm:text-sm"
                        >
                            {orderId && (
                                <span className="text-neutral-500">
                                    Order: <span className="font-serif font-bold text-neutral-900">{orderId}</span>
                                </span>
                            )}
                            {errorCode && (
                                <span className="text-neutral-500">
                                    Error Reference: <span className="font-mono font-medium text-neutral-900">#{errorCode}</span>
                                </span>
                            )}
                        </motion.div>
                    )}

                    {/* Error Message Detail (Transformed to elegant inline banner) */}
                    {errorMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.4 }}
                            className="mt-6 p-4 bg-neutral-100 border border-neutral-200 rounded-md max-w-xl mx-auto"
                        >
                            <p className="text-neutral-700 text-xs sm:text-sm font-mono">{errorMessage}</p>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Main Layout Context */}
            <section className="py-8 pb-24">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        
                        {/* Left Column: Resolution paths */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="lg:col-span-2 space-y-8"
                        >
                            {/* Recommendations Matrix */}
                            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
                                <div className="p-5 bg-neutral-50 border-b border-neutral-200">
                                    <h2 className="font-serif font-bold text-lg text-neutral-950 flex items-center gap-2">
                                        <HelpCircle className="w-4 h-4 text-neutral-900" />
                                        Recommended Next Steps
                                    </h2>
                                </div>
                                <div className="p-6 sm:p-8">
                                    <ul className="space-y-4">
                                        {reasonDetails.suggestions.map((suggestion, index) => (
                                            <li key={`suggestion-${reasonKey}-${index}`} className="flex items-start gap-4">
                                                <div className="w-5 h-5 bg-neutral-950 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-white font-mono text-xs">
                                                    {index + 1}
                                                </div>
                                                <span className="text-neutral-600 text-sm sm:text-base font-light">{suggestion}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Clean Responsive Action Wrappers */}
                            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 sm:p-8">
                                <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3">
                                    {canRetry && (
                                        <Link
                                            to="/checkout"
                                            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-neutral-950 text-white rounded-md font-bold text-sm hover:bg-neutral-800 transition-colors duration-200 shadow-sm"
                                        >
                                            <RefreshCcw className="w-4 h-4" />
                                            Retry Checkout
                                        </Link>
                                    )}
                                    <Link
                                        to="/cart"
                                        className="flex items-center justify-center gap-2 px-6 py-3.5 bg-neutral-100 text-neutral-900 rounded-md font-bold text-sm hover:bg-neutral-200 transition-colors"
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        Modify Items
                                    </Link>
                                    <Link
                                        to="/products"
                                        className="flex items-center justify-center gap-2 px-6 py-3.5 border border-neutral-200 text-neutral-800 rounded-md font-medium text-sm hover:border-neutral-950 hover:text-neutral-950 transition-colors"
                                    >
                                        Browse Products
                                    </Link>
                                    <Link
                                        to="/"
                                        className="flex items-center justify-center gap-2 px-6 py-3.5 border border-neutral-200 text-neutral-800 rounded-md font-medium text-sm hover:border-neutral-950 hover:text-neutral-950 transition-colors"
                                    >
                                        <Home className="w-4 h-4" />
                                        Storefront Home
                                    </Link>
                                </div>
                            </div>

                            {/* Minimal Accordion Drawer (FAQs) */}
                            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
                                <div className="p-5 bg-neutral-50 border-b border-neutral-200">
                                    <h2 className="font-serif font-bold text-lg text-neutral-950 flex items-center gap-2">
                                        <MessageCircle className="w-4 h-4 text-neutral-900" />
                                        Frequently Asked Questions
                                    </h2>
                                </div>
                                <div className="divide-y divide-neutral-200">
                                    {faqItems.map((faq, index) => (
                                        <details key={`faq-${index}`} className="group">
                                            <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-neutral-50 transition-colors list-none [&::-webkit-details-marker]:hidden">
                                                <span className="font-bold text-neutral-900 pr-4 font-serif text-sm sm:text-base">{faq.question}</span>
                                                <ChevronRight className="w-4 h-4 text-neutral-400 group-open:rotate-90 transition-transform duration-200" />
                                            </summary>
                                            <div className="px-5 pb-5 pt-0">
                                                <p className="text-neutral-600 text-sm leading-relaxed font-light">{faq.answer}</p>
                                            </div>
                                        </details>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Column: Information panels */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="space-y-6"
                        >
                            {/* Concierge Support Desk */}
                            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
                                <div className="p-5 bg-neutral-50 border-b border-neutral-200">
                                    <h2 className="font-serif font-bold text-lg text-neutral-950 flex items-center gap-2">
                                        <Headphones className="w-4 h-4 text-neutral-900" />
                                        Customer Care Desk
                                    </h2>
                                </div>
                                <div className="p-6 space-y-4">
                                    <p className="text-neutral-600 text-sm font-light">
                                        Have questions regarding authorization hold-ups or custom accounts? Get in touch with us.
                                    </p>

                                    <a
                                        href="mailto:support@ceylonvanilla.com"
                                        className="flex items-center gap-3 p-4 bg-neutral-50 rounded-md hover:bg-neutral-100 transition-colors border border-neutral-200"
                                    >
                                        <div className="w-8 h-8 bg-white border border-neutral-200 rounded flex items-center justify-center shadow-sm shrink-0">
                                            <Mail className="w-4 h-4 text-neutral-900" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-neutral-950 text-xs tracking-wide uppercase">Email Inquiries</p>
                                            <p className="text-neutral-600 text-xs truncate">support@ceylonvanilla.com</p>
                                        </div>
                                    </a>

                                    <a
                                        href="tel:+94771234567"
                                        className="flex items-center gap-3 p-4 bg-neutral-50 rounded-md hover:bg-neutral-100 transition-colors border border-neutral-200"
                                    >
                                        <div className="w-8 h-8 bg-white border border-neutral-200 rounded flex items-center justify-center shadow-sm shrink-0">
                                            <Phone className="w-4 h-4 text-neutral-900" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-neutral-950 text-xs tracking-wide uppercase">Direct Line</p>
                                            <p className="text-neutral-600 text-xs">+94 77 123 4567</p>
                                        </div>
                                    </a>

                                    <div className="pt-2">
                                        <p className="text-neutral-400 text-[11px] font-mono text-center">
                                            Mon - Sat, 9:00 AM - 6:00 PM (IST)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Safe Transaction Guarantee */}
                            <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <Shield className="w-5 h-5 text-neutral-950 shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-bold text-neutral-950 mb-1 font-serif text-sm">Secure Architecture</h3>
                                        <p className="text-neutral-600 text-xs leading-relaxed font-light">
                                            No funds were extracted. Your session transactions remain completely anonymous and isolated under industry-grade encryption parameters.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Settlement Framework Modalities */}
                            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
                                <h3 className="font-serif font-bold text-neutral-950 text-sm mb-3 flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-neutral-900" />
                                    Supported Gateways
                                </h3>
                                <p className="text-neutral-600 text-xs mb-4 font-light">
                                    You can switch to a separate clearance instrument at your convenience:
                                </p>
                                <ul className="grid grid-cols-2 gap-2 text-xs font-mono text-neutral-700">
                                    <li className="flex items-center gap-1.5 py-1 px-2 bg-neutral-50 border border-neutral-100 rounded">
                                        <div className="w-1 h-1 bg-neutral-900 rounded-full" />
                                        Visa / Master
                                    </li>
                                    <li className="flex items-center gap-1.5 py-1 px-2 bg-neutral-50 border border-neutral-100 rounded">
                                        <div className="w-1 h-1 bg-neutral-900 rounded-full" />
                                        Bank Transfer
                                    </li>
                                    <li className="flex items-center gap-1.5 py-1 px-2 bg-neutral-50 border border-neutral-100 rounded">
                                        <div className="w-1 h-1 bg-neutral-900 rounded-full" />
                                        Amex Portal
                                    </li>
                                    <li className="flex items-center gap-1.5 py-1 px-2 bg-neutral-50 border border-neutral-100 rounded">
                                        <div className="w-1 h-1 bg-neutral-900 rounded-full" />
                                        COD Delivery
                                    </li>
                                </ul>
                            </div>

                            {/* History Back Nav Trigger */}
                            <button
                                onClick={() => navigate(-1)}
                                className="w-full flex items-center justify-center gap-2 p-3 text-neutral-400 hover:text-neutral-950 font-bold text-sm transition-colors"
                            >
                                <ArrowLeft className="w-3 h-3" />
                                Go Back One Page
                            </button>
                        </motion.div>
                        
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default OrderCancel