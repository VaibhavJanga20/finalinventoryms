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
import {
  BarChart, Bar, PieChart, Pie, 
  XAxis, YAxis, Tooltip, 
  ResponsiveContainer, Cell, Legend, CartesianGrid
} from "recharts";

type Employee = {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
};

const initialEmployees: Employee[] = [
  { id: "EMP-001", name: "John Smith", position: "Sales Manager", department: "Sales", email: "john.smith@example.com", phone: "123-456-7890" },
  { id: "EMP-002", name: "Emily Johnson", position: "Marketing Coordinator", department: "Marketing", email: "emily.johnson@example.com", phone: "987-654-3210" },
  { id: "EMP-003", name: "Michael Brown", position: "Software Engineer", department: "IT", email: "michael.brown@example.com", phone: "555-123-4567" },
  { id: "EMP-004", name: "Sarah Williams", position: "HR Specialist", department: "HR", email: "sarah.williams@example.com", phone: "111-222-3333" },
  { id: "EMP-005", name: "David Miller", position: "Accountant", department: "Finance", email: "david.miller@example.com", phone: "444-555-6666" },
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
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
            phone: data.phone
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
      phone: data.phone
    };
    setEmployees([...employees, newEmployee]);
    toast({
      title: "Employee added",
      description: `${newEmployee.name} has been added to the employee list.`,
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Employees</h1>
          <p className="text-gray-600 text-sm">Manage employee information</p>
        </div>
        <div className="flex space-x-3">
          <ReportButton title="Employees" type="employees" data={employees} />
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
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.position}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.phone}</td>
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
            { name: "phone", label: "Phone", type: "tel", value: selectedEmployee.phone },
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
            { name: "phone", label: "Phone", type: "tel" },
          ]}
        />
      )}

      {/* Employee Report Dialog */}
      {isReportOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-800">Employee Report</h3>
            <EmployeeReportContent />
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setIsReportOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Add the CartesianGrid report component for employee reports
const EmployeeReportContent = () => {
  // Sample data for demonstration
  const employeePerformanceData = [
    { month: "Jan", sales: 42, tasks: 38 },
    { month: "Feb", sales: 47, tasks: 42 },
    { month: "Mar", sales: 53, tasks: 45 },
    { month: "Apr", sales: 58, tasks: 48 },
    { month: "May", sales: 63, tasks: 52 },
    { month: "Jun", sales: 68, tasks: 55 },
  ];

  const departmentData = [
    { name: "Sales", value: 35 },
    { name: "Operations", value: 25 },
    { name: "Admin", value: 20 },
    { name: "Support", value: 15 },
    { name: "HR", value: 5 },
  ];

  const COLORS = ["#8B5CF6", "#D946EF", "#F97316", "#0EA5E9", "#10B981"];

  return (
    <div className="space-y-8 p-4">
      <div>
        <h2 className="text-xl font-semibold mb-4">Employee Performance Report</h2>
        <p className="text-gray-600 mb-6">For the period: January 1, 2025 - June 30, 2025</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-4">Employee Performance Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={employeePerformanceData}>
                <CartesianGrid />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" name="Sales Completed" fill="#8B5CF6" />
                <Bar dataKey="tasks" name="Tasks Completed" fill="#D946EF" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-4">Department Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {departmentData.map((entry, index) => (
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
};
