import { useMemo, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
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
  const [chartType, setChartType] = useState('bar'); 
  const data = useMemo(() => getMonthlyData(state.transactions, 6), [state.transactions]);

  const colors = {
    income: "#4a9b6f",
    expenses: "#d4635a",
    savings: "#4a7fb5"
  };

  return (
    <div className="card" style={{ flex: 1 }}>
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="card-title">Balance Trend</div>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Last 6 months</span>
        </div>
        
        {/* Simple UI Toggle */}
        <div style={{ 
          display: 'flex', 
          background: 'var(--bg-muted)', 
          padding: '4px', 
          borderRadius: '8px',
          border: '1px solid var(--border)' 
        }}>
          <button 
            onClick={() => setChartType('area')}
            style={{
              padding: '4px 12px',
              fontSize: '11px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              background: chartType === 'area' ? 'var(--bg-card)' : 'transparent',
              color: chartType === 'area' ? 'var(--text-primary)' : 'var(--text-muted)',
              boxShadow: chartType === 'area' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s'
            }}
          >Area</button>
          <button 
            onClick={() => setChartType('bar')}
            style={{
              padding: '4px 12px',
              fontSize: '11px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              background: chartType === 'bar' ? 'var(--bg-card)' : 'transparent',
              color: chartType === 'bar' ? 'var(--text-primary)' : 'var(--text-muted)',
              boxShadow: chartType === 'bar' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s'
            }}
          >Bar</button>
        </div>
      </div>

      <div className="card-body">
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.income} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={colors.income} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.expenses} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={colors.expenses} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.savings} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={colors.savings} stopOpacity={0} />
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
                <Area type="monotone" dataKey="income" stroke={colors.income} strokeWidth={2} fill="url(#gradIncome)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                <Area type="monotone" dataKey="expenses" stroke={colors.expenses} strokeWidth={2} fill="url(#gradExpenses)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                <Area type="monotone" dataKey="savings" stroke={colors.savings} strokeWidth={2} fill="url(#gradSavings)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
              </AreaChart>
            ) : (
              <BarChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
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
                <Bar dataKey="income" fill={colors.income} radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill={colors.expenses} radius={[4, 4, 0, 0]} />
                <Bar dataKey="savings" fill={colors.savings} radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}