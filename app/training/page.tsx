'use client';

import React from 'react';
import Link from 'next/link';

export default function TrainingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Back Link */}
                <Link href="/" className="text-yellow-400 hover:text-yellow-300 font-semibold mb-8 inline-block">
                    ← Back to Home
                </Link>

                {/* Main Heading */}
                <h1 className="text-5xl font-bold text-white mb-8">AVC Training</h1>

                {/* Introduction */}
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-md border border-gray-600/30 rounded-lg p-8 mb-12">
                    <p className="text-gray-300 text-lg leading-relaxed">
                        Agri Value Chain (AVC) implement skill development programs focus on Post-Harvest Management
                        and Cold Chain Operations, aiming to prepare agri-entrepreneurs, students, and rural youth for
                        employment and enterprise opportunities.
                    </p>
                    <p className="text-gray-300 text-lg leading-relaxed mt-4">
                        The modules are developed in consultation with industry experts and tailored to meet the operational
                        standards of export pack houses, cold chain logistics providers, food processing companies, organized
                        retail outlets, and supermarkets. Participants are trained in technical aspects such as handling, storage,
                        and value addition of produce but also in operational efficiency, quality assurance, and safety
                        standards that are essential in today's competitive agri-business environment.
                    </p>
                    <p className="text-gray-300 text-lg leading-relaxed mt-4">
                        By offering a blend of classroom learning, hands-on exposure, and industry-linked projects, AVC
                        ensures that learners are industry-ready and capable of contributing to sustainable growth across the
                        agri value chain. These programs also encourage entrepreneurship, enabling rural youth to create
                        livelihood opportunities within their communities.
                    </p>
                </div>

                {/* Courses Details */}
                <h2 className="text-4xl font-bold text-white mb-8">Courses Details</h2>

                {/* Course 1: Post-harvest Management */}
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-md border border-gray-600/30 rounded-lg p-8 mb-8">
                    <h3 className="text-2xl font-bold text-green-400 mb-6">i) Post-Harvest Management</h3>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-lg font-semibold text-gray-200 mb-2">Course Title</h4>
                            <p className="text-gray-300">Post-Harvest Management of Horticulture Produce</p>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold text-gray-200 mb-2">Duration</h4>
                            <p className="text-gray-300">5 days (40 hours)</p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h4 className="text-lg font-semibold text-gray-200 mb-3">Modules</h4>
                        <ul className="text-gray-300 space-y-2 ml-4">
                            <li>1. Introduction on Post-Harvest Management</li>
                            <li>2. Importance of Post-Harvest Science</li>
                            <li>3. Pack house operations</li>
                            <li>4. Post-Harvest Management Protocols</li>
                            <li>5. Packing and bar coding standards for traceability</li>
                        </ul>
                    </div>

                    <div className="mt-6">
                        <h4 className="text-lg font-semibold text-gray-200 mb-3">Who Can Benefit</h4>
                        <ul className="text-gray-300 space-y-2 ml-4">
                            <li>• Graduates in science and agriculture</li>
                            <li>• Agri entrepreneurs</li>
                            <li>• Exporters and importers</li>
                            <li>• Cold chain services providers</li>
                            <li>• Farmers group</li>
                        </ul>
                    </div>
                </div>

                {/* Course 2: Cold Chain Operations */}
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-md border border-gray-600/30 rounded-lg p-8 mb-8">
                    <h3 className="text-2xl font-bold text-blue-400 mb-6">ii) Cold Chain Operations</h3>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-lg font-semibold text-gray-200 mb-2">Course Name</h4>
                            <p className="text-gray-300">Cold Chain Operations</p>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold text-gray-200 mb-2">Duration</h4>
                            <p className="text-gray-300">5 days (40 hours)</p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h4 className="text-lg font-semibold text-gray-200 mb-3">Modules</h4>
                        <ul className="text-gray-300 space-y-2 ml-4">
                            <li>1. Introduction to Refrigeration</li>
                            <li>2. Refrigeration System and Components</li>
                            <li>3. Role of Refrigeration and Applications</li>
                            <li>4. Refrigeration In Agri Logistics</li>
                            <li>5. Advancement in Refrigeration</li>
                        </ul>
                    </div>

                    <div className="mt-6">
                        <h4 className="text-lg font-semibold text-gray-200 mb-3">Who Can Benefit</h4>
                        <ul className="text-gray-300 space-y-2 ml-4">
                            <li>• Agri entrepreneurs</li>
                            <li>• Diploma/graduates in engineering</li>
                            <li>• Exporters and importers</li>
                            <li>• Cold chain services providers</li>
                            <li>• Farmers groups</li>
                        </ul>
                    </div>
                </div>

                {/* Course 3: Government Support */}
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-md border border-gray-600/30 rounded-lg p-8 mb-8">
                    <h3 className="text-2xl font-bold text-purple-400 mb-6">iii) Government Support on Promoting Cold Chain</h3>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-lg font-semibold text-gray-200 mb-2">Course Name</h4>
                            <p className="text-gray-300">Cold Chain Support Schemes and Incentives Provided to Encourage Investments</p>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold text-gray-200 mb-2">Duration</h4>
                            <p className="text-gray-300">3 days</p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h4 className="text-lg font-semibold text-gray-200 mb-3">Modules</h4>
                        <ul className="text-gray-300 space-y-2 ml-4">
                            <li>1. Basics of cold chain</li>
                            <li>2. Refrigeration equipment operations</li>
                            <li>3. Maintenance of refrigeration plant and insulated doors</li>
                            <li>4. Troubleshooting and servicing of refrigeration equipments</li>
                        </ul>
                    </div>

                    <div className="mt-6">
                        <h4 className="text-lg font-semibold text-gray-200 mb-3">Who Can Benefit</h4>
                        <ul className="text-gray-300 space-y-2 ml-4">
                            <li>• Agri entrepreneurs</li>
                            <li>• Exporters and importers</li>
                            <li>• Cold chain services providers</li>
                            <li>• Farmers Producers groups</li>
                            <li>• SHM officers</li>
                        </ul>
                    </div>
                </div>

                {/* Course 4: Agri Logistics and Retail Distribution */}
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-md border border-gray-600/30 rounded-lg p-8">
                    <h3 className="text-2xl font-bold text-red-400 mb-6">iv) Agri Logistics and Retail Distribution</h3>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-lg font-semibold text-gray-200 mb-2">Course Name</h4>
                            <p className="text-gray-300">Agri Logistics and Retail Distribution</p>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold text-gray-200 mb-2">Duration</h4>
                            <p className="text-gray-300">3 days</p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h4 className="text-lg font-semibold text-gray-200 mb-3">Who Can Benefit</h4>
                        <ul className="text-gray-300 space-y-2 ml-4">
                            <li>• Agri entrepreneurs</li>
                            <li>• Exporters and importers</li>
                            <li>• Cold chain services providers</li>
                            <li>• Food processors</li>
                            <li>• Farmers Producers groups</li>
                            <li>• SHM officers</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
