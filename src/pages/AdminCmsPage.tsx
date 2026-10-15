import React, { useState, useEffect, useCallback } from 'react';
import { 
  PageRoute, 
  InvestorDocument, 
  DocumentCategory, 
  AdminUser, 
  AdminRole, 
  AdminViewId, 
  AuditLogItem, 
  EnquiryItem, 
  SystemHealthData, 
  DatabaseBackupItem 
} from '../types';
import { AmarnathLogo } from '../components/AmarnathLogo';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminHeader } from '../components/admin/AdminHeader';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { AdminDocuments } from '../components/admin/AdminDocuments';
import { AdminRegulation46 } from '../components/admin/AdminRegulation46';
import { AdminGovernance } from '../components/admin/AdminGovernance';
import { AdminInvestorSupport } from '../components/admin/AdminInvestorSupport';
import { AdminUsers } from '../components/admin/AdminUsers';
import { AdminAuditLogs } from '../components/admin/AdminAuditLogs';
import { AdminBackups } from '../components/admin/AdminBackups';
import { AdminSettings } from '../components/admin/AdminSettings';
import { AdminSystemHealth } from '../components/admin/AdminSystemHealth';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  RefreshCw, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Key, 
  Upload,
  Globe,
  ExternalLink,
  LogOut,
  Users,
  Activity,
  ShieldAlert,
  Clock
} from 'lucide-react';

interface AdminCmsPageProps {
  onNavigate: (route: PageRoute) => void;
}

const getInitialAdminView = (): AdminViewId => {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.replace(/^#\/?/, '').trim();
    if (hash.startsWith('admin/')) {
      const sub = hash.split('/')[1] as AdminViewId;
      if (sub) return sub;
    }
  }
  return 'dashboard';
};

export const AdminCmsPage: React.FC<AdminCmsPageProps> = ({ onNavigate }) => {
  // Authentication State
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('asl_admin_token'));
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Layout State & Sub-Route Hash Synchronization
  const [activeView, setActiveView] = useState<AdminViewId>(getInitialAdminView);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);

  const handleSelectView = useCallback((view: AdminViewId) => {
    setActiveView(view);
    setMobileDrawerOpen(false);
    const targetHash = view === 'dashboard' ? '#admin' : `#admin/${view}`;
    if (typeof window !== 'undefined' && window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    }
  }, []);

  // Listen to browser Back / Forward buttons and sync internal admin view
  useEffect(() => {
    const syncViewFromHash = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').trim();
      if (hash === 'admin' || hash === 'admin/') {
        setActiveView('dashboard');
      } else if (hash.startsWith('admin/')) {
        const sub = hash.split('/')[1] as AdminViewId;
        if (sub) {
          setActiveView(sub);
        }
      }
    };

    window.addEventListener('hashchange', syncViewFromHash);
    return () => window.removeEventListener('hashchange', syncViewFromHash);
  }, []);

  // Toast Notification
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const triggerNotification = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Data Store
  const [documents, setDocuments] = useState<InvestorDocument[]>([]);
  const [docsLoading, setDocsLoading] = useState<boolean>(false);

  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [enquiriesLoading, setEnquiriesLoading] = useState<boolean>(false);

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [auditLoading, setAuditLoading] = useState<boolean>(false);

  const [directors, setDirectors] = useState<any[]>([]);
  const [committees, setCommittees] = useState<any[]>([]);
  const [kmpContacts, setKmpContacts] = useState<any[]>([]);
  const [govLoading, setGovLoading] = useState<boolean>(false);

  const [regClauses, setRegClauses] = useState<any[]>([]);
  const [regLoading, setRegLoading] = useState<boolean>(false);

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState<boolean>(false);

  const [backups, setBackups] = useState<DatabaseBackupItem[]>([]);
  const [backupsLoading, setBackupsLoading] = useState<boolean>(false);
  const [isTriggeringBackup, setIsTriggeringBackup] = useState<boolean>(false);

  const [systemHealth, setSystemHealth] = useState<SystemHealthData | null>(null);
  const [healthLoading, setHealthLoading] = useState<boolean>(false);

  // Dynamic Page Visits State (Database Connected)
  const [pageVisitsData, setPageVisitsData] = useState<{
    totalVisits: number;
    totalUniqueUsers?: number;
    totalPageHits?: number;
    lastActiveAt?: string | null;
    activePages: number;
    topPage: any;
    data: any[];
  } | null>(null);
  const [visitsLoading, setVisitsLoading] = useState<boolean>(false);

  // Exit & Logout Confirmation Modals
  const [showExitModal, setShowExitModal] = useState<boolean>(false);
  const [pendingExitRoute, setPendingExitRoute] = useState<PageRoute>('home');
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);

  const handleRequestExit = (targetRoute: PageRoute = 'home') => {
    setPendingExitRoute(targetRoute);
    setShowExitModal(true);
  };

  const handleConfirmExit = () => {
    setShowExitModal(false);
    onNavigate(pendingExitRoute);
  };

  const handleRequestLogout = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    handleLogout();
  };

  // Global Modals State
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [currPass, setCurrPass] = useState<string>('');
  const [newPass, setNewPass] = useState<string>('');
  const [passError, setPassError] = useState<string | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState<boolean>(false);

  const [showAddDocModal, setShowAddDocModal] = useState<boolean>(false);
  const [addDocData, setAddDocData] = useState({
    title: '',
    category: 'Financial Results' as DocumentCategory,
    financialYear: 'FY 2025-26',
    quarter: 'Q3',
    filingDate: new Date().toISOString().split('T')[0],
    bseAckNumber: '',
    description: '',
    sourceType: 'upload' as 'upload' | 'file_url' | 'external_url',
    status: 'published' as 'published' | 'draft' | 'review'
  });
  const [uploadFileObj, setUploadFileObj] = useState<File | null>(null);
  const [isSubmittingNewDoc, setIsSubmittingNewDoc] = useState<boolean>(false);
  const [addDocError, setAddDocError] = useState<string | null>(null);

  // Authenticate session on mount
  useEffect(() => {
    if (!token) {
      setAuthLoading(false);
      return;
    }

    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        if (!res.ok) throw new Error('Session invalid');
        return res.json();
      })
      .then((data) => {
        if (data.success && data.user) {
          setCurrentUser(data.user);
        } else {
          handleLogout();
        }
      })
      .catch(() => {
        handleLogout();
      })
      .finally(() => {
        setAuthLoading(false);
      });
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('asl_admin_token');
    setToken(null);
    setCurrentUser(null);
  };

  // Login Submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication rejected.');
      }

      localStorage.setItem('asl_admin_token', data.token);
      setToken(data.token);
      setCurrentUser(data.user);
      triggerNotification('success', `Welcome, ${data.user.name}. Regulatory session active.`);
    } catch (err: any) {
      setLoginError(err.message || 'Authentication failed.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 8) {
      setPassError('New password must contain at least 8 characters.');
      return;
    }
    setIsUpdatingPassword(true);
    setPassError(null);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword: currPass, newPassword: newPass })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to update credentials.');

      triggerNotification('success', 'Administrative password updated successfully.');
      setShowPasswordModal(false);
      setCurrPass('');
      setNewPass('');
    } catch (err: any) {
      setPassError(err.message || 'Error updating password.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Fetch API Data
  const fetchAllData = useCallback(async () => {
    if (!token) return;

    // 1. System Health
    setHealthLoading(true);
    fetch('/api/system/health', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => d.success && setSystemHealth(d))
      .catch(console.error)
      .finally(() => setHealthLoading(false));

    // 2. Documents
    setDocsLoading(true);
    fetch('/api/documents', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => d.success && setDocuments(d.data))
      .catch(console.error)
      .finally(() => setDocsLoading(false));

    // 3. Enquiries
    setEnquiriesLoading(true);
    fetch('/api/enquiries', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => d.success && setEnquiries(d.data))
      .catch(console.error)
      .finally(() => setEnquiriesLoading(false));

    // 4. Audit Logs
    setAuditLoading(true);
    fetch('/api/audit', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => d.success && setAuditLogs(d.data))
      .catch(console.error)
      .finally(() => setAuditLoading(false));

    // 5. Governance (Directors, Committees, KMP)
    setGovLoading(true);
    Promise.all([
      fetch('/api/content/directors', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      fetch('/api/content/committees', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      fetch('/api/content/kmp', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json())
    ])
      .then(([dirData, commData, kmpData]) => {
        if (dirData.success) setDirectors(dirData.data);
        if (commData.success) setCommittees(commData.data);
        if (kmpData.success) setKmpContacts(kmpData.data);
      })
      .catch(console.error)
      .finally(() => setGovLoading(false));

    // 6. Regulation 46
    setRegLoading(true);
    fetch('/api/content/regulation-46', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => d.success && setRegClauses(d.data))
      .catch(console.error)
      .finally(() => setRegLoading(false));

    // 7. Users & Backups (if super_admin)
    if (currentUser?.role === 'super_admin') {
      setUsersLoading(true);
      fetch('/api/users', { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => r.json())
        .then((d) => d.success && setUsers(d.data))
        .catch(console.error)
        .finally(() => setUsersLoading(false));

      setBackupsLoading(true);
      fetch('/api/system/backups', { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => r.json())
        .then((d) => d.success && setBackups(d.data))
        .catch(console.error)
        .finally(() => setBackupsLoading(false));
    }

    // 8. Page Visits (Live Analytics from Database)
    setVisitsLoading(true);
    fetch('/api/analytics/visits', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setPageVisitsData(d);
      })
      .catch(console.error)
      .finally(() => setVisitsLoading(false));
  }, [token, currentUser?.role]);

  useEffect(() => {
    if (token && currentUser) {
      fetchAllData();
    }
  }, [token, currentUser, fetchAllData]);

  // Document Lifecycle Handlers
  const handleApproveDoc = async (id: string) => {
    const res = await fetch(`/api/documents/${id}/approve`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    const d = await res.json();
    if (!res.ok || !d.success) throw new Error(d.error || 'Approval failed.');
    triggerNotification('success', 'Document approved and published to registry.');
    fetchAllData();
  };

  const handlePublishDoc = async (id: string) => {
    const res = await fetch(`/api/documents/${id}/publish`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    const d = await res.json();
    if (!res.ok || !d.success) throw new Error(d.error || 'Publishing failed.');
    triggerNotification('success', 'Document published to public registry.');
    fetchAllData();
  };

  const handleUnpublishDoc = async (id: string) => {
    const res = await fetch(`/api/documents/${id}/unpublish`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    const d = await res.json();
    if (!res.ok || !d.success) throw new Error(d.error || 'Unpublish failed.');
    triggerNotification('success', 'Document reverted to draft.');
    fetchAllData();
  };

  const handleArchiveDoc = async (id: string) => {
    const res = await fetch(`/api/documents/${id}/archive`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    const d = await res.json();
    if (!res.ok || !d.success) throw new Error(d.error || 'Archiving failed.');
    triggerNotification('success', 'Document archived from public index.');
    fetchAllData();
  };

  const handleRestoreDoc = async (id: string) => {
    const res = await fetch(`/api/documents/${id}/restore`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    const d = await res.json();
    if (!res.ok || !d.success) throw new Error(d.error || 'Restoration failed.');
    triggerNotification('success', 'Archived document restored.');
    fetchAllData();
  };

  const handleDeleteDoc = async (id: string) => {
    const res = await fetch(`/api/documents/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    const d = await res.json();
    if (!res.ok || !d.success) throw new Error(d.error || 'Deletion failed.');
    triggerNotification('success', 'Document and version history purged.');
    fetchAllData();
  };

  const handleUpdateDocMetadata = async (id: string, metadata: any) => {
    const res = await fetch(`/api/documents/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(metadata)
    });
    const d = await res.json();
    if (!res.ok || !d.success) throw new Error(d.error || 'Metadata update failed.');
    triggerNotification('success', 'Document metadata updated.');
    fetchAllData();
  };

  const handleReplaceDocFile = async (id: string, file: File, summary: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('changeSummary', summary);
    formData.append('sourceType', 'upload');

    const res = await fetch(`/api/documents/${id}/replace`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    const d = await res.json();
    if (!res.ok || !d.success) throw new Error(d.error || 'File replacement failed.');
    triggerNotification('success', `File replaced. Semantic version incremented to ${d.version}.`);
    fetchAllData();
  };

  // Add Document Submission
  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileObj) {
      setAddDocError('A physical PDF document is required.');
      return;
    }

    setIsSubmittingNewDoc(true);
    setAddDocError(null);
    try {
      const formData = new FormData();
      formData.append('file', uploadFileObj);
      formData.append('title', addDocData.title);
      formData.append('category', addDocData.category);
      formData.append('financialYear', addDocData.financialYear);
      formData.append('quarter', addDocData.quarter);
      formData.append('filingDate', addDocData.filingDate);
      formData.append('bseAckNumber', addDocData.bseAckNumber || 'BSE/LODR/PENDING');
      formData.append('description', addDocData.description);
      formData.append('status', addDocData.status);
      formData.append('sourceType', 'upload');

      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const d = await res.json();
      if (!res.ok || !d.success) throw new Error(d.error || 'Error uploading filing.');

      triggerNotification('success', 'Regulatory document uploaded and registered.');
      setShowAddDocModal(false);
      setUploadFileObj(null);
      setAddDocData({
        title: '',
        category: 'Financial Results',
        financialYear: 'FY 2025-26',
        quarter: 'Q3',
        filingDate: new Date().toISOString().split('T')[0],
        bseAckNumber: '',
        description: '',
        sourceType: 'upload',
        status: 'published'
      });
      fetchAllData();
    } catch (err: any) {
      setAddDocError(err.message || 'Error uploading document.');
    } finally {
      setIsSubmittingNewDoc(false);
    }
  };

  // Regulation 46 Clause Update
  const handleUpdateReg46Clause = async (id: number, data: any) => {
    const res = await fetch(`/api/content/regulation-46/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    const d = await res.json();
    if (!res.ok || !d.success) throw new Error(d.error || 'Failed to update clause.');
    triggerNotification('success', 'Regulation 46 status updated and audited.');
    fetchAllData();
  };

  // Governance Updates
  const handleUpdateDirector = async (id: string, data: any) => {
    const res = await fetch(`/api/content/directors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data)
    });
    const d = await res.json();
    if (!res.ok || !d.success) throw new Error(d.error || 'Director update failed.');
    triggerNotification('success', 'Director profile reconciled.');
    fetchAllData();
  };

  const handleCreateDirector = async (data: any) => {
    const res = await fetch('/api/content/directors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data)
    });
    const d = await res.json();
    if (!res.ok || !d.success) throw new Error(d.error || 'Director creation failed.');
    triggerNotification('success', 'Director added.');
    fetchAllData();
  };

  const handleDeleteDirector = async (id: string) => {
    const res = await fetch(`/api/content/directors/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    const d = await res.json();
    if (!res.ok || !d.success) throw new Error(d.error || 'Director delete failed.');
    triggerNotification('success', 'Director removed.');
    fetchAllData();
  };

  const handleUpdateCommittee = async (id: string, data: any) => {
    const res = await fetch(`/api/content/committees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data)
    });
    const d = await res.json();
    if (!res.ok || !d.success) throw new Error(d.error || 'Committee update failed.');
    triggerNotification('success', 'Committee mandate updated.');
    fetchAllData();
  };

  const handleUpdateKmp = async (id: string, data: any) => {
    const res = await fetch(`/api/content/kmp/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data)
    });
    const d = await res.json();
    if (!res.ok || !d.success) throw new Error(d.error || 'KMP update failed.');
    triggerNotification('success', 'KMP details updated.');
    fetchAllData();
  };

  // Enquiry Status Update
  const handleUpdateEnquiryStatus = async (id: string, status: any, notes?: string) => {
    const res = await fetch(`/api/enquiries/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status, resolutionNotes: notes })
    });
    const d = await res.json();
    if (!res.ok || !d.success) throw new Error(d.error || 'Status update failed.');
    triggerNotification('success', 'Enquiry status updated.');
    fetchAllData();
  };

  // User Management
  const handleCreateUser = async (data: any) => {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data)
    });
    const d = await res.json();
    if (!res.ok || !d.success) throw new Error(d.error || 'User creation failed.');
    triggerNotification('success', `User '${data.name}' created.`);
    fetchAllData();
  };

  const handleUpdateUser = async (id: string, data: any) => {
    const res = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data)
    });
    const d = await res.json();
    if (!res.ok || !d.success) throw new Error(d.error || 'User update failed.');
    triggerNotification('success', 'User updated.');
    fetchAllData();
  };

  const handleResetUserPassword = async (id: string, newPassword: string) => {
    const res = await fetch(`/api/users/${id}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ newPassword })
    });
    const d = await res.json();
    if (!res.ok || !d.success) throw new Error(d.error || 'Password reset failed.');
    triggerNotification('success', 'User password reset.');
  };

  const handleDeleteUser = async (id: string) => {
    const res = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    const d = await res.json();
    if (!res.ok || !d.success) throw new Error(d.error || 'Delete failed.');
    triggerNotification('success', 'User account deleted.');
    fetchAllData();
  };

  // Backup & Recovery
  const handleTriggerBackup = async () => {
    setIsTriggeringBackup(true);
    try {
      const res = await fetch('/api/system/backups', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const d = await res.json();
      if (!res.ok || !d.success) throw new Error(d.error || 'Backup creation failed.');
      triggerNotification('success', 'Database backup snapshot created successfully.');
      fetchAllData();
    } catch (err: any) {
      triggerNotification('error', err.message || 'Error creating backup.');
    } finally {
      setIsTriggeringBackup(false);
    }
  };

  const handleRestoreBackup = async (filename: string, confirmationText: string) => {
    const res = await fetch('/api/system/backups/restore', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ filename, confirmationText })
    });
    const d = await res.json();
    if (!res.ok || !d.success) throw new Error(d.error || 'Restore failed.');
    triggerNotification('success', `Database restored from '${filename}'.`);
    fetchAllData();
  };

  const handleTestStagingRestore = async () => {
    try {
      const res = await fetch('/api/system/backups/test-staging', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const d = await res.json();
      if (!res.ok || !d.success) throw new Error(d.error || 'Staging recovery test failed.');
      triggerNotification('success', 'Staging restore verification succeeded. Production database remained 100% untouched.');
      fetchAllData();
    } catch (err: any) {
      triggerNotification('error', err.message || 'Error executing staging test.');
    }
  };

  // -------------------------------------------------------------
  // RENDERING
  // -------------------------------------------------------------

  // 1. Loading Authentication State
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAFBFD] flex items-center justify-center">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-[#0D9488] animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Verifying Institutional Credentials...
          </p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated Login Screen
  if (!currentUser || !token) {
    return (
      <div className="min-h-screen bg-[#FAFBFD] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden">
          {/* Header */}
          <div className="bg-[#0A1128] p-6 text-white text-center relative">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-3 border border-white/20 p-2 shadow-inner">
              <AmarnathLogo className="w-full h-full object-contain filter brightness-0 invert" />
            </div>
            <h2 className="text-lg font-bold tracking-tight">Amarnath Securities Limited</h2>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-[10px] font-bold text-[#C5A059] bg-[#C5A059]/20 px-2 py-0.5 rounded border border-[#C5A059]/30">
                BSE: 538465
              </span>
              <span className="text-[10px] text-slate-300 font-mono">
                CIN: L67120GJ1994PLC023254
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2 font-light">
              Investor Relations & Disclosure Management Workstation
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            {loginError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official Administrative Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@amarnathsecuritiesltd.com"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#0D9488] focus:bg-white transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter administrator password..."
                  className="w-full pl-9 pr-9 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#0D9488] focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-400 hover:text-slate-700 absolute right-2.5 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#0A1128] hover:bg-[#121c3b] rounded-lg transition-colors shadow-xs disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {isLoggingIn ? <RefreshCw className="w-4 h-4 animate-spin text-[#C5A059]" /> : <ShieldCheck className="w-4 h-4 text-[#C5A059]" />}
              <span>{isLoggingIn ? 'Authenticating...' : 'Sign In to Management Console'}</span>
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="text-xs text-slate-500 hover:text-[#0D9488] font-medium"
              >
                ← Return to Public Website
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 3. Authenticated Institutional Administration Workspace
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#FAFBFD] text-[#0A1128] flex">
      {/* Toast Notification Banner */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl shadow-lg border text-xs font-semibold animate-slide-in ${
          notification.type === 'success'
            ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
            : 'bg-rose-50 text-rose-900 border-rose-300'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="ml-2 text-slate-400 hover:text-slate-700">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Desktop Collapsible Left Sidebar */}
      <AdminSidebar
        activeView={activeView}
        onSelectView={handleSelectView}
        currentUser={currentUser}
        onLogout={handleRequestLogout}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onNavigatePublic={() => handleRequestExit('home')}
        metrics={{
          publishedDocs: systemHealth?.metrics.documents.published || documents.length,
          draftDocs: systemHealth?.metrics.documents.draft,
          pendingGrievances: enquiries.filter(e => e.status === 'new').length,
          reg46Pending: regClauses.filter(c => c.review_status === 'Pending Evidence').length
        }}
      />

      {/* Mobile Drawer Overlay */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-40 sm:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setMobileDrawerOpen(false)}></div>
          <div className="fixed top-0 bottom-0 left-0 w-72 bg-white z-50 shadow-2xl">
            <AdminSidebar
              activeView={activeView}
              onSelectView={handleSelectView}
              currentUser={currentUser}
              onLogout={handleRequestLogout}
              collapsed={false}
              onToggleCollapse={() => setMobileDrawerOpen(false)}
              onNavigatePublic={() => handleRequestExit('home')}
              metrics={{
                publishedDocs: documents.length,
                pendingGrievances: enquiries.filter(e => e.status === 'new').length
              }}
            />
          </div>
        </div>
      )}

      {/* Top Header */}
      <AdminHeader
        activeView={activeView}
        collapsed={sidebarCollapsed}
        onToggleMobileDrawer={() => setMobileDrawerOpen(true)}
        currentUser={currentUser}
        onRefresh={fetchAllData}
        refreshing={healthLoading || docsLoading}
        onChangePasswordClick={() => setShowPasswordModal(true)}
        onNavigatePublic={() => handleRequestExit('home')}
        systemConnected={systemHealth?.connectivity.database === 'connected'}
        dbPingMs={systemHealth?.connectivity.pingMs}
      />

      {/* Main Content Area */}
      <main 
        className={`flex-1 transition-all duration-300 pt-20 px-4 sm:px-6 pb-12 overflow-x-hidden ${
          sidebarCollapsed ? 'sm:ml-[74px]' : 'sm:ml-[280px]'
        }`}
      >
        {/* VIEW 1: DASHBOARD */}
        {activeView === 'dashboard' && (
          <AdminDashboard
            onNavigateView={handleSelectView}
            onOpenUploadModal={() => setShowAddDocModal(true)}
            systemHealth={systemHealth}
            recentAuditLogs={auditLogs}
            recentEnquiries={enquiries}
            recentDocuments={documents}
            onTriggerBackup={handleTriggerBackup}
            isTriggeringBackup={isTriggeringBackup}
            onUpdateEnquiryStatus={handleUpdateEnquiryStatus}
            totalPageVisits={pageVisitsData?.totalVisits}
          />
        )}

        {/* VIEW 2: WEBSITE HEALTH */}
        {activeView === 'website_health' && (
          <AdminSystemHealth
            systemHealth={systemHealth}
            loading={healthLoading}
            onRefresh={fetchAllData}
          />
        )}

        {/* VIEW 3: INVESTOR RELATIONS (DOCUMENTS FILTERED BY CATEGORY) */}
        {activeView === 'financial_results' && (
          <AdminDocuments
            documents={documents}
            loading={docsLoading}
            currentUser={currentUser}
            onRefresh={fetchAllData}
            categoryFilterOverride="Financial Results"
            onOpenUploadModal={() => setShowAddDocModal(true)}
            onApproveDoc={handleApproveDoc}
            onPublishDoc={handlePublishDoc}
            onUnpublishDoc={handleUnpublishDoc}
            onArchiveDoc={handleArchiveDoc}
            onRestoreDoc={handleRestoreDoc}
            onDeleteDoc={handleDeleteDoc}
            onUpdateMetadata={handleUpdateDocMetadata}
            onReplaceFile={handleReplaceDocFile}
          />
        )}

        {activeView === 'annual_reports' && (
          <AdminDocuments
            documents={documents}
            loading={docsLoading}
            currentUser={currentUser}
            onRefresh={fetchAllData}
            categoryFilterOverride="Annual Reports"
            onOpenUploadModal={() => setShowAddDocModal(true)}
            onApproveDoc={handleApproveDoc}
            onPublishDoc={handlePublishDoc}
            onUnpublishDoc={handleUnpublishDoc}
            onArchiveDoc={handleArchiveDoc}
            onRestoreDoc={handleRestoreDoc}
            onDeleteDoc={handleDeleteDoc}
            onUpdateMetadata={handleUpdateDocMetadata}
            onReplaceFile={handleReplaceDocFile}
          />
        )}

        {activeView === 'shareholding_pattern' && (
          <AdminDocuments
            documents={documents}
            loading={docsLoading}
            currentUser={currentUser}
            onRefresh={fetchAllData}
            categoryFilterOverride="Shareholding Pattern"
            onOpenUploadModal={() => setShowAddDocModal(true)}
            onApproveDoc={handleApproveDoc}
            onPublishDoc={handlePublishDoc}
            onUnpublishDoc={handleUnpublishDoc}
            onArchiveDoc={handleArchiveDoc}
            onRestoreDoc={handleRestoreDoc}
            onDeleteDoc={handleDeleteDoc}
            onUpdateMetadata={handleUpdateDocMetadata}
            onReplaceFile={handleReplaceDocFile}
          />
        )}

        {activeView === 'bse_disclosures' && (
          <AdminDocuments
            documents={documents}
            loading={docsLoading}
            currentUser={currentUser}
            onRefresh={fetchAllData}
            categoryFilterOverride="BSE Disclosures"
            onOpenUploadModal={() => setShowAddDocModal(true)}
            onApproveDoc={handleApproveDoc}
            onPublishDoc={handlePublishDoc}
            onUnpublishDoc={handleUnpublishDoc}
            onArchiveDoc={handleArchiveDoc}
            onRestoreDoc={handleRestoreDoc}
            onDeleteDoc={handleDeleteDoc}
            onUpdateMetadata={handleUpdateDocMetadata}
            onReplaceFile={handleReplaceDocFile}
          />
        )}

        {activeView === 'agm_egm_notices' && (
          <AdminDocuments
            documents={documents}
            loading={docsLoading}
            currentUser={currentUser}
            onRefresh={fetchAllData}
            categoryFilterOverride="AGM / EGM / Notices"
            onOpenUploadModal={() => setShowAddDocModal(true)}
            onApproveDoc={handleApproveDoc}
            onPublishDoc={handlePublishDoc}
            onUnpublishDoc={handleUnpublishDoc}
            onArchiveDoc={handleArchiveDoc}
            onRestoreDoc={handleRestoreDoc}
            onDeleteDoc={handleDeleteDoc}
            onUpdateMetadata={handleUpdateDocMetadata}
            onReplaceFile={handleReplaceDocFile}
          />
        )}

        {activeView === 'statutory_filings' && (
          <AdminDocuments
            documents={documents}
            loading={docsLoading}
            currentUser={currentUser}
            onRefresh={fetchAllData}
            categoryFilterOverride="Statutory Filings"
            onOpenUploadModal={() => setShowAddDocModal(true)}
            onApproveDoc={handleApproveDoc}
            onPublishDoc={handlePublishDoc}
            onUnpublishDoc={handleUnpublishDoc}
            onArchiveDoc={handleArchiveDoc}
            onRestoreDoc={handleRestoreDoc}
            onDeleteDoc={handleDeleteDoc}
            onUpdateMetadata={handleUpdateDocMetadata}
            onReplaceFile={handleReplaceDocFile}
          />
        )}

        {activeView === 'newspaper_publications' && (
          <AdminDocuments
            documents={documents}
            loading={docsLoading}
            currentUser={currentUser}
            onRefresh={fetchAllData}
            categoryFilterOverride="Newspaper Publications"
            onOpenUploadModal={() => setShowAddDocModal(true)}
            onApproveDoc={handleApproveDoc}
            onPublishDoc={handlePublishDoc}
            onUnpublishDoc={handleUnpublishDoc}
            onArchiveDoc={handleArchiveDoc}
            onRestoreDoc={handleRestoreDoc}
            onDeleteDoc={handleDeleteDoc}
            onUpdateMetadata={handleUpdateDocMetadata}
            onReplaceFile={handleReplaceDocFile}
          />
        )}

        {/* VIEW 4: GOVERNANCE & COMPLIANCE */}
        {activeView === 'reg46_checklist' && (
          <AdminRegulation46
            clauses={regClauses}
            loading={regLoading}
            onRefresh={fetchAllData}
            onUpdateClause={handleUpdateReg46Clause}
            onNavigatePublicRoute={(r) => onNavigate(r as any)}
          />
        )}

        {activeView === 'directors' && (
          <AdminGovernance
            initialSubTab="directors"
            currentUser={currentUser}
            directors={directors}
            committees={committees}
            kmpContacts={kmpContacts}
            loading={govLoading}
            onRefresh={fetchAllData}
            onUpdateDirector={handleUpdateDirector}
            onCreateDirector={handleCreateDirector}
            onDeleteDirector={handleDeleteDirector}
            onUpdateCommittee={handleUpdateCommittee}
            onUpdateKmp={handleUpdateKmp}
          />
        )}

        {activeView === 'committees' && (
          <AdminGovernance
            initialSubTab="committees"
            currentUser={currentUser}
            directors={directors}
            committees={committees}
            kmpContacts={kmpContacts}
            loading={govLoading}
            onRefresh={fetchAllData}
            onUpdateDirector={handleUpdateDirector}
            onCreateDirector={handleCreateDirector}
            onDeleteDirector={handleDeleteDirector}
            onUpdateCommittee={handleUpdateCommittee}
            onUpdateKmp={handleUpdateKmp}
          />
        )}

        {activeView === 'kmp' && (
          <AdminGovernance
            initialSubTab="kmp"
            currentUser={currentUser}
            directors={directors}
            committees={committees}
            kmpContacts={kmpContacts}
            loading={govLoading}
            onRefresh={fetchAllData}
            onUpdateDirector={handleUpdateDirector}
            onCreateDirector={handleCreateDirector}
            onDeleteDirector={handleDeleteDirector}
            onUpdateCommittee={handleUpdateCommittee}
            onUpdateKmp={handleUpdateKmp}
          />
        )}

        {activeView === 'corporate_governance' && (
          <AdminGovernance
            initialSubTab="corporate_governance"
            currentUser={currentUser}
            directors={directors}
            committees={committees}
            kmpContacts={kmpContacts}
            loading={govLoading}
            onRefresh={fetchAllData}
            onUpdateDirector={handleUpdateDirector}
            onCreateDirector={handleCreateDirector}
            onDeleteDirector={handleDeleteDirector}
            onUpdateCommittee={handleUpdateCommittee}
            onUpdateKmp={handleUpdateKmp}
          />
        )}

        {activeView === 'policies' && (
          <AdminGovernance
            initialSubTab="policies"
            currentUser={currentUser}
            directors={directors}
            committees={committees}
            kmpContacts={kmpContacts}
            loading={govLoading}
            onRefresh={fetchAllData}
            onUpdateDirector={handleUpdateDirector}
            onCreateDirector={handleCreateDirector}
            onDeleteDirector={handleDeleteDirector}
            onUpdateCommittee={handleUpdateCommittee}
            onUpdateKmp={handleUpdateKmp}
          />
        )}

        {/* VIEW 5: WEBSITE CONTENT */}
        {activeView === 'document_library' && (
          <AdminDocuments
            documents={documents}
            loading={docsLoading}
            currentUser={currentUser}
            onRefresh={fetchAllData}
            categoryFilterOverride="All"
            onOpenUploadModal={() => setShowAddDocModal(true)}
            onApproveDoc={handleApproveDoc}
            onPublishDoc={handlePublishDoc}
            onUnpublishDoc={handleUnpublishDoc}
            onArchiveDoc={handleArchiveDoc}
            onRestoreDoc={handleRestoreDoc}
            onDeleteDoc={handleDeleteDoc}
            onUpdateMetadata={handleUpdateDocMetadata}
            onReplaceFile={handleReplaceDocFile}
          />
        )}

        {(activeView === 'pages' || activeView === 'announcements' || activeView === 'contact_details' || activeView === 'seo_metadata') && (
          <div className="space-y-6">
            {/* Header & Quick Summary */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-[#0A1128] flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#0D9488]" />
                  <span>Website Content & Live Page Visits</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Supported public portal pages, navigation endpoints, and live unique visitor counts
                </p>
              </div>
              <button
                onClick={() => handleRequestExit('home')}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-[#0A1128] hover:bg-[#121c3b] rounded-lg inline-flex items-center gap-2 shadow-2xs self-start sm:self-auto cursor-pointer"
              >
                <span>View Public Site</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#C5A059]" />
              </button>
            </div>

            {/* Overall Page Visit Statistics Grid (Dynamic Data from MySQL) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs">
                <div className="text-[11px] font-semibold text-slate-400">Total Unique Visitors</div>
                <div className="text-2xl font-extrabold text-[#0A1128] tracking-tight mt-1">
                  {(pageVisitsData?.totalVisits ?? 0).toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                  <span>↑ Real-time</span>
                  <span className="text-slate-400">deduplicated DB counter</span>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs">
                <div className="text-[11px] font-semibold text-slate-400">Platform Unique Users</div>
                <div className="text-2xl font-extrabold text-[#0D9488] tracking-tight mt-1">
                  {(pageVisitsData?.totalUniqueUsers ?? 0).toLocaleString('en-IN')} Users
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Distinct client devices logged</div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs">
                <div className="text-[11px] font-semibold text-slate-400">Top Visited Page</div>
                <div className="text-sm font-bold text-[#0A1128] truncate mt-1">
                  {pageVisitsData?.topPage && Number(pageVisitsData.topPage.visit_count) > 0
                    ? pageVisitsData.topPage.page_name
                    : 'No Visits Recorded Yet'}
                </div>
                <div className="text-[10px] text-[#C5A059] font-mono font-semibold mt-1">
                  {pageVisitsData?.topPage && Number(pageVisitsData.topPage.visit_count) > 0
                    ? `${Number(pageVisitsData.topPage.visit_count).toLocaleString('en-IN')} visits (${pageVisitsData.topPage.percentage})`
                    : '0 unique visits (0%)'}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs">
                <div className="text-[11px] font-semibold text-slate-400">Total Cumulative Hits</div>
                <div className="text-sm font-bold text-slate-800 mt-1">
                  {(pageVisitsData?.totalPageHits ?? 0).toLocaleString('en-IN')} Hits
                </div>
                <div className="text-[10px] text-slate-400 mt-1 truncate">
                  {pageVisitsData?.lastActiveAt
                    ? `Last: ${new Date(pageVisitsData.lastActiveAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'short', timeStyle: 'short' })}`
                    : 'Zero activity logged'}
                </div>
              </div>
            </div>

            {/* Pages Table with Live Database Page Visits Count */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-[#0A1128] uppercase tracking-wider">
                    Supported Pages & Unique Visitor Counts
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live DB Sync
                  </span>
                </div>
                <button
                  onClick={fetchAllData}
                  className="text-xs text-slate-500 hover:text-[#0D9488] font-semibold flex items-center gap-1 cursor-pointer"
                  title="Refresh live page counters"
                >
                  <RefreshCw className={`w-3 h-3 ${visitsLoading ? 'animate-spin text-[#0D9488]' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {[
                  { name: 'Corporate Homepage', route: 'home', desc: 'Core company positioning, key metrics, and statutory highlights', badge: 'Primary Route' },
                  { name: 'Investor Relations Portal', route: 'investor-relations', desc: 'Regulation 46 index, statutory filings, and grievance desk', badge: 'LODR Reg 46' },
                  { name: 'About & Leadership', route: 'about', desc: 'Executive leadership, DIN verification, and corporate history' },
                  { name: 'Contact & Registered Office', route: 'contact', desc: 'Grievance officer, corporate office, and investor enquiry form' },
                  { name: 'Capabilities & Advisory', route: 'capabilities', desc: 'Financial services, capital advisory, and debt syndication' },
                  { name: 'Insights & Research', route: 'insights', desc: 'Institutional articles and market analysis' }
                ].map((pg, idx) => {
                  const dbItem = pageVisitsData?.data?.find((d: any) => d.route === pg.route);
                  const count = dbItem ? Number(dbItem.visit_count) : 0;
                  const percentage = dbItem ? dbItem.percentage : '0%';
                  return (
                    <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-[#0A1128]">{pg.name}</span>
                          <span className="text-[10px] font-mono text-[#0D9488] bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                            #{pg.route}
                          </span>
                          {pg.badge && (
                            <span className="text-[9px] font-bold bg-[#C5A059]/20 text-[#8C6D23] px-1.5 py-0.2 rounded border border-[#C5A059]/30">
                              {pg.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500">{pg.desc}</div>
                      </div>

                      <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                        {/* Visit Pages Count Badge */}
                        <div className="text-right">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200/90 rounded-lg">
                            <Eye className="w-3.5 h-3.5 text-[#0D9488]" />
                            <span className="text-xs font-bold text-[#0A1128] font-mono">
                              {count.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">visits</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{percentage} of traffic</div>
                        </div>

                        <button
                          onClick={() => handleRequestExit(pg.route as any)}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg inline-flex items-center gap-1 transition-colors shadow-2xs cursor-pointer"
                        >
                          <span>Open Page</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 6: INVESTOR SUPPORT */}
        {activeView === 'grievances' && (
          <AdminInvestorSupport
            initialSubTab="grievances"
            enquiries={enquiries}
            loading={enquiriesLoading}
            currentUser={currentUser}
            onRefresh={fetchAllData}
            onUpdateStatus={handleUpdateEnquiryStatus}
          />
        )}

        {activeView === 'enquiries' && (
          <AdminInvestorSupport
            initialSubTab="enquiries"
            enquiries={enquiries}
            loading={enquiriesLoading}
            currentUser={currentUser}
            onRefresh={fetchAllData}
            onUpdateStatus={handleUpdateEnquiryStatus}
          />
        )}

        {activeView === 'rta_contact' && (
          <AdminInvestorSupport
            initialSubTab="rta_contact"
            enquiries={enquiries}
            loading={enquiriesLoading}
            currentUser={currentUser}
            onRefresh={fetchAllData}
            onUpdateStatus={handleUpdateEnquiryStatus}
          />
        )}

        {/* VIEW 7: ADMINISTRATION */}
        {activeView === 'users' && (
          <AdminUsers
            users={users}
            loading={usersLoading}
            currentUser={currentUser}
            onRefresh={fetchAllData}
            onCreateUser={handleCreateUser}
            onUpdateUser={handleUpdateUser}
            onResetPassword={handleResetUserPassword}
            onDeleteUser={handleDeleteUser}
          />
        )}

        {activeView === 'audit' && (
          <AdminAuditLogs
            logs={auditLogs}
            loading={auditLoading}
            onRefresh={fetchAllData}
          />
        )}

        {activeView === 'backups' && (
          <AdminBackups
            backups={backups}
            loading={backupsLoading}
            currentUser={currentUser}
            onRefresh={fetchAllData}
            onCreateBackup={handleTriggerBackup}
            onRestoreBackup={handleRestoreBackup}
            onTestStaging={handleTestStagingRestore}
          />
        )}

        {(activeView === 'settings' || activeView === 'notifications') && (
          <AdminSettings
            currentUser={currentUser}
            onNavigateView={handleSelectView}
            onNotify={triggerNotification}
          />
        )}
      </main>

      {/* ======================================================== */}
      {/* GLOBAL MODAL 1: ADD STATUTORY DOCUMENT */}
      {/* ======================================================== */}
      {showAddDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-[#FAFBFD]">
              <div>
                <h3 className="text-sm font-bold text-[#0A1128] flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#0D9488]" />
                  <span>Upload Statutory Regulatory Filing</span>
                </h3>
                <div className="text-xs text-slate-500 mt-0.5">SEBI (LODR) Regulations 2015 Compliant Upload</div>
              </div>
              <button
                onClick={() => setShowAddDocModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="p-5 space-y-3.5">
              {addDocError && (
                <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-xs text-rose-800">
                  {addDocError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  value={addDocData.title}
                  onChange={(e) => setAddDocData({ ...addDocData, title: e.target.value })}
                  placeholder="e.g. Unaudited Financial Results for Q3 FY 2025-26"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={addDocData.category}
                    onChange={(e) => setAddDocData({ ...addDocData, category: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="Financial Results">Financial Results</option>
                    <option value="Annual Reports">Annual Reports</option>
                    <option value="Shareholding Pattern">Shareholding Pattern</option>
                    <option value="BSE Disclosures">BSE Disclosures</option>
                    <option value="AGM / EGM / Notices">AGM / EGM / Notices</option>
                    <option value="Secretarial Compliance Report">Secretarial Compliance Report</option>
                    <option value="Annual Return (MGT-7)">Annual Return (MGT-7)</option>
                    <option value="MOA & AOA">MOA & AOA</option>
                    <option value="Newspaper Publications">Newspaper Publications</option>
                    <option value="Company Policies">Company Policies</option>
                    <option value="Corporate Governance">Corporate Governance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Financial Year *</label>
                  <input
                    type="text"
                    required
                    value={addDocData.financialYear}
                    onChange={(e) => setAddDocData({ ...addDocData, financialYear: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Filing Date *</label>
                  <input
                    type="date"
                    required
                    value={addDocData.filingDate}
                    onChange={(e) => setAddDocData({ ...addDocData, filingDate: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">BSE Ack Number</label>
                  <input
                    type="text"
                    value={addDocData.bseAckNumber}
                    onChange={(e) => setAddDocData({ ...addDocData, bseAckNumber: e.target.value })}
                    placeholder="BSE/LODR/2026/..."
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Statutory PDF File *
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  required
                  onChange={(e) => setUploadFileObj(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#0A1128] file:text-white hover:file:bg-[#121c3b] cursor-pointer border border-slate-200 rounded-lg p-1"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  value={addDocData.description}
                  onChange={(e) => setAddDocData({ ...addDocData, description: e.target.value })}
                  placeholder="Official description of the regulatory filing..."
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddDocModal(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingNewDoc || !uploadFileObj}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0A1128] hover:bg-[#121c3b] rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmittingNewDoc ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5 text-[#C5A059]" />}
                  <span>{isSubmittingNewDoc ? 'Uploading...' : 'Save & Publish Filing'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* GLOBAL MODAL 2: CHANGE PASSWORD */}
      {/* ======================================================== */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-[#FAFBFD]">
              <h3 className="text-sm font-bold text-[#0A1128] flex items-center gap-2">
                <Key className="w-4 h-4 text-[#C5A059]" />
                <span>Update Administrative Credentials</span>
              </h3>
              <button onClick={() => setShowPasswordModal(false)} className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="p-5 space-y-3.5">
              {passError && (
                <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-xs text-rose-800">
                  {passError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Current Password *</label>
                <input
                  type="password"
                  required
                  value={currPass}
                  onChange={(e) => setCurrPass(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">New Password (Min 8 Chars) *</label>
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0A1128] hover:bg-[#121c3b] rounded-lg transition-colors disabled:opacity-50"
                >
                  {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ======================================================== */}
      {/* GLOBAL MODAL 3: EXIT ADMINISTRATIVE CONSOLE CONFIRMATION */}
      {/* ======================================================== */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden animate-scale-up">
            <div className="bg-[#0A1128] p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-[#0D9488] flex items-center justify-center border border-teal-500/30">
                  <Globe className="w-5 h-5 text-[#0D9488]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">Exit Management Console?</h3>
                  <p className="text-[11px] text-slate-300">Public Portal Navigation Notice</p>
                </div>
              </div>
              <button 
                onClick={() => setShowExitModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Administrative Session Alert:</span> You are about to leave the institutional governance workstation and transition to the public-facing portal (<strong>#{pendingExitRoute}</strong>).
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Do you wish to proceed to the public website or remain in your active administrative console?
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExitModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Stay in Console
                </button>
                <button
                  type="button"
                  onClick={handleConfirmExit}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#0A1128] hover:bg-[#121c3b] rounded-lg transition-colors shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Exit to Public Website</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#C5A059]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* GLOBAL MODAL 4: SIGN OUT / LOGOUT CONFIRMATION */}
      {/* ======================================================== */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden animate-scale-up">
            <div className="bg-rose-950 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                  <LogOut className="w-5 h-5 text-rose-300" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">Confirm Administrative Sign Out</h3>
                  <p className="text-[11px] text-rose-200/80">Regulatory Session Termination</p>
                </div>
              </div>
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="p-1.5 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to log out of your administrative workstation? Your active session token will be cleared and you will be returned to the login portal.
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-500 font-mono">
                Operator: <strong className="text-slate-800">{currentUser?.name}</strong> ({currentUser?.role})
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmLogout}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out Session</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
