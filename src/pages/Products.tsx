
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

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
};

const initialProducts: Product[] = [
  { id: "PRD-001", name: "Wireless Headphones", category: "Electronics", price: 99.99, stock: 45 },
  { id: "PRD-002", name: "Office Chair", category: "Furniture", price: 199.95, stock: 12 },
  { id: "PRD-003", name: "Cotton T-shirt", category: "Clothing", price: 19.99, stock: 200 },
  { id: "PRD-004", name: "Smartphone", category: "Electronics", price: 699.99, stock: 28 },
  { id: "PRD-005", name: "Coffee Table", category: "Furniture", price: 149.95, stock: 8 },
  { id: "PRD-006", name: "Denim Jeans", category: "Clothing", price: 39.99, stock: 150 },
  { id: "PRD-007", name: "Bluetooth Speaker", category: "Electronics", price: 79.99, stock: 35 },
  { id: "PRD-008", name: "Bookshelf", category: "Furniture", price: 89.95, stock: 15 },
  { id: "PRD-009", name: "Hooded Sweatshirt", category: "Clothing", price: 49.99, stock: 80 },
  { id: "PRD-010", name: "Tablet", category: "Electronics", price: 349.99, stock: 18 },
  { id: "PRD-011", name: "Desk", category: "Furniture", price: 179.95, stock: 10 },
  { id: "PRD-012", name: "Running Shoes", category: "Clothing", price: 89.99, stock: 60 },
  { id: "PRD-013", name: "Smart Watch", category: "Electronics", price: 199.99, stock: 25 },
  { id: "PRD-014", name: "Dining Chair Set", category: "Furniture", price: 399.95, stock: 6 },
  { id: "PRD-015", name: "Winter Jacket", category: "Clothing", price: 129.99, stock: 40 },
];

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (product: Product) => {
    const updatedProducts = products.filter(p => p.id !== product.id);
    setProducts(updatedProducts);
    toast({
      title: "Product deleted",
      description: `${product.name} has been removed from the inventory.`,
    });
  };

  const handleSave = (data: Record<string, any>) => {
    const updatedProducts = products.map((product) =>
      product.id === selectedProduct?.id
        ? {
            ...product,
            name: data.name,
            category: data.category,
            price: parseFloat(data.price),
            stock: parseInt(data.stock)
          }
        : product
    );
    setProducts(updatedProducts);
    toast({
      title: "Product updated",
      description: `${data.name} has been updated successfully.`,
    });
  };

  const handleAdd = (data: Record<string, any>) => {
    const newProduct: Product = {
      id: `PRD-${String(products.length + 1).padStart(3, '0')}`,
      name: data.name,
      category: data.category,
      price: parseFloat(data.price),
      stock: parseInt(data.stock)
    };
    setProducts([...products, newProduct]);
    toast({
      title: "Product added",
      description: `${newProduct.name} has been added to the inventory.`,
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Products</h1>
          <p className="text-gray-600 text-sm">Manage product inventory</p>
        </div>
        <div className="flex space-x-3">
          <ReportButton title="Products" type="products" data={products} />
          <Button 
            className="px-4 py-2 bg-purple-500 text-white rounded-md flex items-center hover:bg-purple-600 transition-colors"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus size={18} className="mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-medium text-lg">Product List</h2>
        </div>
        <div className="p-4">
          <SearchBar 
            placeholder="Search products..."
            onSearch={setSearchTerm}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{product.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{product.stock}</td>
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
                        <DropdownMenuItem onClick={() => handleEdit(product)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(product)}>
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

      {selectedProduct && (
        <EditDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSave={handleSave}
          title="Product"
          fields={[
            { name: "name", label: "Name", type: "text", value: selectedProduct.name },
            { name: "category", label: "Category", type: "text", value: selectedProduct.category },
            { name: "price", label: "Price", type: "number", value: selectedProduct.price },
            { name: "stock", label: "Stock", type: "number", value: selectedProduct.stock },
          ]}
        />
      )}

      {isAddDialogOpen && (
        <AddDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onAdd={handleAdd}
          title="Product"
          fields={[
            { name: "name", label: "Name", type: "text" },
            { name: "category", label: "Category", type: "text" },
            { name: "price", label: "Price", type: "number" },
            { name: "stock", label: "Stock", type: "number" },
          ]}
        />
      )}
    </div>
  );
}
