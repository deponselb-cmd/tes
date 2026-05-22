import { useRecentTransactions } from '../hooks/useTransactions';
import type { Transaction } from '../types/api.types';

// Helper to get color classes based on category color
const getColorClasses = (color: string | null) => {
  switch (color) {
    case 'blue': return { bg: 'bg-blue-500/10', text: 'text-blue-500 dark:text-blue-400' };
    case 'orange': return { bg: 'bg-orange-500/10', text: 'text-orange-500 dark:text-orange-400' };
    case 'purple': return { bg: 'bg-purple-500/10', text: 'text-purple-500 dark:text-purple-400' };
    case 'red': case 'rose': return { bg: 'bg-red-500/10', text: 'text-red-500 dark:text-red-400' };
    case 'teal': case 'cyan': return { bg: 'bg-teal-500/10', text: 'text-teal-500 dark:text-teal-400' };
    case 'emerald': case 'green': return { bg: 'bg-emerald-500/10', text: 'text-emerald-500 dark:text-emerald-400' };
    case 'yellow': return { bg: 'bg-yellow-500/10', text: 'text-yellow-500 dark:text-yellow-400' };
    case 'pink': return { bg: 'bg-pink-500/10', text: 'text-pink-500 dark:text-pink-400' };
    case 'indigo': return { bg: 'bg-indigo-500/10', text: 'text-indigo-500 dark:text-indigo-400' };
    default: return { bg: 'bg-gray-500/10', text: 'text-gray-500' };
  }
};

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Format amount
const formatAmount = (amount: string, type: 'income' | 'expense') => {
  const num = parseFloat(amount);
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num);
  return type === 'income' ? `+${formatted}` : `-${formatted}`;
};

// Capitalize first letter
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export default function TransactionTable() {
  const { data: transactions, isLoading, error } = useRecentTransactions(5);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-[#2a3f33] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-[#2a3f33] flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
        </div>
        <div className="p-8 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-500 dark:text-gray-400">Loading transactions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-[#2a3f33] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-[#2a3f33] flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
        </div>
        <div className="p-8 text-center">
          <p className="text-red-500">Failed to load transactions</p>
        </div>
      </div>
    );
  }

  const isEmpty = !transactions || transactions.length === 0;

  return (
    <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-[#2a3f33] shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 dark:border-[#2a3f33] flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
        <a href="/reports" className="text-sm text-primary font-medium hover:underline">View All</a>
      </div>
      
      {isEmpty ? (
        <div className="p-8 text-center">
          <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-gray-600 mb-2">receipt_long</span>
          <p className="text-slate-500 dark:text-gray-400">No transactions yet</p>
          <a href="/transaction" className="text-primary text-sm font-medium hover:underline mt-2 inline-block">
            Add your first transaction
          </a>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-[#15231b] text-xs uppercase text-slate-500 dark:text-gray-400 font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4 rounded-tl-lg">Date</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right rounded-tr-lg">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#2a3f33] text-sm text-slate-700 dark:text-gray-300">
              {transactions.map((tx: Transaction) => {
                const colors = getColorClasses(tx.category?.color || null);
                const icon = tx.category?.icon || (tx.type === 'income' ? 'payments' : 'shopping_cart');

                return (
                  <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-[#203328] transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500 dark:text-gray-400">
                      {formatDate(tx.transactionDate)}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white flex items-center gap-3">
                      <div className={`${colors.bg} p-2 rounded-full ${colors.text}`}>
                        <span className="material-symbols-outlined text-lg">{icon}</span>
                      </div>
                      {tx.description || 'No description'}
                    </td>
                    <td className="px-6 py-4">{tx.category?.name || 'Uncategorized'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                        ${tx.status === 'approved' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : ''}
                        ${tx.status === 'pending' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' : ''}
                        ${tx.status === 'rejected' ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' : ''}
                      `}>
                        <span className={`w-1.5 h-1.5 rounded-full 
                          ${tx.status === 'approved' ? 'bg-emerald-500' : ''}
                          ${tx.status === 'pending' ? 'bg-amber-500 animate-pulse' : ''}
                          ${tx.status === 'rejected' ? 'bg-red-500' : ''}
                        `}></span>
                        {capitalize(tx.status)}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-right font-bold 
                      ${tx.type === 'income' ? 'text-emerald-600 dark:text-primary' : ''}
                      ${tx.type === 'expense' && tx.status !== 'rejected' ? 'text-slate-900 dark:text-white' : ''}
                      ${tx.status === 'rejected' ? 'text-slate-400 line-through' : ''}
                    `}>
                      {formatAmount(tx.amount, tx.type)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
