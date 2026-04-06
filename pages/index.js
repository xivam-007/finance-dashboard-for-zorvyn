import Head from 'next/head';
import Sidebar from '../components/layout/Sidebar';
import MobileNav from '../components/layout/MobileNav';
import DashboardPage from '../components/dashboard/DashboardPage';
import TransactionsPage from '../components/transactions/TransactionsPage';
import InsightsPage from '../components/insights/InsightsPage';
import TransactionModal from '../components/transactions/TransactionModal';
import DeleteConfirmModal from '../components/transactions/DeleteConfirmModal';
import { useFinance } from '../context/FinanceContext';

function PageContent() {
  const { state } = useFinance();
  const { activeTab } = state.ui;

  switch (activeTab) {
    case 'dashboard': return <DashboardPage />;
    case 'transactions': return <TransactionsPage />;
    case 'insights': return <InsightsPage />;
    default: return <DashboardPage />;
  }
}

export default function Home() {
  return (
    <>
      <Head>
        <title>FinTrack — Finance Dashboard</title>
        <meta name="description" content="Personal finance tracking dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>₹</text></svg>" />
      </Head>

      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <div className="page-wrapper">
            <PageContent />
          </div>
        </main>
        <MobileNav />
      </div>

      {/* Global modals (for dashboard shortcut) */}
      <TransactionModal />
      <DeleteConfirmModal />
    </>
  );
}
