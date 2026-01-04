'use client';

import React from 'react';
import Link from 'next/link';

export default function LivelihoodPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-800 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Back Link */}
                <Link href="/" className="text-yellow-400 hover:text-yellow-300 font-semibold mb-8 inline-block">
                    ← Back to Home
                </Link>

                {/* Main Heading */}
                <h1 className="text-5xl font-bold text-white mb-4">Improve Rural Livelihood</h1>
                <p className="text-xl text-gray-300 mb-8">Skill Development & Community Empowerment</p>

                {/* Image gallery from PDF (extracted) */}
                <div className="mb-8">
                    <h3 className="text-2xl font-semibold text-white mb-4">Brochure Images</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <img src="/pdfs/livelihood-img/page-1.jpg" alt="livelihood page 1" className="w-full rounded-lg shadow-lg" />
                        <img src="/pdfs/livelihood-img/page-2.jpg" alt="livelihood page 2" className="w-full rounded-lg shadow-lg" />
                        <img src="/pdfs/livelihood-img/page-3.jpg" alt="livelihood page 3" className="w-full rounded-lg shadow-lg" />
                        <img src="/pdfs/livelihood-img/page-4.jpg" alt="livelihood page 4" className="w-full rounded-lg shadow-lg" />
                    </div>
                    <div className="mt-4 text-sm text-gray-300">
                        <a href="/pdfs/livelihood.pdf" target="_blank" rel="noreferrer" className="text-yellow-400 underline">Open full PDF</a>
                        <a href="/pdfs/livelihood.pdf" download className="ml-4 inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-3 py-1 rounded">Download Brochure</a>
                    </div>
                </div>

                {/* Section 1: Skill Development */}
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-md border border-gray-600/30 rounded-lg p-6 mb-8">
                    <h2 className="text-3xl font-bold text-emerald-400 mb-6">1. Skill Development Programs</h2>
                    <p className="text-gray-200 leading-relaxed mb-6">
                        We implement skill development programs for agri entrepreneurs, students, and rural youth to enhance employability. Our modules are designed to meet industrial requirements including export pack houses, cold chain service providers, food processing industries, and supermarkets.
                    </p>

                    {/* Course i */}
                    <div className="bg-gradient-to-r from-emerald-800/40 to-slate-800/40 backdrop-blur-md border border-emerald-500/30 rounded-lg p-5 mb-4">
                        <h3 className="text-xl font-bold text-emerald-300 mb-3">i) Post-Harvest Management</h3>
                        <div className="space-y-3 text-gray-300">
                            <div>
                                <p className="font-semibold text-gray-200">Course Title</p>
                                <p>Post-harvest management of horticulture produce</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-200">Modules</p>
                                <ul className="space-y-1 ml-4 mt-1">
                                    <li>• Introduction to Post-Harvest Management</li>
                                    <li>• Importance of Post-Harvest Science</li>
                                    <li>• Pack house operations</li>
                                    <li>• Post-Harvest Management Protocols</li>
                                    <li>• Packing and bar coding standards for traceability</li>
                                </ul>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-200">Duration</p>
                                <p>5 days (40 hours)</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-200">Who Can Benefit</p>
                                <ul className="space-y-1 ml-4 mt-1">
                                    <li>• Graduates in science and agriculture</li>
                                    <li>• Agri entrepreneurs</li>
                                    <li>• Exporters and importers</li>
                                    <li>• Cold chain services providers</li>
                                    <li>• Farmers groups</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Course ii */}
                    <div className="bg-gradient-to-r from-emerald-800/40 to-slate-800/40 backdrop-blur-md border border-emerald-500/30 rounded-lg p-5 mb-4">
                        <h3 className="text-xl font-bold text-emerald-300 mb-3">ii) Cold Chain Operations</h3>
                        <div className="space-y-3 text-gray-300">
                            <div>
                                <p className="font-semibold text-gray-200">Course Name</p>
                                <p>Cold Chain Operations</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-200">Modules</p>
                                <ul className="space-y-1 ml-4 mt-1">
                                    <li>• Introduction to Refrigeration</li>
                                    <li>• Refrigeration System and Components</li>
                                    <li>• Role of Refrigeration and Applications</li>
                                    <li>• Refrigeration In Agri Logistics</li>
                                    <li>• Advancement in Refrigeration</li>
                                </ul>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-200">Duration</p>
                                <p>5 days (40 hours)</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-200">Who Can Benefit</p>
                                <ul className="space-y-1 ml-4 mt-1">
                                    <li>• Agri entrepreneurs</li>
                                    <li>• Diploma/graduates in engineering</li>
                                    <li>• Exporters and importers</li>
                                    <li>• Cold chain services providers</li>
                                    <li>• Farmers groups</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Course iii */}
                    <div className="bg-gradient-to-r from-emerald-800/40 to-slate-800/40 backdrop-blur-md border border-emerald-500/30 rounded-lg p-5 mb-4">
                        <h3 className="text-xl font-bold text-emerald-300 mb-3">iii) Cold Chain Support Schemes and Initiatives (NCCD Guidelines 2025)</h3>
                        <div className="space-y-3 text-gray-300">
                            <div>
                                <p className="font-semibold text-gray-200">Course Name</p>
                                <p>Cold chain support schemes and incentives provided to encourage investments</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-200">Modules</p>
                                <ul className="space-y-1 ml-4 mt-1">
                                    <li>• Basics of cold chain</li>
                                    <li>• Refrigeration equipment operations</li>
                                    <li>• Maintenance of refrigeration plant and insulated doors</li>
                                    <li>• Troubleshooting and servicing of refrigeration equipments</li>
                                </ul>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-200">Duration</p>
                                <p>2 days</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-200">Who Can Benefit</p>
                                <ul className="space-y-1 ml-4 mt-1">
                                    <li>• Agri entrepreneurs</li>
                                    <li>• Exporters and importers</li>
                                    <li>• Cold chain services providers</li>
                                    <li>• Farmers & Producers groups</li>
                                    <li>• SHM officers</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Course iv */}
                    <div className="bg-gradient-to-r from-emerald-800/40 to-slate-800/40 backdrop-blur-md border border-emerald-500/30 rounded-lg p-5">
                        <h3 className="text-xl font-bold text-emerald-300 mb-3">iv) Agri Logistics and Retail Distribution</h3>
                        <div className="space-y-3 text-gray-300">
                            <div>
                                <p className="font-semibold text-gray-200">Course Name</p>
                                <p>Agri logistics and retail distributions</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-200">Duration</p>
                                <p>3 days</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-200">Who Can Benefit</p>
                                <ul className="space-y-1 ml-4 mt-1">
                                    <li>• Agri entrepreneurs</li>
                                    <li>• Exporters and importers</li>
                                    <li>• Cold chain services providers</li>
                                    <li>• Food processors</li>
                                    <li>• Farmers & Producers groups</li>
                                    <li>• SHM officers</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Industry Academic Collaboration */}
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-md border border-emerald-500/30 rounded-lg p-6 mb-8">
                    <h2 className="text-3xl font-bold text-emerald-400 mb-6">2. Industry Academic Collaboration</h2>
                    <p className="text-gray-200 leading-relaxed mb-6">
                        Agri Value Chain has signed a Memorandum of Understanding with Tamil Nadu Agricultural University, Coimbatore, to strengthen training and development programs.
                    </p>

                    <h3 className="text-xl font-bold text-emerald-300 mb-4">Objectives</h3>
                    <ul className="space-y-3 text-gray-300 ml-4">
                        <li className="flex items-start gap-3">
                            <span className="text-emerald-400 mt-1">•</span>
                            <span>Promote collaboration on scientific studies improving scientific storage systems adopted in value chain systems</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-emerald-400 mt-1">•</span>
                            <span>Research and development of establishing optimum controlled environment conditions to extend the post-harvest life of tropical horticultural produce</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-emerald-400 mt-1">•</span>
                            <span>Training and development of capacity building programs</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-emerald-400 mt-1">•</span>
                            <span>Developing innovative quality measurement systems to study and improve the shelf life of produce</span>
                        </li>
                    </ul>
                </div>

                {/* Section 3: Small Scale Post-Harvest Management */}
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-md border border-emerald-500/30 rounded-lg p-6 mb-8">
                    <h2 className="text-3xl font-bold text-emerald-400 mb-6">3. Small Scale Post-Harvest Management & Food Processing</h2>
                    <p className="text-gray-200 leading-relaxed mb-6">
                        We provide technical support and capacity development in post-harvest management processes and infrastructure planning. We focus on farm-level value chain development through implementation of small post-harvest management processes, infrastructure planning, and adopting technologies. Our team works closely with farmers, groups, exporters, and supermarkets to ensure market linkages.
                    </p>

                    {/* Sub-section a */}
                    <div className="bg-gradient-to-r from-emerald-800/40 to-slate-800/40 backdrop-blur-md border border-emerald-500/30 rounded-lg p-5 mb-4">
                        <h3 className="text-xl font-bold text-emerald-300 mb-3">a) Supporting Small Scale Post-Harvest Management to FPOs</h3>
                        <p className="text-gray-300">
                            We provide comprehensive support for establishing small-scale post-harvest management and food processing facilities for Farmer Producer Organizations.
                        </p>
                    </div>

                    {/* Sub-section b */}
                    <div className="bg-gradient-to-r from-emerald-800/40 to-slate-800/40 backdrop-blur-md border border-emerald-500/30 rounded-lg p-5 mb-6">
                        <h3 className="text-xl font-bold text-emerald-300 mb-3">b) Support for Small Agro Food Industries Development to MSMEs</h3>
                        <p className="text-gray-300">
                            We guide private investments to setup projects on small-scale food processing and partner with institutions for the development of MSMEs in agro food processing.
                        </p>
                    </div>

                    {/* Scope of Deliverables */}
                    <div className="bg-gradient-to-r from-emerald-800/30 to-slate-800/30 backdrop-blur-md rounded-lg p-5">
                        <h4 className="text-lg font-bold text-emerald-300 mb-4">Scope of Deliverables</h4>

                        <div className="mb-6">
                            <h5 className="font-semibold text-gray-200 mb-3">Planning & Development</h5>
                            <ul className="space-y-2 text-gray-300 ml-4">
                                <li>• Techno-economic feasibility report preparation</li>
                                <li>• Guidance on government schemes for encouraging investments in agro processing</li>
                                <li>• Infrastructure planning and design</li>
                                <li>• Sustainable cooling solutions integration</li>
                            </ul>
                        </div>

                        <div>
                            <h5 className="font-semibold text-gray-200 mb-3">Implementation Support</h5>
                            <ul className="space-y-2 text-gray-300 ml-4">
                                <li>• Technical guidance for facility setup</li>
                                <li>• Training for operations and maintenance</li>
                                <li>• Quality control system implementation</li>
                                <li>• Market linkage facilitation</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Contact CTA */}
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-md border border-yellow-500/30 rounded-lg p-6 text-center">
                    <h3 className="text-xl font-semibold text-yellow-400 mb-3">Ready to Build Your Skills?</h3>
                    <p className="text-gray-300 mb-4">Join our livelihood and skill development programs to enhance your career prospects</p>
                    <Link href="/contact" className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded-lg transition">
                        Contact Us
                    </Link>
                </div>
            </div>
        </div>
    );
}
