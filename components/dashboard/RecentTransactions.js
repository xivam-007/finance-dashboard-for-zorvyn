import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { useFinance } from '../../context/FinanceContext';
import { CATEGORIES } from '../../data/mockData';

export default function RecentTransactions() {
  const { state, setActiveTab } = useFinance();

  const recent = useMemo(() =>
    [...state.transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6),
    [state.transactions]
  );

  const fmt = v => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <div className="card-header">
        <div className="card-title">Recent Transactions</div>
        <button
          className="btn btn-sm btn-secondary"
          onClick={() => setActiveTab('transactions')}
        >
          View all →
        </button>
      </div>
      <div className="card-body" style={{ padding: '12px 0 0' }}>
        {recent.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <div className="empty-title">No transactions yet</div>
            <div className="empty-subtitle">Add your first transaction to get started</div>
          </div>
        ) : (
          <div>
            {recent.map((tx, idx) => {
              const cat = CATEGORIES[tx.category];
              return (
                <div
                  key={tx.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 24px',
                    borderBottom: idx < recent.length - 1 ? '1px solid var(--border)' : 'none',
                    gap: 12,
                    transition: 'var(--transition)',
                    cursor: 'default',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-tertiary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, flexShrink: 0,
                  }}>
                    {cat?.icon || '💳'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: 14, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {tx.description}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {cat?.label} · {format(parseISO(tx.date), 'MMM d')}
                    </div>
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    fontSize: 14,
                    color: tx.type === 'income' ? 'var(--accent-green)' : 'var(--accent-red)',
                    flexShrink: 0,
                  }}>
                    {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
