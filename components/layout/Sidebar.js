import { useFinance } from '../../context/FinanceContext';
import { ROLES } from '../../data/mockData';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '◉' },
  { id: 'transactions', label: 'Transactions', icon: '↕' },
  { id: 'insights', label: 'Insights', icon: '◈' },
];

export default function Sidebar() {
  const { state, setActiveTab, setRole, toggleDarkMode, isAdmin } = useFinance();
  const { activeTab } = state.ui;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">
          <div className="logo-icon">₹</div>
          <div>
            <div className="logo-text">Finance Dashboard</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Navigation</div>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="role-switcher">
          <div className="role-label">Current Role</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '14px' }}>{ROLES[state.role]?.icon}</span>
            <select
              className="role-select"
              value={state.role}
              onChange={e => setRole(e.target.value)}
            >
              {Object.entries(ROLES).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>
          {!isAdmin && (
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Read-only mode
            </div>
          )}
        </div>

        <button className="dark-toggle" onClick={toggleDarkMode}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
            {state.darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </span>
          <div className={`toggle-track ${state.darkMode ? 'on' : ''}`}>
            <div className="toggle-thumb" />
          </div>
        </button>
      </div>
    </aside>
  );
}
