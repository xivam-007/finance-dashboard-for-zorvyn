import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { useFinance } from '../../context/FinanceContext';
import { CATEGORIES } from '../../data/mockData';
import { getFilteredTransactions } from '../../utils/finance';

export default function TransactionTable() {
  const { state, isAdmin, openTransactionModal, openDeleteConfirm } = useFinance();
  const { filters } = state;

  const transactions = useMemo(
    () => getFilteredTransactions(state.transactions, filters),
    [state.transactions, filters]
  );

  const fmt = v => new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0
  }).format(v);

  if (transactions.length === 0) {
    return (
      <div className="card">
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <div className="empty-title">No transactions found</div>
          <div className="empty-subtitle">Try adjusting your filters or search query</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Type</th>
              <th style={{ textAlign: 'right' }}>Amount</th>
              {isAdmin && <th style={{ textAlign: 'center' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => {
              const cat = CATEGORIES[tx.category];
              return (
                <tr key={tx.id}>
                  <td>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                      {format(parseISO(tx.date), 'dd MMM')}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {format(parseISO(tx.date), 'yyyy')}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{tx.description}</div>
                    {tx.note && (
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{tx.note}</div>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{
                        width: 28, height: 28, borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-tertiary)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0,
                      }}>
                        {cat?.icon || '💳'}
                      </span>
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                        {cat?.label || tx.category}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${tx.type}`}>
                      {tx.type === 'income' ? '↑' : '↓'} {tx.type}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                      color: tx.type === 'income' ? 'var(--accent-green)' : 'var(--accent-red)',
                    }}>
                      {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                    </span>
                  </td>
                  {isAdmin && (
                    <td>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                        <button
                          className="btn btn-icon btn-sm"
                          onClick={() => openTransactionModal(tx)}
                          title="Edit"
                          style={{ fontSize: 13 }}
                        >
                          ✏️
                        </button>
                        <button
                          className="btn btn-icon btn-sm"
                          onClick={() => openDeleteConfirm(tx.id)}
                          title="Delete"
                          style={{ fontSize: 13 }}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
