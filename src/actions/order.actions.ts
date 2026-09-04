"use server";

import { requireAuth } from "@/lib/auth";
import { orderService } from "@/services/order.service";
import { paymentService } from "@/services/payment.service";
import { auditService } from "@/services/audit.service";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(
  orderId: string,
  status: string,
  note?: string
) {
  const session = await requireAuth();

  try {
    await orderService.updateStatus(
      orderId,
      status as Parameters<typeof orderService.updateStatus>[1],
      session.adminId,
      note
    );

    await auditService.log({
      adminId: session.adminId,
      action: "ORDER_STATUS_UPDATED",
      entityType: "Order",
      entityId: orderId,
      metadata: { status, note },
    });

    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/admin/orders");
    revalidatePath("/admin/dashboard");

    return { success: true };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to update status",
    };
  }
}

export async function verifyPayment(paymentId: string) {
  const session = await requireAuth();

  try {
    await paymentService.verify(paymentId, session.adminId);

    await auditService.log({
      adminId: session.adminId,
      action: "PAYMENT_VERIFIED",
      entityType: "Payment",
      entityId: paymentId,
    });

    revalidatePath("/admin/orders");
    revalidatePath("/admin/dashboard");

    return { success: true };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to verify payment",
    };
  }
}

export async function rejectPayment(paymentId: string, reason: string) {
  const session = await requireAuth();

  try {
    await paymentService.reject(paymentId, session.adminId, reason);

    await auditService.log({
      adminId: session.adminId,
      action: "PAYMENT_REJECTED",
      entityType: "Payment",
      entityId: paymentId,
      metadata: { reason },
    });

    revalidatePath("/admin/orders");
    revalidatePath("/admin/dashboard");

    return { success: true };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to reject payment",
    };
  }
}

export async function updateCourier(
  orderId: string,
  courier: string,
  trackingNumber: string,
  trackingUrl?: string
) {
  const session = await requireAuth();

  try {
    await orderService.updateCourier(
      orderId,
      courier,
      trackingNumber,
      trackingUrl
    );

    await auditService.log({
      adminId: session.adminId,
      action: "COURIER_UPDATED",
      entityType: "Order",
      entityId: orderId,
      metadata: { courier, trackingNumber, trackingUrl },
    });

    revalidatePath(`/admin/orders/${orderId}`);

    return { success: true };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to update courier info",
    };
  }
}

export async function cancelOrder(orderId: string, reason?: string) {
  const session = await requireAuth();

  try {
    await orderService.cancel(orderId, session.adminId, reason);

    await auditService.log({
      adminId: session.adminId,
      action: "ORDER_CANCELLED",
      entityType: "Order",
      entityId: orderId,
      metadata: { reason },
    });

    revalidatePath("/admin/orders");
    revalidatePath("/admin/dashboard");

    return { success: true };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to cancel order",
    };
  }
}
