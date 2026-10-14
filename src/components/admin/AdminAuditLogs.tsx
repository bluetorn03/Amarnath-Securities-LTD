import React, { useState, useMemo } from 'react';
import { AuditLogItem } from '../../types';
import { 
  FileSearch, 
  Search, 
  Filter, 
  RefreshCw, 
  ShieldCheck, 
  Eye, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  User,
  Globe
} from 'lucide-react';

interface AdminAuditLogsProps {
  logs: AuditLogItem[];
  loading: boolean;
  onRefresh: () => void;
}

const ITEMS_PER_PAGE = 12;

export const AdminAuditLogs: React.FC<AdminAuditLogsProps> = ({
  logs,
  loading,
  onRefresh
}) => {
  const [search, setSearch] = useState<string>('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeLog, setActiveLog] = useState<AuditLogItem | null>(null);

  const actionsList = useMemo(() => {
    const set = new Set(logs.map((l) => l.action));
    return Array.from(set).sort();
  }, [logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (actionFilter !== 'all' && log.action !== actionFilter) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesAction = log.action.toLowerCase().includes(q);
        const matchesUser = log.user_email?.toLowerCase().includes(q) || log.user_name?.toLowerCase().includes(q);
        const matchesIp = log.ip_address?.toLowerCase().includes(q);
        const matchesEntity = log.entity_type?.toLowerCase().includes(q) || log.entity_id?.toLowerCase().includes(q);
        if (!matchesAction && !matchesUser && !matchesIp && !matchesEntity) return false;
      }

      return true;
    });
  }, [logs, actionFilter, search]);

  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE) || 1;
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLogs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredLogs, currentPage]);

  const getActionBadgeColor = (action: string) => {
    if (action.includes('LOGIN')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (action.includes('CREATE') || action.includes('APPROVE') || action.includes('PUBLISH')) return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    if (action.includes('DELETE') || action.includes('FAILED')) return 'bg-rose-50 text-rose-800 border-rose-200';
    if (action.includes('BACKUP')) return 'bg-purple-50 text-purple-800 border-purple-200';
    if (action.includes('PROFILE') || action.includes('SETTINGS') || action.includes('INVESTOR')) return 'bg-amber-50 text-amber-900 border-amber-300 font-bold';
    return 'bg-slate-100 text-slate-800 border-slate-200';
  };

  return (
    <div className="space-y-5">
      {/* 1. Header Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#0A1128] flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-[#0D9488]" />
              <span>Immutable Regulatory & Security Audit Logs</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Chronological non-repudiation records of administrative logins, document lifecycle transitions, and configuration edits
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>1-Yr Auto-Purge Active</span>
            </span>
            <button
              onClick={onRefresh}
              title="Reload audit records"
              className="p-1.5 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#0D9488]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search action, email, IP address, entity ID..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#0D9488]"
            />
          </div>

          <div>
            <select
              value={actionFilter}
              onChange={(e) => { setActionFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden text-slate-700 cursor-pointer"
            >
              <option value="all">Filter by Action: All Events ({logs.length})</option>
              {actionsList.map((act) => (
                <option key={act} value={act}>{act}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Audit Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAFBFD] border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Timestamp (IST)</th>
                <th className="py-3 px-3">Action Type</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-3">Target Entity</th>
                <th className="py-3 px-3">IP Address</th>
                <th className="py-3 px-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-sans text-xs">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#0D9488]" />
                    <span>Loading audit records...</span>
                  </td>
                </tr>
              ) : paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-sans text-xs">
                    <FileSearch className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <span>No audit entries found matching the query.</span>
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 whitespace-nowrap font-sans text-xs">
                      <div className="font-semibold text-slate-800">
                        {log.formatted_ist || new Date(log.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true })}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 text-[#0D9488]" />
                        <span>IST (UTC+5:30)</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getActionBadgeColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap font-sans">
                      <div className="font-semibold text-[#0A1128] text-xs">
                        {log.user_name || 'System / Anonymous'}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {log.user_email || '—'}
                      </div>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap font-sans text-xs text-slate-700">
                      <div>{log.entity_type}</div>
                      {log.entity_id && (
                        <div className="text-[10px] font-mono text-slate-400 truncate max-w-[140px]">
                          {log.entity_id}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap text-slate-600">
                      {log.ip_address || '—'}
                    </td>

                    <td className="py-3 px-3 text-right whitespace-nowrap font-sans">
                      <button
                        onClick={() => setActiveLog(log)}
                        className="px-2 py-1 text-xs font-semibold text-[#0D9488] bg-teal-50 hover:bg-teal-100 rounded-md border border-teal-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 3. Pagination Footer */}
        <div className="p-3 bg-[#FAFBFD] border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-sans">
          <div>
            Showing <strong className="text-slate-800">{paginatedLogs.length}</strong> of{' '}
            <strong className="text-slate-800">{filteredLogs.length}</strong> events
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px] font-semibold text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL: INSPECT AUDIT ENTRY DETAILS */}
      {/* ======================================================== */}
      {activeLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-[#FAFBFD]">
              <div>
                <h3 className="text-sm font-bold text-[#0A1128] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0D9488]" />
                  <span>Audit Event: {activeLog.action}</span>
                </h3>
                <div className="text-xs text-slate-500 font-mono mt-0.5">Event ID #{activeLog.id}</div>
              </div>
              <button
                onClick={() => setActiveLog(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs font-sans overflow-y-auto flex-1">
              {/* Event Metadata Grid */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Actor</span>
                  <strong className="text-slate-800">{activeLog.user_name || 'System / Anonymous'}</strong>
                  <div className="text-[10px] font-mono text-slate-500">{activeLog.user_email || '—'}</div>
                  {activeLog.user_role && (
                    <span className="inline-block mt-1 text-[9px] font-bold uppercase bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                      Role: {activeLog.user_role}
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Timestamp</span>
                  <div className="text-slate-900 font-semibold font-mono">
                    {activeLog.formatted_ist || new Date(activeLog.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true })} (IST)
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    UTC: {new Date(activeLog.created_at).toUTCString()}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Entity</span>
                  <span className="text-slate-800 font-mono">{activeLog.entity_type} {activeLog.entity_id ? `(${activeLog.entity_id})` : ''}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Network Address (IP)</span>
                  <span className="text-slate-800 font-mono">{activeLog.ip_address || '—'}</span>
                </div>
              </div>

              {/* Summary Banner if available */}
              {activeLog.details?.summary && (
                <div className="p-3 rounded-lg bg-amber-50/80 border border-amber-200 text-amber-950 font-medium text-xs">
                  <strong>Summary:</strong> {activeLog.details.summary}
                </div>
              )}

              {/* State Diff / Changes Table if changes are tracked */}
              {activeLog.details?.changes && typeof activeLog.details.changes === 'object' && !Array.isArray(activeLog.details.changes) && Object.keys(activeLog.details.changes).length > 0 && (
                <div>
                  <span className="block font-bold text-slate-700 mb-1.5">Modified Attributes Comparison (Before vs After)</span>
                  <div className="rounded-lg border border-slate-200 overflow-hidden bg-white">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-mono border-b border-slate-200">
                        <tr>
                          <th className="py-2 px-3">Field</th>
                          <th className="py-2 px-3">Previous Value (Before)</th>
                          <th className="py-2 px-3">New Value (After)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                        {Object.entries(activeLog.details.changes).map(([field, diff]: [string, any]) => (
                          <tr key={field} className="hover:bg-slate-50/50">
                            <td className="py-2 px-3 font-semibold text-slate-800">{field}</td>
                            <td className="py-2 px-3 text-rose-800 bg-rose-50/40 max-w-[200px] break-words">
                              {diff?.from !== null && diff?.from !== undefined ? String(diff.from) : <span className="text-slate-400 italic">null</span>}
                            </td>
                            <td className="py-2 px-3 text-emerald-800 bg-emerald-50/40 max-w-[200px] break-words font-semibold">
                              {diff?.to !== null && diff?.to !== undefined ? String(diff.to) : <span className="text-slate-400 italic">null</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Raw JSON Payload Inspector */}
              <div>
                <span className="block font-bold text-slate-700 mb-1">Raw Payload & Technical Context</span>
                <pre className="p-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto max-h-52 scrollbar-thin">
                  {JSON.stringify(activeLog.details, null, 2)}
                </pre>
              </div>
            </div>

            <div className="p-3 bg-[#FAFBFD] border-t border-slate-200 text-right">
              <button
                onClick={() => setActiveLog(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
