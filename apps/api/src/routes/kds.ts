import { Router, Request, Response } from 'express';
import { prisma } from '../prisma';
import { sendSuccess, sendError } from '../utils/response';

const router = Router();

// Helper to access socket.io from app context
const getIo = (req: Request) => req.app.get('io');

/**
 * GET /api/v1/kds/orders
 * Fetch active kitchen queue grouped for KDS Kanban columns
 */
router.get('/orders', async (req: Request, res: Response) => {
  try {
    const { canteenId = 'campusbite-central-iitb' } = req.query;

    const canteen = await prisma.canteen.findFirst({
      where: { OR: [{ id: String(canteenId) }, { slug: String(canteenId) }] },
    });

    const orders = await prisma.order.findMany({
      where: {
        ...(canteen ? { canteenId: canteen.id } : {}),
        status: { in: ['PAID', 'ACCEPTED', 'PREPARING', 'READY'] },
      },
      include: {
        items: { include: { foodItem: true } },
        counter: true,
        student: { include: { user: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return sendSuccess(res, { orders });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
});

/**
 * PATCH /api/v1/kds/orders/:id/status
 * Kitchen staff advances order status (ACCEPTED -> PREPARING -> READY)
 */
router.patch('/orders/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['PAID', 'ACCEPTED', 'PREPARING', 'READY', 'PICKED_UP', 'COMPLETED', 'CANCELLED'];
    if (!allowedStatuses.includes(status)) {
      return sendError(res, `Invalid order status. Allowed: ${allowedStatuses.join(', ')}`, 400);
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: { include: { foodItem: true } },
        counter: true,
        canteen: true,
      },
    });

    // Broadcast live event to KDS and Student Order Tracker
    const io = getIo(req);
    if (io) {
      io.to(`order_${updatedOrder.id}`).emit('order.updated', updatedOrder);
      io.to(`kds_${updatedOrder.canteenId}`).emit('order.updated', updatedOrder);
    }

    return sendSuccess(res, {
      message: `Order status advanced to ${status}`,
      order: updatedOrder,
    });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
});

export default router;
