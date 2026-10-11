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
import { AdminCmsPage } from './pages/AdminCmsPage';
import { AnimatePresence, motion } from 'motion/react';

function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('asl_visitor_uuid');
  if (!id) {
    id = 'v_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
    localStorage.setItem('asl_visitor_uuid', id);
  }
  return id;
}

const getInitialRoute = (): PageRoute => {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.replace(/^#\/?/, '').trim();
    if (hash.startsWith('admin')) {
      return 'admin';
    }
    if (hash) {
      return hash as PageRoute;
    }
    const path = window.location.pathname.replace(/^\//, '').replace(/\/$/, '').trim();
    if (path.startsWith('admin')) {
      return 'admin';
    }
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

      // If user is currently in admin and pressing browser back tries to leave admin to public
      if (currentRoute === 'admin' && !hash.startsWith('admin')) {
        const token = localStorage.getItem('asl_admin_token');
        if (token) {
          const confirmLeave = window.confirm(
            'Exit Administration Console?\n\nAre you sure you want to leave the management workstation and return to the public website?'
          );
          if (!confirmLeave) {
            // Cancel exit, preserve admin hash
            window.location.hash = '#admin';
            return;
          }
        }
      }

      // If hash is inside admin (e.g. #admin/pages or #admin), keep currentRoute as 'admin'
      if (hash.startsWith('admin')) {
        if (currentRoute !== 'admin') {
          setCurrentRoute('admin');
          window.scrollTo(0, 0);
        }
        return;
      }

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
    } else if (currentRoute === 'admin') {
      // Don't overwrite sub-admin hashes like #admin/pages
      if (!window.location.hash.startsWith('#admin')) {
        window.location.hash = 'admin';
      }
    } else {
      const targetHash = `#${currentRoute}`;
      if (window.location.hash !== targetHash) {
        window.location.hash = currentRoute;
      }
    }
  }, [currentRoute]);

  // Track dynamic page visits in real database (increments +1 ONLY for new unique visitors per page)
  useEffect(() => {
    if (currentRoute && !currentRoute.startsWith('admin')) {
      try {
        const visitorId = getOrCreateVisitorId();
        fetch('/api/analytics/visit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ route: currentRoute, visitorId })
        }).catch(() => {
          // Graceful fallback if network is unreachable
        });
      } catch {
        // Non-blocking telemetry
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

    if (currentRoute === 'admin') {
      return <AdminCmsPage onNavigate={handleNavigate} />;
    }

    return (
      <HomePage
        onNavigate={handleNavigate}
        onOpenDocument={(doc) => setActiveDocument(doc)}
      />
    );
  };

  const isAdminRoute = currentRoute === 'admin';

  return (
    <div className="min-h-screen bg-[#FAFBFD] text-[#0A1128] flex flex-col selection:bg-[#0D9488]/20 selection:text-[#0A1128]">
      {/* Site-wide Scroll Progress Indicator */}
      {!isAdminRoute && <ScrollProgress />}

      {/* Top Main Navigation Bar */}
      {!isAdminRoute && <Navbar currentRoute={currentRoute} onNavigate={handleNavigate} />}

      {/* Breadcrumbs for non-home pages */}
      {!isAdminRoute && currentRoute !== 'home' && (
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
      {!isAdminRoute && <Footer onNavigate={handleNavigate} />}

      {/* Interactive Modal for viewing and downloading statutory documents */}
      <DocumentModal
        document={activeDocument}
        onClose={() => setActiveDocument(null)}
      />
    </div>
  );
}
