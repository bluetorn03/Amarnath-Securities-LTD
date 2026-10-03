import React from 'react';
import { InsightArticle, PageRoute } from '../types';
import { Calendar, Clock, ArrowUpRight, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface InsightCardProps {
  article: InsightArticle;
  onNavigate: (route: PageRoute) => void;
  /** Position in the grid, used only to stagger the entrance animation. */
  index?: number;
  /** `compact` is used for the related-articles rail on an article page. */
  variant?: 'default' | 'compact';
}

export const InsightCard: React.FC<InsightCardProps> = ({
  article,
  onNavigate,
  index = 0,
  variant = 'default'
}) => {
  const route: PageRoute = `insights/${article.id}`;

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={() => onNavigate(route)}
        aria-label={`Read article: ${article.title}`}
        className="w-full text-left rounded-xl border border-slate-200/90 bg-white hover:border-[#0D9488]/50 p-5 transition-all duration-200 cursor-pointer group flex items-start justify-between gap-4 hover:shadow-[0_8px_24px_-10px_rgba(15,23,42,0.12)]"
      >
        <div className="min-w-0">
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#9A7B38] mb-2">
            {article.category}
          </div>
          <h4 className="font-display font-semibold text-sm text-[#0A1128] leading-snug group-hover:text-[#0D9488] transition-colors line-clamp-2">
            {article.title}
          </h4>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <span>{article.date}</span>
            <span>·</span>
            <span>{article.readTime}</span>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0D9488] group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
      </button>
    );
  }

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: 'easeOut' }}
      onClick={() => onNavigate(route)}
      aria-label={`Read article: ${article.title}`}
      className="bg-white rounded-2xl border border-slate-200/90 hover:border-[#0D9488]/50 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] hover:shadow-[0_12px_30px_-8px_rgba(15,23,42,0.10)] transition-all duration-250 cursor-pointer flex flex-col group overflow-hidden text-left w-full"
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
    </motion.button>
  );
};
