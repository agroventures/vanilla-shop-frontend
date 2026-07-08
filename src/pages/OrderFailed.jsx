import React, { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
    AlertCircle,
    RefreshCcw,
    ShoppingCart,
    Home,
    Phone,
    Mail,
    CreditCard,
    Shield,
    ArrowLeft,
    Headphones
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import useSEO from '../hooks/useSEO'

const OrderFailed = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const {
        orderId,
        errorCode,
        errorMessage,
        canRetry = true
    } = location.state || {}

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const url = window.location.href

    useSEO({
        title: 'Order Failed - The Vanilla Shop',
        url,
        image_alt: 'Order Failed',
        twitter_card: 'summary_large_image',
    })

    return (
        <div className="min-h-screen bg-vanilla-50 font-sans text-vanilla-800">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-12 bg-vanilla-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border-4 border-vanilla-100">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>

                    <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-vanilla-900 mb-4">
                        Order Failed
                    </h1>
                    <p className="text-vanilla-800/70 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
                        Something went wrong while processing your order. No payment has been charged.
                        Please try again or contact our support team.
                    </p>

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
                                        to="/shop"
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

                            {/* What to do */}
                            <div className="bg-white rounded-3xl border border-vanilla-100 shadow-sm overflow-hidden">
                                <div className="p-6 bg-vanilla-50 border-b border-vanilla-100">
                                    <h2 className="font-serif font-bold text-xl text-vanilla-900">What You Can Do</h2>
                                </div>
                                <div className="p-8">
                                    <ul className="space-y-4">
                                        {[
                                            'Check your internet connection and try again',
                                            'Verify your payment details are correct',
                                            'Try a different payment method',
                                            'Contact our support team if the issue persists',
                                        ].map((suggestion, index) => (
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
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Alternative Payment Methods */}
                            <div className="bg-white rounded-3xl border border-vanilla-100 shadow-sm p-6">
                                <h3 className="font-serif font-bold text-vanilla-900 mb-4 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-gold-500" />
                                    Payment Alternatives
                                </h3>
                                <ul className="space-y-3 text-sm text-vanilla-800/70">
                                    {['Credit/Debit Card', 'Bank Transfer', 'Cash on Delivery'].map((method) => (
                                        <li key={method} className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
                                            {method}
                                        </li>
                                    ))}
                                </ul>
                            </div>

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

export default OrderFailed
