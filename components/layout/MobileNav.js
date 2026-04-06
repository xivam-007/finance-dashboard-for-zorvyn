import { useFinance } from '../../context/FinanceContext';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Home', icon: '◉' },
  { id: 'transactions', label: 'Transactions', icon: '↕' },
  { id: 'insights', label: 'Insights', icon: '◈' },
];

export default function MobileNav() {
  const { state, setActiveTab } = useFinance();
  const { activeTab } = state.ui;

  return (
    <nav className="mobile-nav">
      {NAV_ITEMS.map(item => (
        <button
          key={item.id}
          className={`mobile-nav-item ${activeTab === item.id ? 'active' : ''}`}
          onClick={() => setActiveTab(item.id)}
        >
          <span className="nav-icon">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  );
}
