
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

type Customer = {
  id: string;
  name: string;
  city: string;
  state: string;
  zipcode: string;
};

const initialCustomers: Customer[] = [
  { id: "CUST-001", name: "John Doe", city: "Los Angeles", state: "California", zipcode: "90001" },
  { id: "CUST-002", name: "Alice Smith", city: "Houston", state: "Texas", zipcode: "77001" },
  { id: "CUST-003", name: "Robert Brown", city: "New York", state: "New York", zipcode: "10001" },
  { id: "CUST-004", name: "Sarah Johnson", city: "Chicago", state: "Illinois", zipcode: "60601" },
  { id: "CUST-005", name: "Michael Williams", city: "Phoenix", state: "Arizona", zipcode: "85001" },
  { id: "CUST-006", name: "Emily Davis", city: "Philadelphia", state: "Pennsylvania", zipcode: "19101" },
  { id: "CUST-007", name: "David Miller", city: "San Antonio", state: "Texas", zipcode: "78205" },
  { id: "CUST-008", name: "Jennifer Wilson", city: "San Diego", state: "California", zipcode: "92101" },
  { id: "CUST-009", name: "James Taylor", city: "Dallas", state: "Texas", zipcode: "75201" },
  { id: "CUST-010", name: "Elizabeth Anderson", city: "San Jose", state: "California", zipcode: "95101" },
  { id: "CUST-011", name: "Richard Martinez", city: "Seattle", state: "Washington", zipcode: "98101" },
  { id: "CUST-012", name: "Patricia Thomas", city: "Denver", state: "Colorado", zipcode: "80201" },
  { id: "CUST-013", name: "Charles White", city: "Boston", state: "Massachusetts", zipcode: "02108" },
  { id: "CUST-014", name: "Linda Garcia", city: "Austin", state: "Texas", zipcode: "73301" },
  { id: "CUST-015", name: "Joseph Lee", city: "Portland", state: "Oregon", zipcode: "97201" },
  { id: "CUST-016", name: "Mary Rodriguez", city: "Miami", state: "Florida", zipcode: "33101" },
  { id: "CUST-017", name: "Thomas Walker", city: "Atlanta", state: "Georgia", zipcode: "30301" },
  { id: "CUST-018", name: "Karen Hernandez", city: "Detroit", state: "Michigan", zipcode: "48201" },
  { id: "CUST-019", name: "Daniel King", city: "Charlotte", state: "North Carolina", zipcode: "28201" },
  { id: "CUST-020", name: "Susan Wright", city: "Las Vegas", state: "Nevada", zipcode: "89101" },
];

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Get unique states for the filter dropdown
  const uniqueStates = Array.from(new Set(customers.map(customer => customer.state))).sort();

  const filteredCustomers = customers.filter(customer =>
    (customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (stateFilter === "" || customer.state === stateFilter)
  );

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (customer: Customer) => {
    const updatedCustomers = customers.filter(c => c.id !== customer.id);
    setCustomers(updatedCustomers);
    toast({
      title: "Customer deleted",
      description: `${customer.name} has been removed from the customer list.`,
    });
  };

  const handleSave = (data: Record<string, any>) => {
    const updatedCustomers = customers.map((customer) =>
      customer.id === selectedCustomer?.id
        ? {
            ...customer,
            name: data.name,
            city: data.city,
            state: data.state,
            zipcode: data.zipcode
          }
        : customer
    );
    setCustomers(updatedCustomers);
    toast({
      title: "Customer updated",
      description: `${data.name} has been updated successfully.`,
    });
  };

  const handleAdd = (data: Record<string, any>) => {
    const newCustomer: Customer = {
      id: `CUST-${String(customers.length + 1).padStart(3, '0')}`,
      name: data.name,
      city: data.city,
      state: data.state,
      zipcode: data.zipcode
    };
    setCustomers([...customers, newCustomer]);
    toast({
      title: "Customer added",
      description: `${newCustomer.name} has been added to the customer list.`,
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Customers</h1>
          <p className="text-gray-600 text-sm">Manage your customer information</p>
        </div>
        <div className="flex space-x-3">
          <ReportButton title="Customers" type="customers" data={customers} />
          <Button 
            className="px-4 py-2 bg-purple-500 text-white rounded-md flex items-center hover:bg-purple-600 transition-colors"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus size={18} className="mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-medium text-lg">Customer List</h2>
        </div>
        <div className="p-4 flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <SearchBar 
              placeholder="Search customers..."
              onSearch={setSearchTerm}
            />
          </div>
          <div className="w-full md:w-64">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="state-filter">Filter by State</Label>
              <select
                id="state-filter"
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">All States</option>
                {uniqueStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zip Code</th>
                <th className="px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 flex-shrink-0 mr-4 bg-purple-100 text-purple-600 rounded-full border border-purple-200 flex items-center justify-center">
                        {customer.name.charAt(0)}
                      </div>
                      <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.state}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.zipcode}</td>
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
                        <DropdownMenuItem onClick={() => handleEdit(customer)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(customer)}>
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

      {selectedCustomer && (
        <EditDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSave={handleSave}
          title="Customer"
          fields={[
            { name: "name", label: "Name", type: "text", value: selectedCustomer.name },
            { name: "city", label: "City", type: "text", value: selectedCustomer.city },
            { name: "state", label: "State", type: "text", value: selectedCustomer.state },
            { name: "zipcode", label: "Zip Code", type: "text", value: selectedCustomer.zipcode },
          ]}
        />
      )}

      {isAddDialogOpen && (
        <AddDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onAdd={handleAdd}
          title="Customer"
          fields={[
            { name: "name", label: "Name", type: "text" },
            { name: "city", label: "City", type: "text" },
            { name: "state", label: "State", type: "text" },
            { name: "zipcode", label: "Zip Code", type: "text" },
          ]}
        />
      )}
    </div>
  );
}
