import { Order, ServiceStatus, UserRole } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { UserInstance } from "../../../constant";

const generateOrder = async (payload: Order): Promise<any> => {
    if (payload) {
        payload.totalAmount = ((payload?.hardware || 0) + (payload?.hardware || 0) + (payload?.technician_bill || 0))
    }
    if (payload.totalAmount) {
        payload.tax = (payload.totalAmount * 15) / 100
    }
    await prisma.$transaction(async (tx) => {
        await tx.service.update({
            where: {
                id: payload.serviceId
            },
            data: {
                status: ServiceStatus.payment_pending
            }
        })
        const result = await tx.order.create({
            data: payload
        })
        return result;
    })
}

const orders = async (user: any): Promise<Order[] | null> => {
    if (user.role === UserRole.customer) {
        const result = await prisma.order.findMany({
            where: {
                service: {
                    userId: user.id
                }
            }
        });
        return result;
    }
    else {
        const result = await prisma.order.findMany({});
        return result;
    }
}

const order = async (id: string): Promise<Order | null> => {
    const result = await prisma.order.findUnique({
        where: { id },
    });
    return result;
}

const deleteOrder = async (id: string): Promise<Order | null> => {
    const result = await prisma.order.delete({
        where: { id }
    });
    return result;
}

const updateOrder = async (id: string, payload: Partial<Order>): Promise<Order | null> => {
    const result = await prisma.order.update({
        where: { id },
        data: payload
    });
    return result;
}
export const OrdersServices = {
    generateOrder,
    order,
    orders,
    deleteOrder,
    updateOrder
}