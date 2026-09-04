"use client";

import { useState } from "react";
import Image from "next/image";
import { adjustStockAction } from "@/actions/inventory.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { AlertCircle, CheckCircle2, ArrowDownCircle, Search } from "lucide-react";

export function InventoryClient({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [adjustType, setAdjustType] = useState<"ADD" | "REMOVE">("ADD");
  const [adjustQty, setAdjustQty] = useState<number>(0);
  const [adjustNote, setAdjustNote] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredProducts = products.filter(
    (p) => 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const openAdjustModal = (product: any) => {
    setSelectedProduct(product);
    setAdjustType("ADD");
    setAdjustQty(0);
    setAdjustNote("");
    setModalOpen(true);
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || adjustQty <= 0) return;

    setLoading(true);
    const quantityChange = adjustType === "ADD" ? adjustQty : -adjustQty;

    const result = await adjustStockAction({
      productId: selectedProduct.id,
      quantity: quantityChange,
      type: adjustType === "ADD" ? "RESTOCK" : "MANUAL_ADJUSTMENT",
      note: adjustNote,
    });

    if (result.success) {
      toast.success("Stock updated successfully");
      
      // Optimistic UI update
      setProducts(products.map(p => 
        p.id === selectedProduct.id 
          ? { ...p, stock: p.stock + quantityChange }
          : p
      ));
      
      setModalOpen(false);
    } else if ("error" in result) {
      toast.error(result.error || "Failed to adjust stock");
    } else {
      toast.error("Failed to adjust stock");
    }
    setLoading(false);
  };

  const getStockStatus = (stock: number, threshold: number) => {
    if (stock <= 0) return { label: "Out of Stock", color: "text-red-600 bg-red-50 border-red-200", icon: AlertCircle };
    if (stock <= threshold) return { label: "Low Stock", color: "text-orange-600 bg-orange-50 border-orange-200", icon: ArrowDownCircle };
    return { label: "In Stock", color: "text-green-600 bg-green-50 border-green-200", icon: CheckCircle2 };
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white p-4 rounded-md border border-[#E0DCD5] flex items-center justify-between">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Search by Name or SKU..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-md border border-[#E0DCD5] overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-[#E0DCD5] text-gray-500 bg-gray-50">
              <th className="p-4 font-medium w-16">Item</th>
              <th className="p-4 font-medium">Product Name / SKU</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Current Stock</th>
              <th className="p-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => {
              const status = getStockStatus(p.stock, p.lowStockThreshold);
              const StatusIcon = status.icon;
              
              return (
                <tr key={p.id} className="border-b border-[#E0DCD5] hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="w-10 h-10 relative bg-gray-100 rounded border overflow-hidden">
                      {p.images?.[0]?.url ? (
                        <Image src={p.images[0].url} alt={p.name} fill className="object-cover" />
                      ) : (
                        <span className="text-[10px] text-gray-400 absolute inset-0 flex items-center justify-center">No Img</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-[#0D0D0D]">{p.name}</div>
                    <div className="text-xs text-gray-500">{p.sku}</div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="font-medium text-base">{p.stock}</div>
                    <div className="text-[10px] text-gray-400">Min: {p.lowStockThreshold}</div>
                  </td>
                  <td className="p-4 text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openAdjustModal(p)}
                    >
                      Adjust Stock
                    </Button>
                  </td>
                </tr>
              );
            })}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Adjustment Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Inventory</DialogTitle>
          </DialogHeader>
          
          {selectedProduct && (
            <form onSubmit={handleAdjustSubmit} className="space-y-4 py-4">
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-md border mb-4">
                <div className="w-12 h-12 relative bg-white rounded border overflow-hidden">
                  {selectedProduct.images?.[0]?.url && (
                    <Image src={selectedProduct.images[0].url} alt={selectedProduct.name} fill className="object-cover" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-sm">{selectedProduct.name}</div>
                  <div className="text-xs text-gray-500">Current Stock: <strong className="text-black">{selectedProduct.stock}</strong></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Action</Label>
                  <select 
                    className="w-full border rounded-md p-2 mt-1 text-sm bg-white"
                    value={adjustType}
                    onChange={(e) => setAdjustType(e.target.value as any)}
                  >
                    <option value="ADD">Add Stock (+)</option>
                    <option value="REMOVE">Remove Stock (-)</option>
                  </select>
                </div>
                <div>
                  <Label>Quantity</Label>
                  <Input 
                    type="number" 
                    min="1"
                    required
                    className="mt-1"
                    value={adjustQty || ""}
                    onChange={(e) => setAdjustQty(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              <div>
                <Label>Note / Reason (Optional)</Label>
                <Input 
                  className="mt-1"
                  placeholder="e.g. New shipment arrived"
                  value={adjustNote}
                  onChange={(e) => setAdjustNote(e.target.value)}
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading || adjustQty <= 0} className="bg-black text-white">
                  {loading ? "Updating..." : "Confirm Adjustment"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
