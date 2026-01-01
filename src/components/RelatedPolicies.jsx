import { FileText, ShieldCheck, Truck } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

export default function RelatedPolicies() {
    return (
        <section className="py-12 lg:py-16 bg-vanilla-50 print:hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h3 className="font-serif text-2xl text-dark font-semibold text-center mb-8">
                    Related Policies
                </h3>
                <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                    <Link
                        to="/terms"
                        className="bg-white rounded-xl p-5 border border-vanilla-100 hover:border-vanilla-300 hover:shadow-md transition-all duration-300 group"
                    >
                        <FileText className="w-8 h-8 text-vanilla-500 mb-3 group-hover:text-vanilla-600 transition-colors" />
                        <h4 className="font-semibold text-dark mb-1">Terms of Service</h4>
                        <p className="text-charcoal/60 text-sm">Our terms and conditions</p>
                    </Link>
                    <Link
                        to="/privacy"
                        className="bg-white rounded-xl p-5 border border-vanilla-100 hover:border-vanilla-300 hover:shadow-md transition-all duration-300 group"
                    >
                        <ShieldCheck className="w-8 h-8 text-vanilla-500 mb-3 group-hover:text-vanilla-600 transition-colors" />
                        <h4 className="font-semibold text-dark mb-1">Privacy Policy</h4>
                        <p className="text-charcoal/60 text-sm">How we protect your data</p>
                    </Link>
                    <Link
                        to="/refund"
                        className="bg-white rounded-xl p-5 border border-vanilla-100 hover:border-vanilla-300 hover:shadow-md transition-all duration-300 group"
                    >
                        <Truck className="w-8 h-8 text-vanilla-500 mb-3 group-hover:text-vanilla-600 transition-colors" />
                        <h4 className="font-semibold text-dark mb-1">Shipping and Refund</h4>
                        <p className="text-charcoal/60 text-sm">Shipping and refund policies</p>
                    </Link>
                </div>
            </div>
        </section>
    )
}
