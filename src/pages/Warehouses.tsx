
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

type Location = {
  address: string;
  city: string;
  state: string;
  zip: string;
};

type Capacity = {
  total: number;
  used: number;
};

type Warehouse = {
  id: string;
  name: string;
  manager: string;
  phone: string;
  location: Location;
  capacity: Capacity;
};

const initialWarehouses: Warehouse[] = [
  { 
    id: "WH-001", 
    name: "East Distribution Center", 
    manager: "John Smith", 
    phone: "555-123-4567", 
    location: { 
      address: "123 Commerce St", 
      city: "New York", 
      state: "New York", 
      zip: "10001" 
    }, 
    capacity: { total: 50000, used: 35000 }
  },
  { 
    id: "WH-002", 
    name: "West Distribution Center", 
    manager: "Sarah Johnson", 
    phone: "555-234-5678", 
    location: { 
      address: "456 Industry Ave", 
      city: "Los Angeles", 
      state: "California", 
      zip: "90001" 
    }, 
    capacity: { total: 65000, used: 42000 }
  },
  { 
    id: "WH-003", 
    name: "Central Warehouse", 
    manager: "Michael Brown", 
    phone: "555-345-6789", 
    location: { 
      address: "789 Logistics Blvd", 
      city: "Chicago", 
      state: "Illinois", 
      zip: "60601" 
    }, 
    capacity: { total: 45000, used: 38000 }
  },
  { 
    id: "WH-004", 
    name: "South Distribution Center", 
    manager: "Emily Davis", 
    phone: "555-456-7890", 
    location: { 
      address: "101 Storage Way", 
      city: "Houston", 
      state: "Texas", 
      zip: "77001" 
    }, 
    capacity: { total: 70000, used: 30000 }
  },
  { 
    id: "WH-005", 
    name: "Northwest Facility", 
    manager: "David Miller", 
    phone: "555-567-8901", 
    location: { 
      address: "202 Warehouse Rd", 
      city: "Seattle", 
      state: "Washington", 
      zip: "98101" 
    }, 
    capacity: { total: 35000, used: 28000 }
  },
  { 
    id: "WH-006", 
    name: "Southeast Facility", 
    manager: "Jennifer Wilson", 
    phone: "555-678-9012", 
    location: { 
      address: "303 Freight St", 
      city: "Miami", 
      state: "Florida", 
      zip: "33101" 
    }, 
    capacity: { total: 40000, used: 22000 }
  },
];

export default function Warehouses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [warehouses, setWarehouses] = useState<Warehouse[]>(initialWarehouses);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Get unique states for the filter dropdown
  const uniqueStates = Array.from(new Set(warehouses.map(warehouse => warehouse.location.state))).sort();

  const filteredWarehouses = warehouses.filter(warehouse =>
    (warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.location.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (locationFilter === "" || warehouse.location.state === locationFilter)
  );

  const handleEdit = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (warehouse: Warehouse) => {
    const updatedWarehouses = warehouses.filter(w => w.id !== warehouse.id);
    setWarehouses(updatedWarehouses);
    toast({
      title: "Warehouse deleted",
      description: `${warehouse.name} has been removed from the warehouse list.`,
    });
  };

  const handleSave = (data: Record<string, any>) => {
    const updatedWarehouses = warehouses.map((warehouse) =>
      warehouse.id === selectedWarehouse?.id
        ? {
            ...warehouse,
            name: data.name,
            manager: data.manager,
            phone: data.phone,
            location: {
              address: data.address,
              city: data.city,
              state: data.state,
              zip: data.zip
            },
            capacity: {
              total: parseInt(data.totalCapacity),
              used: parseInt(data.usedCapacity)
            }
          }
        : warehouse
    );
    setWarehouses(updatedWarehouses);
    toast({
      title: "Warehouse updated",
      description: `${data.name} has been updated successfully.`,
    });
  };

  const handleAdd = (data: Record<string, any>) => {
    const newWarehouse: Warehouse = {
      id: `WH-${String(warehouses.length + 1).padStart(3, '0')}`,
      name: data.name,
      manager: data.manager,
      phone: data.phone,
      location: {
        address: data.address,
        city: data.city,
        state: data.state,
        zip: data.zip
      },
      capacity: {
        total: parseInt(data.totalCapacity),
        used: parseInt(data.usedCapacity)
      }
    };
    setWarehouses([...warehouses, newWarehouse]);
    toast({
      title: "Warehouse added",
      description: `${newWarehouse.name} has been added to the warehouse list.`,
    });
  };

  const getCapacityUsagePercent = (used: number, total: number) => {
    return Math.round((used / total) * 100);
  };

  const getCapacityBarColor = (usagePercent: number) => {
    if (usagePercent > 80) return "bg-red-500";
    if (usagePercent > 60) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Warehouses</h1>
          <p className="text-gray-600 text-sm">Manage your storage facilities</p>
        </div>
        <div className="flex space-x-3">
          <ReportButton title="Warehouses" type="warehouses" data={warehouses} />
          <Button 
            className="px-4 py-2 bg-purple-500 text-white rounded-md flex items-center hover:bg-purple-600 transition-colors"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus size={18} className="mr-2" />
            Add Warehouse
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-medium text-lg">Warehouse List</h2>
        </div>
        <div className="p-4 flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <SearchBar 
              placeholder="Search warehouses..."
              onSearch={setSearchTerm}
            />
          </div>
          <div className="w-full md:w-64">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="location-filter">Filter by State</Label>
              <select
                id="location-filter"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
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
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredWarehouses.map((warehouse) => {
                const usagePercent = getCapacityUsagePercent(warehouse.capacity.used, warehouse.capacity.total);
                
                return (
                  <tr key={warehouse.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{warehouse.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{warehouse.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {warehouse.location.city}, {warehouse.location.state}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{warehouse.manager}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <div className="text-sm text-gray-500">
                          {warehouse.capacity.used.toLocaleString()} / {warehouse.capacity.total.toLocaleString()} units
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${getCapacityBarColor(usagePercent)}`}
                            style={{ width: `${usagePercent}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
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
                          <DropdownMenuItem onClick={() => handleEdit(warehouse)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(warehouse)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedWarehouse && (
        <EditDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSave={handleSave}
          title="Warehouse"
          fields={[
            { name: "name", label: "Name", type: "text", value: selectedWarehouse.name },
            { name: "manager", label: "Manager", type: "text", value: selectedWarehouse.manager },
            { name: "phone", label: "Phone", type: "text", value: selectedWarehouse.phone },
            { name: "address", label: "Address", type: "text", value: selectedWarehouse.location.address },
            { name: "city", label: "City", type: "text", value: selectedWarehouse.location.city },
            { name: "state", label: "State", type: "text", value: selectedWarehouse.location.state },
            { name: "zip", label: "Zip", type: "text", value: selectedWarehouse.location.zip },
            { name: "totalCapacity", label: "Total Capacity", type: "number", value: selectedWarehouse.capacity.total },
            { name: "usedCapacity", label: "Used Capacity", type: "number", value: selectedWarehouse.capacity.used },
          ]}
        />
      )}

      {isAddDialogOpen && (
        <AddDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onAdd={handleAdd}
          title="Warehouse"
          fields={[
            { name: "name", label: "Name", type: "text" },
            { name: "manager", label: "Manager", type: "text" },
            { name: "phone", label: "Phone", type: "text" },
            { name: "address", label: "Address", type: "text" },
            { name: "city", label: "City", type: "text" },
            { name: "state", label: "State", type: "text" },
            { name: "zip", label: "Zip", type: "text" },
            { name: "totalCapacity", label: "Total Capacity", type: "number" },
            { name: "usedCapacity", label: "Used Capacity", type: "number" },
          ]}
        />
      )}
    </div>
  );
}
