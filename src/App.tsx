import React, { useState, useEffect } from 'react';
import { PageRoute, InvestorDocument } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Breadcrumbs } from './components/Breadcrumbs';
import { DocumentModal } from './components/DocumentModal';
import { ScrollProgress } from './components/ScrollProgress';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { CapabilitiesPage } from './pages/CapabilitiesPage';
import { InvestorRelationsPage } from './pages/InvestorRelationsPage';
import { InsightsPage } from './pages/InsightsPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { ContactPage } from './pages/ContactPage';
import { AnimatePresence, motion } from 'motion/react';

const getInitialRoute = (): PageRoute => {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.replace(/^#\/?/, '').trim();
    if (hash) {
      return hash as PageRoute;
    }
    const path = window.location.pathname.replace(/^\//, '').replace(/\/$/, '').trim();
    if (path) {
      return path as PageRoute;
    }
  }
  return 'home';
};

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>(getInitialRoute);
  const [activeDocument, setActiveDocument] = useState<InvestorDocument | null>(null);

  // Scroll to top on navigation immediately so newly mounted page begins at top
  const handleNavigate = (route: PageRoute) => {
    setCurrentRoute(route);
    window.scrollTo(0, 0);
  };

  // Handle browser popstate / back button / hash changes
  useEffect(() => {
    const handleRouteChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').trim();
      const path = window.location.pathname.replace(/^\//, '').replace(/\/$/, '').trim();
      const resolved = (hash || path || 'home') as PageRoute;
      if (resolved !== currentRoute) {
        setCurrentRoute(resolved);
        window.scrollTo(0, 0);
      }
    };
    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [currentRoute]);

  // Sync hash when route changes
  useEffect(() => {
    if (currentRoute === 'home') {
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname);
      }
    } else {
      const targetHash = `#${currentRoute}`;
      if (window.location.hash !== targetHash) {
        window.location.hash = currentRoute;
      }
    }
  }, [currentRoute]);

  // Route selector
  const renderCurrentPage = () => {
    if (currentRoute === 'home') {
      return (
        <HomePage
          onNavigate={handleNavigate}
          onOpenDocument={(doc) => setActiveDocument(doc)}
        />
      );
    }

    if (currentRoute.startsWith('about')) {
      return <AboutPage currentRoute={currentRoute} onNavigate={handleNavigate} />;
    }

    if (currentRoute.startsWith('capabilities')) {
      return <CapabilitiesPage currentRoute={currentRoute} onNavigate={handleNavigate} />;
    }

    if (currentRoute.startsWith('investor-relations')) {
      return (
        <InvestorRelationsPage
          currentRoute={currentRoute}
          onNavigate={handleNavigate}
          onOpenDocument={(doc) => setActiveDocument(doc)}
        />
      );
    }

    if (currentRoute === 'insights') {
      return <InsightsPage onNavigate={handleNavigate} />;
    }

    if (currentRoute.startsWith('insights/')) {
      const articleId = currentRoute.slice('insights/'.length);
      return <ArticleDetailPage articleId={articleId} onNavigate={handleNavigate} />;
    }

    if (currentRoute === 'contact') {
      return <ContactPage onNavigate={handleNavigate} />;
    }

    return (
      <HomePage
        onNavigate={handleNavigate}
        onOpenDocument={(doc) => setActiveDocument(doc)}
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#FAFBFD] text-[#0A1128] flex flex-col selection:bg-[#0D9488]/20 selection:text-[#0A1128]">
      {/* Site-wide Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Top Main Navigation Bar */}
      <Navbar currentRoute={currentRoute} onNavigate={handleNavigate} />

      {/* Breadcrumbs for non-home pages */}
      {currentRoute !== 'home' && (
        <div className="bg-white/85 border-b border-slate-200/80 py-2.5 backdrop-blur-xs">
          <Breadcrumbs currentRoute={currentRoute} onNavigate={handleNavigate} />
        </div>
      )}

      {/* Main Page Body with subtle page transition */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRoute}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {renderCurrentPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Institutional Statutory Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Interactive Modal for viewing and downloading statutory documents */}
      <DocumentModal
        document={activeDocument}
        onClose={() => setActiveDocument(null)}
      />
    </div>
  );
}
