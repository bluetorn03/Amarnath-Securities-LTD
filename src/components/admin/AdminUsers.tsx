import React, { useState } from 'react';
import { 
  AdminUser, 
  AdminRole 
} from '../../types';
import { 
  UserCog, 
  Plus, 
  Key, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Shield, 
  RefreshCw, 
  X, 
  Lock, 
  Mail, 
  User, 
  ShieldCheck,
  Check,
  Minus
} from 'lucide-react';

interface AdminUsersProps {
  users: AdminUser[];
  loading: boolean;
  currentUser: AdminUser | null;
  onRefresh: () => void;
  onCreateUser: (data: { name: string; email: string; password: string; role: AdminRole }) => Promise<void>;
  onUpdateUser: (id: string, data: { name?: string; role?: AdminRole; isActive?: boolean }) => Promise<void>;
  onResetPassword: (id: string, newPass: string) => Promise<void>;
  onDeleteUser: (id: string) => Promise<void>;
}

export const AdminUsers: React.FC<AdminUsersProps> = ({
  users,
  loading,
  currentUser,
  onRefresh,
  onCreateUser,
  onUpdateUser,
  onResetPassword,
  onDeleteUser
}) => {
  // Add User Modal
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [addName, setAddName] = useState<string>('');
  const [addEmail, setAddEmail] = useState<string>('');
  const [addPassword, setAddPassword] = useState<string>('');
  const [addRole, setAddRole] = useState<AdminRole>('editor');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [addError, setAddError] = useState<string | null>(null);

  // Edit User Modal
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [editRole, setEditRole] = useState<AdminRole>('editor');
  const [editActive, setEditActive] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Reset Password Modal
  const [resetUser, setResetUser] = useState<AdminUser | null>(null);
  const [newPassword, setNewPassword] = useState<string>('');
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [resetError, setResetError] = useState<string | null>(null);

  // Delete User Modal
  const [deleteUser, setDeleteUser] = useState<AdminUser | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const isSuperAdmin = currentUser?.role === 'super_admin';

  const handleOpenEdit = (user: AdminUser) => {
    setEditUser(user);
    setEditName(user.name);
    setEditRole(user.role);
    setEditActive(user.isActive);
    setEditError(null);
  };

  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (addPassword.length < 8) {
      setAddError('Password must contain at least 8 characters.');
      return;
    }
    setIsCreating(true);
    setAddError(null);
    try {
      await onCreateUser({ name: addName, email: addEmail, password: addPassword, role: addRole });
      setShowAddModal(false);
      setAddName('');
      setAddEmail('');
      setAddPassword('');
      setAddRole('editor');
    } catch (err: any) {
      setAddError(err.message || 'Error creating user account.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    setIsUpdating(true);
    setEditError(null);
    try {
      await onUpdateUser(editUser.id, { name: editName, role: editRole, isActive: editActive });
      setEditUser(null);
    } catch (err: any) {
      setEditError(err.message || 'Error updating user.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetUser) return;
    if (newPassword.length < 8) {
      setResetError('Password must contain at least 8 characters.');
      return;
    }
    setIsResetting(true);
    setResetError(null);
    try {
      await onResetPassword(resetUser.id, newPassword);
      setResetUser(null);
      setNewPassword('');
    } catch (err: any) {
      setResetError(err.message || 'Error resetting password.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteUser) return;
    setIsDeleting(true);
    try {
      await onDeleteUser(deleteUser.id);
      setDeleteUser(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const getRoleBadge = (role: AdminRole) => {
    switch (role) {
      case 'super_admin':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded border bg-[#C5A059]/15 text-[#8C6D23] border-[#C5A059]/40">Super Admin</span>;
      case 'compliance_officer':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded border bg-[#0D9488]/15 text-[#0F766E] border-[#0D9488]/40">Compliance Officer</span>;
      case 'editor':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded border bg-blue-50 text-blue-700 border-blue-200">Editor</span>;
      case 'viewer':
      default:
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded border bg-slate-100 text-slate-700 border-slate-200">Viewer</span>;
    }
  };

  // Permission Matrix Definition
  const permissions = [
    { name: 'View Public & Admin Disclosures', super: true, comp: true, edit: true, view: true },
    { name: 'Upload & Draft Filings', super: true, comp: true, edit: true, view: false },
    { name: 'Approve & Publish Statutory Filings', super: true, comp: true, edit: false, view: false },
    { name: 'Regulation 46 Sign-Off & Verification', super: true, comp: true, edit: false, view: false },
    { name: 'Grievance Redressal Triage', super: true, comp: true, edit: false, view: false },
    { name: 'Manage System & Profile Settings', super: true, comp: false, edit: false, view: false },
    { name: 'Manage Users & Role Assignments', super: true, comp: false, edit: false, view: false },
    { name: 'Execute Database Backup & Restore', super: true, comp: false, edit: false, view: false },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#0A1128] flex items-center gap-2">
            <UserCog className="w-4 h-4 text-[#0D9488]" />
            <span>Administrative Users & Access Control</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Strict least-privilege Role-Based Access Control (RBAC) enforced across API and database
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSuperAdmin && (
            <button
              onClick={() => { setShowAddModal(true); setAddError(null); }}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0A1128] hover:bg-[#121c3b] rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-4 h-4 text-[#C5A059]" />
              <span>Add Staff User</span>
            </button>
          )}
          <button
            onClick={onRefresh}
            className="p-1.5 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            title="Reload user roster"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#0D9488]' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Users Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAFBFD] border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">User Name</th>
                <th className="py-3 px-4">Email Address</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Account State</th>
                <th className="py-3 px-3">Last Login</th>
                <th className="py-3 px-3">Created</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#0D9488]" />
                    <span>Loading users...</span>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No users registered.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#0A1128]">{u.name}</div>
                      {u.id === currentUser?.id && (
                        <span className="text-[10px] text-[#0D9488] font-semibold">(Your Session)</span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                      {u.email}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      {getRoleBadge(u.role)}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      {u.isActive ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          <XCircle className="w-3 h-3 text-rose-600" />
                          <span>Deactivated</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap text-[11px] text-slate-500">
                      {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'Never'}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap text-[11px] text-slate-400">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : '—'}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {isSuperAdmin && (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(u)}
                            title="Edit Role & Status"
                            className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => { setResetUser(u); setNewPassword(''); setResetError(null); }}
                            title="Reset User Password"
                            className="p-1 text-slate-400 hover:text-[#C5A059] hover:bg-amber-50 rounded transition-colors"
                          >
                            <Key className="w-3.5 h-3.5" />
                          </button>

                          {u.id !== currentUser?.id && (
                            <button
                              onClick={() => setDeleteUser(u)}
                              title="Delete User"
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Least Privilege Permission Matrix */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
        <div>
          <h3 className="text-sm font-bold text-[#0A1128] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0D9488]" />
            <span>Institutional Role-Based Access Control (RBAC) Matrix</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Clear authorization boundaries implemented to prevent unauthorized disclosures and preserve regulatory auditability
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAFBFD] border-b border-slate-200 text-slate-600 font-bold text-[10px] uppercase">
                <th className="py-2.5 px-3">System Capability</th>
                <th className="py-2.5 px-3 text-center">Super Admin</th>
                <th className="py-2.5 px-3 text-center">Compliance Officer</th>
                <th className="py-2.5 px-3 text-center">Editor</th>
                <th className="py-2.5 px-3 text-center">Viewer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {permissions.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-medium">{p.name}</td>
                  <td className="py-2.5 px-3 text-center">
                    {p.super ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <Minus className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {p.comp ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <Minus className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {p.edit ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <Minus className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {p.view ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <Minus className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: ADD USER */}
      {/* ======================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-[#FAFBFD]">
              <h3 className="text-sm font-bold text-[#0A1128]">Create Administrative Account</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="p-5 space-y-3.5">
              {addError && (
                <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-xs text-rose-800">
                  {addError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  placeholder="e.g. Compliance Associate"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  placeholder="user@amarnathsecuritiesltd.com"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Role Assignment *</label>
                <select
                  value={addRole}
                  onChange={(e) => setAddRole(e.target.value as AdminRole)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="editor">Editor (Uploads & Drafts)</option>
                  <option value="compliance_officer">Compliance Officer (Review & Verification)</option>
                  <option value="viewer">Viewer (Read-Only)</option>
                  <option value="super_admin">Super Admin (Full Administrative Authority)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Initial Password *</label>
                <input
                  type="password"
                  required
                  value={addPassword}
                  onChange={(e) => setAddPassword(e.target.value)}
                  placeholder="Minimum 8 characters..."
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0A1128] hover:bg-[#121c3b] rounded-lg transition-colors disabled:opacity-50"
                >
                  {isCreating ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: EDIT USER */}
      {/* ======================================================== */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-[#FAFBFD]">
              <h3 className="text-sm font-bold text-[#0A1128]">Edit Account: {editUser.email}</h3>
              <button onClick={() => setEditUser(null)} className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-3.5">
              {editError && (
                <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-xs text-rose-800">
                  {editError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Role Assignment *</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as AdminRole)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="editor">Editor (Uploads & Drafts)</option>
                  <option value="compliance_officer">Compliance Officer (Review & Verification)</option>
                  <option value="viewer">Viewer (Read-Only)</option>
                  <option value="super_admin">Super Admin (Full Authority)</option>
                </select>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800">Account Active State</div>
                  <div className="text-[11px] text-slate-500">Deactivating denies all future logins immediately</div>
                </div>
                <input
                  type="checkbox"
                  checked={editActive}
                  onChange={(e) => setEditActive(e.target.checked)}
                  className="w-4 h-4 text-[#0D9488] rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditUser(null)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0A1128] hover:bg-[#121c3b] rounded-lg transition-colors disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: RESET PASSWORD */}
      {/* ======================================================== */}
      {resetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-[#FAFBFD]">
              <h3 className="text-sm font-bold text-[#0A1128]">Reset Password: {resetUser.name}</h3>
              <button onClick={() => setResetUser(null)} className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveResetPassword} className="p-5 space-y-3.5">
              {resetError && (
                <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-xs text-rose-800">
                  {resetError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">New Password *</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters..."
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResetUser(null)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isResetting}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0A1128] hover:bg-[#121c3b] rounded-lg transition-colors disabled:opacity-50"
                >
                  {isResetting ? 'Resetting...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: DELETE CONFIRMATION */}
      {/* ======================================================== */}
      {deleteUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-slate-200 p-5 space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0A1128]">Delete User Account</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to permanently remove <strong className="text-slate-800">{deleteUser.name}</strong> ({deleteUser.email})?
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteUser(null)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
