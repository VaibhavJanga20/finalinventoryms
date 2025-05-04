
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

type Location = {
  city: string;
  state: string;
};

type Supplier = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: Location;
  activeOrders: number;
};

const initialSuppliers: Supplier[] = [
  { id: "SUP-001", name: "TechSupplies Inc.", email: "tech@example.com", phone: "555-123-4567", location: { city: "Dallas", state: "Texas" }, activeOrders: 12 },
  { id: "SUP-002", name: "FurnitureDirect", email: "furniture@example.com", phone: "555-234-5678", location: { city: "Atlanta", state: "Georgia" }, activeOrders: 8 },
  { id: "SUP-003", name: "ClothingWorld", email: "clothing@example.com", phone: "555-345-6789", location: { city: "Los Angeles", state: "California" }, activeOrders: 15 },
  { id: "SUP-004", name: "ElectroGoods LLC", email: "electronics@example.com", phone: "555-456-7890", location: { city: "Seattle", state: "Washington" }, activeOrders: 5 },
  { id: "SUP-005", name: "HomeStuff Co.", email: "home@example.com", phone: "555-567-8901", location: { city: "Chicago", state: "Illinois" }, activeOrders: 10 },
  { id: "SUP-006", name: "BookWorld", email: "books@example.com", phone: "555-678-9012", location: { city: "New York", state: "New York" }, activeOrders: 7 },
  { id: "SUP-007", name: "SportSupplies", email: "sports@example.com", phone: "555-789-0123", location: { city: "Miami", state: "Florida" }, activeOrders: 9 },
  { id: "SUP-008", name: "KitchenExperts", email: "kitchen@example.com", phone: "555-890-1234", location: { city: "Phoenix", state: "Arizona" }, activeOrders: 6 },
  { id: "SUP-009", name: "GardeningPro", email: "garden@example.com", phone: "555-901-2345", location: { city: "Denver", state: "Colorado" }, activeOrders: 3 },
  { id: "SUP-010", name: "ToysGalore", email: "toys@example.com", phone: "555-012-3456", location: { city: "Boston", state: "Massachusetts" }, activeOrders: 11 },
];

export default function Suppliers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.location.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (supplier: Supplier) => {
    const updatedSuppliers = suppliers.filter(s => s.id !== supplier.id);
    setSuppliers(updatedSuppliers);
    toast({
      title: "Supplier deleted",
      description: `${supplier.name} has been removed from the supplier list.`,
    });
  };

  const handleSave = (data: Record<string, any>) => {
    const updatedSuppliers = suppliers.map((supplier) =>
      supplier.id === selectedSupplier?.id
        ? {
            ...supplier,
            name: data.name,
            email: data.email,
            phone: data.phone,
            location: {
              city: data.city,
              state: data.state
            },
            activeOrders: parseInt(data.activeOrders)
          }
        : supplier
    );
    setSuppliers(updatedSuppliers);
    toast({
      title: "Supplier updated",
      description: `${data.name} has been updated successfully.`,
    });
  };

  const handleAdd = (data: Record<string, any>) => {
    const newSupplier: Supplier = {
      id: `SUP-${String(suppliers.length + 1).padStart(3, '0')}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      location: {
        city: data.city,
        state: data.state
      },
      activeOrders: parseInt(data.activeOrders)
    };
    setSuppliers([...suppliers, newSupplier]);
    toast({
      title: "Supplier added",
      description: `${newSupplier.name} has been added to your supplier list.`,
    });
  };

  // Function to prepare data for the report
  const getReportData = () => {
    return suppliers.map(supplier => ({
      ...supplier,
      // Include random contact and status for report display
      contact: supplier.email,
      status: ["Active", "Pending", "On Hold"][Math.floor(Math.random() * 3)]
    }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Suppliers</h1>
          <p className="text-gray-600 text-sm">Manage your product suppliers</p>
        </div>
        <div className="flex space-x-3">
          <ReportButton title="Suppliers" type="suppliers" data={getReportData()} />
          <Button 
            className="px-4 py-2 bg-purple-500 text-white rounded-md flex items-center hover:bg-purple-600 transition-colors"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus size={18} className="mr-2" />
            Add Supplier
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-medium text-lg">Supplier List</h2>
        </div>
        <div className="p-4">
          <SearchBar 
            placeholder="Search suppliers..."
            onSearch={setSearchTerm}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Orders</th>
                <th className="px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSuppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{supplier.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 flex-shrink-0 mr-4 bg-purple-100 text-purple-600 rounded-full border border-purple-200 flex items-center justify-center">
                        {supplier.name.charAt(0)}
                      </div>
                      <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.location.city}, {supplier.location.state}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.activeOrders}</td>
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
                        <DropdownMenuItem onClick={() => handleEdit(supplier)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(supplier)}>
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

      {selectedSupplier && (
        <EditDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSave={handleSave}
          title="Supplier"
          fields={[
            { name: "name", label: "Name", type: "text", value: selectedSupplier.name },
            { name: "email", label: "Email", type: "email", value: selectedSupplier.email },
            { name: "phone", label: "Phone", type: "text", value: selectedSupplier.phone },
            { name: "city", label: "City", type: "text", value: selectedSupplier.location.city },
            { name: "state", label: "State", type: "text", value: selectedSupplier.location.state },
            { name: "activeOrders", label: "Active Orders", type: "number", value: selectedSupplier.activeOrders },
          ]}
        />
      )}

      {isAddDialogOpen && (
        <AddDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onAdd={handleAdd}
          title="Supplier"
          fields={[
            { name: "name", label: "Name", type: "text" },
            { name: "email", label: "Email", type: "email" },
            { name: "phone", label: "Phone", type: "text" },
            { name: "city", label: "City", type: "text" },
            { name: "state", label: "State", type: "text" },
            { name: "activeOrders", label: "Active Orders", type: "number" },
          ]}
        />
      )}
    </div>
  );
}
