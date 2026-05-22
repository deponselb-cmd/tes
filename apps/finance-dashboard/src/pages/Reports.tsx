import { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useTransactions } from '../hooks/useTransactions';
import { useSummary, useExportCsv } from '../hooks/useReports';
import { useCategories } from '../hooks/useCategories';
import type { Transaction, TransactionFilters } from '../types/api.types';

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Capitalize first letter
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const Reports = () => {
  const [filters, setFilters] = useState<TransactionFilters>({
    page: 1,
    limit: 10,
  });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const { data: transactionsData, isLoading: transactionsLoading } = useTransactions(filters);
  const { data: summary, isLoading: summaryLoading } = useSummary({
    startDate: filters.startDate,
    endDate: filters.endDate,
  });
  const { data: categories } = useCategories();
  const exportMutation = useExportCsv();

  const handleSearch = () => {
    setFilters({
      ...filters,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      categoryId: categoryFilter || undefined,
      page: 1,
    });
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setCategoryFilter('');
    setFilters({ page: 1, limit: 10 });
  };

  const handleExport = () => {
    exportMutation.mutate({
      startDate: filters.startDate,
      endDate: filters.endDate,
    });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const transactions = transactionsData?.data ?? [];
  const pagination = transactionsData?.pagination ?? { page: 1, limit: 10, total: 0, totalPages: 0 };

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          {/* Page Heading */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-gray-900 dark:text-white">Reports & Export</h1>
              <p className="text-gray-500 dark:text-[#9eb7a8] text-base font-normal">Filter, analyze, and export your transaction history.</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Export Button */}
              <button 
                onClick={handleExport}
                disabled={exportMutation.isPending}
                className="flex items-center justify-center gap-2 px-5 h-12 rounded-full border border-gray-200 dark:border-[#3d5245] bg-white dark:bg-[#1c2620] hover:bg-gray-50 dark:hover:bg-[#29382f] text-gray-900 dark:text-white font-bold text-sm transition-all shadow-sm disabled:opacity-50"
              >
                {exportMutation.isPending ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-xl">download</span>
                    <span>Export CSV</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-white dark:bg-[#1c2620] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-[#2a3830]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              {/* Date Start */}
              <label className="flex flex-col gap-2">
                <span className="text-gray-700 dark:text-white text-sm font-medium px-1">Start Date</span>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">calendar_today</span>
                  <input 
                    className="w-full h-12 pl-12 pr-4 bg-gray-50 dark:bg-[#111714] border border-gray-200 dark:border-[#3d5245] rounded-xl text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder-gray-400" 
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </label>
              {/* Date End */}
              <label className="flex flex-col gap-2">
                <span className="text-gray-700 dark:text-white text-sm font-medium px-1">End Date</span>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">event</span>
                  <input 
                    className="w-full h-12 pl-12 pr-4 bg-gray-50 dark:bg-[#111714] border border-gray-200 dark:border-[#3d5245] rounded-xl text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </label>
              {/* Category Filter */}
              <label className="flex flex-col gap-2">
                <span className="text-gray-700 dark:text-white text-sm font-medium px-1">Category</span>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">category</span>
                  <select 
                    className="w-full h-12 pl-12 pr-10 bg-gray-50 dark:bg-[#111714] border border-gray-200 dark:border-[#3d5245] rounded-xl text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none cursor-pointer transition-all"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xl">arrow_drop_down</span>
                </div>
              </label>
              {/* Actions */}
              <div className="flex gap-3">
                <button 
                  onClick={handleSearch}
                  className="flex-1 h-12 bg-primary hover:bg-green-400 text-[#111714] font-bold rounded-full transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                >
                  <span className="material-symbols-outlined">search</span>
                  Search
                </button>
                <button 
                  onClick={handleReset}
                  className="h-12 w-12 flex items-center justify-center rounded-full border border-gray-200 dark:border-[#3d5245] text-gray-500 dark:text-[#9eb7a8] hover:bg-gray-100 dark:hover:bg-[#29382f] transition-colors" 
                  title="Reset Filters"
                >
                  <span className="material-symbols-outlined">restart_alt</span>
                </button>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-[#1c2620] p-6 rounded-3xl border border-gray-100 dark:border-[#2a3830] flex flex-col gap-1">
              <div className="flex items-center gap-2 text-gray-500 dark:text-[#9eb7a8] mb-2">
                <span className="material-symbols-outlined text-xl">receipt</span>
                <span className="text-sm font-medium">Total Transactions</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {summaryLoading ? '...' : (summary?.transactionCount ?? 0)}
              </p>
            </div>
            <div className="bg-white dark:bg-[#1c2620] p-6 rounded-3xl border border-gray-100 dark:border-[#2a3830] flex flex-col gap-1 relative overflow-hidden group">
              <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-8xl text-primary">trending_up</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 dark:text-[#9eb7a8] mb-2 relative z-10">
                <span className="material-symbols-outlined text-xl text-primary">arrow_upward</span>
                <span className="text-sm font-medium">Total Income</span>
              </div>
              <p className="text-3xl font-bold text-primary relative z-10">
                {summaryLoading ? '...' : `+ ${formatCurrency(summary?.totalIncome ?? 0)}`}
              </p>
            </div>
            <div className="bg-white dark:bg-[#1c2620] p-6 rounded-3xl border border-gray-100 dark:border-[#2a3830] flex flex-col gap-1">
              <div className="flex items-center gap-2 text-gray-500 dark:text-[#9eb7a8] mb-2">
                <span className="material-symbols-outlined text-xl">arrow_downward</span>
                <span className="text-sm font-medium">Total Expense</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {summaryLoading ? '...' : `- ${formatCurrency(summary?.totalExpense ?? 0)}`}
              </p>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white dark:bg-[#1c2620] rounded-3xl border border-gray-100 dark:border-[#2a3830] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 dark:border-[#2a3830] flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Detailed History</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-[#9eb7a8]">
                <span>
                  {transactionsLoading ? 'Loading...' : 
                    `Showing ${((pagination.page - 1) * pagination.limit) + 1}-${Math.min(pagination.page * pagination.limit, pagination.total)} of ${pagination.total}`
                  }
                </span>
              </div>
            </div>

            {transactionsLoading ? (
              <div className="p-8 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-gray-500">Loading transactions...</p>
                </div>
              </div>
            ) : transactions.length === 0 ? (
              <div className="p-8 text-center">
                <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600 mb-2">search_off</span>
                <p className="text-gray-500 dark:text-[#9eb7a8]">No transactions found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 dark:bg-[#111714]/50 text-gray-500 dark:text-[#9eb7a8] text-xs uppercase tracking-wider font-semibold">
                      <th className="px-6 py-4 rounded-tl-lg">Date</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4 w-1/3">Description</th>
                      <th className="px-6 py-4 text-right rounded-tr-lg">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-[#2a3830]">
                    {transactions.map((tx: Transaction) => (
                      <tr key={tx.id} className="group hover:bg-gray-50 dark:hover:bg-[#253028] transition-colors">
                        <td className="px-6 py-4 text-gray-900 dark:text-white text-sm font-medium">
                          {formatDate(tx.transactionDate)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            tx.type === 'income' 
                              ? 'bg-green-100 text-green-700 dark:bg-primary/20 dark:text-primary'
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {capitalize(tx.type)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300 text-sm">
                          {tx.category?.name || 'Uncategorized'}
                        </td>
                        <td className="px-6 py-4 text-gray-700 dark:text-white text-sm">
                          {tx.description || '-'}
                        </td>
                        <td className="px-6 py-4 text-right text-gray-900 dark:text-white font-bold text-sm tabular-nums">
                          {tx.type === 'income' ? '+' : '-'}{formatCurrency(parseFloat(tx.amount))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="p-4 border-t border-gray-100 dark:border-[#2a3830] flex items-center justify-between">
                <button 
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-gray-500 dark:text-[#9eb7a8] hover:bg-gray-100 dark:hover:bg-[#29382f] transition-colors disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-lg">arrow_back</span>
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button 
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-8 h-8 rounded-full font-medium text-sm flex items-center justify-center transition-colors ${
                          pageNum === pagination.page 
                            ? 'bg-primary text-[#111714] font-bold'
                            : 'hover:bg-gray-100 dark:hover:bg-[#29382f] text-gray-500 dark:text-[#9eb7a8]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  {pagination.totalPages > 5 && (
                    <>
                      <span className="text-gray-500 dark:text-[#9eb7a8] px-1">...</span>
                      <button 
                        onClick={() => handlePageChange(pagination.totalPages)}
                        className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-[#29382f] text-gray-500 dark:text-[#9eb7a8] font-medium text-sm flex items-center justify-center transition-colors"
                      >
                        {pagination.totalPages}
                      </button>
                    </>
                  )}
                </div>
                <button 
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#29382f] transition-colors disabled:opacity-50"
                >
                  Next
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
