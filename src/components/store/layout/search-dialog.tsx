"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchProductsAction } from "@/actions/store.actions";

type SearchResult = {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  image: string | null;
};

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      const { results } = await searchProductsAction(query);
      setResults(results);
      setSearched(true);
      setLoading(false);
    }, 350);
    return () => {
      clearTimeout(timer);
      setLoading(false);
    };
  }, [query, open]);

  const closeAndGo = (href: string) => {
    setOpen(false);
    setQuery("");
    setResults([]);
    setSearched(false);
    router.push(href);
  };

  const submitSearch = () => {
    if (!query.trim()) return;
    closeAndGo(`/shop?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="ghost"
        size="icon"
        className="inline-flex"
        onClick={() => setOpen(true)}
        aria-label="Search products"
      >
        <Search className="h-5 w-5" />
      </Button>
      <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden">
        <DialogTitle className="sr-only">Search products</DialogTitle>
        <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
          <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitSearch();
            }}
            placeholder="Search for watches, leather straps, gifts..."
            className="border-0 shadow-none focus-visible:ring-0 px-0 text-base"
          />
          {loading && <Loader2 className="h-4 w-4 animate-spin text-gray-400 flex-shrink-0" />}
          {query && (
            <Button variant="ghost" size="sm" onClick={() => setQuery("")} className="text-gray-400 flex-shrink-0">
              Clear
            </Button>
          )}
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {!query.trim() && (
            <p className="px-4 py-10 text-center text-sm text-gray-400">
              Type to search our collection.
            </p>
          )}

          {query.trim() && !loading && !searched && null}

          {query.trim() && results.length === 0 && (
            <p className="px-4 py-10 text-center text-sm text-gray-400">
              No products found for &quot;{query}&quot;
            </p>
          )}

          {results.map((product) => (
            <button
              key={product.id}
              onClick={() => closeAndGo(`/product/${product.slug}`)}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-md text-left hover:bg-[#F7F4EF] transition-colors"
            >
              <div className="w-12 h-12 relative rounded bg-white border border-gray-100 flex-shrink-0 overflow-hidden">
                {product.image ? (
                  <Image src={product.image} alt={product.name} fill sizes="48px" className="object-cover" />
                ) : null}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#0D0D0D] truncate">{product.name}</p>
              </div>
              <div className="text-sm flex-shrink-0">
                {product.salePrice ? (
                  <span className="flex items-center gap-2">
                    <span className="text-[#C9A96E] font-medium">Rs. {product.salePrice.toLocaleString()}</span>
                    <span className="text-xs text-gray-400 line-through">{product.price.toLocaleString()}</span>
                  </span>
                ) : (
                  <span className="font-medium">Rs. {product.price.toLocaleString()}</span>
                )}
              </div>
            </button>
          ))}
        </div>

        {query.trim() && (
          <div className="border-t border-gray-100 p-3">
            <Button
              onClick={submitSearch}
              variant="outline"
              className="w-full rounded-none border-[#0D0D0D] text-[#0D0D0D] hover:bg-[#0D0D0D] hover:text-white"
            >
              View all results for &quot;{query}&quot;
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}