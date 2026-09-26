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
  Share2, 
  FileText,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InsightsPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const InsightsPage: React.FC<InsightsPageProps> = ({ onNavigate }) => {
  const [selectedArticle, setSelectedArticle] = useState<InsightArticle | null>(null);

  return (
    <div className="w-full bg-[#060B18] text-white min-h-screen py-10 px-4 sm:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#14B8A6]">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Market Intelligence & Research</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight">
            <TextReveal text="Capital Markets & Regulatory Perspectives" delay={0.1} />
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Analytical viewpoints from Amarnath Securities research desk on Indian structured finance, SEBI listing norms, corporate debt syndication, and macroeconomic shifts.
          </p>
        </div>

        {/* If article selected, show full reader view */}
        <AnimatePresence mode="wait">
          {selectedArticle ? (
            <motion.article
              key={selectedArticle.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="p-8 sm:p-12 rounded-2xl institutional-card border border-white/10 space-y-8 max-w-4xl mx-auto shadow-2xl"
            >
              <button
                onClick={() => setSelectedArticle(null)}
                className="inline-flex items-center gap-2 text-xs font-mono text-[#14B8A6] hover:text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to All Insights</span>
              </button>

              <div className="space-y-4 border-b border-white/10 pb-6">
                <div className="flex items-center gap-3 text-xs text-[#C5A880] font-mono">
                  <span>{selectedArticle.category}</span>
                  <span>•</span>
                  <span>{selectedArticle.date}</span>
                  <span>•</span>
                  <span>{selectedArticle.readTime}</span>
                </div>

                <h2 className="font-display text-2xl sm:text-4xl font-bold text-white leading-tight">
                  {selectedArticle.title}
                </h2>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <User className="w-3.5 h-3.5 text-[#14B8A6]" />
                  <span>Authored by {selectedArticle.author}</span>
                </div>
              </div>

              <div className="space-y-6 text-slate-200 text-sm sm:text-base leading-relaxed font-sans">
                {selectedArticle.content.split('\n\n').map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>

              <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-400">
                  Amarnath Securities Limited • Research Division
                </div>
                <MagneticButton
                  onClick={() => onNavigate('contact')}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#14B8A6] text-[#060B18] hover:bg-[#2DD4BF] transition-colors cursor-pointer"
                >
                  Consult Research & Advisory Desk
                </MagneticButton>
              </div>
            </motion.article>
          ) : (
            /* Articles Grid */
            <ScrollReveal direction="up" distance={20}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {INSIGHTS.map((article) => (
                  <div
                    key={article.id}
                    onClick={() => setSelectedArticle(article)}
                    className="p-6 sm:p-8 rounded-2xl institutional-card border border-white/10 hover:border-[#14B8A6]/40 transition-all cursor-pointer flex flex-col justify-between group shadow-xl"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-mono text-[#C5A880] text-[11px]">{article.category}</span>
                        <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 group-hover:bg-[#14B8A6] group-hover:text-[#060B18] group-hover:border-[#14B8A6] text-slate-400 flex items-center justify-center transition-all duration-200">
                          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                      </div>

                      <h3 className="font-display font-semibold text-lg sm:text-xl text-white group-hover:text-[#14B8A6] transition-colors leading-snug">
                        {article.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                        {article.excerpt}
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-mono text-[11px]">{article.date}</span>
                      <span className="text-[#14B8A6] font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Read Analysis <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
