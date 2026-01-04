'use client';

import React from 'react';
import Link from 'next/link';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 p-8">
            <div className="max-w-2xl mx-auto">
                {/* Back Link */}
                <Link href="/" className="text-yellow-400 hover:text-yellow-300 font-semibold mb-8 inline-block">
                    ← Back to Home
                </Link>

                {/* Contact Heading */}
                <h1 className="text-5xl font-bold text-white mb-2">Contact Us</h1>
                <p className="text-gray-300 mb-12">Get in touch with Agri Value Chain</p>

                {/* Contact Details */}
                <div className="space-y-6">
                    {/* Phone */}
                    <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-md border border-gray-600/30 rounded-lg p-6 hover:border-green-500/50 transition">
                        <div className="flex items-center gap-4">
                            <div className="text-3xl">📞</div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-200 mb-1">Phone</h2>
                                <a href="tel:+919445053300" className="text-green-400 hover:text-green-300 text-lg font-medium">
                                    +91 9445053300
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-md border border-gray-600/30 rounded-lg p-6 hover:border-blue-500/50 transition">
                        <div className="flex items-center gap-4">
                            <div className="text-3xl">✉️</div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-200 mb-1">Email</h2>
                                <a href="mailto:agrivaluechain@gmail.com" className="text-blue-400 hover:text-blue-300 text-lg font-medium">
                                    agrivaluechain@gmail.com
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Address */}
                    <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-md border border-gray-600/30 rounded-lg p-6 hover:border-purple-500/50 transition">
                        <div className="flex items-start gap-4">
                            <div className="text-3xl mt-1">📍</div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-200 mb-2">Address</h2>
                                <p className="text-gray-300 leading-relaxed">
                                    6G, Vishnu Sriram Apartments, Pillayar Koil Street, Kalikundram, Tharamani, Chennai,<br />
                                    Tamil Nadu- 600113, India.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-md border border-gray-600/30 rounded-lg p-6 hover:border-red-500/50 transition">
                        <div className="flex items-center gap-4">
                            <div className="text-3xl">🗺️</div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-200 mb-1">Location</h2>
                                <a
                                    href="https://maps.app.goo.gl/fMre3wJcG81TT6mA9"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-red-400 hover:text-red-300 text-lg font-medium"
                                >
                                    View on Google Maps →
                                </a>
                            </div>
                        </div>          </div>
                </div>
            </div>
        </div>
    );
}