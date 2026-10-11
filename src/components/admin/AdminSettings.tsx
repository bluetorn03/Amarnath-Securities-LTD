import React, { useState, useEffect } from 'react';
import { AdminUser, AdminViewId } from '../../types';
import { 
  Settings, 
  Building2, 
  PhoneCall, 
  Shield, 
  CheckSquare, 
  FileSearch, 
  UserCog, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Key
} from 'lucide-react';

interface AdminSettingsProps {
  currentUser: AdminUser | null;
  onNavigateView: (view: AdminViewId) => void;
  onNotify: (type: 'success' | 'error', message: string) => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  currentUser,
  onNavigateView,
  onNotify
}) => {
  const [activeTab, setActiveTab] = useState<
    'company' | 'credentials' | 'investor' | 'security' | 'compliance'
  >('company');

  const [settingsData, setSettingsData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  // Administrative Credentials State
  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passUpdating, setPassUpdating] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(null);

    if (newPass.length < 8) {
      setPassError('New password must be at least 8 characters long.');
      return;
    }
    if (newPass !== confirmPass) {
      setPassError('New password and confirm password do not match.');
      return;
    }

    setPassUpdating(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('asl_admin_token')}`
        },
        body: JSON.stringify({ currentPassword: currPass, newPassword: newPass })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update administrative credentials.');
      }

      setPassSuccess('Administrative credentials updated successfully.');
      onNotify('success', 'Administrative password updated successfully.');
      setCurrPass('');
      setNewPass('');
      setConfirmPass('');
    } catch (err: any) {
      setPassError(err.message || 'Error updating administrative credentials.');
      onNotify('error', err.message || 'Error updating administrative credentials.');
    } finally {
      setPassUpdating(false);
    }
  };

  // Fetch settings from API
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/system/settings', {
        headers: { Authorization: `Bearer ${localStorage.getItem('asl_admin_token')}` }
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSettingsData(data.data);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Save specific settings category
  const handleSaveSetting = async (key: string, value: any) => {
    setSavingKey(key);
    try {
      const res = await fetch(`/api/system/settings/${key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('asl_admin_token')}`
        },
        body: JSON.stringify({ value })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update settings.');
      }
      onNotify('success', `Settings category '${key.replace('_', ' ')}' persisted successfully.`);
      fetchSettings();
    } catch (err: any) {
      onNotify('error', err.message || 'Error saving settings.');
    } finally {
      setSavingKey(null);
    }
  };

  const isSuperAdmin = currentUser?.role === 'super_admin';

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-[#0A1128] flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#0D9488]" />
            <span>Institutional System & Statutory Configuration</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified corporate identifiers, disclosure thresholds, security parameters, and compliance schedule
          </p>
        </div>

        <button
          onClick={fetchSettings}
          className="p-1.5 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
          title="Reload configuration"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#0D9488]' : ''}`} />
        </button>
      </div>

      {/* 2. Navigation Pills for Settings Sections */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-2 shadow-2xs flex items-center flex-wrap gap-1.5">
        {[
          { id: 'company', label: 'Company Profile', icon: Building2 },
          { id: 'credentials', label: 'Update Credentials', icon: Key },
          { id: 'investor', label: 'Investor Relations & RTA', icon: PhoneCall },
          { id: 'security', label: 'Security & Access Policy', icon: Shield },
          { id: 'compliance', label: 'Compliance Workflow', icon: CheckSquare },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#0A1128] text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C5A059]' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Quick Jump Shortcuts to Administration Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => onNavigateView('users')}
          className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:border-[#0D9488]/40 hover:bg-slate-50/50 transition-all text-left flex items-center justify-between cursor-pointer"
        >
          <div>
            <div className="text-xs font-bold text-[#0A1128]">Users & Roles</div>
            <div className="text-[10px] text-slate-400">RBAC User Lifecycle</div>
          </div>
          <UserCog className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => onNavigateView('audit')}
          className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:border-[#0D9488]/40 hover:bg-slate-50/50 transition-all text-left flex items-center justify-between cursor-pointer"
        >
          <div>
            <div className="text-xs font-bold text-[#0A1128]">Audit Logs</div>
            <div className="text-[10px] text-slate-400">Security Audit Trail</div>
          </div>
          <FileSearch className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => setActiveTab('credentials')}
          className={`p-3 bg-white rounded-xl border shadow-2xs transition-all text-left flex items-center justify-between cursor-pointer ${
            activeTab === 'credentials'
              ? 'border-[#0D9488] ring-1 ring-[#0D9488]/20 bg-teal-50/30'
              : 'border-slate-200/90 hover:border-[#0D9488]/40 hover:bg-slate-50/50'
          }`}
        >
          <div>
            <div className="text-xs font-bold text-[#0A1128]">Update Credentials</div>
            <div className="text-[10px] text-slate-400">Change Admin Password</div>
          </div>
          <Key className="w-4 h-4 text-[#C5A059]" />
        </button>
      </div>

      {/* 3. Active Settings Panel Content */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-5">
        {/* ======================================================== */}
        {/* TAB 1: COMPANY PROFILE */}
        {/* ======================================================== */}
        {activeTab === 'company' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveSetting('company_profile', settingsData.company_profile?.value || {});
            }}
            className="space-y-4"
          >
            {/* Audit Notice on Conflicting Records */}
            <div className="p-3.5 bg-amber-50/80 border border-amber-300 rounded-xl text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span className="font-bold text-amber-950">Statutory Record Reconciliation Status</span>
                </div>
                <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                  Audit Verified vs Pending CS Sign-off
                </span>
              </div>
              <p className="text-amber-900 leading-relaxed text-[11px]">
                Registered office in Ahmedabad, Gujarat is verified against MCA RoC records. Corporate office and branch coordinates in Chembur/Mumbai represent legacy operational locations and are marked <strong>Pending Company Confirmation</strong> awaiting Form INC-22 board resolution.
              </p>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#0A1128]">Statutory Company Identifiers & Registered Office</h3>
                <p className="text-xs text-slate-500 mt-0.5">Official MCA / BSE corporate records</p>
              </div>
              {isSuperAdmin && (
                <button
                  type="submit"
                  disabled={savingKey === 'company_profile'}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0A1128] hover:bg-[#121c3b] rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs disabled:opacity-50 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{savingKey === 'company_profile' ? 'Saving...' : 'Save Profile'}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company Legal Name</label>
                <input
                  type="text"
                  required
                  value={settingsData.company_profile?.value?.company_name || 'Amarnath Securities Limited'}
                  onChange={(e) => {
                    const v = { ...settingsData.company_profile?.value, company_name: e.target.value };
                    setSettingsData({ ...settingsData, company_profile: { ...settingsData.company_profile, value: v } });
                  }}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">CIN (Corporate Identity Number)</label>
                <input
                  type="text"
                  required
                  value={settingsData.company_profile?.value?.cin || 'L67120GJ1994PLC023254'}
                  onChange={(e) => {
                    const v = { ...settingsData.company_profile?.value, cin: e.target.value };
                    setSettingsData({ ...settingsData, company_profile: { ...settingsData.company_profile, value: v } });
                  }}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">BSE Scrip Code</label>
                <input
                  type="text"
                  required
                  value={settingsData.company_profile?.value?.bse_scrip_code || '538465'}
                  onChange={(e) => {
                    const v = { ...settingsData.company_profile?.value, bse_scrip_code: e.target.value };
                    setSettingsData({ ...settingsData, company_profile: { ...settingsData.company_profile, value: v } });
                  }}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-[#0D9488]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ISIN Code</label>
                <input
                  type="text"
                  required
                  value={settingsData.company_profile?.value?.isin || 'INE745P01010'}
                  onChange={(e) => {
                    const v = { ...settingsData.company_profile?.value, isin: e.target.value };
                    setSettingsData({ ...settingsData, company_profile: { ...settingsData.company_profile, value: v } });
                  }}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Official Compliance Email</label>
                <input
                  type="email"
                  required
                  value={settingsData.company_profile?.value?.email || 'compliance@amarnathsecuritiesltd.com'}
                  onChange={(e) => {
                    const v = { ...settingsData.company_profile?.value, email: e.target.value };
                    setSettingsData({ ...settingsData, company_profile: { ...settingsData.company_profile, value: v } });
                  }}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Official Phone</label>
                <input
                  type="text"
                  required
                  value={settingsData.company_profile?.value?.phone || '+91 22 2523 0048'}
                  onChange={(e) => {
                    const v = { ...settingsData.company_profile?.value, phone: e.target.value };
                    setSettingsData({ ...settingsData, company_profile: { ...settingsData.company_profile, value: v } });
                  }}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">Registered Office (MCA Verified)</label>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  RoC Ahmedabad, Gujarat Verified
                </span>
              </div>
              <textarea
                rows={2}
                required
                value={settingsData.company_profile?.value?.reg_office || '1/104, Sarthik Complex, Nr. Fun Republic, Satellite Road, Ahmedabad, Gujarat - 380015'}
                onChange={(e) => {
                  const v = { ...settingsData.company_profile?.value, reg_office: e.target.value };
                  setSettingsData({ ...settingsData, company_profile: { ...settingsData.company_profile, value: v } });
                }}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">Corporate Office (Disclosed in Website & Records)</label>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                  Pending Company Confirmation
                </span>
              </div>
              <textarea
                rows={2}
                value={settingsData.company_profile?.value?.corp_office || 'Office A9, Ground Floor, Ellora Park, Near Damani Zapa, Killa Pardi, Valsad, Pardi, Gujarat - 396125'}
                onChange={(e) => {
                  const v = { ...settingsData.company_profile?.value, corp_office: e.target.value };
                  setSettingsData({ ...settingsData, company_profile: { ...settingsData.company_profile, value: v } });
                }}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* TAB 2: UPDATE ADMINISTRATIVE CREDENTIALS */}
        {/* ======================================================== */}
        {activeTab === 'credentials' && (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#0A1128] flex items-center gap-2">
                  <Key className="w-4 h-4 text-[#C5A059]" />
                  <span>Update Administrative Credentials</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update primary administrator login password and access security parameters
                </p>
              </div>
            </div>

            {/* Current Session / Account Details */}
            <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#0A1128] text-white flex items-center justify-center font-bold text-sm">
                  {currentUser?.name?.[0] || 'A'}
                </div>
                <div>
                  <div className="font-bold text-[#0A1128]">{currentUser?.name || 'Amarnath Administrator'}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{currentUser?.email || 'admin@amarnathsecurities.co.in'}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold bg-[#C5A059]/20 text-[#8C6D23] px-2 py-0.5 rounded border border-[#C5A059]/30">
                  Role: {currentUser?.role || 'Super Admin'}
                </span>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Active Session
                </span>
              </div>
            </div>

            {passError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{passError}</span>
              </div>
            )}

            {passSuccess && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{passSuccess}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Current Password *</label>
                <input
                  type="password"
                  required
                  value={currPass}
                  onChange={(e) => setCurrPass(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0D9488]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">New Password (Min 8 Chars) *</label>
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0D9488]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Confirm New Password *</label>
                <input
                  type="password"
                  required
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0D9488]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-[11px] text-slate-400">
                Passwords must contain minimum 8 characters. After updating, your current session stays authenticated.
              </div>
              <button
                type="submit"
                disabled={passUpdating}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#0A1128] hover:bg-[#121c3b] rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs disabled:opacity-50 cursor-pointer"
              >
                <Key className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>{passUpdating ? 'Updating...' : 'Update Administrative Credentials'}</span>
              </button>
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* TAB 3: INVESTOR RELATIONS & RTA */}
        {/* ======================================================== */}
        {activeTab === 'investor' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveSetting('investor_relations', settingsData.investor_relations?.value || {});
            }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#0A1128]">Investor Relations & Registrar Details</h3>
                <p className="text-xs text-slate-500 mt-0.5">Designated grievance officer and RTA liaison records</p>
              </div>
              {isSuperAdmin && (
                <button
                  type="submit"
                  disabled={savingKey === 'investor_relations'}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0A1128] hover:bg-[#121c3b] rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{savingKey === 'investor_relations' ? 'Saving...' : 'Save Details'}</span>
                </button>
              )}
            </div>

            {/* Notice on RTA Agreement Confirmation */}
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900 leading-relaxed text-[11px]">
              <strong>Compliance Notice:</strong> Bigshare Services Pvt. Ltd. coordinates are retained from current disclosures. A formal Tripartite Agreement pursuant to SEBI circulars is pending Company Secretary confirmation to reconcile legacy records (Purva Sharegistry).
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">Registrar Name (RTA)</label>
                  <span className="text-[9px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                    Pending Confirmation
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={settingsData.investor_relations?.value?.rta_name || 'Bigshare Services Pvt. Ltd.'}
                  onChange={(e) => {
                    const v = { ...settingsData.investor_relations?.value, rta_name: e.target.value };
                    setSettingsData({ ...settingsData, investor_relations: { ...settingsData.investor_relations, value: v } });
                  }}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">RTA Investor Support Email</label>
                <input
                  type="email"
                  required
                  value={settingsData.investor_relations?.value?.rta_email || 'investor@bigshareonline.com'}
                  onChange={(e) => {
                    const v = { ...settingsData.investor_relations?.value, rta_email: e.target.value };
                    setSettingsData({ ...settingsData, investor_relations: { ...settingsData.investor_relations, value: v } });
                  }}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">RTA Phone</label>
                <input
                  type="text"
                  required
                  value={settingsData.investor_relations?.value?.rta_phone || '+91 22 6263 8200'}
                  onChange={(e) => {
                    const v = { ...settingsData.investor_relations?.value, rta_phone: e.target.value };
                    setSettingsData({ ...settingsData, investor_relations: { ...settingsData.investor_relations, value: v } });
                  }}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">SEBI SCORES Portal URL</label>
                <input
                  type="text"
                  required
                  value={settingsData.investor_relations?.value?.sebi_scores_url || 'https://scores.sebi.gov.in'}
                  onChange={(e) => {
                    const v = { ...settingsData.investor_relations?.value, sebi_scores_url: e.target.value };
                    setSettingsData({ ...settingsData, investor_relations: { ...settingsData.investor_relations, value: v } });
                  }}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">SEBI SMART ODR URL</label>
                <input
                  type="text"
                  required
                  value={settingsData.investor_relations?.value?.sebi_smart_odr_url || 'https://smartodr.in'}
                  onChange={(e) => {
                    const v = { ...settingsData.investor_relations?.value, sebi_smart_odr_url: e.target.value };
                    setSettingsData({ ...settingsData, investor_relations: { ...settingsData.investor_relations, value: v } });
                  }}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px]"
                />
              </div>
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* TAB 3: SECURITY & ACCESS POLICY */}
        {/* ======================================================== */}
        {activeTab === 'security' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveSetting('security_policy', settingsData.security_policy?.value || {});
            }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#0A1128]">Password Policy, Session Timeout & Account Lockout</h3>
                <p className="text-xs text-slate-500 mt-0.5">Parameters governing authentication hardening</p>
              </div>
              {isSuperAdmin && (
                <button
                  type="submit"
                  disabled={savingKey === 'security_policy'}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0A1128] hover:bg-[#121c3b] rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{savingKey === 'security_policy' ? 'Saving...' : 'Save Security Rules'}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Session Timeout (Minutes)</label>
                <input
                  type="number"
                  min={15}
                  max={1440}
                  required
                  value={settingsData.security_policy?.value?.sessionTimeoutMinutes || 480}
                  onChange={(e) => {
                    const v = { ...settingsData.security_policy?.value, sessionTimeoutMinutes: parseInt(e.target.value, 10) };
                    setSettingsData({ ...settingsData, security_policy: { ...settingsData.security_policy, value: v } });
                  }}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Max Failed Login Attempts</label>
                <input
                  type="number"
                  min={3}
                  max={10}
                  required
                  value={settingsData.security_policy?.value?.maxFailedLoginAttempts || 5}
                  onChange={(e) => {
                    const v = { ...settingsData.security_policy?.value, maxFailedLoginAttempts: parseInt(e.target.value, 10) };
                    setSettingsData({ ...settingsData, security_policy: { ...settingsData.security_policy, value: v } });
                  }}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lockout Duration (Minutes)</label>
                <input
                  type="number"
                  min={5}
                  max={120}
                  required
                  value={settingsData.security_policy?.value?.lockoutDurationMinutes || 15}
                  onChange={(e) => {
                    const v = { ...settingsData.security_policy?.value, lockoutDurationMinutes: parseInt(e.target.value, 10) };
                    setSettingsData({ ...settingsData, security_policy: { ...settingsData.security_policy, value: v } });
                  }}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Minimum Password Length</label>
                <input
                  type="number"
                  min={8}
                  max={32}
                  required
                  value={settingsData.security_policy?.value?.minPasswordLength || 8}
                  onChange={(e) => {
                    const v = { ...settingsData.security_policy?.value, minPasswordLength: parseInt(e.target.value, 10) };
                    setSettingsData({ ...settingsData, security_policy: { ...settingsData.security_policy, value: v } });
                  }}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <input
                  type="checkbox"
                  id="requireSpecial"
                  checked={Boolean(settingsData.security_policy?.value?.requireSpecialChar)}
                  onChange={(e) => {
                    const v = { ...settingsData.security_policy?.value, requireSpecialChar: e.target.checked };
                    setSettingsData({ ...settingsData, security_policy: { ...settingsData.security_policy, value: v } });
                  }}
                  className="w-4 h-4 text-[#0D9488] rounded"
                />
                <label htmlFor="requireSpecial" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Require Special Characters & Numbers in Passwords
                </label>
              </div>
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* TAB 4: COMPLIANCE WORKFLOW */}
        {/* ======================================================== */}
        {/* ======================================================== */}
        {activeTab === 'compliance' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveSetting('compliance_workflow', settingsData.compliance_workflow?.value || {});
            }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#0A1128]">Regulation 46 Review Cycle & Approver Workflow</h3>
                <p className="text-xs text-slate-500 mt-0.5">Configuration of secretarial sign-offs and review frequency</p>
              </div>
              {isSuperAdmin && (
                <button
                  type="submit"
                  disabled={savingKey === 'compliance_workflow'}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0A1128] hover:bg-[#121c3b] rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{savingKey === 'compliance_workflow' ? 'Saving...' : 'Save Workflow'}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Default Reviewing Officer</label>
                <input
                  type="text"
                  required
                  value={settingsData.compliance_workflow?.value?.defaultReviewer || 'Company Secretary & Compliance Officer'}
                  onChange={(e) => {
                    const v = { ...settingsData.compliance_workflow?.value, defaultReviewer: e.target.value };
                    setSettingsData({ ...settingsData, compliance_workflow: { ...settingsData.compliance_workflow, value: v } });
                  }}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Approving Authority</label>
                <input
                  type="text"
                  required
                  value={settingsData.compliance_workflow?.value?.defaultApprover || 'Board of Directors / Audit Committee'}
                  onChange={(e) => {
                    const v = { ...settingsData.compliance_workflow?.value, defaultApprover: e.target.value };
                    setSettingsData({ ...settingsData, compliance_workflow: { ...settingsData.compliance_workflow, value: v } });
                  }}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Review Cycle Interval (Days)</label>
                <input
                  type="number"
                  min={30}
                  max={365}
                  required
                  value={settingsData.compliance_workflow?.value?.reviewCycleDays || 90}
                  onChange={(e) => {
                    const v = { ...settingsData.compliance_workflow?.value, reviewCycleDays: parseInt(e.target.value, 10) };
                    setSettingsData({ ...settingsData, compliance_workflow: { ...settingsData.compliance_workflow, value: v } });
                  }}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Next Statutory Review Date</label>
                <input
                  type="date"
                  required
                  value={settingsData.compliance_workflow?.value?.nextStatutoryReviewDate || '2026-11-15'}
                  onChange={(e) => {
                    const v = { ...settingsData.compliance_workflow?.value, nextStatutoryReviewDate: e.target.value };
                    setSettingsData({ ...settingsData, compliance_workflow: { ...settingsData.compliance_workflow, value: v } });
                  }}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
