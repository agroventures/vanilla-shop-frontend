// src/pages/Refund.jsx
import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
    Truck,
    ChevronRight,
    Home,
    Package,
    Clock,
    MapPin,
    RefreshCcw,
    CreditCard,
    AlertTriangle,
    Globe,
    FileText,
    Calendar,
    ArrowUp,
    CheckCircle,
    XCircle,
    Info,
    Download,
    DollarSign,
    ShieldCheck,
    Timer,
    Boxes,
    RotateCcw,
    Ban,
    MessageCircle
} from 'lucide-react'
import { lastUpdated, shippingAndRefund } from '../data/shippingAndRefund'
import Footer from '../components/Footer'
import RelatedPolicies from '../components/RelatedPolicies'
import Navbar from '../components/Navbar'
import QuickHelp from '../components/QuickHelp'
import useSEO from '../hooks/useSEO'

const Refund = () => {
    const [activeSection, setActiveSection] = useState(null)
    const [showScrollTop, setShowScrollTop] = useState(false)
    const [isVisible, setIsVisible] = useState({})
    const sectionRefs = useRef({})

    const url = window.location.href;

    useSEO({
        title: "Refund Policy - The Vanilla Shop",
        url,
        image_alt: "Refund Policy",
        twitter_card: "summary_large_image",
    });

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    // Check scroll position for scroll-to-top button and active section
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 500)

            // Find active section based on scroll position
            const scrollPosition = window.scrollY + 150

            Object.entries(sectionRefs.current).forEach(([id, ref]) => {
                if (ref) {
                    const top = ref.offsetTop
                    const bottom = top + ref.offsetHeight

                    if (scrollPosition >= top && scrollPosition < bottom) {
                        setActiveSection(id)
                    }
                }
            })
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Intersection observer for animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible((prev) => ({
                            ...prev,
                            [entry.target.id]: true
                        }))
                    }
                })
            },
            { threshold: 0.1 }
        )

        Object.values(sectionRefs.current).forEach((ref) => {
            if (ref) observer.observe(ref)
        })

        return () => observer.disconnect()
    }, [shippingAndRefund])

    // Scroll to top
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // Scroll to section
    const scrollToSection = (id) => {
        const element = sectionRefs.current[id]
        if (element) {
            const offset = 120
            const elementPosition = element.getBoundingClientRect().top
            const offsetPosition = elementPosition + window.pageYOffset - offset

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            })
        }
    }

    // Get icon for section
    const getSectionIcon = (title) => {
        const titleLower = title.toLowerCase()
        if (titleLower.includes('shipping') || titleLower.includes('delivery')) return <Truck className="w-5 h-5" />
        if (titleLower.includes('processing') || titleLower.includes('time')) return <Clock className="w-5 h-5" />
        if (titleLower.includes('cost') || titleLower.includes('fee') || titleLower.includes('charge')) return <DollarSign className="w-5 h-5" />
        if (titleLower.includes('international') || titleLower.includes('global')) return <Globe className="w-5 h-5" />
        if (titleLower.includes('return') || titleLower.includes('refund')) return <RefreshCcw className="w-5 h-5" />
        if (titleLower.includes('eligib') || titleLower.includes('condition')) return <CheckCircle className="w-5 h-5" />
        if (titleLower.includes('non-refund') || titleLower.includes('exception')) return <Ban className="w-5 h-5" />
        if (titleLower.includes('exchange')) return <RotateCcw className="w-5 h-5" />
        if (titleLower.includes('damage') || titleLower.includes('defect')) return <AlertTriangle className="w-5 h-5" />
        if (titleLower.includes('cancel')) return <XCircle className="w-5 h-5" />
        if (titleLower.includes('payment') || titleLower.includes('reimburse')) return <CreditCard className="w-5 h-5" />
        if (titleLower.includes('contact') || titleLower.includes('support')) return <MessageCircle className="w-5 h-5" />
        if (titleLower.includes('track')) return <MapPin className="w-5 h-5" />
        if (titleLower.includes('package') || titleLower.includes('packaging')) return <Package className="w-5 h-5" />
        return <FileText className="w-5 h-5" />
    }

    // Get section color
    const getSectionColor = (title) => {
        const titleLower = title.toLowerCase()
        if (titleLower.includes('return') || titleLower.includes('refund') || titleLower.includes('exchange')) {
            return 'bg-blue-500'
        }
        if (titleLower.includes('non-refund') || titleLower.includes('exception') || titleLower.includes('cancel')) {
            return 'bg-red-500'
        }
        if (titleLower.includes('damage') || titleLower.includes('defect')) {
            return 'bg-amber-500'
        }
        return 'bg-gold-500'
    }


    // Quick stats
    const quickStats = [
        { icon: <Clock className="w-5 h-5" />, label: 'Processing Time', value: '1-3 Days' },
        { icon: <Truck className="w-5 h-5" />, label: 'Local Delivery', value: '3-5 Days' },
        { icon: <RefreshCcw className="w-5 h-5" />, label: 'Return Window', value: '14 Days' },
        { icon: <CreditCard className="w-5 h-5" />, label: 'Refund Process', value: '5-10 Days' },
    ]

    return (
        <div className="pt-24 min-h-screen bg-vanilla-50">
            <Navbar />

            <section className="relative bg-vanilla-900 text-white py-16 lg:py-20 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                            backgroundSize: '40px 40px'
                        }}
                    />
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-vanilla-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-sm mb-8">
                        <Link to="/" className="text-white/60 hover:text-gold-500 transition-colors flex items-center gap-1">
                            <Home className="w-4 h-4" />
                            <span>Home</span>
                        </Link>
                        <ChevronRight className="w-4 h-4 text-white/30" />
                        <span className="text-gold-500">Shipping & Refunds</span>
                    </nav>

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                                <Truck className="w-4 h-4 text-gold-500" />
                                <span className="text-vanilla-100 text-sm font-medium tracking-wide uppercase">
                                    Shipping & Returns
                                </span>
                            </div>

                            <h1 className="font-serif text-4xl sm:text-5xl font-semibold leading-tight mb-4">
                                Shipping & Refund
                                <span className="text-gold-500 italic"> Policy</span>
                            </h1>

                            <p className="text-white/70 text-lg max-w-2xl">
                                Everything you need to know about shipping, delivery times, returns,
                                and refunds for your orders.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <a
                                href="/shipping-refund-policy.pdf"
                                download
                                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gold-500 text-white rounded-xl font-medium hover:bg-gold-600 transition-colors print:hidden shadow-lg shadow-gold-500/20"
                            >
                                <Download className="w-4 h-4" />
                                Download PDF
                            </a>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {quickStats.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="text-gold-500">
                                        {stat.icon}
                                    </div>
                                    <span className="text-white/60 text-sm">{stat.label}</span>
                                </div>
                                <p className="text-white font-semibold text-lg">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Last Updated */}
                    <div className="mt-6 flex flex-wrap items-center gap-6 text-sm">
                        <div className="flex items-center gap-2 text-white/60">
                            <Calendar className="w-4 h-4" />
                            <span>Last Updated: {lastUpdated}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/60">
                            <FileText className="w-4 h-4" />
                            <span>{shippingAndRefund.length} Sections</span>
                        </div>
                    </div>
                </div>
            </section>


            <section className="py-12 lg:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                        <aside className="lg:w-72 shrink-0 print:hidden">
                            <div className="lg:sticky lg:top-44">
                                <div className="bg-white rounded-2xl border border-vanilla-100 shadow-sm overflow-hidden">
                                    <div className="p-4 bg-vanilla-50 border-b border-vanilla-100">
                                        <h3 className="font-semibold text-vanilla-900 flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-gold-500" />
                                            Table of Contents
                                        </h3>
                                    </div>
                                    <nav className="p-2 max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-vanilla-200">
                                        {shippingAndRefund.map((section) => (
                                            <button
                                                key={section.id}
                                                onClick={() => scrollToSection(`section-${section.id}`)}
                                                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center gap-3 ${activeSection === `section-${section.id}`
                                                        ? 'bg-vanilla-100 text-vanilla-900 font-medium'
                                                        : 'text-vanilla-800/70 hover:bg-vanilla-50 hover:text-vanilla-900'
                                                    }`}
                                            >
                                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${activeSection === `section-${section.id}`
                                                        ? 'bg-gold-500 text-white'
                                                        : 'bg-vanilla-100 text-vanilla-800/60'
                                                    }`}>
                                                    {section.id}
                                                </span>
                                                <span className="line-clamp-1">{section.title}</span>
                                            </button>
                                        ))}
                                    </nav>
                                </div>

                                {/* Shipping Calculator CTA */}
                                <div className="mt-6 bg-gold-500 rounded-2xl p-5 text-white shadow-lg">
                                    <Boxes className="w-8 h-8 mb-3 text-white" />
                                    <h4 className="font-semibold mb-2 text-white">Need Shipping Estimate?</h4>
                                    <p className="text-vanilla-100 text-sm mb-4">
                                        Calculate shipping costs before you order.
                                    </p>
                                    <Link
                                        to="/products"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-vanilla-900 text-white rounded-lg text-sm font-medium hover:bg-vanilla-800 transition-colors shadow-sm"
                                    >
                                        Shop Now
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </aside>

                        <div className="flex-1 min-w-0">
                            {/* Introduction Card */}
                            <div className="bg-white rounded-2xl p-6 lg:p-8 mb-8 border border-vanilla-100 shadow-sm">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-vanilla-100 rounded-xl flex items-center justify-center shrink-0">
                                        <Info className="w-6 h-6 text-gold-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-vanilla-900 mb-2 font-serif">
                                            About This Policy
                                        </h2>
                                        <p className="text-vanilla-800/70 leading-relaxed font-sans">
                                            This Shipping & Refund Policy applies to all purchases made through
                                            The Vanilla Shop website at{' '}
                                            <Link to="/" className="text-gold-500 font-semibold hover:text-gold-600 transition-colors">
                                                https://thevanillashop.lk/
                                            </Link>.
                                            The Vanilla Shop is operated by <strong>Agro Ventures Exports (Pvt) Ltd</strong>,
                                            located at <strong>No. 48, Sir Marcus Fernando Mawatha, Colombo 07, Sri Lanka</strong>.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Key Highlights */}
                            <div className="grid sm:grid-cols-2 gap-4 mb-8">
                                <div className="bg-white rounded-xl p-5 border border-vanilla-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                            <Truck className="w-5 h-5 text-green-600" />
                                        </div>
                                        <h3 className="font-semibold text-vanilla-900">Free Shipping</h3>
                                    </div>
                                    <p className="text-vanilla-800/60 text-sm">
                                        Enjoy free shipping on all orders over LKR 5,000 within Sri Lanka.
                                    </p>
                                </div>
                                <div className="bg-white rounded-xl p-5 border border-vanilla-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <RefreshCcw className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <h3 className="font-semibold text-vanilla-900">Easy Returns</h3>
                                    </div>
                                    <p className="text-vanilla-800/60 text-sm">
                                        14-day return policy for unopened products in original packaging.
                                    </p>
                                </div>
                                <div className="bg-white rounded-xl p-5 border border-vanilla-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                            <ShieldCheck className="w-5 h-5 text-amber-600" />
                                        </div>
                                        <h3 className="font-semibold text-vanilla-900">Quality Guarantee</h3>
                                    </div>
                                    <p className="text-vanilla-800/60 text-sm">
                                        Immediate replacement for damaged or defective products.
                                    </p>
                                </div>
                                <div className="bg-white rounded-xl p-5 border border-vanilla-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <Timer className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <h3 className="font-semibold text-vanilla-900">Fast Processing</h3>
                                    </div>
                                    <p className="text-vanilla-800/60 text-sm">
                                        Orders processed within 1-3 business days of confirmation.
                                    </p>
                                </div>
                            </div>

                            {/* Policy Sections */}
                            <div className="space-y-6">
                                {shippingAndRefund.map((section, index) => (
                                    <div
                                        key={section.id}
                                        id={`section-${section.id}`}
                                        ref={(el) => (sectionRefs.current[`section-${section.id}`] = el)}
                                        className={`bg-white rounded-2xl border border-vanilla-100 shadow-sm overflow-hidden transition-all duration-700 ${isVisible[`section-${section.id}`]
                                                ? 'opacity-100 translate-y-0'
                                                : 'opacity-0 translate-y-4'
                                            }`}
                                        style={{ transitionDelay: `${index * 50}ms` }}
                                    >
                                        {/* Section Header */}
                                        <div className="flex items-center gap-4 p-5 lg:p-6 border-b border-vanilla-100 bg-vanilla-50/50">
                                            <div className={`w-10 h-10 ${getSectionColor(section.title)} rounded-xl flex items-center justify-center text-white shrink-0 shadow-md`}>
                                                {getSectionIcon(section.title)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gold-500 text-sm font-bold uppercase tracking-wider">
                                                        Section {section.id}
                                                    </span>
                                                </div>
                                                <h2 className="text-lg lg:text-xl font-semibold text-vanilla-900 font-serif mt-1">
                                                    {section.title}
                                                </h2>
                                            </div>
                                        </div>

                                        {/* Section Content */}
                                        <div className="p-5 lg:p-6">
                                            <div className="prose prose-vanilla max-w-none text-vanilla-800/70 leading-relaxed font-sans">
                                                {/* Render description - handle both string and JSX */}
                                                {typeof section.description === 'string' ? (
                                                    <p>{section.description}</p>
                                                ) : (
                                                    <div className="shipping-content">
                                                        {section.description}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Important Notice */}
                            <div className="mt-8 bg-amber-50 rounded-2xl p-6 lg:p-8 border border-amber-200">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
                                        <AlertTriangle className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-amber-900 mb-2 font-serif">
                                            Important Notice
                                        </h3>
                                        <p className="text-amber-800/80 leading-relaxed font-sans">
                                            Please inspect your package upon delivery. If you notice any damage
                                            to the packaging, please note it on the delivery receipt and contact
                                            us immediately with photos of the damage. This helps us process your
                                            claim faster.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <QuickHelp question="Questions About Your Order?" description=" Our customer support team is here to help with any questions about shipping, returns, or refunds. We typically respond within 24 hours." />

            <RelatedPolicies />

            <Footer />

            {/* Scroll to Top Button */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-6 right-6 w-12 h-12 bg-vanilla-900 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gold-500 transition-all duration-300 z-40 print:hidden ${showScrollTop
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4 pointer-events-none'
                    }`}
                aria-label="Scroll to top"
            >
                <ArrowUp className="w-5 h-5" />
            </button>

        </div>
    )
}

export default Refund