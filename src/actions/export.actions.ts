"use server";

import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function exportOrdersAction({
  orderIds,
  filters,
}: {
  orderIds?: string[];
  filters?: {
    status?: string;
    paymentStatus?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    city?: string;
    courier?: string;
  };
}) {
  await requireAuth();

  let where: Prisma.OrderWhereInput = {};

  if (orderIds && orderIds.length > 0) {
    where = { id: { in: orderIds } };
  } else if (filters) {
    where = {
      ...(filters.status ? { status: filters.status as any } : {}),
      ...(filters.paymentStatus ? { paymentStatus: filters.paymentStatus as any } : {}),
      ...(filters.search ? { orderNumber: { contains: filters.search } } : {}),
      ...(filters.city ? { city: { contains: filters.city, mode: 'insensitive' } } : {}),
      ...(filters.courier ? { courier: { contains: filters.courier, mode: 'insensitive' } } : {}),
    };

    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) where.createdAt.gte = new Date(filters.dateFrom);
      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999);
        where.createdAt.lte = toDate;
      }
    }
  }

  const orders = await db.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      orderItems: true,
      payments: true,
    },
  });

  return orders.map((order) => {
    // Standardize to plain objects since we pass them back to the client
    return {
      ...order,
      subtotal: Number(order.subtotal),
      deliveryFee: Number(order.deliveryFee),
      discountAmount: Number(order.discountAmount),
      total: Number(order.total),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      orderItems: order.orderItems.map(item => ({
        ...item,
        price: Number(item.price),
        total: Number(item.total),
      })),
    };
  });
}
