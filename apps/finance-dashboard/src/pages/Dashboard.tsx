import DashboardLayout from '../layouts/DashboardLayout';
import Header from '../components/Header';
import KpiCard from '../components/KpiCard';
import ChartSection from '../components/ChartSection';
import QuickActions from '../components/QuickActions';
import TransactionTable from '../components/TransactionTable';
import { useSummary, useComparison } from '../hooks/useReports';

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Get current month date range
const getCurrentMonthRange = () => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
  return { startDate, endDate };
};

const Dashboard = () => {
  const { startDate, endDate } = getCurrentMonthRange();
  const { data: summary, isLoading: summaryLoading } = useSummary({ startDate, endDate });
  const { data: comparison, isLoading: comparisonLoading } = useComparison(startDate, endDate);

  const isLoading = summaryLoading || comparisonLoading;

  // Calculate trend values
  const incomeChange = comparison?.changes.incomeChange ?? 0;
  const expenseChange = comparison?.changes.expenseChange ?? 0;
  const balanceChange = comparison?.changes.balanceChange ?? 0;

  return (
    <DashboardLayout>
      <Header />
      <div className="flex-1 overflow-y-auto px-8 pb-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isLoading ? (
              <>
                <KpiCardSkeleton />
                <KpiCardSkeleton />
                <KpiCardSkeleton />
              </>
            ) : (
              <>
                <KpiCard 
                  title="Total Income" 
                  amount={formatCurrency(summary?.totalIncome ?? 0)} 
                  trend="vs last month" 
                  trendType={incomeChange >= 0 ? 'up' : 'down'} 
                  trendValue={`${Math.abs(incomeChange).toFixed(1)}%`} 
                  icon="payments" 
                  type="income" 
                />
                <KpiCard 
                  title="Total Expense" 
                  amount={formatCurrency(summary?.totalExpense ?? 0)} 
                  trend="vs last month" 
                  trendType={expenseChange <= 0 ? 'down' : 'up'} 
                  trendValue={`${Math.abs(expenseChange).toFixed(1)}%`} 
                  icon="shopping_cart" 
                  type="expense" 
                />
                <KpiCard 
                  title="Net Balance" 
                  amount={formatCurrency(summary?.netBalance ?? 0)} 
                  trend={(summary?.netBalance ?? 0) >= 0 ? 'Safe & Healthy' : 'Needs Attention'} 
                  trendType={balanceChange >= 0 ? 'up' : 'down'} 
                  trendValue={`${Math.abs(balanceChange).toFixed(1)}%`} 
                  icon="account_balance" 
                  type="balance" 
                />
              </>
            )}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[300px]">
            <ChartSection />
            <QuickActions />
          </div>

          {/* Recent Transactions Table */}
          <TransactionTable />
        </div>
      </div>
    </DashboardLayout>
  );
};

// Skeleton component for loading state
function KpiCardSkeleton() {
  return (
    <div className="p-6 rounded-xl border shadow-sm bg-white dark:bg-surface-dark border-slate-100 dark:border-[#2a3f33] animate-pulse">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-lg bg-slate-200 dark:bg-slate-700" />
        <div className="w-24 h-4 bg-slate-200 dark:bg-slate-700 rounded" />
      </div>
      <div className="w-32 h-8 bg-slate-200 dark:bg-slate-700 rounded mb-3" />
      <div className="flex items-center gap-2">
        <div className="w-12 h-5 bg-slate-200 dark:bg-slate-700 rounded-full" />
        <div className="w-20 h-4 bg-slate-200 dark:bg-slate-700 rounded" />
      </div>
    </div>
  );
}

export default Dashboard;
