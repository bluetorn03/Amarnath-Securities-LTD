import React, { useState } from 'react';
import { InsightArticle, PageRoute } from '../types';
import { InsightCard } from './InsightCard';
import {
  Calendar,
  Clock,
  User,
  Link2,
  Printer,
  Check,
  Layers,
  Share2
} from 'lucide-react';

interface ArticleSidebarProps {
  article: InsightArticle;
  relatedArticles: InsightArticle[];
  onNavigate: (route: PageRoute) => void;
}

const COPY_FEEDBACK_MS = 2000;

export const ArticleSidebar: React.FC<ArticleSidebarProps> = ({
  article,
  relatedArticles,
  onNavigate
}) => {
  const [hasCopied, setHasCopied] = useState(false);

  const handleCopyLink = async () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setHasCopied(true);
      window.setTimeout(() => setHasCopied(false), COPY_FEEDBACK_MS);
    } catch {
      // Clipboard access can be denied by the browser; the action simply does nothing.
      setHasCopied(false);
    }
  };

  const metaRows = [
    { icon: Calendar, label: 'Published', value: article.date },
    { icon: Clock, label: 'Reading Time', value: article.readTime },
    { icon: User, label: 'Division', value: article.author },
    { icon: Layers, label: 'Category', value: article.category }
  ];

  return (
    <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
      {/* Publication details */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_4px_20px_-6px_rgba(15,23,42,0.05)]">
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#9A7B38] mb-4">
          Publication Details
        </div>

        <dl className="space-y-3.5">
          {metaRows.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <Icon className="w-3.5 h-3.5 text-[#0D9488] mt-0.5 shrink-0" />
              <div className="min-w-0">
                <dt className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  {label}
                </dt>
                <dd className="text-xs text-slate-700 font-medium leading-snug">{value}</dd>
              </div>
            </div>
          ))}
        </dl>

        {/* Share actions */}
        <div className="mt-6 pt-5 border-t border-slate-100 space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">
            <Share2 className="w-3 h-3" />
            <span>Share</span>
          </div>

          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-300 text-slate-800 bg-white hover:border-[#0D9488] hover:text-[#0D9488] transition-colors cursor-pointer"
          >
            {hasCopied ? <Check className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
            <span>{hasCopied ? 'Link copied' : 'Copy article link'}</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-300 text-slate-800 bg-white hover:border-[#0D9488] hover:text-[#0D9488] transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Print this note
          </button>
        </div>
      </div>

      {/* Related articles */}
      {relatedArticles.length > 0 && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_4px_20px_-6px_rgba(15,23,42,0.05)]">
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#9A7B38] mb-4">
            Related Notes
          </div>
          <div className="space-y-3">
            {relatedArticles.map((related) => (
              <InsightCard
                key={related.id}
                article={related}
                onNavigate={onNavigate}
                variant="compact"
              />
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};
