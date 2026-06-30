cat > /mnt/user-data/outputs/ActivityLogs.js << 'EOF'
import React, { useState, useEffect, useCallback } from 'react';
import './ActivityLogs.css';

const SUPABASE_URL = 'https://rhrsebtzwqjvjdrtvuhl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJocnNlYnR6d3FqdmpkcnR2dWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0OTI3MzEsImV4cCI6MjA5ODA2ODczMX0.Nay0yADjjFzzQ2qH90xa6EHPwRuNFosJTLTgniVF5g8';

// ── Logger utility — call this anywhere in the app to log an action ──
export async function logActivity(type, action, actorName, actorRole, details = {}) {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/activity_logs`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        type, action,
        actor_name: actorName,
        actor_role: actorRole,
        details,
      }),
    });
  } catch (e) { /* fail silently — logging should never break the app */ }
}

const TYPE_CONFIG = {
  login        : { icon:'🔐', color:'#3b82f6', label:'Login' },
  register     : { icon:'👤', color:'#10b981', label:'Registration' },
  order        : { icon:'📦', color:'#ff6b35', label:'Order' },
  payment      : { icon:'💳', color:'#a855f7', label:'Payment' },
  stock        : { icon:'📋', color:'#f59e0b', label:'Stock Change' },
  admin        : { icon:'👑', color:'#ef4444', label:'Admin Action' },
  menu         : { icon:'🍕', color:'#06b6d4', label:'Menu Change' },
  security     : { icon:'🛡️', color:'#dc2626', label:'Security Alert' },
};

export default function ActivityLogs() {
  const [logs, setLogs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filterType, setFilterType] = useState('all');
  const [page, setPage]         = useState(0);
  const PAGE_SIZE = 30;

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/activity_logs?select=*&order=created_at.desc&limit=${PAGE_SIZE}&offset=${page * PAGE_SIZE}`,
        { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
      );
      const data = await res.json();
      setLogs(Array.isArray(data) ? data : []);
    } catch (e) { setLogs([]); }
    setLoading(false);
  }, [page]);

  useEffect(() => {
    loadLogs();
    const interval = setInterval(loadLogs, 15000); // auto refresh every 15s
    return () => clearInterval(interval);
  }, [loadLogs]);

  const filtered = logs.filter(log => {
    const matchesType = filterType === 'all' || log.type === filterType;
    const matchesSearch = !search ||
      log.action?.toLowerCase().includes(search.toLowerCase()) ||
      log.actor_name?.toLowerCase().includes(search.toLowerCase()) ||
      JSON.stringify(log.details || {}).toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const timeSince = (dateStr) => {
    const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds/60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds/3600)}h ago`;
    return `${Math.floor(seconds/86400)}d ago`;
  };

  return (
    <div className="al-page">

      <div className="al-header">
        <div>
          <h2>📜 Activity Logs</h2>
          <span>Complete audit trail — every action in one place</span>
        </div>
        <button className="al-refresh" onClick={loadLogs}>🔄 Refresh</button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="al-controls">
        <input
          className="al-search"
          placeholder="🔍 Search by action, name, or details..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="al-filter-row">
          <button className={`al-filter-btn ${filterType==='all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}>All</button>
          {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
            <button key={key}
              className={`al-filter-btn ${filterType===key ? 'active' : ''}`}
              style={filterType===key ? { borderColor: cfg.color, color: cfg.color, background: cfg.color+'15' } : {}}
              onClick={() => setFilterType(key)}>
              {cfg.icon} {cfg.label}
            </button>
          ))}
        </div>
      </div>

      {/* LOGS LIST */}
      <div className="al-logs-list">
        {loading && logs.length === 0 ? (
          <div className="al-empty">Loading logs...</div>
        ) : filtered.length === 0 ? (
          <div className="al-empty">
            <span style={{fontSize:40}}>📭</span>
            <p>No activity logs found yet.</p>
            <p style={{fontSize:12,color:'#666'}}>Logs will appear here as users interact with the app.</p>
          </div>
        ) : (
          filtered.map(log => {
            const cfg = TYPE_CONFIG[log.type] || { icon:'📌', color:'#888', label: log.type };
            return (
              <div className="al-log-row" key={log.id}>
                <div className="al-log-icon" style={{ background: cfg.color+'15', color: cfg.color }}>
                  {cfg.icon}
                </div>
                <div className="al-log-content">
                  <div className="al-log-top">
                    <strong>{log.action}</strong>
                    <span className="al-log-time">{timeSince(log.created_at)}</span>
                  </div>
                  <div className="al-log-meta">
                    {log.actor_name && <span>👤 {log.actor_name}</span>}
                    {log.actor_role && <span className="al-log-role" style={{color:cfg.color}}>{log.actor_role}</span>}
                  </div>
                  {log.details && Object.keys(log.details).length > 0 && (
                    <div className="al-log-details">
                      {Object.entries(log.details).map(([k,v]) => (
                        <span key={k}><b>{k}:</b> {String(v)}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* PAGINATION */}
      <div className="al-pagination">
        <button disabled={page===0} onClick={() => setPage(p => Math.max(0,p-1))}>← Previous</button>
        <span>Page {page + 1}</span>
        <button disabled={logs.length < PAGE_SIZE} onClick={() => setPage(p => p+1)}>Next →</button>
      </div>

    </div>
  );
}