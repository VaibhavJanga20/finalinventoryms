
import { useState } from "react";
import { SearchBar } from "../components/SearchBar";
import { Plus, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReportButton } from "../components/ReportButton";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { AddDialog } from "../components/AddDialog";
import { toast } from "@/components/ui/use-toast";

type Order = {
  id: string;
  date: string;
  customer: string;
  status: "Pending" | "Processing" | "Completed";
  total: number;
  items: OrderItem[];
};

type OrderItem = {
  product: string;
  quantity: number;
  price: number;
};

const initialOrders: Order[] = [
  { 
    id: "ORD-001", 
    date: "2025-05-01", 
    customer: "John Smith", 
    status: "Completed", 
    total: 350.00,
    items: [
      { product: "Wireless Headphones", quantity: 1, price: 99.99 },
      { product: "Bluetooth Speaker", quantity: 2, price: 79.99 },
      { product: "Phone Case", quantity: 1, price: 19.99 }
    ]
  },
  { 
    id: "ORD-002", 
    date: "2025-04-30", 
    customer: "Emily Johnson", 
    status: "Processing", 
    total: 125.50,
    items: [
      { product: "T-shirt", quantity: 2, price: 19.99 },
      { product: "Jeans", quantity: 1, price: 59.99 },
      { product: "Socks", quantity: 3, price: 8.49 }
    ]
  },
  { 
    id: "ORD-003", 
    date: "2025-04-29", 
    customer: "Michael Brown", 
    status: "Pending", 
    total: 780.00,
    items: [
      { product: "Office Chair", quantity: 1, price: 199.95 },
      { product: "Desk", quantity: 1, price: 249.95 },
      { product: "Lamp", quantity: 2, price: 39.99 },
      { product: "Bookshelf", quantity: 1, price: 89.95 },
      { product: "Desk Organizer", quantity: 3, price: 19.99 }
    ]
  },
  { 
    id: "ORD-004", 
    date: "2025-04-28", 
    customer: "Sarah Williams", 
    status: "Completed", 
    total: 92.75,
    items: [
      { product: "Water Bottle", quantity: 1, price: 19.99 },
      { product: "Yoga Mat", quantity: 1, price: 24.99 },
      { product: "Resistance Bands", quantity: 3, price: 15.99 }
    ]
  },
  { 
    id: "ORD-005", 
    date: "2025-04-27", 
    customer: "David Miller", 
    status: "Processing", 
    total: 215.25,
    items: [
      { product: "Smart Watch", quantity: 1, price: 199.99 },
      { product: "Watch Band", quantity: 1, price: 15.25 }
    ]
  },
];

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderDetailsOpen(true);
  };

  const handleDelete = (order: Order) => {
    const updatedOrders = orders.filter(o => o.id !== order.id);
    setOrders(updatedOrders);
    toast({
      title: "Order deleted",
      description: `Order ${order.id} has been removed.`,
    });
  };

  const handleAddOrder = (data: Record<string, any>) => {
    const newOrder: Order = {
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      customer: data.customer,
      status: data.status as "Pending" | "Processing" | "Completed",
      total: parseFloat(data.total),
      items: [
        // Sample items since we're not implementing a full item editor
        { product: "Sample Product 1", quantity: 1, price: parseFloat(data.total) * 0.7 },
        { product: "Sample Product 2", quantity: 1, price: parseFloat(data.total) * 0.3 }
      ]
    };
    setOrders([...orders, newOrder]);
    toast({
      title: "Order added",
      description: `New order for ${data.customer} has been created.`,
    });
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Orders</h1>
          <p className="text-gray-600 text-sm">Manage customer orders</p>
        </div>
        <div className="flex space-x-3">
          <ReportButton title="Orders" type="orders" data={orders} />
          <Button 
            className="px-4 py-2 bg-purple-500 text-white rounded-md flex items-center hover:bg-purple-600 transition-colors"
            onClick={() => setIsAddOrderOpen(true)}
          >
            <Plus size={18} className="mr-2" />
            Add Order
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-medium text-lg">Order List</h2>
        </div>
        <div className="p-4">
          <SearchBar 
            placeholder="Search orders..."
            onSearch={setSearchTerm}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.625 7.5C3.625 8.12 3.12 8.625 2.5 8.625C1.88 8.625 1.375 8.12 1.375 7.5C1.375 6.88 1.88 6.375 2.5 6.375C3.12 6.375 3.625 6.88 3.625 7.5ZM8.625 7.5C8.625 8.12 8.12 8.625 7.5 8.625C6.88 8.625 6.375 8.12 6.375 7.5C6.375 6.88 6.88 6.375 7.5 6.375C8.12 6.375 8.625 6.88 8.625 7.5ZM13.625 7.5C13.625 8.12 13.12 8.625 12.5 8.625C11.88 8.625 11.375 8.12 11.375 7.5C11.375 6.88 11.88 6.375 12.5 6.375C13.12 6.375 13.625 6.88 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(order)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Dialog */}
      {selectedOrder && (
        <Dialog open={isOrderDetailsOpen} onOpenChange={setIsOrderDetailsOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Order Details - {selectedOrder.id}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Customer</h3>
                  <p className="text-sm">{selectedOrder.customer}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date</h3>
                  <p className="text-sm">{selectedOrder.date}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusClass(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Total</h3>
                  <p className="text-sm font-medium">${selectedOrder.total.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Items</h3>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{item.product}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">${item.price.toFixed(2)}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50">
                      <td colSpan={3} className="px-4 py-2 text-sm text-right font-medium">Total:</td>
                      <td className="px-4 py-2 text-sm font-medium">${selectedOrder.total.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsOrderDetailsOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Order Dialog */}
      {isAddOrderOpen && (
        <AddDialog
          isOpen={isAddOrderOpen}
          onClose={() => setIsAddOrderOpen(false)}
          onAdd={handleAddOrder}
          title="Order"
          fields={[
            { name: "customer", label: "Customer", type: "text" },
            { name: "status", label: "Status", type: "text" },
            { name: "total", label: "Total Amount", type: "number" },
          ]}
        />
      )}
    </div>
  );
}
