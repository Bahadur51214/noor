import Link from 'next/link';
import { productService } from '@/services/product.service';
import { Plus } from 'lucide-react';
import { requireAuth } from '@/lib/auth';

export default async function AdminProductsPage() {
  await requireAuth();
  const { products } = await productService.getAll({ status: null, limit: 100 });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-serif text-black">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-black text-white px-4 py-2 rounded-md text-sm flex items-center gap-2 hover:bg-gray-800 transition-colors"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse bg-white border border-gray-100 rounded-lg shadow-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500 bg-gray-50/50">
              <th className="p-4 font-medium">Product</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">Stock</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-medium flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden relative">
                    {product.images?.[0] && (
                      <img src={product.images[0].url} alt={product.name} className="object-cover w-full h-full" />
                    )}
                  </div>
                  {product.name}
                </td>
                <td className="p-4">Rs. {Number(product.salePrice ?? product.price).toLocaleString()}</td>
                <td className="p-4">{product.stock}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.status === 'ARCHIVED'
                      ? 'bg-gray-100 text-gray-600'
                      : product.status === 'DRAFT'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {product.status === 'ARCHIVED' ? 'Archived' : product.status === 'DRAFT' ? 'Draft' : 'Active'}
                  </span>
                </td>
                <td className="p-4">
                  <Link href={`/admin/products/${product.id}`} className="text-champagne hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
