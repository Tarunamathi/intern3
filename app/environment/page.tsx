'use client';

import React from 'react';
import Link from 'next/link';

export default function EnvironmentPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-800 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Back Link */}
                <Link href="/" className="text-yellow-400 hover:text-yellow-300 font-semibold mb-8 inline-block">
                    ← Back to Home
                </Link>

                {/* Main Heading */}
                <h1 className="text-5xl font-bold text-white mb-4">Environment and Climate Change Reduction</h1>
                <p className="text-xl text-gray-300 mb-8">Agri Food Supply Chain Sustainability</p>

                {/* Overview Section */}
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-md border border-gray-600/30 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold text-green-400 mb-4">Initiative Overview</h2>
                    <p className="text-gray-200 leading-relaxed">
                        The focus of this initiative is to provide technical consulting and advisory support to governments and international institutions in designing and developing energy-efficient agricultural infrastructure. It promotes the use of certified equipment, integration of green energy systems, adoption of non-refrigerant cooling solutions, and the use of natural refrigerants.
                    </p>
                </div>

                {/* Technical Consulting Section */}
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-md border border-gray-600/30 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold text-blue-400 mb-4">Technical Consulting and Advisory Services</h2>

                    <h3 className="text-xl font-semibold text-gray-200 mb-3">Advisory Coverage:</h3>
                    <ul className="space-y-2 mb-6 ml-4">
                        <li className="text-gray-300 flex items-start gap-3">
                            <span className="text-blue-400 mt-1">•</span>
                            <span>Energy efficient Agri infrastructure design</span>
                        </li>
                        <li className="text-gray-300 flex items-start gap-3">
                            <span className="text-blue-400 mt-1">•</span>
                            <span>Green energy system integration</span>
                        </li>
                        <li className="text-gray-300 flex items-start gap-3">
                            <span className="text-blue-400 mt-1">•</span>
                            <span>Non-refrigerant cooling systems</span>
                        </li>
                        <li className="text-gray-300 flex items-start gap-3">
                            <span className="text-blue-400 mt-1">•</span>
                            <span>Natural refrigerants promotion</span>
                        </li>
                        <li className="text-gray-300 flex items-start gap-3">
                            <span className="text-blue-400 mt-1">•</span>
                            <span>Promoting certified equipment in cold chain</span>
                        </li>
                    </ul>
                </div>

                {/* Project A */}
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-md border border-cyan-500/30 rounded-lg p-6 mb-6">
                    <h3 className="text-2xl font-bold text-cyan-400 mb-4">A. Improving Energy Efficiency in India's Post-Harvest Infrastructure</h3>
                    <p className="text-gray-300 text-sm mb-4 italic">To World Bank</p>

                    <div className="space-y-3 text-gray-300 ml-4">
                        <div>
                            <p className="font-semibold text-gray-200">Implementing Agency</p>
                            <p>Bureau of Energy Efficiency (BEE), Ministry of Power. Government of India</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-200">Funding Agency</p>
                            <p>World Bank - Energy Sector Management Assistance Program</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-200">Project Duration</p>
                            <p>Feb 2019 to November 2019</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-200">Role</p>
                            <p>Consultant to Alliance for Energy Efficient Economy (NGO)</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-200">Beneficiary</p>
                            <p>Ministry of Environment and Forest & Ministry of Power, Government of India</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-200">Project Brief</p>
                            <p>Cold chain development is an important element of the Government's Mission for Integrated Development of Horticulture and the Sustainable Development Goals. The objectives include:</p>
                            <ul className="mt-2 space-y-1 ml-4">
                                <li>• Supporting Bureau of Energy Efficiency in developing options for enhancing energy efficiency of pack houses</li>
                                <li>• Focus on pack houses where capacity addition is anticipated over the next two decades</li>
                            </ul>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-200">Scope of Study</p>
                            <ul className="mt-2 space-y-1 ml-4">
                                <li>• Study of existing policy, regulatory and institutional framework for Post-harvest management</li>
                                <li>• Visit to 20 pack houses across the country and study of energy saving potential</li>
                                <li>• Recommendations of EE improvement options including policy input suggestions</li>
                            </ul>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-200 text-green-400">Status</p>
                            <p>Project report has been accepted by BEE and World Bank for implementation</p>
                        </div>
                    </div>
                </div>

                {/* Project B */}
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-md border border-cyan-500/30 rounded-lg p-6 mb-6">
                    <h3 className="text-2xl font-bold text-cyan-400 mb-4">B. Improving Energy Efficiency in Potato Supply Chain in West Bengal</h3>
                    <p className="text-gray-300 text-sm mb-4 italic">To Energy Efficiency Services, Ministry of Power, Government of India</p>

                    <div className="space-y-3 text-gray-300 ml-4">
                        <div>
                            <p className="font-semibold text-gray-200">Implementing Agency</p>
                            <p>Energy Efficiency Services Ltd (EESL), Ministry of Power, Government of India</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-200">Funding Agency</p>
                            <p>Children Investment Fund Foundation (CIFF)</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-200">Beneficiary</p>
                            <p>Government of West Bengal</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-200">Project Duration</p>
                            <p>March 2021 to November 2021</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-200">Role</p>
                            <p>Consultant to Alliance for Energy Efficient Economy (NGO)</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-200 text-green-400">Status</p>
                            <p>Project report has been accepted by EESL</p>
                        </div>
                    </div>
                </div>

                {/* Project C */}
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-md border border-cyan-500/30 rounded-lg p-6 mb-6">
                    <h3 className="text-2xl font-bold text-cyan-400 mb-4">C. Strategy Document for Improving Energy Efficiency in Cold Chain in India</h3>

                    <div className="space-y-3 text-gray-300 ml-4">
                        <div>
                            <p className="font-semibold text-gray-200">Implementing Agency</p>
                            <p>Micro Serve Foundation</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-200">Funding Agency</p>
                            <p>World Bank and Government of Bihar</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-200">Beneficiary</p>
                            <p>Small Farmers Groups from Patna District, State of Bihar</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-200">Project Duration</p>
                            <p>June 2022 to August 2022</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-200">Role</p>
                            <p>Technical Consultant to Alliance for Energy Efficient Economy</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-200">Project Objectives</p>
                            <p>Demonstrating energy efficient cooling/refrigeration solutions to benefit rural communities:</p>
                            <ul className="mt-2 space-y-1 ml-4">
                                <li>• Reduce food loss through agricultural applications such as pre-cooling and cold rooms</li>
                                <li>• Provide cold-storage facilities in rural health centers</li>
                                <li>• Improve income opportunities for women through small-scale agro-processing facilities</li>
                            </ul>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-200">Scope of Services</p>
                            <ul className="mt-2 space-y-1 ml-4">
                                <li>• Evaluating vendor proposals for Patna Distribution Centre cold chain solution</li>
                                <li>• Providing guidance on project design, construction, and operations</li>
                            </ul>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-200 text-green-400">Status</p>
                            <p>Recommendations approved for implementation</p>
                        </div>
                    </div>
                </div>

                {/* Project D */}
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-md border border-cyan-500/30 rounded-lg p-6 mb-8">
                    <h3 className="text-2xl font-bold text-cyan-400 mb-4">D. Supporting Green Finance in Cold Chain for Energy Efficiency Improvement</h3>

                    <div className="space-y-3 text-gray-300 ml-4">
                        <div>
                            <p className="font-semibold text-gray-200">Implementing Agency</p>
                            <p>GIZ, India Office</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-200">Funding Agency</p>
                            <p>KFW Development Bank, Germany</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-200">Project Duration</p>
                            <p>March to May 2022</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-200">Project Objectives</p>
                            <p>The Indo German Energy Forum works in energy security, efficiency, and renewable energy. As part of energy efficiency in India, IGEF aims to partner public sector institutions with KFW bank for green financing of cold chain sector.</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-200">Role</p>
                            <p>Technical Consultant to DESL, the consultants</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-200">Scope of Services</p>
                            <ul className="mt-2 space-y-1 ml-4">
                                <li>• Identify key stakeholders at central/state level for development of cooperation projects</li>
                                <li>• Assess, recommend and establish contact with right partners for KFW agreements</li>
                                <li>• Organize meetings with key stakeholders to understand interests and opportunities</li>
                            </ul>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-200 text-green-400">Status</p>
                            <p>Organized meeting with Maharashtra State Agri Marketing Board for exploring financing of cold storage and food processing modernization</p>
                        </div>
                    </div>
                </div>

                {/* Contact CTA */}
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-md border border-yellow-500/30 rounded-lg p-6 text-center">
                    <h3 className="text-xl font-semibold text-yellow-400 mb-3">Ready to Partner?</h3>
                    <p className="text-gray-300 mb-4">Reach out to us for more information about our environment initiatives</p>
                    <Link href="/contact" className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded-lg transition">
                        Contact Us
                    </Link>
                </div>
            </div>
        </div>
    );
}
