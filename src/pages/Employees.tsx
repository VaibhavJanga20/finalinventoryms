
import { useState } from "react";
import { SearchBar } from "../components/SearchBar";
import { Plus, Pencil, Trash2, BarChart3 } from "lucide-react";
import { EditDialog } from "../components/EditDialog";
import { AddDialog } from "../components/AddDialog";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts";

type Employee = {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  startDate: string;
};

const initialEmployees: Employee[] = [
  { id: "EMP-001", name: "John Smith", position: "Warehouse Manager", department: "Operations", email: "john@example.com", phone: "555-123-4567", startDate: "2022-03-15" },
  { id: "EMP-002", name: "Sarah Johnson", position: "Inventory Specialist", department: "Operations", email: "sarah@example.com", phone: "555-234-5678", startDate: "2022-04-10" },
  { id: "EMP-003", name: "Michael Brown", position: "Sales Representative", department: "Sales", email: "michael@example.com", phone: "555-345-6789", startDate: "2022-05-22" },
  { id: "EMP-004", name: "Emily Davis", position: "Customer Service", department: "Customer Support", email: "emily@example.com", phone: "555-456-7890", startDate: "2022-06-14" },
  { id: "EMP-005", name: "David Miller", position: "Logistics Coordinator", department: "Operations", email: "david@example.com", phone: "555-567-8901", startDate: "2022-07-08" },
  { id: "EMP-006", name: "Jennifer Wilson", position: "HR Specialist", department: "Human Resources", email: "jennifer@example.com", phone: "555-678-9012", startDate: "2022-08-19" },
  { id: "EMP-007", name: "Robert Taylor", position: "Financial Analyst", department: "Finance", email: "robert@example.com", phone: "555-789-0123", startDate: "2022-09-05" },
  { id: "EMP-008", name: "Lisa Anderson", position: "Marketing Specialist", department: "Marketing", email: "lisa@example.com", phone: "555-890-1234", startDate: "2022-10-12" },
  { id: "EMP-009", name: "James Thomas", position: "IT Support", department: "IT", email: "james@example.com", phone: "555-901-2345", startDate: "2022-11-30" },
  { id: "EMP-010", name: "Michelle Garcia", position: "Purchasing Agent", department: "Procurement", email: "michelle@example.com", phone: "555-012-3456", startDate: "2023-01-17" },
];

export default function Employees() {
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (employee: Employee) => {
    const updatedEmployees = employees.filter(e => e.id !== employee.id);
    setEmployees(updatedEmployees);
    toast({
      title: "Employee deleted",
      description: `${employee.name} has been removed from the employee list.`,
    });
  };

  const handleSave = (data: Record<string, any>) => {
    const updatedEmployees = employees.map((employee) =>
      employee.id === selectedEmployee?.id
        ? {
            ...employee,
            name: data.name,
            position: data.position,
            department: data.department,
            email: data.email,
            phone: data.phone,
            startDate: data.startDate
          }
        : employee
    );
    setEmployees(updatedEmployees);
    toast({
      title: "Employee updated",
      description: `${data.name} has been updated successfully.`,
    });
  };

  const handleAdd = (data: Record<string, any>) => {
    const newEmployee: Employee = {
      id: `EMP-${String(employees.length + 1).padStart(3, '0')}`,
      name: data.name,
      position: data.position,
      department: data.department,
      email: data.email,
      phone: data.phone,
      startDate: data.startDate
    };
    setEmployees([...employees, newEmployee]);
    toast({
      title: "Employee added",
      description: `${newEmployee.name} has been added to the employee list.`,
    });
  };

  // Generate department data for reports
  const getDepartmentData = () => {
    const departments: Record<string, number> = {};
    employees.forEach(employee => {
      if (departments[employee.department]) {
        departments[employee.department]++;
      } else {
        departments[employee.department] = 1;
      }
    });
    
    return Object.keys(departments).map(department => ({
      name: department,
      value: departments[department]
    }));
  };

  // Get employee hire dates by year/month for timeline chart
  const getHireDateData = () => {
    const hireData: Record<string, number> = {};
    employees.forEach(employee => {
      const yearMonth = employee.startDate.substring(0, 7); // YYYY-MM
      if (hireData[yearMonth]) {
        hireData[yearMonth]++;
      } else {
        hireData[yearMonth] = 1;
      }
    });
    
    return Object.keys(hireData).sort().map(date => ({
      date: date,
      count: hireData[date]
    }));
  };

  const COLORS = ["#8B5CF6", "#D946EF", "#F97316", "#0EA5E9", "#10B981", "#F59E0B", "#EF4444", "#6366F1"];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Employees</h1>
          <p className="text-gray-600 text-sm">Manage employee information</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-100"
            onClick={() => setIsReportOpen(true)}
          >
            <BarChart3 size={18} />
            <span>Reports</span>
          </Button>
          <Button 
            className="px-4 py-2 bg-purple-500 text-white rounded-md flex items-center hover:bg-purple-600 transition-colors"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus size={18} className="mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-medium text-lg">Employee List</h2>
        </div>
        <div className="p-4">
          <SearchBar 
            placeholder="Search employees..."
            onSearch={setSearchTerm}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 flex-shrink-0 mr-4 bg-purple-100 text-purple-600 rounded-full border border-purple-200 flex items-center justify-center">
                        {employee.name.charAt(0)}
                      </div>
                      <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.position}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.startDate}</td>
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
                        <DropdownMenuItem onClick={() => handleEdit(employee)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(employee)}>
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

      {selectedEmployee && (
        <EditDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSave={handleSave}
          title="Employee"
          fields={[
            { name: "name", label: "Name", type: "text", value: selectedEmployee.name },
            { name: "position", label: "Position", type: "text", value: selectedEmployee.position },
            { name: "department", label: "Department", type: "text", value: selectedEmployee.department },
            { name: "email", label: "Email", type: "email", value: selectedEmployee.email },
            { name: "phone", label: "Phone", type: "text", value: selectedEmployee.phone },
            { name: "startDate", label: "Start Date", type: "date", value: selectedEmployee.startDate },
          ]}
        />
      )}

      {isAddDialogOpen && (
        <AddDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onAdd={handleAdd}
          title="Employee"
          fields={[
            { name: "name", label: "Name", type: "text" },
            { name: "position", label: "Position", type: "text" },
            { name: "department", label: "Department", type: "text" },
            { name: "email", label: "Email", type: "email" },
            { name: "phone", label: "Phone", type: "text" },
            { name: "startDate", label: "Start Date", type: "date" },
          ]}
        />
      )}

      {/* Employee Reports Dialog */}
      <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Employee Reports</DialogTitle>
          </DialogHeader>
          
          <div className="mt-4 space-y-8">
            <div>
              <h3 className="font-medium text-lg mb-4">Employee Overview</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Total Employees</p>
                  <p className="text-2xl font-semibold">{employees.length}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Departments</p>
                  <p className="text-2xl font-semibold">{getDepartmentData().length}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Newest Employee</p>
                  <p className="text-2xl font-semibold">
                    {employees.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0]?.startDate}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-4">Employees by Department</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getDepartmentData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {getDepartmentData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Employee Hire Timeline</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getHireDateData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4">Department Breakdown</h3>
              <table className="min-w-full border border-gray-200 rounded-md">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Department</th>
                    <th className="px-4 py-2 text-left">Number of Employees</th>
                    <th className="px-4 py-2 text-left">% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {getDepartmentData().map((dept, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-2">{dept.name}</td>
                      <td className="px-4 py-2">{dept.value}</td>
                      <td className="px-4 py-2">{((dept.value / employees.length) * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsReportOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
