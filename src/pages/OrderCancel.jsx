import React, { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
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

    // Get data from navigation state
    const {
        reason,
        orderId,
        errorCode,
        errorMessage,
        canRetry = true
    } = location.state || {}

    // Scroll to top
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const url = window.location.href;

    useSEO({
        title: "Order Cancelled - The Vanilla Shop",
        description: "The Vanilla Shop is more than a café — it’s Sri Lanka’s first dedicated vanilla boutique.",
        url,
        image_alt: "Order Cancelled",
        twitter_card: "summary_large_image",
    });

    // Common reasons for cancellation
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

    // Get reason details
    const reasonKey = reason || 'default'
    const reasonDetails = cancelReasons[reasonKey] || cancelReasons['default']

    // FAQ items
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
        <div className="min-h-screen bg-vanilla-50 font-sans text-vanilla-800">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-12 bg-vanilla-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    {/* Error Icon */}
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border-4 border-vanilla-100">
                        <div className="text-red-500">
                            {reasonDetails.icon}
                        </div>
                    </div>

                    {/* Error Message */}
                    <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-vanilla-900 mb-4">
                        {reasonDetails.title}
                    </h1>
                    <p className="text-vanilla-800/70 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
                        {reasonDetails.description}
                    </p>

                    {/* Error Code */}
                    {(errorCode || orderId) && (
                        <div className="inline-flex items-center gap-4 bg-white px-6 py-3 rounded-xl shadow-sm border border-vanilla-200 text-sm">
                            {orderId && (
                                <span className="text-vanilla-800/60">
                                    Order: <span className="font-serif font-bold text-vanilla-900">{orderId}</span>
                                </span>
                            )}
                            {errorCode && (
                                <span className="text-vanilla-800/60">
                                    Error: <span className="font-mono font-medium text-red-500">{errorCode}</span>
                                </span>
                            )}
                        </div>
                    )}

                    {/* Error Message Detail */}
                    {errorMessage && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl max-w-xl mx-auto">
                            <p className="text-red-700 text-sm">{errorMessage}</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Suggestions */}
                            <div className="bg-white rounded-3xl border border-vanilla-100 shadow-sm overflow-hidden">
                                <div className="p-6 bg-vanilla-50 border-b border-vanilla-100">
                                    <h2 className="font-serif font-bold text-xl text-vanilla-900 flex items-center gap-2">
                                        <HelpCircle className="w-5 h-5 text-gold-500" />
                                        What You Can Do
                                    </h2>
                                </div>
                                <div className="p-8">
                                    <ul className="space-y-4">
                                        {reasonDetails.suggestions.map((suggestion, index) => (
                                            <li key={index} className="flex items-start gap-4">
                                                <div className="w-6 h-6 bg-vanilla-900 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-white font-bold text-sm">
                                                    {index + 1}
                                                </div>
                                                <span className="text-vanilla-800/80">{suggestion}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="bg-white rounded-3xl border border-vanilla-100 shadow-sm p-8">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {canRetry && (
                                        <Link
                                            to="/checkout"
                                            className="flex items-center justify-center gap-2 px-6 py-4 bg-vanilla-900 text-white rounded-xl font-bold hover:bg-gold-500 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                                        >
                                            <RefreshCcw className="w-5 h-5" />
                                            Try Again
                                        </Link>
                                    )}
                                    <Link
                                        to="/cart"
                                        className="flex items-center justify-center gap-2 px-6 py-4 bg-vanilla-100 text-vanilla-900 rounded-xl font-bold hover:bg-vanilla-200 transition-colors"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                        Return to Cart
                                    </Link>
                                    <Link
                                        to="/products"
                                        className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-vanilla-200 text-vanilla-900 rounded-xl font-bold hover:border-gold-500 hover:text-gold-500 transition-colors"
                                    >
                                        Continue Shopping
                                    </Link>
                                    <Link
                                        to="/"
                                        className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-vanilla-200 text-vanilla-900 rounded-xl font-bold hover:border-gold-500 hover:text-gold-500 transition-colors"
                                    >
                                        <Home className="w-5 h-5" />
                                        Back to Home
                                    </Link>
                                </div>
                            </div>

                            {/* FAQ Section */}
                            <div className="bg-white rounded-3xl border border-vanilla-100 shadow-sm overflow-hidden">
                                <div className="p-6 bg-vanilla-50 border-b border-vanilla-100">
                                    <h2 className="font-serif font-bold text-xl text-vanilla-900 flex items-center gap-2">
                                        <MessageCircle className="w-5 h-5 text-gold-500" />
                                        Frequently Asked Questions
                                    </h2>
                                </div>
                                <div className="divide-y divide-vanilla-100">
                                    {faqItems.map((faq, index) => (
                                        <details key={index} className="group">
                                            <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-vanilla-50 transition-colors">
                                                <span className="font-bold text-vanilla-900 pr-4 font-serif">{faq.question}</span>
                                                <ChevronRight className="w-5 h-5 text-vanilla-400 group-open:rotate-90 transition-transform" />
                                            </summary>
                                            <div className="px-6 pb-6 pt-0">
                                                <p className="text-vanilla-800/70 text-sm leading-relaxed">{faq.answer}</p>
                                            </div>
                                        </details>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Contact Support */}
                            <div className="bg-white rounded-3xl border border-vanilla-100 shadow-sm overflow-hidden">
                                <div className="p-6 bg-vanilla-50 border-b border-vanilla-100">
                                    <h2 className="font-serif font-bold text-xl text-vanilla-900 flex items-center gap-2">
                                        <Headphones className="w-5 h-5 text-gold-500" />
                                        Contact Support
                                    </h2>
                                </div>
                                <div className="p-6 space-y-4">
                                    <p className="text-vanilla-800/70 text-sm">
                                        Need help? Our support team is ready to assist you.
                                    </p>

                                    <a
                                        href="mailto:support@ceylonvanilla.com"
                                        className="flex items-center gap-3 p-4 bg-vanilla-50 rounded-xl hover:bg-vanilla-100 transition-colors border border-vanilla-100"
                                    >
                                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                            <Mail className="w-5 h-5 text-gold-500" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-vanilla-900 text-sm">Email Us</p>
                                            <p className="text-vanilla-800/60 text-xs">support@ceylonvanilla.com</p>
                                        </div>
                                    </a>

                                    <a
                                        href="tel:+94705200900"
                                        className="flex items-center gap-3 p-4 bg-vanilla-50 rounded-xl hover:bg-vanilla-100 transition-colors border border-vanilla-100"
                                    >
                                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                            <Phone className="w-5 h-5 text-gold-500" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-vanilla-900 text-sm">Call Us</p>
                                            <p className="text-vanilla-800/60 text-xs">+94 77 123 4567</p>
                                        </div>
                                    </a>

                                    <div className="pt-4 border-t border-vanilla-100">
                                        <p className="text-vanilla-800/40 text-xs text-center">
                                            Available Monday - Saturday, 9 AM - 6 PM (IST)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Security Notice */}
                            <div className="bg-green-50 rounded-3xl p-6 border border-green-100">
                                <div className="flex items-start gap-3">
                                    <Shield className="w-6 h-6 text-green-600 shrink-0" />
                                    <div>
                                        <h3 className="font-bold text-green-800 mb-1 font-serif">Your Data is Safe</h3>
                                        <p className="text-green-700/80 text-sm leading-relaxed">
                                            No payment was processed and your financial information remains secure.
                                            We use industry-standard encryption to protect all transactions.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Alternative Payment Methods */}
                            <div className="bg-white rounded-3xl border border-vanilla-100 shadow-sm p-6">
                                <h3 className="font-serif font-bold text-vanilla-900 mb-4 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-gold-500" />
                                    Alternatives
                                </h3>
                                <p className="text-vanilla-800/70 text-sm mb-4">
                                    Having trouble? Try one of these alternatives:
                                </p>
                                <ul className="space-y-3 text-sm text-vanilla-800/70">
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
                                        Credit/Debit Card
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
                                        Bank Transfer
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
                                        Cash on Delivery
                                    </li>
                                </ul>
                            </div>

                            {/* Back Link */}
                            <button
                                onClick={() => navigate(-1)}
                                className="w-full flex items-center justify-center gap-2 p-4 text-vanilla-800/60 hover:text-vanilla-900 font-bold transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default OrderCancel