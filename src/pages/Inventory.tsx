
import { useState } from "react";
import { SearchBar } from "../components/SearchBar";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { EditDialog } from "../components/EditDialog";
import { AddDialog } from "../components/AddDialog";
import { Button } from "@/components/ui/button";
import { ReportButton } from "../components/ReportButton";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";

type InventoryItem = {
  id: string;
  product: string;
  category: string;
  warehouse: string;
  quantity: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  lastUpdated: string;
};

const initialInventory: InventoryItem[] = [
  { id: "INV-001", product: "Wireless Headphones", category: "Electronics", warehouse: "East Distribution Center", quantity: 45, status: "In Stock", lastUpdated: "2025-05-01" },
  { id: "INV-002", product: "Office Chair", category: "Furniture", warehouse: "West Distribution Center", quantity: 12, status: "Low Stock", lastUpdated: "2025-04-30" },
  { id: "INV-003", product: "Cotton T-shirt", category: "Clothing", warehouse: "Central Warehouse", quantity: 200, status: "In Stock", lastUpdated: "2025-04-29" },
  { id: "INV-004", product: "Smartphone", category: "Electronics", warehouse: "East Distribution Center", quantity: 28, status: "In Stock", lastUpdated: "2025-04-28" },
  { id: "INV-005", product: "Coffee Table", category: "Furniture", warehouse: "South Distribution Center", quantity: 8, status: "Low Stock", lastUpdated: "2025-04-27" },
  { id: "INV-006", product: "Denim Jeans", category: "Clothing", warehouse: "Central Warehouse", quantity: 150, status: "In Stock", lastUpdated: "2025-04-26" },
  { id: "INV-007", product: "Bluetooth Speaker", category: "Electronics", warehouse: "East Distribution Center", quantity: 35, status: "In Stock", lastUpdated: "2025-04-25" },
  { id: "INV-008", product: "Bookshelf", category: "Furniture", warehouse: "West Distribution Center", quantity: 15, status: "Low Stock", lastUpdated: "2025-04-24" },
  { id: "INV-009", product: "Hooded Sweatshirt", category: "Clothing", warehouse: "Central Warehouse", quantity: 0, status: "Out of Stock", lastUpdated: "2025-04-23" },
  { id: "INV-010", product: "Tablet", category: "Electronics", warehouse: "South Distribution Center", quantity: 18, status: "In Stock", lastUpdated: "2025-04-22" },
  { id: "INV-011", product: "Desk", category: "Furniture", warehouse: "Northwest Facility", quantity: 10, status: "Low Stock", lastUpdated: "2025-04-21" },
  { id: "INV-012", product: "Running Shoes", category: "Clothing", warehouse: "Southeast Facility", quantity: 60, status: "In Stock", lastUpdated: "2025-04-20" },
  { id: "INV-013", product: "Smart Watch", category: "Electronics", warehouse: "East Distribution Center", quantity: 0, status: "Out of Stock", lastUpdated: "2025-04-19" },
  { id: "INV-014", product: "Dining Chair Set", category: "Furniture", warehouse: "West Distribution Center", quantity: 6, status: "Low Stock", lastUpdated: "2025-04-18" },
  { id: "INV-015", product: "Winter Jacket", category: "Clothing", warehouse: "Central Warehouse", quantity: 40, status: "In Stock", lastUpdated: "2025-04-17" },
];

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredInventory = inventory.filter(item =>
    item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.warehouse.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (item: InventoryItem) => {
    const updatedInventory = inventory.filter(i => i.id !== item.id);
    setInventory(updatedInventory);
    toast({
      title: "Inventory item deleted",
      description: `${item.product} has been removed from the inventory.`,
    });
  };

  const handleSave = (data: Record<string, any>) => {
    const quantity = parseInt(data.quantity);
    let status: "In Stock" | "Low Stock" | "Out of Stock" = "In Stock";
    
    if (quantity <= 0) {
      status = "Out of Stock";
    } else if (quantity <= 15) {
      status = "Low Stock";
    }
    
    const updatedInventory = inventory.map((item) =>
      item.id === selectedItem?.id
        ? {
            ...item,
            product: data.product,
            category: data.category,
            warehouse: data.warehouse,
            quantity: quantity,
            status: status,
            lastUpdated: new Date().toISOString().split('T')[0]
          }
        : item
    );
    setInventory(updatedInventory);
    toast({
      title: "Inventory updated",
      description: `${data.product} has been updated successfully.`,
    });
  };

  const handleAdd = (data: Record<string, any>) => {
    const quantity = parseInt(data.quantity);
    let status: "In Stock" | "Low Stock" | "Out of Stock" = "In Stock";
    
    if (quantity <= 0) {
      status = "Out of Stock";
    } else if (quantity <= 15) {
      status = "Low Stock";
    }
    
    const newItem: InventoryItem = {
      id: `INV-${String(inventory.length + 1).padStart(3, '0')}`,
      product: data.product,
      category: data.category,
      warehouse: data.warehouse,
      quantity: quantity,
      status: status,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setInventory([...inventory, newItem]);
    toast({
      title: "Inventory item added",
      description: `${newItem.product} has been added to the inventory.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 text-green-800';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Inventory</h1>
          <p className="text-gray-600 text-sm">Manage your inventory across warehouses</p>
        </div>
        <div className="flex space-x-3">
          <ReportButton title="Inventory" type="inventory" data={inventory} />
          <Button 
            className="px-4 py-2 bg-purple-500 text-white rounded-md flex items-center hover:bg-purple-600 transition-colors"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus size={18} className="mr-2" />
            Add Inventory
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-medium text-lg">Inventory List</h2>
        </div>
        <div className="p-4">
          <SearchBar 
            placeholder="Search inventory..."
            onSearch={setSearchTerm}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warehouse</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                <th className="px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.product}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.warehouse}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.lastUpdated}</td>
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
                        <DropdownMenuItem onClick={() => handleEdit(item)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(item)}>
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

      {selectedItem && (
        <EditDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSave={handleSave}
          title="Inventory Item"
          fields={[
            { name: "product", label: "Product", type: "text", value: selectedItem.product },
            { name: "category", label: "Category", type: "text", value: selectedItem.category },
            { name: "warehouse", label: "Warehouse", type: "text", value: selectedItem.warehouse },
            { name: "quantity", label: "Quantity", type: "number", value: selectedItem.quantity },
          ]}
        />
      )}

      {isAddDialogOpen && (
        <AddDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onAdd={handleAdd}
          title="Inventory Item"
          fields={[
            { name: "product", label: "Product", type: "text" },
            { name: "category", label: "Category", type: "text" },
            { name: "warehouse", label: "Warehouse", type: "text" },
            { name: "quantity", label: "Quantity", type: "number" },
          ]}
        />
      )}
    </div>
  );
}
