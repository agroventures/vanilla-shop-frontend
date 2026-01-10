// src/pages/Terms.jsx
import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
    ChevronRight,
    Home,
    FileText,
    Calendar,
    ArrowUp,
    CheckCircle,
    XCircle,
    Info,
    AlertTriangle,
    Globe,
    Shield,
    Scale,
    Users,
    Lock,
    CreditCard,
    Package,
    MessageCircle,
    Gavel,
    UserCheck,
    Ban,
    Edit,
    Download,
    Clock,
    Building,
    Copyright,
    Link as LinkIcon,
    ShoppingBag,
    Eye
} from 'lucide-react'
import { termsAndConditions, lastUpdated } from '../data/termsAndConditions'
import Footer from '../components/Footer'
import RelatedPolicies from '../components/RelatedPolicies'
import Navbar from '../components/Navbar'
import QuickHelp from '../components/QuickHelp'
import useSEO from '../hooks/useSEO'

const Terms = () => {
    const [activeSection, setActiveSection] = useState(null)
    const [showScrollTop, setShowScrollTop] = useState(false)
    const [isVisible, setIsVisible] = useState({})
    const sectionRefs = useRef({})

    const url = window.location.href;

    useSEO({
        title: "Terms and Conditions - The Vanilla Shop",
        url,
        image_alt: "Terms and Conditions",
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
    }, [termsAndConditions])

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
        if (titleLower.includes('acceptance') || titleLower.includes('agreement')) return <CheckCircle className="w-5 h-5" />
        if (titleLower.includes('eligib') || titleLower.includes('user')) return <UserCheck className="w-5 h-5" />
        if (titleLower.includes('account')) return <Users className="w-5 h-5" />
        if (titleLower.includes('product') || titleLower.includes('order')) return <Package className="w-5 h-5" />
        if (titleLower.includes('price') || titleLower.includes('payment')) return <CreditCard className="w-5 h-5" />
        if (titleLower.includes('intellectual') || titleLower.includes('property') || titleLower.includes('copyright')) return <Copyright className="w-5 h-5" />
        if (titleLower.includes('privacy') || titleLower.includes('data')) return <Lock className="w-5 h-5" />
        if (titleLower.includes('prohibit') || titleLower.includes('restrict')) return <Ban className="w-5 h-5" />
        if (titleLower.includes('liability') || titleLower.includes('disclaimer')) return <Shield className="w-5 h-5" />
        if (titleLower.includes('indemnif')) return <Scale className="w-5 h-5" />
        if (titleLower.includes('terminat')) return <XCircle className="w-5 h-5" />
        if (titleLower.includes('governing') || titleLower.includes('law') || titleLower.includes('jurisdiction')) return <Gavel className="w-5 h-5" />
        if (titleLower.includes('change') || titleLower.includes('modif') || titleLower.includes('amend')) return <Edit className="w-5 h-5" />
        if (titleLower.includes('contact')) return <MessageCircle className="w-5 h-5" />
        if (titleLower.includes('link')) return <LinkIcon className="w-5 h-5" />
        if (titleLower.includes('use')) return <Eye className="w-5 h-5" />
        if (titleLower.includes('purchase') || titleLower.includes('shop')) return <ShoppingBag className="w-5 h-5" />
        return <FileText className="w-5 h-5" />
    }

    // Get section color
    const getSectionColor = (title) => {
        const titleLower = title.toLowerCase()
        if (titleLower.includes('prohibit') || titleLower.includes('restrict') || titleLower.includes('terminat')) {
            return 'bg-red-500'
        }
        if (titleLower.includes('liability') || titleLower.includes('disclaimer') || titleLower.includes('indemnif')) {
            return 'bg-amber-500'
        }
        if (titleLower.includes('privacy') || titleLower.includes('security') || titleLower.includes('data')) {
            return 'bg-blue-500'
        }
        if (titleLower.includes('law') || titleLower.includes('govern') || titleLower.includes('jurisdiction')) {
            return 'bg-purple-500'
        }
        if (titleLower.includes('intellectual') || titleLower.includes('copyright')) {
            return 'bg-indigo-500'
        }
        return 'bg-gold-500'
    }

    // Quick stats
    const quickStats = [
        { icon: <Calendar className="w-5 h-5" />, label: 'Effective Date', value: lastUpdated || 'Jan 2025' },
        { icon: <FileText className="w-5 h-5" />, label: 'Total Sections', value: `${termsAndConditions.length}` },
        { icon: <Globe className="w-5 h-5" />, label: 'Jurisdiction', value: 'Sri Lanka' },
        { icon: <Shield className="w-5 h-5" />, label: 'Legal Protection', value: 'Full Coverage' },
    ]

    return (
        <div className="pt-24 min-h-screen bg-vanilla-50">
            <Navbar />

            {/* Hero Section */}
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
                        <span className="text-gold-500">Terms & Conditions</span>
                    </nav>

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                                <Scale className="w-4 h-4 text-gold-500" />
                                <span className="text-vanilla-100 text-sm font-medium tracking-wide uppercase">
                                    Legal Agreement
                                </span>
                            </div>

                            <h1 className="font-serif text-4xl sm:text-5xl font-semibold leading-tight mb-4 text-white">
                                Terms &
                                <span className="text-gold-500 italic"> Conditions</span>
                            </h1>

                            <p className="text-white/70 text-lg max-w-2xl">
                                Please read these terms carefully before using our website
                                or making a purchase. By accessing our services, you agree to be bound by these terms.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <a
                                href="/terms-and-conditions.pdf"
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
                            <Clock className="w-4 h-4" />
                            <span>Last Updated: {lastUpdated || 'January 2025'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/60">
                            <Building className="w-4 h-4" />
                            <span>Agro Ventures Exports (Pvt) Ltd</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12 lg:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                        {/* Sidebar - Table of Contents */}
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
                                        {termsAndConditions.map((section) => (
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

                                {/* Related Policies CTA */}
                                <div className="mt-6 bg-gold-500 rounded-2xl p-5 text-white shadow-lg">
                                    <Scale className="w-8 h-8 mb-3 text-white" />
                                    <h4 className="font-semibold mb-2 text-white">Related Policies</h4>
                                    <p className="text-vanilla-100 text-sm mb-4">
                                        View our other policies for complete information.
                                    </p>
                                    <Link
                                        to="/privacy-policy"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-vanilla-900 text-white rounded-lg text-sm font-medium hover:bg-vanilla-800 transition-colors shadow-sm"
                                    >
                                        Privacy Policy
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </aside>

                        {/* Content Area */}
                        <div className="flex-1 min-w-0">
                            {/* Introduction Card */}
                            <div className="bg-white rounded-2xl p-6 lg:p-8 mb-8 border border-vanilla-100 shadow-sm">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-vanilla-100 rounded-xl flex items-center justify-center shrink-0">
                                        <Info className="w-6 h-6 text-gold-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-vanilla-900 mb-2 font-serif">
                                            Welcome to The Vanilla Shop
                                        </h2>
                                        <p className="text-vanilla-800/70 leading-relaxed font-sans">
                                            These Terms and Conditions govern your use of{' '}
                                            <Link to="/" className="text-gold-500 font-semibold hover:text-gold-600 transition-colors">
                                                https://thevanillashop.lk/
                                            </Link>{' '}
                                            and your purchase of products from us. By accessing the Website or placing an order,
                                            you agree to these Terms. The Vanilla Shop is operated by{' '}
                                            <strong>Agro Ventures Exports (Pvt) Ltd</strong>, located at{' '}
                                            <strong>No. 48, Sir Marcus Fernando Mawatha, Colombo 07, Sri Lanka</strong>.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Key Points */}
                            <div className="grid sm:grid-cols-2 gap-4 mb-8">
                                <div className="bg-white rounded-xl p-5 border border-vanilla-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                        </div>
                                        <h3 className="font-semibold text-vanilla-900">Binding Agreement</h3>
                                    </div>
                                    <p className="text-vanilla-800/60 text-sm">
                                        By using our website, you agree to comply with and be bound by these terms.
                                    </p>
                                </div>
                                <div className="bg-white rounded-xl p-5 border border-vanilla-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <Lock className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <h3 className="font-semibold text-vanilla-900">Privacy Protected</h3>
                                    </div>
                                    <p className="text-vanilla-800/60 text-sm">
                                        Your personal data is handled according to our Privacy Policy.
                                    </p>
                                </div>
                                <div className="bg-white rounded-xl p-5 border border-vanilla-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                            <Shield className="w-5 h-5 text-amber-600" />
                                        </div>
                                        <h3 className="font-semibold text-vanilla-900">Secure Transactions</h3>
                                    </div>
                                    <p className="text-vanilla-800/60 text-sm">
                                        All payments are processed securely through trusted payment gateways.
                                    </p>
                                </div>
                                <div className="bg-white rounded-xl p-5 border border-vanilla-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <Gavel className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <h3 className="font-semibold text-vanilla-900">Sri Lankan Law</h3>
                                    </div>
                                    <p className="text-vanilla-800/60 text-sm">
                                        These terms are governed by the laws of Sri Lanka.
                                    </p>
                                </div>
                            </div>

                            {/* Terms Sections */}
                            <div className="space-y-6">
                                {termsAndConditions.map((section, index) => (
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
                                                    <div className="terms-content">
                                                        {section.description}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Agreement Notice */}
                            <div className="mt-8 bg-blue-50 rounded-2xl p-6 lg:p-8 border border-blue-200">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                                        <CheckCircle className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-blue-800 mb-2 font-serif">
                                            Your Agreement
                                        </h3>
                                        <p className="text-blue-700 leading-relaxed font-sans">
                                            By using The Vanilla Shop website and services, you acknowledge that you have read,
                                            understood, and agree to be bound by these Terms and Conditions. If you do not agree
                                            to these terms, please do not use our website or services.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Important Notice */}
                            <div className="mt-6 bg-amber-50 rounded-2xl p-6 lg:p-8 border border-amber-200">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
                                        <AlertTriangle className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-amber-800 mb-2 font-serif">
                                            Changes to Terms
                                        </h3>
                                        <p className="text-amber-700 leading-relaxed font-sans">
                                            We reserve the right to modify these Terms and Conditions at any time.
                                            Changes will be effective immediately upon posting to the website.
                                            Your continued use of the website after any modifications indicates
                                            your acceptance of the updated terms.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <QuickHelp
                question="Have Questions About Our Terms?"
                description="Our team is here to help clarify any aspect of our terms and conditions. Don't hesitate to reach out if you need further explanation."
            />

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

export default Terms