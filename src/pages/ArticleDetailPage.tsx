import React, { useEffect, useMemo } from 'react';
import { PageRoute } from '../types';
import { INSIGHTS, COMPANY_DETAILS } from '../data/mockData';
import { ArticleSidebar } from '../components/ArticleSidebar';
import { ArticleNotFound } from '../components/ArticleNotFound';
import { TextReveal } from '../components/TextReveal';
import { MagneticButton } from '../components/MagneticButton';
import {
  Calendar,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ListChecks,
  Check,
  TrendingUp
} from 'lucide-react';

interface ArticleDetailPageProps {
  articleId: string;
  onNavigate: (route: PageRoute) => void;
}

const RELATED_ARTICLE_LIMIT = 2;

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({ articleId, onNavigate }) => {
  const article = INSIGHTS.find((candidate) => candidate.id === articleId);
  const articleIndex = article ? INSIGHTS.indexOf(article) : -1;

  const relatedArticles = useMemo(
    () => (article ? INSIGHTS.filter((candidate) => candidate.id !== article.id).slice(0, RELATED_ARTICLE_LIMIT) : []),
    [article]
  );

  const previousArticle = articleIndex > 0 ? INSIGHTS[articleIndex - 1] : null;
  const nextArticle =
    articleIndex >= 0 && articleIndex < INSIGHTS.length - 1 ? INSIGHTS[articleIndex + 1] : null;

  useEffect(() => {
    document.title = article
      ? `${article.title} | ${COMPANY_DETAILS.name}`
      : `Article Not Found | ${COMPANY_DETAILS.name}`;

    return () => {
      document.title = `${COMPANY_DETAILS.name} | ${COMPANY_DETAILS.tagline}`;
    };
  }, [article]);

  if (!article) {
    return <ArticleNotFound onNavigate={onNavigate} />;
  }

  const paragraphs = article.content.split('\n\n').filter((paragraph) => paragraph.trim().length > 0);

  return (
    <div className="w-full bg-white text-[#0A1128] min-h-screen font-sans">
      {/* Article header band */}
      <div className="bg-[#F8FAFC] border-b border-slate-200/80 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <button
            type="button"
            onClick={() => onNavigate('insights')}
            className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[#0D9488] hover:text-[#0F766E] transition-colors cursor-pointer mb-7 group"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>All Market Insights</span>
          </button>

          <div className="max-w-4xl space-y-5">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-widest text-[#9A7B38] bg-amber-50 border border-amber-200/80 px-3 py-1.5 rounded-lg">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{article.category}</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl md:text-[2.6rem] font-bold text-[#0A1128] tracking-tight leading-tight">
              <TextReveal text={article.title} delay={0.05} />
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-3xl">
              {article.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500 font-mono pt-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#0D9488]" />
                {article.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#0D9488]" />
                {article.readTime}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#0D9488]" />
                {article.author}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Article body + supporting rail */}
      <div className="py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_330px] gap-10 lg:gap-12">
          <article className="min-w-0">
            <div className="rounded-2xl border border-slate-200/90 bg-white shadow-[0_8px_30px_-8px_rgba(15,23,42,0.07)] overflow-hidden">
              {/* Editorial Feature Image */}
              <div className="relative aspect-21/9 sm:aspect-28/9 min-h-[160px] sm:min-h-[220px] overflow-hidden bg-slate-100 border-b border-slate-100">
                <img
                  src="/images/insights-market-intelligence.webp"
                  alt="Market intelligence research publication and corporate finance analytical briefing"
                  width={1200}
                  height={675}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Key takeaways */}
              <div className="p-7 sm:p-9 border-b border-slate-100 bg-teal-50/30">
                <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-widest text-[#0D9488] mb-5">
                  <ListChecks className="w-4 h-4" />
                  <span>Key Takeaways</span>
                </div>

                <ul className="space-y-3">
                  {article.keyTakeaways.map((takeaway) => (
                    <li key={takeaway} className="flex items-start gap-3">
                      <span className="w-4 h-4 rounded-full bg-white border border-[#0D9488]/30 flex items-center justify-center shrink-0 mt-[3px]">
                        <Check className="w-2.5 h-2.5 text-[#0D9488]" />
                      </span>
                      <span className="text-sm text-slate-700 leading-relaxed">{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Narrative */}
              <div className="p-7 sm:p-9 space-y-5 text-slate-700 text-sm sm:text-[15px] leading-[1.9]">
                {paragraphs.map((paragraph, index) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className={
                      index === 0
                        ? 'text-[#0A1128] text-base sm:text-[17px] font-medium leading-[1.85]'
                        : undefined
                    }
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Topics and attribution */}
              <div className="px-7 sm:px-9 py-6 bg-[#F8FAFC] border-t border-slate-100 space-y-5">
                <div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-3">
                    Topics
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {article.topics.map((topic) => (
                      <span
                        key={topic}
                        className="text-[11px] font-mono text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-md"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-200/70 pt-4">
                  Published by {COMPANY_DETAILS.name} for general information only. This note does not
                  constitute investment advice or an offer to buy or sell any security, and should not be
                  relied upon as the basis for any investment decision.
                </p>
              </div>
            </div>

            {/* Previous / next note */}
            <nav aria-label="Article navigation" className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {previousArticle ? (
                <button
                  type="button"
                  onClick={() => onNavigate(`insights/${previousArticle.id}`)}
                  className="text-left rounded-xl border border-slate-200/90 bg-white hover:border-[#0D9488]/50 p-5 transition-all duration-200 cursor-pointer group"
                >
                  <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-2">
                    <ChevronLeft className="w-3 h-3 transition-transform group-hover:-translate-x-0.5" />
                    Previous Note
                  </span>
                  <span className="block text-sm font-semibold text-[#0A1128] leading-snug group-hover:text-[#0D9488] transition-colors line-clamp-2">
                    {previousArticle.title}
                  </span>
                </button>
              ) : (
                <div aria-hidden="true" className="hidden sm:block" />
              )}

              {nextArticle ? (
                <button
                  type="button"
                  onClick={() => onNavigate(`insights/${nextArticle.id}`)}
                  className="text-left sm:text-right rounded-xl border border-slate-200/90 bg-white hover:border-[#0D9488]/50 p-5 transition-all duration-200 cursor-pointer group"
                >
                  <span className="flex items-center sm:justify-end gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-2">
                    Next Note
                    <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                  <span className="block text-sm font-semibold text-[#0A1128] leading-snug group-hover:text-[#0D9488] transition-colors line-clamp-2">
                    {nextArticle.title}
                  </span>
                </button>
              ) : (
                <div aria-hidden="true" className="hidden sm:block" />
              )}
            </nav>

            {/* Research desk call to action */}
            <div className="mt-8 rounded-2xl border border-slate-200/90 bg-[#0A1128] p-7 sm:p-8 text-white sm:flex sm:items-center sm:justify-between gap-6">
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#C5A880] mb-2">
                  Research & Advisory Desk
                </div>
                <h2 className="font-display text-lg font-semibold leading-snug mb-1.5">
                  Discuss the themes in this note
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                  Sector analysis, transaction evaluation, governance and disclosure queries may be
                  directed to the Company’s research and advisory desk.
                </p>
              </div>

              <MagneticButton
                onClick={() => onNavigate('contact')}
                className="mt-5 sm:mt-0 shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold text-[#0A1128] bg-white hover:bg-[#0D9488] hover:text-white transition-colors cursor-pointer"
              >
                Contact the desk
                <ArrowRight className="w-3.5 h-3.5" />
              </MagneticButton>
            </div>
          </article>

          <ArticleSidebar
            article={article}
            relatedArticles={relatedArticles}
            onNavigate={onNavigate}
          />
        </div>
      </div>
    </div>
  );
};
