import { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { getMonthlyData } from '../../utils/finance';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const fmt = v => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '10px',
      padding: '12px 16px',
      boxShadow: 'var(--shadow-lg)',
    }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: 8, fontSize: 14 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
          <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{p.dataKey}:</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default function BalanceTrendChart() {
  const { state } = useFinance();
  const data = useMemo(() => getMonthlyData(state.transactions, 6), [state.transactions]);

  return (
    <div className="card" style={{ flex: 1 }}>
      <div className="card-header">
        <div className="card-title">Balance Trend</div>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Last 6 months</span>
      </div>
      <div className="card-body">
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gradIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4a9b6f" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4a9b6f" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d4635a" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#d4635a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradSavings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4a7fb5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4a7fb5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)', fontFamily: 'var(--font-body)' }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
                axisLine={false} tickLine={false}
                tickFormatter={v => `₹${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12, fontFamily: 'var(--font-body)', paddingTop: 8 }}
                formatter={label => <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{label}</span>}
              />
              <Area type="monotone" dataKey="income" stroke="#4a9b6f" strokeWidth={2} fill="url(#gradIncome)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
              <Area type="monotone" dataKey="expenses" stroke="#d4635a" strokeWidth={2} fill="url(#gradExpenses)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
              <Area type="monotone" dataKey="savings" stroke="#4a7fb5" strokeWidth={2} fill="url(#gradSavings)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
