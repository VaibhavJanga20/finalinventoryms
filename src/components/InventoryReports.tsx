
import React from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell,
  AreaChart, Area
} from "recharts";

// Sample inventory data
const inventoryStockData = [
  { category: "Electronics", inStock: 128, lowStock: 35, outOfStock: 12 },
  { category: "Furniture", inStock: 75, lowStock: 18, outOfStock: 8 },
  { category: "Clothing", inStock: 230, lowStock: 25, outOfStock: 5 },
  { category: "Books", inStock: 95, lowStock: 12, outOfStock: 3 },
  { category: "Kitchen", inStock: 65, lowStock: 15, outOfStock: 7 },
];

const inventoryValueData = [
  { category: "Electronics", value: 245000 },
  { category: "Furniture", value: 185000 },
  { category: "Clothing", value: 125000 },
  { category: "Books", value: 48000 },
  { category: "Kitchen", value: 72000 },
];

const lowStockItems = [
  { product: "Wireless Headphones", category: "Electronics", current: 5, min: 10 },
  { product: "Office Chair", category: "Furniture", current: 3, min: 8 },
  { product: "Cotton T-shirt", category: "Clothing", current: 7, min: 15 },
  { product: "Stainless Steel Water Bottle", category: "Kitchen", current: 4, min: 12 },
  { product: "Smartphone", category: "Electronics", current: 8, min: 15 },
  { product: "Coffee Table", category: "Furniture", current: 5, min: 10 },
  { product: "Desk Lamp", category: "Electronics", current: 6, min: 12 },
  { product: "Winter Jacket", category: "Clothing", current: 9, min: 20 },
];

const warehouseDistribution = [
  { name: "East Distribution Center", value: 35 },
  { name: "West Distribution Center", value: 25 },
  { name: "Central Warehouse", value: 20 },
  { name: "South Distribution Center", value: 12 },
  { name: "Northwest Facility", value: 8 },
];

const COLORS = ["#8B5CF6", "#D946EF", "#F97316", "#0EA5E9", "#10B981", "#F59E0B"];

type InventoryReportProps = {
  reportType: string;
};

export function InventoryReport({ reportType }: InventoryReportProps) {
  const renderReportContent = () => {
    switch (reportType) {
      case "stock-levels":
        return <StockLevelsReport />;
      case "category-distribution":
        return <CategoryDistributionReport />;
      case "low-stock-items":
        return <LowStockItemsReport />;
      case "inventory-value":
        return <InventoryValueReport />;
      case "inventory-turnover":
        return <InventoryTurnoverReport />;
      default:
        return <div>Select a report type from the menu</div>;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">
        {reportType === "stock-levels" ? "Inventory Stock Levels" : 
         reportType === "category-distribution" ? "Inventory Category Distribution" : 
         reportType === "low-stock-items" ? "Low Stock Items" :
         reportType === "inventory-value" ? "Inventory Value Analysis" : 
         "Inventory Turnover Analysis"}
      </h2>
      {renderReportContent()}
    </div>
  );
}

function StockLevelsReport() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">In Stock Items</p>
          <p className="text-2xl font-semibold">593</p>
          <p className="text-sm text-green-600">75% of inventory</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Low Stock Items</p>
          <p className="text-2xl font-semibold">105</p>
          <p className="text-sm text-yellow-600">18% of inventory</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Out of Stock Items</p>
          <p className="text-2xl font-semibold">35</p>
          <p className="text-sm text-red-600">7% of inventory</p>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Stock Levels by Category</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={inventoryStockData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="inStock" name="In Stock" stackId="a" fill="#10B981" />
              <Bar dataKey="lowStock" name="Low Stock" stackId="a" fill="#F59E0B" />
              <Bar dataKey="outOfStock" name="Out of Stock" stackId="a" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Stock Status Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: "In Stock", value: 593 },
                  { name: "Low Stock", value: 105 },
                  { name: "Out of Stock", value: 35 },
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
                <Cell fill="#10B981" />
                <Cell fill="#F59E0B" />
                <Cell fill="#EF4444" />
              </Pie>
              <Tooltip formatter={(value) => `${value} items`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function CategoryDistributionReport() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-gray-600 mb-6">Distribution of inventory items across product categories</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-4">Items by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inventoryStockData.map(item => ({
                category: item.category,
                total: item.inStock + item.lowStock + item.outOfStock
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" name="Total Items" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-4">Category Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={inventoryStockData.map(item => ({
                    name: item.category,
                    value: item.inStock + item.lowStock + item.outOfStock
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {inventoryStockData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} items`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Warehouse Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={warehouseDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name.split(' ')[0]}: ${(percent * 100).toFixed(0)}%`}
              >
                {warehouseDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function LowStockItemsReport() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-gray-600 mb-6">Items that need to be restocked soon</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Low Stock Items</p>
          <p className="text-2xl font-semibold">{lowStockItems.length}</p>
          <p className="text-sm text-yellow-600">Requiring attention</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Avg. Current Stock</p>
          <p className="text-2xl font-semibold">
            {(lowStockItems.reduce((sum, item) => sum + item.current, 0) / lowStockItems.length).toFixed(1)}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Most Critical</p>
          <p className="text-2xl font-semibold">Office Chair</p>
          <p className="text-sm text-red-600">63% below minimum</p>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Low Stock Items</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2 text-right">Current Stock</th>
                <th className="px-4 py-2 text-right">Min. Required</th>
                <th className="px-4 py-2 text-right">Deficit %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {lowStockItems.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3 text-sm">{item.product}</td>
                  <td className="px-4 py-3 text-sm">{item.category}</td>
                  <td className="px-4 py-3 text-sm text-right">{item.current}</td>
                  <td className="px-4 py-3 text-sm text-right">{item.min}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
                      ((item.min - item.current) / item.min) * 100 > 50 
                        ? "bg-red-100 text-red-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {(((item.min - item.current) / item.min) * 100).toFixed(0)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Low Stock by Category</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={
              [...new Set(lowStockItems.map(item => item.category))].map(category => {
                const items = lowStockItems.filter(item => item.category === category);
                return {
                  name: category,
                  count: items.length,
                  avgDeficit: items.reduce((sum, item) => sum + ((item.min - item.current) / item.min) * 100, 0) / items.length
                };
              })
            }>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="count" name="Number of Items" fill="#8884d8" />
              <Bar yAxisId="right" dataKey="avgDeficit" name="Avg. Deficit (%)" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function InventoryValueReport() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-gray-600 mb-6">Analysis of inventory value across categories and locations</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Total Inventory Value</p>
          <p className="text-2xl font-semibold">
            ${inventoryValueData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Highest Value Category</p>
          <p className="text-2xl font-semibold">Electronics</p>
          <p className="text-sm text-blue-600">$245,000</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Average Value per Category</p>
          <p className="text-2xl font-semibold">
            ${(inventoryValueData.reduce((sum, item) => sum + item.value, 0) / inventoryValueData.length).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-4">Inventory Value by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inventoryValueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Bar dataKey="value" name="Value ($)" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-4">Value Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={inventoryValueData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="category"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {inventoryValueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Inventory Value Details</h3>
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2 text-right">Value ($)</th>
              <th className="px-4 py-2 text-right">% of Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {inventoryValueData.map((item, index) => {
              const totalValue = inventoryValueData.reduce((sum, item) => sum + item.value, 0);
              const percentage = (item.value / totalValue) * 100;
              
              return (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3 text-sm">{item.category}</td>
                  <td className="px-4 py-3 text-sm text-right">${item.value.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-right">{percentage.toFixed(1)}%</td>
                </tr>
              );
            })}
            <tr className="bg-purple-50 font-semibold">
              <td className="px-4 py-3 text-sm">Total</td>
              <td className="px-4 py-3 text-sm text-right">
                ${inventoryValueData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
              </td>
              <td className="px-4 py-3 text-sm text-right">100%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InventoryTurnoverReport() {
  const turnoverData = [
    { month: "Jan", turnover: 2.3 },
    { month: "Feb", turnover: 2.5 },
    { month: "Mar", turnover: 2.8 },
    { month: "Apr", turnover: 3.1 },
    { month: "May", turnover: 3.4 },
    { month: "Jun", turnover: 3.7 },
  ];

  const categoryTurnover = [
    { category: "Electronics", turnover: 4.2 },
    { category: "Furniture", turnover: 1.8 },
    { category: "Clothing", turnover: 5.3 },
    { category: "Books", turnover: 3.1 },
    { category: "Kitchen", turnover: 3.7 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-gray-600 mb-6">Analysis of inventory turnover rate across time and categories</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Current Turnover Rate</p>
          <p className="text-2xl font-semibold">3.7</p>
          <p className="text-sm text-green-600">+8.8% from last month</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Best Performing Category</p>
          <p className="text-2xl font-semibold">Clothing</p>
          <p className="text-sm text-blue-600">5.3 turnover rate</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">6-Month Average</p>
          <p className="text-2xl font-semibold">
            {(turnoverData.reduce((sum, item) => sum + item.turnover, 0) / turnoverData.length).toFixed(1)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-4">Turnover Rate Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={turnoverData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 'dataMax + 1']} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="turnover" 
                  name="Turnover Rate" 
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-4">Turnover by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryTurnover}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis domain={[0, 'dataMax + 1']} />
                <Tooltip />
                <Bar dataKey="turnover" name="Turnover Rate" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Category Turnover Performance</h3>
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2 text-right">Turnover Rate</th>
              <th className="px-4 py-2">Performance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categoryTurnover.map((item, index) => {
              let performance;
              if (item.turnover > 4.0) {
                performance = { text: "Excellent", color: "bg-green-100 text-green-800" };
              } else if (item.turnover > 3.0) {
                performance = { text: "Good", color: "bg-blue-100 text-blue-800" };
              } else if (item.turnover > 2.0) {
                performance = { text: "Average", color: "bg-yellow-100 text-yellow-800" };
              } else {
                performance = { text: "Needs Improvement", color: "bg-red-100 text-red-800" };
              }
              
              return (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3 text-sm">{item.category}</td>
                  <td className="px-4 py-3 text-sm text-right">{item.turnover.toFixed(1)}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${performance.color}`}>
                      {performance.text}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
