import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { getCategoryBreakdown } from '../../utils/finance';
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '10px',
      padding: '10px 14px',
      boxShadow: 'var(--shadow-lg)',
      fontSize: 13,
    }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{d.icon} {d.label}</div>
      <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-red)' }}>
        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(d.amount)}
      </div>
    </div>
  );
};

export default function SpendingBreakdown() {
  const { state } = useFinance();

  const data = useMemo(() => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    const monthTxs = state.transactions.filter(tx =>
      isWithinInterval(parseISO(tx.date), { start, end })
    );
    return getCategoryBreakdown(monthTxs).slice(0, 6);
  }, [state.transactions]);

  const total = data.reduce((s, d) => s + d.amount, 0);

  if (!data.length) {
    return (
      <div className="card">
        <div className="card-header"><div className="card-title">Spending by Category</div></div>
        <div className="card-body">
          <div className="empty-state" style={{ padding: '30px 0' }}>
            <div className="empty-icon">📊</div>
            <div className="empty-title">No expenses this month</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Spending Breakdown</div>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>This month</span>
      </div>
      <div className="card-body">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Donut */}
          <div style={{ height: 160, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%" cy="50%"
                  innerRadius={50} outerRadius={72}
                  paddingAngle={2}
                  dataKey="amount"
                >
                  {data.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)',
              textAlign: 'center',
              pointerEvents: 'none',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                ₹{(total / 1000).toFixed(1)}K
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Total</div>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.map((item) => {
              const pct = total > 0 ? (item.amount / total) * 100 : 0;
              return (
                <div key={item.category} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', flex: 1, display: 'flex', justifyContent: 'space-between' }}>
                    <span>{item.icon} {item.label}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>{pct.toFixed(0)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
