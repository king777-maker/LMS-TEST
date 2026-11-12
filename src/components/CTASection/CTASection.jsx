import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaShieldAlt } from "react-icons/fa";
import { features } from "./statsData";
import FeatureItem from "./FeatureItem";

const CTASection = () => {
    return (
        <section className="relative bg-white py-14 lg:py-20 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Executive Gradient Card */}
                <div className="relative rounded-3xl bg-gradient-to-br from-[#071526] via-[#0d274c] to-[#0a1e38] text-white p-8 sm:p-12 lg:p-16 shadow-2xl overflow-hidden border border-white/10">
                    
                    {/* Ambient Glows */}
                    <div 
                        className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" 
                        aria-hidden="true" 
                    />
                    <div 
                        className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" 
                        aria-hidden="true" 
                    />

                    <div className="relative z-10 max-w-3xl mx-auto text-center">
                        {/* Trust Pill */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-amber-300 text-xs font-semibold mb-6 shadow-xs backdrop-blur-xs">
                            <FaShieldAlt className="text-xs" />
                            <span>ISO / IEC Conformant Training Architecture</span>
                        </div>

                        {/* Heading */}
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-white leading-tight tracking-tight">
                            Get Certified Today and Advance Your Career.
                        </h2>

                        {/* Description */}
                        <p className="mt-4 text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                            Join over 10,000+ professionals worldwide acquiring verifiable competencies across Quality, Environmental, and Operational Excellence standards.
                        </p>

                        {/* Features Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 my-8 sm:my-10 text-left max-w-2xl mx-auto">
                            {features.map((feat) => (
                                <div key={feat.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                                    <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-400/30">
                                        <feat.icon className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs sm:text-sm font-semibold text-slate-200">
                                        {feat.text}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Action CTA */}
                        <div className="flex items-center justify-center pt-2">
                            <Link
                                to="/register"
                                className="h-[48px] px-8 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#071526] font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg active:scale-98 transition-all duration-200 flex items-center justify-center gap-2.5 whitespace-nowrap cursor-pointer"
                            >
                                <span>Register Now</span>
                                <FaArrowRight className="text-xs" />
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default CTASection;