"use client";

import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";

export function CartDrawer() {
  const { isOpen, closeCart, items, removeItem, updateQuantity, getSubtotal } = useCart();

  const subtotal = getSubtotal();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-2xl font-serif">Your Cart</SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto py-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium">Your cart is empty</p>
              <Button onClick={closeCart} asChild>
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-4">
                  <div className="relative h-24 w-24 rounded-md overflow-hidden bg-gray-100 shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-sm">{item.name}</h3>
                      </div>
                      <p className="font-medium text-sm">Rs. {(item.salePrice ?? item.price).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border rounded-md">
                        <button
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="px-2 py-1 text-sm hover:bg-gray-100"
                          onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                        >
                          -
                        </button>
                        <span className="px-2 text-sm">{item.quantity}</span>
                        <button
                          aria-label={`Increase quantity of ${item.name}`}
                          className="px-2 py-1 text-sm hover:bg-gray-100"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        aria-label={`Remove ${item.name} from cart`}
                        className="text-sm text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t pt-6 space-y-4">
            <div className="flex justify-between text-lg font-medium">
              <span>Subtotal</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Shipping and taxes calculated at checkout.
            </p>
            <Button className="w-full bg-[#0D0D0D] hover:bg-black text-white" size="lg" asChild>
              <Link href="/checkout" onClick={closeCart}>
                Proceed to Checkout
              </Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
