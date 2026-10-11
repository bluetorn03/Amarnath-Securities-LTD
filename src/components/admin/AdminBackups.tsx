import React, { useState } from 'react';
import { DatabaseBackupItem, AdminUser } from '../../types';
import { 
  Database, 
  Download, 
  RotateCcw, 
  Plus, 
  RefreshCw, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  X,
  FileCode,
  HardDrive
} from 'lucide-react';

interface AdminBackupsProps {
  backups: DatabaseBackupItem[];
  loading: boolean;
  currentUser: AdminUser | null;
  onRefresh: () => void;
  onCreateBackup: () => Promise<void>;
  onRestoreBackup: (filename: string, confirmation: string) => Promise<void>;
}

export const AdminBackups: React.FC<AdminBackupsProps> = ({
  backups,
  loading,
  currentUser,
  onRefresh,
  onCreateBackup,
  onRestoreBackup
}) => {
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [restoreFile, setRestoreFile] = useState<DatabaseBackupItem | null>(null);
  const [confirmText, setConfirmText] = useState<string>('');
  const [isRestoring, setIsRestoring] = useState<boolean>(false);
  const [restoreError, setRestoreError] = useState<string | null>(null);

  const isSuperAdmin = currentUser?.role === 'super_admin';

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      await onCreateBackup();
    } finally {
      setIsCreating(false);
    }
  };

  const handleConfirmRestore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restoreFile) return;

    if (confirmText !== 'RESTORE_DATABASE_CONFIRM') {
      setRestoreError('You must type RESTORE_DATABASE_CONFIRM exactly to verify this destructive action.');
      return;
    }

    setIsRestoring(true);
    setRestoreError(null);
    try {
      await onRestoreBackup(restoreFile.filename, confirmText);
      setRestoreFile(null);
      setConfirmText('');
    } catch (err: any) {
      setRestoreError(err.message || 'Error executing database restore.');
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#0A1128] flex items-center gap-2">
            <Database className="w-4 h-4 text-[#0D9488]" />
            <span>Database Backups & Controlled Recovery</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Full transactional SQL database dumps stored securely with rollback capability
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSuperAdmin && (
            <button
              onClick={handleCreate}
              disabled={isCreating}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0A1128] hover:bg-[#121c3b] rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
            >
              <Plus className="w-4 h-4 text-[#C5A059]" />
              <span>{isCreating ? 'Dumping SQL...' : 'Create Snapshot'}</span>
            </button>
          )}
          <button
            onClick={onRefresh}
            className="p-1.5 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            title="Reload backup inventory"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#0D9488]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Institutional Safeguard Notice:</span> Database restoration replaces active MySQL table records with the state preserved in the chosen snapshot. Restricted strictly to Super Administrator authority with mandatory safety confirmation tokens.
        </div>
      </div>

      {/* 2. Backups Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAFBFD] border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Dump Filename</th>
                <th className="py-3 px-3">File Size</th>
                <th className="py-3 px-3">Created Timestamp</th>
                <th className="py-3 px-3">Integrity State</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-sans text-xs">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#0D9488]" />
                    <span>Loading backup snapshots...</span>
                  </td>
                </tr>
              ) : backups.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-sans text-xs">
                    <Database className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <span>No database backup snapshots found in /backups storage.</span>
                  </td>
                </tr>
              ) : (
                backups.map((b) => (
                  <tr key={b.filename} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#0A1128] flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-[#C5A059] shrink-0" />
                      <span>{b.filename}</span>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap text-slate-600 font-sans text-xs">
                      {b.sizeDisplay}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap text-slate-500 font-sans text-xs">
                      {new Date(b.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap font-sans">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Available on Disk</span>
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap font-sans">
                      {isSuperAdmin && (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => { setRestoreFile(b); setConfirmText(''); setRestoreError(null); }}
                            className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors inline-flex items-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3 text-rose-600" />
                            <span>Restore</span>
                          </button>
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

      {/* ======================================================== */}
      {/* MODAL: CONTROLLED RESTORE CONFIRMATION */}
      {/* ======================================================== */}
      {restoreFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-[#FAFBFD]">
              <h3 className="text-sm font-bold text-[#0A1128] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Execute Controlled Restore</span>
              </h3>
              <button onClick={() => setRestoreFile(null)} className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmRestore} className="p-5 space-y-4 text-xs">
              {restoreError && (
                <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-800">
                  {restoreError}
                </div>
              )}

              <div className="p-3 rounded-lg bg-rose-50/60 border border-rose-200 text-rose-900 space-y-1">
                <span className="font-bold">Target Snapshot:</span>
                <div className="font-mono text-[11px] font-semibold">{restoreFile.filename}</div>
                <div className="text-[10px] text-rose-700 mt-1">
                  WARNING: Current database records will be dropped and replaced with the snapshot data. Ensure current data has been backed up before proceeding.
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Type <span className="font-mono font-extrabold text-rose-600 select-all">RESTORE_DATABASE_CONFIRM</span> to verify *
                </label>
                <input
                  type="text"
                  required
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="RESTORE_DATABASE_CONFIRM"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRestoreFile(null)}
                  className="px-3.5 py-1.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRestoring || confirmText !== 'RESTORE_DATABASE_CONFIRM'}
                  className="px-4 py-1.5 font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isRestoring ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
                  <span>{isRestoring ? 'Restoring...' : 'Execute Recovery'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
