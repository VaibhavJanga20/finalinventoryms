
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell 
} from "recharts";
import { Printer } from "lucide-react";

type ReportDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: "products" | "inventory" | "categories" | "suppliers" | "orders" | "warehouses" | "customers";
  data: any[];
};

const COLORS = ["#8B5CF6", "#D946EF", "#F97316", "#0EA5E9", "#10B981", "#F59E0B"];

export function ReportDialog({ isOpen, onClose, title, type, data }: ReportDialogProps) {
  const handlePrint = () => {
    window.print();
  };

  const renderReport = () => {
    switch (type) {
      case "products":
        return <ProductReport data={data} />;
      case "inventory":
        return <InventoryReport data={data} />;
      case "categories":
        return <CategoriesReport data={data} />;
      case "suppliers":
        return <SuppliersReport data={data} />;
      case "orders":
        return <OrdersReport data={data} />;
      case "warehouses":
        return <WarehousesReport data={data} />;
      case "customers":
        return <CustomersReport data={data} />;
      default:
        return <div>No report available for this section</div>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold">{title} Report</DialogTitle>
          <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
            <Printer size={16} />
            <span>Print Report</span>
          </Button>
        </DialogHeader>
        
        <div className="mt-4 print:m-6">
          {renderReport()}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Product Report Component
function ProductReport({ data }: { data: any[] }) {
  const categoryData = processCategoryData(data);
  const priceRangeData = processPriceRangeData(data);
  const productsByStock = [...data].sort((a, b) => b.stock - a.stock);
  const productsByCategory = getProductsByCategory(data);
  
  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-medium text-lg mb-4">Product Overview</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Products</p>
            <p className="text-2xl font-semibold">{data.length}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Low Stock Items</p>
            <p className="text-2xl font-semibold">{data.filter(item => item.stock <= 20).length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Avg. Price</p>
            <p className="text-2xl font-semibold">
              ${(data.reduce((sum, item) => sum + item.price, 0) / data.length).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-4">Products by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-4">Price Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priceRangeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">All Products By Stock (Descending)</h3>
        <table className="min-w-full border border-gray-200 rounded-md">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left">Product ID</th>
              <th className="px-4 py-2 text-left">Product Name</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Stock</th>
            </tr>
          </thead>
          <tbody>
            {productsByStock.map((product, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-2">{product.id}</td>
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">{product.category}</td>
                <td className="px-4 py-2">${product.price.toFixed(2)}</td>
                <td className="px-4 py-2">{product.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div>
        <h3 className="font-medium mb-4">Products By Category Breakdown</h3>
        <div className="grid grid-cols-1 gap-4">
          {Object.keys(productsByCategory).map((category, idx) => (
            <div key={idx} className="border border-gray-200 rounded-md p-4">
              <h4 className="font-semibold mb-2">{category}</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left">Product Name</th>
                      <th className="px-4 py-2 text-left">Price</th>
                      <th className="px-4 py-2 text-left">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsByCategory[category].map((product, productIdx) => (
                      <tr key={productIdx} className={productIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-4 py-2">{product.name}</td>
                        <td className="px-4 py-2">${product.price.toFixed(2)}</td>
                        <td className="px-4 py-2">{product.stock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Inventory Report Component
function InventoryReport({ data }: { data: any[] }) {
  const stockStatusData = [
    { name: "In Stock", value: data.filter(item => item.status === "In Stock").length },
    { name: "Low Stock", value: data.filter(item => item.status === "Low Stock").length },
    { name: "Out of Stock", value: data.filter(item => item.status === "Out of Stock").length },
  ];

  const categoryStockData = processCategoryStockData(data);
  const lowStockItems = data.filter(item => item.status === "Low Stock");
  const outOfStockItems = data.filter(item => item.status === "Out of Stock");

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-medium text-lg mb-4">Inventory Overview</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Items</p>
            <p className="text-2xl font-semibold">{data.length}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Low Stock</p>
            <p className="text-2xl font-semibold">{data.filter(item => item.status === "Low Stock").length}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Out of Stock</p>
            <p className="text-2xl font-semibold">{data.filter(item => item.status === "Out of Stock").length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-4">Stock Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stockStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell fill="#10B981" /> {/* In Stock */}
                  <Cell fill="#F59E0B" /> {/* Low Stock */}
                  <Cell fill="#EF4444" /> {/* Out of Stock */}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-4">Stock Levels by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryStockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="quantity" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Low Stock Items</h3>
        <table className="min-w-full border border-gray-200 rounded-md">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left">Item ID</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Quantity</th>
              <th className="px-4 py-2 text-left">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {lowStockItems.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-2">{item.id}</td>
                <td className="px-4 py-2">{item.category}</td>
                <td className="px-4 py-2">{item.quantity}</td>
                <td className="px-4 py-2">{item.lastUpdated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div>
        <h3 className="font-medium mb-4">Out of Stock Items</h3>
        <table className="min-w-full border border-gray-200 rounded-md">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left">Item ID</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Quantity</th>
              <th className="px-4 py-2 text-left">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {outOfStockItems.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-2">{item.id}</td>
                <td className="px-4 py-2">{item.category}</td>
                <td className="px-4 py-2">{item.quantity}</td>
                <td className="px-4 py-2">{item.lastUpdated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Categories Report Component
function CategoriesReport({ data }: { data: any[] }) {
  const categoriesData = data.map(category => ({
    name: category.name,
    items: category.items
  })).sort((a, b) => b.items - a.items);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-medium text-lg mb-4">Categories Overview</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Categories</p>
            <p className="text-2xl font-semibold">{data.length}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Items</p>
            <p className="text-2xl font-semibold">
              {data.reduce((sum, category) => sum + category.items, 0)}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Avg. Items per Category</p>
            <p className="text-2xl font-semibold">
              {Math.round(data.reduce((sum, category) => sum + category.items, 0) / data.length)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-4">Items by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoriesData.slice(0, 10)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="items" fill="#8B5CF6" />
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
                  data={categoriesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="items"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {categoriesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Category Details</h3>
        <table className="min-w-full border border-gray-200 rounded-md">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Category Name</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Items Count</th>
              <th className="px-4 py-2 text-left">Created On</th>
            </tr>
          </thead>
          <tbody>
            {data.map((category, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-2">{category.id}</td>
                <td className="px-4 py-2">{category.name}</td>
                <td className="px-4 py-2">{category.description}</td>
                <td className="px-4 py-2">{category.items}</td>
                <td className="px-4 py-2">{category.createdOn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Suppliers Report Component
function SuppliersReport({ data }: { data: any[] }) {
  const locationData = processSupplierLocationData(data);
  const topSuppliers = [...data].sort((a, b) => b.activeOrders - a.activeOrders).slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-medium text-lg mb-4">Suppliers Overview</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Suppliers</p>
            <p className="text-2xl font-semibold">{data.length}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Active Orders</p>
            <p className="text-2xl font-semibold">
              {data.reduce((sum, supplier) => sum + supplier.activeOrders, 0)}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Avg. Orders per Supplier</p>
            <p className="text-2xl font-semibold">
              {(data.reduce((sum, supplier) => sum + supplier.activeOrders, 0) / data.length).toFixed(1)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-4">Suppliers by Location</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="state" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-4">Active Orders by Supplier</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.map(supplier => ({
                    name: supplier.name,
                    value: supplier.activeOrders
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => 
                    name.length > 10 
                      ? `${name.substring(0, 10)}...: ${(percent * 100).toFixed(0)}%`
                      : `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Top Active Order Suppliers</h3>
        <table className="min-w-full border border-gray-200 rounded-md">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left">Supplier Name</th>
              <th className="px-4 py-2 text-left">Contact</th>
              <th className="px-4 py-2 text-left">Location</th>
              <th className="px-4 py-2 text-left">Active Orders</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {topSuppliers.map((supplier, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-2">{supplier.name}</td>
                <td className="px-4 py-2">{supplier.contact}</td>
                <td className="px-4 py-2">{`${supplier.location.city}, ${supplier.location.state}`}</td>
                <td className="px-4 py-2">{supplier.activeOrders}</td>
                <td className="px-4 py-2">{supplier.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div>
        <h3 className="font-medium mb-4">Supplier Location Distribution</h3>
        <table className="min-w-full border border-gray-200 rounded-md">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left">State</th>
              <th className="px-4 py-2 text-left">Number of Suppliers</th>
              <th className="px-4 py-2 text-left">Total Orders</th>
            </tr>
          </thead>
          <tbody>
            {locationData.map((location, index) => {
              const stateSuppliers = data.filter(s => s.location.state === location.state);
              const totalOrders = stateSuppliers.reduce((sum, s) => sum + s.activeOrders, 0);
              
              return (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-2">{location.state}</td>
                  <td className="px-4 py-2">{location.count}</td>
                  <td className="px-4 py-2">{totalOrders}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Orders Report Component
function OrdersReport({ data }: { data: any[] }) {
  const statusData = [
    { name: "Completed", value: data.filter(order => order.status === "Completed").length },
    { name: "Processing", value: data.filter(order => order.status === "Processing").length },
    { name: "Pending", value: data.filter(order => order.status === "Pending").length },
  ];

  const orderValueData = processOrderValueData(data);
  
  // Calculate total revenue
  const totalRevenue = data.reduce((sum, order) => sum + order.total, 0);
  
  // Calculate average order value
  const avgOrderValue = totalRevenue / data.length;

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-medium text-lg mb-4">Orders Overview</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-2xl font-semibold">{data.length}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-2xl font-semibold">
              ${totalRevenue.toFixed(2)}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Avg. Order Value</p>
            <p className="text-2xl font-semibold">
              ${avgOrderValue.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-4">Order Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell fill="#10B981" /> {/* Completed */}
                  <Cell fill="#3B82F6" /> {/* Processing */}
                  <Cell fill="#F59E0B" /> {/* Pending */}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-4">Order Value Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderValueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Order Details</h3>
        <table className="min-w-full border border-gray-200 rounded-md">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left">Order ID</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.map((order, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-2">{order.id}</td>
                <td className="px-4 py-2">{order.date}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full 
                    ${order.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                      order.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 
                      'bg-yellow-100 text-yellow-800'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-right">${order.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-semibold">
              <td className="px-4 py-2" colSpan={3}>Total Revenue</td>
              <td className="px-4 py-2 text-right">${totalRevenue.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <div>
        <h3 className="font-medium mb-4">Order Status Breakdown</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <h4 className="font-medium mb-2 text-green-600">Completed Orders</h4>
            <table className="min-w-full border border-gray-200 rounded-md">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Order ID</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.filter(order => order.status === "Completed").map((order, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-2">{order.id}</td>
                    <td className="px-4 py-2">{order.date}</td>
                    <td className="px-4 py-2 text-right">${order.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div>
            <h4 className="font-medium mb-2 text-blue-600">Processing Orders</h4>
            <table className="min-w-full border border-gray-200 rounded-md">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Order ID</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.filter(order => order.status === "Processing").map((order, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-2">{order.id}</td>
                    <td className="px-4 py-2">{order.date}</td>
                    <td className="px-4 py-2 text-right">${order.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div>
            <h4 className="font-medium mb-2 text-yellow-600">Pending Orders</h4>
            <table className="min-w-full border border-gray-200 rounded-md">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Order ID</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.filter(order => order.status === "Pending").map((order, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-2">{order.id}</td>
                    <td className="px-4 py-2">{order.date}</td>
                    <td className="px-4 py-2 text-right">${order.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Warehouses Report Component
function WarehousesReport({ data }: { data: any[] }) {
  const capacityData = data.map(warehouse => ({
    name: warehouse.location.city,
    used: warehouse.capacity.used,
    available: warehouse.capacity.total - warehouse.capacity.used,
  }));

  // Calculate utilization percentages
  const utilizationByWarehouse = data.map(warehouse => ({
    name: warehouse.location.city + ", " + warehouse.location.state,
    utilization: Math.round((warehouse.capacity.used / warehouse.capacity.total) * 100),
    capacity: warehouse.capacity.total,
    used: warehouse.capacity.used,
    available: warehouse.capacity.total - warehouse.capacity.used
  }));

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-medium text-lg mb-4">Warehouses Overview</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Warehouses</p>
            <p className="text-2xl font-semibold">{data.length}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Capacity</p>
            <p className="text-2xl font-semibold">
              {data.reduce((sum, warehouse) => sum + warehouse.capacity.total, 0).toLocaleString()} units
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Avg. Utilization</p>
            <p className="text-2xl font-semibold">
              {Math.round(data.reduce((sum, warehouse) => 
                sum + (warehouse.capacity.used / warehouse.capacity.total) * 100, 0) / data.length)}%
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-4">Warehouse Capacity Utilization</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={capacityData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey="used" stackId="a" fill="#8B5CF6" name="Used Capacity" />
                <Bar dataKey="available" stackId="a" fill="#E5DEFF" name="Available" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-4">Warehouse Location Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.map(warehouse => ({
                    name: warehouse.location.state,
                    value: 1
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
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Warehouse Utilization Details</h3>
        <table className="min-w-full border border-gray-200 rounded-md">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left">Warehouse</th>
              <th className="px-4 py-2 text-left">Total Capacity</th>
              <th className="px-4 py-2 text-left">Used Capacity</th>
              <th className="px-4 py-2 text-left">Available Capacity</th>
              <th className="px-4 py-2 text-left">Utilization %</th>
            </tr>
          </thead>
          <tbody>
            {utilizationByWarehouse.map((warehouse, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-2">{warehouse.name}</td>
                <td className="px-4 py-2">{warehouse.capacity.toLocaleString()}</td>
                <td className="px-4 py-2">{warehouse.used.toLocaleString()}</td>
                <td className="px-4 py-2">{warehouse.available.toLocaleString()}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className={`h-2.5 rounded-full ${
                        warehouse.utilization > 80 ? 'bg-red-500' : 
                        warehouse.utilization > 60 ? 'bg-yellow-500' : 'bg-green-500'
                      }`} style={{ width: `${warehouse.utilization}%` }}></div>
                    </div>
                    <span className="ml-2">{warehouse.utilization}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div>
        <h3 className="font-medium mb-4">Warehouse Details by Location</h3>
        <div className="space-y-4">
          {data.map((warehouse, idx) => (
            <div key={idx} className="border border-gray-200 rounded-md p-4">
              <h4 className="font-semibold text-lg mb-2">
                {warehouse.location.city}, {warehouse.location.state} (ID: {warehouse.id})
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p><strong>Manager:</strong> {warehouse.manager}</p>
                  <p><strong>Phone:</strong> {warehouse.phone}</p>
                  <p><strong>Address:</strong> {warehouse.location.address}</p>
                  <p><strong>Zip:</strong> {warehouse.location.zip}</p>
                </div>
                <div>
                  <p><strong>Total Capacity:</strong> {warehouse.capacity.total.toLocaleString()} units</p>
                  <p><strong>Used Capacity:</strong> {warehouse.capacity.used.toLocaleString()} units</p>
                  <p><strong>Available:</strong> {(warehouse.capacity.total - warehouse.capacity.used).toLocaleString()} units</p>
                  <p><strong>Utilization:</strong> {Math.round((warehouse.capacity.used / warehouse.capacity.total) * 100)}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Customers Report Component
function CustomersReport({ data }: { data: any[] }) {
  // Get customers by state
  const customersByState: Record<string, number> = {};
  data.forEach(customer => {
    if (customersByState[customer.state]) {
      customersByState[customer.state]++;
    } else {
      customersByState[customer.state] = 1;
    }
  });

  const stateData = Object.keys(customersByState).map(state => ({
    state,
    count: customersByState[state]
  }));

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-medium text-lg mb-4">Customers Overview</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Customers</p>
            <p className="text-2xl font-semibold">{data.length}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">States Covered</p>
            <p className="text-2xl font-semibold">
              {Object.keys(customersByState).length}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Top State</p>
            <p className="text-2xl font-semibold">
              {stateData.sort((a, b) => b.count - a.count)[0]?.state || "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-4">Customers by State</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="state" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-4">Customer Distribution by State</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stateData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="state"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {stateData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Customer Details</h3>
        <table className="min-w-full border border-gray-200 rounded-md">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">City</th>
              <th className="px-4 py-2 text-left">State</th>
              <th className="px-4 py-2 text-left">Zip Code</th>
            </tr>
          </thead>
          <tbody>
            {data.map((customer, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-2">{customer.id}</td>
                <td className="px-4 py-2">{customer.name}</td>
                <td className="px-4 py-2">{customer.city}</td>
                <td className="px-4 py-2">{customer.state}</td>
                <td className="px-4 py-2">{customer.zipcode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div>
        <h3 className="font-medium mb-4">Customers By State</h3>
        <div className="space-y-4">
          {Object.keys(customersByState).sort().map((state, idx) => (
            <div key={idx} className="border border-gray-200 rounded-md p-4">
              <h4 className="font-semibold mb-2">{state} ({customersByState[state]} customers)</h4>
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">City</th>
                    <th className="px-4 py-2 text-left">Zip Code</th>
                  </tr>
                </thead>
                <tbody>
                  {data.filter(c => c.state === state).map((customer, customerIdx) => (
                    <tr key={customerIdx} className={customerIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-2">{customer.id}</td>
                      <td className="px-4 py-2">{customer.name}</td>
                      <td className="px-4 py-2">{customer.city}</td>
                      <td className="px-4 py-2">{customer.zipcode}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper functions for data processing
function processCategoryData(products: any[]) {
  const categories: Record<string, number> = {};
  
  products.forEach(product => {
    if (categories[product.category]) {
      categories[product.category]++;
    } else {
      categories[product.category] = 1;
    }
  });
  
  return Object.keys(categories).map(category => ({
    name: category,
    value: categories[category]
  }));
}

function processPriceRangeData(products: any[]) {
  const priceRanges = [
    { range: "$0-$25", min: 0, max: 25, count: 0 },
    { range: "$25-$50", min: 25, max: 50, count: 0 },
    { range: "$50-$100", min: 50, max: 100, count: 0 },
    { range: "$100-$200", min: 100, max: 200, count: 0 },
    { range: "$200+", min: 200, max: Infinity, count: 0 },
  ];
  
  products.forEach(product => {
    const price = product.price;
    for (const range of priceRanges) {
      if (price >= range.min && price < range.max) {
        range.count++;
        break;
      }
    }
  });
  
  return priceRanges;
}

function processOrderValueData(orders: any[]) {
  const orderRanges = [
    { range: "$0-$100", min: 0, max: 100, count: 0 },
    { range: "$100-$500", min: 100, max: 500, count: 0 },
    { range: "$500-$1000", min: 500, max: 1000, count: 0 },
    { range: "$1000+", min: 1000, max: Infinity, count: 0 },
  ];
  
  orders.forEach(order => {
    const total = order.total;
    for (const range of orderRanges) {
      if (total >= range.min && total < range.max) {
        range.count++;
        break;
      }
    }
  });
  
  return orderRanges;
}

function processCategoryStockData(items: any[]) {
  const categories: Record<string, number> = {};
  
  items.forEach(item => {
    if (categories[item.category]) {
      categories[item.category] += item.quantity;
    } else {
      categories[item.category] = item.quantity;
    }
  });
  
  return Object.keys(categories).map(category => ({
    category,
    quantity: categories[category]
  }));
}

function processSupplierLocationData(suppliers: any[]) {
  const locations: Record<string, number> = {};
  
  suppliers.forEach(supplier => {
    if (locations[supplier.location.state]) {
      locations[supplier.location.state]++;
    } else {
      locations[supplier.location.state] = 1;
    }
  });
  
  return Object.keys(locations).map(state => ({
    state,
    count: locations[state]
  }));
}

function getProductsByCategory(products: any[]) {
  const categories: Record<string, any[]> = {};
  
  products.forEach(product => {
    if (categories[product.category]) {
      categories[product.category].push(product);
    } else {
      categories[product.category] = [product];
    }
  });
  
  return categories;
}
