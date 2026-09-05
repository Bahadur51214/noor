import { orderService } from '@/services/order.service';
import { OrderStatusUpdater } from "@/components/admin/orders/order-status-updater";
import { PaymentVerification } from "@/components/admin/orders/payment-verification";
import { format } from 'date-fns';
import { notFound } from 'next/navigation';
import { requireAuth } from '@/lib/auth';

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  PENDING_VERIFICATION: "Pending Verification",
  PAID: "Paid",
  REJECTED: "Rejected",
  FAILED: "Failed",
  REFUNDED: "Refunded",
};

const PAYMENT_BADGE_CLASSES: Record<string, string> = {
  PAID: "bg-emerald-100 text-emerald-700",
  PENDING_VERIFICATION: "bg-amber-100 text-amber-700",
  REJECTED: "bg-red-100 text-red-700",
  FAILED: "bg-red-100 text-red-700",
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  JAZZCASH: "JazzCash",
  EASYPAISA: "EasyPaisa",
  BANK_TRANSFER: "Bank Transfer",
  COD: "Cash on Delivery",
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireAuth();
  const order = await orderService.getById(id);

  if (!order) {
    notFound();
  }

  const payment = order.payments?.[0];

  return (
    <div className="p-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <div>
          <h1 className="text-2xl font-serif text-[#0D0D0D] mb-2">Order {order.orderNumber}</h1>
          <p className="text-gray-500 text-sm">Placed on {format(new Date(order.createdAt), 'MMMM d, yyyy h:mm a')}</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-[#E0DCD5] shadow-sm">
          <h2 className="text-lg font-serif mb-4 text-[#0D0D0D]">Items</h2>
          <div className="space-y-4">
            {order.orderItems?.map((item: any) => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-md" />
                  <div>
                    <p className="font-medium text-sm text-[#0D0D0D]">{item.productName || item.product?.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-medium text-[#0D0D0D]">Rs. {Number(item.total).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>Rs. {Number(order.subtotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Delivery Fee</span>
              <span>Rs. {Number(order.deliveryFee).toLocaleString()}</span>
            </div>
            {Number(order.discountAmount) > 0 && (
              <div className="flex justify-between text-[#C9A96E]">
                <span>Discount</span>
                <span>- Rs. {Number(order.discountAmount).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between font-medium text-lg text-[#0D0D0D] pt-2">
              <span>Total</span>
              <span>Rs. {Number(order.total).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border border-[#E0DCD5] shadow-sm">
          <h2 className="text-lg font-serif mb-4 text-[#0D0D0D]">Customer Details</h2>
          <div className="text-sm space-y-2 text-gray-700">
            <p><strong className="text-[#0D0D0D]">Name:</strong> {order.customerName}</p>
            {order.customerEmail && <p><strong className="text-[#0D0D0D]">Email:</strong> {order.customerEmail}</p>}
            <p><strong className="text-[#0D0D0D]">Phone:</strong> {order.customerPhone}</p>
            <p><strong className="text-[#0D0D0D]">Address:</strong> {order.address}, {order.area}, {order.city}</p>
            {order.landmark && <p><strong className="text-[#0D0D0D]">Landmark:</strong> {order.landmark}</p>}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-[#E0DCD5] shadow-sm">
          <h2 className="text-lg font-serif mb-4 text-[#0D0D0D]">Manage Order</h2>
          <div className="space-y-5">
            <div>
              <p className="text-sm font-medium mb-1 text-gray-500">Status</p>
              <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
            </div>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm font-medium mb-1 text-gray-500">Payment Status</p>
              <span
                className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  PAYMENT_BADGE_CLASSES[order.paymentStatus] ?? "bg-gray-100 text-gray-700"
                }`}
              >
                {PAYMENT_STATUS_LABELS[order.paymentStatus] ?? order.paymentStatus}
              </span>
            </div>

            <div>
              <p className="text-sm font-medium mb-1 text-gray-500">Payment Method</p>
              <p className="text-sm font-medium text-[#0D0D0D]">
                {PAYMENT_METHOD_LABELS[order.paymentMethod] ?? order.paymentMethod}
              </p>
            </div>

            {order.paymentMethod !== 'COD' && order.paymentStatus === 'PENDING_VERIFICATION' && payment && (
              <PaymentVerification payment={payment} orderId={order.id} />
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-[#E0DCD5] shadow-sm">
          <h2 className="text-lg font-serif mb-4 text-[#0D0D0D]">Order History</h2>
          <div className="space-y-4">
             {order.orderStatusHistories?.map((history: any) => (
               <div key={history.id} className="text-sm border-l-2 border-[#C9A96E] pl-3 pb-2">
                 <p className="font-medium text-[#0D0D0D]">{history.status}</p>
                 <p className="text-xs text-gray-500">{format(new Date(history.createdAt), 'MMM d, h:mm a')}</p>
                 {history.note && <p className="text-gray-600 mt-1">{history.note}</p>}
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}