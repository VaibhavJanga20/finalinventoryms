
import React from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell,
  AreaChart, Area
} from "recharts";

// Sample customer data
const customerAcquisitionData = [
  { month: "Jan", new: 45, returning: 120 },
  { month: "Feb", new: 52, returning: 135 },
  { month: "Mar", new: 48, returning: 142 },
  { month: "Apr", new: 58, returning: 158 },
  { month: "May", new: 63, returning: 172 },
  { month: "Jun", new: 72, returning: 189 },
];

const customerRetentionData = [
  { month: "Jan", rate: 78 },
  { month: "Feb", rate: 80 },
  { month: "Mar", rate: 82 },
  { month: "Apr", rate: 84 },
  { month: "May", rate: 85 },
  { month: "Jun", rate: 87 },
];

const customerLifetimeData = [
  { segment: "Premium", value: 1250 },
  { segment: "Standard", value: 580 },
  { segment: "Basic", value: 320 },
];

const geographicDistributionData = [
  { state: "California", customers: 450 },
  { state: "Texas", customers: 380 },
  { state: "New York", customers: 320 },
  { state: "Florida", customers: 280 },
  { state: "Illinois", customers: 210 },
  { state: "Washington", customers: 190 },
  { state: "Ohio", customers: 170 },
  { state: "Georgia", customers: 160 },
  { state: "North Carolina", customers: 150 },
  { state: "Michigan", customers: 140 },
];

const orderHistoryData = [
  { month: "Jan", orders: 320, value: 28500 },
  { month: "Feb", orders: 345, value: 31200 },
  { month: "Mar", orders: 335, value: 29800 },
  { month: "Apr", orders: 378, value: 34500 },
  { month: "May", orders: 410, value: 38700 },
  { month: "Jun", orders: 435, value: 42300 },
];

const topCustomers = [
  { name: "John Smith", orders: 15, total: 4250, lastOrder: "2025-04-29" },
  { name: "Emily Johnson", orders: 12, total: 3850, lastOrder: "2025-05-02" },
  { name: "Michael Brown", orders: 10, total: 3600, lastOrder: "2025-04-18" },
  { name: "Sarah Williams", orders: 9, total: 3200, lastOrder: "2025-05-01" },
  { name: "David Miller", orders: 8, total: 2900, lastOrder: "2025-04-22" },
];

const COLORS = ["#8B5CF6", "#D946EF", "#F97316", "#0EA5E9", "#10B981", "#F59E0B"];

type CustomerReportProps = {
  reportType: string;
};

export function CustomerReport({ reportType }: CustomerReportProps) {
  const renderReportContent = () => {
    switch (reportType) {
      case "customer-acquisition":
        return <CustomerAcquisitionReport />;
      case "retention-rate":
        return <RetentionRateReport />;
      case "lifetime-value":
        return <LifetimeValueReport />;
      case "geographic-distribution":
        return <GeographicDistributionReport />;
      case "order-history":
        return <OrderHistoryReport />;
      default:
        return <div>Select a report type from the menu</div>;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">
        {reportType === "customer-acquisition" ? "Customer Acquisition" : 
         reportType === "retention-rate" ? "Customer Retention Rate" : 
         reportType === "lifetime-value" ? "Customer Lifetime Value" :
         reportType === "geographic-distribution" ? "Customer Geographic Distribution" : 
         "Customer Order History"}
      </h2>
      {renderReportContent()}
    </div>
  );
}

function CustomerAcquisitionReport() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-gray-600 mb-6">Analysis of customer acquisition over time</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Total Customers</p>
          <p className="text-2xl font-semibold">1,034</p>
          <p className="text-sm text-green-600">+7.5% from last month</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">New Customers (This Month)</p>
          <p className="text-2xl font-semibold">72</p>
          <p className="text-sm text-green-600">+14.3% from last month</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Customer Acquisition Cost</p>
          <p className="text-2xl font-semibold">$42.15</p>
          <p className="text-sm text-green-600">-5.3% from last month</p>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Customer Acquisition Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={customerAcquisitionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="new" name="New Customers" fill="#8B5CF6" />
              <Bar dataKey="returning" name="Returning Customers" fill="#D946EF" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Cumulative Customer Growth</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={customerAcquisitionData.map((item, index, arr) => {
                const cumulativeNew = arr.slice(0, index + 1).reduce((sum, i) => sum + i.new, 0);
                return {
                  month: item.month,
                  cumulative: index === 0 ? 845 + cumulativeNew : 845 + cumulativeNew
                };
              })}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="cumulative" name="Total Customers" stroke="#8B5CF6" fill="#8B5CF6" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-4">Acquisition Sources</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Organic Search", value: 35 },
                    { name: "Direct", value: 25 },
                    { name: "Referral", value: 20 },
                    { name: "Social Media", value: 15 },
                    { name: "Email", value: 5 },
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
                  {[0, 1, 2, 3, 4].map((entry) => (
                    <Cell key={`cell-${entry}`} fill={COLORS[entry % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-4">Top Customer Segments</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Premium", value: 15 },
                    { name: "Standard", value: 45 },
                    { name: "Basic", value: 40 },
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
                  <Cell fill="#8B5CF6" />
                  <Cell fill="#10B981" />
                  <Cell fill="#F59E0B" />
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

function RetentionRateReport() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-gray-600 mb-6">Analysis of customer retention over time</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Current Retention Rate</p>
          <p className="text-2xl font-semibold">87%</p>
          <p className="text-sm text-green-600">+2.4% from last month</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Average Retention (6 Months)</p>
          <p className="text-2xl font-semibold">82.7%</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Customer Churn Rate</p>
          <p className="text-2xl font-semibold">13%</p>
          <p className="text-sm text-green-600">-2.4% from last month</p>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Retention Rate Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={customerRetentionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[70, 90]} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Line 
                type="monotone" 
                dataKey="rate" 
                name="Retention Rate" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-4">Retention by Segment</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { segment: "Premium", rate: 94 },
                { segment: "Standard", rate: 86 },
                { segment: "Basic", rate: 79 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="segment" />
                <YAxis domain={[70, 100]} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="rate" name="Retention Rate" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-4">Churn Reasons</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Price", value: 35 },
                    { name: "Competitor", value: 25 },
                    { name: "Poor Service", value: 20 },
                    { name: "Not Needed", value: 15 },
                    { name: "Other", value: 5 },
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
                  {[0, 1, 2, 3, 4].map((entry) => (
                    <Cell key={`cell-${entry}`} fill={COLORS[entry % COLORS.length]} />
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

function LifetimeValueReport() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-gray-600 mb-6">Analysis of customer lifetime value (CLV) across segments</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Average CLV</p>
          <p className="text-2xl font-semibold">$735</p>
          <p className="text-sm text-green-600">+5.8% from last year</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Premium Segment CLV</p>
          <p className="text-2xl font-semibold">$1,250</p>
          <p className="text-sm text-green-600">+8.7% from last year</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">CLV to CAC Ratio</p>
          <p className="text-2xl font-semibold">4.3</p>
          <p className="text-sm text-green-600">Healthy business model</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-4">CLV by Customer Segment</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={customerLifetimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="segment" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value}`} />
                <Bar dataKey="value" name="Lifetime Value" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-4">CLV by Customer Age</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                { age: "18-24", value: 420 },
                { age: "25-34", value: 680 },
                { age: "35-44", value: 920 },
                { age: "45-54", value: 850 },
                { age: "55-64", value: 750 },
                { age: "65+", value: 580 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value}`} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  name="Lifetime Value" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">CLV Components</h3>
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="px-4 py-2">Segment</th>
              <th className="px-4 py-2 text-right">Avg. Order Value</th>
              <th className="px-4 py-2 text-right">Purchase Frequency</th>
              <th className="px-4 py-2 text-right">Customer Lifespan</th>
              <th className="px-4 py-2 text-right">CLV</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr className="bg-white">
              <td className="px-4 py-3 text-sm">Premium</td>
              <td className="px-4 py-3 text-sm text-right">$250</td>
              <td className="px-4 py-3 text-sm text-right">5 per year</td>
              <td className="px-4 py-3 text-sm text-right">4.2 years</td>
              <td className="px-4 py-3 text-sm text-right">$1,250</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="px-4 py-3 text-sm">Standard</td>
              <td className="px-4 py-3 text-sm text-right">$145</td>
              <td className="px-4 py-3 text-sm text-right">4 per year</td>
              <td className="px-4 py-3 text-sm text-right">3.5 years</td>
              <td className="px-4 py-3 text-sm text-right">$580</td>
            </tr>
            <tr className="bg-white">
              <td className="px-4 py-3 text-sm">Basic</td>
              <td className="px-4 py-3 text-sm text-right">$80</td>
              <td className="px-4 py-3 text-sm text-right">4 per year</td>
              <td className="px-4 py-3 text-sm text-right">2.9 years</td>
              <td className="px-4 py-3 text-sm text-right">$320</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GeographicDistributionReport() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-gray-600 mb-6">Analysis of customer distribution by geographic location</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-4">Customers by State (Top 10)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={geographicDistributionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="state" width={80} />
                <Tooltip />
                <Bar dataKey="customers" name="Customers" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-4">Regional Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "West", value: 35 },
                    { name: "South", value: 30 },
                    { name: "Northeast", value: 20 },
                    { name: "Midwest", value: 15 },
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
                  <Cell fill="#8B5CF6" />
                  <Cell fill="#D946EF" />
                  <Cell fill="#F97316" />
                  <Cell fill="#0EA5E9" />
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Customer Growth by Region</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[
              { month: "Jan", west: 350, south: 280, northeast: 210, midwest: 140 },
              { month: "Feb", west: 358, south: 285, northeast: 215, midwest: 145 },
              { month: "Mar", west: 362, south: 290, northeast: 218, midwest: 148 },
              { month: "Apr", west: 370, south: 298, northeast: 223, midwest: 153 },
              { month: "May", west: 382, south: 305, northeast: 230, midwest: 158 },
              { month: "Jun", west: 395, south: 315, northeast: 235, midwest: 165 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="west" name="West" stroke="#8B5CF6" />
              <Line type="monotone" dataKey="south" name="South" stroke="#D946EF" />
              <Line type="monotone" dataKey="northeast" name="Northeast" stroke="#F97316" />
              <Line type="monotone" dataKey="midwest" name="Midwest" stroke="#0EA5E9" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function OrderHistoryReport() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-gray-600 mb-6">Analysis of customer ordering patterns and history</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Total Orders (This Month)</p>
          <p className="text-2xl font-semibold">435</p>
          <p className="text-sm text-green-600">+6.1% from last month</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Average Order Value</p>
          <p className="text-2xl font-semibold">$97.24</p>
          <p className="text-sm text-green-600">+2.8% from last month</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Repeat Purchase Rate</p>
          <p className="text-2xl font-semibold">68%</p>
          <p className="text-sm text-green-600">+3.2% from last month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-4">Monthly Order Volume</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderHistoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" name="Number of Orders" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-4">Monthly Order Value</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={orderHistoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value}`} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  name="Order Value" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Top Customers by Order Value</h3>
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2 text-right">Orders</th>
              <th className="px-4 py-2 text-right">Total Value</th>
              <th className="px-4 py-2">Last Order</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {topCustomers.map((customer, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-3 text-sm">{customer.name}</td>
                <td className="px-4 py-3 text-sm text-right">{customer.orders}</td>
                <td className="px-4 py-3 text-sm text-right">${customer.total}</td>
                <td className="px-4 py-3 text-sm">{customer.lastOrder}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
