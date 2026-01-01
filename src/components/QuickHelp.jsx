import { Mail, MapPin, Phone } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

function QuickHelp(props) {
    return (
        <section id="contact-details" className="py-12 lg:py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-dark rounded-3xl p-8 lg:p-12 text-white overflow-hidden relative">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                                backgroundSize: '24px 24px'
                            }}
                        />
                    </div>

                    <div className="relative grid lg:grid-cols-2 gap-8 items-center">
                        <div>
                            <h2 className="font-serif text-2xl lg:text-3xl font-semibold mb-4">
                                {props.question}
                            </h2>
                            <p className="text-white/70 leading-relaxed mb-6">
                                {props.description}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    to="/contact"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-vanilla-400 text-dark rounded-xl font-semibold hover:bg-vanilla-500 transition-colors"
                                >
                                    <Mail className="w-5 h-5" />
                                    Contact Us
                                </Link>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                                <Mail className="w-8 h-8 text-vanilla-400 mb-3" />
                                <h4 className="font-semibold mb-1">Email</h4>
                                <a
                                    href="mailto:info@thevanillashop.lk"
                                    className="text-white/70 text-sm hover:text-vanilla-400 transition-colors"
                                >
                                    info@thevanillashop.lk
                                </a>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                                <Phone className="w-8 h-8 text-vanilla-400 mb-3" />
                                <h4 className="font-semibold mb-1">Phone</h4>
                                <a
                                    href="tel:+94112345678"
                                    className="text-white/70 text-sm hover:text-vanilla-400 transition-colors"
                                >
                                    +94 70 520 0900
                                </a>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 sm:col-span-2">
                                <MapPin className="w-8 h-8 text-vanilla-400 mb-3" />
                                <h4 className="font-semibold mb-1">Address</h4>
                                <p className="text-white/70 text-sm">
                                    No. 253, Koswatta, Kaduwela Road, Battaramulla
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default QuickHelp
