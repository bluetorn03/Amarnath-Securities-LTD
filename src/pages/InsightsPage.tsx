import React, { useState } from 'react';
import { PageRoute, InsightArticle } from '../types';
import { INSIGHTS } from '../data/mockData';
import { TextReveal } from '../components/TextReveal';
import { ScrollReveal } from '../components/ScrollReveal';
import { MagneticButton } from '../components/MagneticButton';
import {
  TrendingUp,
  Calendar,
  Clock,
  User,
  ArrowRight,
  ChevronLeft,
  FileText,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InsightsPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const InsightsPage: React.FC<InsightsPageProps> = ({ onNavigate }) => {
  const [selectedArticle, setSelectedArticle] = useState<InsightArticle | null>(null);

  return (
    <div className="w-full bg-white text-[#0A1128] min-h-screen font-sans">

      {/* Page Header — clean light institutional */}
      <div className="bg-[#F8FAFC] border-b border-slate-200/80 py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#0D9488] font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Market Intelligence & Research</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#0A1128] tracking-tight leading-tight">
              <TextReveal text="Capital Markets & Regulatory Perspectives" delay={0.1} />
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Analytical viewpoints from Amarnath Securities research desk on Indian structured finance,
              SEBI listing norms, corporate transactions, and macroeconomic shifts.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {selectedArticle ? (
              /* Article Reader View */
              <motion.article
                key={selectedArticle.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="max-w-3xl mx-auto"
              >
                {/* Back Button */}
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[#0D9488] hover:text-[#0F766E] transition-colors cursor-pointer mb-8 group"
                >
                  <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                  <span>Back to All Insights</span>
                </button>

                {/* Article Card */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_8px_30px_-8px_rgba(15,23,42,0.07)] overflow-hidden">
                  {/* Article Header */}
                  <div className="p-8 sm:p-10 border-b border-slate-100">
                    <div className="flex items-center gap-2.5 text-xs text-[#9A7B38] font-mono font-bold uppercase tracking-wider mb-4 bg-amber-50 border border-amber-200/80 w-fit px-3 py-1.5 rounded-lg">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{selectedArticle.category}</span>
                    </div>

                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0A1128] leading-tight mb-5">
                      {selectedArticle.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#0D9488]" />
                        <span>{selectedArticle.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#0D9488]" />
                        <span>{selectedArticle.readTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#0D9488]" />
                        <span>{selectedArticle.author}</span>
                      </div>
                    </div>
                  </div>

                  {/* Article Body */}
                  <div className="p-8 sm:p-10 space-y-5 text-slate-700 text-sm sm:text-[15px] leading-[1.85] font-sans">
                    {selectedArticle.content.split('\n\n').map((para, idx) => (
                      <p key={idx} className={idx === 0 ? 'text-[#0A1128] font-medium text-base leading-relaxed' : ''}>
                        {para}
                      </p>
                    ))}
                  </div>

                  {/* Article Footer */}
                  <div className="px-8 sm:px-10 py-6 bg-[#F8FAFC] border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="text-xs text-slate-500 font-mono">
                      Amarnath Securities Limited · Research &amp; Advisory Division
                    </div>
                    <MagneticButton
                      onClick={() => onNavigate('contact')}
                      className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#0A1128] text-white hover:bg-[#0D9488] transition-colors cursor-pointer flex items-center gap-2"
                    >
                      Consult Research &amp; Advisory Desk
                      <ArrowRight className="w-3.5 h-3.5" />
                    </MagneticButton>
                  </div>
                </div>
              </motion.article>
            ) : (
              /* Articles Grid */
              <ScrollReveal direction="up" distance={20}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {INSIGHTS.map((article, idx) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.06, ease: 'easeOut' }}
                      onClick={() => setSelectedArticle(article)}
                      className="bg-white rounded-2xl border border-slate-200/90 hover:border-[#0D9488]/50 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] hover:shadow-[0_12px_30px_-8px_rgba(15,23,42,0.10)] transition-all duration-250 cursor-pointer flex flex-col group overflow-hidden"
                    >
                      {/* Card Top Accent */}
                      <div className="h-[3px] w-full bg-gradient-to-r from-[#0D9488] to-[#9A7B38] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="p-6 sm:p-7 flex flex-col flex-1">
                        {/* Category + Arrow */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#9A7B38] bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-md">
                            {article.category}
                          </span>
                          <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-[#0D9488] flex items-center justify-center transition-all duration-200 shrink-0">
                            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="font-display font-semibold text-[#0A1128] text-base sm:text-lg leading-snug group-hover:text-[#0D9488] transition-colors mb-3 flex-1">
                          {article.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-5">
                          {article.excerpt}
                        </p>

                        {/* Card Footer */}
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{article.date}</span>
                            </div>
                            <span>·</span>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{article.readTime}</span>
                            </div>
                          </div>
                          <span className="text-[#0D9488] text-xs font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                            Read <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-12 text-center">
                  <p className="text-sm text-slate-500 mb-4 font-mono">
                    For research enquiries or customised market analysis
                  </p>
                  <MagneticButton
                    onClick={() => onNavigate('contact')}
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm text-white bg-[#0A1128] hover:bg-[#0D9488] transition-colors cursor-pointer shadow-md hover:shadow-lg"
                  >
                    Contact Research &amp; Advisory Desk
                    <ArrowRight className="w-4 h-4" />
                  </MagneticButton>
                </div>
              </ScrollReveal>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

