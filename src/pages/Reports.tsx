import React, { useState } from "react";
import { ReportNavigationMenu } from "@/components/ReportNavigationMenu";
import { Button } from "@/components/ui/button";
import { Printer, FileDown } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell,
  AreaChart, Area
} from "recharts";
import { InventoryReport } from "@/components/InventoryReports";
import { CustomerReport } from "@/components/CustomerReports";

type ReportCategory = "financial" | "inventory" | "customer";
type ReportType = string;

// Sample financial data - in a real app, this would come from your backend
const financialData = {
  incomeStatement: [
    { month: "Jan", revenue: 45000, expenses: 28000, profit: 17000 },
    { month: "Feb", revenue: 52000, expenses: 30000, profit: 22000 },
    { month: "Mar", revenue: 49000, expenses: 29500, profit: 19500 },
    { month: "Apr", revenue: 58000, expenses: 32000, profit: 26000 },
    { month: "May", revenue: 63000, expenses: 34000, profit: 29000 },
    { month: "Jun", revenue: 68000, expenses: 35500, profit: 32500 },
  ],
  salesByCategory: [
    { name: "Electronics", value: 35 },
    { name: "Furniture", value: 25 },
    { name: "Clothing", value: 20 },
    { name: "Books", value: 10 },
    { name: "Other", value: 10 },
  ],
  expenseBreakdown: [
    { name: "Salaries", value: 45 },
    { name: "Inventory", value: 30 },
    { name: "Rent", value: 15 },
    { name: "Utilities", value: 5 },
    { name: "Marketing", value: 5 },
  ],
  cashFlow: [
    { month: "Jan", operating: 15000, investing: -5000, financing: -2000 },
    { month: "Feb", operating: 18000, investing: -3000, financing: -2000 },
    { month: "Mar", operating: 16500, investing: -4000, financing: -2000 },
    { month: "Apr", operating: 21000, investing: -6000, financing: -2000 },
    { month: "May", operating: 24000, investing: -3000, financing: -2000 },
    { month: "Jun", operating: 27000, investing: -8000, financing: -2000 },
  ],
};

const COLORS = ["#8B5CF6", "#D946EF", "#F97316", "#0EA5E9", "#10B981", "#F59E0B"];

export default function Reports() {
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory>("financial");
  const [selectedReport, setSelectedReport] = useState<ReportType>("overview");

  const handleReportSelect = (category: string, reportType: string) => {
    setSelectedCategory(category as ReportCategory);
    setSelectedReport(reportType as ReportType);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real application, this would generate and download a PDF or Excel file
    alert("Report download functionality would be implemented here");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Reports</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
            <Printer size={16} />
            <span>Print Report</span>
          </Button>
          <Button variant="outline" onClick={handleDownload} className="flex items-center gap-2">
            <FileDown size={16} />
            <span>Download</span>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 print:shadow-none">
        <ReportNavigationMenu onReportSelect={handleReportSelect} />

        <div className="mt-8">
          {renderReport(selectedCategory, selectedReport)}
        </div>
      </div>
    </div>
  );
}

function renderReport(category: ReportCategory, reportType: ReportType) {
  switch (category) {
    case "financial":
      return renderFinancialReport(reportType);
    case "inventory":
      return <InventoryReport reportType={reportType} />;
    case "customer":
      return <CustomerReport reportType={reportType} />;
    default:
      return <div>Select a report from the menu above</div>;
  }
}

function renderFinancialReport(reportType: ReportType) {
  switch (reportType) {
    case "overview":
      return <FinancialOverviewReport />;
    case "income-statement":
      return <IncomeStatementReport />;
    case "balance-sheet":
      return <BalanceSheetReport />;
    case "cash-flow":
      return <CashFlowReport />;
    case "sales-analysis":
      return <SalesAnalysisReport />;
    default:
      return <div>Select a financial report from the menu</div>;
  }
}

// Financial Overview Report Component
function FinancialOverviewReport() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Financial Overview</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Revenue (YTD)</p>
            <p className="text-2xl font-semibold">$335,000</p>
            <p className="text-sm text-green-600">+12% from last year</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Expenses (YTD)</p>
            <p className="text-2xl font-semibold">$189,000</p>
            <p className="text-sm text-green-600">-5% from last year</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Net Profit (YTD)</p>
            <p className="text-2xl font-semibold">$146,000</p>
            <p className="text-sm text-green-600">+18% from last year</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-4">Revenue vs. Expenses (6 Months)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialData.incomeStatement}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value}`} />
                <Legend />
                <Bar dataKey="revenue" name="Revenue" fill="#8B5CF6" />
                <Bar dataKey="expenses" name="Expenses" fill="#D946EF" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-4">Profit Margin (6 Months)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={financialData.incomeStatement}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value}`} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  name="Profit" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-4">Sales by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={financialData.salesByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {financialData.salesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-4">Expense Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={financialData.expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {financialData.expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// Income Statement Report Component
function IncomeStatementReport() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Income Statement</h2>
        <p className="text-gray-600 mb-6">For the period: January 1, 2025 - June 30, 2025</p>
      </div>

      <div>
        <h3 className="font-medium mb-4">Revenue vs. Expenses (Monthly)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={financialData.incomeStatement}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value}`} />
              <Legend />
              <Bar dataKey="revenue" name="Revenue" fill="#8B5CF6" />
              <Bar dataKey="expenses" name="Expenses" fill="#D946EF" />
              <Bar dataKey="profit" name="Profit" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Income Statement Details</h3>
        <table className="min-w-full border border-gray-200 rounded-md">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left">Month</th>
              <th className="px-4 py-2 text-right">Revenue</th>
              <th className="px-4 py-2 text-right">Expenses</th>
              <th className="px-4 py-2 text-right">Profit</th>
              <th className="px-4 py-2 text-right">Profit Margin</th>
            </tr>
          </thead>
          <tbody>
            {financialData.incomeStatement.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-2">{item.month}</td>
                <td className="px-4 py-2 text-right">${item.revenue.toLocaleString()}</td>
                <td className="px-4 py-2 text-right">${item.expenses.toLocaleString()}</td>
                <td className="px-4 py-2 text-right">${item.profit.toLocaleString()}</td>
                <td className="px-4 py-2 text-right">
                  {((item.profit / item.revenue) * 100).toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-semibold">
              <td className="px-4 py-2">Total</td>
              <td className="px-4 py-2 text-right">
                ${financialData.incomeStatement.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
              </td>
              <td className="px-4 py-2 text-right">
                ${financialData.incomeStatement.reduce((sum, item) => sum + item.expenses, 0).toLocaleString()}
              </td>
              <td className="px-4 py-2 text-right">
                ${financialData.incomeStatement.reduce((sum, item) => sum + item.profit, 0).toLocaleString()}
              </td>
              <td className="px-4 py-2 text-right">
                {(financialData.incomeStatement.reduce((sum, item) => sum + item.profit, 0) / 
                  financialData.incomeStatement.reduce((sum, item) => sum + item.revenue, 0) * 100).toFixed(2)}%
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

// Balance Sheet Report Component
function BalanceSheetReport() {
  const assets = [
    { category: "Current Assets", items: [
      { name: "Cash", value: 125000 },
      { name: "Accounts Receivable", value: 87500 },
      { name: "Inventory", value: 210000 },
    ]},
    { category: "Fixed Assets", items: [
      { name: "Property & Equipment", value: 350000 },
      { name: "Furniture & Fixtures", value: 45000 },
      { name: "Vehicles", value: 78000 },
    ]},
  ];

  const liabilities = [
    { category: "Current Liabilities", items: [
      { name: "Accounts Payable", value: 65000 },
      { name: "Short-term Debt", value: 45000 },
      { name: "Accrued Expenses", value: 28000 },
    ]},
    { category: "Long-term Liabilities", items: [
      { name: "Long-term Debt", value: 180000 },
      { name: "Deferred Tax Liabilities", value: 35000 },
    ]},
  ];

  const equity = [
    { name: "Common Stock", value: 250000 },
    { name: "Retained Earnings", value: 292500 },
  ];

  const totalAssets = assets.reduce((total, category) => 
    total + category.items.reduce((sum, item) => sum + item.value, 0), 0);
  
  const totalLiabilities = liabilities.reduce((total, category) => 
    total + category.items.reduce((sum, item) => sum + item.value, 0), 0);
  
  const totalEquity = equity.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Balance Sheet</h2>
        <p className="text-gray-600 mb-6">As of June 30, 2025</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Total Assets</p>
          <p className="text-2xl font-semibold">${totalAssets.toLocaleString()}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Total Liabilities</p>
          <p className="text-2xl font-semibold">${totalLiabilities.toLocaleString()}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Total Equity</p>
          <p className="text-2xl font-semibold">${totalEquity.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-4">Balance Sheet Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Total Liabilities", value: totalLiabilities },
                    { name: "Total Equity", value: totalEquity },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell fill="#D946EF" />
                  <Cell fill="#10B981" />
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-4">Asset Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={assets.flatMap(category => 
                  category.items.map(item => ({ 
                    name: item.name, 
                    value: item.value,
                    category: category.category
                  }))
                )}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Bar dataKey="value" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Balance Sheet Details</h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-2">Assets</h4>
            <table className="min-w-full border border-gray-200 rounded-md">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-left">Item</th>
                  <th className="px-4 py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {assets.flatMap((category, categoryIndex) => 
                  category.items.map((item, itemIndex) => (
                    <tr 
                      key={`asset-${categoryIndex}-${itemIndex}`} 
                      className={(categoryIndex + itemIndex) % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      {itemIndex === 0 ? (
                        <td className="px-4 py-2 font-medium" rowSpan={category.items.length}>
                          {category.category}
                        </td>
                      ) : null}
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2 text-right">${item.value.toLocaleString()}</td>
                    </tr>
                  ))
                )}
                <tr className="bg-purple-50 font-semibold">
                  <td className="px-4 py-2" colSpan={2}>Total Assets</td>
                  <td className="px-4 py-2 text-right">${totalAssets.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Liabilities</h4>
            <table className="min-w-full border border-gray-200 rounded-md">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-left">Item</th>
                  <th className="px-4 py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {liabilities.flatMap((category, categoryIndex) => 
                  category.items.map((item, itemIndex) => (
                    <tr 
                      key={`liability-${categoryIndex}-${itemIndex}`} 
                      className={(categoryIndex + itemIndex) % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      {itemIndex === 0 ? (
                        <td className="px-4 py-2 font-medium" rowSpan={category.items.length}>
                          {category.category}
                        </td>
                      ) : null}
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2 text-right">${item.value.toLocaleString()}</td>
                    </tr>
                  ))
                )}
                <tr className="bg-blue-50 font-semibold">
                  <td className="px-4 py-2" colSpan={2}>Total Liabilities</td>
                  <td className="px-4 py-2 text-right">${totalLiabilities.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Equity</h4>
            <table className="min-w-full border border-gray-200 rounded-md">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Item</th>
                  <th className="px-4 py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {equity.map((item, index) => (
                  <tr key={`equity-${index}`} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-2">{item.name}</td>
                    <td className="px-4 py-2 text-right">${item.value.toLocaleString()}</td>
                  </tr>
                ))}
                <tr className="bg-green-50 font-semibold">
                  <td className="px-4 py-2">Total Equity</td>
                  <td className="px-4 py-2 text-right">${totalEquity.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Cash Flow Report Component
function CashFlowReport() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Cash Flow Statement</h2>
        <p className="text-gray-600 mb-6">For the period: January 1, 2025 - June 30, 2025</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Operating Cash Flow</p>
          <p className="text-2xl font-semibold">
            ${financialData.cashFlow.reduce((sum, item) => sum + item.operating, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Investing Cash Flow</p>
          <p className="text-2xl font-semibold">
            ${financialData.cashFlow.reduce((sum, item) => sum + item.investing, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Financing Cash Flow</p>
          <p className="text-2xl font-semibold">
            ${financialData.cashFlow.reduce((sum, item) => sum + item.financing, 0).toLocaleString()}
          </p>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Cash Flow Breakdown</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={financialData.cashFlow}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value}`} />
              <Legend />
              <Area type="monotone" dataKey="operating" name="Operating" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" />
              <Area type="monotone" dataKey="investing" name="Investing" stackId="2" stroke="#D946EF" fill="#D946EF" />
              <Area type="monotone" dataKey="financing" name="Financing" stackId="3" stroke="#10B981" fill="#10B981" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Cash Flow Details</h3>
        <table className="min-w-full border border-gray-200 rounded-md">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left">Month</th>
              <th className="px-4 py-2 text-right">Operating Activities</th>
              <th className="px-4 py-2 text-right">Investing Activities</th>
              <th className="px-4 py-2 text-right">Financing Activities</th>
              <th className="px-4 py-2 text-right">Net Cash Flow</th>
            </tr>
          </thead>
          <tbody>
            {financialData.cashFlow.map((item, index) => {
              const netCashFlow = item.operating + item.investing + item.financing;
              return (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-2">{item.month}</td>
                  <td className="px-4 py-2 text-right">${item.operating.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right">${item.investing.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right">${item.financing.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right">${netCashFlow.toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-semibold">
              <td className="px-4 py-2">Total</td>
              <td className="px-4 py-2 text-right">
                ${financialData.cashFlow.reduce((sum, item) => sum + item.operating, 0).toLocaleString()}
              </td>
              <td className="px-4 py-2 text-right">
                ${financialData.cashFlow.reduce((sum, item) => sum + item.investing, 0).toLocaleString()}
              </td>
              <td className="px-4 py-2 text-right">
                ${financialData.cashFlow.reduce((sum, item) => sum + item.financing, 0).toLocaleString()}
              </td>
              <td className="px-4 py-2 text-right">
                ${financialData.cashFlow.reduce((sum, item) => 
                  sum + (item.operating + item.investing + item.financing), 0).toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

// Sales Analysis Report Component
function SalesAnalysisReport() {
  const salesData = [
    { month: "Jan", electronics: 19500, furniture: 12500, clothing: 8000, books: 3000, other: 2000 },
    { month: "Feb", electronics: 22000, furniture: 15000, clothing: 9000, books: 3500, other: 2500 },
    { month: "Mar", electronics: 21000, furniture: 14000, clothing: 8500, books: 3500, other: 2000 },
    { month: "Apr", electronics: 25000, furniture: 17000, clothing: 9500, books: 4000, other: 2500 },
    { month: "May", electronics: 28000, furniture: 18000, clothing: 10000, books: 4500, other: 2500 },
    { month: "Jun", electronics: 30000, furniture: 19500, clothing: 11000, books: 4800, other: 2700 },
  ];

  const salesByRegion = [
    { name: "North", value: 35 },
    { name: "South", value: 30 },
    { name: "East", value: 20 },
    { name: "West", value: 15 },
  ];

  const topProducts = [
    { name: "Laptop Pro 2025", category: "Electronics", revenue: 45000, units: 150 },
    { name: "Wireless Earbuds X3", category: "Electronics", revenue: 30000, units: 600 },
    { name: "Ergonomic Office Chair", category: "Furniture", revenue: 27000, units: 180 },
    { name: "Smart Home Hub", category: "Electronics", revenue: 24000, units: 200 },
    { name: "Dining Table Set", category: "Furniture", revenue: 21000, units: 70 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Sales Analysis</h2>
        <p className="text-gray-600 mb-6">For the period: January 1, 2025 - June 30, 2025</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Total Sales</p>
          <p className="text-2xl font-semibold">$335,000</p>
          <p className="text-sm text-green-600">+15% from previous period</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Average Monthly Sales</p>
          <p className="text-2xl font-semibold">$55,833</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Best Selling Category</p>
          <p className="text-2xl font-semibold">Electronics</p>
          <p className="text-sm text-green-600">$145,500 (43% of sales)</p>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Sales by Category (Monthly)</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value}`} />
              <Legend />
              <Bar dataKey="electronics" name="Electronics" fill="#8B5CF6" />
              <Bar dataKey="furniture" name="Furniture" fill="#D946EF" />
              <Bar dataKey="clothing" name="Clothing" fill="#F97316" />
              <Bar dataKey="books" name="Books" fill="#0EA5E9" />
              <Bar dataKey="other" name="Other" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-4">Top Products by Revenue</h3>
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2 text-right">Revenue</th>
                <th className="px-4 py-2 text-right">Units Sold</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topProducts.map((product, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3 text-sm">{product.name}</td>
                  <td className="px-4 py-3 text-sm">{product.category}</td>
                  <td className="px-4 py-3 text-sm text-right">${product.revenue.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-right">{product.units.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h3 className="font-medium mb-4">Sales by Region</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salesByRegion}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {salesByRegion.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
