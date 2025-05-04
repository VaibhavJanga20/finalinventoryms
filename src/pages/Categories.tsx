
import { useState } from "react";
import { SearchBar } from "../components/SearchBar";
import { Plus, SortAsc, SortDesc } from "lucide-react";
import { EditDialog } from "../components/EditDialog";
import { AddDialog } from "../components/AddDialog";
import { Button } from "@/components/ui/button";
import { ReportButton } from "../components/ReportButton";

type Category = {
  id: string;
  name: string;
  description: string;
  createdOn: string;
  items: number;
};

const initialCategories: Category[] = [
  { id: "CAT-001", name: "Electronics", description: "Electronic devices and accessories", createdOn: "2024-01-15", items: 150 },
  { id: "CAT-002", name: "Furniture", description: "Home and office furniture", createdOn: "2024-01-16", items: 75 },
  { id: "CAT-003", name: "Clothing", description: "Apparel and accessories", createdOn: "2024-01-17", items: 200 },
  { id: "CAT-004", name: "Books", description: "Books and publications", createdOn: "2024-01-18", items: 320 },
  { id: "CAT-005", name: "Sports", description: "Sports equipment and gear", createdOn: "2024-01-19", items: 100 },
  { id: "CAT-006", name: "Home Decor", description: "Decorative items for home", createdOn: "2024-01-20", items: 120 },
  { id: "CAT-007", name: "Toys", description: "Children's toys and games", createdOn: "2024-01-21", items: 180 },
  { id: "CAT-008", name: "Beauty", description: "Beauty and personal care products", createdOn: "2024-01-22", items: 90 },
  { id: "CAT-009", name: "Automotive", description: "Car parts and accessories", createdOn: "2024-01-23", items: 60 },
  { id: "CAT-010", name: "Garden", description: "Garden tools and supplies", createdOn: "2024-01-24", items: 85 },
];

export default function Categories() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [sortField, setSortField] = useState<'items' | 'createdOn'>('items');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (sortField === 'items') {
      return sortDirection === 'asc' ? a.items - b.items : b.items - a.items;
    } else {
      return sortDirection === 'asc' 
        ? new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime()
        : new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime();
    }
  });

  const handleSort = (field: 'items' | 'createdOn') => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc'); // Default to descending when changing field
    }
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsEditDialogOpen(true);
  };

  const handleSave = (data: Record<string, any>) => {
    const updatedCategories = categories.map((category) =>
      category.id === selectedCategory?.id
        ? {
            ...category,
            name: data.name,
            description: data.description,
            items: parseInt(data.items),
            createdOn: category.createdOn
          }
        : category
    );
    setCategories(updatedCategories);
  };

  const handleAdd = (data: Record<string, any>) => {
    const newCategory: Category = {
      id: `CAT-${String(categories.length + 1).padStart(3, '0')}`,
      name: data.name,
      description: data.description,
      items: parseInt(data.items),
      createdOn: new Date().toISOString().split('T')[0]
    };
    setCategories([...categories, newCategory]);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Categories</h1>
          <p className="text-gray-600 text-sm">Manage product categories</p>
        </div>
        <div className="flex space-x-3">
          <ReportButton title="Categories" type="categories" data={categories} />
          <Button 
            className="px-4 py-2 bg-purple-500 text-white rounded-md flex items-center hover:bg-purple-600 transition-colors"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus size={18} className="mr-2" />
            Add Category
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-medium text-lg">Category List</h2>
        </div>
        <div className="p-4">
          <SearchBar 
            placeholder="Search categories..."
            onSearch={setSearchTerm}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('createdOn')}>
                    <span>Created On</span>
                    {sortField === 'createdOn' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('items')}>
                    <span>Items</span>
                    {sortField === 'items' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 flex-shrink-0 mr-4 bg-purple-100 text-purple-600 rounded border border-purple-200 flex items-center justify-center">
                        {category.name.charAt(0)}
                      </div>
                      <div className="text-sm font-medium text-gray-900">{category.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{category.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.createdOn}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.items}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 text-center">
                    <Button
                      variant="ghost"
                      onClick={() => handleEdit(category)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCategory && (
        <EditDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSave={handleSave}
          title="Category"
          fields={[
            { name: "name", label: "Name", type: "text", value: selectedCategory.name },
            { name: "description", label: "Description", type: "text", value: selectedCategory.description },
            { name: "items", label: "Items", type: "number", value: selectedCategory.items },
          ]}
        />
      )}

      {isAddDialogOpen && (
        <AddDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onAdd={handleAdd}
          title="Category"
          fields={[
            { name: "name", label: "Name", type: "text" },
            { name: "description", label: "Description", type: "text" },
            { name: "items", label: "Items", type: "number" },
          ]}
        />
      )}
    </div>
  );
}
