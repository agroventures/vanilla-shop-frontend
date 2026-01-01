// src/pages/Privacy.jsx
import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
    Shield,
    ChevronRight,
    Home,
    Lock,
    Eye,
    Database,
    Share2,
    Cookie,
    Bell,
    UserCheck,
    Globe,
    Mail,
    FileText,
    Calendar,
    ArrowUp,
    CheckCircle,
    AlertCircle,
    ExternalLink,
    Phone,
    MapPin,
    Printer,
    Download
} from 'lucide-react'
import { lastUpdated, privacyPolicy } from '../data/privacyPolicy'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import QuickHelp from '../components/QuickHelp'
import RelatedPolicies from '../components/RelatedPolicies'
import useSEO from '../hooks/useSEO'

const Privacy = () => {
    const [activeSection, setActiveSection] = useState(null)
    const [showScrollTop, setShowScrollTop] = useState(false)
    const [isVisible, setIsVisible] = useState({})
    const sectionRefs = useRef({})

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const url = window.location.href;

    useSEO({
        title: "Privacy Policy - The Vanilla Shop",
        description: "The Vanilla Shop is more than a café — it’s Sri Lanka’s first dedicated vanilla boutique.",
        url,
        image_alt: "Privacy Policy",
        twitter_card: "summary_large_image",
    });

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
    }, [privacyPolicy])

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
    const getSectionIcon = (index) => {
        const icons = [
            <Database className="w-5 h-5" />,
            <Eye className="w-5 h-5" />,
            <Share2 className="w-5 h-5" />,
            <Cookie className="w-5 h-5" />,
            <Lock className="w-5 h-5" />,
            <UserCheck className="w-5 h-5" />,
            <Bell className="w-5 h-5" />,
            <Globe className="w-5 h-5" />,
            <FileText className="w-5 h-5" />,
            <Shield className="w-5 h-5" />
        ]
        return icons[index % icons.length]
    }

    // Print page
    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="pt-24">

            <Navbar />

            <section className="relative bg-dark text-white py-16 lg:py-20 overflow-hidden">
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
                <div className="absolute top-0 right-0 w-96 h-96 bg-vanilla-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-vanilla-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-sm mb-8">
                        <Link to="/" className="text-white/60 hover:text-vanilla-400 transition-colors flex items-center gap-1">
                            <Home className="w-4 h-4" />
                            <span>Home</span>
                        </Link>
                        <ChevronRight className="w-4 h-4 text-white/30" />
                        <span className="text-vanilla-400">Privacy Policy</span>
                    </nav>

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                                <Shield className="w-4 h-4 text-vanilla-400" />
                                <span className="text-vanilla-300 text-sm font-medium tracking-wide uppercase">
                                    Your Privacy Matters
                                </span>
                            </div>

                            <h1 className="font-serif text-4xl sm:text-5xl font-semibold leading-tight mb-4">
                                Privacy Policy
                            </h1>

                            <p className="text-white/70 text-lg max-w-2xl">
                                We're committed to protecting your privacy and handling your personal
                                information responsibly.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <a
                                href="/pdf/privacy-policy.pdf"
                                download
                                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-vanilla-400 text-dark rounded-xl font-medium hover:bg-vanilla-500 transition-colors print:hidden"
                            >
                                <Download className="w-4 h-4" />
                                Download PDF
                            </a>
                        </div>
                    </div>

                    {/* Last Updated & Quick Info */}
                    <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap items-center gap-6 text-sm">
                        <div className="flex items-center gap-2 text-white/60">
                            <Calendar className="w-4 h-4" />
                            <span>Last Updated: {lastUpdated}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/60">
                            <FileText className="w-4 h-4" />
                            <span>{privacyPolicy.length} Sections</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/60">
                            <Globe className="w-4 h-4" />
                            <span>Applies Worldwide</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 lg:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                        <aside className="lg:w-72 shrink-0 print:hidden">
                            <div className="lg:sticky lg:top-28">
                                <div className="bg-white rounded-2xl border border-vanilla-100 shadow-sm overflow-hidden">
                                    <div className="p-4 bg-vanilla-50 border-b border-vanilla-100">
                                        <h3 className="font-semibold text-dark flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-vanilla-600" />
                                            Table of Contents
                                        </h3>
                                    </div>
                                    <nav className="p-2 max-h-[60vh] overflow-y-auto">
                                        {privacyPolicy.map((section, index) => (
                                            <button
                                                key={section.id}
                                                onClick={() => scrollToSection(`section-${section.id}`)}
                                                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center gap-3 ${activeSection === `section-${section.id}`
                                                        ? 'bg-vanilla-100 text-dark font-medium'
                                                        : 'text-charcoal/70 hover:bg-vanilla-50 hover:text-dark'
                                                    }`}
                                            >
                                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${activeSection === `section-${section.id}`
                                                        ? 'bg-vanilla-400 text-dark'
                                                        : 'bg-vanilla-100 text-charcoal/60'
                                                    }`}>
                                                    {section.id}
                                                </span>
                                                <span className="line-clamp-1">{section.title}</span>
                                            </button>
                                        ))}
                                    </nav>
                                </div>

                                {/* Quick Contact */}
                                <div className="mt-6 bg-dark rounded-2xl p-5 text-white">
                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-vanilla-400" />
                                        Have Questions?
                                    </h4>
                                    <p className="text-white/60 text-sm mb-4">
                                        Contact our privacy team for any concerns.
                                    </p>
                                    <a
                                        href="mailto:info@thevanillashop.lk"
                                        className="flex items-center gap-2 text-vanilla-400 text-sm hover:text-vanilla-300 transition-colors"
                                    >
                                        <Mail className="w-4 h-4" />
                                        info@thevanillashop.lk
                                    </a>
                                </div>
                            </div>
                        </aside>


                        <div className="flex-1 min-w-0">
                            {/* Introduction Card */}
                            <div className="bg-linear-to-br from-vanilla-100 to-vanilla-50 rounded-2xl p-6 lg:p-8 mb-8 border border-vanilla-200">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-vanilla-400 rounded-xl flex items-center justify-center shrink-0">
                                        <Shield className="w-6 h-6 text-dark" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-dark mb-2">
                                            About This Policy
                                        </h2>
                                        <p className="text-charcoal/70 leading-relaxed">
                                            The Vanilla Shop is operated by <strong>Agro Ventures Exports (Pvt) Ltd</strong>,
                                            located at No. 48, Sir Marcus Fernando Mawatha, Colombo 07, Sri Lanka.
                                            We are committed to protecting your privacy and handling your personal
                                            information responsibly. This Privacy Policy explains how we collect, use,
                                            disclose, and safeguard your information when you visit or make a purchase from{' '}
                                            <Link to="/" className="text-vanilla-600 font-semibold hover:text-vanilla-700 transition-colors">
                                                www.thevanillashop.lk
                                            </Link>.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Policy Sections */}
                            <div className="space-y-6">
                                {privacyPolicy.map((section, index) => (
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
                                            <div className="w-10 h-10 bg-vanilla-400 rounded-xl flex items-center justify-center text-dark shrink-0">
                                                {getSectionIcon(index)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-vanilla-600 text-sm font-medium">
                                                        Section {section.id}
                                                    </span>
                                                </div>
                                                <h2 className="text-lg lg:text-xl font-semibold text-dark">
                                                    {section.title}
                                                </h2>
                                            </div>
                                        </div>

                                        {/* Section Content */}
                                        <div className="p-5 lg:p-6">
                                            <div className="prose prose-vanilla max-w-none text-charcoal/70 leading-relaxed">
                                                {/* Render description - handle both string and JSX */}
                                                {typeof section.description === 'string' ? (
                                                    <p>{section.description}</p>
                                                ) : (
                                                    <div className="privacy-content">
                                                        {section.description}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Acceptance Notice */}
                            <div className="mt-8 bg-vanilla-100 rounded-2xl p-6 lg:p-8 border border-vanilla-200">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                                        <CheckCircle className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-dark mb-2">
                                            Your Acceptance
                                        </h3>
                                        <p className="text-charcoal/70 leading-relaxed">
                                            By using our website and services, you acknowledge that you have read,
                                            understood, and agree to be bound by this Privacy Policy. If you do not
                                            agree with this policy, please do not use our services.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <QuickHelp question="Questions About Your Privacy?" description="We take your privacy seriously. If you have any questions, concerns, or requests regarding your personal data, please don't hesitate to reach out to our privacy team." />

            <RelatedPolicies />

            <Footer />

            {/* Scroll to Top Button */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-6 right-6 w-12 h-12 bg-vanilla-400 text-dark rounded-full flex items-center justify-center shadow-lg hover:bg-vanilla-500 transition-all duration-300 z-40 print:hidden ${showScrollTop
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

export default Privacy