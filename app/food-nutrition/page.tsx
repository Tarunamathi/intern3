'use client';

import React from 'react';
import Link from 'next/link';

export default function FoodNutritionPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-800 p-8">
            <div className="max-w-5xl mx-auto">
                <Link href="/" className="text-yellow-400 hover:text-yellow-300 font-semibold mb-8 inline-block">
                    ← Back to Home
                </Link>

                <h1 className="text-5xl font-bold text-white mb-4">Food & Nutrition Security</h1>
                <p className="text-xl text-gray-300 mb-8">Programs, Projects and Community Interventions</p>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-6">
                        <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-md border border-gray-600/30 rounded-lg p-6">
                            <h2 className="text-3xl font-bold text-emerald-400 mb-4">Overview</h2>
                            <p className="text-gray-200 leading-relaxed">
                                Agri Value Chain works on improving food and nutrition security through community programmes, technical assistance and capacity building. Our initiatives focus on sustainable production, post-harvest handling, nutrition-sensitive value chains and market linkages.
                            </p>
                        </div>

                        <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-md border border-emerald-500/30 rounded-lg p-6">
                            <h3 className="text-2xl font-bold text-emerald-300 mb-3">Key Interventions</h3>
                            <ul className="text-gray-300 ml-4 space-y-2">
                                <li>• Nutrition-sensitive agriculture training for communities</li>
                                <li>• Post-harvest food preservation & safe storage</li>
                                <li>• Kitchen gardens and household nutrition programs</li>
                                <li>• Food processing for value addition and shelf-life extension</li>
                                <li>• Market linkage support for nutritious food producers</li>
                            </ul>
                        </div>

                        <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-md border border-emerald-500/30 rounded-lg p-6">
                            <h3 className="text-2xl font-bold text-emerald-300 mb-3">Community Outcomes</h3>
                            <p className="text-gray-200">Our projects aim to improve household dietary diversity, reduce post-harvest losses and strengthen livelihoods through nutrition-focused value chains.</p>
                        </div>
                    </div>

                    <div>
                        <div className="grid grid-cols-1 gap-3 mb-4">
                            <img src="/pdfs/our-projects-img/img-003.jpg" alt="Project 1" className="w-full rounded-md shadow-md object-cover h-48" />
                            <img src="/pdfs/our-projects-img/img-014.jpg" alt="Project 2" className="w-full rounded-md shadow-md object-cover h-48" />
                            <img src="/pdfs/our-projects-img/img-005.jpg" alt="Project 3" className="w-full rounded-md shadow-md object-cover h-48" />
                        </div>

                        <div className="flex gap-3">
                            <a href="/pdfs/our-projects.pdf" download className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded-lg transition">Download PDF</a>
                            <Link href="/contact" className="inline-block bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-4 py-2 rounded-lg transition">Contact Us</Link>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <section className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-md border border-emerald-500/30 rounded-lg p-6">
                        <h2 className="text-3xl font-bold text-emerald-400 mb-4">Integrated Cold Chain Facility & Distribution center — Project References</h2>

                        <div className="space-y-6 text-gray-200">
                            <article className="md:flex md:gap-6 md:items-start bg-gray-900/40 rounded-lg p-4">
                                <div className="md:w-1/2">
                                    <h3 className="text-2xl font-bold text-white">Integrated Cold Chain Facility & Distribution center</h3>
                                    <p className="mt-2">Location: Tamil Nadu • Year of completion: 2014 • Client: NSR Farm Fresh • Project Value: 30 Crores</p>

                                    <h4 className="mt-4 text-emerald-300 font-semibold">Scope of Services</h4>
                                    <ul className="ml-4 list-disc">
                                        <li>Turnkey Design</li>
                                        <li>Project Management consulting services for insulated building</li>
                                        <li>Docking system</li>
                                        <li>Freon split refrigeration plant</li>
                                        <li>Control system and automation system</li>
                                    </ul>

                                    <h4 className="mt-4 text-emerald-300 font-semibold">Project Facts</h4>
                                    <ul className="ml-4 list-disc">
                                        <li>Building Floor Area: 80,000 sqft</li>
                                        <li>Capacity of Cold Storage: 8,000 MT</li>
                                        <li>Cold Rooms: 8</li>
                                        <li>Temperature range: +20°C to -20°C</li>
                                    </ul>
                                </div>
                                <div className="md:w-1/2 mt-4 md:mt-0">
                                    <img src="/pdfs/our-projects-img/img-003.jpg" alt="Integrated Cold Chain" className="w-full rounded-md shadow-md object-cover h-56" />
                                </div>
                            </article>

                            <article className="md:flex md:gap-6 md:items-start bg-gray-900/40 rounded-lg p-4">
                                <div className="md:w-1/2 order-2 md:order-1 mt-4 md:mt-0">
                                    <img src="/pdfs/our-projects-img/img-014.jpg" alt="Gati Kausar Cold Chain" className="w-full rounded-md shadow-md object-cover h-56" />
                                </div>
                                <div className="md:w-1/2 order-1 md:order-2">
                                    <h3 className="text-2xl font-bold text-white">Gati Kausar Cold Chain</h3>
                                    <p className="mt-2">Location: Haryana • Year of completion: 2015 • Client: Gati Kausar Cold Chain Dharuhera • Project Value: 40 Crores</p>

                                    <h4 className="mt-4 text-emerald-300 font-semibold">Scope of Services</h4>
                                    <ul className="ml-4 list-disc">
                                        <li>Design</li>
                                        <li>Project management</li>
                                        <li>Consulting services for refrigeration plant and automation</li>
                                    </ul>

                                    <h4 className="mt-4 text-emerald-300 font-semibold">Project Facts</h4>
                                    <ul className="ml-4 list-disc">
                                        <li>Building Floor Area: 50,000 sqft</li>
                                        <li>Capacity: 5,400 pallets</li>
                                        <li>Cold Rooms: 8 • Temperature: +2°C to -20°C</li>
                                        <li>Refrigeration plant: Ammonia centralised system</li>
                                    </ul>
                                </div>
                            </article>

                            <article className="md:flex md:gap-6 md:items-start bg-gray-900/40 rounded-lg p-4">
                                <div className="md:w-1/2">
                                    <h3 className="text-2xl font-bold text-white">Integrated Cold Chain with CA technology</h3>
                                    <p className="mt-2">Location: Uttar Pradesh • Year of completion: 2016 • Client: MKC Agro Fresh • Project Value: 30 Crores</p>

                                    <h4 className="mt-4 text-emerald-300 font-semibold">Scope & Achievements</h4>
                                    <ul className="ml-4 list-disc">
                                        <li>Design, project management and consulting for CA storage</li>
                                        <li>Ripening rooms and automation systems</li>
                                        <li>Turnkey features including pre-cooling, packing areas and cold storage</li>
                                    </ul>

                                    <h4 className="mt-4 text-emerald-300 font-semibold">Project Facts</h4>
                                    <ul className="ml-4 list-disc">
                                        <li>Building Floor Area: 50,000 sqft</li>
                                        <li>Capacity: 3,000 pallets • Cold Rooms: 14</li>
                                        <li>Ripening Chambers: 80 MT/day • Brine circulation system</li>
                                    </ul>
                                </div>

                                <div className="md:w-1/2 mt-4 md:mt-0">
                                    <img src="/pdfs/our-projects-img/img-017.jpg" alt="CA technology" className="w-full rounded-md shadow-md object-cover h-56" />
                                </div>
                            </article>

                            <article className="bg-gray-900/40 rounded-lg p-4">
                                <h3 className="text-2xl font-bold text-white">TNWC Cold Storage</h3>
                                <p className="mt-2">Location: Tamil Nadu • Year: Ongoing • Client: Tamilnadu Warehousing Corporation • Project Value: 4 Crores</p>
                                <ul className="ml-4 list-disc mt-3">
                                    <li>Building Floor Area: 10,000 sqft • Capacity: 500 MT • Cold Rooms: 8</li>
                                    <li>Temperature: 2°C to 15°C • Relative Humidity: 85%–90%</li>
                                    <li>Solar PV panel: 50 kWp • Products stored: Fruits and Vegetables</li>
                                </ul>
                            </article>

                            <article className="md:flex md:gap-6 md:items-start bg-gray-900/40 rounded-lg p-4">
                                <div className="md:w-1/2">
                                    <h3 className="text-2xl font-bold text-white">Distinct Snow Land Cold Chain</h3>
                                    <p className="mt-2">Location: Tamil Nadu • Year of completion: 2020 • Client: Distinct Snow Land • Project Value: 15 Crores</p>
                                    <ul className="ml-4 list-disc mt-3">
                                        <li>Cold Storage Floor Area: 7,000 sqft • Distribution Centre Area: 8,000 sqft</li>
                                        <li>Solar PV capacity: 75 kWp • Refrigeration capacity: 160 kW</li>
                                        <li>Room Temperature: 1°C to 10°C • No. of Cold Rooms: 6 • Pre-cooling rooms: 2</li>
                                    </ul>
                                </div>
                                <div className="md:w-1/2 mt-4 md:mt-0">
                                    <img src="/pdfs/our-projects-img/img-008.jpg" alt="Distinct Snow Land" className="w-full rounded-md shadow-md object-cover h-56" />
                                </div>
                            </article>

                            <article className="bg-gray-900/40 rounded-lg p-4">
                                <h3 className="text-2xl font-bold text-white">Integrated Cold Chain and Distribution Center — Pattambi, Kerala</h3>
                                <p className="mt-2">Location: Pattambi, Kerala • Year of completion: 2024 • Client: AMA International • Project Value: 15 Crores</p>
                                <ul className="ml-4 list-disc mt-3">
                                    <li>Capacity: 30–40 MT/day turnover with storage capacity of 1,500 pallets</li>
                                    <li>Logistic systems: docking, double-deep racking, barcoding, palletizing, traceability</li>
                                    <li>Thermal building: Kingspan quad-core insulation & automatic high-speed doors</li>
                                    <li>Refrigeration: Eurovent certified equipment • Solar PV: 150 kWp • Rainwater harvesting & energy efficiency features</li>
                                </ul>
                            </article>

                            <article className="bg-gray-900/40 rounded-lg p-4">
                                <h3 className="text-2xl font-bold text-white">Global Reach</h3>
                                <p className="mt-2">In-house expertise across Asia, Africa and the Middle East — providing efficient, sustainable solutions for challenging ambient conditions.</p>
                            </article>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
