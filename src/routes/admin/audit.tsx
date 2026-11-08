import React, { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { History, Shield, Clock, Search } from 'lucide-react'
import { api } from '@/api/client'
import { AuditEntry } from '@/api/types'

export const Route = createFileRoute('/admin/audit')({
  component: AdminAuditPage,
})

function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    api.getAuditLog().then((res) => setLogs(res))
  }, [])

  const filteredLogs = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(filter.toLowerCase()) ||
      l.entity.toLowerCase().includes(filter.toLowerCase()) ||
      l.details.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--hairline)]">
        <div>
          <span className="label-caps text-[var(--acc)]">Audit Trail</span>
          <h1 className="text-3xl sm:text-4xl font-display text-[var(--bone)] mt-1">Activity Log</h1>
          <p className="text-xs text-[var(--muted)] font-sans">
            Immutable log of status shifts, inventory overrides and configuration changes
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--muted)]" />
          <input
            type="text"
            placeholder="Filter audit actions..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full h-10 pl-9 pr-3 text-xs font-sans bg-transparent border border-[var(--hairline)] text-[var(--bone)] focus:outline-none focus:border-[var(--acc)]"
          />
        </div>
      </div>

      <div className="border border-[var(--hairline)] bg-[var(--ink)] overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead className="bg-[#121110] border-b border-[var(--hairline)] text-[var(--muted)] uppercase tracking-wider">
            <tr>
              <th className="p-3.5">Timestamp</th>
              <th className="p-3.5">Action</th>
              <th className="p-3.5">Entity</th>
              <th className="p-3.5">User</th>
              <th className="p-3.5">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--hairline)]/40 font-mono text-[11px]">
            {filteredLogs.map((l) => (
              <tr key={l.id} className="hover:bg-[var(--surface-tint)]">
                <td className="p-3.5 text-[var(--muted)]">
                  {new Date(l.timestamp).toLocaleString()}
                </td>
                <td className="p-3.5 font-bold text-[var(--bone)]">{l.action}</td>
                <td className="p-3.5 text-[var(--acc)]">{l.entity} ({l.entityId})</td>
                <td className="p-3.5 text-[var(--bone)]">{l.user}</td>
                <td className="p-3.5 text-[var(--muted)] font-sans">{l.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
